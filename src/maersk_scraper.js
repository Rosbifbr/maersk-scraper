//TODO: Implment a key renewal method in case it is changed.
//API authentication is done with a static key.
var API_KEY //= "uXe7bxTHLY0yY0e8jnS6kotShkLuAAqG"
const CARRIER_CODES = "MAEU,MCPU,SEAU,SEJJ"

//Dirtilly get the API key in case the developers change it.
const renew_api_key = async () => {
    //Get resources
    const html = await (await fetch('https://www.maersk.com/schedules/portCalls')).text()
    const bundle_path = html.match(/src="(\/schedules\/assets\/main-[0-9a-f]+\.js)"/,"gm")[1]
    const bundle = await (await fetch("https://www.maersk.com" + bundle_path)).text()
    
    //Extract API key
    let collected_key = bundle.match(/,prod:\{.*?consumerKey:"(.+?)"/)[1]
    if (collected_key) return collected_key
    else throw new Error("Could not find API key in bundle")
}

//Takes a little bit to start. Maybe block requests until it's ready?
renew_api_key().then(k => API_KEY = k)

module.exports = {
    get_active_ports: async () => {
        const processed_query = "carrierCodes=" + encodeURIComponent(CARRIER_CODES)
        const response = await fetch(`https://api.maersk.com/synergy/schedules/active-ports?${processed_query}`, {
            "headers": {
                "consumer-key": API_KEY,
                "Referer": "https://www.maersk.com/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "method": "GET"
        })
        return response.json()
    },
    get_port_code: async (name) => {
        const processed_query = "carrierCodes=" + encodeURIComponent(CARRIER_CODES)
        const response = await fetch(`https://api.maersk.com/synergy/schedules/active-ports?${processed_query}`, {
            "headers": {
                "consumer-key": API_KEY,
                "Referer": "https://www.maersk.com/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "method": "GET"
        })
        return response.json()
    },
    get_port_events: async (port_code, date_start, date_end) => {
        let query_params = {
            portCode: port_code,
            fromDate: date_start,
            toDate: date_end,
            carrierCodes: CARRIER_CODES,
        }
        const processed_query = Object.keys(query_params).map(
            (key) => `${key}=${encodeURIComponent(query_params[key])}`
        ).join("&")

        const response = await fetch(`https://api.maersk.com/synergy/schedules/port-calls?${processed_query}`, {
            "headers": {
                "consumer-key": API_KEY,
                "Referer": "https://www.maersk.com/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "method": "GET"
        })
        return response.json()
    },
    get_ship_events: async (ships, date_start, date_end) => {
        
    }
}
