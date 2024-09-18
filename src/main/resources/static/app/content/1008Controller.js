angular
    .module('altairApp')
    .controller(
        '1008CntCtrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$timeout',
            'mainService',
            '__env',
            function ($rootScope, $state, $scope, $timeout, mainService, __env) {
                $scope.user = JSON.parse(sessionStorage.getItem('currentUser'));

                $scope.taxEditor = function (container, options) {
                    $scope.ddlDataSource = new kendo.data.HierarchicalDataSource({
                        transport: {
                            read: {
                                url: __env.apiUrl() + "/api/cnt/term/taxonomy/list",
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
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    });

                    $scope.filterOption = {
                        dataSource: $scope.ddlDataSource,
                        dataTextField: "description",
                        dataValueField: "id",
                        filter:"startswith"
                    };

                    var editor = $('<input kendo-drop-down-list  k-options="filterOption" data-bind="value:' + options.field + '"/>')
                        .appendTo(container);
                };

                $scope.mainGrid = {
                    dataSource: {
                        transport: {
                            read: {
                                url: function (e) {
                                    if(sessionStorage.getItem("buttonData").includes("read") && JSON.parse(sessionStorage.getItem('menuData')).link===$state.current.name){
                                        return __env.apiUrl() + "/api/cnt/term/taxonomy/metas/list";
                                    }
                                    else{
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
                                url: __env.apiUrl() + "/api/cnt/term/taxonomy/metas/create",
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
                                url: __env.apiUrl() + "/api/cnt/term/taxonomy/metas/update",
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
                                url: __env.apiUrl() + "/api/cnt/term/taxonomy/metas/delete",
                                contentType: "application/json; charset=UTF-8",
                                type: "DELETE",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                }
                            },
                            parameterMap: function (options) {
                              //  options.cntTerm= null;
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
                                    taxId: {type: "number",validation: {required: true}},
                                    orderId: {type: "number"},
                                    cntTermTaxonomy:{defaultValue:{}}
                                }
                            }
                        },
                        pageSize: 20,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    },
                   /* filterable: {
                        "mode":"row",
                        extra: false,
                        operators: { // redefine the string operators
                            string: {
                                contains: "Contains",
                                startswith: "Starts With",
                                eq: "Is Equal To"
                            }
                        }
                    },*/
                    excel: {
                        allPages: true
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
                            title: "Д/д",
                            headerAttributes: {"class": "columnHeader"},
                            template: "<span class='row-number'></span>",
                            width: 50
                        },
                        {
                            field: "taxId",
                            editor:$scope.taxEditor,
                            filterable: {cell: {operator: "contains"}},
                            title: "Taxonomy",
                            template:"#if(taxId!=0 && cntTermTaxonomy!=null){# #=cntTermTaxonomy.description# #}else{# <span>ROOT</span> #}#",
                            headerAttributes: {style: "text-align: center; font-weight: bold"}
                        },
                        {
                            field: "key",
                            filterable: {
                                operators: {
                                    string: {
                                        eq: "Тэнцүү",
                                        gte: "Их буюу тэнцүү",
                                        lte: "Бага буюу тэнцүү"
                                    }
                                }
                            },
                            title: "Key",
                            headerAttributes: {style: "text-align: center; font-weight: bold"}
                        },
                        {
                            field: "value",
                            filterable: {cell: {operator: "contains"}},
                            title: "Value",
                            headerAttributes: {style: "text-align: center; font-weight: bold"}
                        },
                        {
                            width:100,
                            field: "orderId",
                            filterable: {cell: {operator: "contains"}},
                            title: "order",
                            headerAttributes: {style: "text-align: center; font-weight: bold"}
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
                    },
                    editable: "inline",
                    height: function () {
                        return $(window).height() - 220;
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
            }
        ]
    );
