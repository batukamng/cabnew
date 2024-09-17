angular.module("altairApp")
    .controller("creditAdminCtrl", [
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
            $("#header_main").attr("style", "filter: none !important;padding: 8px 25px");
            $scope.menuData = JSON.parse(localStorage.getItem("menuData"));
            $scope.formatDate = function (date) {
                return new Date(date);
            };



            $scope.appDataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: function (e) {
                            return __env.apiUrl() + "/api/nms/oda/project-info/list";
                        },
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
                        data: {
                            sort: [{field: "id", dir: "desc"}],
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
                            pipAmt: {type: "number", editable: false},
                            amount: {type: "number", editable: false},
                            totalAmt: {type: "number", editable: false},
                        },
                    },
                },
             /*   filter: {
                    logic: "and",
                    filters: [
                        {
                            field: "parentId",
                            operator: "isnull",
                            value: true
                        }
                    ],
                },*/
                pageSize: 10,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
            });
            $scope.mainGrid = {
                sortable: true,
                resizable: true,
                persistSelection: true,
                pageable: {
                    pageSizes: [10, 20, 50, 100],
                    refresh: true,
                    pageSize: 20,
                    buttonCount: 5,
                },
                filterable: {
                    mode: "row",
                    extra: false,
                    cell: {
                        operator: "eq",
                    },
                },
                columns: [
                    {
                        title: "#",
                        headerAttributes: {class: "columnCenter"},
                        attributes: {style: "text-align: center;"},
                        template: "#= ++record #",
                        width: 60,
                        sticky: true,
                    },
                    // {
                    //     field: "projectTypeName",
                    //     title: "Төсөл",
                    //     filterable: {cell: {operator: "eq", showOperators: false}},
                    //     attributes: {style: "text-align: center;"},
                    //     headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                    //     width: 110,
                    //     columns:[
                    //         {
                    //             field: "projectCode",
                    //             filterable: {cell: {operator: "contains", showOperators: false}},
                    //             title: "Дугаар",
                    //             headerAttributes: {style: "text-align: left;white-space: normal; vertical-align: middle; "},
                    //             width: 150,
                    //             attributes: {style: "text-align: left;"},
                    //         },
                    //         {
                    //             field: "projectName",
                    //             filterable: {cell: {operator: "contains", showOperators: false}},
                    //             title: "Нэр",
                    //             headerAttributes: {style: "text-align: left;white-space: normal; vertical-align: middle; "},
                    //             width: 300,
                    //             attributes: {style: "text-align: left;"},
                    //         },
                    //     ]
                    // },

                    {
                        field: "partnerNames",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        title: "Албан тушаал",
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                        width: 200,
                        attributes: {style: "text-align: left;"},
                    },
                    {
                        field: "customerName",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        title: "Овог нэр",
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                        width: 250,
                        attributes: {style: "text-align: left;"}
                    },
                    {
                        field: "customerGroupName",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        title: "Огноо",
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                        width: 150,
                        attributes: {style: "text-align: left;"}
                    },
                    // {
                    //     attributes: {style: "text-align: left;"},
                    //     headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                    //     title: "Хугацаа",
                    //     filterable: {cell: {operator: "contains", showOperators: false}},
                    //     columns:[
                    //         {
                    //             field: "startDate",
                    //             filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                    //             title: "Эхлэх",
                    //             width: 100,
                    //             attributes: {style: "text-align: center;"},
                    //             headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                    //         },
                    //         {
                    //             field: "endDate",
                    //             filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                    //             title: "Дуусах",
                    //             attributes: {style: "text-align: center;"},
                    //             headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                    //         }
                    //     ]
                    // },
                    {
                        field: "dateStatusName",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        title: "Регистр",
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                        width: 200,
                        attributes: {style: "text-align: center;"}
                    },
                    {
                        field: "wfmStatusName",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        title: "Ярилцлага",
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                        width: 200,
                        attributes: {style: "text-align: center;"}
                    },
                    {
                        field: "dateStatusName",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        title: "Үнэлгээ",
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                        width: 200,
                        attributes: {style: "text-align: center;"}
                    },
                    {
                        field: "wfmStatusName",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        title: "Ажлын дундаж",
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                        width: 200,
                        attributes: {style: "text-align: center;"}
                    }
                ],
                dataBinding: function () {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                },
                editable: "inline",
                height: function () {
                    return $(window).height() - 110;
                },
            };
            $scope.mainGrid.columns.push({
                command: [
                    {
                        template: '<button class="grid-btn" ng-click=\'gotoDetail(dataItem)\'><div class="nimis-icon see "></div>Харах</button>',
                    },
                ],
                title: "&nbsp;",
                headerAttributes: {class: "rightMinus"},
                attributes: {class: "rightMinus uk-text-center"},
                sticky: true,
                width: 85,
            });

            $scope.gotoDetail = function (item) {
                $state.go("restricted.oda.projectView", {id: item.id});
            };
        },
    ]);
