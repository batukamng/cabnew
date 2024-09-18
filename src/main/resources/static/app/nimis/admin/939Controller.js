angular.module("altairApp").controller("939NmsCtrl", [
    "$rootScope",
    "$state",
    "$scope",
    "$timeout",
    "__env",
    "mainService",
    "commonDataSource",
    function ($rootScope, $state, $scope, $timeout, __env, mainService, commonDataSource) {
        $scope.roles = {};
        $scope.levelType = "main";
        $scope.menuData = JSON.parse(sessionStorage.getItem("menuData"));
        $scope.showAdmin = true;
        $scope.showOrgAdmin = true;
        $scope.showSupervisor = true;
        $scope.showExecutor = true;
        $scope.showMof = true;
        $scope.showOrg = true;
        $scope.showRelation = true;

        $scope.roleDataSource = commonDataSource.urlDataSource(
            "/api/nms/role/list",
            JSON.stringify({
                filter: {
                    logic: "and",
                    filters: [{field: "useYn", operator: "eq", value: 1}],
                },
                sort: [{field: "name", dir: "asc"}],
            })
        );
        mainService
            .withdata(
                "post",
                "/api/nms/user/level/list",
                JSON.stringify({
                    filter: {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1}]},
                    sort: [{field: "name", dir: "asc"}],
                    take: 60,
                    skip: 0,
                    page: 1,
                    pageSize: 60,
                })
            )
            .then(function (data) {
                $scope.levelDataSource = data.data;
            });
        mainService
            .withdata(
                "post",
                "/api/nms/role/list",
                JSON.stringify({
                    filter: {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1}]},
                    sort: [{field: "name", dir: "asc"}],
                    take: 60,
                    skip: 0,
                    page: 1,
                    pageSize: 60,
                })
            )
            .then(function (data) {
                $scope.roleDataSource = data.data;
            });
        $scope.roleEditor = function (container, options) {
            var editor = $('<input kendo-multi-select  k-data-text-field="\'name\'" k-data-value-field="\'id\'" k-data-source="roleDataSource" data-bind="value:' + options.field + '"/>').appendTo(
                container
            );
        };

        $scope.selectOptions = {
            placeholder: "...",
            dataTextField: "name",
            dataValueField: "id",
            //  valuePrimitive: true,
            autoBind: false,
            dataSource: $scope.roleDataSource,
        };

        var modalForm = UIkit.modal("#modal_form", {
            modal: false,
            keyboard: false,
            bgclose: false,
            center: true,
        });

        $scope.dataItem = {};
        $scope.add = function (type) {
            $state.go("restricted.nms.946", {id: 0});
        };

        $scope.update = function (item) {
            $state.go("restricted.nms.946", {id: item.id});
        };

        $scope.dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: __env.apiUrl() + "/api/nms/user/level/list",
                    contentType: "application/json; charset=UTF-8",
                    type: "POST",
                    data: {
                        filter: {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1}]},
                        sort: [{field: "id", dir: "asc"}]
                    },
                    beforeSend: function (req) {
                        req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
                    },
                },
                create: {
                    url: __env.apiUrl() + "/api/nms/user/level",
                    contentType: "application/json; charset=UTF-8",
                    type: "POST",
                    beforeSend: function (req) {
                        req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
                    },
                    complete: function (e) {
                        $(".k-grid").data("kendoGrid").dataSource.read();
                    },
                },
                update: {
                    url: __env.apiUrl() + "/api/nms/user/level",
                    contentType: "application/json; charset=UTF-8",
                    type: "PUT",
                    beforeSend: function (req) {
                        req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
                    },
                    complete: function (e) {
                        $(".k-grid").data("kendoGrid").dataSource.read();
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
                        id: {editable: false, nullable: true},
                        name: {type: "string", validation: {required: true}},
                        parentId: {type: "number", defaultValue: 0},
                        orderId: {type: "number"},
                        url: {type: "string"},
                        comCd: {type: "string"},
                        uIcon: {type: "string"},
                        langKey: {type: "string"},
                        useYn: {type: "int"},
                    },
                },
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
                pageSizes: ["All", 20, 50],
                refresh: true,
                buttonCount: 5,
                message: {
                    empty: "No Data",
                    allPages: "All",
                },
            },
            columns: [
                {
                    title: "#",
                    headerAttributes: {class: "checkbox-align"},
                    attributes: {style: "text-align: center;"},
                    template: "#= ++record #",
                    sticky: true,
                    width: 50,
                },
                {
                    field: "name",
                    filterable: {cell: {operator: "contains", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Нэр",
                },
           /*     {
                    field: "code",
                    template: "#if(level!=null){# #=level.level.comCdNm# #}#",
                    filterable: {cell: {operator: "contains", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Төрөл",
                }*/
            ],
            dataBinding: function () {
                record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
            },
            editable: "inline",
            height: function () {
                if ($scope.menuData.pageType === 0) {
                    return $(window).height() - 160;
                }
                return $(window).height() - 115;
            }
        };

        if (sessionStorage.getItem("buttonData").includes("read")) {
            $scope.mainGrid.toolbar = ["excel", "search"];
        }
        if (sessionStorage.getItem("buttonData").includes("create")) {
            $scope.mainGrid.toolbar = [{template: "<button class='md-btn custom-btn' ng-click='add()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>"}];
        }
        if (sessionStorage.getItem("buttonData").includes("update") || sessionStorage.getItem("buttonData").includes("edit")) {
            $scope.mainGrid.columns.push({
                command: [
                    {
                        template:
                            '<div style="margin-left: 10px;" class="flex gap-3"><button class="grid-btn k-grid-edit" ng-click=\'update(dataItem)\'><div class="nimis-icon edit"></div></button><button class="grid-btn k-grid-remove-command" ng-click=\'deleteLevel(dataItem)\'><div class="nimis-icon delete"></div></button></div>',
                    },
                ],
                title: "&nbsp;",
                width: 90,
            });
        }
        $scope.disableAll = function (item, data) {
            if (item == "board") {
                $scope.dataItem.hasTez = 0;
                $scope.dataItem.hasAmg = 0;
                $scope.dataItem.hasSoum = 0;
                $scope.dataItem.hasEco = 0;
                $scope.dataItem.hasBranch = 0;
                $scope.dataItem.orgAdmin = 0;
            }

            if (item == "admin") {
                if (data == 1) {
                    $scope.dataItem.hasTez = 0;
                    $scope.dataItem.hasAmg = 0;
                    $scope.dataItem.hasSoum = 0;
                    $scope.dataItem.hasEco = 0;
                    $scope.dataItem.hasBranch = 0;
                    $scope.dataItem.supervisor = 0;
                    $scope.dataItem.tez = 0;
                    $scope.dataItem.executor = 0;
                    $scope.dataItem.org = 0;
                    $scope.dataItem.amg = 0;
                    $scope.dataItem.soum = 0;
                    $scope.dataItem.board = 0;
                    $scope.dataItem.mof = 0;
                    $scope.dataItem.board = 0;

                    $scope.showOrgAdmin = false;
                    $scope.showSupervisor = false;
                    $scope.showExecutor = false;
                    $scope.showMof = false;
                    $scope.showOrg = false;
                } else {
                    $scope.showOrgAdmin = true;
                    $scope.showSupervisor = true;
                    $scope.showExecutor = true;
                    $scope.showMof = true;
                    $scope.showOrg = true;
                }
            }
        };

        /*
            Хянагч YES бол Гүйцэтгэгч & Байгууллага сонгох нь NO байна
            Гүйцэтгэгч YES бол Байгууллага YES, Хянагч NO байна
            Байгууллага YES, Хянагч & Гүйцэтгэгч NO байж болно
    */
        $scope.disableCheck = function (item, data) {
            if (item == "supervisor") {
                if (data == 1) {
                    $scope.dataItem.executor = 0;
                    $scope.dataItem.org = 0;
                    $scope.dataItem.admin = 0;
                    $scope.dataItem.orgAdmin = 0;
                    $scope.dataItem.mof = 0;

                    $scope.showAdmin = false;
                    $scope.showOrgAdmin = false;
                    $scope.showExecutor = false;
                    $scope.showMof = false;
                    $scope.showRelation = false;
                } else {
                    $scope.showAdmin = true;
                    $scope.showOrgAdmin = true;
                    $scope.showExecutor = true;
                    $scope.showMof = true;
                    $scope.showRelation = true;
                }
            }

            if (item == "executor") {
                if (data == 1) {
                    $scope.dataItem.supervisor = 0;
                    $scope.dataItem.org = 1;
                    $scope.dataItem.admin = 0;
                    $scope.dataItem.orgAdmin = 0;
                    $scope.dataItem.mof = 0;

                    $scope.showAdmin = false;
                    $scope.showOrgAdmin = false;
                    $scope.showExecutor = true;
                    $scope.showSupervisor = false;
                    $scope.showMof = false;
                    $scope.showRelation = false;
                    $scope.showOrg = true;
                } else {
                    $scope.dataItem.org = 0;
                    $scope.showAdmin = true;
                    $scope.showOrgAdmin = true;
                    $scope.showExecutor = true;
                    $scope.showSupervisor = true;
                    $scope.showMof = true;
                    $scope.showRelation = true;
                }
            }

            if (item == "org") {
                if (data == 1) {
                    $scope.dataItem.executor = 0;
                } else {
                }
            }

            if (item == "orgAdmin") {
                if (data == 1) {
                    $scope.dataItem.admin = 0;
                    $scope.dataItem.executor = 0;
                    $scope.dataItem.supervisor = 0;
                    $scope.dataItem.mof = 0;

                    $scope.showAdmin = false;
                    $scope.showSupervisor = false;
                    $scope.showExecutor = false;
                    $scope.showMof = false;
                    $scope.showOrg = true;
                } else {
                    $scope.showAdmin = true;
                    $scope.showSupervisor = true;
                    $scope.showExecutor = true;
                    $scope.showMof = true;
                }
            }

            if (item == "mof") {
                if (data == 1) {
                    $scope.dataItem.supervisor = 0;
                    $scope.dataItem.org = 0;
                    $scope.dataItem.admin = 0;
                    $scope.dataItem.orgAdmin = 0;
                    $scope.dataItem.mof = 1;

                    $scope.showAdmin = false;
                    $scope.showOrgAdmin = false;
                    $scope.showExecutor = false;
                    $scope.showSupervisor = false;
                    $scope.showMof = true;
                    $scope.showRelation = false;
                    $scope.showOrg = false;
                } else {
                    $scope.dataItem.mof = 0;
                    $scope.showAdmin = true;
                    $scope.showOrgAdmin = true;
                    $scope.showExecutor = true;
                    $scope.showSupervisor = true;
                    $scope.showOrg = true;
                    $scope.showRelation = true;
                }
            }
        };

        $scope.deleteLevel = function (item) {
            mainService.withdata("post", __env.apiUrl() + "/api/nms/user/level/setInactive", item).then(function (data) {
                $rootScope.alert(true, "Устгах үйлдэл амжилттай боллоо.");
                $(".k-grid").data("kendoGrid").dataSource.read();
            });
        };
    },
]);
