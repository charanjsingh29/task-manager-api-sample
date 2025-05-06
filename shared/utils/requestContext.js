const { AsyncLocalStorage } = require('async_hooks');

const asyncLocalStorage = new AsyncLocalStorage();

const requestContext = {
    run: (data, callback) => {
      asyncLocalStorage.run(data, callback);
    },
    get: () => {
      return asyncLocalStorage.getStore();
    },
    set: (key, value) => {
      const store = asyncLocalStorage.getStore();
      if (store) store[key] = value;
    },
    getCurrentUser: () => {
        const store = asyncLocalStorage.getStore();
        return store ? store.user : null;
      },

  };
  
  module.exports = requestContext;