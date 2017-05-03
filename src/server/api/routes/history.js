const apiUtil = require('../utils/apiUtil')

module.exports = (app) => {
  // Returns the USD price per coin history for given timeframe and coin
  app.get('/api/v1/history/:timeframe?/:coin?', (req, res) => {
    let validTimeframes = ['1day', '7day', '30day', '90day', '180day', '365day']
    if (req.params.timeframe && validTimeframes.includes(req.params.timeframe) === false) {
      return res.json({ error: 'unsupported timeframe requested' })
    }
    apiUtil.getHistory(req.params.timeframe).then((data) => {
      if (!req.params.coin) return res.json(data)
      // else...
      let coin = req.params.coin.toUpperCase()
      if (Object.keys(data).includes(coin) === false) return res.json({ error: 'unsupported coin requested' })
      // else...
      // return just the data for requested coin with an IIFE
      return res.json((() => {
        let x = {}
        x[coin] = data[coin]
        return x
      })())
    })
  })
}
