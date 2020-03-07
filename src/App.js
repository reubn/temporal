import React, {Component, useEffect, useState} from 'react'
import {StyleSheet, View, Text, Animated, Dimensions} from 'react-native'
import {useSelector} from 'react-redux'

import {WebView} from 'react-native-webview'

import SlideOverPane from './components/SlideOverPane'
import DayTimeline from './components/DayTimeline'
import Calendar from './components/Calendar'
import Login from './components/Login'

import {useAppColours} from './config'

const DIMENSIONS = Dimensions.get('window')

const AnimatedWebView = Animated.createAnimatedComponent(WebView)

export default () => {
  const appColours = useAppColours()
  const haveCredentials = useSelector(({credentials}) => credentials)

  const [opacity] = useState(new Animated.Value(0))

  const show = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 250
    }).start()
  }

  const Styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: appColours.background
    },
    background: {
      position: 'absolute',
      zIndex: -2,
      width: '100%',
      height: '100%'
    },
    hidden: {
      position: 'absolute',
      bottom: DIMENSIONS.height * 0.075,
      width: '100%',
      left: 0,
      zIndex: -1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 5,
      opacity: 0.5
    },
    hiddenText: {
      color: appColours.topForeground,
      fontSize: 18,
      fontWeight: '600',
      fontFamily: 'SF-Pro-Rounded-Medium',
      textAlign: 'center'
    }
  })

  const html = `<html style="
    background: linear-gradient(135deg, ${appColours.background}, ${appColours.backgroundAccent});
    width: 100%;
    height: 100%;
  ">
    <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
  </html>`

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
      <View style={[Styles.hidden]}>
        <Text style={[Styles.hiddenText]}>https://reuben.science</Text>
        <Text style={[Styles.hiddenText, {marginTop: 2, fontSize: 10}]}>© Mapbox  © OpenStreetMap</Text>
      </View>
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
