// Mock en memoria de AsyncStorage para Jest.
let store = {};
module.exports = {
  setItem: jest.fn((k, v) => {
    store[k] = v;
    return Promise.resolve(null);
  }),
  getItem: jest.fn(k => Promise.resolve(k in store ? store[k] : null)),
  removeItem: jest.fn(k => {
    delete store[k];
    return Promise.resolve(null);
  }),
  clear: jest.fn(() => {
    store = {};
    return Promise.resolve(null);
  }),
};
