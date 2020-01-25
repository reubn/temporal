import {parse, format, isEqual} from 'date-fns'

import {eventCategories, defaultCategory} from '../config'

import login from './login'
import mockResponse from './mockResponse'

const makeRequest = async date => {
  console.log('fetching 28days')
  return fetch(`https://timetables.liv.ac.uk/Home/Next28Days?date=${format(date, 'ddMMyyyy')}`, {
    "method": "GET",
    "headers": {
      "User-Agent": "Mozilla/5.0 (Macintosh Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4033.2 Safari/537.36",
      "Referer": "https://timetables.liv.ac.uk/Home/Today",
      "dnt": "1"
    },

  })
  // {url: 'good', ok: true, text: () => mockResponse}
}

export default async ({date=new Date()}={}) => {
  let response = await makeRequest(date)

  if(response.url.includes('Login') || !response.ok){
    await login()
    response = await makeRequest(date)
  }

  const html = await response.text()

  const events = Array.from(html.matchAll(/\<a href="Details\?event=(?<id>.+?)\"[^]+?\<h2\>(?<code>.+?)\<\/h2\>[^]+?\<p\>(?<dateString>[^]+?)\<br\>(?<time>[^]+?)\<\/p\>/g), ({groups: {dateString, id, code, time}}) => {
    const date = parse(dateString.trim().replace(/<.+?>/g, ''), 'EEEE, dd LLLL yyyy', new Date())
    const [start, end] = time.trim().split(' - ').map(string => parse(string, 'HH:mm', date))

    const {category} = eventCategories.reduce((bestMatch, category) => code.includes(category.searchString) ? category : bestMatch, defaultCategory)

    return {
      elaborate: false,
      date,
      start,
      end,
      id,
      category,
      title: '',//titles[Math.floor(Math.random() * (titles.length - 1))],
      code
    }
  })


  const days = events.reduce((bins, event) => {
    const search = bins.findIndex(({date: d}) => isEqual(event.date, d))

    if(search > -1) bins[search].events.push(event)
    else bins.push({
      date: event.date,
      timestamp: new Date(),
      events: [event]
    })
    return bins
  }, [])

  return days
}
