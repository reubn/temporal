import RCTNetworking from 'react-native/Libraries/Network/RCTNetworking'
import {username, password} from '../config'

export default async () => {
  RCTNetworking.clearCookies(() => {})

  const formData = new URLSearchParams()
  formData.append('username', username)
  formData.append('password', password)
  formData.append('action', 'login')
  formData.append('submit', 'Continue')

  console.log('fetching login')
  const {ok} = await fetch("https://timetables.liv.ac.uk/Home/Login", {
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

  return ok
}
