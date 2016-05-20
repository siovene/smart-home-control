'use strict';

angular.module('starter.services', [])

.factory('DataService', function() {
    var _knownSensors = {
        '/a/fan': {
            name: 'Fan',
            slug: 'fan',
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAFVklEQVRoQ+1YS2wbVRQ9z5nnOlUTQgpUgkBsJ0CRKCRCigQRSkpir4CmLCp2DVtAShCwAPFpAcGCIlIJtUvIkm4wn1U+SrJIkSJB04JEgHwcmoJKaeU0iHxmPA/dccaZGY/njcdOUUVmab/POfeee9+9l+Em/9hNjh87BP5rD1bUAyMLWo+u64cYY1EBUcfAWoiggJhmYBkhRJqFQqlETPmyUsTLJjC2IOpUXf2YMdYDoM4nMCKT4iH+0sEYy/jc47qsLALDc+oxMPSVANwJIgOGgUSMHw9KIhABw+pCHTMlEvRycx9JjDN+MIg3SiYwtCBamNDGnFb/+ZqOagW4pzYk5fPbdR3n/9TR1ahgN88tFxBpMH44GWPT0gMsC0oiQJbXhLZgBf/VrIbRtIZVLXfqo3dV4bkDm6iKIPlwagO/XtPRUBPCK21hGwnOeGspniiJwND8BmWThwnXPypwYmoDSyt6AcyjD3K0N1S5wj93OYvT59T8fy4kppPxcKtfL/gmsBmwb9PBf60KnPpedQVP/xOot9rDrhheG1/H1TVh+69gvcDxRBM/5oeELwJW6XhZ3nrhy21h3F9vjweS2zezm1pzoDuyn6M7mvdaRmFKzI+UfBEYmt/4jIEdpTu9QFgx3Vef07f5kdfenVzPx4rTupQATnZH8j8LiMFkPNwr84IvAsNzKuXrW+gwyiCfz2hGEMq+9zt24bbq3BVm4HrteeOxsDWLZRJxfqvsDikBKg+EEF84D6JgPPOTVqBn6zozI42kszgzsxW4xUANdEXyGYnWMMYOd8eUlBcJKQGrfNwOcqZR55oXHwnjk+82ZIbEE41VePYBe/oVAieTTby/TALqOAM6vA4hfX/6g2qTVd3MHHZfuWps+/vOfbje1Oh6BGWgrsYq17QrgIlknHeWSWAr98vMaEqFwNdevGRbnok32kjcWx/C081KQaaybqISQ/YmSCU0PK/ak7aExYUrWaROTCCk2dOlFong98fbjJf6qWYlH9wyoyTi3BNjxQiQjL6e1fDtpSwaxs4WEqiO4Jm+djx0u/sLXYxI2QSs5YPbJVTEEfBfLGm1dm4RdfOLrhJyPFieDhAQ55PxsNEUFfukHhiadw/iyaUsRhezRcsJIrHnj8tUZhYEMT1yvQe4VEaVCuL8K2xagTIOSUX2eaVQenm7o4oRD8W+iqRR50NGtVD/6JoMO0ypyMjurWY4sl9B677C2KjIQ0ZInaXEe2e9HyZKka9u1kEU3K9PrEsJk6yISL4hElhONHFpjy2NAbrZ+Rr3jax5FmVvtm/VQLTfTx1E655sVoy3gb6KFnNGOa1rabOg86pIrSBMs1Om+mjK22u2xkZgWQkp0YqV05syogmE0dDQ985kYTe2N8LwQecuV7m4rTcXOrsyVLqhMS+StZRuTYy5l9Lu4I+FFalLSynN/VYL+YoBc4NTStbuzBq4xSLWmpEojXZFtzSf2yMWFcZb/EjHvKMkAkZAG2MVNQUwo7wkEiOLGlruCPkeqdAEw9luEnjBeM+2jlWsnlAFvdC5CUW5H5UMnPHOUiwf2ANWsMakAug3s1PJRASWAQz4nUC4nV+yhJyHbI4ZB5hgPb6JCCwLJlKc8f4gVg8cxDILG+N1ofcALLq0onfcXZMbq1xcMaZwExCYDoXYuKzPld2zbQSsB8dOrdgaoYXna8r29rZIqJi1dgj41FFF3Ro9vRqFnj0EiF7GYOukjPE5WAqCDaZf2FPSCN2LS9kEvEAXu7iSZAIRCAJ6u8gEIuAMUJ9ylS4Lkqn+nwSkpryBCwJ54Abik161Q0Bqom1e8C+8hn9PSKPjOAAAAABJRU5ErkJggg=='
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
