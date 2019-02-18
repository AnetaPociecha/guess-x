import { IServiceBuilder } from './serviceBuilder' 
import { XService } from './xService';
import { RandomNumberStrategy } from './randomNumberStrategy';
import { DATABASE_X_REF_NAME } from './config/constants'

export class XServiceBuilder implements IServiceBuilder {
    private _database: any
    constructor(database: any) {
        this._database = database
    }
    
    buildService(): any {
        const databaseRef: any = this._database.ref(DATABASE_X_REF_NAME)
        const randomNumberStrategy: RandomNumberStrategy = new RandomNumberStrategy()
        const service: XService = new XService(databaseRef, randomNumberStrategy)
        return service
    }
}