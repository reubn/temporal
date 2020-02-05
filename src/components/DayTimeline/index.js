import React, {useState, useEffect} from 'react'
import {ActivityIndicator, View, Text, StyleSheet} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'

import {compareAsc, isEqual} from 'date-fns'

import {appColours} from '../../config'

import updateDays from '../../store/actions/updateDays'

import Scale from './Scale'
import Period from './Period'
import FreePeriod from './FreePeriod'
import NowLine from './NowLine'


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
    color: appColours.bottomForeground
  }
})

export default () => {
  const dispatch = useDispatch()

  const [{events=[], timestamp}, day, loading] = useSelector(({days, selectedDay, loading}) => [days.find(({day}) => isEqual(selectedDay, day))|| {}, selectedDay, loading])

  useEffect(() => {
    updateDays(dispatch, {day, timestamp})
  }, [day])

  const periods = events.sort(({start: startA}, {start: startB}) => compareAsc(startA, startB)).reduce((array, event) => {
    const {start, end, id} = event

    const freeTime = array.length && !isEqual(array[array.length - 1].end, start)
      ? {free: 'free', start: array[array.length - 1].end, end: start}
      : undefined

    return [...array, ...(freeTime ? [freeTime, event] : [event])]
  }, [])

  const elements = periods.map((eventOrFree, i, array) => eventOrFree.free ? <FreePeriod key={`free-${i}`} free={eventOrFree}  /> : <Period key={eventOrFree.id} event={eventOrFree}  />)

  const timeline = <>
    <Scale first={periods[0]} last={periods[periods.length - 1]} />
    <NowLine first={periods[0]} last={periods[periods.length - 1]} />
    <View style={Styles.eventsContainer}>{elements}</View>
  </>

  const empty = (
    <View style={Styles.emptyContainer}>
      {loading ? <ActivityIndicator size="small" color={appColours.bottomForeground} /> : <Text style={Styles.emptyText}>No Events Scheduled</Text>}
    </View>
  )

  return (
    <View style={Styles.outerContainer}>
      {events.length
        ? timeline
        : empty
      }
    </View>
  )
}
