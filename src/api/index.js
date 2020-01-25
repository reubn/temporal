import {differenceInDays, differenceInMinutes, addDays, isEqual, startOfDay} from 'date-fns'

import queryServer from './getData'

export default class API {
  constructor(){
    this.store = []
  }

  incorporateServerResponse(queryResponse){
    return queryResponse.map(entry => {
      const [preexistingEntry, preexistingIndex] = this.getDateFromStore({date: entry.date})
      if(!preexistingEntry) this.store.push(entry)
      else this.store[preexistingIndex] = entry

      return entry
    })
  }

  async query({date, start=date, end=start}){
    const normalisedStart = startOfDay(start), normalisedEnd = startOfDay(end)

    const {result} = this.storeFulfillQuery({start: normalisedStart, end: normalisedEnd})

    if(result) return result

    const numberOfRequestsNeeded = Math.ceil((differenceInDays(end, start) + 1) / 28)
    const completedQueries = await Promise.all(Array.from({length: numberOfRequestsNeeded}, (_, i) => {
        const startDate = addDays(normalisedStart, i * 28)

        return queryServer({date: startDate})
    }))

    completedQueries.forEach(query => this.incorporateServerResponse(query))

    return this.storeFulfillQuery({start: normalisedStart, end: normalisedEnd}).result
  }

  storeFulfillQuery({start, end}) {
    const daysBetweenIncludingEnd = differenceInDays(end, start) + 1

    const results = Array.from({length: daysBetweenIncludingEnd}, (_, i) => {
      const date = addDays(start, i)

      const [storeEntry] = this.getDateFromStore(({date}))
      if(!storeEntry) return false

      const entryValid = this.isStoreEntryValid({entry: storeEntry})

      return entryValid ? storeEntry : false
    })

    const storeHasValidEntriesForAllDays = results.every(r => r)

    return {
      success: storeHasValidEntriesForAllDays,
      result: storeHasValidEntriesForAllDays ? results : undefined
    }
  }

  getDateFromStore({date}){
    const search = this.store.findIndex(({date: d}) => isEqual(date, d))

    return [search > -1 ? this.store[search] : undefined, search]
  }

  isStoreEntryValid({entry: {timestamp}}){
    return differenceInMinutes(new Date(), timestamp) <= 5
  }
}
