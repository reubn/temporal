import {AsyncStorage} from 'react-native'
import {parseJSON} from 'date-fns'

export const rehydrateActionType = Symbol('REHYDRATE')
const storageKey = 'temporalPersist'

const isDateString = value => /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/.test(value)
const hydrateJSON = (key, value) => {
  if(typeof value === 'string' && ['start', 'end', 'day', 'timestamp'].includes(key) && isDateString(value)) return parseJSON(value)
  else return value
}

export default async ({getState, dispatch, subscribe}) => {
  // await AsyncStorage.clear()
  
  // rehydrate store
  try {
    const json = await AsyncStorage.getItem(storageKey)
    if(json !== null) dispatch({type: rehydrateActionType, data: JSON.parse(json, hydrateJSON), c: console.log('REHYDRATE')})
  } catch(error) {}

  // persist changes

  subscribe(() => {
    const state = getState()
    const json = JSON.stringify(state)
    console.log('STORING')
    AsyncStorage.setItem(storageKey, json)
  })
}
