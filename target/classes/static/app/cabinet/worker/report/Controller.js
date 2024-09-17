angular.module("altairApp")
    .controller("reportWorkerCtrl", [
        "$rootScope",
        "$state",
        "$scope",
        "$timeout",
        "mainService",
        "commonDataSource",
        "sweet",
        "Upload",
        "__env",
        function ($rootScope, $state, $scope, $timeout, mainService, commonDataSource, sweet, Upload, __env) {
            $scope.user = JSON.parse(localStorage.getItem("currentUser")).user;
            $scope.menuData = JSON.parse(localStorage.getItem("menuData"));
            $("#header_main").attr("style", "filter: none !important;padding: 8px 25px");
            $scope.planYr = JSON.parse(localStorage.getItem("planYr"));
            $scope.editable = false;
            $scope.bags = [];
            $scope.workers = [];
            $scope.bagObj = {};
            $scope.detailShow=false;
            $scope.numericOptions = { spinners: false, format: "n1" };

            $scope.level=function (item){
                const d = new Date(item.endDt);
                let month = d.getMonth();
                if(month<6){
                    return item.firstHalf;
                }
                else{
                    return item.secondHalf;
                }
            }

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

            mainService.withdomain("get", __env.apiUrl() + "/api/admin/v1/multiple/user-plan/" + $scope.planYr+'/'+ $scope.user.id).then(function (data) {
                if(data.length>0){
                    $scope.app=data[0];
                    $scope.detailShow=true;
                    $scope.loadDetail($scope.app.id,$scope.app.userId);
                    $scope.loadEvent($scope.app.id,$scope.app.userId);
                    $scope.loadReport($scope.app.id,$scope.app.userId);

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
                sort: [{ field: "id", dir: "asc" }] }));
            $scope.dataItem={};
            var modalForm = UIkit.modal("#modal_form", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true
            });
            $scope.addMeeting = function (item) {
                console.log(item);
                $scope.viewItem=item;
                $scope.dataItem = {useYn: 1,criteria:item.criteria,detId:item.detId, criteriaId:item.id,planId:item.planId,detNm:item.title,userId:$scope.user.id, progress:0,typeStr:'01',status:'sent'};
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

                    $scope.dataItem.percentage=$scope.dataItem.progress*100/$scope.viewItem.firstHalf;

                    if ($scope.dataItem.id !== undefined && $scope.dataItem.id !== null) method = "put";
                    mainService.withResponse(method, "/api/cab/plan/user/report/submit", $scope.dataItem).then(function (response) {
                        if (response.status === 200) {
                            $scope.loadReport($scope.dataItem.planId,$scope.dataItem.userId);
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

         /*   $scope.filterObjective=function (tp){
                $scope.dataItem.typeStr=tp;
                $scope.dataItem.objId=null;
                $scope.dataItem.criteriaObj=null;
                $scope.purposeDatasource.filter({
                    logic: "and",
                    sort: [{field: "id", dir: "asc"}],
                    filters: [ {field: "useYn", operator: "eq", value: 1},
                        {
                            field: "userId",
                            operator: "eq",
                            value: $scope.user.id
                        },
                        {
                            field: "objType",
                            operator: "eq",
                            value: $scope.dataItem.typeStr
                        },
                        {
                            field: "planId",
                            operator: "eq",
                            value: $scope.dataItem.planId
                        },
                        {
                            field: "criteriaCnt",
                            operator: "gte",
                            value: 1
                        }
                    ],
                });
            }

            mainService.withdomain("get", "/api/admin/v1/list/cab-plan-year-user/" + $scope.user.id).then(function (data) {
                $scope.planYrDataSource = data;
            });

            $scope.planDatasource = commonDataSource.urlDataSource("/api/admin/v1/cab-plan-user/list",
                JSON.stringify({
                    filter: {
                        logic: "and",
                        filters: [
                            {field: "useYn", operator: "eq", value: 1},
                            {
                                field: "orgId",
                                operator: "eq",
                                value: $scope.user.orgId
                            },
                            {
                                field: "userStatusNm",
                                operator: "eq",
                                value:'Баталсан'
                            }],
                    }, sort: [{field: "id", dir: "asc"}]
                })
            );

            $scope.purposeDatasource = commonDataSource.urlDataSource("/api/admin/v1/cab-plan-user-obj/list",
                JSON.stringify({
                    filter: {
                        logic: "and",
                        filters: [
                            {field: "useYn", operator: "eq", value: 1},
                            {
                                field: "userId",
                                operator: "eq",
                                value: $scope.user.id
                            },
                            {
                                field: "objType",
                                operator: "eq",
                                value: $scope.dataItem.typeStr
                            },
                            {
                                field: "criteriaCnt",
                                operator: "gte",
                                value: 1
                            },

                        ],
                    }, sort: [{field: "id", dir: "asc"}]
                })
            );

            $scope.objDatasource = commonDataSource.urlDataSource("/api/admin/v1/cab-plan-detail-obj/list",
                JSON.stringify({
                    filter: {
                        logic: "and",
                        filters: [
                            {field: "useYn", operator: "eq", value: 1}],
                    }, sort: [{field: "id", dir: "asc"}]
                })
            );
            $scope.criteriaDatasource = commonDataSource.urlDataSource("/api/admin/v1/cab-plan-user-criteria/list",
                JSON.stringify({
                    filter: {
                        logic: "and",
                        filters: [
                            {field: "useYn", operator: "eq", value: 1}],
                    }, sort: [{field: "id", dir: "asc"}]
                })
            );

            $scope.dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: __env.apiUrl() + "/api/cab/plan/user/report/list",
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
                        data: {
                            sort: [{field: "planYr", dir: "desc"},{field: "id", dir: "desc"}],
                        },
                        beforeSend: function (req) {
                            req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
                        },
                    },
                    parameterMap: function (options) {
                        return JSON.stringify(options);
                    },
                },
                schema: {
                    data: "data",
                    total: "total",
                    model: {
                        id: "id",
                        fields: {
                            id: {type: "number", nullable: true},
                            useYn: {type: "number", defaultValue: 1}
                        },
                    },
                },
                filter: {
                    logic: "and",
                    filters: [
                        {
                            field: "useYn",
                            operator: "eq",
                            value: 1,
                        },
                        {
                            field: "userId",
                            operator: "eq",
                            value: $scope.user.id
                        }
                    ],
                },
                pageSize: 20,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
            });
            $scope.mainGrid = {
                filterable: {
                    mode: "row",
                    extra: false,
                    operators: {
                        string: {
                            contains: "Агуулсан",
                            startswith: "Эхлэх утга",
                            eq: "Тэнцүү",
                            gte: "Их",
                            lte: "Бага",
                        },
                    },
                },
                sortable: true,
                resizable: true,
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5,
                },
                columns: [
                    {
                        title: "#",
                        headerAttributes: {class: "checkbox-align"},
                        attributes: {style: "text-align: center;"},
                        template: "#= ++record #",
                        width: 50,
                    },
                    {
                        field: "userNm",
                        filterable: {
                            cell: {
                                operator: "contains",
                                suggestionOperator: "contains",
                                showOperators: false
                            }
                        },
                        title: "Албан хаагч",
                        width:150
                    },
                    {
                        field: "planNm",
                        filterable: {
                            cell: {
                                operator: "contains",
                                suggestionOperator: "contains",
                                showOperators: false
                            }
                        },
                        title: "Төлөвлөгөө",
                        headerAttributes: { "class": "checkbox-align"},
                        attributes: {style: "text-align: center;"},
                        width:250
                    },
                    {
                        field: "planYr",
                        filterable: {
                            cell: {
                                operator: "contains",
                                suggestionOperator: "contains",
                                showOperators: false
                            }
                        },
                        title: "Огноо",
                        headerAttributes: {"class": "checkbox-align"},
                        attributes: {style: "text-align: center;"},
                        width: 80
                    },
                    {
                        field: "statusNm",
                        filterable: {
                            cell: {
                                operator: "contains",
                                suggestionOperator: "contains",
                                showOperators: false
                            }
                        },
                        title: "Төлөв",
                        headerAttributes: { "class": "checkbox-align"},
                        attributes: {style: "text-align: center;"},
                        template: "<span ng-if='dataItem.statusNm==\"Баталсан\"' ng-click='' class='cursor-pointer bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300' ng-bind='dataItem.statusNm'></span><span ng-if='dataItem.statusNm==\"Илгээсэн\"' ng-cloak='' class='cursor-pointer bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300' ng-bind='dataItem.statusNm'></span></div><span ng-if='dataItem.statusNm==\"Хадгалсан\"' ng-cloak='' class='cursor-pointer bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300' ng-bind='dataItem.statusNm'></span></div>",
                        width:90
                    },
                    {
                        field: "objTypeNm",
                        filterable: {
                            cell: {
                                operator: "contains",
                                suggestionOperator: "contains",
                                showOperators: false
                            }
                        },
                        headerAttributes: { "class": "checkbox-align"},
                        attributes: {style: "text-align: center;"},
                        title: "Төрөл",
                        width:150
                    },
                    {
                        field: "objNm",
                        filterable: {
                            cell: {
                                operator: "contains",
                                suggestionOperator: "contains",
                                showOperators: false
                            }
                        },
                        headerAttributes: { "class": "checkbox-align"},
                        attributes: {style: "text-align: left;"},
                        title: "Зорилт",
                        width:250
                    },
                    {
                        field: "detNm",
                        filterable: {
                            cell: {
                                operator: "contains",
                                suggestionOperator: "contains",
                                showOperators: false
                            }
                        },
                        headerAttributes: { "class": "checkbox-align"},
                        attributes: {style: "text-align: left;"},
                        title: "Арга хэмжээ",
                        width:250
                    },
                    {
                        field: "crtNm",
                        filterable: {
                            cell: {
                                operator: "contains",
                                suggestionOperator: "contains",
                                showOperators: false
                            }
                        },
                        headerAttributes: { "class": "checkbox-align"},
                        attributes: {style: "text-align: left;"},
                        title: "Шалгуур үзүүлэлт",
                        width:150
                    },
                    {
                        field: "fullStr",
                        filterable: {
                            cell: {
                                operator: "contains",
                                suggestionOperator: "contains",
                                showOperators: false
                            }
                        },
                        headerAttributes: { "class": "checkbox-align"},
                        attributes: {style: "text-align: left;"},
                        title: "Хийсэн ажил"
                    },
                ],
                dataBinding: function () {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                },
                editable: "inline",
                scrollable: true,
                height: function () {
                    if ($scope.menuData.pageType === 0) {
                        return $(window).height() - 160;
                    }
                    return $(window).height() - 110;
                }
            };

            if (localStorage.getItem("buttonData").includes("read")) {
                $scope.mainGrid.toolbar = ["excel", "search"];
            }
            if (localStorage.getItem("buttonData").includes("create")) {
                $scope.mainGrid.toolbar = [{template: "<button class='md-btn custom-btn' ng-click='add()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>"}];
            }
            if (localStorage.getItem("buttonData").includes("update") || localStorage.getItem("buttonData").includes("edit")) {
                $scope.mainGrid.columns.push({
                    command: [
                        {
                            template:
                                '<div class="flex justify-center gap-2">' +
                                '<button class="grid-btn" ng-click=\'gotoDetail(dataItem)\'><div class="nimis-icon see "></div>Харах</button>' +
                                '<button class="grid-btn" ng-click=\'update(dataItem)\'><div class="nimis-icon edit "></div></button>' +
                                '<button class="grid-btn" ng-click=\'delete(dataItem)\'><div class="nimis-icon delete "></div></button>' +
                                '</div>',
                        },
                    ],
                    title: "&nbsp;",
                    headerAttributes: {class: "rightMinus"},
                    attributes: {class: "rightMinus uk-text-center"},
                    sticky: true,
                    width: 150,
                });
            }

            $scope.planDataSource = commonDataSource.urlDataSource("/api/admin/v1/cab-plan-user/list", JSON.stringify( {filter:{
                logic: "and",
                filters: [
                    {
                        field: "useYn",
                        operator: "eq",
                        value: 1,
                    },
                    {
                        field: "userId",
                        operator: "eq",
                        value: $scope.user.id
                    },
                    {
                        field: "userStatusNm",
                        operator: "eq",
                        value: 'Баталсан'
                    }
                ],
            }}));*/


           /* var modalView = UIkit.modal("#modal_view", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true
            });
            $scope.gotoDetail = function (item) {
                $scope.dataItem=item;
                modalView.show();
            }

            var modalForm = UIkit.modal("#modal_form", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true
            });
            $scope.add = function () {
                $scope.dataItem = {useYn: 1,orgId:$scope.user.orgId,userId:$scope.user.id, status: "draft","typeStr":"01"};
                $timeout(() => $rootScope.clearForm("validator"));
                mainService.withdomain("get", __env.apiUrl() + "/api/admin/v1/multiple/user-plan/" + $scope.planYr+'/'+ + $scope.user.id).then(function (data) {
                   if(data.length>0){
                       $scope.dataItem.planId=data[0].id;
                       $scope.dataItem.planObj=data[0];
                       modalForm.show();
                   }
                   else{
                       $rootScope.alert(false,$scope.planYr+" оны төлөвлөгөө батлагдаагүй байна.");
                   }
                });
            }
            $scope.update = function (item) {
                if (item.statusNm === "Хадгалсан") {
                    $scope.dataItem=item;
                    modalForm.show();
                } else {
                    sweet.show({
                        title: "Анхаар",
                        text: "Засварлах боломжгүй",
                        type: "error",
                    });
                }
            };
            $scope.delete = function (item) {
                if (item.statusNm === "Хадгалсан") {
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
                                mainService.withdomain("delete", __env.apiUrl() + "/api/cab/plan/user/report/" + item.id).then(function (data) {
                                    $rootScope.alert(true, "Амжилттай.");
                                    $(".k-grid").data("kendoGrid").dataSource.read();
                                });
                            }
                        }
                    );
                } else {
                    sweet.show({
                        title: "Анхаар",
                        text: "Устгах боломжгүй",
                        type: "error",
                    });
                }
            };

            $scope.planChange=function (){
                $timeout(function (){
                    $scope.dataItem.planYr=$scope.dataItem.plan.planYr;
                },100);
            }
            var loader = UIkit.modal("#modal_loader", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true,
            });
            $scope.formSubmit = function (tp) {
                var validator = $("#validator").kendoValidator().data("kendoValidator");
                if (validator.validate()) {
                    modalForm.hide();
                    loader.show();
                    var method = "post";
                    if(tp===1){
                        $scope.dataItem.status="draft";
                    }
                    else{
                        $scope.dataItem.status="sent";
                    }
                    if($scope.dataItem.criteriaObj !== undefined && $scope.dataItem.criteriaObj !== null){
                        $scope.dataItem.percentage=$scope.dataItem.progress*100/$scope.dataItem.criteriaObj.secondHalf;
                    }

                    if ($scope.dataItem.id !== undefined && $scope.dataItem.id !== null) method = "put";
                    mainService.withResponse("post", "/api/cab/plan/user/report/submit", $scope.dataItem).then(function (response) {
                        loader.hide();
                        $(".k-grid").data("kendoGrid").dataSource.read();
                        $timeout(() => $rootScope.clearForm("validator"));
                    });
                }
            };

            $scope.changeStatus=function (){
                modalView.hide();
                sweet.show(
                    {
                        title: "Санамж",
                        text: "Та ИЛГЭЭХ товчийг дарснаар тайлан засварлах боломжгүй болно",
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
                                id: $scope.dataItem.id,
                                userId: $scope.dataItem.userId,
                                status: "sent",
                                name: "Тайлан илгээсэн.",
                            };
                            mainService.withdata("post", __env.apiUrl() + "/api/cab/plan/user/report/change-status", obj).then(function (data) {
                                $rootScope.alert(true, "Амжилттай илгээлээ.");
                                $(".k-grid").data("kendoGrid").dataSource.read();
                            });
                        }
                    }
                );
            };*/
        },
    ]);
