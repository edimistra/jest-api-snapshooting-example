const { expect, test } = require('@jest/globals');
const axios = require('axios');
const { server, close } = require('./src/server');

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

  afterAll(() => {
    close();
  });

  test('Get all Ads', (done) => {
    axios.get('http://localhost:3001').then(
      (response) => {
        expect(response).toMatchSnapshot();
        done();
      },
      (error) => {
        done(error);
      },
    );
  });

  test('Insert a new Ad', async () => {
    const response = await axios.post('http://localhost:3001', {
      title: 'Pizza',
      price: 10.5,
    });
    expect(response).toMatchSnapshot();
  });
});
