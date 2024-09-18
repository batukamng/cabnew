angular.module("altairApp")
    .controller("projectInfoCtrl", [
        "$rootScope",
        "$state",
        "$stateParams",
        "$scope",
        "$timeout",
        "$translate",
        "commonDataSource",
        "sweet",
        "projectItem",
        "mainService",
        "__env",
        function ($rootScope, $state, $stateParams, $scope, $timeout, $translate, commonDataSource, sweet, projectItem, mainService, __env) {
            $scope.menuData = JSON.parse(sessionStorage.getItem("menuData"));
            $scope.user = JSON.parse(sessionStorage.getItem("currentUser")).user;
            $scope.app = projectItem;
            $scope.editable = true;
            $scope.tabType=1;

            $scope.formatDate = function (date) {
                return new Date(date);
            };
            $scope.currency = {};
            for (let i = 0; i < $scope.app.components.length; i++) {
                if (!$scope.currency.hasOwnProperty($scope.app.components[i].currencyCode)) {
                    $scope.currency[$scope.app.components[i].currencyCode] = 0;
                }
                $scope.currency[$scope.app.components[i].currencyCode] += $scope.app.components[i].budgetAmount;
            }

            $scope.dataComponentSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: __env.apiUrl() + "/api/oda/v3/oda-project-component/list",
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
                        data: {
                            sort: [{field: "id", dir: "asc"}],
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
                        },
                    },
                },
                filter: {
                    logic: "and",
                    filters: [
                        {
                            field: "parentId",
                            operator: "eq",
                            value: $scope.app.id
                        }
                    ],
                },
                pageSize: 20,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
            });
            $scope.mainComponentGrid = {
                filterable: false,
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
                        width: 50,
                    },
                    {
                        field: "componentName",
                        filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                        title: "Бүрэлдэхүүний нэр",
                        width: 150,
                        attributes: {style: "text-align: left;"},
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                    },
                    {
                        field: "partnerName",
                        filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                        title: "Хөгжлийн түнш",
                        width: 120,
                        attributes: {style: "text-align: center;"},
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                    },
                    {
                        field: "economicSourceName",
                        filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                        title: "Санхүүжилтийн төрөл",
                        width: 150,
                        attributes: {style: "text-align: center;"},
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                    },
                    {
                        field: "contractName",
                        filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                        title: "Гэрээний нэр",
                        attributes: {style: "text-align: left;"},
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                    },
                    {
                        field: "industryName",
                        filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                        title: "Салбар",
                        width: 120,
                        attributes: {style: "text-align: center;"},
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
                    {
                        field: "budgetAmount",
                        template: "<span ng-bind='dataItem.budgetAmount | number:0'></span>",
                        filterable: {cell: {operator: "eq", suggestionOperator: "contains", showOperators: false}},
                        title: "Бүрэлдэхүүний төсөв",
                        width: 120,
                        attributes: {style: "text-align: right;"},
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                    },
                    {
                        field: "taskAmount",
                        template: "<span ng-bind='dataItem.taskAmount | number:0'></span>",
                        filterable: {cell: {operator: "eq", suggestionOperator: "contains", showOperators: false}},
                        title: "Гэрээ байгуулсан дүн",
                        width: 120,
                        attributes: {style: "text-align: right;"},
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                    },
                    {
                        field: "componentAmount",
                        template: "<span ng-bind='dataItem.componentAmount | number:0'></span>",
                        filterable: {cell: {operator: "eq", suggestionOperator: "contains", showOperators: false}},
                        title: "Үлдэгдэл дүн",
                        width: 120,
                        attributes: {style: "text-align: right;"},
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                    },
                ],
                dataBinding: function () {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                },
                dataBound: function (e) {
                  /*  var grid = this;
                    var rows = grid.tbody.children();
                    for (var j = 0; j < rows.length; j++) {
                        var row = $(rows[j]);
                        row[0].cells[0].style.backgroundColor = "#fff7ed";
                        row[0].cells[1].style.backgroundColor = "#fff7ed";
                        row[0].cells[2].style.backgroundColor = "#fff7ed";
                    }*/
                },
                height: function () {
                    return $(window).height() - 210;
                },
                editable: false,
                scrollable: true
            };
            $scope.detailGridOptions = function (dataItem) {
                $scope.parentData = dataItem;
                return {
                    dataSource: {
                        transport: {
                            read: {
                                url: __env.apiUrl() + "/api/oda/v3/oda-project-task/list",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                data: {sort: [{field: "id", dir: "asc"}]},
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
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
                                    parentId: {type: "number", defaultValue: dataItem.id},
                                    useYn: {type: "number", defaultValue: 1}
                                }
                            }
                        },
                        pageSize: 5,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true,
                        filter: {
                            logic: "and",
                            filters: [
                                {field: "componentId", operator: "eq", value: dataItem.componentId},
                            ],
                        },
                    },
                    scrollable: false,
                    sortable: true,
                    pageable: {
                        refresh: true,
                        pageSizes: true,
                        buttonCount: 5,
                    },
                    editable: false,
                    columns: [
                        {
                            title: "#",
                            headerAttributes: {class: "columnCenter"},
                            attributes: {style: "text-align: center;"},
                            template: "#= ++recordDet #",
                            width: 50,
                        },
                        {
                            field: "componentName",
                            filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                            title: "Бүрэлдэхүүн санхүүжүүлэгч",
                            width: 150,
                            attributes: {style: "text-align: left;"},
                            headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                        },
                        {
                            field: "taskName",
                            filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                            title: "Хийгдэх ажил",
                            width: 300,
                            attributes: {style: "text-align: left;"},
                            headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                        },
                        {
                            field: "taskAmount",
                            filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                            title: "Дүн",
                            width: 100,
                            template: "<span ng-bind='dataItem.taskAmount | number:0'></span>",
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
                        {
                            field: "taskTypeName",
                            filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                            title: "Төрөл",
                            width: 100,
                            attributes: {style: "text-align: center;"},
                            headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                        },
                        {
                            field: "description",
                            filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                            title: "Тайлбар",
                            attributes: {style: "text-align: center;"},
                            headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                        },
                        {
                            field: "cityName",
                            filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                            title: "Аймаг/хот",
                            width: 100,
                            attributes: {style: "text-align: center;"},
                            headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                        },
                        {
                            field: "districtName",
                            filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                            title: "Сум/дүүрэг",
                            width: 100,
                            attributes: {style: "text-align: center;"},
                            headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                        },
                        {
                            command: [
                                {
                                    template: '<button class="grid-btn" ng-click=\'gotoWork(dataItem)\'><div class="nimis-icon see "></div>Харах</button>',
                                },
                            ],
                            title: "&nbsp;",
                            headerAttributes: {class: "rightMinus"},
                            attributes: {class: "rightMinus uk-text-center"},
                            sticky: true,
                            width: 80,
                        }
                    ],
                    dataBinding: function () {
                        recordDet = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                    },
                };
            };

            $scope.mainComponentGrid.columns.push({
                command: [
                    {
                        template: '<button class="grid-btn" ng-click=\'gotoComponent(dataItem)\'><div class="nimis-icon see "></div>Харах</button>',
                    },
                ],
                title: "&nbsp;",
                headerAttributes: {class: "rightMinus"},
                attributes: {class: "rightMinus uk-text-center"},
                sticky: true,
                width: 80,
            });

            $scope.gotoWork=function (item){
                $state.go("restricted.oda.componentView", {id: item.id});
            }

            $scope.gotoComponent=function (item){
                $state.go("restricted.oda.componentView", {id: item.id});
            }

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
                        },
                    },
                },
                filter: {
                    logic: "and",
                    filters: [
                        {
                            field: "projectId",
                            operator: "eq",
                            value: $scope.app.id
                        }
                    ],
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
                        width: 50,
                        sticky: true
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
                                width: 200,
                                attributes: {style: "text-align: left;"},
                                headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                            },
                            {
                                field: "startDate",
                                filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                                title: "Эхлэх",
                                width: 120,
                                attributes: {style: "text-align: center;"},
                                headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                            },
                            {
                                field: "endDate",
                                filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                                title: "Дуусах",
                                width: 120,
                                attributes: {style: "text-align: center;"},
                                headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                            },
                            {
                                field: "contractTotalAmount",
                                filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                                title: "Дүн",
                                width: 120,
                                attributes: {style: "text-align: center;"},
                                headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                            },
                            {
                                field: "currencyCode",
                                filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                                title: "Валют",
                                width: 120,
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
                                width: 150,
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
                                width: 150,
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
                    {
                        field: "contractId",
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
                    },
                    {
                        field: "limitAmount",
                        filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                        title: "Чөлөөлөгдөх татварын дүн",
                        width: 150,
                        attributes: {style: "text-align: center;"},
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
                        return $(window).height() - 140;
                    }
                    return $(window).height() - 115;
                }
            };

            $scope.dataCriteriaSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: __env.apiUrl() + "/api/oda/v3/oda-project-criteria/list",
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
                        data: {
                            sort: [{field: "id", dir: "asc"}],
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
                        },
                    },
                },
                filter: {
                    logic: "and",
                    filters: [
                        {
                            field: "projectId",
                            operator: "eq",
                            value: $scope.app.id
                        }
                    ],
                },
                pageSize: 10,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
            });
            $scope.mainCriteriaGrid = {
                filterable: {
                    mode: "row",
                    extra: false,
                    cell: {
                        operator: "eq",
                    },
                },
                sortable: true,
                resizable: true,
                scrollable: false,
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
                        width: 50,
                        sticky: true
                    },
                    {
                        field: "criteriaNumber",
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
                        field: "criteriaName",
                        filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                        title: "Шалгуур үзүүлэлт",
                        width: 200,
                        attributes: {style: "text-align: left;"},
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                    },
                    {
                        field: "criteriaLevel",
                        filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                        title: "Хамрах түвшин",
                        width: 120,
                        attributes: {style: "text-align: center;"},
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                    },
                    {
                        field: "criteriaType",
                        filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                        title: "Төрөл",
                        width: 120,
                        attributes: {style: "text-align: center;"},
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                    },
                    {
                        field: "valueType",
                        filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                        title: "Суурь үзүүлэлт",
                        width: 120,
                        attributes: {style: "text-align: center;"},
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                    },
                    {
                        field: "direction",
                        filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                        title: "Чиглэл",
                        width: 120,
                        attributes: {style: "text-align: center;"},
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                    },
                    {
                        field: "frequence",
                         filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                        title: "Давтамж",
                        width: 120,
                        attributes: {style: "text-align: center;"},
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                    },
                    {
                        field: "direction",
                         filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                        title: "Чиглэл",
                        width: 120,
                        attributes: {style: "text-align: center;"},
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                    },
                    {
                        field: "baseIndicator",
                         filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                        title: "Суурь үзүүлэлт",
                        width: 300,
                        attributes: {style: "text-align: left;"},
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                    },
                    {
                        field: "informationSource",
                         filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                        title: "Эх сурвалж",
                        width: 150,
                        attributes: {style: "text-align: center;"},
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                    },
                    {
                        field: "evaluationMethod",
                         filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                        title: "Тооцоолох арга",
                        width: 150,
                        attributes: {style: "text-align: center;"},
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                    },
                    {
                        field: "description",
                         filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                        title: "Тэмдэглэл",
                        width: 150,
                        attributes: {style: "text-align: center;"},
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                    },
                ],
                dataBinding: function () {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                },
                dataBound: function (e) {
                    var grid = this;
                    var rows = grid.tbody.children();
                    for (var j = 0; j < rows.length; j++) {
                        var row = $(rows[j]);
                 /*       row[0].cells[0].style.backgroundColor = "#fff7ed";
                        row[0].cells[1].style.backgroundColor = "#fff7ed";
                        row[0].cells[2].style.backgroundColor = "#fff7ed";*/
                    }
                },
                editable: false,
                scrollable: true,
                height: function () {
                    if ($scope.menuData.pageType === 0) {
                        return $(window).height() - 140;
                    }
                    return $(window).height() - 115;
                }
            };

        },
    ]);
