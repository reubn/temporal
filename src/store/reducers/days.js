import {isEqual, differenceInSeconds} from 'date-fns'

import initial from '../initials/days'
import {rehydrateActionType} from '../persistence'

export default (state=initial, action) => {
  if(action.type === 'CACHE_DAYS'){
    const {days} = action

    const mutableState = state

    days.forEach(day => {
      const {day: date, timestamp} = day
      const search = mutableState.findIndex(({day: d}) => isEqual(d, date))

      if(search < 0) return mutableState.push(day)

      const {timestamp: previousTimestamp} = mutableState[search]
      if(differenceInSeconds(timestamp, previousTimestamp) >= 0) mutableState[search] = day
    })

    mutableState.cacheKey = Math.random()

    return mutableState
  }

  if(action.type === rehydrateActionType) return action.data.days

  return state
}
