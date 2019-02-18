import { IRandomStrategy } from './randomStrategy'
import { MAX_NUMBER, MIN_NUMBER } from './config/constants'

export class RandomNumberStrategy implements IRandomStrategy {
    getRandomX() {
        const random: number = Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER)) + MIN_NUMBER; 
        return random;
    }
}