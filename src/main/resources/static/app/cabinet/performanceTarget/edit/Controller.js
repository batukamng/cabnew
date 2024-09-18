angular.module("altairApp")
    .controller("performanceTargetComponentCtrl", [
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
            $scope.user = JSON.parse(sessionStorage.getItem("currentUser")).user;
            $("#header_main").attr("style", "filter: none !important;padding: 8px 25px");
            $scope.menuData = JSON.parse(sessionStorage.getItem("menuData"));

            $scope.appDataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: function (e) {
                            return __env.apiUrl() + "/api/oda/v3/oda-component/list";
                        },
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
                        data: {
                            sort: [{field: "id", dir: "desc"}],
                        },
                        beforeSend: function (req) {
                            req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
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
                    {
                        field: "id",
                        title: "Системийн дугаар",
                        width: 120,
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                        filterable: {cell: {operator: "eq", showOperators: false}},
                    },
                    {
                        field: "componentId",
                        title: "componentId",
                        filterable: {cell: {operator: "eq", showOperators: false}},
                        attributes: {style: "text-align: center;"},
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                        width: 110,
                    },
                    {
                        field: "componentCode",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        title: "Дугаар",
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                        width: 200,
                        attributes: {style: "text-align: left;"},
                    },
                    {
                        field: "componentName",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        title: "Бүрэлдэхүүний нэр",
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                        width: 200,
                        attributes: {style: "text-align: left;"},
                    },
                    {
                        field: "partnerName",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        title: "Хөгжлийн түнш",
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                        width: 150,
                        attributes: {style: "text-align: left;"},
                    },
                    {
                        field: "economicSourceName",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        title: "Санхүүжилтийн төрөл",
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                        width: 150,
                        attributes: {style: "text-align: left;"},
                    }, {
                        field: "contractName",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        title: "Гэрээ",
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                        width: 150,
                        attributes: {style: "text-align: left;"},
                    },{
                        field: "industryName",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        title: "Салбар",
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                        width: 150,
                        attributes: {style: "text-align: left;"},
                    },
                    {
                        field: "currencyCode",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        title: "Валют",
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                        width: 150,
                        attributes: {style: "text-align: left;"},
                    },
                    {
                        field: "budgetAmount",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        title: "Бүрэлдэхүүний төсөв",
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                        width: 150,
                        attributes: {style: "text-align: left;"},
                    },{
                        field: "taskAmount",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        title: "Гэрээ байгуулсан дүн",
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                        width: 150,
                        attributes: {style: "text-align: left;"},
                    },{
                        field: "componentAmount",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        title: "Үлдэгдэл",
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                        width: 150,
                        attributes: {style: "text-align: left;"},
                    },
                    {
                        attributes: {style: "text-align: left;"},
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                        title: "БҮРТГЭСЭН",
                        width: 150,
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        columns:[
                            {
                                field: "createdDate",
                                filterable: {cell: {operator: "contains", showOperators: false}},
                                title: "Огноо",
                                headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                                width: 100,
                                attributes: {style: "text-align: left;"},
                            },
                            {
                                field: "username",
                                filterable: {cell: {operator: "contains", showOperators: false}},
                                title: "Хэрэглэгч",
                                headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                                width: 100,
                                attributes: {style: "text-align: left;"},
                            },
                        ]
                    },
                ],
                dataBinding: function () {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                },
                editable: "inline",
                height: function () {
                    return $(window).height() - 150;
                },
                dataBound: function (e) {
                    var grid = this;
                    grid.tbody.find("tr").dblclick(function (e) {
                        var dataItem = grid.dataItem(this);
                        $scope.gotoDetail(dataItem);
                    });
                    /*    var rows = grid.tbody.children();
                        for (var j = 0; j < rows.length; j++) {
                            var row = $(rows[j]);
                            var dataItem = e.sender.dataItem(row);
                            var stepId = dataItem.get("stepId");
                            if (stepId == 3 || stepId == 5 || stepId == 7) {
                                row[0].cells[8].style.color = "White";
                                row[0].cells[8].style.backgroundColor = "Red";
                            }
                            // else if (stepId == 4 || stepId == 6 || stepId == 8) {
                            //     row[0].cells[8].style.backgroundColor = "#19BAFA";
                            // }
                        }*/
                },
            };
            $scope.mainGrid.columns.push({
                command: [
                    {
                        template: '<button class="grid-btn" ng-click=\'downloadFile(dataItem)\'><div class="nimis-icon see "></div>Харах</button>',
                    },
                ],
                title: "&nbsp;",
                headerAttributes: {class: "rightMinus"},
                attributes: {class: "rightMinus uk-text-center"},
                sticky: true,
                width: 80,
            });


        },
    ]);
