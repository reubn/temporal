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
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    height: '100%'
  },
  emptyText: {
    marginTop: 16,
    fontFamily: 'SF-Pro-Rounded-Regular',
    fontSize: 18,
    color: 'hsl(0, 0%, 60%)'
  }
})

export default ({events}) => {
  const [data, setData] = useState(events)

  console.log(events)

  const periods = events.sort(({start: startA}, {start: startB}) => compareAsc(startA, startB)).reduce((array, event) => {
    const {start, end, id} = event

    const freeTime = array.length && !isEqual(array[array.length - 1].end, start)
      ? {category: 'free', start: array[array.length - 1].end, end: start}
      : undefined

    return [...array, ...(freeTime ? [freeTime, event] : [event])]
  }, [])

  const elements = periods.map((event, i, array) => <Period key={event.id || `free-${i}`} event={event}  />)

  const timeline = <>
    <Scale first={periods[0]} last={periods[periods.length - 1]} />
    <View style={Styles.eventsContainer}>{elements}</View>
  </>

  return (
    <View style={Styles.outerContainer}>
      {events.length
        ? timeline
        : <View style={Styles.emptyContainer}>
            <Text style={Styles.emptyText}>No Events Scheduled</Text>
          </View>
      }
    </View>
  )
}
