async function request(url = '', method = 'GET', data) {
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ACCESS_TOKEN`,
    },
    body: data ? JSON.stringify(data) : undefined,
  });
  if (res.status > 400) {
    const error = await res.json();
    const e = new Error(res.status);
    e.error = error;
    e.status = res.status;
    throw e;
  }
  const result = await res.json();
  return result;
}

export default request;
