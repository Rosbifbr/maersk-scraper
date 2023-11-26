const express = require('express')
const maersk_scraper = require('../src/maersk_scraper')
const router = express.Router()

router.get('/maersk/active_ports', async (req, res) => {
  res.json(await maersk_scraper.get_active_ports());
})

router.get('/maersk/port_events?', async (req, res) => {
  const {port_code, date_start, date_end} = req.query
  res.json(await maersk_scraper.get_port_events(port_code, date_start, date_end));
})

// router.get('/maersk/ship_events_processed?', async (req, res) => {
//   // const [port_code, date_start, date_end] = req.query
//   // res.send(await maersk.get_port_events(port_code, date_start, date_end));
//   res.send("Not implemented yet");
// })

module.exports = router