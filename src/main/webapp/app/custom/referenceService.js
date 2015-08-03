angular.module('forcebuilder.referenceService', ['ui.bootstrap']);

angular.module('forcebuilder.referenceService').service('ReferenceService', function ($http) {
    this.getMacoms = function () {
        return $http.get("api/reference/macoms").then(function success(response) {
            return response;
        });
    };

    this.getStateAndCountryCodes = function () {
        return $http.get('api/reference/countries').then(function success(response) {
            return response;
        });
    };

    this.getComponentCodes = function () {
        return $http.get('api/reference/componentcodes').then(function success(response) {
            return response;
        });
    };

    this.getCommandAssignmentCodes = function () {
        return $http.get('api/reference/commandassigncodes').then(function success(response) {
            return response;
        });
    };

    this.getBranchCodes = function () {
        return $http.get('api/reference/branches').then(function success(response) {
            return response;
        });
    };

    this.getGeoCodes = function (stateCountryCodes) {
        return $http.post('api/reference/geocodes', {stateCountryCodes: stateCountryCodes}).then(function success(response) {
            return response;
        });
    };

    this.getUnitNumbers = function () {
        return $http.get('api/reference/unitnumber').then(function success(response) {
            return response;
        });
    };

});