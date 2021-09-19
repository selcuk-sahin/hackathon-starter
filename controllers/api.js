const axios = require('axios');

/**
 * GET /api
 * List of API examples.
 */
exports.getApi = (req, res) => {
  res.render('api/index', {
    title: 'API Examples'
  });
};

/**
 * GET /api/chart
 * Chart example.
 */
exports.getChart = async (req, res, next) => {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&outputsize=compact&apikey=${process.env.ALPHA_VANTAGE_KEY}`;
  axios.get(url)
    .then((response) => {
      const arr = response.data['Time Series (Daily)'];
      let dates = [];
      let closing = []; // stock closing value
      const keys = Object.getOwnPropertyNames(arr);
      for (let i = 0; i < 100; i++) {
        dates.push(keys[i]);
        closing.push(arr[keys[i]]['4. close']);
      }
      // reverse so dates appear from left to right
      dates.reverse();
      closing.reverse();
      dates = JSON.stringify(dates);
      closing = JSON.stringify(closing);
      res.render('api/chart', {
        title: 'Chart',
        dates,
        closing
      });
    }).catch((err) => {
      next(err);
    });
};

/**
 * GET /api/upload
 * File Upload API example.
 */

exports.getFileUpload = (req, res) => {
  res.render('api/upload', {
    title: 'File Upload'
  });
};

exports.postFileUpload = (req, res) => {
  req.flash('success', { msg: 'File was uploaded successfully.' });
  res.redirect('/api/upload');
};