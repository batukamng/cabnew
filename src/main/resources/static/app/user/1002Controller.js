angular
    .module('altairApp')
    .controller(
        '1002Ctrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$timeout',
            'mainService',
            'commonDataSource',
            'fileUpload',
            '__env',
            function ($rootScope, $state, $scope, $timeout, mainService, commonDataSource, fileUpload, __env) {
                $scope.user = JSON.parse(localStorage.getItem('currentUser'));
                $scope.modalUpload = function (i) {
                    UIkit.modal('#modal_upload', {
                        modal: false,
                        keyboard: false,
                        bgclose: false,
                        center: false
                    }).show();
                };

                $scope.fileSelected = false;
                $scope.selectFile = function () {
                    $scope.fileSelected = true;
                };

                $scope.submitUploadDifference = function (i) {
                    if ($scope.formFile.act.$valid && $scope.act) {
                        $scope.uploadExcel($scope.act);
                    }
                };

                $scope.checkFilterDataSource = commonDataSource.urlPageDataSource("/api/org/list", JSON.stringify({ "custom": "where typeId=1 and useYn=true" }), 200);

                $scope.uploadExcel = function (file) {
                    UIkit.modal('#modal_loader', {
                        modal: false,
                        keyboard: false,
                        bgclose: false,
                        center: true
                    }).show();

                    var formDataAttach = new FormData();
                    formDataAttach.append("file", file);
                    UIkit.modal('#modal_upload').hide();

                    fileUpload.uploadFileToUrl("/api/user/import", formDataAttach).then(function (resp) {
                        $(".k-grid").data("kendoGrid").dataSource.read();
                        UIkit.modal('#modal_loader').hide();
                    });
                };



                $scope.passEditor = function (container, options) {
                    var editor = $('<input data-text-field="' + options.field + '" ' +
                        'class="k-input k-textbox" ' +
                        'type="password" ' +
                        'data-value-field="' + options.field + '" ' +
                        'data-bind="value:' + options.field + '"/>')
                        .appendTo(container);
                };

                $scope.aimagEditor = function (container, options) {
                    var arr = [];
                    if (options.model.amgId != null && options.model.amgId != 0) {
                        arr.push({ field: "id", operator: "eq", value: options.model.amgId })
                    }
                    $scope.amgDataSource = new kendo.data.DataSource({
                        transport: {
                            read: {
                                url: __env.apiUrl() + "/api/as/cd/list",
                                contentType: "application/json; charset=UTF-8",
                                data: { "custom": "where  length(asCd)=2", filter: { logic: "and", filters: arr } },
                                type: "POST",
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
                            total: "total"
                        },
                        pageSize: 20,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    });
                    var editor = $('<select kendo-drop-down-list  k-filter="\'startswith\'" k-data-text-field="\'cdNm\'" k-data-value-field="\'id\'" k-data-source="amgDataSource" data-bind="value:' + options.field + '"></select>')
                        .appendTo(container);
                };
                $scope.sponsorEditor = function (container, options) {
                    var arr = [];
                    if (options.model.spoId != null && options.model.spoId != 0) {
                        arr.push({ field: "id", operator: "eq", value: options.model.spoId })
                    }
                    $scope.spoDataSource = new kendo.data.DataSource({
                        transport: {
                            read: {
                                url: __env.apiUrl() + "/api/org/list",
                                contentType: "application/json; charset=UTF-8",
                                data: { "custom": "where typeId=2", filter: { logic: "and", filters: arr } },
                                type: "POST",
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
                            total: "total"
                        },
                        pageSize: 20,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    });
                    var editor = $('<select kendo-drop-down-list  k-filter="\'startswith\'" required k-data-text-field="\'name\'" k-data-value-field="\'id\'" k-data-source="spoDataSource" data-bind="value:' + options.field + '"></select>')
                        .appendTo(container);
                };
                $scope.checkEditor = function (container, options) {
                    var arr = [];
                    if (options.model.checkId != null && options.model.checkId != 0) {
                        arr.push({ field: "id", operator: "eq", value: options.model.checkId })
                    }
                    $scope.checkDataSource = new kendo.data.DataSource({
                        transport: {
                            read: {
                                url: __env.apiUrl() + "/api/org/list",
                                contentType: "application/json; charset=UTF-8",
                                data: { filter: { logic: "and", filters: arr }, "custom": "where typeId=1 " },
                                type: "POST",
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
                            total: "total"
                        },
                        pageSize: 20,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    });
                    var editor = $('<select kendo-drop-down-list  k-filter="\'startswith\'" required k-data-text-field="\'name\'" k-data-value-field="\'id\'" k-data-source="checkDataSource" data-bind="value:' + options.field + '"></select>')
                        .appendTo(container);
                };
                $scope.governorEditor = function (container, options) {
                    var arr = [];
                    if (options.model.tezId != null && options.model.tezId != 0) {
                        arr.push({ field: "id", operator: "eq", value: options.model.tezId })
                    }
                    $scope.governorDataSource = new kendo.data.DataSource({
                        transport: {
                            read: {
                                url: __env.apiUrl() + "/api/gen/gov/list",
                                contentType: "application/json; charset=UTF-8",
                                data: { filter: { logic: "and", filters: arr } },
                                type: "POST",
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
                            total: "total"
                        },
                        pageSize: 20,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    });

                    var editor = $('<input kendo-drop-down-list k-data-text-field="\'name\'" k-data-value-field="\'id\'" k-data-source="governorDataSource" data-bind="value:' + options.field + '"/>')
                        .appendTo(container);
                };

                $scope.roleEditor = function (container, options) {
                    var roles = $scope.selectedIds = [];
                    angular.forEach(options.model.roles, function (value, key) {
                        roles.push(value.id);
                    });
                    $scope.selectOptions = {
                        placeholder: "Эрх сонгох...",
                        dataTextField: "name",
                        dataValueField: "id",
                        valuePrimitive: true,
                        autoBind: true,
                        dataSource: {
                            transport: {
                                read: {
                                    url: __env.apiUrl() + "/api/role/list",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "POST",
                                    data: { "custom": "where auth='Tra0202'", "sort": [{ field: 'id', dir: 'desc' }] },
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
                                total: "total"
                            },
                            pageSize: 20,
                            serverPaging: true,
                            serverFiltering: true,
                            serverSorting: true
                        }
                    };

                    var editor = $('<select  kendo-multi-select  k-ng-model="selectedIds" k-options="selectOptions" required data-bind="value:' + options.field + '"></select>')
                        .appendTo(container);
                };

                $scope.mainGrid = {
                    dataSource: {
                        transport: {
                            read: {
                                url: function (e) {
                                    if (localStorage.getItem("buttonData").includes("read") && JSON.parse(localStorage.getItem('menuData')).url === $state.current.name) {
                                        return __env.apiUrl() + "/api/user/list";
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
                                data: { "custom": "where userType=6", "sort": [{ field: 'id', dir: 'desc' }] },
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                }
                            },
                            update: {
                                url: __env.apiUrl() + "/api/user/update",
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
                                url: __env.apiUrl() + "/api/user/delete",
                                contentType: "application/json; charset=UTF-8",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                },
                                complete: function (e) {
                                    $(".k-grid").data("kendoGrid").dataSource.read();
                                },
                                type: "DELETE"
                            },
                            create: {
                                url: __env.apiUrl() + "/api/user/create",
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
                            }
                        },
                        schema: {
                            data: "data",
                            total: "total",
                            model: {
                                id: "id",
                                fields: {
                                    id: { type: "number", nullable: true },
                                    lutRoles: [],
                                    roles: [],
                                    privileges: [],
                                    orgId: { type: "number", defaultValue: 0 },
                                    tezId: { type: "number", defaultValue: 0 },
                                    spoId: { type: "number", defaultValue: 0 },
                                    checkId: { type: "number", defaultValue: 0 },
                                    amgId: { type: "number", defaultValue: 0 },
                                    userType: { type: "number", defaultValue: 6 },
                                    useYn: { type: "boolean", defaultValue: true },
                                    governor: { nullable: true },
                                    sponsor: { nullable: true },
                                    aimag: { nullable: true },
                                    check: { nullable: true },
                                    organization: { nullable: true },
                                    position: { nullable: true },
                                    division: { nullable: true }
                                }
                            }
                        },
                        pageSize: 15,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    },
                    filterable: {
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
                        fileName: "user.xlsx",
                        filterable: true,
                        allPages: true
                    },
                    pageable: {
                        refresh: true,
                        pageSizes: true,
                        buttonCount: 5
                    },
                    columns: [
                        { title: "#", sticky: true, headerAttributes: { "class": "columnHeader" }, template: "<span class='row-number'></span>", width: "50px" },
                        {
                            field: "checkId", dataTextField: "name", dataValueField: "id",
                            filterable: { cell: { operator: "contains" } },
                            dataSource: $scope.checkFilterDataSource, sticky: true, headerAttributes: { "class": "columnHeader" }, width: 250, template: "#if(check!=null){# <span>#=check.name#</span> #}#", editor: $scope.checkEditor, title: 'Төсвийн ерөнхийлөн захирагч'
                        },
                        { field: "email", stickable: true, headerAttributes: { "class": "columnHeader" }, title: '{{"Email" | translate}}', width: 200 },
                        { field: "firstName", stickable: true, headerAttributes: { "class": "columnHeader" }, title: '{{"firstName" | translate}}', width: 200 },
                        { field: "lastName", stickable: true, headerAttributes: { "class": "columnHeader" }, title: '{{"lastName" | translate}}', width: 200 },
                        { field: "username", sticky: true, headerAttributes: { "class": "columnHeader" }, title: '{{"Username" | translate}}', width: 200 },
                        {
                            field: "password", stickable: true, headerAttributes: { "class": "columnHeader" }, editor: function (container, options) {
                                $('<input data-text-field="' + options.field + '" ' +
                                    'class="k-input k-textbox" ' +
                                    'type="password" ' +
                                    'data-value-field="' + options.field + '" ' +
                                    'data-bind="value:' + options.field + '"/>')
                                    .appendTo(container)
                            }, title: '{{"Password" | translate}}', template: "...", width: 200
                        },
                        { field: "roles", stickable: true, width: 200, headerAttributes: { "class": "columnHeader" }, editor: $scope.roleEditor, filterable: false, template: "#if(roles!=null){# #for (var i=0,len=roles.length; i<len; i++){#<span>${ roles[i].name } #if(i!=roles.length-1){#<span>,</span>#}# </span> # } # #}# ", title: '{{"Role" | translate}}' },
                    ],
                    dataBound: function () {
                        var rows = this.items();
                        $(rows).each(function () {
                            var index = $(this).index() + 1
                                + ($(".k-grid").data("kendoGrid").dataSource.pageSize() * ($(".k-grid").data("kendoGrid").dataSource.page() - 1));
                            var rowLabel = $(this).find(".row-number");
                            $(rowLabel).html(index);
                        });
                    },
                    editable: "inline",
                    scrollable: true,
                    height: function () {
                        return $(window).height() - 110;
                    }
                };

                if (localStorage.getItem('buttonData').includes("R")) {
                    $scope.mainGrid.toolbar = ["excel", "search"];
                }
                if (localStorage.getItem('buttonData').includes("C")) {
                    $scope.mainGrid.toolbar = [{ template: "<button class=\"k-button k-button-icontext k-grid-add\"><span class=\"k-icon k-i-plus\"></span>Нэмэх</button><button class=\"k-button k-button-icontext\" ng-click='modalUpload()'><span class=\"k-icon k-i-import\"></span>Импорт</button>" }, "search"];
                }
                if (localStorage.getItem('buttonData').includes("U")) {
                    $scope.mainGrid.columns.push({
                        command: [
                            { name: "edit", text: { edit: " ", update: " ", cancel: " " } },
                            { name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn" }
                        ], title: "&nbsp;", sticky: true, width: 100
                    });
                }
            }
        ]
    );
