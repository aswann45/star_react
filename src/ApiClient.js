class ApiClient {
  constructor() {
    this.base_url = '';
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
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : null,
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

    return {
      ok: response.ok,
      status: response.status,
      body: response.status !== 204 ? await response.json() : null
    };
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
}

export default ApiClient;
