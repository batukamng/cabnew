angular.module("altairApp")
    .controller("1004AdtCtrl", [
        "$rootScope",
        "$state",
        "$scope",
        "$timeout",
        "mainService",
        "commonDataSource",
        "sweet",
        "Upload",
        "__env",
        function ($rootScope, $state, $scope, $timeout, mainService, commonDataSource, sweet, Upload, __env) {
            $scope.user = JSON.parse(localStorage.getItem("currentUser")).user;
            $("#header_main").attr("style", "filter: none !important;padding: 8px 25px");
            $scope.dirType=1;

            $scope.confirmationStatementDataSource = commonDataSource.urlDataSource("/api/nms/common/list",
                JSON.stringify({
                    filter: {
                        logic: "and",
                        filters: [{field: "useYn", operator: "eq", value: 1}, {
                            field: "parentId",
                            operator: "isnull",
                            value: false
                        }, {field: "grpCd", operator: "eq", value: "confirmationStatement"}]
                    }, sort: [{field: "orderId", dir: "asc"}]
                })
            );
            $scope.noticeEditor = function (container, options) {
                options.field = "notices";
                if (options.model.noticeIds != null && options.model.noticeIds.length > 0 && options.model.noticeIds.includes(',')) {
                    options.model.notices = options.model.noticeIds.split(',');
                } else if (options.model.noticeIds != null && options.model.noticeIds.length > 0) {
                    options.model.notices = [options.model.noticeIds];
                } else {
                    options.model.notices = [];
                }
                $scope.noticeOptions = {
                    dataTextField: "comCdNm",
                    dataValueField: "id",
                    placeholder: "Сонгох...",
                    valuePrimitive: true,
                    autoBind: true,
                    dataSource: $scope.confirmationStatementDataSource
                };
                var editor = $('<select  kendo-multi-select required k-options="noticeOptions" data-bind="value:' + options.field + '"></select>')
                    .appendTo(container);
            };
            $scope.procedureDataSource = commonDataSource.urlDataSource("/api/nms/common/list",
                JSON.stringify({
                    filter: {
                        logic: "and",
                        filters: [{field: "useYn", operator: "eq", value: 1}, {
                            field: "parentId",
                            operator: "isnull",
                            value: false
                        }, {field: "grpCd", operator: "eq", value: "procedure"}]
                    }, sort: [{field: "orderId", dir: "asc"}]
                })
            );
            $scope.procedureEditor = function (container, options) {
                options.field = "procedures";
                if (options.model.procedureIds != null && options.model.procedureIds.length > 0 && options.model.procedureIds.includes(',')) {
                    options.model.procedures = options.model.procedureIds.split(',');
                } else if (options.model.procedureIds != null && options.model.procedureIds.length > 0) {
                    options.model.procedures = [options.model.procedureIds];
                } else {
                    options.model.procedures = [];
                }

                $scope.selectPriOptions = {
                    dataTextField: "comCdNm",
                    dataValueField: "id",
                    placeholder: "Сонгох...",
                    valuePrimitive: true,
                    autoBind: true,
                    dataSource: $scope.procedureDataSource
                };
                var editor = $('<select  kendo-multi-select required k-options="selectPriOptions" data-bind="value:' + options.field + '"></select>')
                    .appendTo(container);
            };

            $scope.childDirectionDataSource = commonDataSource.urlDataSource("/api/adt/direction/list",
                JSON.stringify({
                    filter: {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1}]},
                    sort: [{field: "id", dir: "asc"}]
                })
            );


            $scope.orgTypeDataSource = commonDataSource.urlDataSource("/api/nms/common/list",
                JSON.stringify({
                    filter: {
                        logic: "and",
                        filters: [{field: "useYn", operator: "eq", value: 1}, {
                            field: "parentId",
                            operator: "isnull",
                            value: false
                        }, {field: "grpCd", operator: "eq", value: "orgType"}]
                    }, sort: [{field: "orderId", dir: "asc"}]
                })
            );
            $scope.reportTypeDataSource = commonDataSource.urlDataSource("/api/nms/common/list",
                JSON.stringify({
                    filter: {
                        logic: "and",
                        filters: [{field: "useYn", operator: "eq", value: 1}, {
                            field: "parentId",
                            operator: "isnull",
                            value: false
                        }, {field: "grpCd", operator: "eq", value: "reportType"}]
                    }, sort: [{field: "orderId", dir: "asc"}]
                })
            );

            $scope.directionDataSource = commonDataSource.urlDataSource("/api/adt/direction/list",
                JSON.stringify({
                    filter: {
                        logic: "and",
                        filters: [{field: "useYn", operator: "eq", value: 1}]
                    }, sort: [{field: "name", dir: "asc"}]
                })
            );

            $scope.appDataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: __env.apiUrl() + "/api/adt/direction/list",
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
                    update: {
                        url: __env.apiUrl() + "/api/adt/direction/submit",
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
                        beforeSend: function (req) {
                            req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                        },
                        complete: function (e) {
                            $(".k-grid").data("kendoGrid").dataSource.read();
                        }
                    },
                    destroy: {
                        url: __env.apiUrl() + "/api/adt/direction",
                        contentType: "application/json; charset=UTF-8",
                        type: "DELETE",
                        beforeSend: function (req) {
                            req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                        },
                        complete: function (e) {
                            $(".k-grid").data("kendoGrid").dataSource.read();
                        }
                    },
                    create: {
                        url: __env.apiUrl() + "/api/adt/direction/submit",
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
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
             /*   group: [{
                    field: "rootNm",
                    dir: "asc"
                },
                    {
                        field: "parentNm",
                        dir: "asc"
                    }],*/
                schema: {
                    data: "data",
                    total: "total",
                    model: {
                        id: "id",
                        fields: {
                            id: {type: "number", nullable: true},
                            parentId: {type: "number", nullable: true},
                        }
                    }
                },
                pageSize: 200,
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
                        width: 60,
                    },
                    {
                        field: "name",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        headerAttributes: {"class": "columnHeader"},
                        title: 'Чиглэлийн нэр'
                    },
                    {field: "rootNm",filterable: { cell: { operator: "eq", showOperators: false } },headerAttributes: {"class": "columnHeader"}, title: 'Ерөнхий чиглэл'},
                    {field: "parentNm",filterable: { cell: { operator: "eq", showOperators: false } },headerAttributes: {"class": "columnHeader"}, title: 'Дэд чиглэл'},
                    {
                        field: "noticeStr", editor: $scope.noticeEditor,
                        filterable: {
                            cell: {
                                operator: "contains",
                                suggestionOperator: "contains",
                                showOperators: false
                            }
                        },
                        headerAttributes: {"class": "columnHeader"}, title: 'Батламж мэдэгдэл'
                    },
                    /*{
                        field: "confNm",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        headerAttributes: {"class": "columnHeader"},
                        width: 150,
                        title: 'Ангилал'
                    },*/
                    {
                        field: "dirNm",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        headerAttributes: {"class": "columnHeader"},
                        width: 150,
                        title: 'Төрөл'
                    },
                    /*{
                        field: "orgTypeNm",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        headerAttributes: {"class": "columnHeader"},
                        width: 150,
                        title: 'Байгууллагын төрөл'
                    },
                    {
                        field: "repTypeNm",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        headerAttributes: {"class": "columnHeader"},
                        width: 150,
                        title: 'Тайлан'
                    },*/

                    /*{
                        field: "procedureStr",
                        editor: $scope.procedureEditor,
                        filterable: {
                            cell: {
                                operator: "contains",
                                suggestionOperator: "contains",
                                showOperators: false
                            }
                        },
                        headerAttributes: {"class": "columnHeader"},
                        title: 'Горим'
                    },*/

                ],
                dataBinding: function () {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                },
                editable: "inline",
                height: function () {
                    return $(window).height() - 155;
                },
            };


            $scope.dirChange=function (i){
                $scope.dirType=i;
                if(i===1){
                    $scope.appDataSource.filter({
                        logic: "and",
                        filters: [{ field: "useYn", operator: "eq", value: 1 },
                            {field: "confNm", operator: "eq", value: 'Үндсэн'}],
                    });
                }
                else if(i===2){
                    $scope.appDataSource.filter({
                        logic: "and",
                        filters: [{ field: "useYn", operator: "eq", value: 1 },
                            {field: "confNm", operator: "eq", value: 'Дэд'}],
                    });
                }
                else{
                    $scope.appDataSource.filter({
                        logic: "and",
                        filters: [{ field: "useYn", operator: "eq", value: 1 },
                            {field: "confNm", operator: "eq", value: 'Нарийвчилсан'}],
                    });
                }
            }
            $scope.dirChange(1);

            /*if (localStorage.getItem("buttonData").includes("read")) {
                $scope.mainGrid.toolbar = ["excel", "search"];
            }
            if (localStorage.getItem("buttonData").includes("create")) {
                $scope.mainGrid.toolbar = [{template: "<button class='md-btn custom-btn k-grid-add' ng-click='add()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>"}];
            }
            if (localStorage.getItem("buttonData").includes("update") || localStorage.getItem("buttonData").includes("edit")) {
                $scope.mainGrid.columns.push({
                    command: [
                        {
                            template:
                                '<div class="command-container"><a class="grid-btn k-grid-edit"><div class="nimis-icon edit"></div></a><a class="grid-btn k-grid-remove-command"><div class="nimis-icon delete"></div></a><a class="grid-btn k-grid-update"><div class="nimis-icon update"></div></a> <a class="grid-btn k-grid-cancel"><div class="nimis-icon cancel"></div></a></div>',
                        },
                    ],
                    title: "&nbsp;",
                    width: 80,
                });
            }*/

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

            $scope.dropOptions = {
                dataTextField: "comCdNm",
                dataValueField: "id",
                placeholder: "Сонгох...",
                valuePrimitive: true,
                autoBind: true
            };

            var modalForm = UIkit.modal("#modal_form", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true,
                width: 600,
            });

            $scope.update=function (item){
                $scope.dataItem = item;
                if (item.noticeIds != null && item.noticeIds.length > 0 && item.noticeIds.includes(',')) {
                    $scope.dataItem.notices = item.noticeIds.split(',');
                } else if (item.noticeIds != null && item.noticeIds.length > 0) {
                    $scope.dataItem.notices = [item.noticeIds];
                } else {
                    $scope.dataItem.notices = [];
                }
                if($scope.dirType===1){
                    $scope.directionDataSource.filter({
                        logic: "and",
                        sort: [{field: "id", dir: "asc"}],
                        filters: [{field: "useYn", operator: "eq", value: 1},{field: "id", operator: "neq", value: item.id}],
                    });
                }
                else if($scope.dirType===2){
                    $scope.directionDataSource.filter({
                        logic: "and",
                        sort: [{field: "id", dir: "asc"}],
                        filters: [{field: "useYn", operator: "eq", value: 1},{field: "id", operator: "neq", value: item.id},{field: "confNm", operator: "eq", value: 'Үндсэн'}],
                    });
                }
                else{
                    $scope.directionDataSource.filter({
                        logic: "and",
                        sort: [{field: "id", dir: "asc"}],
                        filters: [{field: "useYn", operator: "eq", value: 1},{field: "id", operator: "neq", value: item.id},{field: "confNm", operator: "eq", value: 'Үндсэн'}],
                    });
                }

                modalForm.show();
            }

            $scope.dataItem = {};
            $scope.editAble = 0;
            $scope.add = function (type) {
                $scope.dataItem = {confType: 0, dirType: 1, useYn: 1, parentId: null};
                modalForm.show();
            };
            $scope.editMode = function (bool, item) {
                if (bool) {
                    $scope.editAble = 0;
                } else {
                    $scope.editAble = item.id;
                }
            }

            $scope.formSubmit = function () {
                var validator = $("#validator").kendoValidator().data("kendoValidator");
                if (validator.validate()) {
                    if ($scope.dataItem.confType === 0) $scope.dataItem.parentId = null;
                    if ($scope.dataItem.confType === 1) $scope.dataItem.parentId = $scope.dataItem.confId;
                    var method = "post";
                    //if ($scope.dataItem.id!==undefined && $scope.dataItem.id!==null) method="put";
                    mainService.withdata(method, "/api/adt/direction/submit", $scope.dataItem).then(function (data) {
                        $rootScope.alert(true, "Амжилттай хадгаллаа.");
                        modalForm.hide();
                        $(".k-grid").data("kendoGrid").dataSource.read();
                        /*if ($scope.dataItem.confType === 0) {
                            $("#parent").data("kendoGrid").dataSource.read();
                        } else if ($scope.dataItem.confType === 1) {
                            $("#detGrid").data("kendoGrid").dataSource.read();
                        } else {
                            $("#thirdGrid").data("kendoGrid").dataSource.read();
                        }*/
                    });
                }
            };
        },
    ]);
