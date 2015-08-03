angular.module('forcebuilder.directoryDirectives', ['forcebuilder.userFactory', 'forcebuilder.forceFileListFactory']);

angular.module('forcebuilder.directoryDirectives')
        .directive('showDirectoryCancelButton', ['Common',
            function (common) {
                return {
                    // restrict to an attribute type.
                    restrict: 'A',
                    // if the element must have ng-model attribute (e.g., "blur" events)
                    //require: 'ngModel',
                    // scope = the parent scope
                    // elem = the element the directive is on
                    // attr = a dictionary of attributes on the element
                    // ctrl = the controller for ngModel.
                    link: function (scope, element, attr) {
                        element.bind('click',
                                function (event) {
                                    // Since we're consuming the forceFileListFactory, we'll
                                    // ignore element.val(), which is the usual mechanism for
                                    // reading what has been entered in the view.
                                    common.options.showDirectoryCancel = scope.$eval(attr.showDirectoryCancelButton);
                                });
                    }
                };
            }]);
