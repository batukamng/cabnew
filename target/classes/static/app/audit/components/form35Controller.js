angular
    .module('altairApp')
    .controller(
        'form35Ctrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$filter',
            '$timeout',
            'mainService',
            'fileUpload',
            'commonDataSource',
            'sweet',
            '__env',
            function ($rootScope, $state, $scope, $filter, $timeout, mainService, fileUpload, commonDataSource, sweet, __env) {
                $scope.user = JSON.parse(localStorage.getItem('currentUser')).user;
                $scope.item=null;

                $scope.$on("formChanged35", function (event, args, data) {
                    $scope.item=JSON.parse(localStorage.getItem("adtItem"));
                    $timeout(function () {
                        $scope.initForm(data, args);
                    },100)
                });

                $scope.appId = 0;
                $scope.formId = 0;
                $scope.initForm = function (appId, formId) {
                    $scope.appId = appId;
                    $scope.formId = formId;
                    mainService.withdomain('get', __env.apiUrl() + '/api/adt/main/materiality/0/' + $scope.appId)
                        .then(function (data) {
                            $scope.materialityList = data;
                        }
                    );
                    mainService.withdomain('get', __env.apiUrl() + '/api/adt/main/item/materiality/0/' + $scope.appId)
                        .then(function (data) {
                            if (data.length > 0) {
                                $timeout(function (){
                                    $scope.materiality = data[0];
                                    $scope.materiality.level = data[0].levelStr;
                                },10);
                            } else {
                                $timeout(function () {
                                    angular.forEach($scope.materialityList, function (value, key) {
                                        if (value.id == 1) {
                                            $scope.materiality = {level: 1, accId: 1, percentage: 0.6};
                                        }
                                    });
                                }, 10);
                            }
                        }
                    );
                }

                $scope.form={};
                $scope.formSubmit35= function (){
                    var validator = $("#materiality").kendoValidator().data("kendoValidator");
                    if (validator.validate()) {
                        sweet.show(
                            {
                                title: "Анхаар",
                                text: "Материаллаг байдлын түвшин хадгалах уу?",
                                type: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#DD6B55",
                                confirmButtonText: "Тийм",
                                cancelButtonText: "Үгүй",
                                closeOnConfirm: true,
                                closeOnCancel: true,
                            },
                            function (inputvalue) {
                                if (inputvalue) {
                                    UIkit.modal("#modal_loader_35", {
                                        modal: false,
                                        keyboard: false,
                                        bgclose: false,
                                        center: true,
                                    }).show();
                                    $scope.materiality.noteId=0;
                                    $scope.materiality.planId=$scope.appId;
                                    angular.forEach($scope.materialityList, function(value, key) {
                                        if(value.id==$scope.materiality.accId){
                                            $scope.materiality.amount=value.amount*$scope.materiality.level*0.01*$scope.materiality.percentage;
                                        }
                                    });

                                    $scope.materiality.materialityList=$scope.materialityList;
                                    mainService.withdata('post', __env.apiUrl() + '/api/adt/main/materiality/submit',$scope.materiality)
                                        .then(function (data) {
                                            $rootScope.alert(true,"Амжилттай.");
                                            $timeout(function (){
                                                UIkit.modal("#modal_loader_35").hide();
                                            });
                                        }
                                    );
                                }
                            }
                        );
                    }
                }
            }
        ]
    );
