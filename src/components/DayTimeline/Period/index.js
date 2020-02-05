import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet} from 'react-native'

import {differenceInHours, differenceInSeconds} from 'date-fns'
import Color from 'color'

import {eventCategories, defaultCategory} from '../../../config'
import {hourFactor} from '../hourFactor'

const Styles = StyleSheet.create({
  container: {
    width: '95%',
    marginTop: 5,
    marginBottom: 5,
    flexDirection: 'row'
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

export default ({style: externalStyle, event}) => {
  const [state, setState] = useState({event})
  const [now, setNow] = useState(new Date())

  const {start, end, category, title, location, code} = state.event


  useEffect(() => {
    const timer = setTimeout(() => setNow(new Date()), 1000)

    return () => clearTimeout(timer)
  }, [now])

  const ended = differenceInSeconds(now, end) >= Math.min(-differenceInSeconds(end, start) * 0.25, -15 * 60)

  const length = differenceInHours(end, start)
  const height = (length * hourFactor) - (Styles.container.marginTop + Styles.container.marginBottom)
  const {colour: colourString, border, title: categoryObjectTitle} = eventCategories.find(({category: cat}) => category === cat) || defaultCategory

  const colour = new Color(colourString)//.desaturate( ? 1 : 0)

  const displayedTitle = title || categoryObjectTitle || [...code.split('/')].pop()

  return (
    <View style={[externalStyle, Styles.container, {height}]}>
    <View style={[Styles.bar, {backgroundColor: colour, overflow: 'hidden'}]} />
    <View style={[Styles.main, {backgroundColor: colour.fade(0.95)}, border ? {borderWidth: 2, borderColor: colour, borderLeftWidth: 0} : {}]}>

      <View style={Styles.textContainer}>
        <Text numberOfLines={2} ellipsizeMode="middle" style={[Styles.title, {color: colour.darken(0.2)}, ended ? {textDecorationLine: 'line-through'} : {}]}>{displayedTitle}</Text>
        <Text numberOfLines={2} ellipsizeMode="middle" style={[Styles.location, {color: colour.darken(0.2)}, ended ? {textDecorationLine: 'line-through'} : {}]}>{location}</Text>
      </View>
    </View>
    </View>
  )
}
