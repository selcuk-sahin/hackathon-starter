const axios = require('axios').default;

/**
 * Problem when sending 1.5 should be handled
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.postMint = async (req, res, next) => {
  console.log("post Mint")
  if (typeof req.body.amount === 'undefined') {
    // The parameter is missing, example response...
    res.status(400).json({
      status: 400,
      success: false,
      message: "Please specify a valid mint amount!",
      data: {}
    });
  }

  const countnft = req.body.amount;
  // 3 fiyatına 5 tane MİNT
  const lovelace = +countnft !== 5 ? +process.env.NFT_PRICE_LOVELACE_SINGLE * +countnft : +process.env.NFT_PRICE_LOVELACE_FIVE;
  const url = `https://api.nft-maker.io/GetAddressForRandomNftSale/${process.env.NFT_MAKER_KEY}/${process.env.NFT_MAKER_PROJECTID}/${countnft}/${lovelace}`;
  try {
    axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Connection': 'keep-alive'
      }
    }).then(nftMakerResponse=>{
      if(nftMakerResponse.status === 200){
        const message = `Successfully reserved ${countnft} NFT/s.`;
        const userResponse = {
          status: 200,
          success: true,
          message: message,
          data: nftMakerResponse.data 
        }
        res.status(200).send(userResponse);
      }
    }).catch(error => {
      if(error.status === 404 || error.status === 406){
        const userResponse = {
          status: error.status,
          success: false,
          message: error.status === 404 ? 'Sorry! All NFTs are minted' : 'Error in request!',
          data: {}
        }
        res.status(error.status).send(userResponse);
      }else{
        const userResponse = {
          status: error.status,
          success: false,
          message: error.data?.errorMessage ?? "Server Error",
          data: {}
        }
        res.status(error.status).send(userResponse);
      }
    })

  } catch (error) {
    const userResponse = {
      status: 500,
      success: false,
      message: "Server Error",
      data: {}
    }
    res.status(error.status).send(userResponse);
  }

}

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