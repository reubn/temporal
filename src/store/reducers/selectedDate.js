import initial from '../initials/events'

export default (state=initial, action) => {
  if(action.type === 'SELECT_DATE') return action.date

  return state
}
