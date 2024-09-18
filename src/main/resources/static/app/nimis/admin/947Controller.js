angular.module("altairApp").controller("947NmsCtrl", [
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
        $scope.user = JSON.parse(sessionStorage.getItem("currentUser")).user;
        $scope.stepDataSource = commonDataSource.urlDataSource("/api/nms/funding/step/list", JSON.stringify({
            filter: {
                logic: "and",
                filters: [
                    { field: "stepType", operator: "eq", value: 2 },
                    { field: "useYn", operator: "eq", value: 1 }
                ]
            },
            sort: [{ field: "id", dir: "asc" }] }));
        $scope.stepOptions = {
            placeholder: "Үе шат сонгох...",
            dataTextField: 'name',
            dataValueField: 'id',
            valuePrimitive: true,
            autoBind: true,
            dataSource: $scope.stepDataSource,
        };
        $scope.stepEditor = function(container, options) {
            let editor = $('<select kendo-drop-down-list k-options="stepOptions" required data-bind="value:' + options.field + '"></select>')
              .appendTo(container);
        };
        $scope.userEditor = function(container, options) {
            $scope.userDataSource = commonDataSource.urlDataSource("/api/nms/user/list", JSON.stringify({
                filter: {
                    logic: "and",
                    filters: [
                        { field: "id", operator: "eq", value: options.model.userId },
                        { field: "useYn", operator: "eq", value: 1 },
                    ]
                },
                sort: [{ field: "id", dir: "asc" }] })
            );
            $scope.userOptions = {
                placeholder: "Хэрэглэгч сонгох...",
                dataTextField: 'username',
                dataValueField: 'id',
                valuePrimitive: true,
                autoBind: true,
                dataSource: $scope.userDataSource,
                virtual: {
                    itemHeight: 27,
                    valueMapper: function() {}
                },
            };
            let editor = $('<select kendo-drop-down-list k-filter="\'contains\'" k-options="userOptions" required data-bind="value:' + options.field + '"></select>')
              .appendTo(container);
        };
        $scope.expiryEditor = function(container, options) {
            $scope.dateOptions = {
                format: "yyyy.MM.dd HH:mm"
            };
            var editor = $('<input kendo-date-time-picker k-options="dateOptions" data-bind="value:' + options.field + '"/>')
              .appendTo(container).kendoDateTimePicker({
              });
        };

        $scope.mainGrid = {
            dataSource: {
                transport: {
                    read: {
                        url: "/api/nms/lnk/amendment/setting/list",
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
                        data: {"sort": [{field: 'id', dir: 'desc'}]},
                        beforeSend: function (req) {
                            if (JSON.parse(sessionStorage.getItem('currentUser')) !== null) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            }
                            else {
                                $state.go('login');
                            }
                        }
                    },
                    create: {
                        url: __env.apiUrl() + "/api/nms/lnk/amendment/setting/submit",
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
                        complete: function () {
                            $("#parent").data("kendoGrid").dataSource.read();
                        },
                        beforeSend: function (req) {
                            req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                        }
                    },
                    update: {
                        url: __env.apiUrl() + "/api/nms/lnk/amendment/setting",
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
                        beforeSend: function (req) {
                            req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                        },
                        complete: function () {
                            $("#parent").data("kendoGrid").dataSource.read();
                        }
                    },
                    destroy: {
                        url: __env.apiUrl() + "/api/nms/lnk/amendment/setting",
                        contentType: "application/json; charset=UTF-8",
                        type: "DELETE",
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
                            id: { editable: false, nullable: true },
                            userId: { type: "number", validation: { required: true } },
                            user: { editable: false, defaultValue: {} },
                            step: { editable: false, defaultValue: {} },
                            stepId: { type: "number", validation: { required: true } },
                            description: { type: "string" },
                            expiry: {type: "date", validation: { required: true } },
                            useYn: { type: "number", defaultValue: 1 },
                        }
                    }

                },
                pageSize: 20,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: {
                mode: "row",
                extra: false,
                operators: { // redefine the string operators
                    string: {
                        contains: "Агуулсан",
                        startswith: "Эхлэх утга",
                        eq: "Тэнцүү",
                        gte: "Их",
                        lte: "Бага"
                    }
                }
            },
            sortable: true,
            resizable: true,
            pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            },
            columns: [
                {
                    title: "#",
                    headerAttributes: { "class": "columnCenter" },
                    attributes: { "style": "text-align: center;" },
                    template: "#= ++record #",
                    sticky: true,
                    width: 50
                },
                {
                    field: "userId",
                    title: "Хэрэглэгчийн нэр",
                    template: "#= user.username #",
                    filterable: {
                        cell: {
                            operator: "contains",
                            showOperators: false,
                            suggestionOperator: "contains"
                        }
                    },
                    editor: $scope.userEditor,
                    headerAttributes: { style: "text-align: left;" }
                },
                {
                    field: "stepId",
                    title: "Үе шат",
                    template: "#= step.name #",
                    filterable: {
                        cell: {
                            operator: "contains",
                            showOperators: false,
                            suggestionOperator: "contains"
                        }
                    },
                    editor: $scope.stepEditor,
                    headerAttributes: { style: "text-align: left;" }
                },
                {
                    field: "expiry",
                    title: "Дуусах хугацаа",
                    filterable: false,
                    template: "#= kendo.toString(kendo.parseDate(expiry, 'yyyyMMdd'), 'yyyy.MM.dd HH:mm') #",
                    editor: $scope.expiryEditor,
                    headerAttributes: { style: "text-align: left;" }
                },
                {
                    field: "description",
                    title: "Тайлбар",
                    filterable: {
                        cell: {
                            operator: "contains",
                            showOperators: false,
                            suggestionOperator: "contains"
                        }
                    },
                    headerAttributes: { style: "text-align: left;" }
                },
                {
                    field: "useYn",
                    title: "Идэвхитэй эсэх",
                    values: [{"text":"Тийм","value":"1"},{"text":"Үгүй","value":"0"}],
                    width: 100,
                    template: "#if(useYn==1){# <span class='columnCenter'>Тийм</span> #}else{#<span class='columnCenter uk-text-danger'>Үгүй</span> #}#",
                    headerAttributes: { style: "text-align: center;" }
                },
            ],
            dataBinding: function () {
                record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
            },
            editable: "inline",
            height: function () {
                return $(window).height() - 110;
            }
        };

        if (sessionStorage.getItem("buttonData").includes("read")) {
            $scope.mainGrid.toolbar = ["search"];
        }
        if (sessionStorage.getItem("buttonData").includes("create")) {
            $scope.mainGrid.toolbar = [{
                template: "<button class='md-btn custom-btn k-grid-add'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>" }];
        }
        if (sessionStorage.getItem("buttonData").includes("update") || sessionStorage.getItem("buttonData").includes("edit")) {
            $scope.mainGrid.columns.push({
                command: [
                    {
                        template:
                            '<div class="command-container"><a class="grid-btn k-grid-edit"><div class="nimis-icon edit"></div></a><a class="grid-btn k-grid-remove-command"><div class="nimis-icon delete"></div></a><a class="grid-btn k-grid-update"><div class="nimis-icon update"></div></a> <a class="grid-btn k-grid-cancel"><div class="nimis-icon cancel"></div></a></div>',
                    },
                ],
                title: "&nbsp;",
                sticky: true,
                width: 80,
            });
        }
    },
]);
