export function prepareSuccess(data) {
  return {
    status: 200,
    message: "OK",
    data: data
  };
}

export function throwError(res, err) {
  const data = {
    status: 500,
    message: err.message || err
  };
  res.status(500).json(data);
}
