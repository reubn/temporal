import queryServer from '../../../api/queryServer'

export default async (dispatch, getState, {date, start=date, end=start, force}) => {
  // TODO: Find oldest timestamp in store, if newer than X min, return
  const events = await queryServer({start, end})

  dispatch({type: 'CACHE_EVENTS', events})
}
