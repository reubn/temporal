import {parse} from 'date-fns'

import RCTNetworking from 'react-native/Libraries/Network/RCTNetworking'

import {eventCategories, defaultCategory} from '../config'
import {username, password} from './secrets'
import mockResponse from './mockResponse'

export const login = async () => {
  RCTNetworking.clearCookies(() => {})

  const formData = new URLSearchParams()
  formData.append('username', username)
  formData.append('password', password)
  formData.append('action', 'login')
  formData.append('submit', 'Continue')

  await fetch("https://timetables.liv.ac.uk/Home/Login", {
    "method": "POST",
    "headers": {
      "Connection": "keep-alive",
      "Origin": "https://timetables.liv.ac.uk",
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Mozilla/5.0 (Macintosh Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4033.2 Safari/537.36",
      "Referer": "https://timetables.liv.ac.uk/Home/Login",
      "dnt": "1"
    },
    "body": formData.toString()
  })

  return true

}

export const test = () => {
const details = mockResponse/*(await fetch("https://timetables.liv.ac.uk/Home/Next28Days", {
  "method": "GET",
  "headers": {
    "User-Agent": "Mozilla/5.0 (Macintosh Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4033.2 Safari/537.36",
    "Referer": "https://timetables.liv.ac.uk/Home/Today",
    "dnt": "1"
  }
})).text()*/
const entries = Array.from(details.matchAll(/<a[^]*?Details\?event=(?<id>.+)\"[^]*?h2>(?<code>.+)<\/h2[^]*?p>\n(?<dateString>.+?)\n(?<time>.+?)\n/g), ({groups: {dateString, id, code, time}}) => {
  const date = parse(dateString.trim().replace(/<.+?>/g, ''), 'EEEE, dd LLLL yyyy', new Date())
  const [start, end] = time.trim().split(' - ').map(string => parse(string, 'HH:mm', date))

  const {category, title} = eventCategories.reduce((bestMatch, category) => code.includes(category.searchString) ? category : bestMatch, defaultCategory)

  return {
    date,
    start,
    end,
    id,
    category,
    title,
    code
  }
})

console.log(entries)

return entries
}
// loginTest()
