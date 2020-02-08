import React, {useState} from 'react'
import {View, StyleSheet, Animated} from 'react-native'
import {WebView} from 'react-native-webview'

import {differenceInHours} from 'date-fns'

import {hourFactor} from '../hourFactor'

import {appColours} from '../../../config'

const Styles = StyleSheet.create({
  container: {
    width: '95%',
    borderRadius: 14,
    marginTop: 5,
    marginBottom: 5,
    overflow: 'hidden'
  },
  stripes: {
    width: '100%',
    height: '100%'
  }
})

const stripeThickness = 30
const html = `<html style="
  background: repeating-linear-gradient(-45deg, ${appColours.bottomBackground}, ${appColours.bottomBackground} ${stripeThickness}px, ${appColours.bottomForegroundVerySubtle} ${stripeThickness}px, ${appColours.bottomForegroundVerySubtle} ${stripeThickness * 2}px);
  width: 100%;
  height: 100%;
  border-radius: 12px;
">
  <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
</html>`

const AnimatedWebView = Animated.createAnimatedComponent(WebView)

const FreePeriod = ({style: externalStyle, free}) => {
  const [opacity] = useState(new Animated.Value(0))

  const show = () => {
    Animated.spring(opacity, {
      toValue: 1
    }).start()
  }

  const {start, end} = free

  const length = differenceInHours(end, start)
  const height = (length * hourFactor) - (Styles.container.marginTop + Styles.container.marginBottom)

  return (
    <View style={[externalStyle, Styles.container, {height}]}>
      <AnimatedWebView
        pointerEvents="none"
        source={{html}}
        containerStyle={Styles.stripes}
        style={{opacity}}
        onLoad={show}
        scrollEnabled={false}
        onShouldStartLoadWithRequest={() => true}
      />
    </View>
  )
}

export default FreePeriod
