import React, {useState, useEffect, useMemo} from 'react'
import {View, KeyboardAvoidingView, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity} from 'react-native'
import {useSelector} from 'react-redux'
import {useSafeArea} from 'react-native-safe-area-context'

import login from '../../api/login'
import {setCredentials} from '../../store/secure'

const DIMENSIONS = Dimensions.get('window')

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
    marginLeft: '10%',
    // backgroundColor: '#fff',
  },
  label: {
    color: 'hsla(0, 0%, 100%, 0.9)',
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
    borderBottomColor: 'hsla(0, 0%, 100%, 0.9)',
    borderBottomWidth: 1,
    color: 'hsla(0, 0%, 100%, 0.9)',
    letterSpacing: 1.1
  },
  button: {
    fontFamily: 'SF-Pro-Rounded-Medium',
    width: '100%',
    height: 50,
    fontSize: 18,
    backgroundColor: '#fff',
    letterSpacing: 1.1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20
  },
  buttonText: {
    color: 'hsla(200, 100%, 60%, 1)',
    fontSize: 18,
  }
})

export default () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const insets = useSafeArea()

  const submit = async () => {
    if(!username || !password) return

    const loginResult = await login({username, password})

    if(loginResult) setCredentials({username, password})
  }

  return (
    <View style={[Styles.container, {paddingTop: insets.top}]}>
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
          placeholderTextColor="hsla(0, 0%, 100%, 0.6)"
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
          placeholderTextColor="hsla(0, 0%, 100%, 0.6)"
        />
        <TouchableOpacity
          style={[Styles.button]}
          onPress={submit}
        >
          <Text style={[Styles.buttonText]}>Login</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  )
}
