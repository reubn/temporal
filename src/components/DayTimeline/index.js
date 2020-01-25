import React, {useState} from 'react'
import {View, Text} from 'react-native'

import Period from './Period'

import {compareAsc, isEqual, differenceInHours, addHours, format} from 'date-fns'

export default ({events}) => {
  const [data, setData] = useState(events)

  const periods = events.sort(({start: startA}, {start: startB}) => compareAsc(startA, startB)).reduce((array, event) => {
    const {start, end, id} = event

    const freeTime = array.length && !isEqual(array[array.length - 1].end, start)
      ? {category: 'free', start: array[array.length - 1].end, end: start}
      : undefined

    return [...array, ...(freeTime ? [freeTime, event] : [event])]
  }, [])

  const elements = periods.map((event, i, array) => <Period key={event.id || `free-${i}`} event={event}  />)

  const hours = Math.ceil(differenceInHours(periods[periods.length - 1].end, periods[0].start))

  return (
    <View style={{flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'row', marginTop: 30, marginBottom: 10}}>
    <View style={{height: differenceInHours(periods[periods.length - 1].end, periods[0].start) * 100, width: '20%', backgroundColor: 'green'}}>
      {Array.from({length: hours}, (_, i) => <View key={`scale-${i}`} style={{overflow: 'visible', height: 100, backgroundColor: '#fff'/*'#'+Math.floor(Math.random()*16777215).toString(16)*/}}>
        <Text style={{color:'hsl(0, 0%, 30%)', fontWeight: '500', fontSize: 16, position: 'relative', top: -10}}>{format(addHours(periods[0].start, i), 'h:mm')}</Text>
        <View style={{height:2, width: 10, borderRadius: 2, backgroundColor: 'hsl(0, 0%, 90%)', position:'absolute', top: '25%'}}/>
        <View style={{height:2, width: 20, borderRadius: 2, backgroundColor: 'hsl(0, 0%, 90%)', position:'absolute', top: '50%'}}/>
        <View style={{height:2, width: 10, borderRadius: 2, backgroundColor: 'hsl(0, 0%, 90%)', position:'absolute', top: '75%'}}/>
        {i == hours - 1 && <Text style={{color:'hsl(0, 0%, 30%)', fontWeight: '500', fontSize: 16, position: 'relative', position:'absolute', top: '100%', transform:[{translateY: -10}]}}>{format(addHours(periods[0].start, i + 1), 'h:mm')}</Text>}
      </View>)}
    </View>
    <View style={{width: '80%'}}>{elements}</View>
    </View>
  )
}


// <Period key={id} event={event} />
// <Period key={Math.random().toString()} event={{category: 'free', start: array[array.length - 1].end, end: start}} />
// style={{top: differenceInHours(event.start, array[0].start) * 70}}
