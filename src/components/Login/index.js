import React, {useState, useEffect, useMemo} from 'react'
import {View, KeyboardAvoidingView, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Keyboard, Alert} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'
import {useSafeArea} from 'react-native-safe-area-context'

import login from '../../api/login'
import {setCredentials} from '../../store/secure'

import {appColours} from '../../config'

const Styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
    justifyContent: 'center'
  },
  form: {
    width: '80%',
    marginLeft: '10%'
  },
  label: {
    color: appColours.topForegroundSubtleA,
    marginTop: 20,
    fontSize: 14,
    fontFamily: 'SF-Pro-Rounded-Medium',
    letterSpacing: 1.5
  },
  input: {
    fontFamily: 'SF-Pro-Rounded-Medium',
    width: '100%',
    height: 50,
    fontSize: 18,
    borderBottomColor: appColours.topForegroundSubtleA,
    borderBottomWidth: 1,
    color: appColours.topForegroundSubtleA,
    letterSpacing: 1.1
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: appColours.topForeground,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20
  },
  buttonText: {
    fontFamily: 'SF-Pro-Rounded-Medium',
    color: appColours.background,
    fontSize: 18,
  }
})

export default () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const loading = useSelector(({loading}) => loading)
  const dispatch = useDispatch()

  const insets = useSafeArea()

  const submit = async () => {
    if(!username && !password) return Alert.alert(`You're nameless... and passwordless?`)
    if(!username) return Alert.alert('What was your username again?')
    if(!password) return Alert.alert('Did you forget to enter your password?')

    dispatch({type: 'LOADING_START'})

    const loginResult = await login({username, password})
    if(loginResult) setCredentials({username, password})
    else Alert.alert(`Hmmmm, can't seem to find you`, `Check your details and try again`)

    dispatch({type: 'LOADING_STOP'})
  }

  return (
    <View style={[Styles.container, {paddingTop: insets.top}]} onStartShouldSetResponder={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView style={[Styles.form]} behavior="position" keyboardVerticalOffset={50}>
        <Text style={[Styles.label]}>UoL USERNAME</Text>
        <TextInput
          style={[Styles.input]}
          onChangeText={setUsername}
          value={username}
          placeholder="hlrallen"
          autoCapitalize="none"
          autoCompleteType="username"
          autoCorrect={false}
          enablesReturnKeyAutomatically
          returnKeyType="next"
          textContentType="username"
          placeholderTextColor={appColours.topForegroundSubtleB}
        />
        <Text style={[Styles.label]}>PASSWORD</Text>
        <TextInput
          style={[Styles.input]}
          onChangeText={setPassword}
          value={password}
          placeholder="⦁⦁⦁⦁⦁⦁"
          autoCapitalize="none"
          autoCompleteType="password"
          autoCorrect={false}
          secureTextEntry
          enablesReturnKeyAutomatically
          returnKeyType="done"
          textContentType="password"
          placeholderTextColor={appColours.topForegroundSubtleB}
        />
        <TouchableOpacity
          style={[Styles.button]}
          onPress={submit}
        >
          {loading ? <ActivityIndicator size="small" color={appColours.bottomForeground} /> : <Text style={[Styles.buttonText]}>Login</Text>}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  )
}
