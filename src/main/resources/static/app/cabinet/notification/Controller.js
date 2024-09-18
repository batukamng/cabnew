angular.module("altairApp")
    .controller("notificationCtrl", [
        "$rootScope",
        "$scope",
        "$state",
        "$timeout",
        "sweet",
        "__env",
        "commonDataSource",
        "mainService",
        function ($rootScope, $scope, $state, $timeout, sweet, __env, commonDataSource, mainService) {
            $scope.user = JSON.parse(sessionStorage.getItem("currentUser")).user;
            $scope.menuData = JSON.parse(sessionStorage.getItem("menuData"));

            $scope.channelDataSource = commonDataSource.urlDataSource("/api/admin/channel/list",
                JSON.stringify({ filter: { logic: "and", filters: [{ field: "useYn", operator: "eq", value: 1 }] }, sort: [{ field: "id", dir: "asc" }] })
            );

            $scope.dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: function (e) {
                            return __env.apiUrl() + "/api/notification/list";
                        },
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
                        data: {sort: [{field: "id", dir: "desc"}]},
                        beforeSend: function (req) {
                            if (JSON.parse(sessionStorage.getItem("currentUser")) != null) {
                                req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
                            } else {
                                $state.go("login");
                                $rootScope.$broadcast("LogoutSuccessful");
                            }
                        },
                    },
                    destroy: {
                        url: __env.apiUrl() + "/api/notification",
                        contentType: "application/json; charset=UTF-8",
                        type: "DELETE",
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
                            id: {type: "number", nullable: true},
                            sponsorOrg: {editable: false},
                            checkOrg: {editable: false},
                            pipAmt: {type: "number"},
                        },
                    },
                },
                pageSize: 10,
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true,
            });
            $scope.dataSource.filter({
                logic: "and",
                sort: [{field: "id", dir: "asc"}],
                filters: [{field: "useYn", operator: "eq", value: 1}],
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
                    pageSizes: [10, 50, 100],
                    refresh: true,
                    pageSize: 10,
                    buttonCount: 5,
                },
                columns: [
                    {
                        title: "#",
                        headerAttributes: {class: "columnCenter"},
                        attributes: {style: "text-align: center;"},
                        template: "#= ++record #",
                        sticky: true,
                        width: 50,
                    },
                    {
                        field: "channelName",
                        title: "Төрөл",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                    },
                    {
                        field: "title",
                        title: "Гарчиг",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                    },
                    {
                        field: "body",
                        title: "Агуулга",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                    },
                    {
                        field: "createdAt",
                        title: "Ирсэн огноо",
                        width: 150,
                        filterable: {cell: {operator: "contains", showOperators: false}},
                    }
                ],
                dataBinding: function () {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                },
                editable: false,
                height: function () {
                    if ($scope.menuData.pageType === 0) {
                        return $(window).height() - 160;
                    }
                    return $(window).height() - 110;
                },
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
                                '<div class="flex gap-3"><button style="margin-left: 10px" class="grid-btn k-grid-edit" ng-click=\'update(dataItem)\'><div class="nimis-icon edit"></div></button><button class="grid-btn k-grid-remove-command" ng-click=\'deleteLevel(dataItem)\'><div class="nimis-icon delete"></div></button></div>',
                        },
                    ],
                    title: "&nbsp;",
                    width: 90,
                });
            }

            var modalForm = UIkit.modal("#modal_form", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true,
                width: 600,
            });

            $scope.dataItem = {};
            $scope.add = function () {
                $scope.dataItem = {code:'01',useYn: 1};
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
                    mainService.withdata(method, "/api/notification/submit", $scope.dataItem).then(function (data) {
                        $rootScope.alert(true, "Амжилттай хадгаллаа.");
                        if (type === 1) {
                            modalForm.hide();
                        }
                        $timeout(() => $rootScope.clearForm("validator"));
                        $(".k-grid").data("kendoGrid").dataSource.read();
                    });
                }
            };

        },
    ]);
