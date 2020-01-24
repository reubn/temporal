import React, {useState} from 'react'
import {View, Text} from 'react-native'

import {differenceInHours} from 'date-fns'

export default ({event: {start, end, category, title}}) => {
  const length = differenceInHours(end, start)
  // console.log({category, start, end, length})
  const style = [{
    height: length * 100,
    width: '100%',
    backgroundColor: '#'+Math.floor(Math.random()*16777215).toString(16)
  }]
  return <View style={style}>
    <Text>{title}</Text>
    <Text>{category}</Text>
    <Text>{title}</Text>
  </View>
}
