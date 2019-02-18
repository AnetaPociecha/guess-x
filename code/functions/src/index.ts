'use strict';

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { dialogflow, UpdatePermission } from 'actions-on-google'
import { XServiceBuilder } from './xServiceBuilder'
import { XService } from './xService';
import { SubsciberFinder } from './subscriberFinder'
import * as intents from './config/intents'
import { NotificationManager } from './notificationManager';
import { DATABASE_X_REF_NAME } from './config/constants'

const app: any = dialogflow({debug: true})

admin.initializeApp()
const database: any = admin.database()

const xServiceBuilder: XServiceBuilder = new XServiceBuilder(database)
const xService: XService = xServiceBuilder.buildService()
const subsciberFinder: SubsciberFinder = new SubsciberFinder(database)
const notificationManager: NotificationManager = new NotificationManager(
    intents.NOTIFICATION_RESPONSE, subsciberFinder)

app.intent(intents.DEFAULT_WELCOME, (conv: any) => {
    conv.ask('Welcome to Guess X app')
})

app.intent(intents.GET_X, async (conv: any) => {
    const snapshot: any = await xService.getCurrentX()
    conv.ask(`Our current x is ${snapshot.val()}`)
});

app.intent(intents.BYE, (conv: any) => {
    conv.close('Goodbye')
})

app.intent(intents.DELETE, (conv: any) => {
    const convId = getConvId(conv)
    notificationManager.deleteSubscriber(convId)
    conv.ask('Sending notifications was canceled')
})

app.intent(intents.SETUP_PUSH, (conv: any) => {
    conv.ask(new UpdatePermission({intent: intents.NOTIFICATION_RESPONSE}));
});
  
app.intent(intents.FINISH_SETUP_PUSH, async (conv: any) => {
    if (conv.arguments.get('PERMISSION')) {
        const convId = getConvId(conv)
        const notifId =  getNotifId(conv) 
        await notificationManager.addSubscriber(convId, notifId)

        conv.ask(`Great, we will be sending you notice`);
        
    } else {
        conv.ask(`Ok, you will not get any x notice`);
    }
});

app.intent(intents.NOTIFICATION_RESPONSE, (conv: any) => {
    conv.ask('notification response');
});
  
export const converse = functions.https.onRequest(app)

export const updateX = functions.https.onRequest((req, res) => {
    xService.updateX()
});

export const sendNotifications = functions.database.ref(DATABASE_X_REF_NAME)
    .onWrite((change, context) => {
        const currentX: number = change.after.val();
        notificationManager.sendNotification(currentX)
    });


const getConvId = (conv: any): string => (conv.user.id)
const getNotifId = (conv: any): string => (conv.arguments.get('UPDATES_USER_ID'))