import { expect } from 'chai';
import 'mocha';
import { RandomNumberStrategy } from '../randomNumberStrategy'

describe('RandomNumberStrategy', () => {

  before(() => {
    this.strategy = new RandomNumberStrategy()
  })

  it('should return number', () => {
    const result = this.strategy.getRandomX()
    expect(result).to.be.a('number')
  });
});