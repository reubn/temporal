import React, {Component, useEffect, useState} from 'react'
import {StyleSheet, View, Text, Animated} from 'react-native'
import {useSelector} from 'react-redux'

import {WebView} from 'react-native-webview'

import SlideOverPane from './components/SlideOverPane'
import DayTimeline from './components/DayTimeline'
import Calendar from './components/Calendar'
import Login from './components/Login'

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'hsla(200, 100%, 60%, 1)'
  },
  background: {
    position: 'absolute',
    zIndex: -1,
    width: '100%',
    height: '100%',
    backgroundColor: 'hsla(200, 100%, 60%, 1)'
  }
})

const html = `<html style="
  background: linear-gradient(180deg, hsla(200, 100%, 60%, 1), hsla(205, 100%, 55%, 1));
  width: 100%;
  height: 100%;
  border-radius: 12px;
">
  <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
</html>`

const AnimatedWebView = Animated.createAnimatedComponent(WebView)

export default () => {
  const haveCredentials = useSelector(({credentials}) => credentials)

  const [opacity] = useState(new Animated.Value(0))

  const show = () => {
    Animated.spring(opacity, {
      toValue: 1
    }).start()
  }

  const main = (
    <>
      <Calendar />
      <SlideOverPane>
        <DayTimeline />
      </SlideOverPane>
    </>
  )

  return (
    <View style={Styles.container}>
      {haveCredentials ? main : <Login />}
      <AnimatedWebView
        pointerEvents="none"
        source={{html}}
        style={{opacity}}
        containerStyle={[Styles.background]}
        scrollEnabled={false}
        onLoad={show}
      />
    </View>
  )
}
