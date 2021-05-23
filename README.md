# Driver Assistant API

REST API of mobile project, Driver Assistant

## Add secrets

Syntax

    firebase functions:config:set someservice.key="THE API KEY"

Example

    firebase functions:config:set fenv.apikey="" fenv.senderid="" fenv.appid="" fenv.measurementid=""

Sync emulator variables in th folder `functions`

    firebase functions:config:get > .runtimeconfig.json