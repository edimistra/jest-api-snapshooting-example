// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { startDatabase, shutdownDatabase } = require('./database/mongo');
const { insertAd, getAds, deleteAd, updateAd } = require('./database/ads');

// defining the Express app
const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// endpoint to insert new items
app.post('/', async (req, res) => {
  const newAd = await insertAd(req.body);
  res.send({ message: 'New ad inserted.', ad: newAd });
});

// defining an endpoint to return all ads
app.get('/', async (req, res) => {
  res.send(await getAds());
});

// endpoint to delete an ad
app.delete('/:id', async (req, res) => {
  await deleteAd(req.params.id);
  res.send({ message: 'Ad removed.' });
});

// endpoint to update an ad
app.put('/:id', async (req, res) => {
  const updatedAd = req.body;
  await updateAd(req.params.id, updatedAd);
  res.send({ message: 'Ad updated.' });
});

let serverInstance;

module.exports = {
  server: async function () {
    await startDatabase();

    // starting the server
    serverInstance = app.listen(3001, () => {
      console.log('listening on port 3001');
    });
  },
  close: async function () {
    return new Promise(async (res) => {
      await shutdownDatabase();

      serverInstance.close((err) => {
        if (err) rej(err);
        console.log('server closed');
        res();
      });
    });
  },
};
