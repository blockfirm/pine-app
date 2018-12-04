import * as api from '../../../../../src/api';

import {
  getEstimate,
  BITCOIN_FEES_GET_ESTIMATE_REQUEST,
  BITCOIN_FEES_GET_ESTIMATE_SUCCESS,
  BITCOIN_FEES_GET_ESTIMATE_FAILURE
} from '../../../../../src/actions/bitcoin/fees/getEstimate';

const dispatchMock = jest.fn();

const getStateMock = jest.fn(() => ({
  settings: {
    api: {
      baseUrl: 'aa3e79cc-7467-4785-92f9-05c59ea3b7ea'
    },
    bitcoin: {
      fee: {
        level: 'Normal',
        satoshisPerByte: 100
      }
    }
  }
}));

jest.mock('../../../../../src/api', () => ({
  bitcoin: {
    fees: {
      estimate: {
        get: jest.fn(() => Promise.resolve(4.7))
      }
    }
  }
}));

describe('BITCOIN_FEES_GET_ESTIMATE_REQUEST', () => {
  it('equals "BITCOIN_FEES_GET_ESTIMATE_REQUEST"', () => {
    expect(BITCOIN_FEES_GET_ESTIMATE_REQUEST).toBe('BITCOIN_FEES_GET_ESTIMATE_REQUEST');
  });
});

describe('BITCOIN_FEES_GET_ESTIMATE_SUCCESS', () => {
  it('equals "BITCOIN_FEES_GET_ESTIMATE_SUCCESS"', () => {
    expect(BITCOIN_FEES_GET_ESTIMATE_SUCCESS).toBe('BITCOIN_FEES_GET_ESTIMATE_SUCCESS');
  });
});

describe('BITCOIN_FEES_GET_ESTIMATE_FAILURE', () => {
  it('equals "BITCOIN_FEES_GET_ESTIMATE_FAILURE"', () => {
    expect(BITCOIN_FEES_GET_ESTIMATE_FAILURE).toBe('BITCOIN_FEES_GET_ESTIMATE_FAILURE');
  });
});

describe('getEstimate', () => {
  beforeEach(() => {
    api.bitcoin.fees.estimate.get.mockClear();
  });

  it('is a function', () => {
    expect(typeof getEstimate).toBe('function');
  });

  it('returns a function', () => {
    const returnValue = getEstimate();
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = getEstimate();
    });

    it('dispatches an action of type BITCOIN_FEES_GET_ESTIMATE_REQUEST', () => {
      returnedFunction(dispatchMock, getStateMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: BITCOIN_FEES_GET_ESTIMATE_REQUEST
      });
    });

    it('gets the estimate with api.bitcoin.fees.estimate.get() together with baseUrl from settings', () => {
      expect.hasAssertions();

      return returnedFunction(dispatchMock, getStateMock).then(() => {
        const expectedOptions = {
          baseUrl: 'aa3e79cc-7467-4785-92f9-05c59ea3b7ea'
        };

        expect(api.bitcoin.fees.estimate.get).toHaveBeenCalledTimes(1);
        expect(api.bitcoin.fees.estimate.get).toHaveBeenCalledWith(1, expectedOptions);
      });
    });

    it('returns a Promise', () => {
      const returnValue = returnedFunction(dispatchMock, getStateMock);
      expect(returnValue).toBeInstanceOf(Promise);
    });

    describe('the promise', () => {
      let promise;

      beforeEach(() => {
        promise = returnedFunction(dispatchMock, getStateMock);
      });

      it('dispatches an action of type BITCOIN_FEES_GET_ESTIMATE_SUCCESS with the estimate', () => {
        expect.hasAssertions();

        return promise.then((satoshisPerByte) => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: BITCOIN_FEES_GET_ESTIMATE_SUCCESS,
            satoshisPerByte
          });
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by returning a rejected promise from api.bitcoin.fees.estimate.get().
        api.bitcoin.fees.estimate.get.mockImplementationOnce(() => Promise.reject(
          new Error('c0a36a27-1c33-405c-ad10-8e997d055b99')
        ));

        promise = getEstimate()(dispatchMock, getStateMock);
      });

      it('rejects the returned promise', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('c0a36a27-1c33-405c-ad10-8e997d055b99');
        });
      });

      it('dispatches an action of type BITCOIN_FEES_GET_ESTIMATE_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: BITCOIN_FEES_GET_ESTIMATE_FAILURE,
            error
          });
        });
      });
    });
  });

  describe('when the fee level has been set to High', () => {
    it('increases the estimated fee rate by 150%', () => {
      expect.hasAssertions();

      getStateMock.mockImplementationOnce(() => ({
        settings: {
          api: {
            baseUrl: 'aa3e79cc-7467-4785-92f9-05c59ea3b7ea'
          },
          bitcoin: {
            fee: {
              level: 'High',
              satoshisPerByte: 100
            }
          }
        }
      }));

      return getEstimate()(dispatchMock, getStateMock).then((satoshisPerByte) => {
        const expectedFeeRate = Math.round(4.7 * 1.5);
        expect(satoshisPerByte).toBe(expectedFeeRate);
      });
    });
  });

  describe('when the fee level has been set to Normal', () => {
    it('leaves the estimated fee rate at 100%', () => {
      expect.hasAssertions();

      getStateMock.mockImplementationOnce(() => ({
        settings: {
          api: {
            baseUrl: 'aa3e79cc-7467-4785-92f9-05c59ea3b7ea'
          },
          bitcoin: {
            fee: {
              level: 'Normal',
              satoshisPerByte: 100
            }
          }
        }
      }));

      return getEstimate()(dispatchMock, getStateMock).then((satoshisPerByte) => {
        const expectedFeeRate = Math.round(4.7);
        expect(satoshisPerByte).toBe(expectedFeeRate);
      });
    });
  });

  describe('when the fee level has been set to Low', () => {
    it('decreases the estimated fee rate by 50%', () => {
      expect.hasAssertions();

      getStateMock.mockImplementationOnce(() => ({
        settings: {
          api: {
            baseUrl: 'aa3e79cc-7467-4785-92f9-05c59ea3b7ea'
          },
          bitcoin: {
            fee: {
              level: 'Low',
              satoshisPerByte: 100
            }
          }
        }
      }));

      return getEstimate()(dispatchMock, getStateMock).then((satoshisPerByte) => {
        const expectedFeeRate = Math.round(4.7 * 0.5);
        expect(satoshisPerByte).toBe(expectedFeeRate);
      });
    });
  });

  describe('when the fee level has been set to Very Low', () => {
    it('decreases the estimated fee rate by 75%', () => {
      expect.hasAssertions();

      getStateMock.mockImplementationOnce(() => ({
        settings: {
          api: {
            baseUrl: 'aa3e79cc-7467-4785-92f9-05c59ea3b7ea'
          },
          bitcoin: {
            fee: {
              level: 'Very Low',
              satoshisPerByte: 100
            }
          }
        }
      }));

      return getEstimate()(dispatchMock, getStateMock).then((satoshisPerByte) => {
        const expectedFeeRate = Math.round(4.7 * 0.25);
        expect(satoshisPerByte).toBe(expectedFeeRate);
      });
    });
  });

  describe('when the fee level has been set to Custom', () => {
    it('returns the custom fee rate', () => {
      expect.hasAssertions();

      getStateMock.mockImplementationOnce(() => ({
        settings: {
          api: {
            baseUrl: 'aa3e79cc-7467-4785-92f9-05c59ea3b7ea'
          },
          bitcoin: {
            fee: {
              level: 'Custom',
              satoshisPerByte: 384
            }
          }
        }
      }));

      return getEstimate()(dispatchMock, getStateMock).then((satoshisPerByte) => {
        const expectedFeeRate = 384;
        expect(satoshisPerByte).toBe(expectedFeeRate);
      });
    });

    it('does not call the API to get an estimate', () => {
      expect(api.bitcoin.fees.estimate.get).toHaveBeenCalledTimes(0);
    });
  });

  describe('when ignoreFeeLevel is set to true', () => {
    it('returns the fee from the API and does not adjust the fee', () => {
      const numberOfBlocks = 1;
      const ignoreFeeLevel = true;

      expect.hasAssertions();

      getStateMock.mockImplementationOnce(() => ({
        settings: {
          api: {
            baseUrl: 'aa3e79cc-7467-4785-92f9-05c59ea3b7ea'
          },
          bitcoin: {
            fee: {
              level: 'Custom',
              satoshisPerByte: 9582
            }
          }
        }
      }));

      return getEstimate(numberOfBlocks, ignoreFeeLevel)(dispatchMock, getStateMock)
        .then((satoshisPerByte) => {
          const expectedFeeRate = Math.round(4.7);
          expect(satoshisPerByte).toBe(expectedFeeRate);
        });
    });
  });
});
