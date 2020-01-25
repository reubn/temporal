import React, {useState} from 'react'
import {View, Text, StyleSheet} from 'react-native'

import Scale from './Scale'
import Period from './Period'

import {compareAsc, isEqual} from 'date-fns'

const Styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 30
  },
  eventsContainer: {
    width: '80%'
  }
})

export default ({events}) => {
  const [data, setData] = useState(events)

  const periods = events.sort(({start: startA}, {start: startB}) => compareAsc(startA, startB)).reduce((array, event) => {
    const {start, end, id} = event

    const freeTime = array.length && !isEqual(array[array.length - 1].end, start)
      ? {category: 'free', start: array[array.length - 1].end, end: start}
      : undefined

    return [...array, ...(freeTime ? [freeTime, event] : [event])]
  }, [])

  const elements = periods.map((event, i, array) => <Period key={event.id || `free-${i}`} event={event}  />)

  return (
    <View style={Styles.outerContainer}>
      <Scale first={periods[0]} last={periods[periods.length - 1]} />
      <View style={Styles.eventsContainer}>{elements}</View>
    </View>
  )
}
