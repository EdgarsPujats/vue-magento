import { Router } from 'express';
import request from 'request';

module.exports = ({ config }) => {
  const api = Router();

  // Fetch Weather data
  api.get('/weather', (req, res) => {
    const { apiKey, location } = config.extensions.weatherApi;
    const { fetchCategory, ...queryStringParams } = req.query;
    let url = `http://api.weatherapi.com/v1/${fetchCategory}.json?key=${apiKey}&q=${location}`;
    for (const [key, value] of Object.entries(queryStringParams)) {
      url += `&${key}=${value}`;
    }

    request(
      {
        url,
        json: true
      },
      (error, response, body) => {
        let apiResult;
        const errorResponse = error || body.error;

        if (errorResponse) {
          apiResult = { code: 500, result: errorResponse };
        } else {
          apiResult = { code: 200, result: body };
        }

        res.status(apiResult.code).json(apiResult);
      }
    );
  });

  return api;
};
