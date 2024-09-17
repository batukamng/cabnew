angular.module("altairApp").controller("920NmsCtrl", [
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
        $scope.menuData = JSON.parse(localStorage.getItem("menuData"));

        $scope.dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: __env.apiUrl() + "/api/nms/user/list",
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
                    url: __env.apiUrl() + "/api/nms/user/delete",
                    contentType: "application/json; charset=UTF-8",
                    beforeSend: function (req) {
                        req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
                    },
                    complete: function (e) {
                        $(".k-grid").data("kendoGrid").dataSource.read();
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
                        lutRoles: [],
                        roles: [],
                        amgName: {type: "string", editable: false},
                        sumName: {type: "string", editable: false},
                        orgId: {type: "number", defaultValue: 0},
                        userType: {type: "number", defaultValue: 2},
                        useYn: {type: "number", defaultValue: 1},
                        organization: {nullable: true},
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
            // toolbar: ["excel"],
            columns: [
                {
                    title: "#",
                    headerAttributes: {class: "checkbox-align"},
                    attributes: {style: "text-align: center;"},
                    template: "#= ++record #",
                    width: 50,
                },
                {
                    field: "lvlName",
                    filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                    title: "Түвшин",
                },
                {
                    field: "typeName",
                    filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                    title: "Төрөл",
                },
                {
                    field: "orgName",
                    filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                    title: "Байгууллага",
                },
                {
                    field: "name",
                    filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Нэр",
                },
                {
                    field: "phone",
                    filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Утасны дугаар",
                },
                {
                    field: "email",
                    filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "И-мэйл",
                    width: 150,
                },
                {
                    field: "username",
                    filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Нэвтрэх нэр",
                },
                {
                    field: "roleName",
                    filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Эрх",
                },
                {
                    field: "createdAt",
                    filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Үүсгэсэн огноо",
                },
                {
                    field: "createdName",
                    filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Үүсгэсэн хэрэглэгч",
                }
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
                return $(window).height() - 115;
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
                            '<div class="flex justify-center gap-3"><button class="grid-btn k-grid-edit" ng-click=\'update(dataItem)\'><div class="nimis-icon edit"></div></button><button class="grid-btn k-grid-remove-command" ng-click=\'deleteLevel(dataItem)\'><div class="nimis-icon delete"></div></button></div>',
                    },
                ],
                title: "&nbsp;",
                width: 80,
            });
        }

        $scope.dataItem={};
        $scope.add = function () {
            $("#main_content").hide();
            $("#formEditSpecial").show();
            UIkit.modal('#modal_loader').show();
            $scope.$broadcast("editUser", 0,0);
        };

        $scope.update = function (item) {
            $scope.dataItem=item;
            $rootScope.specialItem=item;
            $("#main_content").hide();
            $("#formEditSpecial").show();
            UIkit.modal('#modal_loader').show();
            $scope.$broadcast("editUser", item.id,item.speId);
        };
    },
]);
