angular.module('forcebuilder.directory', ['ui.router', 'ui.bootstrap', 'ngGrid', 'forcebuilder.common', 'forcebuilder.userFactory', 'forcebuilder.forceFileListFactory', 'forcebuilder.manageForceFileService'])
        .config(['$stateProvider',
            function ($stateProvider) {
                $stateProvider
                        .state('directory', {url: '/directory/', templateUrl: 'directory.html'});
            }]);

angular.module('forcebuilder.directory')
        .controller('DirectoryController', ['$scope', '$state', 'UserFactory', 'ForceFileListFactory', 'Common', 'LoadForceFileService', 'DeleteForceFileService',
            function ($scope, $state, userFactory, forceFileListFactory, common, loadForceFileService, deleteForceFileService) {

                $scope.userFactory = userFactory;
                $scope.common = common;

                $scope.forceFiles_mine = [];
                $scope.forceFiles_others = [];
                $scope.filteredForceFiles_mine = [];
                $scope.filteredForceFiles_others = [];

                var modalOptions = {
                    headerText: 'Manage',
                    messageText: '',
                    actionButtonText: '',
                    closeButtonText: 'Cancel',
                    forceFileId: -1,
                    forceFileName: ''
                };

                $scope.init = function () {
                    $scope.$state = $state;
                    $scope.clearFilters();
                };

                $scope.showProto = function () {
                    return common.showProto();
                };

                $scope.showLoadModal = function (row) {
                    modalOptions.headerText = 'Load';
                    modalOptions.messageText = 'Load the Force File, overwriting the existing structure?';
                    modalOptions.actionButtonText = 'Load';
                    modalOptions.forceFileId = row.entity.id;
                    modalOptions.forceFileName = row.entity.fileName;
                    loadForceFileService.showModal({}, modalOptions);
                };

                $scope.showDeleteModal = function (row) {
                    modalOptions.headerText = 'Delete';
                    modalOptions.messageText = 'Delete the Force File, including its existing structure?';
                    modalOptions.actionButtonText = 'Delete';
                    modalOptions.forceFileId = row.entity.id;
                    modalOptions.forceFileName = row.entity.fileName;
                    deleteForceFileService.showModal({}, modalOptions);
                };

                $scope.openDateCreatedBegin = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    $scope.dateCreatedBeginOpened = true;
                };

                $scope.openDateCreatedEnd = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    $scope.dateCreatedEndOpened = true;
                };

                $scope.openDateUpdatedBegin = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    $scope.dateUpdatedBeginOpened = true;
                };

                $scope.openDateUpdatedEnd = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    $scope.dateUpdatedEndOpened = true;
                };

                $scope.dateOptions = {
                    formatYear: 'yy',
                    startingDay: 1
                };

                $scope.format = 'MMM dd, yyyy';

                var _loadCellTemplate = '<div class="ngCellText" ng-click="showLoadModal(row)">{{row.getProperty(col.field)}}</div>';
                var _headerCellTemplate = 'app/common/columnHeader.html';
                var _cellTemplate = '<div><div class="ngCellText col-centered">{{row.getProperty(col.field)}}</div></div>';
                var _deleteCellTemplate = '<div class="ngCellText col-centered" ng-click="showDeleteModal(row)"><button class="btn btn-danger" style="line-height:1em;position:relative;top: -2px;">Delete</button></div>';

                $scope.gridOptions_mine = {
                    data: 'filteredForceFiles_mine',
                    multiSelect: false,
                    enableColumnResize: true,
                    columnDefs: [
                        {field: 'fileName',
                            displayName: 'File Name',
                            cellTemplate: _loadCellTemplate,
                            headerCellTemplate: _headerCellTemplate},
                        {field: 'dateCreated',
                            displayName: 'Date Created',
                            cellTemplate: _cellTemplate,
                            headerCellTemplate: _headerCellTemplate},
                        {field: 'dateUpdated',
                            displayName: 'Date Updated',
                            cellTemplate: _cellTemplate,
                            headerCellTemplate: _headerCellTemplate},
                        {field: 'count',
                            displayName: 'UIC Count',
                            cellTemplate: _cellTemplate,
                            headerCellTemplate: _headerCellTemplate},
                        {field: 'accessScope',
                            displayName: 'Public/Private',
                            cellTemplate: _cellTemplate,
                            headerCellTemplate: _headerCellTemplate},
                        {field: 'userPref',
                            displayName: 'Default/Favorite',
                            cellTemplate: _cellTemplate,
                            headerCellTemplate: _headerCellTemplate,
                            sortFn: sort},
                        {displayName: 'Action',
                            cellTemplate: _deleteCellTemplate,
                            headerCellTemplate: _headerCellTemplate}]
                };

                $scope.gridOptions_others = {
                    data: 'filteredForceFiles_others',
                    multiSelect: false,
                    showSelectionCheckbox: false,
                    enableColumnResize: true,
                    columnDefs: [
                        {field: 'fileName',
                            displayName: 'File Name',
                            cellTemplate: _loadCellTemplate,
                            headerCellTemplate: _headerCellTemplate,
                            sortFn: sort},
                        {field: 'dateCreated',
                            displayName: 'Date Created',
                            cellTemplate: _cellTemplate,
                            headerCellTemplate: _headerCellTemplate},
                        {field: 'ownerName',
                            displayName: 'Owner',
                            cellTemplate: _cellTemplate,
                            headerCellTemplate: _headerCellTemplate},
                        {field: 'dateUpdated',
                            displayName: 'Date Updated',
                            cellTemplate: _cellTemplate,
                            headerCellTemplate: _headerCellTemplate},
                        {field: 'count',
                            displayName: 'UIC Count',
                            cellTemplate: _cellTemplate,
                            headerCellTemplate: _headerCellTemplate}],
                    afterSelectionChange: function () {
                        return true;
                    }
                };

                $scope.filter = function() {
                    $scope.filteredForceFiles_mine = [];
                    $scope.filteredForceFiles_others = [];
                    forceFileListFactory.getList('N').then(function (response) {
                                                                $scope.forceFiles_mine = response.data;
                                                            });
                    forceFileListFactory.getList('Y').then(function (response) {
                                                                $scope.forceFiles_others = response.data;
                                                            });
                    for(var i = 0; i < $scope.forceFiles_mine.length; i++) {
                        if(filterIsBlankOrValueMatches($scope.forceFiles_mine[i].fileName, $scope.fileName)
                            && filterIsInDateRange($scope.forceFiles_mine[i].dateCreated, $scope.dateCreatedBegin, $scope.dateCreatedEnd)
                            && filterIsInDateRange($scope.forceFiles_mine[i].dateUpdated, $scope.dateUpdatedBegin, $scope.dateUpdatedEnd)) {
                            $scope.filteredForceFiles_mine = $scope.filteredForceFiles_mine.concat($scope.forceFiles_mine[i]);
                        }
                    }
                    for(var i = 0; i < $scope.forceFiles_others.length; i++) {
                        if(filterIsBlankOrValueMatches($scope.forceFiles_others[i].fileName, $scope.fileName)
                           && filterIsBlankOrValueMatches($scope.forceFiles_others[i].ownerName, $scope.ownerName)
                           && filterIsInDateRange($scope.forceFiles_others[i].dateCreated, $scope.dateCreatedBegin, $scope.dateCreatedEnd)
                           && filterIsInDateRange($scope.forceFiles_others[i].dateUpdated, $scope.dateUpdatedBegin, $scope.dateUpdatedEnd)) {
                            $scope.filteredForceFiles_others = $scope.filteredForceFiles_others.concat($scope.forceFiles_others[i]);
                        }
                    }
                };

                $scope.clearFilters = function () {
                    $scope.fileName = null;
                    $scope.ownerName = null;
                    $scope.dateCreatedBegin = null;
                    $scope.dateCreatedEnd = null;
                    $scope.dateUpdatedBegin = null;
                    $scope.dateUpdatedEnd = null;
                    forceFileListFactory.getList('N').then(function (response) {
                                                                $scope.forceFiles_mine = $scope.filteredForceFiles_mine = response.data;
                                                            });
                    forceFileListFactory.getList('Y').then(function (response) {
                                                                $scope.forceFiles_others = $scope.filteredForceFiles_others = response.data;
                                                            });
                };

                var sort = function (a, b) {
                    var s;
                    switch (true)
                    {
                        case (a < b):
                            s = -1;
                            break;
                        case (a === b):
                            s = 0;
                            break;
                        default:
                            s = 1;
                            break;
                    }
                    ;
                    return s;
                };

                function filterIsBlankOrValueMatches(value, filter) {
                    return filter === null || filter === undefined || filter.trim() === "" || upper(value).indexOf(upper(filter)) !== -1;
                };

                function filterIsInDateRange(value, begin, end) {
                    var dateValue = Date.parse(value);
                    if((begin === null || begin === undefined) && (end === null || end === undefined)) {
                        return true;
                    }
                    var beginDate;
                    var endDate;
                    if(isNaN(Date.parse(begin))) {
                        beginDate = 0;
                    } else {
                        begin.setHours(0, 0, 0, 0);
                        beginDate = Date.parse(begin);
                    }
                    if(isNaN(Date.parse(end))) {
                        endDate = Number.MAX_VALUE;
                    } else {
                        end.setHours(23, 59, 59, 999);
                        endDate = Date.parse(end);
                    }
                    return dateValue >= beginDate && dateValue <= endDate;
                };

                function upper(string) {
                    return string === null || string === undefined ? "" : string.toUpperCase();
                }
            }]);

        angular.module('forcebuilder.directory')
                .directive('datepickerPopup', function (){
                    return{
                        restrict: 'EAC',
                        require: 'ngModel',
                        link: function(scope, element, attr, controller) {
                            controller.$formatters.shift();
                        }
                    };
        });