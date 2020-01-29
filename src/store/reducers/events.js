import initial from '../initials/events'

export default (state=initial, action) => {
  if(action.type === 'CACHE_EVENTS'){
    const {events} = action

    const newEvents = events.filter(event => {
      const {id} = event

      const search = state.findIndex(({id: _id}) => id === _id)
      if(search > -1) {
        state[search] = event

        return false
      }

      return true
    })

    return [...state, ...newEvents]
  }

  return state
}
