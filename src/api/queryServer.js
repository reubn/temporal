import {parseISO, format, isEqual, startOfDay, eachDayOfInterval, min, max} from 'date-fns'

import {eventCategories, defaultCategory, locationFinder} from '../config'

import login from './login'

const makeRequest = async ({start, end}) => {
  console.log('fetching 28days', format(start, 'yyyy-MM-dd'), format(end, 'yyyy-MM-dd'))

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

  const events = rawEvents.map(({start, end, activitydesc: code='', activityid: id, activitytype:type='', locationdesc='', locations=[{}]}) => {
    const {category} = eventCategories.sort(({type: a}, {type: b}) => a && b ? 0 : a && !b ? -1 : 1).reduce((bestMatch, category) => (category.hasOwnProperty('searchString') && (code.includes(category.searchString)) || (category.hasOwnProperty('type') && type === category.type)) ? category : bestMatch, defaultCategory)

    const startDate = parseISO(start)

    return {
      day: startOfDay(startDate),
      start: startDate,
      end: parseISO(end),
      id,
      category,
      code,
      location: locations.length
      ? {
        description: locationdesc.replace(/\<.+?\>/g, '')
                      .replace(/-/g, ',')
                      .trim()
                      .split(',')
                      .filter(a => a && !a.includes('Floor')).map(a => a.replace(/([a-zA-Z])(\w*)/g, (_, l, rest) => `${l.toUpperCase()}${rest}`).trim()).reverse().join('\n'),
        buildingCode: (locations[0].BuildingCode) || undefined
      }
      : locationFinder({code, category})
    }
  })

  const daysReturned = events.map(({day}) => day)
  const earliestDayReturned = min(daysReturned)
  const latestDayReturned = max(daysReturned)

  const days = eachDayOfInterval({start: earliestDayReturned, end: latestDayReturned}).map(day => ({
    day,
    dayString: format(day, 'yyyy-MM-dd'),
    events: [],
    timestamp: new Date()
  }))

  // console.log(eachDayOfInterval({start: earliestDayReturned, end: latestDayReturned}))

  events.forEach(event => {
    const search = days.findIndex(({day}) => isEqual(day, event.day))

    if(search < 0) return console.log('WARNING WARNING EVENT OUTSIDE OF DATES')

    days[search].events.push(event)
  })

  // console.log(days.find(({day}) => isEqual(day, parseISO('2020-05-28'))))

  return days
}
