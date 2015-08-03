angular.module('forcebuilder.forceFileListFactory', ['forcebuilder.userFactory']);

angular.module('forcebuilder.forceFileListFactory')
        .factory('ForceFileListFactory', ['$http', 'UserFactory',
            function ($http, userFactory) {

                var _serviceBase = 'api/forceFiles/';
                var _forceFileListFactory = {};

                _forceFileListFactory.metadata = {
                    id: -1,
                    alphaName: '',
                    omegaName: '',
                    desc: '',
                    commandUic: 'XXXXXX',
                    ownerId: '',
                    accessScope: 'X',
                    userPref: '',
                    structure: [],
                    count: 0,
                    size: 0
                };

                _forceFileListFactory.metadata.reset = function () {
                    _forceFileListFactory.metadata.id = -1;
                    _forceFileListFactory.metadata.alphaName = '';
                    _forceFileListFactory.metadata.omegaName = '';
                    _forceFileListFactory.metadata.desc = '';
                    _forceFileListFactory.metadata.commandUic = 'XXXXXX';
                    _forceFileListFactory.metadata.ownerId = '';
                    _forceFileListFactory.metadata.accessScope = 'X';
                    _forceFileListFactory.metadata.userPref = '';
                    _forceFileListFactory.metadata.structure = [];
                    _forceFileListFactory.metadata.count = 0;
                    _forceFileListFactory.metadata.size = 0;
                }

                _forceFileListFactory.metadata.isUnique = function () {
                    if (!_forceFileListFactory.metadata.omegaName) {
                        return undefined;
                    } else {
                        var path = _serviceBase + 'isUnique/' + userFactory.id + '/' + escape(_forceFileListFactory.metadata.omegaName) + '?nocache=' + new Date().getTime();
                        return $http.get(path)
                                .then(
                                        function success(response) {
                                            return response.data.isUnique;
                                        });
                    }
                };

                _forceFileListFactory.getList = function (ownerType) {
                    // ownerType: 'N' = mine; 'Y' = others
                    var path = _serviceBase + 'getList/' + userFactory.id + '/' + ownerType + '?nocache=' + new Date().getTime();
                    return $http.get(path)
                            .then(
                                    function success(response) {
                                        return response;
                                    });
                };

                _forceFileListFactory.save = function () {
                    if (!(_forceFileListFactory.metadata.desc)) {
                        _forceFileListFactory.metadata.desc = _forceFileListFactory.metadata.omegaName;
                    }

                    _forceFileListFactory.metadata.alphaName = _forceFileListFactory.metadata.omegaName;
                    return $http.post('api/forceFile/save', {
                        id: _forceFileListFactory.metadata.id,
                        fileName: _forceFileListFactory.metadata.omegaName,
                        fileDesc: _forceFileListFactory.metadata.desc,
                        commandUic: _forceFileListFactory.metadata.commandUic,
                        ownerId: userFactory.id,
                        ownerFName: userFactory.fname,
                        ownerLName: userFactory.lname,
                        accessScope: _forceFileListFactory.metadata.accessScope,
                        userPref: _forceFileListFactory.metadata.userPref,
                        structure: _forceFileListFactory.metadata.structure,
                        count: _forceFileListFactory.metadata.count,
                        size: _forceFileListFactory.metadata.size
                    })
                            .then(
                                    function success(response) {
                                        _forceFileListFactory.metadata.id = response.data.id;
                                        switch (true)
                                        {
                                            case (-1 === _forceFileListFactory.metadata.id):
                                                alert('The file \"' + _forceFileListFactory.metadata.omegaName + '\" was NOT saved successfully.');
                                                break;
                                            default:
                                                alert('The file \"' + _forceFileListFactory.metadata.omegaName + '\" was saved successfully.');
                                                break;
                                        };
                                        return response;
                                    });
                };

                _forceFileListFactory.load = function () {
                    return $http.post('api/forceFile/load/', {
                        id: _forceFileListFactory.metadata.id,
                        fileName: '',
                        fileDesc: '',
                        commandUic: 'XXXXXX',
                        ownerId: userFactory.id,
                        ownerFName: userFactory.fname,
                        ownerLName: userFactory.lname,
                        accessScope: 'X',
                        userPref: '',
                        structure: [],
                        count: 0,
                        size: 0
                    })
                            .then(
                                    function success(response) {
                                        _forceFileListFactory.metadata.id = response.data.id;
                                        _forceFileListFactory.metadata.alphaName = response.data.fileName;
                                        _forceFileListFactory.metadata.omegaName = response.data.fileName;
                                        _forceFileListFactory.metadata.desc = response.data.fileDesc;
                                        _forceFileListFactory.metadata.commandUic = response.data.commandUic;
                                        _forceFileListFactory.metadata.ownerId = userFactory.id;
                                        _forceFileListFactory.metadata.accessScope = response.data.accessScope;
                                        _forceFileListFactory.metadata.userPref = response.data.userPref;
                                        _forceFileListFactory.metadata.structure = response.data.structure;
                                        _forceFileListFactory.metadata.count = response.data.count;
                                        _forceFileListFactory.metadata.size = response.data.size;

                                        switch (true)
                                        {
                                            case (-1 === _forceFileListFactory.metadata.id):
                                                alert('The file \"' + _forceFileListFactory.metadata.omegaName + '\" was NOT loaded successfully.');
                                                break;
                                            default:
                                                break;
                                        };
                                        return response;
                                    });
                };

                _forceFileListFactory.delete = function () {
                    // Only the id will be know when instantiating this function
                    // from the directory page. The additional information is to
                    // avoid any cast exception that might occur in the web service.
                    return $http.post('api/forceFile/delete/', {
                        id: _forceFileListFactory.metadata.id,
                        fileName: _forceFileListFactory.metadata.omegaName,
                        fileDesc: _forceFileListFactory.metadata.desc,
                        commandUic: _forceFileListFactory.metadata.commandUic,
                        ownerId: userFactory.id,
                        ownerFName: userFactory.fname,
                        ownerLName: userFactory.lname,
                        accessScope: _forceFileListFactory.metadata.accessScope,
                        userPref: _forceFileListFactory.metadata.userPref,
                        structure: _forceFileListFactory.metadata.structure,
                        count: _forceFileListFactory.metadata.count,
                        size: _forceFileListFactory.metadata.size
                    })
                            .then(
                                    function success(response) {
                                        _forceFileListFactory.metadata.id = response.data.id;
                                        _forceFileListFactory.metadata.alphaName = response.data.fileName;
                                        _forceFileListFactory.metadata.omegaName = response.data.fileName;
                                        _forceFileListFactory.metadata.desc = response.data.fileDesc;
                                        _forceFileListFactory.metadata.commandUic = response.data.commandUic;
                                        _forceFileListFactory.metadata.ownerId = userFactory.id;
                                        _forceFileListFactory.metadata.accessScope = response.data.accessScope;
                                        _forceFileListFactory.metadata.userPref = response.data.userPref;
                                        _forceFileListFactory.metadata.structure = response.data.structure;
                                        _forceFileListFactory.metadata.count = response.data.count;
                                        _forceFileListFactory.metadata.size = response.data.size;

                                        switch (true)
                                        {
                                            case (-1 === _forceFileListFactory.metadata.id):
                                                alert('The file was NOT deleted successfully.');
                                                break;
                                            default:
                                                break;
                                        }
                                        ;
                                        return response;
                                    });
                };

                return _forceFileListFactory;

            }]);
