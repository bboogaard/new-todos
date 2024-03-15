import { useCookies } from 'react-cookie';


class Client {

  constructor(settings) {
    this.apiUrl = settings.apiUrl;
    this.accessTokenExpire = settings.accessTokenExpireMinutes * 60000;
    this.cookies = settings.cookies;
    this.setCookie = settings.setCookie;
    this.removeCookie = settings.removeCookie;
    this.token = '';
    this.username = '';
  }

  isAuthenticated() {
    this.token = this.cookies.todosToken !== undefined ? this.unpackCookie(this.cookies.todosToken) : '';
    this.username = this.cookies.todosUser;
    return this.token !== "";
  }

  packCookie(value) {
    return JSON.stringify({
      value: value,
      expires: new Date().getTime() + this.accessTokenExpire
    });
  }

  unpackCookie(value) {
    return new Date().getTime() < value.expires ? value.value : '';
  }

  async login(username, password) {
    let self = this;

    this.username = username;
    this.password = password;
    const response = await this.getToken().then( (res) => {
      if (res.ok) {
        self.token = res.json.access_token;
        this.setCookie('todosToken', self.packCookie(self.token), { sameSite: 'strict', secure: true, path: '/' });
        this.setCookie('todosUser', self.username);
      }
      return res;
    });
    return response;
  }

  logout() {
    this.removeCookie('todosToken');
    this.token = '';
  }

  async getWidgets() {
    const response = await this.getJson('/users/permissions/user/').then( (perms) => {
      return perms.ok ? perms.json : [];
    });
    return response;
  }

  async getToken() {
    let self = this;

    let data = new FormData();
    data.append("username", this.username);
    data.append("password", this.password);
    const response = await this.post('/users/tokens/token/', data).then( (res) => {
      return res;
    });
    return response;
  }

  async get(path, data) {
    path = data !== undefined ? path + '?' + this.buildQueryString(data) : path;
    return this.request("GET", path);
  }

  async post(path, data) {
    return this.request("POST", path, data);
  }

  async put(path, data) {
    return this.request("PUT", path, data);
  }

  async patch(path, data) {
    return this.request("PATCH", path, data);
  }

  async delete(path) {
    return this.request("DELETE", path);
  }

  async getJson(path, data) {
    path = data !== undefined && data !== null ? path + '?' + this.buildQueryString(data) : path;
    return this.request("GET", path, null, true);
  }

  async postJson(path, data) {
    return this.request("POST", path, data, true);
  }

  async putJson(path, data) {
    return this.request("PUT", path, data, true);
  }

  async patchJson(path, data) {
    return this.request("PATCH", path, data, true);
  }

  async deleteJson(path) {
    return this.request("DELETE", path, null, true);
  }

  buildQueryString(data) {
    return new URLSearchParams(data).toString();
  }

  async download(path) {
    let self = this;

    let headers = {};
    if (this.token) {
      headers["Authorization"] = "Bearer " + this.token;
    }
    const response = await fetch(this.apiUrl + path, {
      method: 'GET',
      mode: "cors",
      cache: "no-cache",
      headers: headers,
      referrerPolicy: "no-referrer"
    });
    return await response.blob();
  }

  async request(method, path, data, as_json) {   
    let self = this;

    let headers = {};
    if (this.token) {
      headers["Authorization"] = "Bearer " + this.token;
    }
    if (as_json) {
      headers["Content-Type"] = "application/json";
    }
    const response = await fetch(this.apiUrl + path, {
      method: method,
      mode: "cors",
      cache: "no-cache",
      headers: headers,
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: data ? (as_json ? JSON.stringify(data) : data) : null,
    }).then( async (res) => {
      try {
        const json = await res.json();
        return {
          ok: res.ok,
          json: json
        };
      }
      catch(error) {
        const json = {};
        return {
          ok: res.ok,
          json: json
        };
      }
    });
    return response;
  }

}

const ApiClient = () => {

  const [cookies, setCookie, removeCookie] = useCookies();
 
  return new Client({
    apiUrl: process.env.REACT_APP_API_URL,
    accessTokenExpireMinutes: parseInt(process.env.REACT_APP_ACCESS_TOKEN_EXPIRY_MINUTES, 10),
    cookies: cookies,
    setCookie: setCookie,
    removeCookie: removeCookie
  });

}

export default ApiClient;
