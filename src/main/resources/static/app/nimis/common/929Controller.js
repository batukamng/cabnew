angular
    .module('altairApp')
    .controller(
        '929NmsCtrl',
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
                                    return __env.apiUrl() + "/api/nms/as/code/list";
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
                            data: { sort: [{ field: "asCd", dir: "asc" }] },
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                            }
                        },
                        update: {
                            url: __env.apiUrl() + "/api/nms/as/code",
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
                            url: __env.apiUrl() + "/api/nms/as/code/",
                            contentType: "application/json; charset=UTF-8",
                            type: "DELETE",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                            }
                        },
                        create: {
                            url: __env.apiUrl() + "/api/nms/as/code",
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
                                parentId: { type: "number" },  longitude: { type: "number" },  latitude: { type: "number" },
                                asCd: { type: "string", validation: { required: true} },
                                cdNm: { type: "string", validation: { required: true} },
                                staCode: { type: "string"},
                                cdNmEng: { type: "string" },  center: { type: "string" },
                                useYn: { type: "number", defaultValue: 1 }
                            }
                        }
                    },
                    pageSize: 20,
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true,
                    filter: {logic: "and", filters: [{field: "parentId", operator: "isnull", value: true},{field: "useYn", operator: "eq", value: 1}]}
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
                    excel: {
                        fileName: "Organization Export.xlsx",
                        proxyURL: "//demos.telerik.com/kendo-ui/service/export",
                        filterable: true,
                        allPages: true
                    },
                    pageable: {
                        refresh: true,
                        pageSizes: true,
                        buttonCount: 5
                    },
                    columns: [
                        {
                            title: '{{"Num" | translate}}',
                            headerAttributes: { "class": "columnHeader" },
                            template: "<span class='row-number' style='text-align: center; float: left; width: 100%;'></span>",
                            width: 60
                        },
                        { field: "cdNm", template:"#if(image!=null){# <div class='avatar-photo' style='background-image: url(#:image.uri#);'></div> <div class='user-name'>#: cdNm # </div>#}else{# #: cdNm # #}#", filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: { "class": "columnHeader" }, title: 'Нэр' },
                        {
                            field: "staCode", title: 'ҮСХ код',
                            headerAttributes: { "class": "columnHeader" },
                            filterable: { cell: { operator: "contains", showOperators: false } },
                            width: 150
                        },
                        {
                            field: "asCd", title: 'Kод',
                            headerAttributes: { "class": "columnHeader" },
                            filterable: { cell: { operator: "contains", showOperators: false } },
                            width: 150
                        },
                        {
                            field: "cdNmEng", title: 'Англи',
                            headerAttributes: { "class": "columnHeader" },
                            filterable: { cell: { operator: "contains", showOperators: false } },
                        },
                        {
                            field: "longitude", title: 'Уртраг',
                            headerAttributes: { "class": "columnHeader" },
                            filterable: { cell: { operator: "contains", showOperators: false } },
                        },
                        {
                            field: "latitude", title: 'Өргөрөг',
                            headerAttributes: { "class": "columnHeader" },
                            filterable: { cell: { operator: "contains", showOperators: false } },
                        },
                     ],
                    dataBound: function () {
                        //  this.expandRow(this.tbody.find("tr.k-master-row").first());
                        var rows = this.items();
                        $(rows).each(function () {
                            var index = $(this).index() + 1
                                + ($(".k-grid").data("kendoGrid").dataSource.pageSize() * ($(".k-grid").data("kendoGrid").dataSource.page() - 1));
                            var rowLabel = $(this).find(".row-number");
                            $(rowLabel).html(index);
                        });
                    },
                    editable: "inline",

                    height: function () {
                        return $(window).height() - 110;
                    }
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
                                success: function (response) { },
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
                        if(e.operation=='upload'){
                            $scope.dataItem.imageId=e.response.id;
                        }
                        $scope.fileDtl = e.response;
                    },
                    upload: function (e) {
                        var xhr = e.XMLHttpRequest;
                        if (xhr) {
                            xhr.addEventListener("readystatechange", function (e) {
                                if (xhr.readyState == 1 /* OPENED */) {
                                    xhr.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                }
                            });
                        }
                    },
                    dropZone: ".dropZoneElement"
                };

                $scope.dataSubmit=function (){
                    if ($scope.validator.validate()) {
                        mainService.withdata('post', __env.apiUrl() + '/api/nms/as/code/submit', $scope.dataItem)
                            .then(function (data) {
                                    modalForm.hide();
                                    $(".k-grid").data("kendoGrid").dataSource.read();
                                    $rootScope.alert(true, "Амжилттай.");
                                }
                            );
                    }
                }

                var modalForm = UIkit.modal("#modal_form", {
                    modal: false,
                    keyboard: false,
                    bgclose: false,
                    center: true
                });

                $scope.add = function (){
                    $scope.dataItem={useYn:1};
                    modalForm.show();
                }
                $scope.update = function (item){
                    $scope.dataItem=item;
                    modalForm.show();
                }

                if (localStorage.getItem('buttonData').includes("read")) {
                    $scope.mainGrid.toolbar = ["excel", "search"];
                }
                if (localStorage.getItem('buttonData').includes("create")) {
                    $scope.mainGrid.toolbar = [
                        { template: "<button class='md-btn custom-btn' ng-click='add()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>" },
                        "search"
                    ];
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
                                    url: __env.apiUrl() + "/api/nms/as/code/list",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "POST",
                                    data: { sort: [{ field: "asCd", dir: "asc" }] },
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                    }
                                },
                                update: {
                                    url: __env.apiUrl() + "/api/nms/as/code/" + dataItem.id,
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
                                    url: __env.apiUrl() + "/api/nms/as/code/delete",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "DELETE",
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                    }
                                },
                                create: {
                                    url: __env.apiUrl() + "/api/nms/sector",
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
                                        longitude: { type: "number" },  latitude: { type: "number" },
                                        asCd: { type: "string", validation: { required: true} },
                                        cdNm: { type: "string", validation: { required: true} },
                                        staCode: { type: "string"},
                                        cdNmEng: { type: "string" },  center: { type: "string" },
                                        parentId: { type: "number", defaultValue: dataItem.id },
                                        useYn: { type: "number", defaultValue: 1 },
                                        isCenter: { type: "number" }
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
                        toolbar: [
                            { template: "<button class='md-btn custom-btn k-grid-add'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>" },
                            {template: "<span class=\"k-grid-search k-display-flex\" style='font-weight: 500;width: auto;margin-right: 5px;'>Сум / Дүүрэг</span>"}
                        ],
                        editable: "inline",
                        columns: [
                            {
                                title: '{{"Num" | translate}}',
                                headerAttributes: { "class": "columnHeader" },
                                template: "<span class='row-number' style='text-align: center; float: left; width: 100%;'></span>",
                                width: 60
                            },
                            {
                                field: "staCode", title: 'ҮСХ код',
                                headerAttributes: { "class": "columnHeader" },
                                filterable: { cell: { operator: "contains", showOperators: false } },
                                width: 150
                            },
                            {
                                field: "asCd", title: 'Kод',
                                headerAttributes: { "class": "columnHeader" },
                                filterable: { cell: { operator: "contains", showOperators: false } },
                                width: 150
                            },
                            {
                                field: "cdNm", title: 'Нэр',
                                headerAttributes: { "class": "columnHeader" },
                                filterable: { cell: { operator: "contains", showOperators: false } },
                            },
                            {
                                field: "cdNmEng", title: 'Англи',
                                headerAttributes: { "class": "columnHeader" },
                                filterable: { cell: { operator: "contains", showOperators: false } },
                            },
                            {
                                field: "longitude", title: 'Уртраг',
                                headerAttributes: { "class": "columnHeader" },
                                filterable: { cell: { operator: "contains", showOperators: false } },
                            },
                            {
                                field: "latitude", title: 'Өргөрөг',
                                headerAttributes: { "class": "columnHeader" },
                                filterable: { cell: { operator: "contains", showOperators: false } },
                            },
                            {
                                field: "isCenter", title: 'Төв сум эсэх',
                                headerAttributes: { "class": "columnHeader" },
                                filterable: { cell: { operator: "contains", showOperators: false } },
                                template: "#if(isCenter===1){# <span class='columnCenter'>Тийм</span> #}else{#<span class='columnCenter'>Үгүй</span> #}#"
                            },
/*
                            {
                                field: "useYn",
                                headerAttributes: { "class": "columnHeader" },
                                width: 130,
                                template: "#if(useYn===true){# <span class='columnCenter'>Y</span> #}else{#<span class='columnCenter uk-text-danger'>N</span> #}#",
                                title: '{{"Cmn06" | translate}}'
                            },
*/
                            {
                                command: [
                                    {
                                        template:
                                            '<div class="command-container"><a class="grid-btn k-grid-edit"><div class="nimis-icon edit"></div></a><a class="grid-btn k-grid-remove-command"><div class="nimis-icon delete"></div></a><a class="grid-btn k-grid-update"><div class="nimis-icon update"></div></a> <a class="grid-btn k-grid-cancel"><div class="nimis-icon cancel"></div></a></div>',
                                    },
                                ], title: "&nbsp;", width: 80
                            }
                        ],
                        dataBound: function () {
                            var rows = this.items();
                            $(rows).each(function () {
                                var index = $(this).index() + 1
                                    + ($(".k-grid").data("kendoGrid").dataSource.pageSize() * ($(".k-grid").data("kendoGrid").dataSource.page() - 1));
                                var rowLabel = $(this).find(".row-number");
                                $(rowLabel).html(index);
                            });
                        }
                    };
                };

                $scope.thirdGridOptions = function (dataItem) {
                    return {
                        dataSource: {
                            transport: {
                                read: {
                                    url: __env.apiUrl() + "/api/nms/as/code/list",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "POST",
                                    data: { sort: [{ field: "asCd", dir: "asc" }] },
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                    }
                                },
                                update: {
                                    url: __env.apiUrl() + "/api/nms/as/code/" + dataItem.id,
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
                                    url: __env.apiUrl() + "/api/nms/as/code/delete",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "DELETE",
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                    }
                                },
                                create: {
                                    url: __env.apiUrl() + "/api/nms/as/code",
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
                                        $("#thirdGrid").data("kendoGrid").dataSource.read();
                                    },
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                    }
                                },
                                parameterMap: function (options,type) {
                                   /* if(type==='update'){
                                        var item=JSON.parse(JSON.stringify(options));
                                        delete item["measurement"];
                                        return JSON.stringify(item);
                                    }*/
                                    return JSON.stringify(options);
                                }
                            },
                            schema: {
                                data: "data",
                                total: "total",
                                model: {
                                    id: "id",
                                    fields: {
                                        longitude: { type: "number" },  latitude: { type: "number" },
                                        asCd: { type: "string", validation: { required: true} },
                                        cdNm: { type: "string", validation: { required: true} },
                                        staCode: { type: "string"},
                                        cdNmEng: { type: "string" },  center: { type: "string" },
                                        parentId: { type: "number", defaultValue: dataItem.id },
                                        useYn: { type: "number", defaultValue: 1 }
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
                        toolbar: [
                            { template: "<button class='md-btn custom-btn k-grid-add'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>" },
                            {template: "<span class=\"k-grid-search k-display-flex\" style='font-weight: 500;width: auto;margin-right: 5px;'>Баг / хороо</span>"}
                        ],
                        editable: "inline",
                        columns: [
                            {
                                title: '{{"Num" | translate}}',
                                headerAttributes: { "class": "columnHeader" },
                                template: "<span class='row-number' style='text-align: center; float: left; width: 100%;'></span>",
                                width: 60
                            },
                            {
                                field: "staCode", title: 'ҮСХ код',
                                headerAttributes: { "class": "columnHeader" },
                                filterable: { cell: { operator: "contains", showOperators: false } },
                                width: 150
                            },
                            {
                                field: "asCd", title: 'Kод',
                                headerAttributes: { "class": "columnHeader" },
                                filterable: { cell: { operator: "contains", showOperators: false } },
                                width: 150
                            },
                            {
                                field: "cdNm", title: 'Нэр',
                                headerAttributes: { "class": "columnHeader" },
                                filterable: { cell: { operator: "contains", showOperators: false } },
                            },
                            {
                                field: "cdNmEng", title: 'Англи',
                                headerAttributes: { "class": "columnHeader" },
                                filterable: { cell: { operator: "contains", showOperators: false } },
                            },
                            {
                                field: "longitude", title: 'Уртраг',
                                headerAttributes: { "class": "columnHeader" },
                                filterable: { cell: { operator: "contains", showOperators: false } },
                            },
                            {
                                field: "latitude", title: 'Өргөрөг',
                                headerAttributes: { "class": "columnHeader" },
                                filterable: { cell: { operator: "contains", showOperators: false } },
                            },
                            // { field: "useYn", headerAttributes: { "class": "columnHeader" }, width: 130, template: "#if(useYn===true){# <span class='columnCenter'>Y</span> #}else{#<span class='columnCenter uk-text-danger'>N</span> #}#", title: '{{"Cmn06" | translate}}' },
                            {
                                command: [
                                    {
                                        template:
                                            '<div class="command-container"><a class="grid-btn k-grid-edit"><div class="nimis-icon edit"></div></a><a class="grid-btn k-grid-remove-command"><div class="nimis-icon delete"></div></a><a class="grid-btn k-grid-update"><div class="nimis-icon update"></div></a> <a class="grid-btn k-grid-cancel"><div class="nimis-icon cancel"></div></a></div>',
                                    },
                                ], title: "&nbsp;", width: 80
                            }
                        ],
                        dataBound: function () {
                            var rows = this.items();
                            $(rows).each(function () {
                                var index = $(this).index() + 1
                                    + ($(".k-grid").data("kendoGrid").dataSource.pageSize() * ($(".k-grid").data("kendoGrid").dataSource.page() - 1));
                                var rowLabel = $(this).find(".row-number");
                                $(rowLabel).html(index);
                            });
                        }
                    };
                };
            }
        ]
    );
