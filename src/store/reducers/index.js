import {combineReducers} from 'redux'

import days from './days'
import selectedDay from './selectedDay'
import loading from './loading'
import credentials from './credentials'

const reducers = {
  days,
  selectedDay,
  loading,
  credentials
}

export default combineReducers(reducers)
