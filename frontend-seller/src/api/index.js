const env = "dev";
const NETWORK = "preprod";
const baseURL = {
  local: "https://localhost:443",
  dev: "https://pairfy.dev",
  prod: "https://pairfy.io",
};

const HOST = baseURL[env];

export { env, baseURL, HOST, NETWORK };
