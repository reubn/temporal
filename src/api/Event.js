import {startOfDay} from 'date-fns'

export default class Event {
  constructor({start, end, id, category, title='', code, location}){
    this.event = 'event'


    this.date = startOfDay(start)
    this.start = start
    this.end = end
    this.id = id
    this.category = category
    this.title = title
    this.code = code

    this.location = location
  }
}
