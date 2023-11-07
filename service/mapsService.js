const Utils = require("../utils/utils")


function getRoute(ptravelMode) {
    return new Promise(async (resolve, reject) => {
        let travelMode = ptravelMode.toUpperCase();
        let requestBody;
        if (travelMode === "TRANSIT") {
            console.log(Utils.formatTime())
             requestBody = {
                "origin": {
                    "location": {
                        "latLng": {
                            "latitude": 48.120010,
                            "longitude": 7.732870
                        }
                    }
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
                "arrivalTime": Utils.formatTime(),
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
                    "location": {
                        "latLng": {
                            "latitude": 48.120010,
                            "longitude": 7.732870
                        }
                    }
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
                    "location": {
                        "latLng": {
                            "latitude": 48.120010,
                            "longitude": 7.732870
                        }
                    }
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