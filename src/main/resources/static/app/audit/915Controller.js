angular.module("altairApp")
    .controller("915NmsCtrl", [
        "$rootScope",
        "$state",
        "$scope",
        "$timeout",
        "mainService",
        "commonDataSource",
        "governors",
        "Upload",
        "$http",
        "__env",
        function ($rootScope, $state, $scope, $timeout, mainService, commonDataSource,governors, Upload, $http, __env) {
            $scope.user = JSON.parse(sessionStorage.getItem("currentUser")).user;
            $scope.menuData = JSON.parse(sessionStorage.getItem("menuData"));
            $scope.governors=[];
            angular.forEach(governors, function(value, key) {
                $scope.governors.push({"text":value.name,"value":value.id});
            });
            $scope.tezTypeDataSource = commonDataSource.urlDataSource("/api/adt/governor/list",
                JSON.stringify({
                    filter: {
                        logic: "and",
                        filters: [{field: "useYn", operator: "eq", value: 1}]
                    }, sort: [{field: "id", dir: "desc"}]
                })
            );
            $scope.selectOptions = {
                placeholder: "Сонгох...",
                dataTextField: "name",
                dataValueField: "id",
                valuePrimitive: true,
                autoBind: true
            };
            $scope.dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "/api/adt/central/budget/list",
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
                        url: __env.apiUrl() + "/api/adt/central/budget",
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
         /*   $scope.dataSource.filter({
                logic: "and",
                sort: [{field: "id", dir: "asc"}],
                filters: [{field: "useYn", operator: "eq", value: 1}],
            });*/

            $scope.mainGrid = {
              /*  filterable: {
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
                },*/
                filterable: {
                    extra: false,
                    operators: {
                        string: {
                            contains: "Агуулсан",
                            startswith: "Эхлэх утга",
                            eq: "Тэнцүү",
                            gte: "Их",
                            lte: "Бага",
                        },
                    }
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
                        headerAttributes: {class: "columnCenter"},
                        attributes: {style: "text-align: center;"},
                        template: "#= ++record #",
                        sticky: true,
                        width: 50,
                    },
                    {
                        field: "tezRegNo",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        headerAttributes: {class: "columnHeader"},
                        title: "ТЕЗ Регистр",
                        width: 150
                    },
                    {
                        field: "tezName",
                        title: "Төсвийн ерөнхийлөн захирагч",
                        filterable: {
                            multi: true,
                            dataSource: $scope.governors,
                            itemTemplate: function(e) {
                                if (e.field == "all") {
                                    //handle the check-all checkbox template
                                    return "<div id='filterDropdown'><label><strong><input type='checkbox' />#= all#</strong></label></div>";
                                } else {
                                    //handle the other checkboxes
                                    return "<span style='display: block;overflow-x: hidden;'><label><input type='checkbox' name='" + e.field + "' value='#=text#'/><span>#= text #</span></label></span>"
                                }
                            }
                        },
                    },

                    {
                        field: "name",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        headerAttributes: {class: "columnHeader"},
                        title: "Төсвийн төвлөрүүлэн захирагч"
                    },
                    {
                        field: "shortName",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        headerAttributes: {class: "columnHeader"},
                        title: "Товчлол"
                    },
                    {
                        field: "lpReg",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        headerAttributes: {class: "columnHeader"},
                        title: "ТТЗ Регистр",
                        width: 150
                    },

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
                                '<div class="flex gap-3"><button style="margin-left: 10px;" class="grid-btn k-grid-edit" ng-click=\'update(dataItem)\'><div class="nimis-icon edit"></div></button><button class="grid-btn k-grid-remove-command" ng-click=\'deleteData(dataItem)\'><div class="nimis-icon delete"></div></button></div>',
                        },
                    ],
                    title: "&nbsp;",
                    sticky: true,
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
                $scope.dataItem = {useYn: 1};
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
                    mainService.withdata(method, "/api/adt/central/budget", $scope.dataItem).then(function (data) {
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
