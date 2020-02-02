import initial from '../initials/selectedDay'

export default (state=initial, action) => {
  if(action.type === 'SELECT_DAY') return action.day

  return state
}
