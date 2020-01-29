import {differenceInMinutes} from 'date-fns'
import queryServer from '../../api/queryServer'

export default async (dispatch, {date, start=date, end=start, events: currentEvents=[], force}) => {
  // TODO: Find oldest timestamp in store, if newer than X min, return
  const now = new Date()
  const needToQueryServer = currentEvents.length === 0 || currentEvents.some(({timestamp}) => differenceInMinutes(now, timestamp) >= 5)

  // console.log('needToQueryServer', start, end)
  if(!needToQueryServer) return

  const events = await queryServer({start, end})

  dispatch({type: 'CACHE_EVENTS', events})
}
