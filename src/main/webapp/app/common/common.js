angular.module('forcebuilder.common', []);

angular.module('forcebuilder.common')
        .factory('Common', [function () {

                var _common = {};
        
                _common.options = {
                    showDirectoryCancel: false
                };

                _common.showProto = function () {
                    return false;
                };

                _common.resetShowDirectoryCancel = function () {
                    _common.options.showDirectoryCancel = false;
                    return;
                };

                return _common;

            }]);
