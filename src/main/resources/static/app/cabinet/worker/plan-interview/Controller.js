angular.module("altairApp")
    .controller("interviewWorkerUserCtrl", [
        "$rootScope",
        "$state",
        "$scope",
        "$timeout",
        "mainService",
        "commonDataSource",
        "sweet",
        "$http",
        "__env",
        function ($rootScope, $state, $scope, $timeout, mainService, commonDataSource, sweet, $http, __env) {
            $scope.user = JSON.parse(sessionStorage.getItem("currentUser")).user;
            $scope.menuData = JSON.parse(sessionStorage.getItem("menuData"));
            $("#header_main").attr("style", "filter: none !important;padding: 8px 25px");
            $scope.planYr = JSON.parse(sessionStorage.getItem("planYr"));

            $scope.editable = false;
            $scope.bags = [];
            $scope.workers = [];
            $scope.bagObj = {};
            $scope.detailShow=false;

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

            $scope.loadMeeting = function (id,userId){
                mainService.withResponse("get", "/api/admin/v1/multiple/cab-plan-meeting/"+id+"/"+userId).then(function (response) {
                    if(response.status===200){
                        $scope.meetings=response.data;
                    }
                });
            }

            mainService.withdomain("get", __env.apiUrl() + "/api/admin/v1/multiple/user-plan/" + $scope.planYr+'/'+ $scope.user.id).then(function (data) {
                if(data.length>0){
                    $scope.app=data[0];
                    $scope.detailShow=true;
                    $scope.loadDetail($scope.app.id,$scope.app.userId);
                    $scope.loadEvent($scope.app.id,$scope.app.userId);
                    $scope.loadMeeting($scope.app.id,$scope.app.userId);

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
                $scope.dataItem = {useYn: 1, detId:item.id,planId:item.planId,detNm:item.title,userId:$scope.user.id, progress:0,typeStr:'01',status:'sent'};
                $timeout(() => $rootScope.clearForm("userForm"));
                modalForm.show();
            }
            $scope.formSubmit = function () {
                var validator = $("#validator").kendoValidator().data("kendoValidator");
                if (validator.validate()) {
                    modalForm.hide();
                    var method = "post";
                    if($scope.dataItem.progress>100){
                        $scope.dataItem.progress=100;
                    }
                    if ($scope.dataItem.id !== undefined && $scope.dataItem.id !== null) method = "put";
                    mainService.withResponse(method, "/api/cab/plan/meeting/submit", $scope.dataItem).then(function (response) {
                        if (response.status === 200) {
                            $scope.loadMeeting($scope.dataItem.planId,$scope.dataItem.userId);
                            $(".k-grid").data("kendoGrid").dataSource.read();
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
