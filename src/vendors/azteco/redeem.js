import { fetchWithTimeout } from '../../network';

const AZTECO_PINE_ENDPOINT = 'https://azte.co/pine_despatch.php';
const REQUEST_TIMEOUT = 60 * 1000; // 60 seconds.

/**
 * Redeems an Azteco bitcoin voucher.
 *
 * @param {string[]} voucher - 16-digit voucher code in groups of 4.
 * @param {string} address - Bitcoin address to send the redeemed bitcoin to.
 *
 * @returns {Promise} A promise that resolves when the voucher has been redeemed.
 */
const redeem = (voucher, address) => {
  const queryString = `CODE_1=${voucher[0]}&CODE_2=${voucher[1]}&CODE_3=${voucher[2]}&CODE_4=${voucher[3]}&ADDRESS=${address}`;
  const url = `${AZTECO_PINE_ENDPOINT}?${queryString}`;

  return fetchWithTimeout(url, null, REQUEST_TIMEOUT).then((response) => {
    if (!response.ok) {
      throw new Error(response.body);
    }
  });
};

export default redeem;
