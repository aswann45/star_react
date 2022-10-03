class ApiClient {
  constructor() {
    this.base_url = '/api';
  }

  async request(options) {
    let query = new URLSearchParams(options.query || {}).toString();
    if (query !== '') {
      query = '?' + query;
    }

    let response;
    try {
      response = await fetch(this.base_url + options.url + query, {
        method: options.method,
        headers: {
          ...(!options.headers && {'Content-Type': 'application/json'}),
          ...options.headers,
        },
        body: (options.body ?
          JSON.stringify(options.body) :
          options.formData ? 
            options.formData :
            null
          ),
        signal: (options.signal ? options.signal : null)
      });
    }
    catch (error) {
      response = {
        ok: false,
        status: 500,
        json: async () => { return {
          code: 500,
          message: 'The server is unresponsive',
          description: error.toString(),
        }; }
      }
    }

    const responseHeaders = response && response['headers'];
    const contentType = responseHeaders && responseHeaders.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
      return {
        ok: response.ok,
        status: response.status,
        body: response.status !== 204 ?  await response.json() : null,
      }
    } else {
      return (response);
    }
  }

  async get(url, query, options) {
    return this.request({method: 'GET', url, query, ...options});
  }

  async post(url, query, options) {
    return this.request({method: 'POST', url, query, ...options});
  }

  async put(url, query, options) {
    return this.request({method: 'PUT', url, query, ...options});
  }

  async delete(url, query, options) {
    return this.request({method: 'DELETE', url, query, ...options});
  }

  async login(options) {
    const response = await this.request({
        method: 'GET',
        url: '/auth/login',
        query: '',
        ...options
      })
      if (!response.ok) {
        return response.status === 401 ? 'fail' : 'error';
      }
      localStorage.setItem('currentUserID', response.body.ID)
      return response;
  }

  async logout(options) {
    const response = await this.request({
      method: 'POST',
      url: 'auth/logout',
      query: '',
      ...options
    })
    if (!response.ok) {
      return response.status === 401 ? 'fail' : 'error';
    }
    localStorage.removeItem('currentUserID');
  }

  getCurrentUser() {
    return localStorage.getItem('currentUserID') !== null;
  }

}

export default ApiClient;
