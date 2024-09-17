angular.module("altairApp")
    .controller("odaContractCtrl", [
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

            $scope.dataExecutorSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: __env.apiUrl() + "/api/oda/v3/oda-project-executor/list",
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
                        data: {
                            sort: [{field: "id", dir: "asc"}],
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
                        },
                    },
                },
                pageSize: 20,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
            });
            $scope.mainExecutorGrid = {
                filterable: {
                    mode: "row",
                    extra: false,
                    cell: {
                        operator: "eq",
                    },
                },
                sortable: true,
                resizable: true,
                navigatable: true,
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5,
                },
                columns: [
                    {
                        title: "#",
                        headerAttributes: {class: "columnCenter"},
                        attributes: {style: "text-align: center;"},
                        template: "#= ++record #",
                        width: 50
                    },
                    {
                        attributes: {style: "text-align: center;"},
                        title: "Гэрээ",
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                        columns:[
                            {
                                field: "contractCode",
                                filterable: {
                                    cell: {
                                        operator: "contains",
                                        suggestionOperator: "contains",
                                        showOperators: false
                                    }
                                },
                                width: 120,
                                attributes: {style: "text-align: center;"},
                                title: "Дугаар",
                                headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                            },
                            {
                                field: "contractName",
                                filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                                title: "Нэр",
                                width: 250,
                                attributes: {style: "text-align: left;"},
                                headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                            },
                            {
                                field: "startDate",
                                template: "<span ng-bind=\"formatDate(dataItem.startDate) | date:'dd-MM-yyyy'\"></span>",
                                filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                                title: "Эхлэх",
                                width: 100,
                                attributes: {style: "text-align: center;"},
                                headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                            },
                            {
                                field: "endDate",
                                template: "<span ng-bind=\"formatDate(dataItem.endDate) | date:'dd-MM-yyyy'\"></span>",
                                filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                                title: "Дуусах",
                                width: 100,
                                attributes: {style: "text-align: center;"},
                                headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                            },
                            {
                                field: "contractTotalAmount",
                                template: "<span ng-bind='dataItem.contractTotalAmount |number:0'></span>",
                                filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                                title: "Дүн",
                                width: 120,
                                attributes: {style: "text-align: right;"},
                                headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                            },
                            {
                                field: "currencyCode",
                                filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                                title: "Валют",
                                width: 100,
                                attributes: {style: "text-align: center;"},
                                headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                            },
                        ]
                    },
                    {
                        title: "Гүйцэтгэгч",
                        attributes: {style: "text-align: center;"},
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                        columns: [
                            {
                                field: "name",
                                filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                                title: "Нэр",
                                width: 120,
                                attributes: {style: "text-align: center;"},
                                headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                            },
                            {
                                field: "register",
                                filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                                title: "Регистр",
                                width: 100,
                                attributes: {style: "text-align: left;"},
                                headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                            },
                        ]
                    },
                    {
                        field: "customerId",
                        filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                        title: "Харилцагч",
                        width: 150,
                        attributes: {style: "text-align: center;"},
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                    },
                    {
                        title: "Данс",
                        attributes: {style: "text-align: center;"},
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                        columns: [
                            {
                                field: "bankName",
                                filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                                title: "Банк",
                                width: 150,
                                attributes: {style: "text-align: center;"},
                                headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                            },
                            {
                                field: "customerName",
                                filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                                title: "Нэр",
                                width: 150,
                                attributes: {style: "text-align: center;"},
                                headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                            },
                            {
                                field: "accountNumber",
                                filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                                title: "Дугаар",
                                width: 150,
                                attributes: {style: "text-align: center;"},
                                headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                            },
                            {
                                field: "accountCurrencyCode",
                                filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                                title: "Валют",
                                width: 100,
                                attributes: {style: "text-align: center;"},
                                headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                            },
                        ]
                    },
                    {
                        title: "Хариуцсан ажилтан",
                        attributes: {style: "text-align: center;"},
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                        columns: [
                            {
                                field: "firstNameh",
                                filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                                title: "Өөрийн нэр",
                                width: 150,
                                attributes: {style: "text-align: center;"},
                                headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                            },
                            {
                                field: "lastNameh",
                                filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                                title: "Овог",
                                width: 150,
                                attributes: {style: "text-align: center;"},
                                headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                            },
                        ]
                    },
                   /* {
                        field: "id",
                        filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                        title: "Гэрээний дугаар",
                        width: 150,
                        attributes: {style: "text-align: center;"},
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                    },
                    {
                        field: "taskId",
                        filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                        title: "taskId",
                        width: 150,
                        attributes: {style: "text-align: center;"},
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                    },
                    {
                        field: "contractorId",
                        filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                        title: "contractorId",
                        width: 150,
                        attributes: {style: "text-align: center;"},
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                    },*/
                    {
                        field: "limitAmount",
                        template: "<span ng-bind='dataItem.limitAmount!=null?(dataItem.limitAmount |number:0):0'></span>",
                        filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                        title: "Чөлөөлөгдөх татварын дүн",
                        width: 150,
                        attributes: {style: "text-align: right;"},
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                    },
                ],
                dataBinding: function () {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                },
                editable: false,
                scrollable: true,
                height: function () {
                    if ($scope.menuData.pageType === 0) {
                        return $(window).height() - 150;
                    }
                    return $(window).height() - 115;
                }
            };
            $scope.mainExecutorGrid.columns.push({
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
                $state.go("restricted.oda.contractView", {id: item.id});
            };
        },
    ]);
