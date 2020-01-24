import {parse} from 'date-fns'

import RCTNetworking from 'react-native/Libraries/Network/RCTNetworking'
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

  let categoryAndTitle = ['other', `Other - ${code.split('/').pop()}`]
  if(code.includes('Lecture')) categoryAndTitle = ['lecture', 'Lecture']
  if(code.includes('Lecture (Review)')) categoryAndTitle = ['lecture', 'End of Block Review']
  if(code.includes('Critical Analysis')) categoryAndTitle = ['cas', 'Critical Analysis & Synthesis']
  if(code.includes('CCP')) categoryAndTitle = ['ccp', 'Communication for Clinical Practice']
  if(code.includes('PSM')) categoryAndTitle = ['psm', 'Psychology & Sociology']
  if(code.includes('HARC')) categoryAndTitle = ['harc', 'Human Anatomy Resource Centre']
  if(code.includes('CBL(small)')) categoryAndTitle = ['cbl', 'Small CBL']
  if(code.includes('CBL(L)')) categoryAndTitle = ['cbl', 'Big CBL']
  if(code.includes('CSTLC')) categoryAndTitle = ['cs', 'Clinical Skills']
  if(code.includes('EoB')) categoryAndTitle = ['eob', 'End of Block Test']
  if(code.includes('Prof Plenary')) categoryAndTitle = ['pel', 'Profesionalism & Ethics']

  const [category, title] = categoryAndTitle

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
