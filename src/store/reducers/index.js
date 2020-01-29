import {combineReducers} from 'redux'

import events from './events'
import selectedDate from './selectedDate'

const reducers = {
  events,
  selectedDate
}

export default combineReducers(reducers)
