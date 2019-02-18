import { expect } from 'chai';
import { XService } from '../xService'
import sinon from 'sinon'
import { RandomNumberStrategy } from '../randomNumberStrategy'

describe('XService', () => {
  before(() => {
    this.dbMock = {
      set: sinon.spy(),
      once: sinon.fake() // to do from here
    }
    const randMock = {
      getRandomX : sinon.fake.returns(1)
    }
    this.xService = new XService(this.dbMock, randMock)
  })

  it('should update x', () => {
    this.xService.updateX()
    expect(this.dbMock.set.calledOnce).to.equals(true)
    expect(this.dbMock.set.calledWith(1)).to.equals(true)
  });

  afterEach(() => {
    sinon.restore();
  });
});