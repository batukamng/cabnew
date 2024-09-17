angular.module("altairApp").controller("919NmsCtrl", [
    "$rootScope",
    "$state",
    "$scope",
    "$timeout",
    "mainService",
    "commonDataSource",
    "Upload",
    "$http",
    "__env",
    function ($rootScope, $state, $scope, $timeout, mainService, commonDataSource, Upload, $http, __env) {
        $scope.user = JSON.parse(localStorage.getItem("currentUser")).user;

        $scope.columnDataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: __env.apiUrl() + "/api/nms/grid/column/list",
                    contentType: "application/json; charset=UTF-8",
                    type: "POST",
                    data: {
                        sort: [{field: "id", dir: "desc"}],
                    },
                    beforeSend: function (req) {
                        req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
                    },
                },
                destroy: {
                    url: __env.apiUrl() + "/api/nms/grid/column",
                    contentType: "application/json; charset=UTF-8",
                    beforeSend: function (req) {
                        req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
                    },
                    complete: function () {
                        $("#column").data("kendoGrid").dataSource.read();
                    },
                    type: "DELETE",
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
                        configId: {type: "number", defaultValue: 0},
                        name: {type: "string"},
                        colNm: {type: "string"},
                        fkColNm: {type: "string"},
                        colType: {type: "string", defaultValue: "VARCHAR"},
                        useYn: {type: "number", defaultValue: 1}
                    },
                },
            },
            pageSize: 20,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
        });
        $scope.configDataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: __env.apiUrl() + "/api/nms/grid/config/list",
                    contentType: "application/json; charset=UTF-8",
                    type: "POST",
                    data: {
                        sort: [{field: "id", dir: "desc"}],
                    },
                    beforeSend: function (req) {
                        req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
                    },
                },
                update: {
                    url: __env.apiUrl() + "/api/nms/grid/config",
                    contentType: "application/json; charset=UTF-8",
                    type: "PUT",
                    beforeSend: function (req) {
                        req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
                    },
                    complete: function (e) {
                        if (e.status === 200) {
                            $rootScope.alert(true, "Амжилттай засагдлаа");
                        } else if (e.status === 500) {
                            $rootScope.alert(false, "Амжилтгүй");
                        }
                        $("#config").data("kendoGrid").dataSource.read();
                    },
                },
                create: {
                    url: __env.apiUrl() + "/api/nms/grid/config",
                    contentType: "application/json; charset=UTF-8",
                    type: "POST",
                    complete: function (e) {
                        $("#config").data("kendoGrid").dataSource.read();
                    },
                    beforeSend: function (req) {
                        req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
                    },
                },
                destroy: {
                    url: __env.apiUrl() + "/api/nms/grid/config",
                    contentType: "application/json; charset=UTF-8",
                    beforeSend: function (req) {
                        req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
                    },
                    complete: function (e) {
                        $("#config").data("kendoGrid").dataSource.read();
                    },
                    type: "POST",
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
                        importMethod: {type: "string", defaultValue: "POST"},
                        editMode: {type: "string", defaultValue: "inline"},
                        createMethod: {type: "string", defaultValue: "POST"},
                        readMethod: {type: "string", defaultValue: "POST"},
                        updateMethod: {type: "string", defaultValue: "PUT"},
                        deleteMethod: {type: "string", defaultValue: "DELETE"},
                        useYn: {type: "number", defaultValue: 1}
                    },
                },
            },
            pageSize: 20,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
        });
        $scope.columnGrid = {
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
                    title: "#",
                    headerAttributes: {class: "columnCenter"},
                    attributes: {style: "text-align: center;"},
                    template: "#= ++record #",
                    width: 50,
                },
                {
                    field: "config.name",
                    filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                    template: "#if(config!=null){# #=config.name# #}#",
                    title: "Төрөл",
                    width: 150,
                },
                {
                    field: "name",
                    filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                    title: "Нэр",
                },
                {
                    field: "colNm",
                    filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                    title: "Баганы нэр",
                },
                {
                    field: "fkColNm",
                    filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                    title: "Холбогдох багана",
                },
                {
                    field: "color",
                    filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                    title: "Баганы өнгө",
                    width: 150
                },
                {
                    field: "width",
                    filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                    title: "Баганы урт",
                    width: 150
                },
                {
                    field: "ordNum",
                    filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                    title: "Баганы эрэмбэ",
                    width: 150
                },
                {
                    field: "system",
                    values:[{"text":"Тийм","value":"1"},{"text":"Үгүй","value":"0"}],
                    filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                    title: "Систем",
                    attributes: {style: "text-align: left;"},
                    width: 150
                },
                {
                    field: "colType",
                    filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Баганы төрөл",
                    width: 150,
                    values:[{"text":"VARCHAR","value":"VARCHAR"},{"text":"NUMBER","value":"NUMBER"},{"text":"DATE","value":"DATE"}]
                },
                {
                    command: [
                        {
                            template:
                                '<div class="command-container"><a class="grid-btn" ng-click="update(dataItem)"><div class="nimis-icon edit"></div></a><button class="grid-btn k-grid-remove-command" ng-click=\'deleteData(dataItem)\'><div class="nimis-icon delete"></div></button><a class="grid-btn k-grid-update"><div class="nimis-icon update"></div></a> <a class="grid-btn k-grid-cancel"><div class="nimis-icon cancel"></div></a></div>',
                        },
                    ],
                    title: "&nbsp;",
                    sticky: true,
                    width: 80,
                }
            ],
            dataBinding: function () {
                record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
            },
            editable: "inline",
            scrollable: true,
            height: function () {
                return $(window).height() - 140;
            },
        };
        $scope.configGrid = {
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
                    title: "#",
                    headerAttributes: {class: "columnCenter"},
                    attributes: {style: "text-align: center;"},
                    template: "#= ++record #",
                    width: 50,
                },
                {
                    field: "code",
                    filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                    headerAttributes: {"style": "white-space: normal; vertical-align: middle;text-align: center;"},
                    title: "Код",
                    width: 100,
                },
                {
                    field: "name",
                    filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                    headerAttributes: {"style": "white-space: normal; vertical-align: middle;text-align: center;"},
                    title: "Нэр",
                    width: 200,
                },
                {
                    field: "sheetNames",
                    filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                    headerAttributes: {"style": "white-space: normal; vertical-align: middle;text-align: center;"},
                    title: "Шийтний нэр",
                    width: 150,
                },
                {
                    field: "editMode",
                    filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                    headerAttributes: {"style": "white-space: normal; vertical-align: middle;text-align: center;"},
                    title: "Засах төрөл",
                    values:[{"text":"Inline","value":"inline"},{"text":"Batch","value":true},{"text":"False","value":false}],
                    width: 150,
                },
                {
                    title: "Import",
                    columns:[
                        {
                            field: "importMethod",
                            filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                            title: "Method",
                            width: 100,
                            values:[{"text":"POST","value":"POST"},{"text":"PUT","value":"PUT"},{"text":"DELETE","value":"DELETE"},{"text":"PATCH","value":"PATCH"}]
                        },
                        {
                            field: "importUrl",
                            filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                            title: "Url",
                        },
                    ]
                },
                {
                    title: "Create",
                    columns:[
                        {
                            field: "createMethod",
                            filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                            title: "Method",
                            width: 100,
                            values:[{"text":"POST","value":"POST"},{"text":"PUT","value":"PUT"},{"text":"DELETE","value":"DELETE"},{"text":"PATCH","value":"PATCH"}]
                        },
                        {
                            field: "createUrl",
                            filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                            title: "Url",
                        },
                    ]
                },
                {
                    title: "Read",
                    columns:[
                        {
                            field: "readMethod",
                            filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                            title: "Method",
                            width: 100,
                            values:[{"text":"POST","value":"POST"},{"text":"GET","value":"GET"}]
                        },
                        {
                            field: "readUrl",
                            filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                            title: "Url",
                        },
                    ]
                },
                {
                    title: "Update",
                    columns:[
                        {
                            field: "updateMethod",
                            filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                            title: "Method",
                            width: 100,
                            values:[{"text":"POST","value":"POST"},{"text":"PUT","value":"PUT"},{"text":"DELETE","value":"DELETE"},{"text":"PATCH","value":"PATCH"}]
                        },
                        {
                            field: "updateUrl",
                            filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                            title: "Url",
                        },
                    ]
                },
                {
                    title: "Delete",
                    columns:[
                        {
                            field: "deleteMethod",
                            filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                            title: "Method",
                            width: 100,
                            values:[{"text":"POST","value":"POST"},{"text":"PUT","value":"PUT"},{"text":"DELETE","value":"DELETE"},{"text":"PATCH","value":"PATCH"}]
                        },
                        {
                            field: "deleteUrl",
                            filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                            title: "Url",
                        },
                    ]
                },
                {
                    command: [
                        {
                            template:
                                '<div class="command-container"><a class="grid-btn k-grid-edit"><div class="nimis-icon edit"></div></a><button class="grid-btn k-grid-remove-command" ng-click=\'deleteData(dataItem)\'><div class="nimis-icon delete"></div></button><a class="grid-btn k-grid-update"><div class="nimis-icon update"></div></a> <a class="grid-btn k-grid-cancel"><div class="nimis-icon cancel"></div></a></div>',
                        },
                    ],
                    title: "&nbsp;",
                    sticky: true,
                    width: 80,
                }
            ],
            dataBinding: function () {
                record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
            },
            editable: "inline",
            scrollable: true,
            height: function () {
                return $(window).height() - 140;
            },
        };

        if (localStorage.getItem('buttonData').includes("create")) {
            $scope.columnGrid.toolbar = [
                { template: "<button class='k-button k-button-icontext' ng-click='add()'><span class=\"k-icon k-i-plus\"></span>Нэмэх</button>" }
            ];
        }
        var modalForm = UIkit.modal("#modal_form", {
            modal: false,
            keyboard: false,
            bgclose: false,
            center: true
        });

        $scope.dataItem = {};
        $scope.add = function () {
            $scope.dataItem = {useYn: 1,system:0,configId:0,colType: "VARCHAR"};
            modalForm.show();
            $timeout(() => $rootScope.clearForm("validator"));
        };
        $scope.update = function (item) {
            $scope.dataItem = item;
            modalForm.show();
        };

        $scope.formSubmit = function (type) {
            var validator = $("#validator").kendoValidator().data("kendoValidator");
            if (validator.validate()) {
                var method = "post";
                //if ($scope.dataItem.id !== undefined && $scope.dataItem.id !== null) method = "put";
                mainService.withdata(method, "/api/nms/grid/column/submit", $scope.dataItem).then(function (data) {
                    $rootScope.alert(true, "Амжилттай хадгаллаа.");
                    if (type === 1) {
                        modalForm.hide();
                    }
                    $timeout(() => $rootScope.clearForm("validator"));
                    $("#column").data("kendoGrid").dataSource.read();
                });
            }
        };

        if (localStorage.getItem('buttonData').includes("create")) {
            $scope.configGrid.toolbar = [
                { template: "<button class='k-button k-button-icontext k-grid-add'><span class=\"k-icon k-i-plus\"></span>Нэмэх</button>" }
            ];
        }

        if (localStorage.getItem("buttonData").includes("update") || localStorage.getItem("buttonData").includes("edit")) {
            $scope.configGrid.columns.push({
                command: [
                    {
                        template:
                            '<div class="command-container"><a class="grid-btn k-grid-edit"><div class="nimis-icon edit"></div></a><button class="grid-btn k-grid-remove-command" ng-click=\'deleteData(dataItem)\'><div class="nimis-icon delete"></div></button><a class="grid-btn k-grid-update"><div class="nimis-icon update"></div></a> <a class="grid-btn k-grid-cancel"><div class="nimis-icon cancel"></div></a></div>',
                    },
                ],
                title: "&nbsp;",
                sticky: true,
                width: 80,
            });
        }

        $scope.tabStrip = {
            tabPosition: "top",
            animation: {open: {effects: "fadeIn"}},
            select: function (e) {
            },
        };

    },
]);
