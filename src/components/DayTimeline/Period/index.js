import React, {useState, useEffect, useRef} from 'react'
import {View, Text, StyleSheet, TouchableWithoutFeedback, Animated, Easing} from 'react-native'

import {differenceInHours, differenceInSeconds} from 'date-fns'
import Color from 'color'

import {eventCategories, defaultCategory, appColours} from '../../../config'
import {hourFactor} from '../hourFactor'

const Styles = StyleSheet.create({
  container: {
    width: '95%',
    marginTop: 5,
    marginBottom: 5,
    flexDirection: 'row',
    backgroundColor: appColours.bottomBackground
  },
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12
  },
  bar: {
    // position: 'absolute',
    left: 0,
    height: '100%',
    width: 4,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4
  },
  textContainer: {
    position: 'absolute',
    top: 4,
    left: 6,
    marginRight: 6
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'SF-Pro-Rounded-Medium'
  },
  location: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'SF-Pro-Rounded-Regular'
  }
})

export default ({style: externalStyle, event, popState, initialPopState, scrollBeingTouched}) => {
  const [state, setState] = useState({event})
  const [now, setNow] = useState(new Date())

  const {start, end, category, title, location, code} = state.event

  useEffect(() => {
    const timer = setTimeout(() => setNow(new Date()), 1000)

    return () => clearTimeout(timer)
  }, [now])

  const ended = differenceInSeconds(now, end) >= Math.min(-differenceInSeconds(end, start) * 0.25, -15 * 60)

  const length = differenceInHours(end, start)
  const baseHeight = (length * hourFactor) - (Styles.container.marginTop + Styles.container.marginBottom)
  const {colour: colourString, border, title: categoryObjectTitle} = eventCategories.find(({category: cat}) => category === cat) || defaultCategory

  const colour = new Color(colourString)//.desaturate( ? 1 : 0)

  const displayedTitle = title || categoryObjectTitle || [...code.split('/')].pop()

  const [arePopping, setArePopping] = useState(false)

  useEffect(() => {
    if(!scrollBeingTouched && arePopping) unpop()
  }, [scrollBeingTouched])

  const applicablePopState = arePopping ? popState : initialPopState
  const animated = {
    height: applicablePopState.interpolate({inputRange: [0, 1], outputRange: [baseHeight, Math.max(hourFactor * 4, baseHeight)]}),
    width: applicablePopState.interpolate({inputRange: [0, 1], outputRange: ['95%', '115%']}),
    marginLeft: applicablePopState.interpolate({inputRange: [0, 1], outputRange: ['0%', '-20%']})
  }

  const pop = () => {
    setArePopping(true)
    Animated.timing(popState, {
      toValue: 1,
      duration: 500,
      easing: Easing.bezier(.9, -0.8, .09, 1.84)
    }).start()
  }

  const unpop = () => {
    Animated.timing(popState, {
      toValue: 0,
      duration: 500,
      easing: Easing.bezier(.9, -0.8, .09, 1.84)
    }).start(() => setArePopping(false))
  }

  // {"changedTouches": [[Circular]],
  // "identifier": 1,
  // "locationX": 123,
  // "locationY": 34.5,
  // "pageX": 164.5,
  // "pageY": 543,
  // "target": 1685,
  // "timestamp": 106578224.89930402,
  // "touches": []}

  return (
    <TouchableWithoutFeedback delayLongPress={200} onLongPress={pop} onPressOut={({nativeEvent}) => !nativeEvent.touches.length && unpop()}>
      <Animated.View style={[externalStyle, Styles.container, animated]}>
        <View style={[Styles.bar, {backgroundColor: colour, overflow: 'hidden'}]} />
        <View style={[Styles.main, {backgroundColor: colour.fade(0.95)}, border ? {borderWidth: 2, borderColor: colour, borderLeftWidth: 0} : {}]}>
          <View style={Styles.textContainer}>
            <Text numberOfLines={2} ellipsizeMode="middle" style={[Styles.title, {color: colour.darken(0.2)}, ended ? {textDecorationLine: 'line-through'} : {}]}>{displayedTitle}</Text>
            <Text numberOfLines={2} ellipsizeMode="middle" style={[Styles.location, {color: colour.darken(0.2)}, ended ? {textDecorationLine: 'line-through'} : {}]}>{location}</Text>
          </View>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  )
}
