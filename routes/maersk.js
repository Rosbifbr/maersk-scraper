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
  //Set default dates if not provided by requester
  if (!(date_start && date_end)) ({date_start, date_end} = date_params_fallback())

  res.json(await maersk_scraper.get_port_events(port_code, date_start, date_end));
})

router.post('/maersk/ship_events', async (req, res) => {
  res.json(await maersk_scraper.get_ship_events(req.body));
})

router.get('/maersk/aggregated_ship_info', async (req, res) => {
  let {port_names, date_start, date_end} = req.query
  if (!(date_start && date_end)) ({date_start, date_end} = date_params_fallback())

  let port_ids = {}
  let port_events = []
  let ship_events = []

  for (let name of port_names.split(',')){
    let active_ports = await maersk_scraper.get_active_ports()
    let port = active_ports.ports.find(p => p['portName'] == name)
    if (port) port_ids['name'] = port['portCode']
    else {
      res.status(404).json({error: "One of the specified ports was not found."}) //Erroring out in case a port is not found
      return
    }
  }

  for (let name of Object.keys(port_ids)){
    //Aggregate port events
    let current_port_events = (await maersk_scraper.get_port_events(port_ids[name], date_start, date_end))['portCalls']
    //Link port name for later.
    for (let event of current_port_events) event['portName'] = name
    port_events = port_events.concat(current_port_events)
  }

  //Aggregate ship events also called "deadlines"
  let ship_events_query = []
  for (event of port_events){
    //Departure voyage
    ship_events_query.push({
      facilityId: event['marineContainerTerminalGeoCode'],
      vesselMaerskCode: event['vesselMaerskCode'],
      voyageNumber: event['departureVoyageNumber'],
      deadlineGroupName: "DOCUMENTATION" //Static
    })

    //Arrival voyage
    //Not pushing arrival voyages to query for now because the web client does not do that (maybe they don't have deadlines?)
    //If strongly confirmed afterwards, rewrite for loop as map for readability.
  }
  ship_events = await maersk_scraper.get_ship_events(ship_events_query)

  //Finally, aggregate all our data and return to requester.
  let aggregated_info = []
  for (let port_event of port_events){
    aggregated_info.push(
      {
        "port": port_event['portName'],
        //"date": iso_date_to_string(new Date()), //TODO: I did not understand this param
        "vessel": port_event['vesselName'],
        "voyage": `${port_event['arrivalVoyageNumber']} | ${port_event['departureVoyageNumber']}`,
        "terminal": port_event['marineContainerTerminalName'],
        "arrival": iso_date_time_to_string(port_event['arrivalTime']),
        "departure": iso_date_time_to_string(port_event['departureTime']),
        "deadlines": ship_events
          .find(e => e['vesselMaerskCode'] == port_event['vesselMaerskCode'] && e['voyageNumber'] == port_event['departureVoyageNumber'])['deadlines']
          .map(d => {
            return {
              event: d['deadlineName'],
              date: iso_date_time_to_string(d['deadline'])
            }
          })
      }
    )
  }

  res.json(aggregated_info)
})

//Private helpers
const date_params_fallback = () => {
  let now = new Date()
  date_start = now.toISOString().split('T')[0]
  now.setDate(now.getDate() + 20)
  date_end = now.toISOString().split('T')[0]
  return {date_start, date_end}
}

const iso_date_to_string = (date) => {
  if (!date) return null
  let date_t = new Date(date)
  return `${date_t.getDate()}/${date_t.getMonth() + 1}/${date_t.getFullYear()}`
}

const iso_date_time_to_string = (date) => {
  if (!date) return null
  let date_t = new Date(date)
  return iso_date_to_string(date) + " " +  date_t.toTimeString().split(' ')[0]
}

module.exports = router