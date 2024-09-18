angular.module("altairApp")
    .controller("rateDetUserCtrl", [
        "$rootScope",
        "$state",
        "$stateParams",
        "$scope",
        "$timeout",
        "mainService",
        "commonDataSource",
        "sweet",
        "Upload",
        "__env",
        function ($rootScope, $state,$stateParams, $scope, $timeout, mainService, commonDataSource, sweet, Upload, __env) {
            $scope.user = JSON.parse(sessionStorage.getItem("currentUser")).user;
            $scope.menuData = JSON.parse(sessionStorage.getItem("menuData"));
            $("#header_main").attr("style", "filter: none !important;padding: 8px 25px");
            $scope.planYr = JSON.parse(sessionStorage.getItem("planYr"));
            // JSON.parse(sessionStorage.getItem("planYr"));
            $scope.editable = false;
            $scope.bags = [];
            $scope.workers = [];
            $scope.bagObj = {};
            $scope.detailShow=false;
            $scope.numericOptions = { spinners: false, format: "n1" };

            $scope.loadDetail = function (id,userId){
                mainService.withResponse("get", "/api/admin/v1/item/cab-plan-user-obj/"+ id+'/'+ userId).then(function (response) {
                    if(response.status===200){
                        $scope.details=response.data;
                        $scope.childDetails=response.data.filter(v=> v.parentId!=null && v.criteriaCnt>0);
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
            $scope.loadEvent = function (id,userId){
                mainService.withResponse("get", "/api/admin/v1/multiple/cab-plan-user-objective/"+id+"/"+userId).then(function (response) {
                    if(response.status===200){
                        $scope.objectives=response.data;
                        $scope.objectives2=response.data;
                    }
                });
            }
            $scope.loadReport = function (id,userId){
                mainService.withResponse("get", "/api/admin/v1/multiple/cab-plan-report/"+id+"/"+userId).then(function (response) {
                    if(response.status===200){
                        $scope.reports=response.data;
                    }
                });
            }
            $scope.loadScore = function (id,userId){
                mainService.withResponse("get", "/api/admin/v1/multiple/cab-plan-score/"+id+"/"+userId).then(function (response) {
                    if(response.status===200){
                        $scope.ranks=response.data;
                    }
                });
            }
            $scope.loadComplain = function (id,userId){
                mainService.withResponse("get", "/api/admin/v1/multiple/cab-plan-complain/"+id+"/"+userId).then(function (response) {
                    if(response.status===200){
                        $scope.complains=response.data;
                    }
                });
            }


            mainService.withdomain("get", __env.apiUrl() + "/api/admin/v1/multiple/user-plan/" + $stateParams.planYr+'/'+ $stateParams.userId).then(function (data) {
                if(data.length>0){
                    $scope.app=data[0];
                    $scope.detailShow=true;
                    $scope.loadDetail($scope.app.id,$scope.app.userId);
                    $scope.loadEvent($scope.app.id,$scope.app.userId);
                    $scope.loadReport($scope.app.id,$scope.app.userId);
                    $scope.loadScore($scope.app.id,$scope.app.userId);
                    $scope.loadComplain($scope.app.id,$scope.app.userId);

                    mainService.withdomain("get", "/api/nms/user/org/" + $scope.app.orgId).then(function (data) {
                        $scope.workers = data;
                    });
                }
                else{
                    $scope.detailShow=false;
                }
            });
            $scope.types=[{"comCd":"А","objType":"01","objTypeNm":"Гүйцэтгэлийн зорилт, арга хэмжээ"},{"comCd":"Б","objType":"02","objTypeNm":"Мэдлэг, ур чадвараа дээшлүүлэх зорилт, арга хэмжээ"},{"comCd":"В","objType":"03","objTypeNm":"Нэмэлт"}];

            $scope.sendPlan=function (){
                sweet.show(
                    {
                        title: "Санамж",
                        text: "Та ИЛГЭЭХ товчийг дарснаар төлөвлөгөөний мэдээллийг дахин засах боломжгүй болохыг анхаарна уу!!!",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Илгээх",
                        cancelButtonText: "Үгүй",
                        closeOnConfirm: true,
                        closeOnCancel: true,
                    },
                    function (inputvalue) {
                        if (inputvalue) {
                            var obj = {
                                planId: $scope.app.id,
                                userId: $scope.app.userId,
                                status: "sent",
                                name: "Төлөвлөгөөний мэдээлэл бүртгэж илгээсэн.",
                            };
                            mainService.withdata("post", __env.apiUrl() + "/api/cab/plan/user/change-status", obj).then(function (data) {
                                $rootScope.alert(true, "Амжилттай илгээлээ.");
                                $state.go("restricted.cabinet.worker-plan");
                            });
                        }
                    }
                );
            }
            $scope.changeStatus=function (){
                sweet.show(
                    {
                        title: "Санамж",
                        text: "Та БАТЛАХ товчийг дарснаар төлөвлөгөөний мэдээлэл албан хаагчид хуваарилагдана",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Илгээх",
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
                                name: "Төлөвлөгөө баталсан.",
                            };
                            mainService.withdata("post", __env.apiUrl() + "/api/cab/plan/user/change-status", obj).then(function (data) {
                                $rootScope.alert(true, "Амжилттай илгээлээ.");
                            });
                        }
                    }
                );
            }

            $scope.userDataSource = commonDataSource.urlDataSource("/api/nms/user/list", JSON.stringify({
                filter: {
                    logic: "and",
                    filters: [
                        { field: "orgId", operator: "eq", value: $scope.user.orgId},
                        { field: "useYn", operator: "eq", value: 1 },
                    ]
                },
                sort: [{ field: "id", dir: "asc" }] })
            );
            $scope.dataItem={};
            var modalForm = UIkit.modal("#modal_form", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true
            });
            $scope.addMeeting = function (item) {
                $scope.viewItem=item;
                $scope.dataItem = {useYn: 1,criteria:item.criteria,detId:item.detId, criteriaId:item.id,planId:item.planId,detNm:item.title,userId:$stateParams.userId, progress:0,planYr:$stateParams.planYr,eval:item.eval,apr:item.apr};
                $timeout(() => $rootScope.clearForm("userForm"));
                modalForm.show();
            }
            $scope.formSubmit = function () {
                var validator = $("#validator").kendoValidator().data("kendoValidator");
                if (validator.validate()) {
                    modalForm.hide();
                    var method = "post";
                    if($scope.dataItem.eval>100){
                        $scope.dataItem.eval=100;
                    }
                    if($scope.dataItem.apr>100){
                        $scope.dataItem.apr=100;
                    }
                    if ($scope.dataItem.id !== undefined && $scope.dataItem.id !== null) method = "put";
                    mainService.withResponse(method, "/api/cab/plan/user/score/submit", $scope.dataItem).then(function (response) {
                        if (response.status === 200) {
                            $scope.loadScore($scope.dataItem.planId,$scope.dataItem.userId);
                            $timeout(() => $rootScope.clearForm("userForm"));
                        } else {
                            $rootScope.alert(false, "Амжилтгүй!!!");
                        }
                    });
                }
            };
            var modalView = UIkit.modal("#modal_view", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true
            });
            $scope.viewMeeting = function (item) {
                $scope.viewItem=item;
                modalView.show();
            };
            $scope.delete = function (item) {
                sweet.show(
                    {
                        title: "Устгах",
                        text: "Та энэ үйлдлийг хийхдээ итгэлтэй байна уу?",
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
                            mainService.withdomain("delete", __env.apiUrl() + "/api/cab/plan/meeting/" + item.id).then(function (data) {
                                $rootScope.alert(true, "Амжилттай.");
                                $(".k-grid").data("kendoGrid").dataSource.read();
                            });
                        }
                    }
                );
            };



            var modalForm = UIkit.modal("#modal_form", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true
            });
            $scope.addMeeting = function (item) {
                $scope.viewItem=item;
                $scope.dataItem = {useYn: 1,criteria:item.criteria,detId:item.detId, criteriaId:item.id,planId:item.planId,detNm:item.title,userId:$stateParams.userId, progress:0,planYr:$stateParams.planYr,eval:item.eval,apr:item.apr};
                $timeout(() => $rootScope.clearForm("userForm"));
                modalForm.show();
            }
            $scope.formSubmit = function () {
                var validator = $("#validator").kendoValidator().data("kendoValidator");
                if (validator.validate()) {
                    modalForm.hide();
                    var method = "post";
                    if($scope.dataItem.eval>100){
                        $scope.dataItem.eval=100;
                    }
                    if($scope.dataItem.apr>100){
                        $scope.dataItem.apr=100;
                    }
                    if ($scope.dataItem.id !== undefined && $scope.dataItem.id !== null) method = "put";
                    mainService.withResponse(method, "/api/cab/plan/user/score/submit", $scope.dataItem).then(function (response) {
                        if (response.status === 200) {
                            $scope.loadScore($scope.dataItem.planId,$scope.dataItem.userId);
                            $timeout(() => $rootScope.clearForm("userForm"));
                        } else {
                            $rootScope.alert(false, "Амжилтгүй!!!");
                        }
                    });
                }
            };

            var modalComplainForm = UIkit.modal("#modal_complain_form", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true
            });
            $scope.addComplain = function (item) {
                $scope.viewItem=item;
                $scope.dataItem = {useYn: 1,criteria:item.criteria,detId:item.detId, criteriaId:item.id,planId:item.planId,detNm:item.title,userId:$stateParams.userId, progress:0,planYr:$stateParams.planYr,eval:item.eval,apr:item.apr,status:"sent"};
                $timeout(() => $rootScope.clearForm("userForm"));
                modalComplainForm.show();
            }
            $scope.formComplainSubmit = function () {
                var validator = $("#validatorComplainForm").kendoValidator().data("kendoValidator");
                if (validator.validate()) {
                    modalComplainForm.hide();
                    var method = "post";
                    if ($scope.dataItem.id !== undefined && $scope.dataItem.id !== null) method = "put";
                    mainService.withResponse(method, "/api/cab/plan/user/complain/submit", $scope.dataItem).then(function (response) {
                        if (response.status === 200) {
                            $scope.loadComplain($scope.dataItem.planId,$scope.dataItem.userId);
                            $timeout(() => $rootScope.clearForm("userForm"));
                        } else {
                            $rootScope.alert(false, "Амжилтгүй!!!");
                        }
                    });
                }
            };

            var modalComplainView = UIkit.modal("#modal_complain_view", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true
            });
            $scope.viewComplain = function (item) {
                $scope.viewItem=item;
                modalComplainView.show();
            };

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
