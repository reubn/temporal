import React, {useState, useEffect, useRef, useMemo} from 'react'
import {Animated, ActivityIndicator, View, Text, StyleSheet} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'

import {compareAsc, isEqual} from 'date-fns'

import {useAppColours} from '../../config'

import updateDays from '../../store/actions/updateDays'

import Scale from './Scale'
import Period from './Period'
import FreePeriod from './FreePeriod'
import NowLine from './NowLine'

const emptyObject = {}

const DayTimeline = ({scrollBeingTouched}) => {
  const appColours = useAppColours()
  
  const dispatch = useDispatch()

  // const [{events=[], timestamp}, day, loading] = useSelector(({days, selectedDay, loading}) => [days.find(({day}) => isEqual(selectedDay, day))|| {}, selectedDay, loading])
  const day = useSelector(({selectedDay}) => selectedDay)
  const {events=[], timestamp} = useSelector(({days}) => days.find(({day: d}) => isEqual(day, d)) || emptyObject)

  const buildings = useSelector(({buildings}) => buildings)

  const loading = useSelector(({loading}) => loading)

  const {current: popState} = useRef(new Animated.Value(0))
  const {current: initialPopState} = useRef(new Animated.Value(0))

  useEffect(() => void updateDays(dispatch, {day, timestamp}), [day])

  const periods = useMemo(() => [...events].sort(({start: startA}, {start: startB}) => compareAsc(startA, startB)).reduce((array, event) => {
    const {start, end, id} = event

    const freeTime = array.length && !isEqual(array[array.length - 1].end, start)
      ? {free: 'free', start: array[array.length - 1].end, end: start}
      : undefined

    return [...array, ...(freeTime ? [freeTime, event] : [event])]
  }, []), [events])

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

  const elements = periods.map((eventOrFree, i, array) => (
    eventOrFree.free
    ? <FreePeriod key={`free-${i}`} free={eventOrFree}  />
    : <Period key={eventOrFree.id} event={eventOrFree} buildings={buildings} initialPopState={initialPopState} popState={popState} scrollBeingTouched={scrollBeingTouched}/>
  ))

  const timeline = <>
    <Scale first={periods[0]} last={periods[periods.length - 1]} popState={popState} />
    <NowLine first={periods[0]} last={periods[periods.length - 1]} popState={popState} />
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

export default DayTimeline
