import React, {Component} from 'react'
import {StyleSheet, View, Text} from 'react-native'

import SlideOverPane from './components/SlideOverPane'
import DayTimeline from './components/DayTimeline'
import Calendar from './components/Calendar'

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#555',
  }
})

export default class App extends Component {
  state = {
    data: [],
  }

  async componentDidMount() {}
  render() {
    return (
      <View style={Styles.container}>
        <Calendar />
        <SlideOverPane>
          <DayTimeline />
        </SlideOverPane>
      </View>
    )
  }
}
