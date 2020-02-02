import {createStore} from 'redux'

import reducers from './reducers'
import initials from './initials'
import middleware from './middleware'
import initialisePersistence from './persistence'

const store = createStore(reducers, initials, middleware)

initialisePersistence(store)

export default store
