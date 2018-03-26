export const randomBytes = jest.fn((size, callback) => {
  const hexString = '0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF';
  const sizedHexString = hexString.substr(0, size * 2);
  const randomBuffer = new Buffer(sizedHexString, 'hex');

  if (callback) {
    return callback(null, randomBuffer);
  }

  return randomBuffer;
});
