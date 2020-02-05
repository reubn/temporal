import initial from '../initials/loading'

export default (state=initial, action) => {
  if(action.type === 'LOADING_START') return true
  if(action.type === 'LOADING_STOP') return false

  return state
}
