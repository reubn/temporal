import React, { Component } from 'react'
import {
   Platform, StyleSheet,Dimensions,
  PanResponder,
  Animated,
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity
} from 'react-native'

import * as Haptics from 'expo-haptics'

import RCTNetworking from 'react-native/Libraries/Network/RCTNetworking'

import {username, password} from './secrets'

const DIMENSIONS = Dimensions.get('window')

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#555',
  },
  cardContainer: {
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
    position:'relative',
    backgroundColor: 'transparent'
  },
  handle: {
    display: 'flex',
    width: 50,
    height: 4,
    borderRadius: 6,
    backgroundColor: '#858585'
  },
  cardImage: {
    flex: 1,
    width: '92.5%',
    backgroundColor: '#1E90FF',

    borderTopLeftRadius: 39,
    borderTopRightRadius: 39,
  },
  cardText: {
    margin: 20
  },
  cardTextMain: {
    textAlign: 'left',
    fontSize: 20,
    backgroundColor: 'transparent'
  },
  cardTextSecondary: {
    textAlign: 'left',
    fontSize: 15,
    color: 'grey',
    backgroundColor: 'transparent'
  }
});

async function loginTest() {
  RCTNetworking.clearCookies(() => {});

  const formData = new URLSearchParams()
  formData.append('username', username)
  formData.append('password', password)
  formData.append('action', 'login')
  formData.append('submit', 'Continue')

  const login = await fetch("https://timetables.liv.ac.uk/Home/Login", {
  "method": "POST",
  "headers": {
    "Connection": "keep-alive",
    "Origin": "https://timetables.liv.ac.uk",
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4033.2 Safari/537.36",
    "Referer": "https://timetables.liv.ac.uk/Home/Login",
    "dnt": "1"
  },
  "body": formData.toString()
})

// console.log(login.headers)

const details = await fetch("https://timetables.liv.ac.uk/Home/Today", {
  "method": "GET",
  "headers": {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4033.2 Safari/537.36",
    "Referer": "https://timetables.liv.ac.uk/Home/Today",
    "dnt": "1"
  }
})

console.log(await details.text())
}
// loginTest()


class Card extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pan: new Animated.Value(0),
      momentumPan: new Animated.Value(0),
      offset: 0,
      slideDontScroll: false,
      scrollBeingTouched: false,
      listenForScrollTouchMove: false
    };
  }

  UNSAFE_componentWillMount() {

    this.panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => this.state.slideDontScroll,
      onMoveShouldSetPanResponderCapture: () => this.state.slideDontScroll,
      onPanResponderMove: (_, {dy}) => {
        const yValue = this.state.offset - dy
        Animated.event([this.state.pan], /*{listener: (event, gestureState) => console.log(this.state.offset, this.state.pan)}*/)(yValue)
      },
      onPanResponderRelease: () => {
        if(this.state.pan._value < DIMENSIONS.height * -0.25) {
          console.log('snapped bottom')

          Animated.spring(this.state.pan, {
            toValue: DIMENSIONS.height * -0.4,
            mass: 0.8
          }).start()
          this.setState(state => ({...state, offset: DIMENSIONS.height * -0.4}))
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

          return
        }

        if(this.state.pan._value > DIMENSIONS.height * 0.25) {
          console.log('snapped top')

          Animated.spring(this.state.pan, {
            toValue: DIMENSIONS.height * 0.45,
            mass: 0.8
          }).start()
          this.setState(state => ({...state, offset: DIMENSIONS.height * 0.45}))
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

          return
        }
          Animated.spring(this.state.pan, {
            toValue: 0,
            mass: 0.8
          }).start()
          this.setState(state => ({...state, offset: 0}))
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        }

    });

    this.scrollPanResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => !this.state.listenForScrollTouchMove,
      onMoveShouldSetPanResponderCapture: () => !this.state.listenForScrollTouchMove,
      onPanResponderGrant: () => this.setState({scrollBeingTouched: true}),
      onPanResponderMove: (_, {dy}) => {
        if(!this.state.listenForScrollTouchMove || !this.state.slideDontScroll) return
        // if(dy < 0) return

        const yValue = this.state.offset - dy
        Animated.event([this.state.pan], /*{listener: (event, gestureState) => console.log(this.state.offset, this.state.pan)}*/)(yValue)

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
    this.state.pan.removeAllListeners();
  }

  getMainCardStyle() {
    let {pan, momentumPan} = this.state;
    // console.log('R', pan.interpolate({inputRange: [-DIMENSIONS.height/2, DIMENSIONS.height/2], outputRange: [0, DIMENSIONS.height]}))
    return [
      Styles.cardContainer,
      {position: 'absolute'},
      {transform: [{translateY: Animated.subtract(pan.interpolate({inputRange: [-DIMENSIONS.height/2, DIMENSIONS.height/2], outputRange: [DIMENSIONS.height, 0]}), momentumPan)}]},
      {height: pan.interpolate({inputRange: [-DIMENSIONS.height/2, DIMENSIONS.height/2], outputRange: [0, DIMENSIONS.height]})}
    ];
  }

  render() {
    let {picture, name, email} = this.props;
    // console.log(this.panResponder.panHandlers)
    return (
      <Animated.View style={this.getMainCardStyle()} {...this.panResponder.panHandlers}>
      <TouchableOpacity onPressIn={() => this.setState({slideDontScroll: true})} onPressOut={() => this.setState({slideDontScroll: false})} style={Styles.handleContainer} >
        <View style={Styles.handle} />
      </TouchableOpacity>
        <ScrollView
          {...this.scrollPanResponder.panHandlers}
          scrollEnabled={!this.state.listenForScrollTouchMove}
          onMomentumScrollBegin={() => this.setState({mom: true})}
          onMomentumScrollEnd={() => {
            this.setState({mom: false})
            Animated.spring(this.state.momentumPan, {
              toValue: 0,
              mass: 0.8
            }).start()
          }}
          onScroll={({nativeEvent: {contentOffset: {y}}}) => {
              if(y < 0 && this.state.scrollBeingTouched && !this.state.slideDontScroll) this.setState({slideDontScroll: true, listenForScrollTouchMove: true})
              if(this.state.mom && y < 0) {
                const yValue = y
                Animated.event([this.state.momentumPan], {listener: (event, gestureState) => console.log(this.state.offset, this.state.momentumPan)})(yValue)
              }
          }}
          scrollEventThrottle={1}

          contentContainerStyle={Styles.card}>
            <Text style={Styles.text}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.

          </Text>
        </ScrollView>
      </Animated.View>
    );
  }
}

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' + 'Shake or press menu button for dev menu',
});

export default class App extends Component {
  render() {
    return (
      <View style={Styles.container}>
        <Card picture={{large: 'https://images.unsplash.com/photo-1564415899387-db4ccff0827b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1952&q=80'}} name={{first: 'Reuben', last: 'Eggar'}} email={'r@reuben.science'}/>
      </View>
    );
  }
}
