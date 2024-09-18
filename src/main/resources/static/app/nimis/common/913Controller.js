angular
    .module('altairApp')
    .controller(
        '913NmsCtrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$timeout',
            'mainService',
            'commonDataSource',
            'crudDataSource',
            'Upload',
            '$http',
            '__env',
            function ($rootScope, $state, $scope, $timeout, mainService, commonDataSource,crudDataSource, Upload, $http, __env) {
                $scope.user = JSON.parse(sessionStorage.getItem('currentUser')).user;

                var filter={
                    filter:{logic: "and",
                        filters:[
                            {logic: "and", filters: [{field: "grpCd", operator: "contains", value: "ecoType"},{field: "parentId", operator: "isNull", value: "false"}]},
                            {logic: "or", filters: [{field: "comCd", operator: "eq", value: "01"},{field: "comCd", operator: "eq", value: "02"},{field: "comCd", operator: "eq", value: "03"},{field: "comCd", operator: "eq", value: "04"}]}
                        ]
                    },
                    sort: [{ field: "orderId", dir: "asc" }]
                };
                $scope.ecoDataSource = commonDataSource.urlDataSource("/api/nms/common/list", JSON.stringify(filter));
                $scope.selectOptions = {
                    placeholder: "Ангилал сонгох...",
                    /*     valuePrimitive: true,*/
                    autoBind: true,
                    dataSource: $scope.ecoDataSource
                };
                $scope.ecoEditor = function(container, options) {
                    var editor = $('<select  kendo-multi-select k-options="selectOptions" k-data-text-field="\'comCdNm\'" k-data-value-field="\'id\'" data-bind="value:' + options.field + '"></select>')
                        .appendTo(container);
                };
                $scope.costCategoryEditor = function(container, options) {
                    $scope.catOptions = {
                        placeholder: "Ангилал сонгох...",
                        autoBind: true,
                        dataSource: $scope.data2Source
                    };
                    var editor = $('<select  kendo-drop-down-list k-options="catOptions" k-data-text-field="\'name\'" k-data-value-field="\'id\'" data-bind="value:' + options.field + '"></select>')
                        .appendTo(container);
                };

                $scope.sSectorDataSource = commonDataSource.urlPageDataSource("/api/nms/sector/list", JSON.stringify({
                    filter: {
                        logic: "and",
                        filters: [{field: "parentId", operator: "isnull", value: true}]
                    }, sort: [{field: "id", dir: "asc"}]
                }), 60);
                $scope.sSubSectorDataSource = commonDataSource.urlPageDataSource("/api/nms/sector/list", JSON.stringify({
                    filter: {
                        logic: "and",
                        filters: [{field: "parentId", operator: "isnull", value: true}]
                    }, sort: [{field: "id", dir: "asc"}]
                }), 60);
                $scope.sInvTypeDataSource = commonDataSource.urlPageDataSource("/api/nms/investment/category/sub/list", JSON.stringify({
                    filter: {
                        logic: "and",
                        filters: [{field: "useYn", operator: "eq", value: 1}]
                    }, sort: [{field: "id", dir: "asc"}]
                }), 60);

                $scope.sectorEditor = function(container, options) {
                    var editor = $('<select id="secId"  kendo-combo-box k-data-source="sSectorDataSource" k-filter="\'startswith\'" k-auto-bind="true" k-data-text-field="\'name\'" k-data-value-field="\'id\'" data-bind="value:' + options.field + '"></select>')
                        .appendTo(container);
                };
                $scope.subSectorEditor = function(container, options) {
                    var editor = $('<select id="subSecId" kendo-combo-box k-data-source="sSubSectorDataSource" k-filter="\'startswith\'" k-auto-bind="true" k-cascade-from="\'secId\'" k-cascade-from-field="\'parentId\'" k-data-text-field="\'name\'" k-data-value-field="\'id\'" data-bind="value:' + options.field + '"></select>')
                        .appendTo(container);
                };
                $scope.objEditor = function(container, options) {
                    var editor = $('<select id="objId" kendo-combo-box k-data-source="sInvTypeDataSource" k-filter="\'startswith\'" k-auto-bind="true" k-cascade-from="\'subSecId\'" k-cascade-from-field="\'secId\'" k-data-text-field="\'name\'" k-data-value-field="\'id\'" data-bind="value:' + options.field + '"></select>')
                        .appendTo(container);
                };

                $scope.data1Source = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: function (e) {
                                if (sessionStorage.getItem("buttonData").includes("read") && JSON.parse(sessionStorage.getItem('menuData')).url === $state.current.name) {
                                    return __env.apiUrl() + "/api/nms/cost/type/list";
                                }
                                else {
                                    sessionStorage.removeItem('currentUser');
                                    sessionStorage.removeItem('menuList');
                                    sessionStorage.removeItem('menuData');
                                    $state.go('login');
                                }
                            },
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            }
                        },
                        update: {
                            url: __env.apiUrl() + "/api/nms/cost/type",
                            contentType: "application/json; charset=UTF-8",
                            type: "PUT",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            },
                            complete: function (e) {
                                if (e.status === 200) {
                                    $rootScope.alert(true, "Амжилттай засагдлаа");
                                }
                                else if (e.status === 500) {
                                    $rootScope.alert(false, "Амжилтгүй");
                                }
                                $("#app1Data").data("kendoGrid").dataSource.read();
                            }
                        },
                        destroy: {
                            url: __env.apiUrl() + "/api/nms/cost/type/delete",
                            contentType: "application/json; charset=UTF-8",
                            type: "DELETE",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            }
                        },
                        create: {
                            url: __env.apiUrl() + "/api/nms/cost/type",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            complete: function (e) {
                                if (e.status === 200) {
                                    $rootScope.alert(true, "Амжилттай хадгаллаа");
                                }
                                else if (e.status === 409) {
                                    $rootScope.alert(false, "Код давхцаж байна");
                                }
                                else if (e.status === 500) {
                                    $rootScope.alert(false, "Амжилтгүй");
                                }
                                $("#app1Data").data("kendoGrid").dataSource.read();
                            },
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
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
                                id: { type: "number", nullable: true },
                                name: {  type: "string" ,validation: {required: true}},
                                useYn: { type: "number",defaultValue:1 },
                                active: { type: "number",defaultValue:1 },
                                priority: {  type: "number" ,validation: {required: true}},
                                secId: {  type: "number" ,validation: {required: true}},
                                subSecId: {  type: "number" ,validation: {required: true}},
                                objId: {  type: "number" ,validation: {required: true}},
                                costCatId: {  type: "number" ,validation: {required: true}},
                                costCategory: {defaultValue:{}},
                                sectorCd: {defaultValue:{}},
                                subSectorCd: {defaultValue:{}},
                                investmentCategory: {defaultValue:{}}
                            }
                        }
                    },
                    pageSize: 20,
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true,
                    filter: {logic:"and",filters:[{field: "useYn", operator: "eq", value: 1},{field: "parentId", operator: "isNull", value: true}]}
                })

                $scope.main1Grid = {
                    filterable: {
                        mode:"row",
                        extra: false,
                        operators: { // redefine the string operators
                            string: {
                                contains: "Агуулсан",
                                startswith: "Эхлэх утга",
                                eq: "Тэнцүү",
                                gte: "Их",
                                lte: "Бага"
                            }
                        }
                    },
                    sortable: true,
                    resizable: true,
                    pageable: {
                        refresh: true,
                        pageSizes: true,
                        buttonCount: 5
                    },
                    columns: [
                        {
                            title: "#",
                            headerAttributes: {"class": "columnCenter"},
                            attributes: {"style": "text-align: center;"},
                            template: "#= ++record #",
                            width: 50
                        },
                        {field: "name",filterable: { cell: { operator: "contains", showOperators: false } },headerAttributes: {"class": "columnHeader"}, title: 'Нэр'},
                        {field: "costCatId",template: "#if(costCategory!=null){# #=costCategory.name# #}#",editor:$scope.costCategoryEditor,filterable: { cell: { operator: "eq", showOperators: false } },headerAttributes: {"class": "columnHeader"}, title: 'Зардлын ангилал'},
                        {field: "secId",template: "#if(sectorCd!=null){# #=sectorCd.name# #}#",editor:$scope.sectorEditor,filterable: { cell: { operator: "eq", showOperators: false } },headerAttributes: {"class": "columnHeader"}, title: 'Салбар'},
                        {field: "subSecId",template: "#if(subSectorCd!=null){# #=subSectorCd.name# #}#",editor:$scope.subSectorEditor,filterable: { cell: { operator: "eq", showOperators: false } },headerAttributes: {"class": "columnHeader"}, title: 'Дэд салбар'},
                        {field: "objId",template: "#if(investmentCategory!=null){# #=investmentCategory.name# #}#",editor:$scope.objEditor,filterable: { cell: { operator: "eq", showOperators: false } },headerAttributes: {"class": "columnHeader"}, title: 'ХО Ангилал'},
                        {field: "priority",width:150,filterable: { cell: { operator: "eq", showOperators: false } },headerAttributes: {"class": "columnHeader"}, title: 'Эрэмбэ'},
                        {field: "active",values:[{"text":"Тийм","value":1},{"text":"Үгүй","value":0}],width:150,filterable: { cell: { operator: "eq", showOperators: false } },headerAttributes: {"class": "columnHeader"}, title: 'Бүгдэд харуулах'},
                    ],
                    dataBinding: function() {
                        record = (this.dataSource.page() -1) * this.dataSource.pageSize();
                    },
                    editable: "inline",
                    scrollable: true,
                    height: function () {
                        return $(window).height() - 150;
                    }
                };
                if (sessionStorage.getItem('buttonData').includes("read")) {
                    $scope.main1Grid.toolbar = ["excel", "search"];
                }
                if (sessionStorage.getItem('buttonData').includes("create")) {
                    $scope.main1Grid.toolbar = [{ template: "<button class='md-btn custom-btn k-grid-add'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>" },"search"];
                }
                if (sessionStorage.getItem('buttonData').includes("update") || sessionStorage.getItem('buttonData').includes("edit")) {
                    $scope.main1Grid.columns.push({
                        command: [
                            {
                                template:
                                    '<div class="command-container"><a class="grid-btn k-grid-edit"><div class="nimis-icon edit"></div></a><a class="grid-btn k-grid-remove-command"><div class="nimis-icon delete"></div></a><a class="grid-btn k-grid-update"><div class="nimis-icon update"></div></a> <a class="grid-btn k-grid-cancel"><div class="nimis-icon cancel"></div></a></div>',
                            },
                        ], title: "&nbsp;", sticky: true, width: 80
                    });
                }

                $scope.typeSecondGridOptions = function (dataItem) {
                    return {
                        dataSource: {
                            transport: {
                                read: {
                                    url: function (e) {
                                        if (sessionStorage.getItem("buttonData").includes("read") && JSON.parse(sessionStorage.getItem('menuData')).url === $state.current.name) {
                                            return __env.apiUrl() + "/api/nms/cost/type/list";
                                        }
                                        else {
                                            sessionStorage.removeItem('currentUser');
                                            sessionStorage.removeItem('menuList');
                                            sessionStorage.removeItem('menuData');
                                            $state.go('login');
                                        }
                                    },
                                    contentType: "application/json; charset=UTF-8",
                                    type: "POST",
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                    }
                                },
                                update: {
                                    url: __env.apiUrl() + "/api/nms/cost/type",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "PUT",
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                    },
                                    complete: function (e) {
                                        if (e.status === 200) {
                                            $rootScope.alert(true, "Амжилттай засагдлаа");
                                        }
                                        else if (e.status === 500) {
                                            $rootScope.alert(false, "Амжилтгүй");
                                        }
                                        $("#typeSecondGrid").data("kendoGrid").dataSource.read();
                                    }
                                },
                                destroy: {
                                    url: __env.apiUrl() + "/api/nms/cost/type/delete",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "DELETE",
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                    },
                                    complete: function (e) {
                                        $("#typeSecondGrid").data("kendoGrid").dataSource.read();
                                    }
                                },
                                create: {
                                    url: __env.apiUrl() + "/api/nms/cost/type",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "POST",
                                    complete: function (e) {
                                        if (e.status === 200) {
                                            $rootScope.alert(true, "Амжилттай хадгаллаа");
                                        }
                                        else if (e.status === 409) {
                                            $rootScope.alert(false, "Код давхцаж байна");
                                        }
                                        else if (e.status === 500) {
                                            $rootScope.alert(false, "Амжилтгүй");
                                        }
                                        $("#typeSecondGrid").data("kendoGrid").dataSource.read();
                                    },
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
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
                                        id: { type: "number", nullable: true },
                                        name: {  type: "string" ,validation: {required: true}},
                                        useYn: { type: "number",defaultValue:1 },
                                        active: { type: "number",defaultValue:1 },
                                        priority: {  type: "number" ,validation: {required: true}},
                                        secId: {  type: "number" ,validation: {required: true}},
                                        subSecId: {  type: "number" ,validation: {required: true}},
                                        objId: {  type: "number" ,validation: {required: true}},
                                        costCatId: {  type: "number" ,validation: {required: true}},
                                        parentId: { type: "number",defaultValue:dataItem.id,validation: {required: true} },
                                        costCategory: {defaultValue:{}},
                                        sectorCd: {defaultValue:{}},
                                        subSectorCd: {defaultValue:{}},
                                        investmentCategory: {defaultValue:{}}
                                    }
                                }
                            },
                            pageSize: 200,
                            serverPaging: true,
                            serverFiltering: true,
                            serverSorting: true,
                            filter: {field: "parentId", operator: "eq", value: dataItem.id},
                        },
                        scrollable: false,
                        sortable: true,
                        pageable: false,
                        toolbar: [{ template: "<button class='md-btn custom-btn k-grid-add'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>" }],
                        editable: "inline",
                        columns: [
                            {
                                title: "#",
                                headerAttributes: {"class": "columnCenter"},
                                attributes: {"style": "text-align: center;"},
                                template: "#= ++record2 #",
                                width: 50
                            },
                            {field: "name",filterable: { cell: { operator: "contains", showOperators: false } },headerAttributes: {"class": "columnHeader"}, title: 'Нэр'},
                            {field: "costCatId",template: "#if(costCategory!=null){# #=costCategory.name# #}#",editor:$scope.costCategoryEditor,filterable: { cell: { operator: "eq", showOperators: false } },headerAttributes: {"class": "columnHeader"}, title: 'Зардлын ангилал'},
                            {field: "secId",template: "#if(sectorCd!=null){# #=sectorCd.name# #}#",editor:$scope.sectorEditor,filterable: { cell: { operator: "eq", showOperators: false } },headerAttributes: {"class": "columnHeader"}, title: 'Салбар'},
                            {field: "subSecId",template: "#if(subSectorCd!=null){# #=subSectorCd.name# #}#",editor:$scope.subSectorEditor,filterable: { cell: { operator: "eq", showOperators: false } },headerAttributes: {"class": "columnHeader"}, title: 'Дэд салбар'},
                            {field: "objId",template: "#if(investmentCategory!=null){# #=investmentCategory.name# #}#",editor:$scope.objEditor,filterable: { cell: { operator: "eq", showOperators: false } },headerAttributes: {"class": "columnHeader"}, title: 'ХО Ангилал'},
                            {field: "priority",width:150,filterable: { cell: { operator: "eq", showOperators: false } },headerAttributes: {"class": "columnHeader"}, title: 'Эрэмбэ'},
                            {field: "active",values:[{"text":"Тийм","value":1},{"text":"Үгүй","value":0}],width:150,filterable: { cell: { operator: "eq", showOperators: false } },headerAttributes: {"class": "columnHeader"}, title: 'Бүгдэд харуулах'},
                            {
                                command: [
                                    {
                                        template:
                                            '<div class="command-container"><a class="grid-btn k-grid-edit"><div class="nimis-icon edit"></div></a><a class="grid-btn k-grid-remove-command"><div class="nimis-icon delete"></div></a><a class="grid-btn k-grid-update"><div class="nimis-icon update"></div></a> <a class="grid-btn k-grid-cancel"><div class="nimis-icon cancel"></div></a></div>',
                                    },
                                ],
                                title: "&nbsp;",
                                width: 80,
                            },
                        ],
                        dataBinding: function() {
                            record2 = (this.dataSource.page() -1) * this.dataSource.pageSize();
                        },
                    };
                };
                $scope.typeThirdGridOptions = function (dataItem) {
                    return {
                        dataSource: {
                            transport: {
                                read: {
                                    url: function (e) {
                                        if (sessionStorage.getItem("buttonData").includes("read") && JSON.parse(sessionStorage.getItem('menuData')).url === $state.current.name) {
                                            return __env.apiUrl() + "/api/nms/cost/type/list";
                                        }
                                        else {
                                            sessionStorage.removeItem('currentUser');
                                            sessionStorage.removeItem('menuList');
                                            sessionStorage.removeItem('menuData');
                                            $state.go('login');
                                        }
                                    },
                                    contentType: "application/json; charset=UTF-8",
                                    type: "POST",
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                    }
                                },
                                update: {
                                    url: __env.apiUrl() + "/api/nms/cost/type",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "PUT",
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                    },
                                    complete: function (e) {
                                        if (e.status === 200) {
                                            $rootScope.alert(true, "Амжилттай засагдлаа");
                                        }
                                        else if (e.status === 500) {
                                            $rootScope.alert(false, "Амжилтгүй");
                                        }
                                        $("#typeThirdGrid").data("kendoGrid").dataSource.read();
                                    }
                                },
                                destroy: {
                                    url: __env.apiUrl() + "/api/nms/cost/type/delete",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "DELETE",
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                    },
                                    complete: function (e) {
                                        $("#typeThirdGrid").data("kendoGrid").dataSource.read();
                                    }
                                },
                                create: {
                                    url: __env.apiUrl() + "/api/nms/cost/type",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "POST",
                                    complete: function (e) {
                                        if (e.status === 200) {
                                            $rootScope.alert(true, "Амжилттай хадгаллаа");
                                        }
                                        else if (e.status === 409) {
                                            $rootScope.alert(false, "Код давхцаж байна");
                                        }
                                        else if (e.status === 500) {
                                            $rootScope.alert(false, "Амжилтгүй");
                                        }
                                        $("#typeThirdGrid").data("kendoGrid").dataSource.read();
                                    },
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
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
                                        id: { type: "number", nullable: true },
                                        name: {  type: "string" ,validation: {required: true}},
                                        useYn: { type: "number",defaultValue:1 },
                                        active: { type: "number",defaultValue:1 },
                                        priority: {  type: "number" ,validation: {required: true}},
                                        secId: {  type: "number" ,validation: {required: true}},
                                        subSecId: {  type: "number" ,validation: {required: true}},
                                        objId: {  type: "number" ,validation: {required: true}},
                                        costCatId: {  type: "number" ,validation: {required: true}},
                                        parentId: { type: "number",defaultValue:dataItem.id,validation: {required: true} },
                                        costCategory: {defaultValue:{}},
                                        sectorCd: {defaultValue:{}},
                                        subSectorCd: {defaultValue:{}},
                                        investmentCategory: {defaultValue:{}}
                                    }
                                }
                            },
                            pageSize: 200,
                            serverPaging: true,
                            serverFiltering: true,
                            serverSorting: true,
                            filter: {field: "parentId", operator: "eq", value: dataItem.id},
                        },
                        scrollable: false,
                        sortable: true,
                        pageable: false,
                        toolbar: [{ template: "<button class='md-btn custom-btn k-grid-add'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>" }],
                        editable: "inline",
                        columns: [
                            {
                                title: "#",
                                headerAttributes: {"class": "columnCenter"},
                                attributes: {"style": "text-align: center;"},
                                template: "#= ++record3 #",
                                width: 50
                            },
                            {field: "name",filterable: { cell: { operator: "contains", showOperators: false } },headerAttributes: {"class": "columnHeader"}, title: 'Нэр'},
                            {field: "costCatId",template: "#if(costCategory!=null){# #=costCategory.name# #}#",editor:$scope.costCategoryEditor,filterable: { cell: { operator: "eq", showOperators: false } },headerAttributes: {"class": "columnHeader"}, title: 'Зардлын ангилал'},
                            {field: "secId",template: "#if(sectorCd!=null){# #=sectorCd.name# #}#",editor:$scope.sectorEditor,filterable: { cell: { operator: "eq", showOperators: false } },headerAttributes: {"class": "columnHeader"}, title: 'Салбар'},
                            {field: "subSecId",template: "#if(subSectorCd!=null){# #=subSectorCd.name# #}#",editor:$scope.subSectorEditor,filterable: { cell: { operator: "eq", showOperators: false } },headerAttributes: {"class": "columnHeader"}, title: 'Дэд салбар'},
                            {field: "objId",template: "#if(investmentCategory!=null){# #=investmentCategory.name# #}#",editor:$scope.objEditor,filterable: { cell: { operator: "eq", showOperators: false } },headerAttributes: {"class": "columnHeader"}, title: 'ХО Ангилал'},
                            {field: "priority",width:150,filterable: { cell: { operator: "eq", showOperators: false } },headerAttributes: {"class": "columnHeader"}, title: 'Эрэмбэ'},
                            {field: "active",values:[{"text":"Тийм","value":1},{"text":"Үгүй","value":0}],width:150,filterable: { cell: { operator: "eq", showOperators: false } },headerAttributes: {"class": "columnHeader"}, title: 'Бүгдэд харуулах'},
                            {
                                command: [
                                    {
                                        template:
                                            '<div class="command-container"><a class="grid-btn k-grid-edit"><div class="nimis-icon edit"></div></a><a class="grid-btn k-grid-remove-command"><div class="nimis-icon delete"></div></a><a class="grid-btn k-grid-update"><div class="nimis-icon update"></div></a> <a class="grid-btn k-grid-cancel"><div class="nimis-icon cancel"></div></a></div>',
                                    },
                                ],
                                title: "&nbsp;",
                                width: 80,
                            },
                        ],
                        dataBinding: function() {
                            record3 = (this.dataSource.page() -1) * this.dataSource.pageSize();
                        }
                    };
                };


                $scope.data2Source = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: __env.apiUrl() + "/api/nms/cost/category/list",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            }
                        },
                        update: {
                            url: __env.apiUrl() + "/api/nms/cost/category",
                            contentType: "application/json; charset=UTF-8",
                            type: "PUT",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            },
                            complete: function (e) {
                                if (e.status === 200) {
                                    $rootScope.alert(true, "Амжилттай засагдлаа");
                                }
                                else if (e.status === 500) {
                                    $rootScope.alert(false, "Амжилтгүй");
                                }
                                $("#detGrid").data("kendoGrid").dataSource.read();
                            }
                        },
                        destroy: {
                            url: __env.apiUrl() + "/api/nms/cost/category/delete",
                            contentType: "application/json; charset=UTF-8",
                            type: "DELETE",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            },
                            complete: function (e) {
                                if (e.status === 200) {
                                    $rootScope.alert(true, "Амжилттай засагдлаа");
                                }
                                else if (e.status === 500) {
                                    $rootScope.alert(false, "Амжилтгүй");
                                }
                                $("#detGrid").data("kendoGrid").dataSource.read();
                            }
                        },
                        create: {
                            url: __env.apiUrl() + "/api/nms/cost/category",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            complete: function (e) {
                                if (e.status === 200) {
                                    $rootScope.alert(true, "Амжилттай хадгаллаа");
                                }
                                else if (e.status === 409) {
                                    $rootScope.alert(false, "Код давхцаж байна");
                                }
                                else if (e.status === 500) {
                                    $rootScope.alert(false, "Амжилтгүй");
                                }
                                $("#detGrid").data("kendoGrid").dataSource.read();
                            },
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
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
                                id: { type: "number", nullable: true },
                                name: {  type: "string" ,validation: {required: true}},
                                priority: {  type: "number" ,validation: {required: true}},
                                typeId: {  type: "number" ,validation: {required: true}},
                                parentId: { type: "number",validation: {required: true} },
                                ecoList: []
                            }
                        }
                    },
                    pageSize: 20,
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true,
                    filter: [{field: "parentId", operator: "isNull", value: true},{field: "useYn", operator: "eq", value:1}]
                })
                $scope.main2Grid = {
                    filterable: {
                        mode:"row",
                        extra: false,
                        operators: { // redefine the string operators
                            string: {
                                contains: "Агуулсан",
                                startswith: "Эхлэх утга",
                                eq: "Тэнцүү",
                                gte: "Их",
                                lte: "Бага"
                            }
                        }
                    },
                    sortable: true,
                    resizable: true,
                    pageable: {
                        refresh: true,
                        pageSizes: true,
                        buttonCount: 5
                    },
                    columns: [
                        {
                            title: "#",
                            headerAttributes: {"class": "columnCenter"},
                            attributes: {"style": "text-align: center;"},
                            template: "#= ++record #",
                            width: 50
                        },
                        {field: "name",filterable: { cell: { operator: "contains", showOperators: false } },headerAttributes: {"class": "columnHeader"}, title: 'Нэр'},
                        {field: "typeId",values:[{"text":"Тез","value":1},{"text":"Гүйцэтгэгч","value":2}],width:150,filterable: { cell: { operator: "eq", showOperators: false } },headerAttributes: {"class": "columnHeader"}, title: 'Төрөл'},
                        {field: "priority",width:150,filterable: { cell: { operator: "eq", showOperators: false } },headerAttributes: {"class": "columnHeader"}, title: 'Эрэмбэ'},
                       /* {field: "parentId", dataTextField: "name", dataValueField: "id", dataSource: $scope.categoryDataSource,editor:$scope.catEditor,template:"#if(category!=null){# <span class='uk-badge' style='border-radius: 50px;background: rgba(218,244,235,255); color:rgba(78,203,157,255);font-weight: bold;'>#=category.name#</span> #}#",filterable: { cell: { operator: "eq", showOperators: false } },headerAttributes: {"class": "columnHeader"}, title: 'Төрөл'},*/
                        {field: "ecoList",sortable:false,width:400, headerAttributes: {"class": "columnHeader"},editor:$scope.ecoEditor,  filterable:false,  template:"#for (var i=0,len=ecoList.length; i<len; i++){#<span>${ ecoList[i].comCdNm } #if(i!=ecoList.length-1){#<span>,</span>#}# </span> # } #", title: "Эдийн засгийн ангилал"},
                    ],
                    dataBinding: function() {
                        record = (this.dataSource.page() -1) * this.dataSource.pageSize();
                    },
                    editable: "inline",
                    scrollable: true,
                    height: function () {
                        return $(window).height() - 150;
                    }
                };
                $scope.detailGridOptions = function (dataItem) {
                    return {
                        dataSource: {
                            transport: {
                                read: {
                                    url: __env.apiUrl() + "/api/nms/cost/category/list",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "POST",
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                    }
                                },
                                update: {
                                    url: __env.apiUrl() + "/api/nms/cost/category",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "PUT",
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                    },
                                    complete: function (e) {
                                        if (e.status === 200) {
                                            $rootScope.alert(true, "Амжилттай засагдлаа");
                                        }
                                        else if (e.status === 500) {
                                            $rootScope.alert(false, "Амжилтгүй");
                                        }
                                        $("#detGrid").data("kendoGrid").dataSource.read();
                                    }
                                },
                                destroy: {
                                    url: __env.apiUrl() + "/api/nms/cost/category/delete",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "DELETE",
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                    },
                                    complete: function (e) {
                                        if (e.status === 200) {
                                            $rootScope.alert(true, "Амжилттай засагдлаа");
                                        }
                                        else if (e.status === 500) {
                                            $rootScope.alert(false, "Амжилтгүй");
                                        }
                                        $("#detGrid").data("kendoGrid").dataSource.read();
                                    }
                                },
                                create: {
                                    url: __env.apiUrl() + "/api/nms/cost/category",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "POST",
                                    complete: function (e) {
                                        if (e.status === 200) {
                                            $rootScope.alert(true, "Амжилттай хадгаллаа");
                                        }
                                        else if (e.status === 409) {
                                            $rootScope.alert(false, "Код давхцаж байна");
                                        }
                                        else if (e.status === 500) {
                                            $rootScope.alert(false, "Амжилтгүй");
                                        }
                                        $("#detGrid").data("kendoGrid").dataSource.read();
                                    },
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
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
                                        id: { type: "number", nullable: true },
                                        name: {  type: "string" ,validation: {required: true}},
                                        parentId: { type: "number",defaultValue:dataItem.id},
                                        priority: {  type: "number" ,validation: {required: true}},
                                        typeId: {  type: "number" ,defaultValue: 1},
                                        useYn: {  type: "number" ,defaultValue: 1},
                                        costCategory: {defaultValue:{}},
                                        ecoList: []
                                    }
                                }
                            },
                            pageSize: 200,
                            serverPaging: true,
                            serverFiltering: true,
                            serverSorting: true,
                            filter: [{field: "parentId", operator: "eq", value: dataItem.id},{field: "useYn", operator: "eq", value:1}],
                        },
                        scrollable: false,
                        sortable: true,
                        pageable: false,
                        toolbar: [{ template: "<button class='md-btn custom-btn k-grid-add'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>" }],
                        editable: "inline",
                        columns: [
                            {
                                title: "#",
                                headerAttributes: {"class": "columnCenter"},
                                attributes: {"style": "text-align: center;"},
                                template: "#= ++record2 #",
                                width: 50
                            },
                            {field: "name",filterable: { cell: { operator: "contains", showOperators: false } },headerAttributes: {"class": "columnHeader"}, title: 'Нэр'},
                            {field: "priority",width:150,filterable: { cell: { operator: "eq", showOperators: false } },headerAttributes: {"class": "columnHeader"}, title: 'Эрэмбэ'},
                            {field: "typeId",values:[{"text":"Тез","value":1},{"text":"Гүйцэтгэгч","value":2}],width:150,filterable: { cell: { operator: "eq", showOperators: false } },headerAttributes: {"class": "columnHeader"}, title: 'Төрөл'},
                            {field: "ecoList",sortable:false,width:400, headerAttributes: {"class": "columnHeader"},editor:$scope.ecoEditor,  filterable:false,  template:"#for (var i=0,len=ecoList.length; i<len; i++){#<span>${ ecoList[i].comCdNm } #if(i!=ecoList.length-1){#<span>,</span>#}# </span> # } #", title: "Эдийн засгийн ангилал"},
                            {
                                command: [
                                    {
                                        template:
                                            '<div class="command-container"><a class="grid-btn k-grid-edit"><div class="nimis-icon edit"></div></a><a class="grid-btn k-grid-remove-command"><div class="nimis-icon delete"></div></a><a class="grid-btn k-grid-update"><div class="nimis-icon update"></div></a> <a class="grid-btn k-grid-cancel"><div class="nimis-icon cancel"></div></a></div>',
                                    },
                                ],
                                title: "&nbsp;",
                                width: 80,
                            },
                        ],
                        dataBinding: function() {
                            record2 = (this.dataSource.page() -1) * this.dataSource.pageSize();
                        },
                    };
                };
                if (sessionStorage.getItem('buttonData').includes("read")) {
                    $scope.main2Grid.toolbar = ["excel", "search"];
                }
                if (sessionStorage.getItem('buttonData').includes("create")) {
                    $scope.main2Grid.toolbar = [{ template: "<button class='md-btn custom-btn k-grid-add'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>" },"search"];
                }
                if (sessionStorage.getItem('buttonData').includes("update") || sessionStorage.getItem('buttonData').includes("edit")) {
                    $scope.main2Grid.columns.push({
                        command: [
                            {
                                template:
                                    '<div class="command-container"><a class="grid-btn k-grid-edit"><div class="nimis-icon edit"></div></a><a class="grid-btn k-grid-remove-command"><div class="nimis-icon delete"></div></a><a class="grid-btn k-grid-update"><div class="nimis-icon update"></div></a> <a class="grid-btn k-grid-cancel"><div class="nimis-icon cancel"></div></a></div>',
                            },
                        ], title: "&nbsp;", sticky: true, width: 80
                    });
                }
                $scope.tabStrip={
                    tabPosition: "top",
                    animation: { open: { effects: "fadeIn" } },
                    select:function (e){
                        if(e.item.id==='main_content-tab-1'){
                            $scope.data2Source.filter(
                                {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1},{field: "parentId", operator: "isNull", value: true}]}
                            );
                        }
                        else if(e.item.id==='main_content-tab-2'){
                            $scope.data1Source.filter(
                                {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1},{field: "parentId", operator: "isNull", value: true}]}
                            );
                        }
                    }
                }
            }
        ]
    );