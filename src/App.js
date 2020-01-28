import React, {Component} from 'react'
import {StyleSheet, View, Text} from 'react-native'

import {isEqual, parseISO} from 'date-fns'

import API from './api'

import SlideOverPane from './components/SlideOverPane'
import DayTimeline from './components/DayTimeline'

const api = new API();

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

  async componentDidMount() {
    const data = await api.query({date: parseISO('2020-01-22')})
    // console.log('CDM', JSON.stringify(data, null, 2))
    this.setState({data})
  }
  render() {
    return (
      <View style={Styles.container}>
        <SlideOverPane>
          <DayTimeline events={this.state.data.length ? this.state.data[0].events : []} />
      </SlideOverPane>
      </View>
    )
  }
}
