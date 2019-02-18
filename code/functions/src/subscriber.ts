interface ISubscriber {
    id: string
}
export class Subscriber implements ISubscriber {
    constructor(public id: string) {}
}