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
        },
        '/a/buzzer': {
            name: 'Buzzer',
            icon: 'ion-volume-high'
        },
        '/a/pir': {
            name: 'Motion',
            icon: 'ion-android-walk'
        },
        '/a/illuminance': {
            name: 'Illuminance',
            icon: 'ion-ios-moon'
        },
        '/a/button': {
            name: 'Button',
            icon: 'ion-toggle'
        },
        '/a/button-toggle': {
            name: 'Button Toggle',
            icon: 'ion-toggle'
        },
        '/a/binarySwitch': {
            name: 'Switch',
            icon: 'ion-toggle-filled'
        },
        '/a/env': {
            name: 'Environment',
            icon: 'ion-cloud'
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

.factory('SettingsService', function(localStorageService) {
    var _settings = [
        { slug: 'continuous-discovery', text: 'Continuous discovery', checked: true }
    ];

    function _save() {
        for (var i = 0; i < _settings.length; i++) {
            localStorageService.set(_settings[i].slug, _settings[i].checked);
        }
    }

    function _init() {
        for (var i = 0; i < _settings.length; i++) {
            _settings[i].checked = localStorageService.get(_settings[i].slug);
        }
    }

    function _get(slug) {
        for (var i = 0; i < _settings.length; i++) {
            if (_settings[i].slug === slug) {
                return _settings[i].checked;
            }
        }

        return null;
    }

    return {
        settings: _settings,
        save: _save,
        init: _init,
        get: _get
    };
})

.factory('OCFService', function($ionicPlatform, $interval, $rootScope, DataService) {
    var _sensors = [],
        _plugin = null;

    $ionicPlatform.ready(function() {
        _plugin = cordova.require('cordova/plugin/ocf');
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
                    }
                });
            };

            _plugin.setBackend('iotivity');
        }
    });

    function _discover() {
        return _plugin.findResources();
    }

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
        discover: _discover
    };
});
