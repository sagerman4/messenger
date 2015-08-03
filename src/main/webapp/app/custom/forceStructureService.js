angular.module('forcebuilder.forceStructureService', ['ui.bootstrap']);

angular.module('forcebuilder.forceStructureService').service('ForceStructureService', function ($http) {
    this.getForceStructure = function (uics, macoms, stateCountryCodes, commandAssignmentCodes, componentCodes, branchCodes, geoCodes, insCodes, rics, dodaacs, unitnumber, adCon, opCon, uicstatus) {
        return $http.post("api/hierarchicalUics/search", {uics: uics, macoms: macoms, commandAssignmentCodes: commandAssignmentCodes, stateCountryCodes: stateCountryCodes, componentCodes: componentCodes, branchCodes: branchCodes, geoCodes: geoCodes, insCodes: insCodes, rics: rics, dodaacs: dodaacs, unitNumber: unitnumber, adCon: adCon, opCon: opCon, uicStatus: uicstatus}).then(function success(response) {
            return response;
        });
    };
});

