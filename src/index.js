import React, {Component} from 'react'
import {Provider} from 'react-redux'
import {AppState, AppRegistry, Platform, ActionSheetIOS} from 'react-native';

import RNShake from 'react-native-shake'

import * as Font from 'expo-font'

import {SafeAreaProvider} from 'react-native-safe-area-context'

import store from './store'
import maps from './maps'
import App from './App'

import {haveCredentials, clearCredentials} from './store/secure'
// clearCredentials()
haveCredentials()

const showLogoutActionSheet = () => {
  ActionSheetIOS.showActionSheetWithOptions({
      options: ['Cancel', 'Logout'],
      destructiveButtonIndex: 1,
      cancelButtonIndex: 0,
    }, buttonIndex => buttonIndex === 1 && clearCredentials()
  )
}

class Wrapper extends Component {
  state = {
    ready: false,
  }

  async componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange)

    RNShake.addEventListener('ShakeEvent', showLogoutActionSheet)

    await Font.loadAsync({
      'SF-Pro-Rounded-Medium': require('../assets/fonts/SF-Pro-Rounded-Medium.otf'),
      'SF-Pro-Rounded-Regular': require('../assets/fonts/SF-Pro-Rounded-Regular.otf')
    })

    this.setState({ready: true})
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange)
    RNShake.removeEventListener('ShakeEvent')
  }

  handleAppStateChange =  nextAppState => {
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
