angular.module('forcebuilder.custom', ['ui.router', 'ui.bootstrap', 'localytics.directives', 'ngTagsInput', 'ngFileUpload', 'ui-notification', 'forcebuilder.userFactory', 'forcebuilder.saveForceFileService', 'forcebuilder.forceFileListFactory', 'forcebuilder.referenceService', 'forcebuilder.forceStructureService'])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('custom', {url: "/custom/", templateUrl: "custom.html"});
    }]).config(function(NotificationProvider) {
        NotificationProvider.setOptions({
            delay: 5000,
            startTop: 50,
            startRight: 10,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'right',
            positionY: 'top'
    });
});



angular.module('forcebuilder.custom').controller('CustomController', function ($scope, $filter, ForceStructureService, ReferenceService, Notification, ForceFileListFactory) {

    $scope.forceFileListFactory = ForceFileListFactory;
    $scope.uics = [];
    $scope.destinationUics = [];

    $scope.init = function () {

        if (null !== $scope.forceFileListFactory.metadata.id && undefined !== $scope.forceFileListFactory.metadata.id && '-1' !== $scope.forceFileListFactory.metadata.id) {
            $scope.destinationUics = angular.copy($scope.forceFileListFactory.metadata.structure);
            $scope.destinationUicsLookup = generateLookup($scope.destinationUics);
        }

        ReferenceService.getMacoms().then(function (response) {
            $scope.macoms = response.data;
        });

        ReferenceService.getStateAndCountryCodes().then(function (response) {
            $scope.countries = response.data;
        });

        ReferenceService.getCommandAssignmentCodes().then(function (response) {
            $scope.commandassignmentcodes = response.data;
        });

        ReferenceService.getComponentCodes().then(function (response) {
            $scope.componentcodes = response.data;
        });

        ReferenceService.getBranchCodes().then(function (response) {
            $scope.branches = response.data;
        });

        ReferenceService.getUnitNumbers().then(function (response) {
            $scope.unitNumbers = response.data;
        });
    };

    $scope.uicStatusList = [{
            id: 0,
            label: 'Current',
            status: {status: 'C'}
        }, {
            id: 1,
            label: 'History',
            status: {status: 'H'}
        }, {
            id: 2,
            label: 'Future',
            status: {status: 'Z'}
        }];

    $scope.movedRows = [];
    $scope.destinationMovedRows = [];
    $scope.country;
    $scope.newSelection = {isNewSelection: false};
    $scope.newDestinationSelection = {isNewSelection: false};
    $scope.submitResponse = [];
    $scope.showAdvanced = false;
    $scope.destinationSelectionNeedsToBeScrolledIntoView = {value: false};
    $scope.selectedGeo = [];
    $scope.uicstatus = $scope.uicStatusList[0];

    $scope.$watch('adcon', function () {
        if (!isEmptyArray($scope.adcon))
        {
            $scope.adcon = $scope.adcon.toUpperCase();
        }
    });

    $scope.$watch('opcon', function(){
        if(!isEmptyArray($scope.opcon))
        {
            $scope.opcon = $scope.opcon.toUpperCase();
        }
    });

    $scope.$watch('country', function (newValue, oldValue) {
        if (!isEmptyArray($scope.country)) {
           //var selected = angular.element('geocode');
            ReferenceService.getGeoCodes($scope.country).then(function (response) {
                $scope.geocodes = response.data;
                /*
                 * Since the Chosen select component is written in jQuery, it does not play nicely with the way AngularJS
                 * adds 'hidden' properties like $$hashKey to its objects. If we just let the selected geocodes stay as-is
                 * when we pull back a new list, then the regular Javascript object equality no longer holds because the
                 * $$hashKey property's value changes. We rebuild the selected values based on the new list, and that makes
                 * it happy enough.
                 */
                if(!isEmptyArray($scope.geocodes)) {
                    var currentlySelectedGeocodes = [];
                    for(var i = 0; i < $scope.geocodes.length; i++) {
                        if(angularIndexOf($scope.geocode, $scope.geocodes[i]) > -1) {
                            currentlySelectedGeocodes = currentlySelectedGeocodes.concat($scope.geocodes[i]);
                        }
                    }
                    $scope.geocode = currentlySelectedGeocodes;
                }
            });
        }
        else {
            if ($scope.forceForm) {
               $scope.geocodes = [];
            }
        }
    });

    $scope.$watch('inputUics', function () {
        if (!isEmptyArray($scope.inputUics)) {
            for (var i = 0; i < $scope.inputUics.length; i++) {
                $scope.inputUics[i].uic = $scope.inputUics[i].uic.toUpperCase();
            }
        }
    }, true);

    $scope.$watch('insCodes', function(){
        if(!isEmptyArray($scope.insCodes))
        {
            for (var i = 0; i < $scope.insCodes.length; i++) {
                $scope.insCodes[i].inscode = $scope.insCodes[i].inscode.toUpperCase();
            }
        }
    }, true);


    $scope.$watch('rics', function () {
        if (!isEmptyArray($scope.rics)) {
            for (var i = 0; i < $scope.rics.length; i++) {
                $scope.rics[i].ric = $scope.rics[i].ric.toUpperCase();
            }
        }
    }, true);

    $scope.$watch('dodaacs', function () {
        if (!isEmptyArray($scope.dodaacs)) {
            for (var i = 0; i < $scope.dodaacs.length; i++) {
                $scope.dodaacs[i].dodaac = $scope.dodaacs[i].dodaac.toUpperCase();
            }
        }
    }, true);

    $scope.getSelectedGeo = function() {
        $scope.selectedGeo = document.getElementById("geocode").valueOf();
    };


    $scope.toggleAdvanced = function () {
        $scope.showAdvanced = !$scope.showAdvanced;
    };

    $scope.submit = function () {
        $scope.clearSource();
        $scope.rdUics = [];
        /*
         * Due to the way the services currently work, passing in a state/country code and no geo codes will result in getting back everything. If a state/country is selected and no
         * geo codes are selected, we actually need to pass in ALL of the available geo codes.
         */
        var geocodesForSubmit;
        if (!isEmptyArray($scope.country) && isEmptyArray($scope.geocode)) {
            geocodesForSubmit = $scope.geocodes;
        } else {
            geocodesForSubmit = $scope.geocode;
        }

        if (!angular.isArray($scope.uicstatus))
        {
            $scope.status = [$scope.uicstatus.status];
        }
        else
        {
            $scope.status = $scope.uicstatus;
        }

        ForceStructureService.getForceStructure($scope.inputUics, $scope.macom, $scope.country, $scope.commandassignmentcode, $scope.componentcode, $scope.branch, geocodesForSubmit, $scope.insCodes, $scope.rics, $scope.dodaacs, $scope.unitnumber, $scope.adcon, $scope.opcon, $scope.status).then(function (response) {
            $scope.uics = response.data;
            $scope.submitResponse = response.data;
            $scope.uicsLookup = generateLookup(response.data);
        });
    };

    $scope.clearInputs = function(){
        $scope.clearInputUics();
        $scope.clearInsCodes();
        $scope.macom = [];
        $scope.commandassignmentcode = [];
        $scope.componentcode = [];
        $scope.branch = [];
        $scope.country = [];
        $scope.geocode = [];
        $scope.adcon = "";
        $scope.opcon = "";
        $scope.rics = [];
        $scope.dodaacs = [];
        $scope.uicstatus = $scope.uicStatusList[0];;
        $scope.unitnumber = [];
    };

    $scope.clearRics = function () {
        $scope.rics = [];
    };

    $scope.clearDodaacs = function () {
        $scope.dodaacs = [];
    };


    $scope.clearSource = function () {
        $scope.newSelection.isNewSelection = false;
        $scope.selected = [];
        $scope.uics = [];
        $scope.movedRows = [];
        $scope.uicsLookup = {};
    };

    $scope.clearDestination = function () {
        $scope.newDestinationSelection.isNewSelection = false;
        $scope.destinationSelected = [];
        $scope.destinationUics = [];
        $scope.destinationMovedRows = [];
        $scope.destinationUicsLookup = {};
    };

    $scope.unselectAllSource = function() {
        $scope.newSelection.isNewSelection = false;
        $scope.selected = [];
        $scope.movedRows = [];
    };

    $scope.unselectAllDestination = function() {
        $scope.newDestinationSelection.isNewSelection = false;
        $scope.destinationSelected = [];
        $scope.destinationMovedRows = [];
    };

    $scope.clearInputUics = function () {
        $scope.inputUics = [];
    };

    $scope.clearInsCodes = function(){
        $scope.insCodes = [];
    };

    $scope.move = function () {
        $scope.movedRows = $scope.selected;
        moveNodes($scope.uics, $scope.destinationUics, $scope.selected, $scope.newSelection);
        $scope.uicsLookup = generateLookup($scope.uics);
        $scope.destinationUicsLookup = generateLookup($scope.destinationUics);
    };

    $scope.moveAll = function () {
        if (!isEmptyArray($scope.uics)) {
            $scope.selected = $scope.uics.slice();
            $scope.movedRows = $scope.selected;
            moveNodes($scope.uics, $scope.destinationUics, $scope.selected, {isNewSelection: true});
            $scope.uicsLookup = generateLookup($scope.uics);
            $scope.destinationUicsLookup = generateLookup($scope.destinationUics);
        }
    };

    $scope.remove = function () {
        $scope.destinationMovedRows = $scope.destinationSelected;
        moveNodes($scope.destinationUics, $scope.uics, $scope.destinationSelected, $scope.newDestinationSelection);
        $scope.destinationUicsLookup = generateLookup($scope.destinationUics);
        $scope.uicsLookup = generateLookup($scope.uics);
    };

    $scope.removeAll = function () {
        if (!isEmptyArray($scope.destinationUics)) {
            $scope.destinationSelected = $scope.destinationUics.slice();
            $scope.destinationMovedRows = $scope.destinationSelected;
            moveNodes($scope.destinationUics, $scope.uics, $scope.destinationSelected, {isNewSelection: true});
            $scope.destinationUicsLookup = generateLookup($scope.destinationUics);
            $scope.uicsLookup = generateLookup($scope.uics);
        }
    };

    $scope.up = function () {
        changeWorkingAreaNodeOrder(true);
    };

    $scope.right = function () {
        if(!isEmptyArray($scope.destinationSelected)) {
            var indexOfNodeAboveSelection = $scope.destinationUics.indexOf($scope.destinationSelected[0]) - 1;
            if(indexOfNodeAboveSelection === -1 || $scope.destinationUics[indexOfNodeAboveSelection].indent === ($scope.destinationSelected[0].indent - 1)) {
                Notification.warning({message: "The selection cannot be demoted because it is at the top of the current level of its hierarchy.", replaceMessage: true});
                return;
            }
            var selectedIndices = [];
            var numberOfParentNodes = 0;
            var doesSelectionIncludeWholeHierarchy = false;
            for(var i = 0; i < $scope.destinationSelected.length; i++) {
                selectedIndices = selectedIndices.concat($scope.destinationUics.indexOf($scope.destinationSelected[i]));
                if($scope.destinationSelected[i].indent >= 4) {
                    Notification.warning({message: "Part or all of your selection is already at the maximum depth (5 levels).", replaceMessage: true});
                    return;
                }
                if($scope.destinationSelected[i].isParent) {
                    numberOfParentNodes++;
                }
            }
            doesSelectionIncludeWholeHierarchy = angular.equals($scope.destinationSelected, [$scope.destinationSelected[0]].concat($scope.destinationUics.getChildren($scope.destinationSelected[0])));
            if(!areIndicesContiguous(selectedIndices) || (numberOfParentNodes > 0 && !doesSelectionIncludeWholeHierarchy)) {
                Notification.warning({message: "The selection must be either contiguous (i.e., no gaps) root-level non-parent UICs, child UICs at the same level, or an entire hierarchy/sub-hierarchy of UICs.", replaceMessage: true});
                return;
            }

            var nodeAboveSelection = $scope.destinationUics[indexOfNodeAboveSelection];
            //If the node above is at the same level as the selection, the node above becomes the parent of the selection.
            if(nodeAboveSelection.indent === $scope.destinationSelected[0].indent) {
                nodeAboveSelection.isParent = true;
            }
            var originalParent = $scope.destinationSelected[0].parent;
            var newParent = getParentAtIndentationLevelOfSelection($scope.destinationSelected, $scope.destinationUics);
            for(var i = 0; i < $scope.destinationSelected.length; i++) {
                if($scope.destinationSelected[i].parent === originalParent) {
                    $scope.destinationSelected[i].parent = newParent;
                }
                $scope.destinationSelected[i].indent += 1;
            }
            $scope.destinationUicsLookup = generateLookup($scope.destinationUics);
        }
    };

    $scope.left = function () {
        if(!isEmptyArray($scope.destinationSelected)) {
            if($scope.destinationSelected[0].indent === 0) {
                Notification.warning({message: "The selection cannot be promoted because it is already at the root level.", replaceMessage: true});
                return;
            }
            var selectedIndices = [];
            var numberOfParentNodes = 0;
            var doesSelectionIncludeWholeHierarchy = false;
            for(var i = 0; i < $scope.destinationSelected.length; i++) {
                selectedIndices = selectedIndices.concat($scope.destinationUics.indexOf($scope.destinationSelected[i]));
                if($scope.destinationSelected[i].isParent) {
                        numberOfParentNodes++;
                }
            }
            doesSelectionIncludeWholeHierarchy = angular.equals($scope.destinationSelected, [$scope.destinationSelected[0]].concat($scope.destinationUics.getChildren($scope.destinationSelected[0])));
            if(!areIndicesContiguous(selectedIndices) || (numberOfParentNodes > 0 && !doesSelectionIncludeWholeHierarchy)) {
                Notification.warning({message: "The selection must be either contiguous (i.e., no gaps) child UICs at the same level or an entire hierarchy/sub-hierarchy of UICs.", replaceMessage: true});
                return;
            }
            var rootSelectionIndex = $scope.destinationUics.indexOf($scope.destinationSelected[0]);
            var selectionParentIndex = $scope.destinationUics.indexOf($scope.destinationUics.getParent($scope.destinationSelected[0]));
            var selectionParentNode = $scope.destinationUics.getParent($scope.destinationSelected[0]);
            //The desired behavior is that the selection appears directly above its former parent.
            var originalParent = selectionParentNode.id;
            var newParent = selectionParentNode === null || selectionParentNode === undefined ? null : selectionParentNode.parent;
            for(var i = 0; i < $scope.destinationSelected.length; i++) {
                if($scope.destinationSelected[i].parent === originalParent) {
                    $scope.destinationSelected[i].parent = newParent;
                }
                $scope.destinationSelected[i].indent -= 1;
            }
            $scope.destinationUics.splice(rootSelectionIndex, $scope.destinationSelected.length);
            $scope.destinationUics = $scope.destinationUics.insertArray(selectionParentIndex, $scope.destinationSelected);
            //check for parents that no longer have children
            for(var i = 0; i < $scope.destinationUics.length; i++) {
                if($scope.destinationUics[i].isParent && $scope.destinationUics.getChildren($scope.destinationUics[i]).length === 0) {
                    $scope.destinationUics[i].isParent = false;
                }
            }
            $scope.destinationUicsLookup = generateLookup($scope.destinationUics);
            $scope.destinationSelectionNeedsToBeScrolledIntoView.value = true;
        }
    };

    $scope.down = function () {
        changeWorkingAreaNodeOrder(false);
    };

    $scope.sourceTreeSize = function () {
        return $scope.nodeCountAndStructureSize($scope.uics);
    };

    $scope.destinationTreeSize = function () {
        return $scope.nodeCountAndStructureSize($scope.destinationUics);
    };

    $scope.nodeCountAndStructureSize = function (array) {
        if (array === null || array === undefined || array.length === 0) {
            return "0 UIC(s) / 0.000 KB";
        }
        /*
         * encodeURI() URL-encodes the string using UTF-8, and unescape() then converts the escape sequences back into
         * characters. The length of the resulting array is the length of the original string in bytes (assuming UTF-8 encoding,
         * which is the default for JSON data).
         */
        var arraySize = unescape(encodeURI(JSON.stringify(array))).length;
        var result = array.length + " UIC(s) / ";
        result += (arraySize / 1024).toFixed(3) + " KB";
        return result;
    };

    $scope.loadUicFile = function(files) {
        if(!isEmptyArray(files)) {
            var file = files[0];
            //the text after the final "." in the filename should be the extension
            var fileExtension = file.name.split(".").pop();
            if(fileExtension !== "csv" && fileExtension !== "txt") {
                alert("The extension of the file to load must be .csv or .txt");
                return;
            }
            var reader = new FileReader();
            reader.onload = function(e) {
                var fileContents = e.target.result;
                $scope.inputUics = $scope.parseFileContents(fileContents);
                $scope.$apply();
            };
            reader.readAsText(file);
        };
    };

    $scope.parseFileContents = function(fileContents) {
        var parsedFile = Papa.parse(fileContents,{delimiter: "", // auto-detect
                                                  newline: "", // auto-detect
                                                  header: false,
                                                  dynamicTyping: false,
                                                  preview: 0,
                                                  encoding: "",
                                                  worker: false,
                                                  comments: false,
                                                  download: false,
                                                  skipEmptyLines: true});

        var validUics = [];
        var invalidUics = [];
        var finalUicArray = [];
        if(!isEmptyArray(parsedFile.data)) {
            for(var i = 0; i < parsedFile.data.length; i++) {
                for(var j = 0; j < parsedFile.data[i].length; j++) {
                    var parsedUic = parsedFile.data[i][j].trim().toUpperCase();
                    if($scope.isUicValid(parsedUic)) {
                        validUics = validUics.concat({uic: parsedUic});
                    } else {
                        invalidUics = invalidUics.concat({uic: parsedUic});
                    }
                }
            }
            /*
             * Here we move any duplicates to the list of invalid UICs, since duplicates cause
             * the Angular input component to break.
             */
            jQuery.each(validUics, function (i, uic) {
                if (jQuery.grep(finalUicArray, function (e) {
                    return e.uic === uic.uic;
                }).length === 0) {
                    finalUicArray.push(uic);
                } else {
                    uic.uic += " (duplicate)";
                    invalidUics.push(uic);
                }
            });
            if (invalidUics.length > 0) {
                var errorMessage = "Some of the UICs in the file you selected were invalid or were duplicates. Below is the list of invalid/duplicate UICs:\n";
                for (var i = 0; i < invalidUics.length; i++) {
                    errorMessage += invalidUics[i].uic + "\n";
                }
                alert(errorMessage);
            }
        }

        return finalUicArray;
    };

    $scope.isUicValid = function (uic) {
        var validUicRegexp = /^[a-hj-np-zA-HJ-NP-Z0-9]*$/;
        return uic !== null && uic !== undefined && uic.length >= 2 && uic.length <= 6 && validUicRegexp.test(uic);
    };

    $scope.exportWorkingAreaToText = function() {
        if(!isEmptyArray($scope.destinationUics)) {
            var timestamp = $filter('date')(new Date(), 'yyyyMMddHHmmss');
            var customForceAsString = $scope.destinationUics.map(function(e){return e.id;}).join(",");
            saveTextAs(customForceAsString, "custom_force_structure_" + timestamp + ".txt");
        }
    };

    $scope.exportWorkingAreaToCsv = function() {
        if(!isEmptyArray($scope.destinationUics)) {
            var customForceAsString = "";
            for(var i = 0; i < $scope.destinationUics.length; i++) {
                var row = "";
                for(var j = 0; j < $scope.destinationUics[i].indent; j++) {
                    row += ",";
                }
                row += $scope.destinationUics[i].id;
                customForceAsString += row + "\n";
            }
            jQuery("#csvContent").val(customForceAsString);
            jQuery("#csvForm").submit();
        }
    };

    function moveNodes(source, destination, selection, newSelection) {
        if (!newSelection.isNewSelection) {
            return;
        }
        var originalTree = angular.copy(source);
        for (var i = 0; i < selection.length; i++) {
            source.splice(source.indexOf(selection[i]), 1);
        }
        /*
         * We only want to move the node if it does not already exist in the destination, otherwise
         * an exception is thrown as the Slick DataView enforces uniqueness. If it is already there,
         * then the node is just dropped.
         */
        var duplicates = [];
        for (var i = 0; i < destination.length; i++) {
            duplicates = duplicates.concat(jQuery.grep(selection, function (e) {
                return e.id === destination[i].id;
            }));
        }
        for (var i = 0; i < duplicates.length; i++) {
            selection.splice(selection.indexOf(duplicates[i]), 1);
        }
        /*
         * At this point, the source tree and the selection probably have orphaned nodes, nodes with incorrect indentation level,
         * and parent nodes that no longer have children. Therefore, we need to realign the source tree and the selection tree
         * to take into account the new structure. However, if the source is now empty and there were no duplicates in the destination,
         * that means we moved everything with no structure changes and this can be skipped.
         */
        if (source.length > 0 || duplicates.length > 0) {
            realignTree(source, originalTree);
            realignTree(selection, originalTree);
        }
        Array.prototype.push.apply(destination, selection);
        newSelection.isNewSelection = false;
    };

    function changeWorkingAreaNodeOrder(isForUp){
        if(!isEmptyArray($scope.destinationSelected)) {
            var selectedIndices = [];
            var numberOfParentNodes = 0;
            var level = $scope.destinationSelected[0].indent;
            var parent = $scope.destinationSelected[0].parent;
            var doesSelectionCrossLevelsOrParents = false;
            for(var i = 0; i < $scope.destinationSelected.length; i++) {
                selectedIndices = selectedIndices.concat($scope.destinationUics.indexOf($scope.destinationSelected[i]));
                if($scope.destinationSelected[i].isParent) {
                    numberOfParentNodes++;
                }
                if(level !== $scope.destinationSelected[i].indent || parent !== $scope.destinationSelected[i].parent) {
                    doesSelectionCrossLevelsOrParents = true;
                }
            }
            if(numberOfParentNodes > 0 || doesSelectionCrossLevelsOrParents) {
                Notification.warning({message: "The selection must consist of either root level non-parent UICs or non-parent UICs at the same level within a hierarchy.", replaceMessage: true});
                return;
            }
            var areSelectedIndicesContiguous = areIndicesContiguous(selectedIndices);
            var nodeToMoveBelow = $scope.destinationUics[selectedIndices[selectedIndices.length - 1] + 1];
            var isBeginningOfSelectionAtTop = selectedIndices[0] === 0 || $scope.destinationUics[selectedIndices[0] - 1].isParent || (level > 0 && $scope.destinationUics[selectedIndices[0] - 1].indent !== level);
            var isSelectionRootNodesBelowAHierarchy = selectedIndices[0] !== 0 && level === 0 && $scope.destinationUics[selectedIndices[0] - 1].indent > 0;
            var isEndOfSelectionAtBottom = selectedIndices[selectedIndices.length - 1] === ($scope.destinationUics.length - 1) || (level !== 0 && nodeToMoveBelow !== null && nodeToMoveBelow !== undefined && (nodeToMoveBelow.isParent || nodeToMoveBelow.indent !== level));
            var isSelectionRootNodesAboveAHierarchy = level === 0 && (nodeToMoveBelow !== null && nodeToMoveBelow !== undefined && (nodeToMoveBelow.isParent || nodeToMoveBelow.indent !== level));
            if(isForUp && isBeginningOfSelectionAtTop && areSelectedIndicesContiguous) {
                Notification.warning({message: "The selection is already at the top of its current level.", replaceMessage: true});
                return;
            } else if(!isForUp && isEndOfSelectionAtBottom && areSelectedIndicesContiguous) {
                Notification.warning({message: "The selection is already at the bottom of its current level.", replaceMessage: true});
                return;
            }
            for(var i = selectedIndices.length - 1; i >= 0; i--) {
                $scope.destinationUics.splice(selectedIndices[i], 1);
            }
            /*
             * If the selection is not contiguous but part of it is at the top/bottom, then we move the rest to the top/bottom. Otherwise,
             * we move the selection up/down to the index above/below the selection. Root nodes are handled as a special case and can
             * jump over an intervening hierarchy.
             */
            var indexToMoveTo;
            if(isForUp) {
                if(isSelectionRootNodesBelowAHierarchy) {
                    indexToMoveTo = 0;
                    for(var i = selectedIndices[0] - 1; i >= 0; i--) {
                        if(($scope.destinationUics[i].indent === 0 && !$scope.destinationUics[i].isParent)) {
                            indexToMoveTo = i + 1;
                            break;
                        }
                    }
                } else {
                    if(isBeginningOfSelectionAtTop) {
                        indexToMoveTo = selectedIndices[0];
                    } else {
                        indexToMoveTo = selectedIndices[0] - 1;
                    }
                }
            } else {
                if(isSelectionRootNodesAboveAHierarchy) {
                    var hierarchy = $scope.destinationUics.getChildren(nodeToMoveBelow);
                    indexToMoveTo = $scope.destinationUics.indexOf(hierarchy[hierarchy.length - 1]) + 1;
                } else {
                    if(isEndOfSelectionAtBottom) {
                        indexToMoveTo = nodeToMoveBelow === null || nodeToMoveBelow === undefined ? $scope.destinationUics.length : $scope.destinationUics.indexOf(nodeToMoveBelow);
                    } else {
                        indexToMoveTo = nodeToMoveBelow === null || nodeToMoveBelow === undefined ? $scope.destinationUics.length : $scope.destinationUics.indexOf(nodeToMoveBelow) + 1;
                    }
                }
            }
            $scope.destinationUics = $scope.destinationUics.insertArray(indexToMoveTo, $scope.destinationSelected);
            $scope.destinationUicsLookup = generateLookup($scope.destinationUics);
            $scope.destinationSelectionNeedsToBeScrolledIntoView.value = true;
        }
    };

    function generateLookup(uicArray) {
        var lookup = {};
        for (var i = 0, len = uicArray.length; i < len; i++) {
            lookup[uicArray[i].id] = uicArray[i];
        }
        return lookup;
    };

    function angularIndexOf(array, object){
        for(var i = 0; i < array.length; i++){
            if(angular.equals(array[i], object)){
                return i;
            }
        };
        return -1;
    };

    function isEmptyArray(array) {
        return (array === null || array === undefined || array.length === 0);
    };

    function realignTree(modifiedTree, originalTree) {
        var originalModifiedTree = angular.copy(modifiedTree);
        //first pass, determine new parent-child relationships
        for (var i = 0; i < modifiedTree.length; i++) {
            var nearestParent = getNearestParent(modifiedTree[i], originalModifiedTree, originalTree);
            modifiedTree[i].parent = nearestParent === null ? null : nearestParent.id;
        }
        //second pass, fix parents that no longer have children and fix indentation
        for (var i = 0; i < modifiedTree.length; i++) {
            if (modifiedTree[i].isParent && modifiedTree.getChildren(modifiedTree[i]).length === 0) {
                modifiedTree[i].isParent = false;
            }
            if (modifiedTree[i].parent === null || modifiedTree[i].parent === undefined) {
                modifiedTree[i].indent = 0;
            } else {
                modifiedTree[i].indent = modifiedTree.getParent(modifiedTree[i]).indent + 1;
            }
        }
    };

    function getNearestParent(node, modifiedTree, originalTree) {
        if (node === null) {
            return null;
        }
        var nearestParent = null;
        var originalParent = originalTree.getParent(node);
        if (angularIndexOf(modifiedTree, originalParent) === -1) {
            nearestParent = getNearestParent(originalParent, modifiedTree, originalTree);
        } else {
            nearestParent = originalParent;
        }
        return nearestParent;
    };

    function getParentAtIndentationLevelOfSelection(selection, tree) {
      var parent = null;
      for(var i = tree.indexOf(selection[0]) - 1; i >= 0; i--) {
          if(tree[i].indent === selection[0].indent) {
              parent = tree[i].id;
              break;
          }
      }
      return parent;
    };

    function areIndicesContiguous(indices) {
        for(var i = 1; i < indices.length; i++) {
            if(indices[i] !== (indices[i-1] + 1)) {
                return false;
            }
        }
        return true;
    };

    Array.prototype.getParent = function (item) {
        for (var i = 0; i < this.length; i++) {
            if (this[i].id === item.parent)
                return this[i];
        }
        return null;
    };

    Array.prototype.getParentIndex = function (item) {
        for (var i = 0; i < this.length; i++) {
            if (this[i].id === item.parent)
                return i;
        }
    };

    Array.prototype.getChildren = function (item) {
        var children = [];
        for (var i = 0; i < this.length; i++) {
            if (this[i].parent === item.id) {
                children[children.length] = this[i];
                if (children[children.length - 1].isParent) {
                    children = children.concat(this.getChildren(children[children.length - 1]));
                }
            }
        }
        return children;
    };

    Array.prototype.insertArray = function(index, array) {
        return this.slice(0, index).concat(array).concat(this.slice(index));
    };

    // tree options
    $scope.treeOptions = {
        data: 'uics',
        columnDefs: [
            {id: 'uic', name: 'Source UIC Tree', field: 'display'}
        ],
        lookup: 'uicsLookup',
        afterSelectionChange: function (selectedRecords) {
            $scope.selected = selectedRecords;
            $scope.newSelection.isNewSelection = true;
        },
        movedRows: 'movedRows',
        submitResponse: 'submitResponse'
    };

    // destination tree options
    $scope.destinationTreeOptions = {
        data: 'destinationUics',
        columnDefs: [
            {id: 'uic', name: 'Destination UIC Tree', field: 'display'}
        ],
        lookup: 'destinationUicsLookup',
        afterSelectionChange: function (selectedRecords) {
            $scope.destinationSelected = selectedRecords;
            $scope.newDestinationSelection.isNewSelection = true;
        },
        movedRows: 'destinationMovedRows',
        selectionNeedsToBeScrolledIntoView: 'destinationSelectionNeedsToBeScrolledIntoView'
    };
});
