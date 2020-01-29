import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, Dimensions} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'

import {WebView} from 'react-native-webview'


import {CalendarList} from 'react-native-calendars'

import {format} from 'date-fns'

import selectDate from '../../store/actions/selectDate'

const DIMENSIONS = Dimensions.get('window')

const Styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'hsla(222, 7%, 26%, 1)',
    width: '100%',
    height: '100%'
  },
  calendar: {
    marginTop: 30
  },
  background: {
    position: 'absolute',
    zIndex: -1,
    width: '100%',
    height: '100%',
    backgroundColor: 'hsla(222, 7%, 26%, 1)'
  }
})

export default () => {
  const dispatch = useDispatch()
  const [events, date] = useSelector(({events, selectedDate}) => [events, selectedDate])
  // console.log('calendar', format(date, 'yyyy-MM-dd'))

  const html = `<html style="
    background: linear-gradient(180deg, hsla(200, 100%, 60%, 1), hsla(205, 100%, 55%, 1));
    width: 100%;
    height: 100%;
    border-radius: 12px;
  ">
    <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
  </html>`

  return (
    <View style={[Styles.outerContainer]}>
      <CalendarList
        style={[Styles.calendar]}
        // Initially visible month. Default = Date()
        current={date}
        markedDates={{[format(date, 'yyyy-MM-dd')]: {selected: true}}}

        // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
        // minDate={'2012-05-10'}
        // // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
        // maxDate={'2012-05-30'}
        // Handler which gets executed on day press. Default = undefined
        onDayPress={({timestamp}) => {selectDate(dispatch, {date: new Date(timestamp)})}}
        // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
        firstDay={1}
        horizontal={true}
        pagingEnabled={true}
        hideExtraDays={false}
        calendarHeight={DIMENSIONS.height / 2}

        hideArrows={true}
        theme={{
          'stylesheet.day.basic': {today: {borderRadius: 10, backgroundColor: '#fff'}},
          'stylesheet.calendar.header': {
            monthText: {
              fontSize: 20,
              fontFamily: 'SF-Pro-Rounded-Medium',
              color: '#ffffff',
              margin: 20,
            }
          },
          backgroundColor: 'transparent',
          calendarBackground: 'transparent',
          textSectionTitleColor: 'hsla(200, 10%, 100%, 0.9)',
          selectedDayBackgroundColor: '#ffffff',
          selectedDayTextColor: 'hsla(200, 100%, 60%, 1)',
          dayTextColor: '#fff',
          textDisabledColor: 'hsla(200, 10%, 100%, 0.7)',
          dotColor: '#00adf5',
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
      <WebView
              pointerEvents="none"
              source={{html}}
              containerStyle={Styles.background}
              scrollEnabled={false}
            />
    </View>
  )
}
