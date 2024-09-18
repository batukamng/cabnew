angular.module("altairApp")
    .controller("1016AdtCtrl", [
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
            $scope.menuData = JSON.parse(sessionStorage.getItem("menuData"));

            $scope.parentDataSource = commonDataSource.urlDataSource("/api/adt/question/list",
                JSON.stringify({
                    filter: {
                        logic: "and",
                        filters: [{field: "useYn", operator: "eq", value: 1}, {
                            field: "parentId",
                            operator: "isnull",
                            value: true
                        }]
                    }, sort: [{field: "id", dir: "desc"}]
                })
            );

            $scope.dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "/api/adt/question/list",
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
                        url: __env.apiUrl() + "/api/adt/question",
                        contentType: "application/json; charset=UTF-8",
                        type: "DELETE",
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
                            title: {type: "string", validation: {required: true}},
                            code: {type: "string", validation: {required: true}},
                            orgType: {type: "string", validation: {required: true}},
                            parentId: {type: "number", validation: {required: true}},
                            useYn: {type: "number", defaultValue: 1},
                        },
                    },
                },
                pageSize: 20,
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
                excel: {
                    fileName: "Projects.xlsx",
                    allPages: true,
                    filterable: true,
                },
                sortable: true,
                resizable: true,
                reorderable: true,
                pageable: {
                    pageSizes: [10, 50, 100, "All"],
                    refresh: true,
                    pageSize: 10,
                    buttonCount: 5,
                },
                columns: [
                    {
                        title: "#",
                        headerAttributes: {
                            "class": "checkbox-align",
                        },
                        attributes: {style: "text-align: center;"},
                        template: "#= ++record #",
                        width: 50,
                    },
                    {
                        field: "orgType",
                        values:[{"text":"Төрийн","value":"1"},{"text":"Хувийн","value":"0"}],
                        template: "<span ng-bind=\"dataItem.orgType==1?'Төрийн':'Хувийн'\"></span>",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        headerAttributes: {class: "columnHeader"},
                        title: "Байгууллагын төрөл",
                    },
                    {
                        field: "code",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        headerAttributes: {class: "columnHeader"},
                        title: "Код"
                    },
                    {
                        field: "title",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        headerAttributes: {class: "columnHeader"},
                        title: "Гарчиг"
                    },
                    {
                        field: "parentId",
                        dataTextField: "title", dataValueField: "id", dataSource:$scope.parentDataSource,
                        template: "<span ng-bind=\"dataItem.parentId!=null?dataItem.question.title:'-'\"></span>",
                        filterable: {cell: {operator: "eq", showOperators: false}},
                        headerAttributes: {class: "columnHeader"},
                        title: "Бүлэг"
                    }
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
                                '<div class="flex gap-3" style="margin-left:10px;"><button class="grid-btn k-grid-edit" ng-click=\'update(dataItem)\'><div class="nimis-icon edit"></div></button><button class="grid-btn k-grid-remove-command" ng-click=\'deleteData(dataItem)\'><div class="nimis-icon delete"></div></button></div>',
                        },
                    ],
                    title: "&nbsp;",
                    sticky: true,
                    width: 90,
                });
            }

            $scope.selectOptions = {
                placeholder: "Сонгох...",
                dataTextField: "title",
                dataValueField: "id",
                valuePrimitive: true,
                autoBind: true
            };

            var modalForm = UIkit.modal("#modal_form", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true
            });

            $scope.dataItem = {};
            $scope.add = function () {
                $scope.dataItem = {useYn: 1,mainType:1,orgType:1};
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
                    if ($scope.dataItem.id !== undefined && $scope.dataItem.id !== null) method = "put";
                    mainService.withdata(method, "/api/adt/question", $scope.dataItem).then(function (data) {
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
