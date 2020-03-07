import React from 'react'
import {Animated, View, Text, StyleSheet} from 'react-native'

import {differenceInHours, addHours, format} from 'date-fns'
import {hourFactor} from '../hourFactor'

import {useAppColours} from '../../../config'

const createHourPeriod = ({first, hours, appColours}) => (_, i) => {

  const hourLabel = format(addHours(first.start, i), 'h:mm')

  const areWeLastHour = i == hours - 1
  const extraLastHourLabel = areWeLastHour && format(addHours(first.start, i + 1), 'h:mm')

  const Styles = StyleSheet.create({
    hourPeriod: {
      overflow: 'visible',
      height: hourFactor
    },
    hourLabel: {
      color: appColours.bottomForeground,
      fontWeight: '500',
      fontFamily: 'SF-Pro-Rounded-Medium',
      fontSize: 16,
      position: 'relative',
      top: -10
    },
    hourQuarterMark: {
      height: 2,
      width: 10,
      borderRadius: 2,
      backgroundColor: appColours.bottomForegroundLessSubtle,
      position: 'absolute',
      top: '25%'
    },
    hourHalfMark: {
      height: 2,
      width: 20,
      borderRadius: 2,
      backgroundColor: appColours.bottomForegroundLessSubtle,
      position: 'absolute',
      top: '50%'
    },
    hourThreeQuarterMark: {
      height: 2,
      width: 10,
      borderRadius: 2,
      backgroundColor: appColours.bottomForegroundLessSubtle,
      position: 'absolute',
      top: '75%'
    },
    extraLastHourLabel: {
      position:'absolute',
      top: '100%',
      transform: [{translateY: -10}]
    }
  })

  return (
    <View key={`scale-${i}`} style={Styles.hourPeriod}>
      <Text style={Styles.hourLabel}>{hourLabel}</Text>
      <View style={Styles.hourQuarterMark}/>
      <View style={Styles.hourHalfMark}/>
      <View style={Styles.hourThreeQuarterMark}/>
      {areWeLastHour && <Text style={[Styles.hourLabel, Styles.extraLastHourLabel]}>{extraLastHourLabel}</Text>}
    </View>
  )
}

const Scale = ({first, last, popState}) => {
  const appColours = useAppColours()

  const hoursDifference = differenceInHours(last.end, first.start)
  const hours = Math.ceil(hoursDifference)
  const containerHeight = hours * hourFactor

  const Styles = StyleSheet.create({
    container: {
      width: '20%'
    }
  })

  const animated = {
    opacity: popState.interpolate({inputRange: [0, 1], outputRange: [1, 0]}),
    paddingLeft: popState.interpolate({inputRange: [0, 1], outputRange: [0, -20]})
  }

  return (
    <Animated.View style={[Styles.container, {height: containerHeight}, animated]}>
      {Array.from({length: hours}, createHourPeriod({first, hours, appColours}))}
    </Animated.View>
  )
}

export default Scale
