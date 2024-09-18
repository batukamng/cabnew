angular
    .module('altairApp')
    .controller(
        '1050Ctrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$timeout',
            '__env',
            'fileUpload',
            '$translate',
            function ($rootScope, $state, $scope, $timeout, __env, fileUpload,$translate) {


                $scope.divEditor = function(container, options) {
                    $scope.divisionDataSource = new kendo.data.DataSource({
                        transport: {
                            read: {
                                url: __env.apiUrl() + "/api/comCd/list",
                                contentType: "application/json; charset=UTF-8",
                                data:{"custom":"where grpCd='division' and parentId is not null",sort: [{field: "id", dir: "desc"}]},
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
                    $scope.customOptions={
                        dataSource: $scope.divisionDataSource,
                        valuePrimitive:true
                    };
                    var editor = $('<select kendo-drop-down-list k-on-change="divChange(dataItem)"  k-options="customOptions" k-auto-bind="true" k-placeholder="\'Хэлтэс сонгох\'" ' +
                        'required k-data-text-field="\'comCdNm\'" k-data-value-field="\'id\'" data-bind="value:' + options.field + '"></select>')
                        .appendTo(container);
                };

                $scope.divChange=function(item){
                    $scope.noteDataSource = new kendo.data.DataSource({
                        transport: {
                            read: {
                                url: __env.apiUrl() + "/api/formNotes/list",
                                contentType: "application/json; charset=UTF-8",
                                data:{"custom":"where fl=1 and deptId="+item.divId+""},
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
                };

                $scope.dropdownGridOptions = {
                    valuePrimitive:true,
                    sortable: true,
                    pageable: true,
                    columns: [
                        {
                            field: "noteNm",
                            title: "Нэр",
                            width: 250
                        },
                        {
                            field: "reportType.comCdNm",
                            template:"#if(reportType!=null){# #=reportType.comCdNm# #}#",
                            title: "Тайлангийн төрөл",
                            width: 250
                        },
                        {
                            field: "groupType.comCdNm",
                            template:"#if(groupType!=null){# #=groupType.comCdNm# #}#",
                            title: "Харяалагдах бүлэг",
                            width: 250
                        }
                    ]
                };
                $scope.orgEditor = function(container, options) {

                    var editor = $('<select  kendo-multi-column-combo-box options="dropdownGridOptions" k-data-source="noteDataSource"  k-auto-bind="true" k-placeholder="\'Ажил сонгох\'" ' +
                        'k-filter="\'contains\'" required k-data-text-field="\'noteNm\'" k-data-value-field="\'id\'" data-bind="value:' + options.field + '"></select>')
                        .appendTo(container);
                };

                $scope.mainGrid = {
                    dataSource: {
                        transport: {
                            read: {
                                url: function (e) {
                                    if(sessionStorage.getItem("buttonData").includes("read") && JSON.parse(sessionStorage.getItem('menuData')).link===$state.current.name){
                                        return __env.apiUrl() + "/api/lutValidations/list";
                                    }
                                    else{
                                        sessionStorage.removeItem('currentUser');
                                        sessionStorage.removeItem('menuList');
                                        sessionStorage.removeItem('menuData');
                                        $state.go('login');
                                    }
                                },
                                data:{"custom":"where useYn=1"},
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                }
                            },
                            create: {
                                url: __env.apiUrl() +"/api/lutValidations/create",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                },
                                complete: function (e) {
                                    $(".k-grid").data("kendoGrid").dataSource.read();
                                }
                            },
                            update: {
                                url: __env.apiUrl() + "/api/lutValidations/update",
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
                                url: __env.apiUrl() + "/api/lutValidations/delete",
                                contentType: "application/json; charset=UTF-8",
                                type: "DELETE",
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
                                    id: {editable: false, nullable: true},
                                    eqType: {type: "number", validation: {required: true}},
                                    code1: {type: "string", validation: {required: true}},
                                    code2: {type: "string", validation: {required: true}},
                                    position1: {type: "string", validation: {required: true}},
                                    position2: {type: "string", validation: {required: true}},
                                    title1: {type: "string", validation: {required: true}},
                                    title2: {type: "string", validation: {required: true}},
                                    valMemo: {type: "string", validation: {required: true}},
                                    formNotes :{defaultValue:{}},
                                    division :{defaultValue:{}},
                                    formNote1 :{defaultValue:{}},
                                    formNote2 :{defaultValue:{}},
                                    useYn: {type: "boolean",defaultValue:true}
                                }
                            }
                        },
                        pageSize: 20,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    },
                    filterable: true,
                    sortable: true,
                    resizable: true,
                    pageable: {
                        pageSizes: ['All',20,50],
                        refresh: true,
                        buttonCount: 5,
                        message: {
                            empty: 'No Data',
                            allPages:'All'
                        }
                    },
                    columns: [
                        {
                            title: '№',
                            headerAttributes: {"class": "columnHeader columnCenter"},
                            template: "<span class='row-number'></span>",
                            width: "50px"
                        },
                        {field: "divId",editor: $scope.divEditor,template:"#if(division!=null){# #=division.comCdNm# #}#", title: "Хэлтэс"},
                        {field: "note1",editor: $scope.orgEditor,template:"#if(formNote1!=null){# #=formNote1.noteNm# #}#", title: "Маягт-1"},
                        {field: "code1", title: "Үзүүлэлт 1"},
                        {field: "position1", title: "Тайлбар"},
                        {field: "note2",editor: $scope.orgEditor,template:"#if(formNote2!=null){# #=formNote2.noteNm# #}#", title: "Маягт-2"},
                        {field: "code2", title: "Үзүүлэлт 2"},
                        {field: "position2", title: "Тайлбар"},
                        {field: "eqType", values:[{"text":"Их","value":1},{"text":"Бага","value":2},{"text":"Тэнцүү","value":3}],title: "Тэмдэгт"}
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
                    height: function () {
                        return $(window).height() - 110;
                    }
                };

                if(JSON.parse(sessionStorage.getItem('privilege'))!=null){
                    var privileges=JSON.parse(sessionStorage.getItem('privilege'));
                    angular.forEach(privileges, function(value, key) {
                        if(value.name==='READ'){
                            $scope.mainGrid.toolbar = ["excel","search"];
                        }
                        if(value.name==='WRITE'){
                            $scope.mainGrid.toolbar = ["create","search"];
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
                }
            }
        ]
    );
