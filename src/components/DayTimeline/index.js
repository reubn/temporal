import React, {useState} from 'react'
import {Text} from 'react-native'

import Period from './Period'

import {compareAsc, isEqual} from 'date-fns'

export default ({events}) => {
  const [data, setData] = useState(events)

  const periods = events.sort(({start: startA}, {start: startB}) => compareAsc(startA, startB)).reduce((array, event) => {
    const {start, end, id} = event

    const freeTime = array.length && !isEqual(array[array.length - 1].end, start)
      ? {category: 'free', start: array[array.length - 1].end, end: start}
      : undefined

    return [...array, ...(freeTime ? [freeTime, event] : [event])]
  }, []).map((event, i) => <Period key={event.id || `free-${i}`} event={event} />)
  return periods
}


// <Period key={id} event={event} />
// <Period key={Math.random().toString()} event={{category: 'free', start: array[array.length - 1].end, end: start}} />
