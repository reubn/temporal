import React, {useState} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {WebView} from 'react-native-webview'

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
    justifyContent: 'center',
    overflow: 'hidden'
  },
  bar: {
    position: 'absolute',
    left: 0,
    height: '100%',
    width: 4,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4
  }
})

const stripeThickness = 30
const stripeColour = 'hsl(0, 0%, 98%)'
const html = `<html style="
  background: repeating-linear-gradient(-45deg, transparent, transparent ${stripeThickness}px, ${stripeColour} ${stripeThickness}px, ${stripeColour} ${stripeThickness * 2}px);
  width: 100%;
  height: 100%
">
  <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
</html>`

export default ({style: externalStyle, event: {start, end, category, title}}) => {
  const length = differenceInHours(end, start)
  const height = (length * hourFactor) - (Styles.container.marginTop + Styles.container.marginBottom)
  const free = category === 'free'

  const colour = new Color((eventCategories.find(({category: cat}) => category === cat) || defaultCategory).colour)

  const content = free
    ? (<WebView
      pointerEvents="none"
      source={{html}}
      containerStyle={{width:'100%', height:'100%'}}
      scrollEnabled={false}
    />)
    : (<>
      <View style={[Styles.bar, {backgroundColor: colour}]} />
      <Text>{title}</Text>
      <Text>{category}</Text>
      <Text>{title}</Text>
    </>
  )

  return (
    <View style={[externalStyle, Styles.container, {height, backgroundColor: colour.fade(0.75)}]}>
      {content}
    </View>
  )
}
