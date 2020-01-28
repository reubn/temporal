import {applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'
import {logger} from 'redux-logger'

export default compose(
  applyMiddleware(thunk, logger)
)
