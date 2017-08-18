'use strict';

/* Controllers */
var testApp = angular.module('testApp');

testApp.controller('HomeCtrl', ['$scope', '$rootScope', '$http', '$location', "ScientificModelRest", "ValidationTestDefinitionRest", 'CollabParameters', 'IsCollabMemberRest',
    function($scope, $rootScope, $http, $location, ScientificModelRest, ValidationTestDefinitionRest, CollabParameters, IsCollabMemberRest) {

        CollabParameters.setService().$promise.then(function() {

            $scope.collab_species = CollabParameters.getParameters("species");
            $scope.collab_brain_region = CollabParameters.getParameters("brain_region");
            $scope.collab_cell_type = CollabParameters.getParameters("cell_type");
            $scope.collab_model_type = CollabParameters.getParameters("model_type");
            $scope.collab_test_type = CollabParameters.getParameters("test_type");
            $scope.collab_data_modalities = CollabParameters.getParameters("data_modalities");

            var ctx = CollabParameters.getCtx();

            // $scope.is_collab_member = false;
            // $scope.is_collab_member = IsCollabMemberRest.get({ ctx: ctx, });
            // $scope.is_collab_member.$promise.then(function() {
            //     $scope.is_collab_member = $scope.is_collab_member.is_member;
            //     $scope.is_collab_member = true; //to delete  
            // });
            $scope.models = ScientificModelRest.get({ ctx: ctx }, function(data) {});
            $scope.tests = ValidationTestDefinitionRest.get({ ctx: ctx }, function(data) {});

        });

        $scope.goToModelDetailView = function(model) {
            $location.path('/home/validation_model_detail/' + model.id);
        };

        $scope.goToTestDetailView = function(test) {
            $location.path('/home/validation_test/' + test.id);
        };

    }
]);

testApp.controller('ValTestCtrl', ['$scope', '$rootScope', '$http', '$location', 'ValidationTestDefinitionRest', 'CollabParameters', 'IsCollabMemberRest',
    function($scope, $rootScope, $http, $location, ValidationTestDefinitionRest, CollabParameters, IsCollabMemberRest) {

        CollabParameters.setService().$promise.then(function() {

            $scope.collab_species = CollabParameters.getParameters("species");
            $scope.collab_brain_region = CollabParameters.getParameters("brain_region");
            $scope.collab_cell_type = CollabParameters.getParameters("cell_type");
            $scope.collab_model_type = CollabParameters.getParameters("model_type");
            $scope.collab_test_type = CollabParameters.getParameters("test_type");
            $scope.collab_data_modalities = CollabParameters.getParameters("data_modalities");

            var ctx = CollabParameters.getCtx();

            $scope.is_collab_member = false;
            $scope.is_collab_member = IsCollabMemberRest.get({ ctx: ctx, });
            $scope.is_collab_member.$promise.then(function() {
                $scope.is_collab_member = $scope.is_collab_member.is_member;
            });

            $scope.test_list = ValidationTestDefinitionRest.get({ ctx: CollabParameters.getCtx() }, function(data) {});
        });


        $scope.goToDetailView = function(test) {
            $location.path('/home/validation_test/' + test.id);
        };


    }
]);


testApp.controller('ValModelDetailCtrl', ['$scope', '$rootScope', '$http', '$location', '$stateParams', 'ScientificModelRest', 'ScientificModelInstanceRest', 'CollabParameters', 'IsCollabMemberRest', 'AppIDRest', 'Graphics',
    function($scope, $rootScope, $http, $location, $stateParams, ScientificModelRest, ScientificModelInstanceRest, CollabParameters, IsCollabMemberRest, AppIDRest, Graphics) {

        CollabParameters.setService().$promise.then(function() {
            var ctx = CollabParameters.getCtx();
            $scope.is_collab_member = false;
            $scope.is_collab_member = IsCollabMemberRest.get({ ctx: ctx, });
            $scope.is_collab_member.$promise.then(function() {
                $scope.is_collab_member = $scope.is_collab_member.is_member;
            });
            $scope.model = ScientificModelRest.get({ ctx: ctx, id: $stateParams.uuid });
            $scope.model.$promise.then(function() {
                //graph and table results

                $scope.line_result_focussed;
                $scope.$on('data_focussed:updated', function(event, data) {
                    $scope.line_result_focussed = data;
                    $scope.$apply();
                });
                $scope.data = Graphics.getResultsfromModelID($scope.model);
                $scope.options5 = Graphics.get_lines_options('Model/p-value', '', "p-value", "this is a caption");
            });
        });

        $scope.goToDetailTest = function(test_id) {
            console.log("test id", test_id)
            $location.path('/home/validation_test/' + test_id);
        };

        $scope.goToDetailTestResult = function(test_result_id) {
            console.log("test id", test_result_id)
            $location.path('/home/validation_test_result/' + test_result_id);
        };

        $scope.goToModelCatalog = function() {

            //works 
            // document.referrer = "https://collab.humanbrainproject.eu/#/collab/2180/nav/38111";
            //document.location.href = 'https://localhost:8000/?ctx='+$scope.model.models[0].access_control.id+'#/model-catalog/detail/'+$scope.model.models[0].id;
            var collab_id = $scope.model.models[0].access_control.collab_id;
            var app_id = AppIDRest.get({ ctx: $scope.model.models[0].access_control.id });
            app_id.$promise.then(function() {
                app_id = app_id.app_id;

                //to try open in new window
                var url = "https://collab.humanbrainproject.eu/#/collab/" + collab_id + "/nav/" + app_id; //to go to collab api
                //var url = 'https://localhost:8000/?ctx=' + $scope.model.models[0].access_control.id + '#/model-catalog/detail/' + $scope.model.models[0].id; //to go outside collab but directly to model detail

                var win = window.open(url, 'modelCatalog');
                console.log(win.document);
                // win.document.location = 'https://localhost:8000/?ctx=' + $scope.model.models[0].access_control.id + '#/model-catalog/detail/' + $scope.model.models[0].id;
                // win.document.location.href = 'https://localhost:8000/?ctx='+$scope.model.models[0].access_control.id+'#/model-catalog/detail/'+$scope.model.models[0].id;
                // win.location.path('#/model-catalog/detail/'+$scope.model.models[0].id);

                // win.$state= '#/model-catalog/detail/'+$scope.model.models[0].id;
                // win.$state.reload();
                // document.location.href = 'https://localhost:8000/?ctx='+$scope.model.models[0].access_control.id+'#/model-catalog/detail/'+$scope.model.models[0].id;

            });




        }
    }
]);

testApp.directive('markdown', function() {
    var converter = new Showdown.converter();
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            function renderMarkdown() {
                var htmlText = converter.makeHtml(scope.$eval(attrs.markdown) || '');
                element.html(htmlText);
            }
            scope.$watch(attrs.markdown, renderMarkdown);
            renderMarkdown();
        }
    };
});


testApp.controller('ValTestDetailCtrl', ['$scope', '$rootScope', '$http', '$location', '$stateParams', '$state', 'ValidationTestDefinitionRest', 'ValidationTestCodeRest', 'CollabParameters', 'TestCommentRest', "IsCollabMemberRest", "Graphics",

    function($scope, $rootScope, $http, $location, $stateParams, $state, ValidationTestDefinitionRest, ValidationTestCodeRest, CollabParameters, TestCommentRest, IsCollabMemberRest, Graphics) {

        CollabParameters.setService().$promise.then(function() {
            $scope.detail_test = ValidationTestDefinitionRest.get({ ctx: CollabParameters.getCtx(), id: $stateParams.uuid });


            $scope.species = CollabParameters.getParameters("species");
            $scope.brain_region = CollabParameters.getParameters("brain_region");
            $scope.cell_type = CollabParameters.getParameters("cell_type");
            $scope.model_type = CollabParameters.getParameters("model_type");
            $scope.test_type = CollabParameters.getParameters("test_type");
            $scope.data_modalities = CollabParameters.getParameters("data_modalities");


            $scope.detail_version_test = ValidationTestCodeRest.get({ ctx: CollabParameters.getCtx(), test_definition_id: $stateParams.uuid });
            $scope.test_comments = TestCommentRest.get({ ctx: CollabParameters.getCtx(), test_id: $stateParams.uuid });


            $scope.detail_test.$promise.then(function() {
                Graphics.getResultsfromTestID($scope.detail_test).then(function(graphic_data) {
                    $scope.result_focussed;
                    $scope.$on('data_focussed:updated', function(event, data) {
                        $scope.result_focussed = data;
                        $scope.$apply();
                    });
                    $scope.graphic_data = graphic_data;
                    $scope.graphic_options = Graphics.get_lines_options('Test/result', '', "", "this is a caption");

                }).catch(function(err) {
                    console.error('Erreur !');
                    console.dir(err);
                    console.log(err);
                });
            });


            $scope.submit_comment = function() {
                var data_comment = JSON.stringify({ author: $stateParams.uuid, text: this.txt_comment, approved_comment: false, test_id: $stateParams.uuid });
                TestCommentRest.post(data_comment, function(value) {});
                $state.reload();
            };


            var _add_params = function() {
                $scope.test_code.test_definition_id = $scope.detail_test.tests[0].id;
            };

            $scope.selected_tab = "";
            $scope.toogleTabs = function(id_tab) {
                $scope.selected_tab = id_tab;

                var list_tab_id = [
                    "tab_description",
                    "tab_version",
                    "tab_new_version",
                    "tab_results", // this one must be visibility: hidden or visible
                    "tab_comments",
                    "tab_edit_test",
                ]

                //set all tabs style display to "none"
                var i = 0;
                for (i; i < list_tab_id.length; i++) {
                    if (list_tab_id[i] == "tab_results") {
                        document.getElementById(list_tab_id[i]).style.visibility = "hidden";

                    } else {
                        document.getElementById(list_tab_id[i]).style.display = "none";
                    }

                }

                //set id_tab style display to "block" or visible
                if (id_tab == "tab_results") {
                    document.getElementById(id_tab).style.visibility = "visible";
                } else {
                    document.getElementById(id_tab).style.display = "block";
                }





                _active_tab(id_tab);

            };

            var _active_tab = function(id_tab) {
                var a = document.getElementById("li_tab_description");
                var b = document.getElementById("li_tab_version");
                var c = document.getElementById("li_tab_results");
                var d = document.getElementById("li_tab_comments");
                a.className = b.className = c.className = d.className = "nav-link";
                if (id_tab != "tab_new_version" || id_tab != "tab_edit_test") {
                    var e = document.getElementById("li_" + id_tab);
                    e.className += " active";

                };
            };


            $scope.saveVersion = function() {
                _add_params();
                var parameters = JSON.stringify($scope.test_code);
                ValidationTestCodeRest.save({ ctx: CollabParameters.getCtx(), id: $scope.detail_test.tests[0].id }, parameters).$promise.then(function() {
                    document.getElementById("tab_description").style.display = "none";
                    document.getElementById("tab_version").style.display = "block";
                    document.getElementById("tab_new_version").style.display = "none";
                    document.getElementById("tab_results").style.visibility = "hidden";
                    document.getElementById("tab_comments").style.display = "none";
                    $state.reload();
                });

            };



            $scope.editTest = function() {
                var parameters = JSON.stringify($scope.detail_test.tests[0]);
                ValidationTestDefinitionRest.put({ ctx: CollabParameters.getCtx(), id: $scope.detail_test.tests[0].id }, parameters).$promise.then(function() {
                    document.getElementById("tab_description").style.display = "none";
                    document.getElementById("tab_version").style.display = "block";
                    document.getElementById("tab_new_version").style.display = "none";
                    document.getElementById("tab_results").style.display = "none";
                    document.getElementById("tab_comments").style.display = "none";
                    $state.reload();
                });

            };

            $scope.submit_comment = function() {
                var data_comment = JSON.stringify({ author: $stateParams.uuid, text: this.txt_comment, approved_comment: false, test_id: $stateParams.uuid });
                TestCommentRest.post(data_comment, function(value) {});
                $state.reload();
            };
        });

    }
]);

testApp.controller('ValTestResultDetailCtrl', ['$scope', '$rootScope', '$http', '$location', '$stateParams', 'IsCollabMemberRest', 'AppIDRest', 'ValidationResultRest', 'CollabParameters',
    function($scope, $rootScope, $http, $location, $stateParams, IsCollabMemberRest, AppIDRest, ValidationResultRest, CollabParameters) {

        CollabParameters.setService().$promise.then(function() {
            var ctx = CollabParameters.getCtx();
            $scope.is_collab_member = false;
            $scope.is_collab_member = IsCollabMemberRest.get({ ctx: ctx, });
            $scope.is_collab_member.$promise.then(function() {
                $scope.is_collab_member = $scope.is_collab_member.is_member;
            });

            $scope.test_result = ValidationResultRest.get({ ctx: ctx, id: $stateParams.uuid });

        });

    }
]);


testApp.controller('TestResultCtrl', ['$scope', '$rootScope', '$http', '$location', '$timeout', 'CollabParameters', 'ValidationResultRest_fortest', 'ValidationResultRest', 'Graphics',

    function($scope, $rootScope, $http, $location, $timeout, CollabParameters, ValidationResultRest_fortest, ValidationResultRest, Graphics) {
        CollabParameters.setService().$promise.then(function() {

            var temp_test = Graphics.data_fromAPI();
            temp_test.then(function() {
                $scope.data5 = temp_test.$$state.value;
            });

            $scope.options5 = Graphics.get_lines_options();

            $scope.line_result_focussed;
            $scope.$on('data_focussed:updated', function(event, data) {
                $scope.line_result_focussed = data;
                $scope.$apply();
            });

        });
    }
]);


testApp.controller('ValTestCreateCtrl', ['$scope', '$rootScope', '$http', '$location', 'ValidationTestDefinitionRest', 'ValidationTestCodeRest', 'CollabParameters',
    function($scope, $rootScope, $http, $location, ValidationTestDefinitionRest, ValidationTestCodeRest, CollabParameters) {
        CollabParameters.setService().$promise.then(function() {
            $scope.species = CollabParameters.getParameters("species");
            $scope.brain_region = CollabParameters.getParameters("brain_region");
            $scope.cell_type = CollabParameters.getParameters("cell_type");
            $scope.data_type = CollabParameters.getParameters("data_type");
            $scope.data_modalities = CollabParameters.getParameters("data_modalities");
            $scope.test_type = CollabParameters.getParameters("test_type");
            $scope.ctx = CollabParameters.getCtx();


            $scope.saveTest = function() {
                var parameters = JSON.stringify({ test_data: $scope.test, code_data: $scope.code });
                var a = ValidationTestDefinitionRest.save({ ctx: CollabParameters.getCtx() }, parameters).$promise.then(function(data) {
                    $location.path('/model-catalog/detail/' + data.uuid);
                });

            };

        });

    }
]);




testApp.controller('ConfigCtrl', ['$scope', '$rootScope', '$http', '$location', 'CollabParameters', 'AuthaurizedCollabParameterRest',
    function($scope, $rootScope, $http, $location, CollabParameters, AuthaurizedCollabParameterRest) {

        CollabParameters.setService().$promise.then(function() {
            // $scope.list_param2 = AuthaurizedCollabParameterRest2.get({});

            $scope.list_param = AuthaurizedCollabParameterRest.get({ ctx: CollabParameters.getCtx() });

            $scope.make_post = function() {

                CollabParameters.initConfiguration();

                $scope.selected_data_modalities.forEach(function(value, i) {
                    CollabParameters.addParameter("data_modalities", value.authorized_value);
                });

                $scope.selected_test_type.forEach(function(value, i) {
                    CollabParameters.addParameter("test_type", value.authorized_value);
                });

                $scope.selected_model_type.forEach(function(value, i) {
                    CollabParameters.addParameter("model_type", value.authorized_value);
                });

                $scope.selected_species.forEach(function(value, i) {
                    CollabParameters.addParameter("species", value.authorized_value);
                });

                $scope.selected_brain_region.forEach(function(value, i) {
                    CollabParameters.addParameter("brain_region", value.authorized_value);
                });

                $scope.selected_cell_type.forEach(function(value, i) {
                    CollabParameters.addParameter("cell_type", value.authorized_value);
                });

                CollabParameters.put_parameters().$promise.then(function() {
                    CollabParameters.getRequestParameters().$promise.then(function() {
                        $location.path('/home');
                    });
                });


            };


            //not working : might require to clean up the the selectors.
            $scope.reloadPage = function() {
                $location.path('/home/config');

            }; // { window.location.reload(); }
        });
    }
]);



//Filter multiple
testApp.filter('filterMultiple', ['$parse', '$filter', function($parse, $filter) {
    return function(items, keyObj) {
        var x = false;
        if (!angular.isArray(items)) {
            return items;
        }
        var filterObj = {
            data: items,
            filteredData: [],
            applyFilter: function(obj, key) {
                var fData = [];
                if (this.filteredData.length == 0 && x == false)
                    this.filteredData = this.data;
                if (obj) {
                    var fObj = {};
                    if (!angular.isArray(obj)) {
                        fObj[key] = obj;
                        fData = fData.concat($filter('filter')(this.filteredData, fObj));
                    } else if (angular.isArray(obj)) {
                        if (obj.length > 0) {
                            for (var i = 0; i < obj.length; i++) {
                                if (angular.isDefined(obj[i])) {
                                    fObj[key] = obj[i];
                                    fData = fData.concat($filter('filter')(this.filteredData, fObj));
                                }
                            }
                        }
                    }
                    if (fData.length > 0) {
                        this.filteredData = fData;
                    }
                    if (fData.length == 0) {
                        if (obj != "" && obj != undefined) {
                            this.filteredData = fData;
                            x = true;
                        }
                    }

                }
            }
        };
        if (keyObj) {
            angular.forEach(keyObj, function(obj, key) {
                filterObj.applyFilter(obj, key);
            });
        }

        return filterObj.filteredData;
    }
}]);




//Model catalog
//directives and filters 
var ModelCatalogApp = angular.module('ModelCatalogApp');

ModelCatalogApp.directive('markdown', function() {
    var converter = new Showdown.converter();
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            function renderMarkdown() {
                var htmlText = converter.makeHtml(scope.$eval(attrs.markdown) || '');
                element.html(htmlText);
            }
            scope.$watch(attrs.markdown, renderMarkdown);
            renderMarkdown();
        }
    };
});

//Filter multiple
ModelCatalogApp.filter('filterMultiple', ['$parse', '$filter', function($parse, $filter) {
    return function(items, keyObj) {
        var x = false;
        if (!angular.isArray(items)) {
            return items;
        }
        var filterObj = {
            data: items,
            filteredData: [],
            applyFilter: function(obj, key) {
                var fData = [];
                if (this.filteredData.length == 0 && x == false)
                    this.filteredData = this.data;
                if (obj) {
                    var fObj = {};
                    if (!angular.isArray(obj)) {
                        fObj[key] = obj;
                        fData = fData.concat($filter('filter')(this.filteredData, fObj));
                    } else if (angular.isArray(obj)) {
                        if (obj.length > 0) {
                            for (var i = 0; i < obj.length; i++) {
                                if (angular.isDefined(obj[i])) {
                                    fObj[key] = obj[i];
                                    fData = fData.concat($filter('filter')(this.filteredData, fObj));
                                }
                            }
                        }
                    }
                    if (fData.length > 0) {
                        this.filteredData = fData;
                    }
                    if (fData.length == 0) {
                        if (obj != "" && obj != undefined) {
                            this.filteredData = fData;
                            x = true;
                        }
                    }

                }
            }
        };
        if (keyObj) {
            angular.forEach(keyObj, function(obj, key) {
                filterObj.applyFilter(obj, key);
            });
        }

        return filterObj.filteredData;
    }
}]);
//controllers
ModelCatalogApp.controller('ModelCatalogCtrl', ['$scope', '$rootScope', '$http', '$location', 'ScientificModelRest', 'CollabParameters', 'IsCollabMemberRest',

    function($scope, $rootScope, $http, $location, ScientificModelRest, CollabParameters, IsCollabMemberRest) {
        CollabParameters.setService().$promise.then(function() {

            $scope.collab_species = CollabParameters.getParameters("species");
            $scope.collab_brain_region = CollabParameters.getParameters("brain_region");
            $scope.collab_cell_type = CollabParameters.getParameters("cell_type");
            $scope.collab_model_type = CollabParameters.getParameters("model_type");
            var ctx = CollabParameters.getCtx();
            $scope.models = ScientificModelRest.get({ ctx: ctx });


            $scope.is_collab_member = false;
            $scope.is_collab_member = IsCollabMemberRest.get({ ctx: ctx, });
            $scope.is_collab_member.$promise.then(function() {
                $scope.is_collab_member = $scope.is_collab_member.is_member;
            });
            console.log($scope.models)
        });
        $scope.goToDetailView = function(model) {
            console.log(model.id);
            $location.path('/model-catalog/detail/' + model.id);
        };
    }
]);

ModelCatalogApp.controller('ModelCatalogCreateCtrl', ['$scope', '$rootScope', '$http', '$location', 'ScientificModelRest', 'CollabParameters', 'CollabIDRest',

    function($scope, $rootScope, $http, $location, ScientificModelRest, CollabParameters, CollabIDRest) {
        CollabParameters.setService().$promise.then(function() {
            $scope.addImage = false;
            $scope.species = CollabParameters.getParameters("species");
            $scope.brain_region = CollabParameters.getParameters("brain_region");
            $scope.cell_type = CollabParameters.getParameters("cell_type");
            $scope.model_type = CollabParameters.getParameters("model_type");
            $scope.ctx = CollabParameters.getCtx();

            $scope.model_image = [];

            $scope.displayAddImage = function() {
                $scope.addImage = true;
            };
            $scope.saveImage = function() {
                if (JSON.stringify($scope.image) != undefined) {
                    $scope.model_image.push($scope.image);
                    $scope.addImage = false;
                    $scope.image = undefined;
                } else { alert("you need to add an url!"); }
            };
            $scope.closeImagePanel = function() {
                $scope.image = {};
                $scope.addImage = false;
            };

            var _add_access_control = function() {
                $scope.model.access_control_id = $scope.ctx;
            };

            $scope.saveModel = function() {
                _add_access_control();
                console.log(JSON.stringify($scope.model));
                var parameters = JSON.stringify({ model: $scope.model, model_instance: $scope.model_instance, model_image: $scope.model_image });
                var a = ScientificModelRest.save({ ctx: CollabParameters.getCtx() }, parameters).$promise.then(function(data) {
                    $location.path('/model-catalog/detail/' + data.uuid);
                });

            };
            $scope.deleteImage = function(index) {
                $scope.model_image.splice(index, 1);
            };
        });



    }

]);

ModelCatalogApp.controller('ModelCatalogDetailCtrl', ['$scope', '$rootScope', '$http', '$location', '$stateParams', 'ScientificModelRest', 'CollabParameters', 'IsCollabMemberRest',
    function($scope, $rootScope, $http, $lcation, $stateParams, ScientificModelRest, CollabParameters, IsCollabMemberRest) {

        CollabParameters.setService().$promise.then(function() {

            $scope.ctx = CollabParameters.getCtx()
            console.log(document.location.href);
            $("#ImagePopupDetail").hide();
            $scope.model = ScientificModelRest.get({ ctx: $scope.ctx, id: $stateParams.uuid });

            $scope.toggleSize = function(index, img) {
                $scope.bigImage = img;
                $("#ImagePopupDetail").show();
            }

            $scope.closeImagePanel = function() {
                $scope.image = {};
                $("#ImagePopupDetail").hide();
            };


            $scope.is_collab_member = false;
            $scope.is_collab_member = IsCollabMemberRest.get({ ctx: $scope.ctx, })
            $scope.is_collab_member.$promise.then(function() {
                $scope.is_collab_member = $scope.is_collab_member.is_member;
            });

        });


    }
]);

ModelCatalogApp.controller('ModelCatalogEditCtrl', ['$scope', '$rootScope', '$http', '$location', '$state', '$stateParams', 'ScientificModelRest', 'ScientificModelInstanceRest', 'ScientificModelImageRest', 'CollabParameters',
    function($scope, $rootScope, $http, $location, $state, $stateParams, ScientificModelRest, ScientificModelInstanceRest, ScientificModelImageRest, CollabParameters) {
        CollabParameters.setService().$promise.then(function() {
            $scope.addImage = false;
            $scope.species = CollabParameters.getParameters("species");
            $scope.brain_region = CollabParameters.getParameters("brain_region");
            $scope.cell_type = CollabParameters.getParameters("cell_type");
            $scope.model_type = CollabParameters.getParameters("model_type");
            $scope.model = ScientificModelRest.get({ ctx: CollabParameters.getCtx(), id: $stateParams.uuid });

            $scope.deleteImage = function(img) {
                var image = img
                ScientificModelImageRest.delete(image).$promise.then(
                    function(data) {
                        alert('Image ' + img.id + ' has been deleted !');
                        $state.reload();
                        // $location.reload(); // $location.path('/model-catalog/edit/' + $stateParams.uuid); //not working. to do after
                    });
            };
            $scope.displayAddImage = function() {
                $scope.addImage = true;
            };
            $scope.saveImage = function() {
                if (JSON.stringify($scope.image) != undefined) {
                    var parameters = JSON.stringify({ model_id: $stateParams.uuid, model_image: $scope.image });
                    ScientificModelImageRest.post({ ctx: CollabParameters.getCtx() }, parameters).$promise.then(function(data) {
                        $scope.addImage = false;
                        alert('Image has been saved !');
                        $state.reload(); // $location.path('/model-catalog/edit/' + $stateParams.uuid); //not working. to do after
                    });
                } else { alert("you need to add an url!") }
            };
            $scope.closeImagePanel = function() {
                $scope.image = {};
                $scope.addImage = false;
            };
            $scope.editImages = function() {
                var parameters = $scope.model.model_images;
                var a = ScientificModelImageRest.put({ ctx: CollabParameters.getCtx() }, parameters).$promise.then(function(data) {
                    alert('model images have been correctly edited');
                });
            };
            $scope.saveModel = function() {
                var parameters = $scope.model;
                var a = ScientificModelRest.put({ ctx: CollabParameters.getCtx() }, parameters).$promise.then(function(data) {
                    alert('model correctly edited');
                });
            };
            $scope.saveModelInstance = function() {

                var parameters = $scope.model.model_instances;
                var a = ScientificModelInstanceRest.put({ ctx: CollabParameters.getCtx() }, parameters).$promise.then(function(data) { alert('model instances correctly edited') });
            };

        });
    }
]);

ModelCatalogApp.controller('ModelCatalogVersionCtrl', ['$scope', '$rootScope', '$http', '$location', '$stateParams', 'ScientificModelRest', 'ScientificModelInstanceRest', 'CollabParameters',
    function($scope, $rootScope, $http, $location, $stateParams, ScientificModelRest, ScientificModelInstanceRest, CollabParameters) {
        CollabParameters.setService().$promise.then(function() {
            $scope.model = ScientificModelRest.get({ id: $stateParams.uuid }); //really needed??? just to put model name
            $scope.saveVersion = function() {
                $scope.model_instance.model_id = $stateParams.uuid;
                var parameters = JSON.stringify($scope.model_instance);
                ScientificModelInstanceRest.save({ ctx: CollabParameters.getCtx() }, parameters).$promise.then(function(data) {
                    $location.path('/model-catalog/detail/' + $stateParams.uuid);
                });
            };
        });


    }

]);



///////////////////////////////////////////////////////////////////////

var ParametersConfigurationApp = angular.module('ParametersConfigurationApp');

ParametersConfigurationApp.controller('ParametersConfigurationCtrl', ['$scope', '$rootScope', '$http', '$location', 'CollabParameters', 'AuthaurizedCollabParameterRest', 'CollabIDRest',
    function($scope, $rootScope, $http, $location, CollabParameters, AuthaurizedCollabParameterRest, CollabIDRest) {

        CollabParameters.setService().$promise.then(function() {
            var app_type = document.getElementById("app").getAttribute("value");
            // $scope.list_param2 = AuthaurizedCollabParameterRest2.get({});
            var collab = CollabIDRest.get();

            $scope.list_param = AuthaurizedCollabParameterRest.get({ ctx: CollabParameters.getCtx() });

            $scope.list_param.$promise.then(function() {
                $scope.data_modalities = $scope.list_param.data_modalities;
                $scope.test_type = $scope.list_param.test_type;
                $scope.model_type = $scope.list_param.model_type;
                $scope.species = $scope.list_param.species;
                $scope.brain_region = $scope.list_param.brain_region;
                $scope.cell_type = $scope.list_param.cell_type;
            });

            $scope.selected_data_modalities = CollabParameters.getParameters_authorized_value_formated("data_modalities");
            $scope.selected_test_type = CollabParameters.getParameters_authorized_value_formated("test_type");
            $scope.selected_model_type = CollabParameters.getParameters_authorized_value_formated("model_type");
            $scope.selected_species = CollabParameters.getParameters_authorized_value_formated("species");
            $scope.selected_brain_region = CollabParameters.getParameters_authorized_value_formated("brain_region");
            $scope.selected_cell_type = CollabParameters.getParameters_authorized_value_formated("cell_type");



            $scope.make_post = function() {

                CollabParameters.initConfiguration();

                $scope.selected_data_modalities.forEach(function(value, i) {
                    CollabParameters.addParameter("data_modalities", value.authorized_value);
                });

                $scope.selected_test_type.forEach(function(value, i) {
                    CollabParameters.addParameter("test_type", value.authorized_value);
                });

                $scope.selected_model_type.forEach(function(value, i) {
                    CollabParameters.addParameter("model_type", value.authorized_value);
                });

                $scope.selected_species.forEach(function(value, i) {
                    CollabParameters.addParameter("species", value.authorized_value);
                });

                $scope.selected_brain_region.forEach(function(value, i) {
                    CollabParameters.addParameter("brain_region", value.authorized_value);
                });

                $scope.selected_cell_type.forEach(function(value, i) {
                    CollabParameters.addParameter("cell_type", value.authorized_value);
                });

                CollabParameters.addParameter("app_type", app_type);

                CollabParameters.setCollabId("collab_id", collab.collab_id);

                CollabParameters.put_parameters().$promise.then(function() {
                    CollabParameters.getRequestParameters().$promise.then(function() {});
                    alert("Your app have been correctly configured")
                });

            };


        });
    }
]);


ParametersConfigurationApp.controller('ParametersConfigurationRedirectCtrl', ['$scope', '$rootScope', '$http', '$location', 'CollabParameters', 'AuthaurizedCollabParameterRest',
    function($scope, $rootScope, $http, $location, CollabParameters, AuthaurizedCollabParameterRest) {
        $scope.init = function() {
            var app_type = document.getElementById("app").getAttribute("value");
            if (app_type == "model_catalog") {
                $location.path('/modelparametersconfiguration');
            } else if (app_type == "validation_app") {
                $location.path('/validationparametersconfiguration');
            }
        }

    }
]);