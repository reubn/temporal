import {combineReducers} from 'redux'

import days from './days'
import selectedDay from './selectedDay'

const reducers = {
  days,
  selectedDay
}

export default combineReducers(reducers)
