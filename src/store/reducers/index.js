import {combineReducers} from 'redux'

import days from './days'
import buildings from './buildings'
import selectedDay from './selectedDay'
import loading from './loading'
import credentials from './credentials'

const reducers = {
  days,
  buildings,
  selectedDay,
  loading,
  credentials
}

export default combineReducers(reducers)
