angular.module("altairApp")
    .controller("planViewCtrl", [
        "$rootScope",
        "$state",
        "$stateParams",
        "$scope",
        "$timeout",
        "mainService",
        "commonDataSource",
        "sweet",
        "item",
        "__env",
        function ($rootScope, $state,$stateParams, $scope, $timeout, mainService, commonDataSource, sweet, item, __env) {
            $scope.user = JSON.parse(sessionStorage.getItem("currentUser")).user;
            $("#header_main").attr("style", "filter: none !important;padding: 8px 25px");
            $scope.menuData = JSON.parse(sessionStorage.getItem("menuData"));
            $scope.app = item;
            $scope.editable = false;
            $scope.types=[{"comCd":"А","objType":"01","objTypeNm":"Гүйцэтгэлийн зорилт, арга хэмжээ"},{"comCd":"Б","objType":"02","objTypeNm":"Мэдлэг, ур чадвараа дээшлүүлэх зорилт, арга хэмжээ"},{"comCd":"В","objType":"03","objTypeNm":"Нэмэлт"}];
            /*$scope.loadDetail = function (){
                mainService.withResponse("get", "/api/admin/v1/item/cab-plan-user-obj/"+ $stateParams.id+'/'+ $stateParams.userId).then(function (response) {
                    if(response.status===200){
                        $scope.details=response.data;
                        $scope.childDetails=response.data.filter(v=> v.parentId!=null);
                    }
                });
                mainService.withResponse("get", "/api/admin/v1/item/cab-plan-user-criteria/"+ $stateParams.id+'/'+ $stateParams.userId).then(function (response) {
                    if(response.status===200){
                        $scope.criterias=response.data;
                    }
                });
                mainService.withResponse("get", "/api/admin/v1/multiple/cab-plan-user-objective/"+$scope.app.id+"/"+$stateParams.userId).then(function (response) {
                    if(response.status===200){
                        $scope.objectives=response.data;
                    }
                });
                mainService.withResponse("get", "/api/admin/v1/list/cab-plan-obj/"+$stateParams.id).then(function (response) {
                    if(response.status===200){
                        $scope.groups=response.data;
                    }
                });
            }*/

            $scope.loadDetail = function (id,userId){
                mainService.withResponse("get", "/api/admin/v1/item/cab-plan-user-obj/"+ id+'/'+ userId).then(function (response) {
                    if(response.status===200){
                        $scope.details=response.data;
                        $scope.childDetails=response.data.filter(v=> v.parentId!=null);
                    }
                });
                mainService.withResponse("get", "/api/admin/v1/item/cab-plan-user-criteria/"+ id+'/'+ userId).then(function (response) {
                    if(response.status===200){
                        $scope.criterias=response.data;
                    }
                });

                mainService.withResponse("get", "/api/admin/v1/list/cab-plan-obj/"+id).then(function (response) {
                    if(response.status===200){
                        $scope.groups=response.data;
                    }
                });
            }

            $scope.loadDetail($scope.app.id,$stateParams.userId);

            $scope.changeStatus=function (i){
                if(i===0){
                    sweet.show(
                        {
                            title: "Санамж",
                            text: "Та БУЦААХ товчийг дарснаар төлөвлөгөөний мэдээлэл засварлах боломжтой болно",
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
                                var obj = {
                                    planId: $scope.app.id,
                                    userId: $scope.app.userId,
                                    status: "rejected",
                                    name: "Төлөвлөгөөн баталсан.",
                                };
                                mainService.withdata("post", __env.apiUrl() + "/api/cab/plan/user/change-status", obj).then(function (data) {
                                    $rootScope.alert(true, "Амжилттай илгээлээ.");
                                    $state.go("restricted.cabinet.plan-user");
                                });
                            }
                        }
                    );
                }
                else{
                    sweet.show(
                        {
                            title: "Санамж",
                            text: "Та БАТЛАХ товчийг дарснаар төлөвлөгөө баталгаажна",
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
                                var obj = {
                                    planId: $scope.app.id,
                                    userId: $scope.app.userId,
                                    status: "approved",
                                    name: "Төлөвлөгөөн баталсан.",
                                };
                                mainService.withdata("post", __env.apiUrl() + "/api/cab/plan/user/change-status", obj).then(function (data) {
                                    $rootScope.alert(true, "Амжилттай илгээлээ.");
                                    $state.go("restricted.cabinet.plan-user");
                                });
                            }
                        }
                    );
                }
            }

            $scope.$watch("childDetails", () => {
                $scope.$evalAsync(function() {
                    $.each($(".des-dugaar"), (i, v) => {
                        $(v).html(i + 1);
                    });
                });
            });
            $scope.$watch("objectives2", () => {
                $scope.$evalAsync(function() {
                    $.each($(".des-dugaar2"), (i, v) => {
                        $(v).html(i + 1);
                    });
                });
            });
            $scope.$watch("objectives", () => {
                $scope.$evalAsync(function() {
                    $.each($(".des-dugaar3"), (i, v) => {
                        $(v).html(i + 1);
                    });
                });
            });
        },
    ]);
