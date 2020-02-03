import {combineReducers} from 'redux'

import days from './days'
import selectedDay from './selectedDay'
import credentials from './credentials'

const reducers = {
  days,
  selectedDay,
  credentials
}

export default combineReducers(reducers)
