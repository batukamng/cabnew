angular
    .module('altairApp')
    .controller(
        '1005CntCtrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$timeout',
            'mainService',
            'Upload',
            'sweet',
            '__env',
            function ($rootScope, $state, $scope, $timeout, mainService,Upload,sweet, __env) {
                $scope.user = JSON.parse(sessionStorage.getItem('currentUser'));

                $scope.parentEditor = function (container, options) {
                    $scope.ddlDataSource = new kendo.data.HierarchicalDataSource({
                        transport: {
                            read: {
                                url: __env.apiUrl() + "/api/cnt/term/list",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                data: {
                                    "custom":"where id!="+options.model.id+""
                                },
                                sort: [{field: "id", dir: "desc"}],
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
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    });

                    var editor = $('<input kendo-drop-down-list  k-data-text-field="\'name\'" k-data-value-field="\'id\'" k-data-source="ddlDataSource" data-bind="value:' + options.field + '"/>')
                        .appendTo(container);
                };

                $scope.gridDataSource = {
                    transport: {
                        read: {
                            url: function (e) {
                                if (sessionStorage.getItem("buttonData").includes("read") && JSON.parse(sessionStorage.getItem('menuData')).url === $state.current.name) {
                                    return __env.apiUrl() + "/api/cnt/term/list";
                                } else {
                                    sessionStorage.removeItem('currentUser');
                                    sessionStorage.removeItem('menuList');
                                    sessionStorage.removeItem('menuData');
                                    $state.go('login');
                                }
                            },
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            data: {"sort": [{field: 'id', dir: 'desc'}]},
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            }
                        },
                        create: {
                            url: __env.apiUrl() + "/api/cnt/term/create",
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
                            url: __env.apiUrl() + "/api/cnt/term/update",
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
                            url: __env.apiUrl() + "/api/cnt/term/delete",
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
                                name: {type: "string", validation: {required: true}},
                                slug: {type: "string"},
                                parentId: {type: "number",defaultValue:0},
                                useYn: {type: "boolean"},
                                cntTerm:{defaultValue:{}},
                                cntTermMetas :{defaultValue:{}},
                                cntTermTaxonomies:{defaultValue:{}}
                            }
                        }
                    },
                    pageSize: 20,
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true
                };
                $scope.mainGrid = {
                    excel: {
                        allPages: true
                    },
                    filterable: true,
                    columnMenu: {
                        componentType: "modern",
                        columns: {
                            sort: "asc",
                            groups: [
                                { title: "Нэр", columns: ["name"] },
                                { title: "Хаяг", columns: ["slug"] }
                            ]
                        }
                    },
                    sortable: true,
                    resizable: true,
                    pageable: {
                        refresh: true,
                        pageSizes: true,
                        buttonCount: 5
                    },
                    search: {
                        fields: [
                            { name: "name", operator: "contains" },
                            { name: "slug", operator: "contains" },
                        ]
                    },
                    columns: [
                        {
                            title: "Д/д",
                            headerAttributes: {"class": "columnHeader"},
                            template: "<span class='row-number'></span>",
                            width: 50
                        },
                        {
                            field: "name",
                            filterable: {cell: {operator: "contains",showOperators: false}},
                            title: "Нэр",
                            headerAttributes: {style: "text-align: left;"}
                        },
                        {
                            field: "slug",
                            filterable: {cell: {operator: "contains",showOperators: false}},
                            title: "Хаяг",
                            headerAttributes: {style: "text-align: left;"}
                        },
//                        { width: 150,headerAttributes: {"class": "columnHeader"},attributes: {"style": "text-align:center;"},  template:"<button ng-click='viewTax(dataItem.id)' class='md-btn md-btn-mini'>#=cntTermTaxonomies.length# ш</button>", title: 'Таг'},
//                        { width: 150,headerAttributes: {"class": "columnHeader"},attributes: {"style": "text-align:center;"},  template:"<button ng-click='viewMeta(dataItem.id)' class='md-btn md-btn-mini'>#=cntTermMetas.length# ш</button>", title: 'Мета'},
                    ],
                    dataBound: function () {
                        this.expandRow(this.tbody.find("tr.k-master-row").first());
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

                if(sessionStorage.getItem('buttonData').includes("R")){
                    $scope.mainGrid.toolbar = ["excel","search"];
                }
                if(sessionStorage.getItem('buttonData').includes("C")){
                    $scope.mainGrid.toolbar = [{template:"<button class=\"k-button k-button-icontext k-grid-add\"><span class=\"k-icon k-i-plus\"></span>Нэмэх</button>"},"search"];
                }
                if(sessionStorage.getItem('buttonData').includes("U")){
                    $scope.mainGrid.columns.push({
                        command: [
                            {name: "edit", text: {edit: " ", update: " ", cancel: " "}},
                            {name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn"}
                        ], title: "&nbsp;", width: 100
                    });
                }

                $scope.viewMeta=function (id){
                    $scope.termId=id;
                    UIkit.modal('#modal_meta', {
                        modal: false,
                        keyboard: false,
                        bgclose: false,
                        center: false
                    }).show();
                    $scope.metaDataSource = {
                        transport: {
                            read: {
                                url: __env.apiUrl() + "/api/cnt/term/metas/list",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                data: {"custom":"where termId="+id+"","sort": [{field: 'id', dir: 'desc'}]},
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                }
                            },
                            create: {
                                url: __env.apiUrl() + "/api/cnt/term/metas/create",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                },
                                complete: function (e) {
                                    $("#metaGrid").data("kendoGrid").dataSource.read();
                                }
                            },
                            update: {
                                url: __env.apiUrl() + "/api/cnt/term/metas/update",
                                contentType: "application/json; charset=UTF-8",
                                type: "PUT",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                },
                                complete: function (e) {
                                    $("#metaGrid").data("kendoGrid").dataSource.read();
                                }
                            },
                            destroy: {
                                url: __env.apiUrl() + "/api/cnt/term/metas/delete",
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
                                    key: {type: "string", validation: {required: true}},
                                    value: {type: "string",validation: {required: true}}          ,
                                    termId: {type: "number",validation: {required: true},defaultValue:$scope.termId},
                                    cntTerm:{defaultValue:{}}
                                }
                            }
                        },
                        pageSize: 200,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true,
                    };
                }
                $scope.metaGrid = {
                    scrollable: false,
                    sortable: true,
                    pageable: false,
                    toolbar: [{template:"<button class=\"k-button k-button-icontext k-grid-add\"><span class=\"k-icon k-i-plus\"></span>Нэмэх</button>"},{template:"<button class=\"k-button k-button-icontext\" ng-click='fileUpload(dataItem)'><span class=\"k-icon k-i-file-add\"></span>Файл</button>"},"search"],
                    editable:"inline",
                    columns: [
                        {
                            title: "#",
                            headerAttributes: {"class": "columnCenter"},
                            attributes: {"style": "text-align: center;"},
                            template: "#= ++recordMeta #",
                            sticky: true,
                            width: 50
                        },
                        {
                            field: "key",
                            filterable: {cell: {operator: "contains",showOperators: false}},
                            title: "Key",
                            width: 200,
                            headerAttributes: {style: "text-align: left;"}
                        },
                        {
                            field: "value",
                            filterable: {cell: {operator: "contains",showOperators: false}},
                            title: "Value",
                            headerAttributes: {style: "text-align: left;"}
                        },
                        {
                            command: [
                                {name: "edit", text: {edit: " ", update: " ", cancel: " "}},
                                {name: "destroy", text: " ", iconClass: "k-icon k-i-delete"}
                            ], title: "&nbsp;", width: 100
                        }
                    ],
                    dataBinding: function() {
                        recordMeta = (this.dataSource.page() -1) * this.dataSource.pageSize();
                    },
                };

                $scope.viewTax=function (id){
                    $scope.termId=id;
                    UIkit.modal('#modal_tax', {
                        modal: false,
                        keyboard: false,
                        bgclose: false,
                        center: false
                    }).show();
                    $scope.tagDataSource = {
                        transport: {
                            read: {
                                url: function (e) {
                                    if (sessionStorage.getItem("buttonData").includes("read") && JSON.parse(sessionStorage.getItem('menuData')).url === $state.current.name) {
                                        return __env.apiUrl() + "/api/cnt/term/taxonomy/list";
                                    } else {
                                        sessionStorage.removeItem('currentUser');
                                        sessionStorage.removeItem('menuList');
                                        sessionStorage.removeItem('menuData');
                                        $state.go('login');
                                    }
                                },
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                data: {"custom":"where termId="+$scope.termId+"","sort": [{field: 'id', dir: 'desc'}]},
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                }
                            },
                            create: {
                                url: __env.apiUrl() + "/api/cnt/term/taxonomy/create",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                },
                                complete: function (e) {
                                    $("#taxData").data("kendoGrid").dataSource.read();
                                }
                            },
                            update: {
                                url: __env.apiUrl() + "/api/cnt/term/taxonomy/update",
                                contentType: "application/json; charset=UTF-8",
                                type: "PUT",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                },
                                complete: function (e) {
                                    $("#taxData").data("kendoGrid").dataSource.read();
                                }
                            },
                            destroy: {
                                url: __env.apiUrl() + "/api/cnt/term/taxonomy/delete",
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
                                    taxonomy: {type: "string", validation: {required: true}},
                                    description: {type: "string"},
                                    termId: {type: "number",validation: {required: true},defaultValue:$scope.termId},
                                    parentId: {type: "number"},
                                    useYn: {type: "boolean",defaultValue:true},
                                    cntTermTaxonomy:{defaultValue:{}},
                                    cntTerm:{defaultValue:{}}
                                }
                            }
                        },
                        pageSize: 20,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    };
                }
                $scope.tagParentEditor = function (container, options) {
                    $scope.ddlDataSource = new kendo.data.HierarchicalDataSource({
                        transport: {
                            read: {
                                url: __env.apiUrl() + "/api/cnt/term/taxonomy/all",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                data:{"custom":"where "+(options.model.id!=null && options.model.id!=0?'id!='+options.model.id+'':'1=1')+""},
                                sort: [{field: "id", dir: "desc"}],
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
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    });
                    $scope.filterTaxOption = {
                        dataSource: $scope.ddlDataSource,
                        dataTextField: "taxonomy",
                        dataValueField: "id",
                        filter:"startswith"
                    };
                    var editor = $('<input kendo-drop-down-list   k-options="filterTaxOption" data-bind="value:' + options.field + '"/>')
                        .appendTo(container);
                };
                $scope.tagGrid = {
                    scrollable: false,
                    sortable: true,
                    pageable: false,
                    toolbar: [{template:"<button class=\"k-button k-button-icontext k-grid-add\"><span class=\"k-icon k-i-plus\"></span>Нэмэх</button>"},{template:"<button class=\"k-button k-button-icontext\" ng-click='fileUpload(dataItem)'><span class=\"k-icon k-i-file-add\"></span>Файл</button>"},"search"],
                    editable:"inline",
                    columns: [
                        {
                            title: "#",
                            headerAttributes: {"class": "columnCenter"},
                            attributes: {"style": "text-align: center;"},
                            template: "#= ++recordTag #",
                            sticky: true,
                            width: 50
                        },
                        {
                            field: "parentId",
                            editor: $scope.tagParentEditor,
                            filterable: {cell: {operator: "contains"}},
                            title: "Parent",
                            width:200,
                            template: "#if(cntTermTaxonomy!=null){# <span class='columnCenter'>#=cntTermTaxonomy.taxonomy#</span> #}else{#<span class='columnCenter uk-text-danger'>ROOT</span> #}#",
                            headerAttributes: {style: "text-align: left;"}
                        },
                        {
                            field: "taxonomy",
                            title: "Нэр",
                            headerAttributes: {style: "text-align: left;"}
                        },
                        {
                            field: "description",
                            title: "Тайлбар",
                            headerAttributes: {style: "text-align: left;"}
                        },
                        {
                            command: [
                                {name: "edit", text: {edit: " ", update: " ", cancel: " "}},
                                {name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn"}
                            ], title: "&nbsp;", width: 100
                        }
                    ],
                    dataBinding: function() {
                        recordTag = (this.dataSource.page() -1) * this.dataSource.pageSize();
                    },
                };

                $scope.closeModal = function (id){
                    $(".k-grid").data("kendoGrid").dataSource.read();
                    if(id=='modal_meta'){
                        UIkit.modal('modal_meta').hide();
                    }
                    else{
                        UIkit.modal('modal_tax').hide();
                    }
                }
                $scope.sendBtn = false;
                $scope.fileUpload = function(item){
                    $scope.termId=item.id;
                    $scope.ddlDataSource = new kendo.data.HierarchicalDataSource({
                        transport: {
                            read: {
                                url: __env.apiUrl() + "/api/cnt/term/list",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                /* data: {
                                     "custom":"where id!="+options.model.id+""
                                 },*/
                                sort: [{field: "id", dir: "desc"}],
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
                    $scope.customOptions = {
                        dataSource: $scope.ddlDataSource,
                        dataTextField: "name",
                        dataValueField: "id",
                        optionLabel: "Ангилал сонгох...",
                        filter:"startswith"
                    };
                    UIkit.modal("#modal_file", {modal: false, keyboard: false, bgclose: false, center: false}).show();
                    $scope.sendBtn = true;
                };
                $scope.onSelect = function(e) {
                    var message = $.map(e.files, function(file) { return file.name; }).join(", ");
                };
                $scope.submitUploadFormFile = function (event) {
                    event.preventDefault();
                    if ($scope.validator.validate()) {
                        if ($scope.formFile.afl.$valid && $scope.afl) {
                            Upload.upload({
                                url: '/api/cnt/term/metas/file/'+$scope.termId,
                                data: {"files": $scope.afl}
                            }).then(function (resp) {
                                sweet.show('Анхаар!', 'Амжилттай хадгаллаа.', 'success');
                                UIkit.modal("#modal_file").hide();
                                $("#metaGrid").data("kendoGrid").dataSource.read();
                            });
                        }
                    }
                };

            }
        ]
    );
