angular.module("altairApp")
    .controller("reportRateViewCtrl", [
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
                        url: __env.apiUrl() + "/api/admin/v1/cab-plan-user-rate/list",
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
                    },
                    {
                        field: "firstHalf", title: 'Хүрэх түвшин',
                        template:"<span ng-bind='dataItem.firstHalf | number:0'></span>%",
                        attributes: { "class": "text-center"},
                        headerAttributes: { "class": "checkbox-align"},
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        width: 150
                    },
                    {
                        field: "secondHalf", title: 'Хүрсэн түвшин',
                        template:"<span ng-bind='dataItem.secondHalf | number:0'></span>%",
                        attributes: { "class": "text-center"},
                        headerAttributes: { "class": "checkbox-align"},
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        width: 150
                    },
                    {
                        field: "srtDt", title: 'Эхэлсэн хугацаа',
                        headerAttributes: { "class": "checkbox-align"},
                        attributes: {style: "text-align: center;"},
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        width: 150
                    },
                    {
                        field: "endDt", title: 'Дууссан хугацаа',
                        headerAttributes: { "class": "checkbox-align"},
                        attributes: {style: "text-align: center;"},
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        width: 150
                    },
                    {
                        field: "updatedAt",
                        filterable: {
                            cell: {
                                operator: "contains",
                                suggestionOperator: "contains",
                                showOperators: false
                            }
                        },
                        title: "Огноо",
                    },
                    {
                        field: "fulfillment", title: 'Биелэлт %',
                        template:"<span ng-bind='dataItem.fulfillment | number:0'></span><span ng-if='dataItem.fulfillment>0'>%</span>",
                        headerAttributes: { "class": "checkbox-align"},
                        attributes: {style: "text-align: center;"},
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        width: 150
                    },
                    // {
                    //     field: "",
                    //     filterable: {
                    //         cell: {
                    //             operator: "contains",
                    //             suggestionOperator: "contains",
                    //             showOperators: false
                    //         }
                    //     },
                    //     title: "Арга хэмжээний гүйцэтгэл",
                    // },
                    // {
                    //     field: "",
                    //     filterable: {
                    //         cell: {
                    //             operator: "contains",
                    //             suggestionOperator: "contains",
                    //             showOperators: false
                    //         }
                    //     },
                    //     title: "Төлөвлөсөн хугацаанд гүйцэтгэсэн",
                    // },
                    // {
                    //     field: "",
                    //     filterable: {
                    //         cell: {
                    //             operator: "contains",
                    //             suggestionOperator: "contains",
                    //             showOperators: false
                    //         }
                    //     },
                    //     title: "Нийлбэр оноо",
                    // },
                    // {
                    //     field: "",
                    //     filterable: {
                    //         cell: {
                    //             operator: "contains",
                    //             suggestionOperator: "contains",
                    //             showOperators: false
                    //         }
                    //     },
                    //     title: "Үнэлгээний багийн хянан баталгаажуулж, дахин үнэлсэн оноо",
                    // },
                    // {
                    //     command: [
                    //         {
                    //             template:
                    //             //'<div ng-show="dataItem.eventType==\'02\'" class="flex justify-center gap-3"><button class="grid-btn k-grid-edit" ng-click=\'updateCriteria(dataItem)\'><div class="nimis-icon edit"></div></button><button class="grid-btn k-grid-remove-command"><div class="nimis-icon delete"></div></button></div>',
                    //                 '<div class="flex justify-center gap-3"><button class="grid-btn k-grid-edit" ng-click=\'updateCriteria(dataItem)\'><div class="nimis-icon edit">',
                    //         },
                    //     ],
                    //     //hidden:!$scope.editable,
                    //     title: "&nbsp;",
                    //     width: 80
                    // }
                ],
                dataBinding: function () {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                },
                dataBound: function() {
                    this.expandRow(this.tbody.find("tr.k-master-row").first());
                },
                editable: "popup",
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

            /*$(document).ready(function () {
                $("#appData").on("dblclick", "tbody>tr", function (e) {
                    $("#appData").data('kendoGrid').editRow(this);
                    console.log(e);
                    }
                );
            });*/

            /*if ($scope.editable && (localStorage.getItem("buttonData").includes("update") || localStorage.getItem("buttonData").includes("edit"))) {
                $scope.mainGrid.columns.push({
                    command: [
                        {
                            template:
                                '<div class="flex justify-center gap-3"><button class="grid-btn k-grid-edit" ng-click=\'addDetail(dataItem)\'><div class="nimis-icon add"></div></button></div>',
                        },
                    ],
                    title: "&nbsp;",
                    width: 81,
                });
            }*/

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

            var modalCriteria = UIkit.modal("#modal_form_criteria", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true
            });

            $scope.updateCriteria = function (item) {
                $scope.criteriaItem = item;
                modalCriteria.show();
            }
        },
    ]);
