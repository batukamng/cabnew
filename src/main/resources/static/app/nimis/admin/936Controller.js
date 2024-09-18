angular.module("altairApp").controller("936NmsCtrl", [
    "$rootScope",
    "$state",
    "$scope",
    "$timeout",
    "__env",
    "mainService",
    "commonDataSource",
    function ($rootScope, $state, $scope, $timeout, __env, mainService, commonDataSource) {
        $scope.menuData = JSON.parse(sessionStorage.getItem("menuData"));
        $scope.selectModuleOptions = {
            placeholder: "...",
            dataTextField: "name",
            dataValueField: "id",
            valuePrimitive: true,
            autoBind: false,
            dataSource: $scope.moduleDataSource,
        };
        $scope.selectOptions = {
            placeholder: "...",
            dataTextField: "name",
            dataValueField: "id",
            valuePrimitive: true,
            autoBind: false,
            dataSource: $scope.actionDataSource,
        };

        var modalForm = UIkit.modal("#modal_form", {
            modal: false,
            keyboard: false,
            bgclose: false,
            center: true,
            width: 600,
        });

        $scope.parent = {};
        $scope.dataItem = {};
        $scope.privileges = {};
        $scope.modules = {};
        $scope.icons = {};

        $scope.add = function (type) {
            $scope.dataItem = {main: 1, pageType: 1, useYn: 1, allModule: 0, parentId: 0};
            $scope.privileges = {};
            $scope.modules = {};
            $scope.isCheckAll = false;
            modalForm.show();
            $scope.itemActionDataSource = $scope.allActionDataSource;
            $scope.itemModuleDataSource = $scope.allModuleDataSource;
        };
        $scope.update = function (item) {
            $scope.dataItem = item;
            $scope.dataItem.main = $scope.dataItem.parentId == 0 || $scope.dataItem.parentId == undefined || $scope.dataItem.parentId == "" ? 1 : 0;

            $scope.privileges = {};
            $scope.modules = {};
            $scope.isCheckAll = false;
            if (item.moduleIds != null && item.moduleIds.length > 0) {
                $scope.dataItem.moduleArr = item.moduleIds.split(",");
            }
            if (item.privilegeIds != null && item.privilegeIds.length > 0) {
                $scope.dataItem.privilegeArr = item.privilegeIds.split(",");

                $scope.arr = item;
                if ($scope.dataItem.privilegeArr !== undefined) {
                    $scope.dataItem.privilegeArr.map(function (x) {
                        $scope.privileges[parseInt(x)] = 1;
                    });
                }
                if ($scope.dataItem.moduleArr !== undefined) {
                    $scope.dataItem.moduleArr.map(function (x) {
                        $scope.modules[parseInt(x)] = 1;
                    });
                }
            }
            if ($scope.dataItem.main == 0) {
                var parentData = $scope.ddlDataSource.data();
                var parentItem = parentData.filter((i) => i.id == $scope.dataItem.parentId)[0];
                $scope.itemActionDataSource = $scope.allActionDataSource.filter((i) => parentItem.privilegeIds.includes(i.id));
                if(parentItem.moduleIds!=null){
                    $scope.itemModuleDataSource = $scope.allModuleDataSource.filter((i) => parentItem.moduleIds.includes(i.id));
                }
            } else {
                $scope.itemActionDataSource = $scope.allActionDataSource;
                $scope.itemModuleDataSource = $scope.allModuleDataSource;
            }
            modalForm.show();
        };

        $scope.fileDtl = null;
        $scope.onSelect = function (e) {
            $scope.fileDtl = null;
        }
        $scope.fileOptions = {
            multiple: true,
            autoUpload: false,
            async: {
                saveUrl: __env.apiUrl() + "/api/file/uploadFile",
                removeUrl: __env.apiUrl() + "/api/file/delete",
                //  autoUpload: true,
            },
            showFileList: false,
            remove: function (e) {
                if ($scope.createLink) {
                    $.ajax({
                        url: __env.apiUrl() + "/api/file/delete",
                        type: 'DELETE',
                        success: function (response) {
                        },
                        data: JSON.stringify($scope.createLink),
                        dataType: 'json',
                        contentType: 'application/json; charset=utf-8'
                    });
                }
                $(".k-widget.k-upload").find("ul").remove();
                $(".k-upload-status").remove();
                $scope.createLink = null;
                e.preventDefault();
            },
            success: function (e) {
                if (e.operation == 'upload') {
                    $scope.dataItem.guideFileId = e.response.id;
                }
                $scope.fileDtl = e.response;
            },
            upload: function (e) {
                var xhr = e.XMLHttpRequest;
                if (xhr) {
                    xhr.addEventListener("readystatechange", function (e) {
                        if (xhr.readyState == 1 /* OPENED */) {
                            xhr.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                        }
                    });
                }
            },
            dropZone: ".dropZoneElement"
        };

        $scope.formSubmit = function () {
            var validator = $("#validator").kendoValidator().data("kendoValidator");

            if (validator.validate()) {
                $scope.dataItem.privilegeArr = [];
                $scope.dataItem.moduleArr = [];
                for (var priKey in $scope.privileges) {
                    var priv = $scope.privileges[priKey];
                    if (priv && priKey !== "NaN") $scope.dataItem.privilegeArr.push(priKey);
                }
                for (var modId in $scope.modules) {
                    var mod = $scope.modules[modId];
                    if (mod && modId !== "NaN") $scope.dataItem.moduleArr.push(modId);
                }
                if ($scope.dataItem.main) $scope.dataItem.parentId = 0;
                mainService.withdata("post", "/api/nms/menu/create", $scope.dataItem).then(function (data) {
                    $rootScope.alert(true, "Амжилттай хадгаллаа.");
                    modalForm.hide();
                    if ($scope.dataItem.parentId !== 0 && $scope.dataItem.parentId !== undefined && $scope.dataItem.parentId !== "") {
                        $("#detGrid").data("kendoGrid").dataSource.read();
                    } else {
                        $("#parent").data("kendoGrid").dataSource.read();
                    }
                });
            }
        };

        $scope.dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: __env.apiUrl() + "/api/nms/menu/data/list",
                    contentType: "application/json; charset=UTF-8",
                    type: "POST",
                    data: {sort: [{field: "orderId", dir: "asc"}]},
                    beforeSend: function (req) {
                        req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
                    },
                },
                create: {
                    url: __env.apiUrl() + "/api/nms/menu/create",
                    contentType: "application/json; charset=UTF-8",
                    type: "POST",
                    beforeSend: function (req) {
                        req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
                    },
                    complete: function (e) {
                        $(".k-grid").data("kendoGrid").dataSource.read();
                    },
                },
                update: {
                    url: __env.apiUrl() + "/api/nms/menu/update",
                    contentType: "application/json; charset=UTF-8",
                    type: "PUT",
                    beforeSend: function (req) {
                        req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
                    },
                    complete: function (e) {
                        $(".k-grid").data("kendoGrid").dataSource.read();
                    },
                },
                destroy: {
                    url: __env.apiUrl() + "/api/nms/menu/delete",
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
                        id: {editable: false, nullable: true},
                        name: {type: "string", validation: {required: true}},
                        parentId: {type: "number", defaultValue: 0},
                        orderId: {type: "number"},
                        url: {type: "string"},
                        comCd: {type: "string"},
                        icon: {type: "string"},
                        langKey: {type: "string"},
                        useYn: {type: "number", defaultValue: 1},
                    },
                },
            },
            pageSize: 20,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            filter: {"logic": "and", filters: [{field: "parentId", operator: "isnull", value: true}]},
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
            sortable: true,
            resizable: true,
            pageable: {
                pageSizes: [10,20, 50],
                refresh: true,
                buttonCount: 5,
                message: {
                    empty: "No Data",
                    allPages: "All",
                },
            },
            columns: [
                {
                    title: "#",
                    headerAttributes: {class: "checkbox-align"},
                    attributes: {style: "text-align: center;"},
                    template: "#= ++record #",
                    sticky: true,
                    width: 50,
                },
                {
                    field: "name",
                    filterable: {cell: {operator: "contains", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Нэр",
                    width:250
                },
                {
                    field: "url",
                    filterable: {cell: {operator: "contains", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Хаяг /URL/",
                },
                {
                    field: "orderId",
                    filterable: {cell: {operator: "contains", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    width: 100,
                    title: "Эрэмбэ",
                },
                {
                    field: "childCnt",
                    filterable: {cell: {operator: "contains", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    width: 100,
                    title: "Дэд цэс",
                },
                {
                    field: "icon",
                    attributes: {class: "uk-text-center"},
                    width: 100,
                    template: "#if(icon!=null){# <div class='avatar-photo custom-icon' style='background-image: url(#:icon#); margin-right:0'></div> #}#",
                    filterable: {cell: {operator: "contains", showOperators: false}},
                    headerAttributes: {class: "checkbox-align"},
                    title: "Айкон",
                },
                {
                    field: "moduleName",
                    filterable: {cell: {operator: "contains", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    width: 300,
                    title: "Дэд систем",
                },
                {
                    field: "privilegeName",
                    filterable: {cell: {operator: "contains", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    width: 300,
                    title: "Үйлдэл",
                },
                {
                    field: "useYn",
                    filterable: {cell: {operator: "eq", showOperators: false}},
                    headerAttributes: {class: "checkbox-align"},
                    attributes: {style: "text-align: center;"},
                    width: 120,
                    values:[{text:"Тийм",value:1},{text:"Үгүй",value:0}],
                    template: "#if(useYn==1){# <span>Тийм</span> #}else{# <span class='uk-text-danger'>Үгүй</span> #}#",
                    title: "Идэвхтэй эсэх",
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
            }
        };

        if (sessionStorage.getItem("buttonData").includes("read")) {
            $scope.mainGrid.toolbar = ["excel", "search"];
        }
        if (sessionStorage.getItem("buttonData").includes("create")) {
            $scope.mainGrid.toolbar = [
                {template: "<button class='md-btn custom-btn' ng-click='add()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>"}
            ];
        }
        if (sessionStorage.getItem("buttonData").includes("update") || sessionStorage.getItem("buttonData").includes("edit")) {
            $scope.mainGrid.columns.push({
                command: [
                    {
                        template:
                            '<div class="flex justify-center gap-3"><button class="grid-btn k-grid-edit" ng-click=\'update(dataItem)\'><div class="nimis-icon edit"></div></button><button class="grid-btn k-grid-remove-command" ng-click=\'deleteData(dataItem)\'><div class="nimis-icon delete"></div></button></div>',
                    },
                ],
                headerAttributes: {class: "rightMinus"},
                attributes: {class: "rightMinus uk-text-center"},
                sticky: true,
                title: "&nbsp;",
                width: 81,
            });
        }
        //{name: "edit", text: {edit: " ", update: " ", cancel: " "}},
        $scope.detailGridOptions = function (dataItem) {
            return {
                dataSource: {
                    transport: {
                        read: {
                            url: __env.apiUrl() + "/api/nms/menu/data/list",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            data: {sort: [{field: "orderId", dir: "asc"}]},
                            beforeSend: function (req) {
                                req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
                            },
                        },
                        create: {
                            url: __env.apiUrl() + "/api/nms/menu/create",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            beforeSend: function (req) {
                                req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
                            },
                            complete: function (e) {
                                $("#detGrid").data("kendoGrid").dataSource.read();
                            },
                        },
                        update: {
                            url: __env.apiUrl() + "/api/nms/menu/update",
                            contentType: "application/json; charset=UTF-8",
                            type: "PUT",
                            beforeSend: function (req) {
                                req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
                            },
                            complete: function (e) {
                                $("#detGrid").data("kendoGrid").dataSource.read();
                            },
                        },
                        destroy: {
                            url: __env.apiUrl() + "/api/nms/menu/delete",
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
                                id: {editable: false, nullable: true},
                                name: {type: "string", validation: {required: true}},
                                parentId: {type: "number", defaultValue: 0},
                                orderId: {type: "number"},
                                url: {type: "string"},
                                comCd: {type: "string"},
                                icon: {type: "string"},
                                langKey: {type: "string"},
                                useYn: {type: "number", defaultValue: 0},
                            },
                        },
                    },
                    pageSize: 20,
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true,
                    filter: {field: "parentId", operator: "eq", value: dataItem.id},
                },
                scrollable: false,
                sortable: true,
                pageable: false,
                editable: "inline",
                columns: [
                    {
                        title: "#",
                        headerAttributes: {class: "checkbox-align"},
                        attributes: {style: "text-align: center;"},
                        template: "#= ++record2 #",
                        sticky: true,
                        width: 49,
                    },
                    {
                        field: "name",
                        width:250,
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        headerAttributes: {class: "columnHeader"},
                        title: '{{"Menu name" | translate}}',
                    },
                    {
                        field: "url",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        headerAttributes: {class: "columnHeader"},
                        title: '{{"Url" | translate}}',
                    },
                    {
                        field: "orderId",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        headerAttributes: {class: "columnHeader"},
                        title: '{{"Sort" | translate}}',
                    },
                    {
                        field: "pageType",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        headerAttributes: {class: "columnHeader"},
                        width: 100,
                        title: "Төрөл",
                    },
                    {
                        field: "moduleName",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        headerAttributes: {class: "columnHeader"},
                        title: "Дэд систем",
                    },
                    {
                        field: "privilegeName",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        headerAttributes: {class: "columnHeader"},
                        width: 200,
                        title: "Үйлдэл",
                    },
                    {
                        command: [
                            {
                                template:
                                    '<div class="flex justify-center gap-3"><button class="grid-btn k-grid-edit" ng-click=\'update(dataItem)\'><div class="nimis-icon edit"></div></button><button class="grid-btn k-grid-remove-command" ng-click=\'deleteData(dataItem)\'><div class="nimis-icon delete"></div></button></div>',
                            },
                        ],
                        title: "&nbsp;",
                        width: 80,
                    }
                ],
                dataBinding: function () {
                    record2 = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                },
            };
        };

        mainService
            .withdata(
                "post",
                "/api/nms/module/list",
                JSON.stringify({
                    filter: {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1}]},
                    sort: [{field: "name", dir: "asc"}],
                    take: 60,
                    skip: 0,
                    page: 1,
                    pageSize: 60,
                })
            )
            .then(function (data) {
                $scope.allModuleDataSource = data.data;
                $scope.itemModuleDataSource = data.data;
            });
        mainService
            .withdata(
                "post",
                "/api/nms/privilege/list",
                JSON.stringify({
                    filter: {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1}]},
                    sort: [{field: "name", dir: "asc"}],
                    take: 60,
                    skip: 0,
                    page: 1,
                    pageSize: 60,
                })
            )
            .then(function (data) {
                $scope.allActionDataSource = data.data;
                $scope.itemActionDataSource = data.data;
            });
        mainService
            .withdata(
                "post",
                "/api/nms/icon/list",
                JSON.stringify({
                    filter: {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1},{field: "typeStr", operator: "eq", value: 'transparent'}]},
                    sort: [{field: "name", dir: "asc"}],
                    take: 60,
                    skip: 0,
                    page: 1,
                    pageSize: 60,
                })
            )
            .then(function (data) {
                $scope.iconDataSource = data.data;
            });
        $scope.checkAll = function (e) {
            $scope.itemModuleDataSource.map(function (i) {
                $scope.modules[parseInt(i.id)] = $scope.isCheckAll == "all" ? 0 : 1;
            });
            $scope.isCheckAll = $scope.isCheckAll == "all" ? "" : "all";
        };

        $scope.changeCheckbox = function () {
            $scope.isCheckAll = "";
        };

        $scope.uncheckAll = function () {
            $scope.modules = {};
        };

        $scope.selectOptions = {
            placeholder: "...",
            dataTextField: "name",
            dataValueField: "id",
            valuePrimitive: true,
            autoBind: false,
            dataSource: $scope.actionDataSource,
        };

        $scope.ddlDataSource = new kendo.data.HierarchicalDataSource({
            transport: {
                read: {
                    url: __env.apiUrl() + "/api/nms/menu/data/list",
                    contentType: "application/json; charset=UTF-8",
                    type: "POST",
                    data: {sort: [{field: "orderId", dir: "asc"}]},
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
            },
            pageSize: 200,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            filter: {field: "parentId", operator: "isnull", value: true},
        });

        $scope.tabChange = function (val) {
            if (!$scope.dataItem.main && $scope.dataItem.id !== null && $scope.dataItem.id !== undefined) {
                $scope.ddlDataSource.filter({
                    logic: "and",
                    filters: [
                        {field: "parentId", operator: "isnull", value: true},
                        {field: "id", operator: "neq", value: $scope.dataItem.id},
                    ],
                });
                var parentData = $scope.ddlDataSource.data();
                var parentItem = parentData.filter((i) => i.id == $scope.dataItem.parentId)[0];

                $scope.itemActionDataSource = $scope.allActionDataSource.filter((i) => parentItem.privilegeIds.includes(i.id));
                $scope.itemModuleDataSource = $scope.allModuleDataSource.filter((i) => parentItem.moduleIds.includes(i.id));
            } else {
                $scope.itemActionDataSource = $scope.allActionDataSource;
                $scope.itemModuleDataSource = $scope.allModuleDataSource;
                $scope.ddlDataSource.filter({
                    logic: "and",
                    filters: [
                        {field: "parentId", operator: "isnull", value: true}
                    ],
                });
            }
        };

        $scope.parentChange = function (e) {
            var parentData = $scope.ddlDataSource.data();
            var parentItem = parentData.filter((i) => i.id == $scope.dataItem.parentId)[0];

            if (parentItem) {
                $scope.dataItem.pageType = parentItem.pageType;
                $scope.itemActionDataSource = $scope.allActionDataSource.filter((i) => parentItem.privilegeIds.includes(i.id));
                $scope.itemModuleDataSource = $scope.allModuleDataSource.filter((i) => parentItem.moduleIds.includes(i.id));
            }
        };
    },
]);
