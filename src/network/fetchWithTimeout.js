const fetchWithTimeout = (url, options, timeout) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Request timed out'));
    }, timeout);

    fetch(url, options)
      .then(resolve)
      .catch(reject)
      .finally(() => {
        clearTimeout(timer);
      });
  });
};

export default fetchWithTimeout;
