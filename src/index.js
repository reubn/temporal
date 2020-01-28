import React, {Component} from 'react'
import {Provider} from 'react-redux'

import {registerRootComponent} from 'expo'
import * as Font from 'expo-font'

import store from './store'
import App from './App'

class FontLoaderWrapper extends Component {
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
    return (
      <Provider store={store}>
        {this.state.ready ? <App /> : null}
      </Provider>
    )
  }
}

registerRootComponent(FontLoaderWrapper)
