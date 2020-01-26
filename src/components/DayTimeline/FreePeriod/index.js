import React from 'react'
import {View, StyleSheet} from 'react-native'
import {WebView} from 'react-native-webview'

import {differenceInHours} from 'date-fns'

import {hourFactor} from '../hourFactor'

const Styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 12,
    marginTop: 5,
    marginBottom: 5
  },
  stripes: {
    width: '100%',
    height: '100%'
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

export default ({style: externalStyle, free}) => {
  const {start, end} = free

  const length = differenceInHours(end, start)
  const height = (length * hourFactor) - (Styles.container.marginTop + Styles.container.marginBottom)

  return (
    <View style={[externalStyle, Styles.container, {height}]}>
      <WebView
        pointerEvents="none"
        source={{html}}
        containerStyle={Styles.stripes}
        scrollEnabled={false}
      />
    </View>
  )
}
