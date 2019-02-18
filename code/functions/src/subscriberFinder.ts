import { DATABASE_SUBSCRIBERS_REF_NAME } from './config/constants'
import { SubscriberGateway } from './subscriberGateway';

interface ISubscriberFinder {
    findAll(): Promise<SubscriberGateway[]>
    find(convId: string): Promise<SubscriberGateway>
}

export class SubsciberFinder implements ISubscriberFinder {
    private _database: any
    constructor(database: any) {
        this._database = database
    }

    async findAll(): Promise<SubscriberGateway[]> {
        const subscribers: SubscriberGateway[] = []
        const snapshot: any = await this._database.ref(
            DATABASE_SUBSCRIBERS_REF_NAME).once('value')
            
        snapshot && snapshot.forEach(child => {
            const convId: string = child.key
            const notifId: string = child.val()
            subscribers.push(new SubscriberGateway(convId, notifId, this._database))
        });
        return subscribers
    }

    find(convId: string): Promise<SubscriberGateway> {
        const refName: string = DATABASE_SUBSCRIBERS_REF_NAME + '/' + convId
        return this._database.ref(refName).once('value')
    }
    
    get database() {
        return this._database
    }
}