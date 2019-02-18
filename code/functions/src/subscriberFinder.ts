import { DATABASE_SUBSCRIBERS_REF_NAME } from './config/constants'
import { Subscriber } from './subscriber';

interface ISubscriberFinder {
    addSubscriber(userId: string): void
    findSubscribers(): Promise<Subscriber[]>
}

export class SubsciberFinder implements ISubscriberFinder {
    private _database: any
    constructor(database: any) {
        this._database = database
    }

    addSubscriber(userId: string): void {
        const newSubscriberKey: string = this.getNewSubscriberKey()
        const updates: object = this.getUpdateData(newSubscriberKey, userId);
        this._database.ref().update(updates);
    }

    async findSubscribers(): Promise<Subscriber[]> {
        const subscribers: Subscriber[] = []
        const snapshot: any = await this._database.ref(DATABASE_SUBSCRIBERS_REF_NAME).once('value')
        snapshot && snapshot.forEach(child => {
            const id: string = child.val()
            subscribers.push(new Subscriber(id))
        });
        return subscribers
    }

    private getNewSubscriberKey(): string {
        const key: string = this._database.ref().child(DATABASE_SUBSCRIBERS_REF_NAME).push().key
        return key
    }

    private getUpdateData(key: string, value: string): object {
        const updates: object = {};
        const name: string = '/' + DATABASE_SUBSCRIBERS_REF_NAME + '/' + key 
        updates[name] = value
        return updates
    }
}