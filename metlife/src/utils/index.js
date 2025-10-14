export const getToken = () => {
  const data = JSON.parse(localStorage.getItem("authDetails"));
  return data?.access_token;
};

export const downloadCSV = (response, name = "data") => {
  const blob = new Blob([response.data], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const getLoggedInUserType = () => {
  const data = localStorage.getItem("authDetails");
  const parsedData = JSON.parse(data);

  return parsedData?.role_id;
};

export const USERS = {
  SUPER_ADMIN: 1,
  SUPPORT_USER: 2,
};

export const formatNumberWithCommas = (input) => {
  const num = Number(input);
  if (isNaN(num)) return "";

  return num.toLocaleString("en-US");
};
