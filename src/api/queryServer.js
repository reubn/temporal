import {parseISO, format, isEqual, startOfDay} from 'date-fns'

import {eventCategories, defaultCategory} from '../config'

import login from './login'
import Event from './Event'

const makeRequest = async ({start, end}) => {
  console.log('fetching 28days')

  return fetch(`https://timetables.liverpool.ac.uk/services/get-events?start=${format(start, 'yyyy-MM-dd')}&end=${format(end, 'yyyy-MM-dd')}`, {
    "method": "GET",
    "headers": {
      "User-Agent": "Mozilla/5.0 (Macintosh Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4033.2 Safari/537.36",
      "Referer": "https://timetables.liverpool.ac.uk/",
      "dnt": "1"
    }
  })
}

export default async ({start=new Date(), end=new Date()}={}) => {
  let response = await makeRequest({start, end})

  if(response.url.includes('account') || !response.ok){
    await login()
    response = await makeRequest({start, end})
  }

  const rawEvents = await response.json()

  return rawEvents.map(({start, end, activitydesc: code='', activityid: id, activitytype:type='', locationdesc=''}) => {
    const {category} = eventCategories.sort(({type: a}, {type: b}) => a && b ? 0 : a && !b ? -1 : 1).reduce((bestMatch, category) => (category.hasOwnProperty('searchString') && (code.includes(category.searchString)) || (category.hasOwnProperty('type') && type === category.type)) ? category : bestMatch, defaultCategory)

    return new Event({
      start: parseISO(start),
      end: parseISO(end),
      id,
      category,
      code,
      location: locationdesc.replace(/\<.+?\>/g, ''),
      timestamp: new Date()
    })
  })
}
