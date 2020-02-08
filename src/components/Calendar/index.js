import React, {useState, useEffect, useMemo} from 'react'
import {View, Text, StyleSheet, Dimensions} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'

import * as Haptics from 'expo-haptics'

import {useSafeArea} from 'react-native-safe-area-context'

import {CalendarList} from 'react-native-calendars'

import {format, startOfDay, isEqual} from 'date-fns'

import selectDay from '../../store/actions/selectDay'

import {appColours} from '../../config'

const DIMENSIONS = Dimensions.get('window')

const Styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: DIMENSIONS.height / 2,
    overflow: 'visible'
  },
  calendarHeader: {
    fontSize: 20,
    fontFamily: 'SF-Pro-Rounded-Medium',
    color: appColours.topForeground,
    marginVertical: 5,
    textAlign: 'center'
  }
})

export default () => {
  const dispatch = useDispatch()
  const [days, day] = useSelector(({days, selectedDay}) => [days, selectedDay])

  const insets = useSafeArea()

  const dots = useMemo(() => days.reduce((object, {day: d, events: {length}}) => ({
      ...object,
      [format(d, 'yyyy-MM-dd')]: ({
        dots: Array(length).fill(isEqual(d, startOfDay(new Date())) ? {color: appColours.background} : {color: appColours.topForeground, selectedDotColor: appColours.background})
      })
  }), {}), [days.cacheKey])

  const marks = useMemo(() => Object.keys(dots).reduce((result, key) => {
    result[key] = {...dots[key], ...(key === format(day, 'yyyy-MM-dd') ? {dots: [], selected: true} : {selected: false})}
    return result
  }, {}), [dots, day])

  const [calendarMonth, setCalendarMonth] = useState(format(new Date(day), 'LLLL yyyy'))
  const [compactLayout, setCompactLayout] = useState(false)

  return (
    <View style={[Styles.outerContainer, {paddingTop: insets.top}]}>
        <Text style={[Styles.calendarHeader]}>{calendarMonth}</Text>
        <CalendarList
          key={compactLayout ? 'c' : 'n'}
          style={{paddingBottom: 38 / 2}}
          current={day}
          markedDates={marks}
          markingType="multi-dot"
          onVisibleMonthsChange={({length, 0: {timestamp}}) => {
            if(length === 1){
              setCalendarMonth(format(startOfDay(new Date(timestamp)), 'LLLL yyyy'))

              Haptics.selectionAsync()
            }
          }}
          onDayPress={({timestamp}) => {
            requestAnimationFrame(() => {
              selectDay(dispatch, {day: startOfDay(new Date(timestamp))})
            })
          }}
          firstDay={1}
          horizontal={true}
          pagingEnabled={true}
          hideExtraDays={false}
          hideArrows={true}
          onLayout={({nativeEvent: {layout: {height}}}) => setCompactLayout(((12 + (38 * 6)) - DIMENSIONS.height / 2 )> -200)}
          theme={{
            'stylesheet.day.multiDot': {
              base: {
                height: 38,
                width: 38,
                alignItems: 'center',
                paddingTop: 5,
                marginVertical: compactLayout ? -6 : 0
              },
              today: {
                borderRadius: 8,
                backgroundColor: appColours.topForeground
              },
              selected: {
                backgroundColor: appColours.topForeground,
                borderRadius: 36
              },
              dot: {
                width: 4,
                height: 4,
                marginTop: 2,
                marginHorizontal: 1,
                borderRadius: 4
              }
            },
            'stylesheet.calendar.header': {
              monthText: {
                display: 'none'
              }
            },
            backgroundColor: 'transparent',
            calendarBackground: 'transparent',
            textSectionTitleColor: appColours.topForegroundSubtleA,
            selectedDayTextColor: appColours.background,
            dayTextColor: appColours.topForeground,
            todayTextColor: appColours.background,
            textDisabledColor: appColours.topForegroundSubtleB,
            selectedDotColor: appColours.topForeground,
            indicatorColor: appColours.topForeground,
            textDayFontFamily: 'SF-Pro-Rounded-Medium',
            textMonthFontFamily: 'SF-Pro-Rounded-Medium',
            textDayHeaderFontFamily: 'SF-Pro-Rounded-Medium',
            textDayFontWeight: '300',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '300',
            textDayFontSize: 16,
            textDayHeaderFontSize: 16
          }}

        />

    </View>
  )
}
