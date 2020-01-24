import React, {Component} from 'react'
import {StyleSheet, Dimensions, PanResponder, Animated, View, ScrollView, TouchableOpacity} from 'react-native'

import * as Haptics from 'expo-haptics'

const DIMENSIONS = Dimensions.get('window')

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: DIMENSIONS.width,
    position: 'absolute',
    top: 0,
    overflow: 'hidden',
    borderRadius: 12,
    borderTopLeftRadius: 39,
    borderTopRightRadius: 39,
    backgroundColor: '#FFF',

  },
  handleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    width: '100%',
    height: 30,
    zIndex: 1,
    backgroundColor: '#fff'
  },
  handle: {
    display: 'flex',
    width: 50,
    height: 4,
    borderRadius: 6,
    backgroundColor: '#858585'
  }
})

export default class SlideOverPane extends Component {

  constructor(props) {
    super(props)
    this.state = {
      pan: new Animated.Value(0),
      momentumPan: new Animated.Value(0),
      offset: 0,
      slideDontScroll: false,
      scrollBeingTouched: false,
      listenForScrollTouchMove: false
    }
  }

  snapToPosition({position, feedback=Haptics.ImpactFeedbackStyle.Light}){
    Animated.spring(this.state.pan, {
      toValue: position,
      mass: 0.8
    }).start()

    this.setState(state => ({...state, offset: position}))

    Haptics.impactAsync(feedback)
  }

  UNSAFE_componentWillMount() {
    this.panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => this.state.slideDontScroll,
      onMoveShouldSetPanResponderCapture: () => this.state.slideDontScroll,
      onPanResponderMove: (_, {dy}) => {
        const yValue = this.state.offset - dy
        Animated.event([this.state.pan])(yValue)
        Animated.event([this.state.momentumPan])(0)
      },
      onPanResponderRelease: () => {
        if(this.state.pan._value < DIMENSIONS.height * -0.25) this.snapToPosition({position: DIMENSIONS.height * -0.4})
        else if(this.state.pan._value > DIMENSIONS.height * 0.25) this.snapToPosition({position: DIMENSIONS.height * 0.45})
        else this.snapToPosition({position: 0, feedback: Haptics.ImpactFeedbackStyle.Medium})
      }
    })

    this.scrollPanResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => !this.state.listenForScrollTouchMove,
      onMoveShouldSetPanResponderCapture: () => !this.state.listenForScrollTouchMove,
      onPanResponderGrant: () => {
        this.setState({scrollBeingTouched: true})
        Animated.event([this.state.momentumPan])(0)
      },
      onPanResponderMove: (_, {dy}) => {
        if(!this.state.listenForScrollTouchMove || !this.state.slideDontScroll) return
        // if(dy < 0) return

        const yValue = this.state.offset - dy
        Animated.event([this.state.pan])(yValue)

      },
      onPanResponderRelease: () => {
        this.setState({scrollBeingTouched: false})
        if(!this.state.listenForScrollTouchMove || !this.state.slideDontScroll) return

        this.panResponder.panHandlers.onResponderRelease()
        this.setState({slideDontScroll: false, listenForScrollTouchMove: false})
      }
  })

}

  componentWillUnmount() {
    this.state.pan.removeAllListeners()
  }

  getStyles() {
    const {pan, momentumPan} = this.state

    const cardHeight = pan.interpolate({inputRange: [-DIMENSIONS.height/2, DIMENSIONS.height/2], outputRange: [0, DIMENSIONS.height]})
    const cardDistanceFromTop = cardHeight.interpolate({inputRange: [0, DIMENSIONS.height], outputRange: [DIMENSIONS.height, 0]})
    const cardDistanceFromTopMomentumCompensated = Animated.subtract(cardDistanceFromTop, momentumPan)

    return {
      main: [
        Styles.container,
        {position: 'absolute'},
        {transform: [{translateY: cardDistanceFromTopMomentumCompensated}]},
        {height: cardHeight}
      ],
      scrollContainer: [
        {transform: [{translateY: momentumPan}]},
      ],
      scroll: [
        Styles.card
      ]
    }
  }

  render() {
    const {main: mainStyle, scrollContainer: scrollContainerStyle, scroll: scrollStyle} = this.getStyles()

    return (
      <Animated.View style={mainStyle} {...this.panResponder.panHandlers}>
        <TouchableOpacity
          onPressIn={() => this.setState({slideDontScroll: true})}
          onPressOut={() => this.setState({slideDontScroll: false})}
          style={Styles.handleContainer}>
            <View style={Styles.handle} />
        </TouchableOpacity>
        <Animated.View style={scrollContainerStyle}>
          <ScrollView
            {...this.scrollPanResponder.panHandlers}
            scrollEnabled={!this.state.listenForScrollTouchMove}

            onMomentumScrollBegin={() => this.setState({scrollHasMomentum: true})}
            onMomentumScrollEnd={() => this.setState({scrollHasMomentum: false})}

            onScroll={({nativeEvent: {contentOffset: {y}, contentSize: {height: contentHeight}, layoutMeasurement: {height: layoutHeight}}}) => {
                if((y < 0) && this.state.scrollBeingTouched && !this.state.slideDontScroll) return this.setState({slideDontScroll: true, listenForScrollTouchMove: true}) // Manual Scroll
                if(this.state.scrollHasMomentum && y < 0) return Animated.event([this.state.momentumPan])(y) // Top Bounce
                // if(this.state.scrollHasMomentum && y + layoutHeight > contentHeight) Animated.event([this.state.momentumPan])(y + layoutHeight - contentHeight) // Bottom Bounce
            }}
            scrollEventThrottle={1}

            contentContainerStyle={scrollStyle}>
              {this.props.children}
          </ScrollView>
        </Animated.View>
      </Animated.View>
    )
  }
}
