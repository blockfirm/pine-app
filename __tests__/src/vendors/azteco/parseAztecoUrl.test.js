import parseAztecoUrl from '../../../../src/vendors/azteco/parseAztecoUrl';

describe('parseAztecoUrl', () => {
  it('is a function', () => {
    expect(typeof parseAztecoUrl).toBe('function');
  });

  it('accepts one argument', () => {
    expect(parseAztecoUrl.length).toBe(1);
  });

  it('returns an array with codes when the passed string is an Azteco URL', () => {
    const voucher = parseAztecoUrl('https://azte.co?c1=1234&c2=2345&c3=3456&c4=4567');

    expect(voucher).toEqual([
      '1234', '2345', '3456', '4567'
    ]);
  });
});
