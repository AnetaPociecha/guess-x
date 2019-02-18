import { SubsciberFinder} from "./subscriberFinder";
import * as key from './config/serviceAccountKey.json'
const { google } = require('googleapis');
const request = require('request')
import { LOCALE } from './config/constants'
import { SubscriberGateway } from "./subscriberGateway";

interface INotificationManager {
    sendNotification(currentX: number): Promise<any>
    addSubscriber(convId: string, notifId: string): Promise<any>
    deleteSubscriber(convId: string): Promise<any>
}

export class NotificationManager implements INotificationManager {
    private _intentName: string
    private _subsciberFinder: SubsciberFinder

    constructor(intentName: string, subsciberFinder: SubsciberFinder) {
        this._intentName = intentName
        this._subsciberFinder = subsciberFinder
    }

    async addSubscriber(convId: string, notifId: string): Promise<any> {
        const subscriber: any = await this._subsciberFinder.find(convId)
        if(!subscriber.exists()) {
            const newSubscriber: SubscriberGateway = new SubscriberGateway(
                convId, notifId, this._subsciberFinder.database)
            newSubscriber.insert()
        }
        return true
    }

    async deleteSubscriber(convId: string): Promise<any> {
        const snapshot: any = await this._subsciberFinder.find(convId)
        if(snapshot.exists()) {
            const notifId = snapshot.val()
            const subscriber = new SubscriberGateway(
                convId, notifId, this._subsciberFinder.database)
            subscriber.delete()
        }
        return true
    }

    async sendNotification(currentX: number) {
        const notifTitle: string = 'Our current X is ' + currentX
        const jwtClient: any = this.getJwtClient()
        const subscibers: SubscriberGateway[] = await this._subsciberFinder.findAll()

        subscibers.forEach(subsciber => {
            console.log('notifId: ' + subsciber.notifId)
            console.log('notifTitle: ' + notifTitle)

            jwtClient.authorize( (err, tokens) => {
                const notif = {
                    userNotification: {
                        title: notifTitle,
                    },
                    target: {
                        userId: subsciber.notifId,
                        intent: this._intentName,
                        locale: LOCALE
                    },
                };
                console.log('notif: '+ JSON.stringify(notif))            
                request.post('https://actions.googleapis.com/v2/conversations:send', 
                    {
                        'auth': 
                        {
                            'bearer': tokens.access_token,
                        },
                        'json': true,
                        'body': 
                        {
                            'customPushMessage': notif 
                        },
                    }, 
                    (err, httpResponse, body) => 
                    {
                        console.log(httpResponse.statusCode + ': ' + httpResponse.statusMessage);
                    }
                );
            });
        })
        return true
    }

    private getJwtClient(): any {
        return new google.auth.JWT(
            key.client_email, null, key.private_key,
            ['https://www.googleapis.com/auth/actions.fulfillment.conversation'],
            null
        );
    }
}