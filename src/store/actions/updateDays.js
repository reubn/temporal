import {differenceInMinutes, fromUnixTime} from 'date-fns'
import queryServer from '../../api/queryServer'

export default async (dispatch, {day, start=day, end=start, timestamp=fromUnixTime(0), force}) => {
  const now = new Date()
  const needToQueryServer = force || differenceInMinutes(now, timestamp) >= 10

  console.log('last fetch difference', differenceInMinutes(now, timestamp), timestamp)

  if(!needToQueryServer) return
  // console.log('needToQueryServer', needToQueryServer, timestamp, start, end)

  const days = await queryServer({start, end})

  dispatch({type: 'CACHE_DAYS', days})
}
