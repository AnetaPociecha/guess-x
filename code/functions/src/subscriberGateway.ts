import { DATABASE_SUBSCRIBERS_REF_NAME } from './config/constants'

interface ISubscriberGateway {
    convId: string
    notifId: string
    insert(): void
    delete(): void
}

export class SubscriberGateway implements ISubscriberGateway {
    private _database: any
    constructor(public convId: string, public notifId: string, database: any) {
        this._database = database
    }

    insert() {
        const updates: object = this.getUpdateData();
        this._database.ref().update(updates);
    }

    delete() {
        const refName: string = this.getReference()
        this._database.ref(refName).remove()
    }

    private getUpdateData(): object {
        const updates: object = {};
        const name: string = this.getReference()
        updates[name] = this.notifId
        return updates
    }

    private getReference = (): string => ('/' + DATABASE_SUBSCRIBERS_REF_NAME + '/' + this.convId)
}