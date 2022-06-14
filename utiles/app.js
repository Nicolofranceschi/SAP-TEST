import fetch from 'node-fetch';



const serviceLayerHeaders = { headers: { "Content-Type": "text/plain" } };
const serviceLayerURL = "https://192.168.30.146:50100/b1s/v1/";

async function apiFetch(url, options) {
  const fullOptions = { ...options, ...serviceLayerHeaders };
  const res = fetch(`${serviceLayerURL}${url}`, fullOptions);
  return res;
}

export async function apiCall(url, options) {
  const res = await apiFetch(url, options);
  return res.json();
}


export async function serviceLayerLogin(serviceLayerParams) {
  const result = await apiFetch('Login', { method: "POST", body: serviceLayerParams });
  serviceLayerHeaders.headers.cookie = result.headers.get('set-cookie');
  return result;
}

export async function serviceLayerLogout() {
  apiFetch("Logout", { method: "POST" });
}




