const Utils = require("../utils/utils")


function getRoute(ptravelMode, ptime, plocation) {
    //getting the route setting the travelmode and its needed parrams for ever travel mode
    return new Promise(async (resolve, reject) => {
        let travelMode = ptravelMode.toUpperCase();
        let requestBody;
        if (travelMode === "TRANSIT") {
            console.log(Utils.formatTime())
             requestBody = {
                "origin": {
                    "location": plocation
                },
                "destination": {
                    "location": {
                        "latLng": {
                            "latitude": 48.116020,
                            "longitude": 7.860980
                        }
                    }
                },
                "travelMode": "TRANSIT",
                "arrivalTime": ptime,
                "computeAlternativeRoutes": false,
                "routeModifiers": {
                    "avoidTolls": false,
                    "avoidHighways": false,
                    "avoidFerries": false
                },
                "units": "METRIC"

            }
        } else if(travelMode === "DRIVE") {
             requestBody = {
                "origin": {
                    "location": plocation
                },
                "destination": {
                    "location": {
                        "latLng": {
                            "latitude": 48.116020,
                            "longitude": 7.860980
                        }
                    }
                },
                "travelMode": travelMode,
                "routingPreference": "TRAFFIC_AWARE",
                "computeAlternativeRoutes": false,
                "routeModifiers": {
                    "avoidTolls": false,
                    "avoidHighways": false,
                    "avoidFerries": false
                },
                "units": "METRIC"
            }
        } else {
            requestBody = {
                "origin": {
                    "location": plocation

                },
                "destination": {
                    "location": {
                        "latLng": {
                            "latitude": 48.116020,
                            "longitude": 7.860980
                        }
                    }
                },
                "travelMode": travelMode,
                "computeAlternativeRoutes": false,
                "routeModifiers": {
                    "avoidTolls": false,
                    "avoidHighways": false,
                    "avoidFerries": false
                },
                "units": "METRIC"
            }
        }
        // sending the request and setting the header
        let header = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": process.env.MAPS_APIKEY,
            "X-Goog-FieldMask": "*"
        }
        try {
            let response = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {method: "POST", headers: header, body: JSON.stringify(requestBody) })
            let json = await response.json()
            resolve(json)
        } catch (e) {
            console.error("got a error",e)
        }
    })
}

module.exports = {getRoute}