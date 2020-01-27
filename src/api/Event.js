import roomQuery from './roomQuery'


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

  get isElaborate(){
    return !!this.location
  }

  async elaborate(){
    if(this.isElaborate) return this

    this.location = await roomQuery(this)

    return this
  }
}
