const serializeErrorResponse = (response) => {
  return JSON.stringify({
    id: response.id,
    error: {
      name: response.error.name,
      message: response.error.message
    }
  });
};

const serializeResponse = (response) => {
  if (response.error) {
    return serializeErrorResponse(response);
  }

  return JSON.stringify({
    id: response.id,
    response: response.response
  });
};

export default serializeResponse;
