import {AsyncStorage} from 'react-native'

import {differenceInDays, differenceInMinutes, addDays, isEqual, startOfDay} from 'date-fns'

import queryServer from './queryServer'

const hydrateJSON = (key, value) => typeof value === "string" && /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/.test(value)
                                    ? new Date(value)
                                    : value

export default class API {
  constructor(){
    // await AsyncStorage.setItem('@MySuperStore:key', 'I like to save it.')
    this.store = []
    this.initialised = false
    this.init()
  }

  async init(){
    if(this.initialised) return
    const previousData = await AsyncStorage.getItem('temporalAPI')

    if(previousData) this.store = JSON.parse(previousData, hydrateJSON)
    this.initialised = true
  }

  async save() {
    return AsyncStorage.setItem('temporalAPI', JSON.stringify(this.store))
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
    await this.init()

    const normalisedStart = startOfDay(start), normalisedEnd = startOfDay(end)

    const {result} = this.storeFulfillQuery({start: normalisedStart, end: normalisedEnd})

    if(result) return result

    const numberOfRequestsNeeded = Math.ceil((differenceInDays(end, start) + 1) / 28)
    const completedQueries = await Promise.all(Array.from({length: numberOfRequestsNeeded}, (_, i) => {
        const startDate = addDays(normalisedStart, i * 28)

        return queryServer({date: startDate})
    }))

    completedQueries.forEach(query => this.incorporateServerResponse(query))

    this.save()

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
