import {differenceInSeconds} from 'date-fns'

import initial from '../initials/buildings'
import {rehydrateActionType} from '../persistence'

export default (state=initial, action) => {
  if(action.type === 'CACHE_BUILDINGS') return [...new Map([...state, ...action.buildings].map(building => [building.buildingCode, building]))].map(([_, building]) => building)

  if(action.type === 'CLEAR_CACHES') return initial

  if(action.type === rehydrateActionType) return action.data.buildings

  return state
}
