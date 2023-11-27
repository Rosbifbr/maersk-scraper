const express = require('express')
const maersk_scraper = require('../src/maersk_scraper')
const router = express.Router()

router.get('/maersk/active_ports', async (req, res) => {
  res.json(await maersk_scraper.get_active_ports());
})

router.get('/maersk/port_info', async (req, res) => {
  let {port_name} = req.query
  let active_ports = await maersk_scraper.get_active_ports()
  let port = active_ports.ports.find(p => p['portName'] == port_name)
  if (port) res.json(port)
  else res.status(404).json({error: "Port not found."})
})

router.get('/maersk/port_events?', async (req, res) => {
  let {port_code, date_start, date_end} = req.query
  
  //Set default dates if not provided
  if ([date_start, date_end].includes(undefined)) {
    let now = new Date()
    date_start = now.toISOString().split('T')[0]
    now.setDate(now.getDate() + 20)
    date_end = now.toISOString().split('T')[0]
  }

  res.json(await maersk_scraper.get_port_events(port_code, date_start, date_end));
})

router.post('/maersk/ship_events', async (req, res) => {
  res.json(await maersk_scraper.get_ship_events(req.body));
})

module.exports = router