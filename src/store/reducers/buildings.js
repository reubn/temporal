import {differenceInSeconds} from 'date-fns'

import initial from '../initials/buildings'
import {rehydrateActionType} from '../persistence'

export default (state=initial, action) => {
  if(action.type === 'CACHE_BUILDINGS'){
    const {buildings} = action

    const mutableState = state

    buildings.forEach(building => {
      const {buildingCode, timestamp} = building
      const search = mutableState.findIndex(({buildingCode: bC}) => bC === buildingCode)

      if(search < 0) return mutableState.push(building)

      const {timestamp: previousTimestamp} = mutableState[search]
      if(differenceInSeconds(timestamp, previousTimestamp) >= 0) mutableState[search] = building
    })

    mutableState.cacheKey = Math.random()

    return mutableState
  }

  if(action.type === 'CLEAR_CACHES') return initial

  if(action.type === rehydrateActionType) return action.data.buildings

  return state
}
