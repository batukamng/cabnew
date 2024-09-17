angular
    .module("altairApp")
    .controller("1009AdtCtrl", [
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

            $scope.appFormDataSource = commonDataSource.urlDataSource("/api/adt/law/list",JSON.stringify({
                filter: {
                    logic: "and",
                    filters: [{field: "useYn", operator: "eq", value: 1},
                        {field: "law", operator: "eq", value: 1},
                        {
                        field: "parentId",
                        operator: "isnull",
                        value: true
                    }]
                }, sort: [{field: "id", dir: "asc"}]
            }));
            $scope.appDetDataSource = commonDataSource.urlDataSource("/api/adt/law/list",JSON.stringify({
                    filter: {
                        logic: "and",
                        filters: [{field: "useYn", operator: "eq", value: 1}, {
                            field: "parentId",
                            operator: "isnull",
                            value: false
                        }]
                    }, sort: [{field: "id", dir: "asc"}]
                }));

            $scope.appDataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: __env.apiUrl() + "/api/adt/law/list",
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
                        data: {
                            custom: {
                                logic: "and",
                                filters: [
                                    {field: "useYn", operator: "eq", value: 1},
                                    {field: "law", operator: "eq", value: 1}
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
                        url: __env.apiUrl() + "/api/adt/law",
                        contentType: "application/json; charset=UTF-8",
                        type: "PUT",
                        beforeSend: function (req) {
                            req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                        },
                        complete: function (e) {
                            $(".k-grid").data("kendoGrid").dataSource.read();
                        }
                    },
                    destroy: {
                        url: __env.apiUrl() + "/api/adt/law",
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
                        url: __env.apiUrl() + "/api/adt/law",
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
                schema: {
                    data: "data",
                    total: "total",
                    model: {
                        id: "id",
                        fields: {
                            id: {type: "number", nullable: true},
                            name: {type: "string"},
                            shortName: {type: "string"},
                            procedures: {defaultValue: []},
                            lnkDirectionNotices: {defaultValue: []},
                            lnkDirectionProcedures: {defaultValue: []},
                            notices: {defaultValue: []},
                            useYn: {type: "number", defaultValue: 1}
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
                        headerAttributes: {class: "columnCenter"},
                        attributes: {style: "text-align: center;"},
                        template: "#= ++record #",
                        stickable: true,
                        width: 60,
                    },
                    {
                        field: "name",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        headerAttributes: {"class": "columnHeader"},
                        title: 'Нэр'
                    },
                    {
                        field: "itemNm",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        headerAttributes: {"class": "columnHeader"},
                        title: 'Хууль'
                    },
                    {
                        field: "clauseNm",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        headerAttributes: {"class": "columnHeader"},
                        title: 'Зүйл'
                    }
                ],
                dataBinding: function () {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                },
                detailExpand: function(e) {
                    var grid = e.sender;
                    var rows = grid.element.find(".k-master-row").not(e.masterRow);

                    rows.each(function(e){
                        grid.collapseRow(this);
                    });
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
            $scope.detailGridOptions = function(dataItem) {
                return {
                    dataSource: {
                        transport: {
                            read: {
                                url: __env.apiUrl() + "/api/adt/law/list",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                data: {"sort": [{field: 'id', dir: 'desc'}]},
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                }
                            },
                            create: {
                                url: __env.apiUrl() + "/api/adt/law",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                },
                                complete: function (e) {
                                    $("#detGrid").data("kendoGrid").dataSource.read();
                                }
                            },
                            update: {
                                url: __env.apiUrl() + "/api/adt/law",
                                contentType: "application/json; charset=UTF-8",
                                type: "PUT",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                },
                                complete: function (e) {
                                    $("#detGrid").data("kendoGrid").dataSource.read();
                                }
                            },
                            destroy: {
                                url: __env.apiUrl() + "/api/adt/law",
                                contentType: "application/json; charset=UTF-8",
                                type: "DELETE",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
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
                                    id: {editable: false, nullable: true},
                                    parentId: {type: "number",defaultValue:dataItem.id},
                                    name: {type: "string", validation: {required: true}},
                                    zlt: {type: "string", validation: {required: true}},
                                    useYn: {type: "number", defaultValue:1}
                                }
                            }
                        },
                        pageSize: 200,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true,
                        filter: { field: "parentId", operator: "eq", value: dataItem.id }
                    },
                    scrollable: false,
                    sortable: true,
                    pageable: false,
                    /*toolbar: [{template: "<button class='md-btn custom-btn k-grid-add' ng-click='add()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>"}],*/
                    editable:"inline",
                    columns: [
                        {
                            title: "#",
                            headerAttributes: { "class": "columnCenter" },
                            attributes: { "style": "text-align: center;" },
                            template: "#= ++record2 #",
                            sticky: true,
                            width: 60
                        },
                        {field: "name", title: "Зүйл"},
                        {

                            command: [
                                {
                                    template:
                                        '<div class="command-container"><a class="grid-btn k-grid-edit"><div class="nimis-icon edit"></div></a><a class="grid-btn k-grid-remove-command"><div class="nimis-icon delete"></div></a><a class="grid-btn k-grid-update"><div class="nimis-icon update"></div></a> <a class="grid-btn k-grid-cancel"><div class="nimis-icon cancel"></div></a></div>',
                                },
                            ],
                            title: "&nbsp;",
                            width: 90,
                        }
                    ],
                    dataBinding: function () {
                        record2 = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                    },
                };
            };
            $scope.thirdGridOptions = function(dataItem) {
                return {
                    dataSource: {
                        transport: {
                            read: {
                                url: __env.apiUrl() + "/api/adt/law/list",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                data: {"sort": [{field: 'id', dir: 'desc'}]},
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                }
                            },
                            create: {
                                url: __env.apiUrl() + "/api/adt/law",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                },
                                complete: function (e) {
                                    $("#thirdGrid").data("kendoGrid").dataSource.read();
                                }
                            },
                            update: {
                                url: __env.apiUrl() + "/api/adt/law",
                                contentType: "application/json; charset=UTF-8",
                                type: "PUT",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                },
                                complete: function (e) {
                                    $("#thirdGrid").data("kendoGrid").dataSource.read();
                                }
                            },
                            destroy: {
                                url: __env.apiUrl() + "/api/adt/law",
                                contentType: "application/json; charset=UTF-8",
                                type: "DELETE",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
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
                                    id: {editable: false, nullable: true},
                                    parentId: {type: "number",defaultValue:dataItem.id},
                                    name: {type: "string", validation: {required: true}},
                                    zlt: {type: "string", validation: {required: true}},
                                    useYn: {type: "number", defaultValue:1}
                                }
                            }
                        },
                        pageSize: 20,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true,
                        filter: { field: "parentId", operator: "eq", value: dataItem.id }
                    },
                    scrollable: false,
                    sortable: true,
                    pageable: false,
                   /* toolbar: [{template: "<button class='md-btn custom-btn k-grid-add' ng-click='add()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>"}],*/
                    editable:"inline",
                    columns: [
                        {
                            title: "#",
                            headerAttributes: { "class": "columnCenter" },
                            attributes: { "style": "text-align: center;" },
                            template: "#= ++record3 #",
                            sticky: true,
                            width: 60
                        },
                        {field: "zlt", width:150,title: "Заалт"},
                        {field: "name", title: "Нэр"},
                        {

                            command: [
                                {
                                    template:
                                        '<div class="command-container"><a class="grid-btn k-grid-edit"><div class="nimis-icon edit"></div></a><a class="grid-btn k-grid-remove-command"><div class="nimis-icon delete"></div></a><a class="grid-btn k-grid-update"><div class="nimis-icon update"></div></a> <a class="grid-btn k-grid-cancel"><div class="nimis-icon cancel"></div></a></div>',
                                },
                            ],
                            title: "&nbsp;",
                            width: 80,
                        }
                    ],
                    dataBinding: function () {
                        record3 = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                    }
                };
            };


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
                $scope.dataItem = {main: 0, law: 1, useYn: 1, parentId: null};
                modalForm.show();
                $timeout(() => $rootScope.clearForm("validator"));
            };
            $scope.update = function (item) {
                $scope.dataItem={};
                $timeout(() => $rootScope.clearForm("validator"));
               /* if(item.parentId!=null){
                    $scope.accountDataSource.filter({
                        logic: "and",
                        filters: [{field: "useYn", operator: "eq", value: 1},{field: "id", operator: "eq", value: item.parentId}],
                    });
                }*/
                $timeout(function (){
                    $scope.dataItem = item;
                    modalForm.show();
                },100);
            };

            $scope.formSubmit = function () {
                var validator = $("#validator").kendoValidator().data("kendoValidator");
                if (validator.validate()) {
                    if ($scope.dataItem.main===0) $scope.dataItem.parentId = null;
                    if ($scope.dataItem.main===1) $scope.dataItem.parentId =  $scope.dataItem.lawId;
                    var method="post";
                    if ($scope.dataItem.id!==undefined && $scope.dataItem.id!==null) method="put";
                    mainService.withdata(method, "/api/adt/law", $scope.dataItem).then(function (data) {
                        $rootScope.alert(true, "Амжилттай хадгаллаа.");
                        modalForm.hide();
                        if ($scope.dataItem.main === 0) {
                            $("#parent").data("kendoGrid").dataSource.read();
                        } else if($scope.dataItem.main === 1){
                            $("#detGrid").data("kendoGrid").dataSource.read();
                        }
                        else {
                            $("#thirdGrid").data("kendoGrid").dataSource.read();
                        }
                    });
                }
            };
        },
    ]);
