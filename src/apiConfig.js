const isDevelopment = process.env.NODE_ENV === "development";
const baseURL = isDevelopment
  ? "http://localhost:5001"
  : isDevelopment
  ? ""
  : "";

export default baseURL;
