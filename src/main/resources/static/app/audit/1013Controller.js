angular.module("altairApp")
    .controller("1013NmsCtrl", [
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

            $scope.tezTypeDataSource = commonDataSource.urlDataSource("/api/nms/common/list",
                JSON.stringify({
                    filter: {
                        logic: "and",
                        filters: [{field: "useYn", operator: "eq", value: 1}, {
                            field: "parentId",
                            operator: "isnull",
                            value: false
                        }, {field: "grpCd", operator: "eq", value: "tezType"}]
                    }, sort: [{field: "comCd", dir: "desc"}]
                })
            );
            $scope.selectOptions = {
                placeholder: "Сонгох...",
                dataTextField: "comCdNm",
                dataValueField: "id",
                valuePrimitive: true,
                autoBind: true
            };
            $scope.dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "/api/adt/period/list",
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
                        url: __env.apiUrl() + "/api/adt/period",
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
                            name: {type: "string", validation: {required: true}},
                            abbrNm: {type: "string", validation: {required: true}},
                            nameEn: {type: "string", validation: {required: true}},
                            ggCd: {type: "string", validation: {required: true}},
                            nameNo: {type: "string", validation: {required: true}},
                            ordNo: {type: "number", validation: {required: true}},
                            orgId: {type: "number", validation: {required: true}},
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
                        field: "planYr",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        headerAttributes: {class: "columnHeader"},
                        title: "Тайлант он",
                        width: 150
                    },
                    {
                        field: "name",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        headerAttributes: {class: "columnHeader"},
                        title: "Тайлбар",

                    },
                    {
                        field: "strDt",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        headerAttributes: {class: "columnHeader"},
                        title: "Эхлэх",
                        width: 150
                    },
                    {
                        field: "endDt",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        headerAttributes: {class: "columnHeader"},
                        title: "Дуусах",
                        width: 150
                    },
                    {
                        field: "active",
                        values:[{"text":"Тийм","value":1},{"text":"Үгүй","value":0}],
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        headerAttributes: {class: "columnHeader"},
                        title: "Нээлттэй эсэх",
                        width: 150
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
                $scope.mainGrid.toolbar = [{template: "<button class='md-btn custom-btn' ng-click='add()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>"}, "search"];
            }
            if (sessionStorage.getItem("buttonData").includes("update") || sessionStorage.getItem("buttonData").includes("edit")) {
                $scope.mainGrid.columns.push({
                    command: [
                        {
                            template:
                                '<div class="k-command-cell command-container">' +
                                '<a ng-show="editAble!=dataItem.id" ng-click="update(dataItem)" class="grid-btn"><div class="nimis-icon edit"></div></a>' +
                                '<a ng-show="editAble!=dataItem.id" class="grid-btn k-grid-remove-command"><div class="nimis-icon delete"></div></a>' +
                                '<a ng-show="editAble==dataItem.id" ng-click="editMode(true,dataItem)" class="grid-btn k-grid-save-command"><div class="nimis-icon update"></div></a> ' +
                                '<a ng-show="editAble==dataItem.id" ng-click="editMode(true,dataItem)"  class="grid-btn k-grid-cancel-command"><div class="nimis-icon cancel"></div></a>' +
                                '</div>',
                        },
                    ],
                    title: "&nbsp;",
                    width: 80,
                });
            }

            var modalForm = UIkit.modal("#modal_form", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true
            });

            $scope.dataItem = {};
            $scope.add = function () {
                $scope.dataItem = {useYn: 1,active: 1};
                modalForm.show();
                $timeout(() => $rootScope.clearForm("validator"));
            };
            $scope.update = function (item) {
                $scope.dataItem = item;
                modalForm.show();
            };

            $scope.yearSelectorOptions = {
                start: "month",
                depth: "month",
                format: "dd-MM-yyyy",
            };

            $scope.fromDateChanged = function () {
                $scope.minDate = new Date($scope.dataItem.strDt);
            };
            $scope.toDateChanged = function () {
                $scope.maxDate = new Date($scope.dataItem.endDt);
            };
            $scope.maxDate = new Date();
            $scope.minDate = new Date();


            $scope.formSubmit = function (type) {
                var validator = $("#validator").kendoValidator().data("kendoValidator");
                if (validator.validate()) {
                    var method = "post";
                    if ($scope.dataItem.id !== undefined && $scope.dataItem.id !== null) method = "put";
                    mainService.withdata(method, "/api/adt/period", $scope.dataItem).then(function (data) {
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
