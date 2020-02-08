export default (() => {
  const buildings = [
    {
      buildingCode: 'O-WH',
      address: `70 Pembroke Place
L69 3GF
Liverpool
United Kingdom`,
      coords: [-2.96795, 53.40825],
      timestamp: new Date()
    }
  ]

  buildings.cacheKey = Math.random()

  return buildings
})()
