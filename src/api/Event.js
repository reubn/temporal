export default class Event {
  constructor({start, end, id, category, title='', code, location}){
    this.event = 'event'

    this.start = start
    this.end = end
    this.id = id
    this.category = category
    this.title = title
    this.code = code

    this.location = location
  }
}
