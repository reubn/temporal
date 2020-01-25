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
  stripes: {
    width: '100%',
    height: '100%'
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
  }
})

const stripeThickness = 30
const stripeColour = 'hsl(0, 0%, 98%)'
const html = `<html style="
  background: repeating-linear-gradient(-45deg, transparent, transparent ${stripeThickness}px, ${stripeColour} ${stripeThickness}px, ${stripeColour} ${stripeThickness * 2}px);
  width: 100%;
  height: 100%;
  border-radius: 12px;
">
  <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
</html>`

export default ({style: externalStyle, event: {start, end, category, title}}) => {
  const length = differenceInHours(end, start)
  const height = (length * hourFactor) - (Styles.container.marginTop + Styles.container.marginBottom)
  const free = category === 'free'
  const categoryObject = eventCategories.find(({category: cat}) => category === cat) || defaultCategory

  const colour = new Color(categoryObject.colour)

  const content = free
    ? (<WebView
      pointerEvents="none"
      source={{html}}
      containerStyle={Styles.stripes}
      scrollEnabled={false}
    />)
    : (<>
      <View style={[Styles.bar, {backgroundColor: colour, overflow: free ? undefined : 'hidden'}]} />
      <View style={Styles.textContainer}>
        <Text numberOfLines={2} ellipsizeMode="middle" style={[Styles.title, {color: colour.darken(0.15)}]}>{title || categoryObject.title}</Text>
      </View>
    </>
  )

  return (
    <View style={[externalStyle, Styles.container, {height, backgroundColor: colour.fade(0.95)}]}>
      {content}
    </View>
  )
}
