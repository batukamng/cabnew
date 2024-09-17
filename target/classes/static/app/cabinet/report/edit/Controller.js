angular.module("altairApp")
    .controller("planViewCtrl", [
        "$rootScope",
        "$state",
        "$scope",
        "$timeout",
        "mainService",
        "commonDataSource",
        "sweet",
        "item",
        "__env",
        function ($rootScope, $state, $scope, $timeout, mainService, commonDataSource, sweet, item, __env) {
            $scope.user = JSON.parse(localStorage.getItem("currentUser")).user;
            $("#header_main").attr("style", "filter: none !important;padding: 8px 25px");
            $scope.menuData = JSON.parse(localStorage.getItem("menuData"));
            $scope.app = item;
            $scope.selectedTab = 'tab1';

            /*$("#baseline").kendoNumericTextBox({
                format: "c0"
            });*/

            $(document).ready(function () {
                $("#baseline").kendoNumericTextBox({
                    value: 2,
                    format: "c0"
                });
            });




            $scope.dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: __env.apiUrl() + "/api/admin/v1/cab-plan-user-obj/list",
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
                        data: {
                            sort: [{field: "objTypeNm", dir: "asc"}],
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
                            field: "planId",
                            operator: "eq",
                            value: $scope.app.id,
                        },
                        {
                            field: "userId",
                            operator: "eq",
                            value: $scope.app.userId,
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
                        // redefine the string operators
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
                        field: "rowNum", title: '№',
                        headerAttributes: { "class": "checkbox-align"},
                        width:51,
                        attributes: { "class": "text-center"},
                        filterable: {cell: {operator: "contains", showOperators: false}},
                    },
                    {
                        field: "title",
                        filterable: {
                            cell: {
                                operator: "contains",
                                suggestionOperator: "contains",
                                showOperators: false
                            }
                        },
                        title: "Зорилтыг хэрэгжүүлэх арга хэмжээ",
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
                        title: "Төрөл",
                        width:750
                    },

                ],
                dataBinding: function () {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                },
                dataBound: function() {
                    this.expandRow(this.tbody.find("tr.k-master-row").first());
                },
                editable: "inline",
                scrollable: true,
                height: function () {
                    if ($scope.menuData.pageType === 0) {
                        return $(window).height() - 205;
                    }
                    return $(window).height() - 155;
                }
            };


            $scope.userDataSource = commonDataSource.urlPageDataSource(__env.apiUrl() + "/api/nms/user/list", JSON.stringify({
                sort: [{field: "id", dir: "asc"}],
            }), 60);

            $scope.bags = [];
            $scope.workers = [];
            $scope.bagObj = {};
            mainService.withdomain("get", "/api/nms/user/org/" + $scope.app.orgId).then(function (data) {
                $scope.workers = data;
            });

            $scope.detailGridTab1 = function (dataItem) {
                return {
                    dataSource: {
                        transport: {
                            read: {
                                url: __env.apiUrl() + "/api/cab/plan/detail/list",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                data: {sort: [{field: "rowNum", dir: "asc"}]},
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                }
                            },
                            destroy: {
                                url: __env.apiUrl() + "/api/cab/plan/criteria",
                                contentType: "application/json; charset=UTF-8",
                                type: "DELETE",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                },
                                complete:function (){
                                    $("#tab1DetGrid").data("kendoGrid").dataSource.read();
                                }
                            },
                            parameterMap: function (options) {
                                return JSON.stringify(options);
                            }
                        },
                        schema: {
                            data: "data",
                            total: "total",
                            model: {
                                id: "id",
                                fields: {
                                    id: {type: "number"},
                                    code: {type: "string", validation: {required: true}},
                                    name: {type: "string", validation: {required: true}},
                                    objId: {type: "number", defaultValue: dataItem.id},
                                    useYn: {type: "number", defaultValue: 1}
                                }
                            }
                        },
                        pageSize: 200,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true,
                        filter: {logic:"and", filters:[{field: "objId", operator: "eq", value: dataItem.id}, {field: "userId", operator: "eq", value: $scope.app.userId}]}
                    },
                    scrollable: false,
                    sortable: true,
                    pageable: false,
                    noRecords: {
                        template: function(e){
                            return "<span class='uk-text-danger' style='display: inline-block;padding: 15px 0;width:100%;;text-align: center;'>Арга хэмжээ бүртгээгүй байна !!!</span> ";
                        }
                    },
                    editable: "inline",
                    columns: [
                        {
                            field: "rowNum", title: ' ',
                            headerAttributes: { "class": "checkbox-align"},
                            width:50,
                            attributes: { "class": "text-center"},
                            filterable: {cell: {operator: "contains", showOperators: false}},
                        },
                        {
                            field: "title", title: 'Арга хэмжээ',
                            headerAttributes: { "class": "checkbox-align"},
                            filterable: {cell: {operator: "contains", showOperators: false}},
                        },
                        {
                            field: "criteria", title: 'Шалгуур үзүүлэлт',
                            headerAttributes: { "class": "checkbox-align"},
                            filterable: {cell: {operator: "contains", showOperators: false}},
                        },
                        {
                            field: "baseline", title: 'Суурь үзүүлэлт',
                            template:"<span ng-bind='dataItem.baseline | number:0'></span>",
                            attributes: { "class": "text-center"},
                            headerAttributes: { "class": "checkbox-align"},
                            filterable: {cell: {operator: "contains", showOperators: false}},
                            width: 150
                        },
                        {
                            field: "firstHalf", title: 'Эхний хагас',
                            template:"<span ng-bind='dataItem.firstHalf | number:0'></span>",
                            attributes: { "class": "text-center"},
                            headerAttributes: { "class": "checkbox-align"},
                            filterable: {cell: {operator: "contains", showOperators: false}},
                            width: 150
                        },
                        {
                            field: "secondHalf", title: 'Сүүлийн хагас',
                            template:"<span ng-bind='dataItem.secondHalf | number:0'></span>",
                            attributes: { "class": "text-center"},
                            headerAttributes: { "class": "checkbox-align"},
                            filterable: {cell: {operator: "contains", showOperators: false}},
                            width: 150
                        },
                        {
                            field: "srtDt", title: 'Эхлэх хугацаа',
                            headerAttributes: { "class": "checkbox-align"},
                            attributes: {style: "text-align: center;"},
                            filterable: {cell: {operator: "contains", showOperators: false}},
                            width: 150
                        },
                        {
                            field: "endDt", title: 'Дуусах хугацаа',
                            headerAttributes: { "class": "checkbox-align"},
                            attributes: {style: "text-align: center;"},
                            filterable: {cell: {operator: "contains", showOperators: false}},
                            width: 150
                        }
                    ],
                    dataBinding: function () {
                        record2 = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                    },
                };
            };


            $scope.changeStatus=function (){
                sweet.show(
                    {
                        title: "Санамж",
                        text: "Та БАТЛАХ товчийг дарснаар төлөвлөгөөний мэдээлэл албан хаагчид хуваарилагдана",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Батлах",
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
                                $state.go("restricted.cabinet.plan-user");
                            });
                        }
                    }
                );
            };

            $scope.rejectContract = function () {
                $scope.rejectItem={
                    planId: $scope.app.id,
                    userId: $scope.app.userId,
                    status: "rejected",
                    name: "Цуцалсан",
                };
                UIkit.modal("#modal_reject", {
                    modal: false,
                    keyboard: false,
                    bgclose: false,
                    center: true,
                }).show();
            };
            $scope.rejectSubmit = function (item) {
              /*  UIkit.modal("#modal_loader", {
                    modal: false,
                    keyboard: false,
                    bgclose: false,
                    center: true,
                }).show();*/

                var validatorLocation = $("#rejectForm").kendoValidator().data("kendoValidator");
                if (validatorLocation.validate()) {
                    UIkit.modal("#modal_reject").hide();
                    mainService.withdata("post", __env.apiUrl() + "/api/cab/plan/user/change-status", $scope.rejectItem).then(function (data) {
                        $rootScope.alert(true, "Амжилттай.");
                        $timeout(function (){
                            $state.go("restricted.cabinet.plan-user");
                        },400)
                    });
                }
            };
        },
    ]);
