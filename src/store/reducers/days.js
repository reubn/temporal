import initial from '../initials/days'
import {rehydrateActionType} from '../persistence'

export default (state=initial, action) => {
  if(action.type === 'CACHE_DAYS') return [...new Map([...state, ...action.days].map(day => [day.dayString, day]))].map(([_, day]) => day)

  if(action.type === 'CLEAR_CACHES') return initial

  if(action.type === rehydrateActionType) return action.data.days

  return state
}
