angular
    .module('altairApp')
    .controller(
        '922NmsCtrl',
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

                $scope.measurementDataSource = commonDataSource.urlDataSource("/api/nms/common/code/list", JSON.stringify({ filter: {logic: "and", filters: [{field: "grpCd", operator: "contains", value: "measurement"},{field: "parentId", operator: "isNull", value: "false"}]}, sort: [{ field: "orderId", dir: "asc" }] }));

                $scope.gridDataSource = {
                    transport: {
                        read: {
                            url: function (e) {
                                if (localStorage.getItem("buttonData").includes("read") && JSON.parse(localStorage.getItem('menuData')).url === $state.current.name) {
                                    return __env.apiUrl() + "/api/nms/pri/chk/list";
                                }
                                else {
                                    localStorage.removeItem('currentUser');
                                    localStorage.removeItem('menuList');
                                    localStorage.removeItem('menuData');
                                    $state.go('login');
                                }
                            },
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            data: { sort: [{ field: "id", dir: "desc" }] },
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                            }
                        },
                        update: {
                            url: __env.apiUrl() + "/api/nms/pri/chk",
                            contentType: "application/json; charset=UTF-8",
                            type: "PUT",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
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
                            url: __env.apiUrl() + "/api/nms/pri/chk",
                            contentType: "application/json; charset=UTF-8",
                            type: "DELETE",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                            }
                        },
                        create: {
                            url: __env.apiUrl() + "/api/nms/pri/chk",
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
                                id: { type: "number" },
                                description: { type: "string", validation: { required: true} },
                                cdNm: { type: "string", validation: { required: true} },
                                lvl1Cd: { type: "string", validation: { required: true} },
                                lvl2Cd: { type: "string", validation: { required: true} },
                                maxScr: { type: "number", validation: { required: true} },
                                useYn: { type: "boolean", defaultValue: true }
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
                            field: "lvl2Cd", title: 'Код',
                            headerAttributes: { "class": "columnHeader" },
                            filterable: { cell: { operator: "contains", showOperators: false } },
                            width: 150
                        },
                        {
                            field: "cdNm", title: 'Шалгуур нэр',
                            headerAttributes: { "class": "columnHeader" },
                            filterable: { cell: { operator: "contains", showOperators: false } },
                        },
                        {
                            field: "description", title: 'Тайлбар',
                            headerAttributes: { "class": "columnHeader" },
                            filterable: { cell: { operator: "contains", showOperators: false } },
                        },
                        {
                            field: "lvl1Cd", title: 'Үе шат',
                            headerAttributes: { "class": "columnHeader" },
                            values:[{"text":"Төслийн үнэлгээ хийх","value":"1"},{"text":"Төслийг эрэмбэлэх, сонгох","value":"2"}],
                            filterable: { cell: { operator: "contains", showOperators: false } },
                        },
                        {
                            field: "maxScr", title: 'Жин',
                            headerAttributes: { "class": "columnHeader" },
                            filterable: { cell: { operator: "contains", showOperators: false } },
                        }
                    ],
                    dataBinding: function () {
                        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                    },
                    editable: "inline",
                    height: function () {
                        return $(window).height() - 110;
                    }
                };

                if (localStorage.getItem('buttonData').includes("read")) {
                    $scope.mainGrid.toolbar = ["excel", "search"];
                }
                if (localStorage.getItem('buttonData').includes("create")) {
                    $scope.mainGrid.toolbar = [{ template: "<button class='md-btn custom-btn k-grid-add'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>" }, "search"];
                }
                if (localStorage.getItem('buttonData').includes("update") || localStorage.getItem('buttonData').includes("edit")) {
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
                                    url: __env.apiUrl() + "/api/nms/pri/chk/scr/list",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "POST",
                                    data: { sort: [{ field: "id", dir: "desc" }] },
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                    }
                                },
                                update: {
                                    url: __env.apiUrl() + "/api/nms/pri/chk/scr/" + dataItem.id,
                                    contentType: "application/json; charset=UTF-8",
                                    type: "PUT",
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
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
                                    url: __env.apiUrl() + "/api/nms/pri/chk/scr",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "DELETE",
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                    }
                                },
                                create: {
                                    url: __env.apiUrl() + "/api/nms/pri/chk/scr",
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
                                        id: { type: "number" },
                                        cdNm: { type: "string", validation: { required: true} },
                                        parentId: { type: "number", defaultValue: dataItem.id },
                                        maxScr: { type: "number", validation: { required: true} },
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
                            { template: "<button class=\"k-button k-button-icontext k-grid-add\"><span class=\"k-icon k-i-plus\"></span>Нэмэх</button>" }
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
                            {
                                field: "cdNm", title: 'Шалгуур нэр',
                                headerAttributes: { "class": "columnHeader" },
                                filterable: { cell: { operator: "contains", showOperators: false } },
                            },
                            {
                                field: "maxScr", title: 'Жин',
                                headerAttributes: { "class": "columnHeader" },
                                filterable: { cell: { operator: "contains", showOperators: false } },
                            },
                            {
                                command: [
                                    { name: "edit", text: { edit: " ", update: " ", cancel: " " } },
                                    { name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn" }
                                ], title: "&nbsp;", sticky: true, width: 100
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
