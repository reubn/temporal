import {addSeconds, addMinutes, subMinutes, isAfter} from 'date-fns'

import PushNotificationIOS from '@react-native-community/push-notification-ios'

import initial from '../store/initials/days'

const alertBeforeMinutes = 30

export default async ({getState, dispatch, subscribe}) => {
  PushNotificationIOS.requestPermissions()
  // PushNotificationIOS.cancelAllLocalNotifications()

  let previousDays = initial

  subscribe(async () => {
    const {days} = getState()

    if(days === previousDays) return console.log('no days change')
    previousDays = days

    const now = new Date()
    const cutOff = addMinutes(now, 15)

    const alreadyScheduledIds = (await new Promise(resolve => PushNotificationIOS.getScheduledLocalNotifications(resolve))).map(({userInfo: {id}}) => id)

    const events = days.flatMap(({events}) => events)

    const notificationsToSchedule = events.filter(({start, id}) => !alreadyScheduledIds.includes(id) && isAfter(start, cutOff))
    const notificationsToCancel = alreadyScheduledIds.filter(_id => !events.find(({id}) => id === _id))

    console.log('alreadyScheduled', alreadyScheduledIds.length)
    console.log('notificationsToSchedule', notificationsToSchedule.length)
    console.log('notificationsToCancel', notificationsToCancel.length)

    notificationsToSchedule.forEach(({id, start, title, location: {description}}) =>
      PushNotificationIOS.scheduleLocalNotification({
        fireDate: subMinutes(start, alertBeforeMinutes).toISOString(),
        alertTitle: title,
        alertBody: description,
        userInfo: {id}
      })
    )

    notificationsToCancel.forEach(id => PushNotificationIOS.cancelLocalNotifications({id}))

    const nowScheduled = (await new Promise(resolve => PushNotificationIOS.getScheduledLocalNotifications(resolve))).map(({userInfo: {id}}) => id)
    console.log('nowScheduled', nowScheduled.length)
  })
}
