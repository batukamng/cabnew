angular
    .module('altairApp')
    .controller(
        'step1003Ctrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$timeout',
            'mainService',
            'commonDataSource',
            '__env',
            function ($rootScope, $state, $scope,$timeout,mainService,commonDataSource,__env) {

                $scope.sourceDataSource = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: __env.apiUrl() + "/api/nms/source/type/list",
                            contentType: "application/json; charset=UTF-8",
                            data: {
                                filter: {
                                    logic: "and",
                                    filters: [
                                        {field: "parentId", operator: "isNull", value: true},
                                        {field: "useYn", operator: "eq", value: 1}
                                    ]
                                }, sort: [{field: "orderId", dir: "asc"}]
                            },
                            type: "POST",
                            beforeSend: function (req) {
                                if (JSON.parse(sessionStorage.getItem('currentUser')) !== null) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                }
                                else {
                                    $rootScope.$broadcast('LogoutSuccessful');
                                }
                            }
                        },
                        parameterMap: function (options) {
                            return JSON.stringify(options);
                        }
                    },
                    schema: {
                        data: function (data) {
                            if(data.total===0){
                                return [];
                            }
                            return data.data;
                        },
                        total: "total"
                    },
                    pageSize: 60,
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true
                });

                $scope.stepDataSource = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: __env.apiUrl() + "/api/nms/funding/step/list",
                            contentType: "application/json; charset=UTF-8",
                            data: {
                                filter: {
                                    logic: "and",
                                    filters: [
                                        {field: "stepType", operator: "eq", value: 2},
                                        {field: "useYn", operator: "eq", value: 1}
                                    ]
                                }, sort: [{field: "orderId", dir: "asc"}]
                            },
                            type: "POST",
                            beforeSend: function (req) {
                                if (JSON.parse(sessionStorage.getItem('currentUser')) !== null) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                }
                                else {
                                    $rootScope.$broadcast('LogoutSuccessful');
                                }
                            }
                        },
                        parameterMap: function (options) {
                            return JSON.stringify(options);
                        }
                    },
                    schema: {
                        data: function (data) {
                            if(data.total===0){
                                return [];
                            }
                            return data.data;
                        },
                        total: "total"
                    },
                    pageSize: 60,
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true
                });

                $scope.sourceOptions = {
                    placeholder: "Санхүүжилтийн эх үүсвэр сонгох...",
                    dataTextField: 'name',
                    dataValueField: 'id',
                    valuePrimitive: true,
                    autoBind: true,
                    dataSource: $scope.sourceDataSource
                };

                $scope.stepOptions = {
                    placeholder: "Төлөвлөлтийн үе шат сонгох...",
                    dataTextField: 'name',
                    dataValueField: 'id',
                    valuePrimitive: true,
                    autoBind: true,
                    dataSource: $scope.stepDataSource
                };

                $scope.sourceEditor = function(container, options) {
                    var editor = $('<select kendo-drop-down-list k-options="sourceOptions" required data-bind="value:' + options.field + '"></select>')
                        .appendTo(container);
                };

                $scope.stepEditor = function(container, options) {
                    var editor = $('<select kendo-drop-down-list k-options="stepOptions" required data-bind="value:' + options.field + '"></select>')
                        .appendTo(container);
                };

                $scope.yearSelectorOptions = {
                    format: "yyyy/MM/dd",
                    start: 'decade',
                    depth: 'decade'
                };

                $scope.year = undefined;
                $scope.yearEditor = function(container, options) {
                    var editor = $('<input k-format="\'yyyy\'" k-on-change="fromDateChanged(year)" k-ng-model="year" kendo-date-picker k-options="yearSelectorOptions" data-bind="value:' + options.field + '"/>')
                        .appendTo(container);
                };

                $scope.minDate = undefined;
                $scope.fromDateChanged = function (e) {
                    $scope.minDate = new Date(1900 + e.getYear(), 1, 1);
                    $timeout(function() {
                        $scope.dateSelectorOptions = {
                            format: "yyyy/MM/dd",
                            min: new Date(),
                            max: new Date()
                        };
                        console.log("test");
                    });
                }

                $scope.dateSelectorOptions = {
                    format: "yyyy/MM/dd",
                };

                $scope.dateEditor = function(container, options) {
                    var editor = $('<input kendo-date-picker  data-bind="value:' + options.field + '"/>')
                        .appendTo(container).kendoDatePicker({
                            min: $scope.minDate,
                        });
                };

                $scope.mainGrid = {
                    dataSource: {
                        transport: {
                            read: {
                                url: function (e) {
                                    return __env.apiUrl() + "/api/nms/assessment/calendar/list";
                                },
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                data:{sort: [{field: "id", dir: "desc"}]},
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                }
                            },
                            update: {
                                url: __env.apiUrl() +"/api/nms/assessment/calendar",
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
                                url: __env.apiUrl() +"/api/nms/assessment/calendar",
                                contentType: "application/json; charset=UTF-8",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                },
                                type: "DELETE"
                            },
                            create: {
                                url: __env.apiUrl() +"/api/nms/assessment/calendar",
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
                                    id: {type: "number", nullable:true},
                                    useYn: { type: "number", defaultValue: 1 },
                                    sourceId: {type: "number", nullable:false},
                                    source: {nullable:true},
                                    step: {nullable:true},
                                }
                            }
                        },
                        pageSize: 15,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    },
                    sortable: true,
                    resizable: true,
                    scrollable:true,
                    pageable: {
                        refresh: true,
                        pageSizes: true,
                        buttonCount: 5
                    },
                    columns: [
                        {title: "#", headerAttributes: {"class": "columnHeader"}, template: "<span class='row-number'></span>", width: 50},
                        {
                            field: "name",
                            filterable: { cell: { operator: "contains", showOperators: false } },
                            headerAttributes: { class: "columnHeader" },
                            title: "НЭР",
                            width: 350
                        },
                        {
                            field: "sourceId",
                            template:"#if(source!=null){# #=source.name# #}#",
                            editor: $scope.sourceEditor,
                            title: "ЭХ ҮҮСВЭР",
                            width:200
                        },
                        {
                            field: "stepId",
                            template:"#if(step!=null){# #=step.name# #}#",
                            editor: $scope.stepEditor,
                            title: "ТӨЛӨВЛӨЛТИЙН ҮЕ ШАТ",
                            width: 200
                        },
                        {
                            field: "year",
                            filterable: { cell: { operator: "contains", showOperators: false } },
                            headerAttributes: { class: "columnHeader" },
                            title: "АШИГЛАХ ОН",
                            width: 150
                        },
                        {
                            field: "orderId",
                            filterable: { cell: { operator: "contains", showOperators: false } },
                            headerAttributes: { class: "columnHeader" },
                            title: "ЭРЭМБЭ",
                            width: 75
                        },
                        {
                            field: "descr",
                            filterable: { cell: { operator: "contains", showOperators: false } },
                            headerAttributes: { class: "columnHeader" },
                            title: "ТАЙЛБАР"
                        }
/*
                        ,
                        {
                            field: "useYn",
                            headerAttributes: {"class": "columnHeader"},
                            template: "#if(useYn==1){# <span class='columnCenter'>Y</span> #}else{#<span class='columnCenter uk-text-danger'>N</span> #}#",
                            title: 'Ашиглах эсэх',
                            width: 75
                        }
*/
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

                if (sessionStorage.getItem('buttonData').includes("create")) {
                    $scope.mainGrid.toolbar = [
                        { template: "<button class='md-btn custom-btn' ng-click='addLevel()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>" },
                        "search"
                    ];
                }

                if (sessionStorage.getItem('buttonData').includes("edit")) {
                    $scope.mainGrid.columns.push({
                        command: [
                            {
                                template:
                                    '<div class="flex gap-3"><button class="grid-btn k-grid-edit" ng-click=\'update(dataItem)\'><div class="nimis-icon edit"></div></button><button class="grid-btn k-grid-remove-command" ng-click=\'deleteData(dataItem)\'><div class="nimis-icon delete"></div></button></div>',
                            },
                        ], title: "&nbsp;", width: 120, sticky: true, attributes: { "style": "text-align: center;" },
                    });
                }
            }
        ]
    );
