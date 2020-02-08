import {differenceInMinutes, fromUnixTime} from 'date-fns'
import queryServerBuilding from '../../api/queryServerBuilding'

export default async (dispatch, {buildingCode}) => {
  dispatch({type: 'LOADING_START'})
  const building = await queryServerBuilding({buildingCode})

  dispatch({type: 'CACHE_BUILDINGS', buildings: [building]})
  dispatch({type: 'LOADING_STOP'})
}
