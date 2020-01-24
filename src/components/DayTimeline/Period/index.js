import React, {useState} from 'react'
import {View, Text} from 'react-native'

import {differenceInHours} from 'date-fns'

export default ({style: externalStyle, event: {start, end, category, title}}) => {
  const length = differenceInHours(end, start)
  // console.log({category, start, end, length})
  const style = [{
    // position: 'absolute',
    top: 0,
    left: 0,
    height: (length * 100) - 7,
    width: '100%',
    backgroundColor: '#'+Math.floor(Math.random()*16777215).toString(16),
    borderRadius: 12,
    // marginBottom: 15,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }]
  return <View style={[externalStyle, style]}>
    <Text>{title}</Text>
    <Text>{category}</Text>
    <Text>{title}</Text>
  </View>
}
