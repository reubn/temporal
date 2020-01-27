import login from './login'

const makeRequest = async id => {
  console.log('fetching 28days')
  // return fetch(`https://timetables.liv.ac.uk/Home/Details?event=${id}`, {
  //   "method": "GET",
  //   "headers": {
  //     "User-Agent": "Mozilla/5.0 (Macintosh Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4033.2 Safari/537.36",
  //     "Referer": `https://timetables.liv.ac.uk/Home/Details?event=${id}`,
  //     "dnt": "1"
  //   }
  // })
}

export default async ({id}) => {
  let response = await makeRequest(id)

  if(response.url.includes('Login') || !response.ok){
    await login()
    response = await makeRequest(id)
  }

  const html = await response.text()

  return /<span>Room:<\/span>[^]+?<span>(?<room>.+?)<\/span>/g.exec(html).groups.room
}
