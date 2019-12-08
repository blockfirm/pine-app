const deserializeClientMessage = (message) => {
  try {
    return JSON.parse(message, (key, value) => {
      if (value && typeof value === 'object') {
        if (value.type === 'Buffer' && Array.isArray(value.data)) {
          return Buffer.from(value.data);
        }
      }

      return value;
    });
  } catch (error) {
    throw new Error(`Malformed message: ${error.message}`);
  }
};

export default deserializeClientMessage;

