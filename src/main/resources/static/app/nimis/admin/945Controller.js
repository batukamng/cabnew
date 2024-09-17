angular.module("altairApp").controller("945NmsCtrl", [
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
        $scope.user = JSON.parse(localStorage.getItem("currentUser"));
        $scope.app = {useYn: 1};
        $scope.userType = "company";
        $scope.changeSystemType=function (item){
            $scope.userType = item;
        }
        $scope.dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: __env.apiUrl() + "/api/nms/organization-sign/list",
                    contentType: "application/json; charset=UTF-8",
                    type: "POST",
                    data: {
                        filter: {
                            logic: "and",
                            filters: [{field: "orgId", operator: "eq", value: $scope.user.user.orgId}]
                        }, sort: [{field: "orderId", dir: "asc"}]
                    },
                    beforeSend: function (req) {
                        req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
                    },
                },
                destroy: {
                    url: __env.apiUrl() + "/api/nms/organization-sign",
                    contentType: "application/json; charset=UTF-8",
                    type: "DELETE",
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
                        id: {editable: false, nullable: true},
                        name: {type: "string", validation: {required: true}},
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
                    title: "№",
                    headerAttributes: {class: "columnCenter"},
                    attributes: {style: "text-align: center;"},
                    template: "#= ++record #",
                    sticky: true,
                    width: 50,
                },
                {
                    field: "userType",
                    values:[{"text":"Гүйцэтгэгч","value":"company"},{"text":"Хянагч","value":"supervisor"},{"text":"Захиалагч","value":"consumer"},{"text":"Батлах","value":"approve"}],
                    filterable: {cell: {operator: "contains", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Төрөл",
                },
                {
                    field: "position",
                    filterable: {cell: {operator: "contains", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Албан тушаал",
                },
                {
                    field: "name",
                    filterable: {cell: {operator: "contains", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Нэр",
                },
                {
                    field: "orderId",
                    filterable: {cell: {operator: "contains", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Эрэмбэ",
                    width: 100,
                },
            ],
            dataBinding: function () {
                record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
            },
            editable: "inline",
            height: function () {
                return $(window).height() - 110;
            },
        };

        if (localStorage.getItem("buttonData").includes("read")) {
            $scope.mainGrid.toolbar = ["excel", "search"];
        }
        if (localStorage.getItem("buttonData").includes("create")) {
            $scope.mainGrid.toolbar = [{template: "<button class='md-btn custom-btn' ng-click='add()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>"}];
        }

        if (localStorage.getItem("buttonData").includes("edit")) {
            $scope.mainGrid.columns.push({
                command: [
                    {
                        template:
                            '<div class="flex gap-3"><button class="grid-btn k-grid-edit" ng-click=\'update(dataItem)\'><div class="nimis-icon edit"></div></button><button class="grid-btn k-grid-remove-command"><div class="nimis-icon delete"></div></button></div>',
                    },
                ],
                title: "&nbsp;",
                width: 90,
                sticky: true,
                attributes: {style: "text-align: center;"},
            });
        }

        $scope.update = function (item) {
            $scope.userType = item.userType;
            $scope.app = item;
            UIkit.modal("#modal_add", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true,
            }).show();
        };

        $scope.submit = function (event) {
            $scope.app.orgId = $scope.user.user.orgId;
            if ($scope.app.name == null || $scope.app.position == null) {
                $rootScope.alert(false, "Бүрэн бөглөнө үү.");
            } else {
                UIkit.modal("#modal_loader").show();
                $scope.app.userType=$scope.userType;
                mainService.withResponse("post", __env.apiUrl() + "/api/nms/organization-sign/submit", $scope.app).then(function (data) {
                    if (data.status === 200) {
                        $rootScope.alert(true, "Амжилттай хадгаллаа.");
                        $scope.app = {useYn: 1};
                        $timeout(() => $rootScope.clearForm("validator"));
                        $(".k-grid").data("kendoGrid").dataSource.read();
                        UIkit.modal("#modal_add").hide();
                    } else if (data.status === 400) {
                        $rootScope.alert(false, "Зөвхөн ганц л 'Батлах' төрлийн гарын үсэг бүртгэх боломжтой.");
                    } else {
                        $rootScope.alert(false, "Алдаа гарлаа.");
                    }
                    UIkit.modal("#modal_loader").hide();
                });
            }
        };

        $scope.add = function () {
            $timeout(() => $rootScope.clearForm("validator"));
            $scope.app = {useYn: 1};
            UIkit.modal("#modal_add", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true,
            }).show();
        };
    },
]);
