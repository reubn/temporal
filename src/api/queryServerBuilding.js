import login from './login'

const makeRequest = async ({buildingCode}) => {
  console.log('fetching building', buildingCode)

  return fetch(`https://timetables.liverpool.ac.uk/services/get-location?buildingCode=${buildingCode}`, {
    "method": "GET",
    "headers": {
      "User-Agent": "Mozilla/5.0 (Macintosh Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4033.2 Safari/537.36",
      "Referer": "https://timetables.liverpool.ac.uk/?",
      "dnt": "1"
    }
  })
}

export default async ({buildingCode}={}) => {
  if(!buildingCode) return

  let response = await makeRequest({buildingCode})

  if(response.url.includes('account') || !response.ok){
    await login()
    response = await makeRequest({buildingCode})
  }

  const {Address, Geo: {Geometries}} = await response.json()

  return {
    buildingCode,
    address: Address,
    coords: Geometries.find(({Type}) => Type === 'Point').Coordinates
  }
}
