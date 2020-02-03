import initial from '../initials/credentials'

export default (state=initial, action) => {
  if(action.type === 'HAVE_CREDENTIALS') return true
  if(action.type === 'DO_NOT_HAVE_CREDENTIALS') return false

  return state
}
