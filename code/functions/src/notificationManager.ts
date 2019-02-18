import { SubsciberFinder} from "./subscriberFinder";
import * as key from './config/serviceAccountKey.json'
const { google } = require('googleapis');
const request = require('request')
import { LOCALE } from './config/constants'
import { Subscriber } from "./subscriber";

interface INotificationManager {
    sendNotification(currentX: number): void
}

export class NotificationManager implements INotificationManager {
    private _intentName: string
    private _subsciberFinder: SubsciberFinder

    constructor(intentName: string, subsciberFinder: SubsciberFinder) {
        this._intentName = intentName
        this._subsciberFinder = subsciberFinder
    }

    async sendNotification(currentX: number) {
        const notifTitle: string = 'Our current X is ' + currentX
        const jwtClient: any = this.getJwtClient()
        const subscibers: Subscriber[] = await this._subsciberFinder.findSubscribers()

        subscibers.forEach(subsciber => {
            console.log('userId: ' + subsciber.id)
            console.log('notifTitle: ' + notifTitle)

            jwtClient.authorize( (err, tokens) => {
                const notif = {
                    userNotification: {
                        title: notifTitle,
                    },
                    target: {
                        userId: subsciber.id,
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