angular.module("altairApp")
    .controller("1008AdtCtrl", [
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
        function ($rootScope, $state, $scope, $timeout, mainService, commonDataSource,orgTypes, repTypes,sweet, Upload,  __env) {
            $scope.user = JSON.parse(sessionStorage.getItem("currentUser")).user;
            $("#header_main").attr("style", "filter: none !important;padding: 8px 25px");

            $scope.confirmationStatementDataSource = commonDataSource.urlDataSource("/api/nms/common/list",
                JSON.stringify({ filter: { logic: "and", filters: [{ field: "useYn", operator: "eq", value: 1 },{ field: "parentId", operator: "isnull", value: false },{ field: "grpCd", operator: "eq", value: "confirmationStatement" }] }, sort: [{ field: "orderId", dir: "asc" }] })
            );
            $scope.noticeEditor = function(container, options) {
                options.field= "notices";
                if(options.model.noticeIds.includes(',')){
                    options.model.notices = options.model.noticeIds.split(',');
                }else if(options.model.noticeIds.length>0 ){
                    options.model.notices=[options.model.noticeIds];
                }
                else {
                    options.model.notices=[];
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
                JSON.stringify({ filter: { logic: "and", filters: [{ field: "useYn", operator: "eq", value: 1 },{ field: "parentId", operator: "isnull", value: false },{ field: "grpCd", operator: "eq", value: "procedure" }] }, sort: [{ field: "orderId", dir: "asc" }] })
            );
            $scope.procedureEditor = function(container, options) {
                options.field= "procedures";
                if(options.model.procedureIds.includes(',')){
                    options.model.procedures = options.model.procedureIds.split(',');
                }else if(options.model.procedureIds.length>0 ){
                    options.model.procedures=[options.model.procedureIds];
                }
                else {
                    options.model.procedures=[];
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

            $scope.appDataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: __env.apiUrl() + "/api/adt/account/list",
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
                            if (JSON.parse(sessionStorage.getItem("currentUser")) != null) {
                                req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
                            } else {
                                $state.go("login");
                                $rootScope.$broadcast("LogoutSuccessful");
                            }
                        },
                    },
                    update: {
                        url: __env.apiUrl() + "/api/adt/account",
                        contentType: "application/json; charset=UTF-8",
                        type: "PUT",
                        beforeSend: function(req) {
                            req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                        },
                        complete: function (e) {
                            $(".k-grid").data("kendoGrid").dataSource.read();
                        }
                    },
                    destroy: {
                        url: __env.apiUrl() + "/api/adt/account",
                        contentType: "application/json; charset=UTF-8",
                        type: "DELETE",
                        beforeSend: function(req) {
                            req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                        },
                        complete: function (e) {
                            $(".k-grid").data("kendoGrid").dataSource.read();
                        }
                    },
                    create: {
                        url: __env.apiUrl() + "/api/adt/account",
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
                        beforeSend: function(req) {
                            req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
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
                            id: {type: "number",nullable:true},
                            name: {type: "string"},
                            code:{type:"string"},
                            orgTypeId: {type: "number"},
                            repTypeId: {type: "number"},
                            orgType: {defaultValue:{}},
                            repType: {defaultValue:{}},
                            useYn: {type: "number",defaultValue:1}
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
                    {field: "code",  width: 150, title: "Код", filterable: { cell: { operator: "contains", suggestionOperator:"contains",showOperators: false } }},
                    {field: "name", title: "Нэр", filterable: { cell: { operator: "contains", suggestionOperator:"contains",showOperators: false } }},
                    {field: "orgTypeId", template:"#if(orgType!=null){# #=orgType.comCdNm# #}#",dataTextField: "comCdNm", dataValueField: "id", dataSource:orgTypes,width: 150,title: "Байгууллагын төрөл", filterable: { cell: { operator: "eq", suggestionOperator:"contains",showOperators: false } }},
                    {field: "repTypeId", template:"#if(repType!=null){# #=repType.comCdNm# #}#",dataTextField: "comCdNm", dataValueField: "id", dataSource:repTypes,width: 150,title: "Тайлан", filterable: { cell: { operator: "eq", suggestionOperator:"contains",showOperators: false } }},
                ],
                dataBinding: function () {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                },
                editable:"inline",
                height: function () {
                    return $(window).height() - 110;
                },
            };

            if (sessionStorage.getItem("buttonData").includes("read")) {
                $scope.mainGrid.toolbar = ["excel", "search"];
            }
            if (sessionStorage.getItem("buttonData").includes("create")) {
                $scope.mainGrid.toolbar = [{template: "<button class='md-btn custom-btn k-grid-add' ng-click='add()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>"}];
            }
            if (sessionStorage.getItem("buttonData").includes("update") || sessionStorage.getItem("buttonData").includes("edit")) {
                $scope.mainGrid.columns.push({
                    command: [
                        {
                            template:
                                '<div class="command-container"><a class="grid-btn k-grid-edit"><div class="nimis-icon edit"></div></a><a class="grid-btn k-grid-delete"><div class="nimis-icon delete"></div></a><a class="grid-btn k-grid-update"><div class="nimis-icon update"></div></a> <a class="grid-btn k-grid-cancel"><div class="nimis-icon cancel"></div></a></div>',
                        },
                    ],
                    title: "&nbsp;",
                    width: 80,
                });
            }

        },
    ]);
