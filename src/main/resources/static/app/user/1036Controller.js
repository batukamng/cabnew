angular
    .module('altairApp')
    .controller(
        '1036Ctrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$timeout',
            'mainService',
            'fileUpload',
            'items',
            '__env',
            function ($rootScope, $state, $scope, $timeout, mainService, fileUpload, items, __env) {
                $scope.user = JSON.parse(sessionStorage.getItem('currentUser'));
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

                $scope.comDataSource = new kendo.data.DataSource({
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: "/api/comCd/data/list",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            },
                            data: {
                                filter: {
                                    logic: "and",
                                    filters: [{ field: "grpCd", operator: "eq", value: "position" }]
                                }
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
                    pageSize: 50,
                    serverPaging: true
                });
                $scope.divDataSource = new kendo.data.DataSource({
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: "/api/comCd/list",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            },
                            data: {
                                filter: {
                                    logic: "and",
                                    filters: [{ field: "grpCd", operator: "eq", value: "division" }]
                                }
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
                    pageSize: 50,
                    serverPaging: true
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
                                url: __env.apiUrl() + "/api/role/data/list",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
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
                            total: "total"
                        },
                        pageSize: 20,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    }
                };
                $scope.selectPrivilegeOptions = {
                    placeholder: "Тусгай эрх сонгох...",
                    dataTextField: "name",
                    dataValueField: "id",
                    valuePrimitive: true,
                    autoBind: true,
                    dataSource: {
                        transport: {
                            read: {
                                url: __env.apiUrl() + "/api/privilege/data/list",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
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
                            total: "total"
                        },
                        pageSize: 20,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    }
                };
                $scope.orgDataSource = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: __env.apiUrl() + "/api/org/list",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
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
                        total: "total"
                    },
                    pageSize: 20,
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true
                });

                $scope.passEditor = function (container, options) {
                    var editor = $('<input data-text-field="' + options.field + '" ' +
                        'class="k-input k-textbox" ' +
                        'type="password" ' +
                        'data-value-field="' + options.field + '" ' +
                        'data-bind="value:' + options.field + '"/>')
                        .appendTo(container);
                };
                $scope.orgEditor = function (container, options) {
                    var arr = [];
                    if (options.model.orgId != null && options.model.orgId != 0) {
                        arr.push({ field: "id", operator: "eq", value: options.model.orgId })
                    }
                    $scope.orgDataSource = new kendo.data.DataSource({
                        transport: {
                            read: {
                                url: __env.apiUrl() + "/api/org/list",
                                contentType: "application/json; charset=UTF-8",
                                data: { filter: { logic: "and", filters: arr } },
                                type: "POST",
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
                            total: "total"
                        },
                        pageSize: 20,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    });
                    /*$scope.orgDataSource .filter(
                        {
                            field: "id",
                            operator: "eq" ,
                            value: options.model.orgId
                        });*/

                    var editor = $('<select kendo-drop-down-list  k-filter="\'startswith\'" required k-data-text-field="\'name\'" k-data-value-field="\'id\'" k-data-source="orgDataSource" data-bind="value:' + options.field + '"></select>')
                        .appendTo(container);
                };
                $scope.posEditor = function (container, options) {
                    var editor = $('<input kendo-drop-down-list required k-data-text-field="\'comCdNm\'" k-data-value-field="\'id\'" k-data-source="comDataSource" data-bind="value:' + options.field + '"/>')
                        .appendTo(container);
                };
                $scope.divEditor = function (container, options) {
                    var editor = $('<input kendo-drop-down-list required k-data-text-field="\'comCdNm\'" k-data-value-field="\'id\'" k-data-source="divDataSource" data-bind="value:' + options.field + '"/>')
                        .appendTo(container);
                };
                $scope.roleEditor = function (container, options) {
                    var editor = $('<select  kendo-multi-select k-options="selectOptions" required data-bind="value:' + options.field + '"></select>')
                        .appendTo(container);
                };

                $scope.privilegeEditor = function (container, options) {
                    var editor = $('<select  kendo-multi-select k-options="selectPrivilegeOptions" required data-bind="value:' + options.field + '"></select>')
                        .appendTo(container);
                };

                var yesNo = [{ "text": "N", "value": false }, { "text": "Y", "value": true }];
                $scope.mainGrid = {
                    dataSource: {
                        transport: {
                            read: {
                                url: function (e) {
                                    if (sessionStorage.getItem("buttonData").includes("read") && JSON.parse(sessionStorage.getItem('menuData')).url === $state.current.name) {
                                        return __env.apiUrl() + "/api/user/list";
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
                                data: { sort: [{ field: "id", dir: "desc" }] },
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                }
                            },
                            update: {
                                url: __env.apiUrl() + "/api/user/update",
                                contentType: "application/json; charset=UTF-8",
                                type: "PUT",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                },
                                complete: function (e) {
                                    $(".k-grid").data("kendoGrid").dataSource.read();
                                }
                            },
                            destroy: {
                                url: __env.apiUrl() + "/api/user/delete",
                                contentType: "application/json; charset=UTF-8",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
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
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
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
                                    orgId: { type: "number" },
                                    ordNum: { type: "number" },
                                    posId: { type: "number" },
                                    divId: { type: "number" },
                                    useYn: { type: "boolean" },
                                    userType: { type: "number" },
                                    lutOrganization: { nullable: true },
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
                        { title: "#", headerAttributes: { "class": "columnHeader" }, template: "<span class='row-number'></span>", width: "50px" },
                        { field: "orgId", headerAttributes: { "class": "columnHeader" }, width: 150, template: "#if(organization!=null){# <span>#=organization.name#</span> #}#", editor: $scope.orgEditor, title: '{{"Org" | translate}}' },
                        { field: "posId", headerAttributes: { "class": "columnHeader" }, width: 150, template: "#if(position!=null){# <span>#=position.comCdNm#</span> #}#", values: items, title: '{{"Pos" | translate}}' },
                        { field: "email", headerAttributes: { "class": "columnHeader" }, title: '{{"Email" | translate}}', width: 150 },
                        { field: "firstName", headerAttributes: { "class": "columnHeader" }, title: '{{"firstName" | translate}}', width: 100 },
                        { field: "lastName", headerAttributes: { "class": "columnHeader" }, title: '{{"lastName" | translate}}', width: 100 },
                        { field: "username", headerAttributes: { "class": "columnHeader" }, title: '{{"Username" | translate}}', width: 150, },
                        {
                            field: "password", headerAttributes: { "class": "columnHeader" }, editor: function (container, options) {
                                $('<input data-text-field="' + options.field + '" ' +
                                    'class="k-input k-textbox" ' +
                                    'type="password" ' +
                                    'data-value-field="' + options.field + '" ' +
                                    'data-bind="value:' + options.field + '"/>')
                                    .appendTo(container)
                            }, title: '{{"Password" | translate}}', template: "...", width: 100
                        },
                        {
                            field: "useYn", headerAttributes: { "class": "columnHeader" }, title: '{{"useYn" | translate}}', width: 100
                        },
                        { field: "userType", headerAttributes: { "class": "columnHeader" }, title: '{{"userType" | translate}}', width: 100 },
                        { field: "roles", width: 150, headerAttributes: { "class": "columnHeader" }, editor: $scope.roleEditor, filterable: false, template: "#if(roles!=null){# #for (var i=0,len=roles.length; i<len; i++){#<span>${ roles[i].name } #if(i!=roles.length-1){#<span>,</span>#}# </span> # } # #}# ", title: '{{"Role" | translate}}' },
                        /* {field: "privileges",width:150,headerAttributes: {"class": "columnHeader"},editor:$scope.privilegeEditor, filterable:false,  template:"#for (var i=0,len=privileges.length; i<len; i++){#<span>${ privileges[i].name } #if(i!=privileges.length-1){#<span>,</span>#}# </span> # } #", title: '{{"Role special" | translate}}'}*/
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

                if (sessionStorage.getItem('buttonData').includes("R")) {
                    $scope.mainGrid.toolbar = ["excel", "search"];
                }
                if (sessionStorage.getItem('buttonData').includes("C")) {
                    $scope.mainGrid.toolbar = [{ template: "<button class=\"k-button k-button-icontext k-grid-add\"><span class=\"k-icon k-i-plus\"></span>Нэмэх</button>" }, "search"];
                }
                if (sessionStorage.getItem('buttonData').includes("U")) {
                    $scope.mainGrid.columns.push({
                        command: [
                            { name: "edit", text: { edit: " ", update: " ", cancel: " " } },
                            { name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn" }
                        ], title: "&nbsp;", width: 100
                    });
                }

                /*       if(JSON.parse(sessionStorage.getItem('privilege'))!=null){
                           var privileges=JSON.parse(sessionStorage.getItem('privilege'));
                           angular.forEach(privileges, function(value, key) {
                               if(value.name==='WRITE'){
                                   $scope.mainGrid.toolbar = [{template:"<button class=\"k-button k-button-icontext k-grid-add\"><span class=\"k-icon k-i-plus\"></span>Нэмэх</button>"},"search"];
                               }
                               if(value.name==='UPDATE'){
                                   $scope.mainGrid.columns.push({
                                       command: [
                                           {name: "edit", text: {edit: " ", update: " ", cancel: " "}},
                                           {name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn"}
                                       ], title: "&nbsp;", width: 110
                                   });
                               }
                           });
                       }*/
            }
        ]
    );
