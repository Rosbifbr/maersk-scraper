# README
## TODO
- Aggregated voyage info route optimization
    - Store port IDs in memory and reload by routine if they are guaranteed to be static. This way we can squeeze some seconds of performance under heavy load.
- API key renewal routine
    - Cron job might do the trick, but will be a little opaque
    - Maybe implement a periodic refresh system using JS native setInterval API
- Decent logging
- Documentation
- Map potential exceptions and treat them. Code is somewhat unsafe.
- Tests

## USAGE
- First time
    - docker build . -t maersk_scraper && docker run -p "3000:3000" --name maersk_scraper_1 maersk_scraper
- Nth time
    - docker start maersk_scraper_1
- Profit

## Challenge
- run challenge.sh (calls route with specific Santos and Rio Grande port params)