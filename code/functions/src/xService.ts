import { IRandomStrategy } from './randomStrategy'

interface IService {
    getCurrentX(): Promise<any>
    updateX(): void
}

export class XService implements IService {
    private _databaseRef: any
    private _randomStrategy: IRandomStrategy
    
    constructor(databaseRef: any, randomStrategy: IRandomStrategy) {
        this._databaseRef = databaseRef
        this._randomStrategy = randomStrategy
    }

    async getCurrentX(): Promise<any> {
        const currentX: Promise<any> = await this._databaseRef.once('value')
        return currentX
    }

    updateX(): void {
        const newX: any = this._randomStrategy.getRandomX()
        this._databaseRef.set(newX)
    }
}