import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet} from 'react-native'

import {differenceInHours} from 'date-fns'
import Color from 'color'

import {eventCategories, defaultCategory} from '../../../config'
import {hourFactor} from '../hourFactor'

const Styles = StyleSheet.create({
  container: {
    width: '100%',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    marginTop: 5,
    marginBottom: 5,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bar: {
    position: 'absolute',
    left: 0,
    height: '100%',
    width: 4,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4
  },
  textContainer: {
    position: 'absolute',
    top: 4,
    left: 12,
    marginRight: 12
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

  useEffect(() => {
    (async () => {
      const newEvent = await state.event.elaborate()

      setState(() => {
        console.log('newEvent', newEvent.location)
        return {event: newEvent}
      })
    })()
  }, [state.event.id])

  const {start, end, category, title, location} = state.event

  const length = differenceInHours(end, start)
  const height = (length * hourFactor) - (Styles.container.marginTop + Styles.container.marginBottom)
  const categoryObject = eventCategories.find(({category: cat}) => category === cat) || defaultCategory

  const colour = new Color(categoryObject.colour)

  return (
    <View style={[externalStyle, Styles.container, {height, backgroundColor: colour.fade(0.95)}]}>
      <View style={[Styles.bar, {backgroundColor: colour, overflow: 'hidden'}]} />
      <View style={Styles.textContainer}>
        <Text numberOfLines={2} ellipsizeMode="middle" style={[Styles.title, {color: colour.darken(0.2)}]}>{title || categoryObject.title}</Text>
        <Text numberOfLines={2} ellipsizeMode="middle" style={[Styles.location, {color: colour.darken(0.2)}]}>{location}</Text>
      </View>
    </View>
  )
}
