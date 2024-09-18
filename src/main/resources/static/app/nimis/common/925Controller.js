angular
    .module('altairApp')
    .controller(
        '925NmsCtrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$timeout',
            '$translate',
            'commonDataSource',
            'mainService',
            '__env',
            function ($rootScope, $state, $scope, $timeout, $translate, commonDataSource,mainService,__env) {

                $scope.sAmgDataSource = commonDataSource.urlPageDataSource("/api/nms/as/code/list", JSON.stringify({filter: {logic: "and", filters: [{field: "parentId", operator: "isnull", value: true},{field: "useYn", operator: "eq", value: 1}]}, sort: [{ field: "cdNm", dir: "asc" }] }), 30);
                $scope.sSoumDataSource = commonDataSource.urlDataSource("/api/nms/as/code/list", JSON.stringify({ sort: [{ field: "cdNm", dir: "asc" }] }));
                $scope.sBagDataSource = commonDataSource.urlDataSource("/api/nms/as/code/list", JSON.stringify({ sort: [{ field: "cdNm", dir: "asc" }] }));
                $scope.amgEditor = function(container, options) {
                    var editor = $('<select kendo-drop-down-list id="amgAppId" k-data-source="sAmgDataSource" k-data-text-field="\'cdNm\'" k-data-value-field="\'id\'" data-bind="value:' + options.field + '"></select>')
                        .appendTo(container);
                };

                $scope.soumEditor = function(container, options) {
                    var editor = $('<select kendo-drop-down-list id="soumId"  k-cascade-from="\'amgAppId\'" k-cascade-from-field="\'parentId\'" k-data-source="sSoumDataSource" k-data-text-field="\'cdNm\'" k-data-value-field="\'id\'" data-bind="value:' + options.field + '"></select>')
                        .appendTo(container);
                };

                $scope.bagEditor = function(container, options) {
                    var editor = $('<select kendo-drop-down-list id="bagId"  k-cascade-from="\'soumId\'" k-cascade-from-field="\'parentId\'" k-data-source="sBagDataSource" k-data-text-field="\'cdNm\'" k-data-value-field="\'id\'" data-bind="value:' + options.field + '"></select>')
                        .appendTo(container);
                };
                $scope.gridDataSource = {
                    transport: {
                        read: {
                            url: function (e) {
                                if (sessionStorage.getItem("buttonData").includes("read") && JSON.parse(sessionStorage.getItem('menuData')).url === $state.current.name) {
                                    return __env.apiUrl() + "/api/nms/par/dist/list";
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
                            data: { sort: [{ field: "id", dir: "asc" }] },
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            }
                        },
                        update: {
                            url: __env.apiUrl() + "/api/nms/par/dist",
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
                            }
                        },
                        destroy: {
                            url: __env.apiUrl() + "/api/nms/par/dist",
                            contentType: "application/json; charset=UTF-8",
                            type: "DELETE",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            }
                        },
                        create: {
                            url: __env.apiUrl() + "/api/nms/par/dist",
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
                                $("#parent").data("kendoGrid").dataSource.read();
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
                                id: { type: "number" },
                                description: { type: "string"},
                                name: { type: "string", validation: { required: true} },
                                ord: { type: "number", validation: { required: true} },
                                useYn: { type: "number", defaultValue: 1 }
                            }
                        }
                    },
                    pageSize: 20,
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true,
                    filter: {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1}]}
                };
                $scope.mainGrid = {
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
                            headerAttributes: { "class": "columnCenter" },
                            attributes: { "style": "text-align: center;" },
                            template: "#= ++record #",
                            sticky: true,
                            width: 50
                        },
                        {
                            field: "name", title: 'Нэр',
                            headerAttributes: { "class": "columnHeader" },
                            filterable: { cell: { operator: "contains", showOperators: false } },
                        },
                        {
                            field: "description", title: 'Тайлбар',
                            headerAttributes: { "class": "columnHeader" },
                            filterable: { cell: { operator: "contains", showOperators: false } },
                        },
                        {
                            field: "ord", title: 'Эрэмбэ',
                            headerAttributes: { "class": "columnHeader" },
                            filterable: { cell: { operator: "contains", showOperators: false } },
                        },
                        { field: "useYn", headerAttributes: { "class": "columnHeader" }, width: 130, template: "#if(useYn===true){# <span class='columnCenter'>Y</span> #}else{#<span class='columnCenter uk-text-danger'>N</span> #}#", title: 'Ашиглах эсэх' }
                    ],
                    dataBinding: function () {
                        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                    },
                    editable: "inline",

                    height: function () {
                        return $(window).height() - 110;
                    }
                };


                if (sessionStorage.getItem('buttonData').includes("read")) {
                    $scope.mainGrid.toolbar = ["excel", "search"];
                }
                if (sessionStorage.getItem('buttonData').includes("create")) {
                    $scope.mainGrid.toolbar = [{ template: "<button class='md-btn custom-btn k-grid-add'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>" }, "search"];
                }
                if (sessionStorage.getItem('buttonData').includes("update") || sessionStorage.getItem('buttonData').includes("edit")) {
                    $scope.mainGrid.columns.push({
                        command: [
                            {
                                template:
                                    '<div class="command-container"><a class="grid-btn k-grid-edit"><div class="nimis-icon edit"></div></a><a class="grid-btn k-grid-remove-command"><div class="nimis-icon delete"></div></a><a class="grid-btn k-grid-update"><div class="nimis-icon update"></div></a> <a class="grid-btn k-grid-cancel"><div class="nimis-icon cancel"></div></a></div>',
                            },
                        ], title: "&nbsp;", sticky: true, width: 80
                    });
                }

                $scope.detailGridOptions = function (dataItem) {
                    return {
                        dataSource: {
                            transport: {
                                read: {
                                    url: __env.apiUrl() + "/api/nms/par/dist/detail/list",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "POST",
                                    data: { sort: [{ field: "id", dir: "asc" }] },
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                    }
                                },
                                update: {
                                    url: __env.apiUrl() + "/api/nms/par/dist/detail/" + dataItem.id,
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
                                    url: __env.apiUrl() + "/api/nms/par/dist/detail",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "DELETE",
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                    }
                                },
                                create: {
                                    url: __env.apiUrl() + "/api/nms/par/dist/detail",
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
                                            UIkit.notify("Амжилтгүй.", {
                                                status: 'danger',
                                                pos: 'bottom-center'
                                            });
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
                                        id: { type: "number" },
                                        name: { type: "string", validation: { required: true} },
                                        aimag: { defaultValue: null }, sum: { defaultValue: null }, bag: { defaultValue: null },
                                        parentId: { type: "number", defaultValue: dataItem.id },
                                        amgId: { type: "number"},
                                        sumId: { type: "number"},
                                        bagId: { type: "number"},
                                        useYn: { type: "boolean", defaultValue: true }
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
                        toolbar: [
                            { template: "<button class='md-btn custom-btn k-grid-add'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>" }
                          ],
                        editable: "inline",
                        columns: [
                            {
                                title: "#",
                                headerAttributes: { "class": "columnCenter" },
                                attributes: { "style": "text-align: center;" },
                                template: "#= ++record2 #",
                                sticky: true,
                                width: 50
                            },
                            {field: "amgId",editor:$scope.amgEditor,sticky:true,
                                dataTextField: "cdNm", dataValueField: "id",dataSource:$scope.sAmgDataSource,
                                template: "#if(aimag!=null){# #=aimag.cdNm# #}#",
                                headerAttributes: {"class": "columnHeader"},title:  'Аймаг'},
                            {field: "sumId", sticky:true, dataTextField: "cdNm", dataValueField: "id",dataSource:$scope.sSoumDataSource,
                                template: "#if(sum!=null){# #=sum.cdNm# #}#",
                                editor:$scope.soumEditor, headerAttributes: {"class": "columnHeader"},title:  'Сум'},
                            {field: "bagId", sticky:true, dataTextField: "cdNm", dataValueField: "id",dataSource:$scope.sBagDataSource,
                                template: "#if(bag!=null){# #=bag.cdNm# #}#",
                                editor:$scope.bagEditor, headerAttributes: {"class": "columnHeader"},title:  'Баг'},
                            {
                                command: [
                                    {
                                        template:
                                            '<div class="command-container"><a class="grid-btn k-grid-edit"><div class="nimis-icon edit"></div></a><a class="grid-btn k-grid-remove-command"><div class="nimis-icon delete"></div></a><a class="grid-btn k-grid-update"><div class="nimis-icon update"></div></a> <a class="grid-btn k-grid-cancel"><div class="nimis-icon cancel"></div></a></div>',
                                    },
                                ], title: "&nbsp;", width: 80
                            }
                        ],
                        dataBinding: function () {
                            record2 = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                        },
                    };
                };
            }
        ]
    );
