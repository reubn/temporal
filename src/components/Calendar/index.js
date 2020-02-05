import React, {useState, useEffect, useMemo} from 'react'
import {View, Text, StyleSheet, Dimensions} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'

import {useSafeArea} from 'react-native-safe-area-context'

import {CalendarList} from 'react-native-calendars'

import {format, startOfDay, isEqual} from 'date-fns'

import selectDay from '../../store/actions/selectDay'

const DIMENSIONS = Dimensions.get('window')

const Styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  },
  calendarHeader: {
    fontSize: 20,
    fontFamily: 'SF-Pro-Rounded-Medium',
    color: '#ffffff',
    marginVertical: 12,
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
        dots: Array(length).fill(isEqual(d, startOfDay(new Date())) ? {color: 'hsla(200, 100%, 60%, 1)'} : {color: '#fff', selectedDotColor: 'hsla(200, 100%, 60%, 1)'})
      })
  }), {}), [days.cacheKey])

  const marks = Object.keys(dots).reduce((result, key) => {
    result[key] = {...dots[key], ...(key === format(day, 'yyyy-MM-dd') ? {dots: [], selected: true} : {selected: false})}
    return result
  }, {})

  const [calendarMonth, setCalendarMonth] = useState(format(new Date(day), 'LLLL yyyy'))

  return (
    <View style={[Styles.outerContainer]}>
      <View style={[Styles.calendar, {paddingTop: insets.top}]}>
        <Text style={[Styles.calendarHeader]}>{calendarMonth}</Text>
        <CalendarList
          style={[]}
          // Initially visible month. Default = Date()
          current={day}
          markedDates={marks}
          markingType="multi-dot"

          // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
          // minDate={'2012-05-10'}
          // // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
          // maxDate={'2012-05-30'}
          // Handler which gets executed on day press. Default = undefined
          onVisibleMonthsChange={({length, 0: {timestamp}}) => {if(length === 1) setCalendarMonth(format(startOfDay(new Date(timestamp)), 'LLLL yyyy'))}}
          onDayPress={({timestamp}) => {selectDay(dispatch, {day: startOfDay(new Date(timestamp))})}}
          // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
          firstDay={1}
          horizontal={true}
          pagingEnabled={true}
          hideExtraDays={false}
          calendarHeight={DIMENSIONS.height / 2}

          hideArrows={true}
          theme={{
            'stylesheet.day.multiDot': {
              base: {
                height: 38,
                width: 38,
                alignItems: 'center',
                paddingTop: 5
              },
              today: {
                borderRadius: 8,
                backgroundColor: '#fff'
              },
              selected: {
                backgroundColor: '#fff',
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
            textSectionTitleColor: 'hsla(200, 10%, 100%, 0.9)',
            selectedDayTextColor: 'hsla(200, 100%, 60%, 1)',
            dayTextColor: '#fff',
            textDisabledColor: 'hsla(200, 10%, 100%, 0.7)',
            selectedDotColor: '#ffffff',
            indicatorColor: '#ffffff',
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
    </View>
  )
}
