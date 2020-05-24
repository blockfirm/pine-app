export const PERMISSIONS = {
  IOS: {
    CAMERA: 'CAMERA'
  }
};

export const RESULTS = {
  DENIED: 'DENIED',
  GRANTED: 'GRANTED'
};

export const check = () => Promise.resolve(RESULTS.GRANTED);

