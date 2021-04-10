const { expect, test } = require('@jest/globals');
const axios = require('axios');
const { server, close } = require('../src/server');

function sanitize(data, keys) {
  return keys.reduce((result, key) => {
    const val = _.get(result, key);
    if (!val || _.isArray(val) || _.isObject(val)) {
      return result;
    } else {
      return _.set(_.cloneDeep(result), key, '[SANITIZED]');
    }
  }, data);
}

describe('Run all API tests', () => {
  beforeAll(async () => {
    await server();
  });

  afterAll(async () => {
    await close();
  });

  test('Get all Ads', async () => {
    // make sure there is an item on the database
    await axios.post('http://localhost:3001', {
      title: 'Soap',
      price: 1.3,
    });

    // get all items
    const response = await axios.get('http://localhost:3001');
    expect(response).toMatchSnapshot();
  });

  test('Insert a new Ad', async () => {
    // insert brand new item
    const response = await axios.post('http://localhost:3001', {
      title: 'Pizza',
      price: 10.5,
    });

    // verify the response
    expect(response).toMatchSnapshot();
  });
});
