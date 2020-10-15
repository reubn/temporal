import React, {useState, useEffect, useRef, useMemo} from 'react'
import {View, Text, StyleSheet, TouchableWithoutFeedback, Animated, Easing, Clipboard} from 'react-native'
import {useDispatch} from 'react-redux'

import * as Haptics from 'expo-haptics'
import LinearGradient from 'react-native-linear-gradient'

import {differenceInMinutes, differenceInSeconds} from 'date-fns'
import Color from 'color'
import MapboxGL from '@react-native-mapbox-gl/maps'

import {eventCategories, defaultCategory, useAppColours} from '../../../config'
import updateBuilding from '../../../store/actions/updateBuilding'
import {hourFactor} from '../hourFactor'

const Period = ({style: externalStyle, event, buildings, popState, initialPopState, scrollBeingTouched}) => {
  // console.log(JSON.stringify(event, null, 2))
  const appColours = useAppColours()

  const dispatch = useDispatch()

  const [state, setState] = useState({event})
  const [now, setNow] = useState(new Date())

  const {start, end, category, title, location={}, code, id} = state.event

  const building = useMemo(() => buildings.find(({buildingCode}={}) => buildingCode === location.buildingCode), [location.buildingCode, buildings])
  const {coords, address} = building || {}

  useEffect(() => void (!building && location.buildingCode && updateBuilding(dispatch, {buildingCode: location.buildingCode})), [building])

  useEffect(() => {
    const timer = setTimeout(() => requestAnimationFrame(() => setNow(new Date())), 1000)

    return () => clearTimeout(timer)
  }, [now])

  const Styles = StyleSheet.create({
    container: {
      width: '95%',
      marginTop: 5,
      marginBottom: 5,
      flexDirection: 'row',
      backgroundColor: appColours.bottomBackground,
      overflow: 'hidden'
    },
    main: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderTopRightRadius: 12,
      borderBottomRightRadius: 12,
      overflow: 'hidden'
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
      top: 1,
      left: 0,
      paddingHorizontal: 6,
      width: '100%',
      zIndex: 2
    },
    title: {
      fontSize: 17,
      fontWeight: '600',
      fontFamily: 'SF-Pro-Rounded-Medium'
    },
    location: {
      fontSize: 15,
      fontWeight: '600',
      fontFamily: 'SF-Pro-Rounded-Regular',
      marginTop: 4
    },
    extra: {
      height: '100%',
      width: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: -1
    }
  })

  const ended = differenceInSeconds(now, end) >= Math.min(-differenceInSeconds(end, start) * 0.25, -15 * 60)

  const length = differenceInMinutes(end, start) / 60
  const baseHeight = (length * hourFactor) - (Styles.container.marginTop + Styles.container.marginBottom)
  const {colour: colourString, border, title: categoryObjectTitle} = eventCategories.find(({category: cat}) => category === cat) || defaultCategory

  const colour = new Color(colourString)

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

  const animatedExtra = {
    opacity: applicablePopState.interpolate({inputRange: [0, 1], outputRange: [0, 1]})
  }

  const pop = () => {
    if(!coords) return

    setArePopping(true)
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 250)
    Animated.timing(popState, {
      toValue: 1,
      duration: 500,
      easing: Easing.bezier(.9, -0.8, .09, 1.84)
    }).start()
  }

  // useEffect(pop, [])

  const unpop = ({nativeEvent}={}) => {
    if(nativeEvent && nativeEvent.touches.length) return // if this is being triggered by direct touch - make sure it's not being stolen

    Animated.timing(popState, {
      toValue: 0,
      duration: 500,
      easing: Easing.bezier(.9, -0.8, .09, 1.84)
    }).start(() => setArePopping(false))
  }

  const mapExpansion = coords ? (
    <Animated.View style={[Styles.extra, animatedExtra]}>
    <LinearGradient colors={[colour.lighten(0.15).fade(0.9).string(), colour.fade(1).string()]} style={[{flex: 1, height: '100%', width: '100%', position: 'absolute'}]}>
    </LinearGradient>
      <MapboxGL.MapView
        style={[{flex: 1, zIndex:-1}]}

        styleURL={appColours.mapStyle}
        logoEnabled={false}
        attributionEnabled={false}

        pointerEvents="none"
        scrollEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
        zoomEnabled={false}
      >
        <MapboxGL.Camera
          centerCoordinate={coords}
          zoomLevel={arePopping ? 16 : 10}

          animationDuration={arePopping ? 350 : 0}
        />

        <MapboxGL.ShapeSource
          id="buildingMarker"
          shape={{
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: coords
              }
            }]
          }}
        >
          <MapboxGL.CircleLayer id="exampleIconName" style={{circleStrokeWidth: 2, circleStrokeColor: '#fff', circleRadius: 3, circleColor: colour.string()}} />
        </MapboxGL.ShapeSource>
      </MapboxGL.MapView>
    </Animated.View>
  ) : null

  // return <Text ellipsizeMode="middle" style={[Styles.location, {color: colour}, ended ? {textDecorationLine: 'line-through'} : {}]}>{event.title}</Text>

  return (
    <TouchableWithoutFeedback delayLongPress={200} onLongPress={pop} onPressOut={unpop} onPress={() => Clipboard.setString(id)}>
      <Animated.View style={[externalStyle, Styles.container, animated]}>
        <View style={[Styles.bar, {backgroundColor: colour, overflow: 'hidden'}]} />
        <View style={[Styles.main, {backgroundColor: colour.fade(0.95)}, border ? {borderWidth: 2, borderColor: colour, borderLeftWidth: 0} : {}]}>
          <View style={Styles.textContainer}>
            <Text adjustsFontSizeToFit numberOfLines={2} ellipsizeMode="middle" style={[Styles.title, {color: colour}, ended ? {textDecorationLine: 'line-through'} : {}]}>{title}</Text>
            <Text ellipsizeMode="middle" style={[Styles.location, {color: colour}, ended ? {textDecorationLine: 'line-through'} : {}]}>{location.description}</Text>
          </View>
          {mapExpansion}
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  )
}

export default Period
