import React, {useState, useEffect} from 'react'
import {View, StyleSheet} from 'react-native'
import {WebView} from 'react-native-webview'

import {differenceInHours, differenceInSeconds, startOfDay, isEqual} from 'date-fns'

import {hourFactor} from '../hourFactor'

import {appColours} from '../../../config'

const Styles = StyleSheet.create({
  container: {
    width: '85%',
    height: 6,
    position: 'absolute',
    right: 0,
    borderRadius: 2,
    zIndex: 1,
    borderWidth: 2,
    borderColor: appColours.bottomBackground
  },
  line: {
    height: 2,
    backgroundColor: appColours.bottomForeground,
    borderRadius: 2
  }
})

export default ({style: externalStyle, first: {start}, last: {end}}) => {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setTimeout(() => setNow(new Date()), 1000)

    return () => clearTimeout(timer)
  }, [now])

  if(!isEqual(startOfDay(now), startOfDay(start))) return null

  const top = Math.max(0, Math.min(hourFactor * (differenceInSeconds(now, start) / 60 / 60), (differenceInHours(end, start) * hourFactor)))

  return (
    <View style={[externalStyle, Styles.container, {top}]}>
    <View style={Styles.line}/>
    </View>
  )
}
