angular.module("altairApp")
    .controller("1011AdtCtrl", [
        "$rootScope",
        "$state",
        "$scope",
        "$timeout",
        "mainService",
        "commonDataSource",
        "orgTypes",
        "repTypes",
        "sweet",
        "Upload",
        "__env",
        function ($rootScope, $state, $scope, $timeout, mainService, commonDataSource, orgTypes, repTypes, sweet, Upload, __env) {
            $scope.user = JSON.parse(localStorage.getItem("currentUser")).user;
            $("#header_main").attr("style", "filter: none !important;padding: 8px 25px");
            $scope.dataItem = {};
            $scope.orgTypeDataSource = orgTypes;

            $scope.reportTypeDataSource = commonDataSource.urlPageDataSource("/api/adt/report/list",
                JSON.stringify({
                    filter: {
                        logic: "and",
                        filters: [{field: "useYn", operator: "eq", value: 1}]
                    }, sort: [{field: "name", dir: "asc"}]
                }),100
            );

            $scope.dropReportOptions = {
                dataTextField: "name",
                dataValueField: "id",
                placeholder: "Сонгох...",
                template:"<span class='w-full'><span ng-bind='dataItem.name'></span><span style='float: right' ng-bind='dataItem.code'></span></span>",
                valuePrimitive: true,
                autoBind: true
            };

            $scope.accountDataSource = commonDataSource.urlDataSource("/api/adt/account/list", JSON.stringify({
                filter: {
                    logic: "and",
                    filters: [{field: "useYn", operator: "eq", value: 1}]
                }, sort: [{field: "name", dir: "asc"}]
            }));

            $scope.directionDataSource = commonDataSource.urlDataSource("/api/adt/direction/list", JSON.stringify({
                filter: {
                    logic: "and",
                    filters: [{field: "useYn", operator: "eq", value: 1},{field: "parentId", operator: "isnull", value: true}]
                }, sort: [{field: "name", dir: "asc"}]
            }));
            $scope.subDirDataSource = commonDataSource.urlDataSource("/api/adt/direction/list", JSON.stringify({
                filter: {
                    logic: "and",
                    filters: [{field: "useYn", operator: "eq", value: 1}]
                }, sort: [{field: "name", dir: "asc"}]
            }));
            $scope.detDirDataSource = commonDataSource.urlDataSource("/api/adt/direction/list", JSON.stringify({
                filter: {
                    logic: "and",
                    filters: [{field: "useYn", operator: "eq", value: 1}]
                }, sort: [{field: "name", dir: "asc"}]
            }));

            $scope.subDropDownOptions = {
                valueTemplate: "<span style='width:100px;margin-right:10px;' class='uk-text-right'>{{dataItem.accCode}}</span><span>#=name#</span>",
                template: "<span style='width:100px;margin-right:10px;' class='uk-text-right'>{{dataItem.accCode}}</span><span>#=name#</span>",
            };

            $scope.appDataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: __env.apiUrl() + "/api/adt/acc/dir/list",
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
                        data: {
                            custom: {
                                logic: "and",
                                filters: [
                                    {field: "useYn", operator: "eq", value: 1},
                                ],
                            },
                        },
                        beforeSend: function (req) {
                            if (JSON.parse(localStorage.getItem("currentUser")) != null) {
                                req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
                            } else {
                                $state.go("login");
                                $rootScope.$broadcast("LogoutSuccessful");
                            }
                        },
                    },
                    destroy: {
                        url: __env.apiUrl() + "/api/adt/acc/dir",
                        contentType: "application/json; charset=UTF-8",
                        type: "DELETE",
                        beforeSend: function (req) {
                            req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                        },
                        complete: function (e) {
                            $(".k-grid").data("kendoGrid").dataSource.read();
                        }
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
                        }
                    }
                },
                pageSize: 100,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
            });
            $scope.mainGrid = {
                sortable: true,
                resizable: true,
                persistSelection: true,
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5,
                },
                filterable: {
                    mode: "row",
                    extra: false,
                    cell: {
                        operator: "eq",
                    },
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
                        field: "orgTypeNm",
                        width: 150,
                        title: "Байгууллагын төрөл",
                        filterable: {cell: {operator: "eq", suggestionOperator: "contains", showOperators: false}}
                    },
                    {
                        field: "reportNm",
                        width: 100,
                        title: "Тайлан",
                        filterable: {cell: {operator: "eq", suggestionOperator: "contains", showOperators: false}}
                    },
                    {
                        field: "reportTypeNm",
                        width: 100,
                        title: "Тайлангийн нэр",
                        filterable: {cell: {operator: "eq", suggestionOperator: "contains", showOperators: false}}
                    },
                    {
                        field: "accCode",
                        width: 120,
                        title: "Код",
                        filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}}
                    },
                    {
                        field: "catNm",
                        title: "Ангилал",
                        width: 120,
                        filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}}
                    },
                    {
                        field: "accNm",
                        title: "Нэр",
                        width: 120,
                        filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}}
                    },
                    {
                        field: "parentCode",
                        headerAttributes: {class: "columnCenter"},
                        title: "Толгой данс",
                        width: 120,
                        filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}}
                    },
                    {
                        field: "dirNm",
                        headerAttributes: {class: "columnCenter"},
                        title: "Эрсдлийн ерөнхий чиглэл",
                        width: 120,
                        filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}}
                    },
                    {
                        field: "subDirNm",
                        headerAttributes: {class: "columnCenter"},
                        title: "Эрсдлийн дэд чиглэл",
                        width: 120,
                        filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}}
                    },
                   /* {
                        field: "detDirNm",
                        headerAttributes: {class: "columnCenter"},
                        title: "Эрсдлийн нарийвчилсан чиглэл",
                        width: 120,
                        filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}}
                    },*/
                    {
                        field: "riskCatNm",
                        headerAttributes: {class: "columnCenter"},
                        title: "Эрсдэлийн ангилал",
                        width: 120,
                        filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}}
                    },
                    {
                        field: "confTypeNm",
                        headerAttributes: {class: "columnCenter"},
                        title: "Батламж мэдэгдлийн түвшинд",
                        width: 120,
                        filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}}
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

            if (localStorage.getItem("buttonData").includes("create")) {
                $scope.mainGrid.toolbar = [{template: "<button class='md-btn custom-btn' ng-click='add()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>"}];
            }
            if (localStorage.getItem("buttonData").includes("update") || localStorage.getItem("buttonData").includes("edit")) {
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
                    sticky: true,
                    title: "&nbsp;",
                    width: 80,
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
            $scope.editAble = 0;

            $scope.add = function () {
                $scope.dataItem = {accType: 1, useYn: 1};
                modalForm.show();
                $timeout(() => $rootScope.clearForm("validator"));
            };
            $scope.update = function (item) {
                $scope.dataItem = {};
             //   $timeout(() => $rootScope.clearForm("validator"));
          /*      $scope.accountDataSource.filter({
                    logic: "and",
                    sort: [{field: "id", dir: "asc"}],
                    filters: [{field: "id", operator: "eq", value: item.accId}],
                });
                $scope.reportTypeDataSource.filter({
                    logic: "and",
                    sort: [{field: "id", dir: "asc"}],
                    filters: [{field: "id", operator: "eq", value: item.reportId}],
                });*/
                $timeout(function () {
                    $scope.dataItem = item;
                    modalForm.show();
                }, 100);
            };

            $scope.formSubmit = function (type) {
                var validator = $("#validator").kendoValidator().data("kendoValidator");
                if (validator.validate()) {
                    var method = "post";
                    if ($scope.dataItem.id !== undefined && $scope.dataItem.id !== null) method = "put";
                    mainService.withdata(method, "/api/adt/acc/dir", $scope.dataItem).then(function (data) {
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
