angular
    .module('altairApp')
    .controller(
        '1000CntCtrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$timeout',
            '__env',
            function ($rootScope, $state, $scope, $timeout, __env) {

                $scope.gotoCreate = function () {
                    $state.go('restricted.scr.1016');
                };
                $scope.update = function (item) {
                    $state.go("restricted.scr.1017", {"param": item.ntceNo});
                };

                $scope.herDllDataSource = new kendo.data.HierarchicalDataSource({
                    transport: {
                        read: {
                            url: __env.apiUrl() + "/api/comCd/data/list",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
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

                $scope.menuEditor = function (container, options) {
                    console.log(options.model.id);

                    $scope.ddlDataSource = new kendo.data.HierarchicalDataSource({
                        transport: {
                            read: {
                                url: __env.apiUrl() + "/api/cnt/menu/all",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                data:{"custom":"where "+(options.model.id!=0?'id!='+options.model.id+'':'1=1')+""},
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
                    var editor = $('<input kendo-drop-down-list  k-data-text-field="\'name\'" k-data-value-field="\'id\'" k-data-source="ddlDataSource" data-bind="value:' + options.field + '"/>')
                        .appendTo(container);
                };

                $scope.comCdEditor = function (container, options) {
                    var editor2 = $('<input kendo-drop-down-list  k-data-text-field="\'comCdNm\'" k-data-value-field="\'id\'" k-data-source="herDllDataSource" data-bind="value:' + options.field + '"/>')
                        .appendTo(container);
                };
                var position=[{"text":"Дээр","value":1},{"text":"Доор","value":0}];
                $scope.mainGrid = {
                    dataSource: {
                        transport: {
                            read: {
                                url: __env.apiUrl() + "/api/cnt/menu/list",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                data: {"sort": [{field: 'id', dir: 'desc'}]},
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                }
                            },
                            create: {
                                url: __env.apiUrl() + "/api/cnt/menu/create",
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
                                url: __env.apiUrl() + "/api/cnt/menu/update",
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
                                url: __env.apiUrl() + "/api/cnt/menu/delete",
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
                                    parentId: {type: "number", defaultValue:0},
                                    orderId: {type: "number"},
                                    pos: {type: "number",defaultValue:1},
                                    url: {type: "string"},
                                    cls: {type: "string"},
                                    uIcon: {type: "string"},
                                    langKey: {type: "string"},
                                    cntMenu: {defaultValue:{}},
                                    useYn: {type: "number"}
                                }
                            }
                        },
                        pageSize: 20,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    },
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
                            title: '{{"Num" | translate}}',
                            headerAttributes: {"class": "columnHeader"},
                            template: "<span class='row-number'></span>",
                            width: "50px"
                        },
                        {field: "name", title: '{{"Menu name" | translate}}'},
                        {field: "url", title: '{{"Url" | translate}}', width:"12%"},
                        {
                            field: "parentId",
                            title: '{{"Parent menu" | translate}}',
                            template: "#if(cntMenu!=null){# <span class='columnCenter'>#=cntMenu.name#</span> #}else{#<span class='columnCenter uk-text-danger'>ROOT</span> #}#",
                            editor:$scope.menuEditor
                        },
                        {
                            field: "cls",
                            title: 'Класс'
                        },
                        {field: "pos", width:"8%",values:position, title: 'Байрлал'},
                        {field: "orderId", width:"8%", title: '{{"Sort" | translate}}'},
                        {field: "uIcon", width:"8%", title: '{{"Icon" | translate}}'},
                        {
                            field: "useYn",
                            template: "#if(useYn===1){# <span class='columnCenter'>Y</span> #}else{#<span class='columnCenter uk-text-danger'>N</span> #}#",
                            title: '{{"Use" | translate}}',
                            width: 130
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

                if(sessionStorage.getItem('buttonData').includes("read")){
                    $scope.mainGrid.toolbar = ["excel","search"];
                }
                if(sessionStorage.getItem('buttonData').includes("create")){
                    $scope.mainGrid.toolbar = [{template: "<button class='k-button k-button-icontext k-grid-add '><span class=\"k-icon k-i-plus\"></span>Нэмэх</button>"},
                        "excel",
                    ];
                }
                if(sessionStorage.getItem('buttonData').includes("edit")){
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
