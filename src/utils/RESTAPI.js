export const getRequest = async (url, requestType, queriesObject) => {
  if (requestType) {
    url += "/" + requestType;
  }
  if (queriesObject) {
    url += "?";
    for (let key in queriesObject) {
      url += key + "=" + queriesObject[key] + "&";
    }
    url = url.slice(0, -1);
  }
  const responseBody = await fetch(url)
    .then((response) => response.json())
    .then((json) => {
      return json;
    });
  return responseBody;
};

export const postRequest = async (url, requestType, dataObject) => {
  if (requestType) {
    url += "/" + requestType;
  }
  const responseBody = await fetch(url, {
    method: "POST",
    body: JSON.stringify(dataObject),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => {
      return json;
    });
  return responseBody;
};
