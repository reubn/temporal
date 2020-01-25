import React, {Component} from 'react'
import {StyleSheet, View, Text} from 'react-native'

import * as Font from 'expo-font'

import {isEqual, parseISO} from 'date-fns'

import API from './api'

import SlideOverPane from './components/SlideOverPane'
import DayTimeline from './components/DayTimeline'


console.log(API)
const api = new API();
(async () => {
  const first = await api.query({date: parseISO('2020-01-13')})
  console.log(first)

  const second = await api.query({date: parseISO('2020-01-14')})
  console.log(second)
})()

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#555',
  }
})

 const App = () => {
  return (
      <View style={Styles.container}>
        <SlideOverPane>
          <DayTimeline events={[]} />
      </SlideOverPane>
      </View>
    )
}

//testData.filter(({date}) => isEqual(date, parseISO('2020-01-13')))

export default class FontLoaderWrapper extends Component {
  state = {
    ready: false,
  }

  async componentDidMount() {
    await Font.loadAsync({
      'SF-Pro-Rounded-Medium': require('../assets/fonts/SF-Pro-Rounded-Medium.otf'),
      'SF-Pro-Rounded-Regular': require('../assets/fonts/SF-Pro-Rounded-Regular.otf')
    })

    this.setState({ready: true})
  }
  render() {
    return this.state.ready ? <App /> : null
  }
}


// testData[Math.floor(Math.random() * (testData.length - 1))].date))
