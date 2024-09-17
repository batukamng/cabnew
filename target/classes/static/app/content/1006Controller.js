angular
    .module('altairApp')
    .controller(
        '1006CntCtrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$timeout',
            'mainService',
            '__env',
            function ($rootScope, $state, $scope, $timeout, mainService, __env) {
                $scope.user = JSON.parse(localStorage.getItem('currentUser'));

                $scope.termEditor = function (container, options) {
                    $scope.ddl2DataSource = new kendo.data.HierarchicalDataSource({
                        transport: {
                            read: {
                                url: __env.apiUrl() + "/api/cnt/term/list",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                data: {
                                    "custom":"where 1=1"
                                },
                                sort: [{field: "id", dir: "desc"}],
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
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    });

                    $scope.filterOption = {
                        dataSource: $scope.ddl2DataSource,
                        dataTextField: "name",
                        dataValueField: "id",
                        filter:"startswith"
                    };

                    var editor = $('<input kendo-drop-down-list required k-options="filterOption" data-bind="value:' + options.field + '"/>')
                        .appendTo(container);
                };
                $scope.parentEditor = function (container, options) {
                    $scope.ddlDataSource = new kendo.data.HierarchicalDataSource({
                        transport: {
                            read: {
                                url: __env.apiUrl() + "/api/cnt/term/taxonomy/list",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                data: {
                                    "custom":"where id!="+options.model.id+""
                                },
                                sort: [{field: "id", dir: "desc"}],
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

                $scope.gridDataSource = {
                    transport: {
                        read: {
                            url: function (e) {
                                if (localStorage.getItem("buttonData").includes("read") && JSON.parse(localStorage.getItem('menuData')).url === $state.current.name) {
                                    return __env.apiUrl() + "/api/cnt/term/taxonomy/data/list";
                                } else {
                                    localStorage.removeItem('currentUser');
                                    localStorage.removeItem('menuList');
                                    localStorage.removeItem('menuData');
                                    $state.go('login');
                                }
                            },
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                        //    data: {"custom":"where parentId is null","sort": [{field: 'id', dir: 'desc'}]},
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                            }
                        },
                        create: {
                            url: __env.apiUrl() + "/api/cnt/term/taxonomy/create",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                            },
                            complete: function (e) {
                                $(".k-grid").data("kendoGrid").dataSource.read();
                            }
                        },
                        update: {
                            url: __env.apiUrl() + "/api/cnt/term/taxonomy/update",
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
                            url: __env.apiUrl() + "/api/cnt/term/taxonomy/delete",
                            contentType: "application/json; charset=UTF-8",
                            type: "DELETE",
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
                                id: {editable: false, nullable: true},
                                taxonomy: {type: "string", validation: {required: true}},
                                description: {type: "string"},
                                termId: {type: "number", validation: {required: true}},
                                parentId: {type: "number"},
                                useYn: {type: "boolean"},
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
                $scope.detailGridOptions = function(dataItem) {
                    return {
                        dataSource: {
                            transport: {
                                read: {
                                    url: function (e) {
                                        if (localStorage.getItem("buttonData").includes("read") && JSON.parse(localStorage.getItem('menuData')).url === $state.current.name) {
                                            return __env.apiUrl() + "/api/cnt/term/taxonomy/list";
                                        } else {
                                            localStorage.removeItem('currentUser');
                                            localStorage.removeItem('menuList');
                                            localStorage.removeItem('menuData');
                                            $state.go('login');
                                        }
                                    },
                                    contentType: "application/json; charset=UTF-8",
                                    type: "POST",
                                    data: {"sort": [{field: 'id', dir: 'desc'}]},
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                    }
                                },
                                create: {
                                    url: __env.apiUrl() + "/api/cnt/term/taxonomy/create",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "POST",
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                    },
                                    complete: function (e) {
                                        $(".k-grid").data("kendoGrid").dataSource.read();
                                    }
                                },
                                update: {
                                    url: __env.apiUrl() + "/api/cnt/term/taxonomy/update",
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
                                    url: __env.apiUrl() + "/api/cnt/term/taxonomy/delete",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "DELETE",
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
                                        id: {editable: false, nullable: true},
                                        taxonomy: {type: "string", validation: {required: true}},
                                        description: {type: "string"},
                                        termId: {type: "number", validation: {required: true}},
                                        parentId: {type: "number"},
                                        useYn: {type: "boolean"},
                                        cntTermTaxonomy:{defaultValue:{}},
                                        cntTerm:{defaultValue:{}}
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
                        toolbar: ["create"],
                        editable:"inline",
                        columns: [
                            {
                                title: "Д/д",
                                headerAttributes: {"class": "columnHeader"},
                                template: "<span class='row-number'></span>",
                                width: 50
                            },
                            {
                                field: "termId",
                                editor: $scope.termEditor,
                                filterable: {
                                    operators: {
                                        string: {
                                            eq: "Тэнцүү",
                                            gte: "Их буюу тэнцүү",
                                            lte: "Бага буюу тэнцүү"
                                        }
                                    }
                                },
                                width: 150,
                                title: "Term",
                                headerAttributes: {style: "text-align: center; font-weight: bold"}
                            },
                            {
                                width: 150,
                                field: "taxonomy",
                                title: "Taxonomy",
                                headerAttributes: {style: "text-align: center; font-weight: bold"}
                            },
                            {
                                field: "description",
                                title: "Description",
                                headerAttributes: {style: "text-align: center; font-weight: bold"}
                            },
                            {
                                command: [
                                    {name: "edit", text: {edit: " ", update: " ", cancel: " "}},
                                    {name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn"}
                                ], title: "&nbsp;", width: 100
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

                $scope.mainGrid = {
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
                            field: "termId",
                            editor: $scope.termEditor,
                            filterable: {
                                operators: {
                                    string: {
                                        eq: "Тэнцүү",
                                        gte: "Их буюу тэнцүү",
                                        lte: "Бага буюу тэнцүү"
                                    }
                                }
                            },
                            width: 150,
                            title: "Term",
                            headerAttributes: {style: "text-align: center; font-weight: bold"}
                        },
                        {
                            field: "parentId",
                            width: 150,
                            editor: $scope.parentEditor,
                            filterable: {cell: {operator: "contains"}},
                            title: "Parent",
                            headerAttributes: {style: "text-align: center; font-weight: bold"}
                        },
                        {
                            width: 200,
                            field: "taxonomy",
                            title: "Taxonomy",
                            headerAttributes: {style: "text-align: center; font-weight: bold"}
                        },
                        {
                            field: "description",
                            title: "Description",
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
                        return $(window).height() - 110;
                    }
                };
                if(localStorage.getItem('buttonData').includes("R")){
                    $scope.mainGrid.toolbar = ["excel","search"];
                }
                if(localStorage.getItem('buttonData').includes("C")){
                    $scope.mainGrid.toolbar = [{template:"<button class=\"k-button k-button-icontext k-grid-add\"><span class=\"k-icon k-i-plus\"></span>Нэмэх</button>"},"search"];
                }
                if(localStorage.getItem('buttonData').includes("U")){
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
