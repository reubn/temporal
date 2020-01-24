import React, {Component} from 'react'
import {StyleSheet, View, Text} from 'react-native'

import {isEqual, parseISO} from 'date-fns'

import SlideOverPane from './components/SlideOverPane'
import DayTimeline from './components/DayTimeline'

import {test} from './api'

const testData = test()

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#555',
  }
})

export default () => {
  return (
      <View style={Styles.container}>
        <SlideOverPane>
          <DayTimeline events={testData.filter(({date}) => isEqual(date, parseISO('2020-01-17')))} />
      </SlideOverPane>
      </View>
    )
}
