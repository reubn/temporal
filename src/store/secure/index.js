import * as SecureStore from 'expo-secure-store'

import store from '../'
const {dispatch} = store

const secureStoreCredentialsKey = 'temporalPersistSecureStoreCredentialsKey'

export const getCredentials = async () => {
  const json = await SecureStore.getItemAsync(secureStoreCredentialsKey)

  if(!json){
    dispatch({type: 'DO_NOT_HAVE_CREDENTIALS'})

    return false
  }

  dispatch({type: 'HAVE_CREDENTIALS'})

  return JSON.parse(json)
}

export const haveCredentials = async () => {
  const json = await SecureStore.getItemAsync(secureStoreCredentialsKey)

  if(!json){
    dispatch({type: 'DO_NOT_HAVE_CREDENTIALS'})

    return false
  }

  dispatch({type: 'HAVE_CREDENTIALS'})

  return true
}

export const setCredentials = async credentials => {
  const json = JSON.stringify(credentials)

  await SecureStore.setItemAsync(secureStoreCredentialsKey, json)
  dispatch({type: 'HAVE_CREDENTIALS'})

  return true
}

export const clearCredentials = async () => {
  await SecureStore.deleteItemAsync(secureStoreCredentialsKey).catch(() => true)
  dispatch({type: 'DO_NOT_HAVE_CREDENTIALS'})

  return true
}
