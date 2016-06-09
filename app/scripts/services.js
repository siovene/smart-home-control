'use strict';

angular.module('starter.services', [])

.factory('DataService', function() {
    var _knownSensors = {
        '/a/fan': {
            name: 'Fan',
            icon: 'ion-nuclear'
        },
        '/a/temperature': {
            name: 'Temperature',
            icon: 'ion-thermometer'
        },
        '/a/rgbled': {
            name: 'RGB Led',
            icon: 'ion-ios-lightbulb'
        },
        '/a/led': {
            name: 'Led',
            icon: 'ion-ios-lightbulb-outline'
        },
        '/a/solar': {
            name: 'Solar panel',
            icon: 'ion-ios-sunny'
        },
        '/a/gas': {
            name: 'CO2 level',
            icon: 'ion-ios-flame',
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

.factory('OICService', function($ionicPlatform, $interval, DataService) {
    var _sensors = {},
        _plugin = null,
        _discoverInterval = null;

    $ionicPlatform.ready(function() {
        _plugin = cordova.require('cordova/plugin/oic');
        if (_plugin !== null) {
            _plugin.onresourcefound = function(event) {
                var path = event.resource.id.resourcePath;

                if (path in _sensors) {
                    return;
                }

                if (DataService.isKnownSensor(path)) {
                    _sensors[path] = event.resource;
                }

                if (_sensorsNumber() === DataService.knownSensorsNumber()) {
                    $interval.cancel(_discoverInterval);
                }
            };

            _plugin.setBackend('iotivity').then(function() {
                _discoverInterval = $interval(function() {
                    _plugin.findResources();
                }, 1000);
            });
        }
    });

    function _sensorsNumber() {
        return Object.keys(_sensors).length;
    }

    function _updateSensor(sensor) {
        if (_plugin !== null) {
            return _plugin.update(sensor);
        }
    }

    return {
        sensors: function() { return _sensors; },
        sensorsNumber: _sensorsNumber,
        updateSensor: _updateSensor,
    };
});
