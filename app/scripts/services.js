'use strict';

angular.module('starter.services', [])

.factory('DataService', function() {
    var _knownSensors = {
        '/a/fan': {
            name: 'Fan',
            slug: 'fan',
            icon: 'ion-nuclear'
        },
        '/a/temperature': {
            name: 'Temperature',
            slug: 'temperature',
            icon: 'ion-thermometer'
        },
        '/a/rgbled': {
            name: 'RGB Led',
            slug: 'rgbled',
            icon: 'ion-ios-lightbulb'
        },
        '/a/led': {
            name: 'Led',
            slug: 'led',
            icon: 'ion-ios-lightbulb-outline'
        }
    };

    function _isKnownSensor(path) {
        return Object.keys(_knownSensors).indexOf(path) > -1;
    }

    function _getSensorName(path) {
        if (_isKnownSensor(path)) {
            return _knownSensors[path].name;
        }

        return null;
    }

    function _getSensorSlug(path) {
        if (_isKnownSensor(path)) {
            return _knownSensors[path].slug;
        }

        return null;
    }

    function _getSensorIcon(path) {
        if (_isKnownSensor(path)) {
            return _knownSensors[path].icon;
        }

        return null;
    }

    return {
        knownSensors: _knownSensors,
        isKnownSensor: _isKnownSensor,
        getSensorName: _getSensorName,
        getSensorSlug: _getSensorSlug,
        getSensorIcon: _getSensorIcon
    };
})

.factory('OICService', function($ionicPlatform, $interval, DataService) {
    var _sensors = {},
        _plugin = null;

    $ionicPlatform.ready(function() {
        _plugin = cordova.require('cordova/plugin/oic');
        if (_plugin !== null) {
            _plugin.onresourcefound = function(event) {
                var path = event.resource.id.resourcePath;
                if (DataService.isKnownSensor(path)) {
                    _sensors[path] = event.resource;
                }
            };

            _plugin.setBackend('iotivity').then(function() {
                $interval(function() {
                    _plugin.findResources();
                }, 1000);
            });
        }
    });

    function _updateSensor(sensor) {
        if (_plugin !== null) {
            return _plugin.update(sensor);
        }
    }

    function _getSensorBySlug(slug) {
        var ret;

        angular.forEach(_sensors, function(sensor, path) {
            if (DataService.knownSensors[path].slug === slug) {
                ret = sensor;
                return;
            }
        });

        return ret;
    }

    return {
        sensors: function() { return _sensors; },
        updateSensor: _updateSensor,
        getSensorBySlug: _getSensorBySlug
    };
});
