import React, {Component} from 'react'
import {Provider} from 'react-redux'
import {AppState, AppRegistry, Platform} from 'react-native';

import * as Font from 'expo-font'

import {SafeAreaProvider} from 'react-native-safe-area-context'

import store from './store'
import App from './App'

import {haveCredentials, clearCredentials} from './store/secure'
haveCredentials()

class Wrapper extends Component {
  state = {
    ready: false,
  }

  async componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange)

    await Font.loadAsync({
      'SF-Pro-Rounded-Medium': require('../assets/fonts/SF-Pro-Rounded-Medium.otf'),
      'SF-Pro-Rounded-Regular': require('../assets/fonts/SF-Pro-Rounded-Regular.otf')
    })

    this.setState({ready: true})
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange(nextAppState){
    if(nextAppState === 'active') this.setState({...this.state})
  }

  render() {
    return (
      <SafeAreaProvider>
        <Provider store={store}>
          {this.state.ready ? <App /> : null}
        </Provider>
      </SafeAreaProvider>
    )
  }
}

AppRegistry.registerComponent('temporal', () => Wrapper);
