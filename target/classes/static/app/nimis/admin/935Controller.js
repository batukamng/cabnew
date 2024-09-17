angular.module("altairApp").controller("935NmsCtrl", [
    "$rootScope",
    "$state",
    "$scope",
    "$timeout",
    "$translate",
    "__env",
    function ($rootScope, $state, $scope, $timeout, $translate, __env) {
        $scope.menuData = JSON.parse(localStorage.getItem("menuData"));
        $scope.gridDataSource = {
            transport: {
                read: {
                    url: __env.apiUrl() + "/api/nms/common/list",
                    contentType: "application/json; charset=UTF-8",
                    type: "POST",
                    data: {
                        sort: [{field: "id", dir: "desc"}],
                    },
                    beforeSend: function (req) {
                        req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
                    },
                },
                update: {
                    url: __env.apiUrl() + "/api/nms/common",
                    contentType: "application/json; charset=UTF-8",
                    type: "PUT",
                    beforeSend: function (req) {
                        req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
                    },
                    complete: function (e) {
                        if (e.status === 200) {
                            $rootScope.alert(true, "Амжилттай засагдлаа");
                        } else if (e.status === 500) {
                            $rootScope.alert(false, "Амжилтгүй");
                        }
                    },
                },
                destroy: {
                    url: __env.apiUrl() + "/api/nms/common",
                    contentType: "application/json; charset=UTF-8",
                    type: "DELETE",
                    beforeSend: function (req) {
                        req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
                    },
                },
                create: {
                    url: __env.apiUrl() + "/api/nms/common",
                    contentType: "application/json; charset=UTF-8",
                    type: "POST",
                    complete: function (e) {
                        if (e.status === 200) {
                            $rootScope.alert(true, "Амжилттай хадгаллаа");
                        } else if (e.status === 409) {
                            $rootScope.alert(false, "Код давхцаж байна");
                        } else if (e.status === 500) {
                            $rootScope.alert(false, "Амжилтгүй");
                        }
                        $("#parent").data("kendoGrid").dataSource.read();
                    },
                    beforeSend: function (req) {
                        req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
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
                        grpCd: {type: "string"},
                        comCdNm: {type: "string"},
                        comCdEn: {type: "string"},
                        comCdKr: {type: "string"},
                        shortCd: {type: "string"},
                        comCd: {type: "string", defaultValue: null},
                        ord: {type: "number"},
                        useYn: {type: "number", defaultValue: 1},
                    },
                },
            },
            filter: {field: "parentId", operator: "isnull", value: true},
            pageSize: 20,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
        };
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
            sortable: true,
            resizable: true,
            excel: {
                fileName: "Organization Export.xlsx",
                proxyURL: "//demos.telerik.com/kendo-ui/service/export",
                filterable: true,
                allPages: true,
            },
            pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5,
            },
            columns: [
                {
                    title: "#",
                    headerAttributes: { "class": "checkbox-align" },
                    attributes: { "style": "text-align: center;" },
                    template: "#= ++record #",
                    sticky: true,
                    width: 50
                },
                {
                    field: "grpCd",
                    title: 'Код',
                    headerAttributes: {class: "columnHeader"},
                    filterable: { cell: { operator: "contains", showOperators: false } },
                },
                {
                    field: "comCdNm",
                    title: 'Нэр',
                    headerAttributes: {class: "columnHeader"},
                    filterable: { cell: { operator: "contains", showOperators: false } },
                },
                {
                    field: "shortCd",
                    title: 'Тайлбар',
                    headerAttributes: {class: "columnHeader"},
                    filterable: { cell: { operator: "contains", showOperators: false } },
                },
                {
                    field: "orderId",
                    title: 'Эрэмбэ',
                    filterable: false,
                    width: 100,
                    headerAttributes: {style: "text-align: center;"},
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
            }
        };

        if (localStorage.getItem("buttonData").includes("read")) {
            $scope.mainGrid.toolbar = ["excel", "search"];
        }
        if (localStorage.getItem("buttonData").includes("create")) {
            $scope.mainGrid.toolbar = ["create"];
        }
        if (localStorage.getItem("buttonData").includes("update") || localStorage.getItem("buttonData").includes("edit")) {
            $scope.mainGrid.columns.push({
                command: [
                    {
                        template:
                            '<div class="k-command-cell command-container" style="padding-left:5px;">' +
                            '<a ng-show="editAble!=dataItem.id" ng-click="editMode(false,dataItem)" class="grid-btn k-grid-edit-command"><div class="nimis-icon edit"></div></a>' +
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
        $scope.add = function (){

        }
        $scope.editAble = 0;
        $scope.editMode = function (bool, item) {
            if (bool) {
                $scope.editAble = 0;
            } else {
                $scope.editAble = item.id;
            }
        }
        $scope.detailGridOptions = function (dataItem) {
            return {
                dataSource: {
                    transport: {
                        read: {
                            url: __env.apiUrl() + "/api/nms/common/list",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            data: {
                                sort: [{field: "id", dir: "desc"}],
                            },
                            beforeSend: function (req) {
                                req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
                            },
                        },
                        update: {
                            url: __env.apiUrl() + "/api/nms/common",
                            contentType: "application/json; charset=UTF-8",
                            type: "PUT",
                            beforeSend: function (req) {
                                req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
                            },
                            complete: function (e) {
                                if (e.status === 200) {
                                    $rootScope.alert(true, "Амжилттай засагдлаа");
                                } else if (e.status === 500) {
                                    $rootScope.alert(false, "Амжилтгүй");
                                }
                            },
                        },
                        destroy: {
                            url: __env.apiUrl() + "/api/nms/common",
                            contentType: "application/json; charset=UTF-8",
                            type: "DELETE",
                            beforeSend: function (req) {
                                req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
                            },
                        },
                        create: {
                            url: __env.apiUrl() + "/api/nms/common",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            complete: function (e) {
                                if (e.status === 200) {
                                    $rootScope.alert(true, "Амжилттай хадгаллаа");
                                } else if (e.status === 409) {
                                    $rootScope.alert(false, "Код давхцаж байна");
                                } else if (e.status === 500) {
                                    UIkit.notify("Амжилтгүй.", {
                                        status: "danger",
                                        pos: "bottom-center",
                                    });
                                    $rootScope.alert(false, "Амжилтгүй");
                                }
                                $("#detGrid").data("kendoGrid").dataSource.read();
                            },
                            beforeSend: function (req) {
                                req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
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
                                grpCd: {
                                    type: "string",
                                    editable: false,
                                    defaultValue: dataItem.grpCd,
                                },
                                comCdNm: {type: "string"},
                                comCd: {type: "string"},
                                comCdEn: {type: "string"},
                                parentId: {type: "number", defaultValue: dataItem.id},
                                shortCd: {type: "string"},
                                orderId: {type: "number"},
                                useYn: {type: "number", defaultValue: 1},
                            },
                        },
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
                toolbar: ["create"],
                editable: "inline",
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
                        field: "comCd",
                        title: 'Код',
                        headerAttributes: {class: "columnHeader"},
                        filterable: { cell: { operator: "contains", showOperators: false } },
                    },
                    {
                        field: "comCdNm",
                        title: 'Нэр',
                        headerAttributes: {class: "columnHeader"},
                        filterable: { cell: { operator: "contains", showOperators: false } },
                    },
                    {
                        field: "shortCd",
                        title: 'Тайлбар',
                        headerAttributes: {class: "columnHeader"},
                        filterable: { cell: { operator: "contains", showOperators: false } },
                    },
                    {
                        field: "orderId",
                        title: 'Эрэмбэ',
                        filterable: false,
                        width: 100,
                        headerAttributes: {style: "text-align: center;"},
                    },
                    {
                        command: [
                            {
                                template:
                                    '<div class="k-command-cell command-container">' +
                                    '<a ng-show="editAble!=dataItem.id" ng-click="editMode(false,dataItem)" class="grid-btn k-grid-edit-command"><div class="nimis-icon edit"></div></a>' +
                                    '<a ng-show="editAble!=dataItem.id" class="grid-btn k-grid-remove-command"><div class="nimis-icon delete"></div></a>' +
                                    '<a ng-show="editAble==dataItem.id" ng-click="editMode(true,dataItem)" class="grid-btn k-grid-save-command"><div class="nimis-icon update"></div></a> ' +
                                    '<a ng-show="editAble==dataItem.id" ng-click="editMode(true,dataItem)"  class="grid-btn k-grid-cancel-command"><div class="nimis-icon cancel"></div></a>' +
                                    '</div>',
                            },
                        ],
                        title: "&nbsp;",
                        width: 80,
                    },
                ],
                dataBinding: function () {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                },
            };
        };

        $scope.editAble = 0;
        $scope.editMode = function (bool, item) {
            if (bool) {
                $scope.editAble = 0;
            } else {
                $scope.editAble = item.id;
            }
        }

        $scope.thirdGridOptions = function (dataItem) {
            return {
                dataSource: {
                    transport: {
                        read: {
                            url: __env.apiUrl() + "/api/nms/common/list",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            data: {
                                sort: [{field: "id", dir: "desc"}],
                            },
                            beforeSend: function (req) {
                                req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
                            },
                        },
                        update: {
                            url: __env.apiUrl() + "/api/nms/common",
                            contentType: "application/json; charset=UTF-8",
                            type: "PUT",
                            beforeSend: function (req) {
                                req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
                            },
                            complete: function (e) {
                                if (e.status === 200) {
                                    $rootScope.alert(true, "Амжилттай засагдлаа");
                                } else if (e.status === 500) {
                                    $rootScope.alert(false, "Амжилтгүй");
                                }
                            },
                        },
                        destroy: {
                            url: __env.apiUrl() + "/api/nms/common",
                            contentType: "application/json; charset=UTF-8",
                            type: "DELETE",
                            beforeSend: function (req) {
                                req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
                            },
                        },
                        create: {
                            url: __env.apiUrl() + "/api/nms/common",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            complete: function (e) {
                                if (e.status === 200) {
                                    $rootScope.alert(true, "Амжилттай хадгаллаа");
                                } else if (e.status === 409) {
                                    $rootScope.alert(false, "Код давхцаж байна");
                                } else if (e.status === 500) {
                                    UIkit.notify("Амжилтгүй.", {
                                        status: "danger",
                                        pos: "bottom-center",
                                    });
                                    $rootScope.alert(false, "Амжилтгүй");
                                }
                                $("#thirdGrid").data("kendoGrid").dataSource.read();
                            },
                            beforeSend: function (req) {
                                req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
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
                                grpCd: {
                                    type: "string",
                                    editable: false,
                                    defaultValue: dataItem.grpCd,
                                },
                                comCdNm: {type: "string"},
                                comCdEn: {type: "string"},
                                parentId: {type: "number", defaultValue: dataItem.id},
                                shortCd: {type: "string"},
                                orderId: {type: "number"},
                                useYn: {type: "number", defaultValue: 1},
                            },
                        },
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
                toolbar: [{template: "<button class='md-btn custom-btn k-grid-add'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>"}, "search"],
                editable: "inline",
                columns: [
                    {
                        title: '{{"Num" | translate}}',
                        headerAttributes: {class: "columnHeader"},
                        template: "<span class='row-number' style='text-align: center; float: left; width: 100%;'></span>",
                        width: "60px",
                    },
                    {
                        field: "comCd",
                        title: 'Код',
                        headerAttributes: {class: "columnHeader"},
                        filterable: { cell: { operator: "contains", showOperators: false } },
                    },
                    {
                        field: "comCdNm",
                        title: 'Нэр',
                        headerAttributes: {class: "columnHeader"},
                        filterable: { cell: { operator: "contains", showOperators: false } },
                    },
                    {
                        field: "shortCd",
                        title: 'Тайлбар',
                        headerAttributes: {class: "columnHeader"},
                        filterable: { cell: { operator: "contains", showOperators: false } },
                    },
                    {
                        field: "orderId",
                        title: 'Эрэмбэ',
                        filterable: false,
                        width: 100,
                        headerAttributes: {style: "text-align: center;"},
                    },
                    {
                        field: "useYn",
                        width: 130,
                        template: "#if(useYn===1){# <span class='columnCenter'>Y</span> #}else{#<span class='columnCenter uk-text-danger'>N</span> #}#",
                        title: '{{"Cmn06" | translate}}',
                    },
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
                dataBound: function () {
                    var rows = this.items();
                    $(rows).each(function () {
                        var index = $(this).index() + 1 + $(".k-grid").data("kendoGrid").dataSource.pageSize() * ($(".k-grid").data("kendoGrid").dataSource.page() - 1);
                        var rowLabel = $(this).find(".row-number");
                        $(rowLabel).html(index);
                    });
                },
            };
        };
    },
]);
