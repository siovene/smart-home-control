'use strict';

angular.module('starter.services', [])

.factory('DataService', function() {
    var _knownSensors = {
        '/a/fan': {
            name: 'Fan',
            icon: 'ion-nuclear'
        },
        '/a/gas': {
            name: 'CO2 level',
            icon: 'ion-ios-flame',
        },
        '/a/led': {
            name: 'LED',
            icon: 'ion-ios-lightbulb-outline'
        },
        '/a/rgbled': {
            name: 'RGB LED',
            icon: 'ion-ios-lightbulb'
        },
        '/a/temperature': {
            name: 'Temperature',
            icon: 'ion-thermometer'
        },
        '/a/solar': {
            name: 'Solar panel',
            icon: 'ion-ios-sunny'
        }
    };

    function _knownSensorsNumber() {
        return Object.keys(_knownSensors).length;
    }

    function _isKnownSensor(path) {
        return Object.keys(_knownSensors).indexOf(path) > -1;
    }

    function _getSensorInfo(path) {
        if (_isKnownSensor(path)) {
            return _knownSensors[path];
        }

        return null;
    }

    return {
        knownSensors: _knownSensors,
        knownSensorsNumber: _knownSensorsNumber,
        isKnownSensor: _isKnownSensor,
        getSensorInfo: _getSensorInfo
    };
})

.factory('OICService', function($ionicPlatform, $interval, $rootScope, DataService) {
    var _sensors = [],
        _plugin = null,
        _discoverInterval = null;

    $ionicPlatform.ready(function() {
        _plugin = cordova.require('cordova/plugin/oic');
        if (_plugin !== null) {
            _plugin.onresourcefound = function(event) {
                $rootScope.$applyAsync(function() {
                    var path = event.resource.id.resourcePath,
                        found = false;

                    angular.forEach(_sensors, function(sensor) {
                        if (sensor.path === path) {
                            found = true;
                        }
                    });

                    if (!found) {
                        if (DataService.isKnownSensor(path)) {
                            event.resource.onupdate = function(event) {
                                angular.forEach(event.updates, function(update) {
                                    var key = Object.keys(update)[0],
                                        repr = update[key],
                                        path = '/' + key.split('/').splice(-2).join('/');

                                    angular.forEach(_sensors, function(sensor) {
                                        if (sensor.path === path &&
                                            !angular.equals(sensor.data.properties, repr))
                                        {
                                            sensor.data.properties = repr;
                                        }
                                    });
                                });
                            };

                            _sensors.push({
                                path: path,
                                info: DataService.getSensorInfo(path),
                                data: event.resource
                            });
                        }

                        if (_sensorsNumber() === DataService.knownSensorsNumber()) {
                            $interval.cancel(_discoverInterval);
                        }
                    }
                });
            };

            _plugin.setBackend('iotivity').then(function() {
                _discoverInterval = $interval(function() {
                    _plugin.findResources();
                }, 1000);
            });
        }
    });

    function _sensorsNumber() {
        return _sensors.length;
    }

    function _updateSensor(sensor) {
        if (_plugin !== null) {
            return _plugin.update(sensor);
        }
    }

    return {
        sensors: _sensors,
        sensorsNumber: _sensorsNumber,
        updateSensor: _updateSensor,
    };
});
