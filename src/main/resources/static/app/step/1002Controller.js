angular
    .module('altairApp')
    .controller(
        'step1002Ctrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$timeout',
            'mainService',
            'commonDataSource',
            '__env',
            function ($rootScope, $state, $scope,$timeout,mainService,commonDataSource,__env) {
                $scope.ezDataSource = commonDataSource.urlDataSource("/api/nms/common/list", JSON.stringify({ filter: {logic: "and", filters: [{field: "grpCd", operator: "contains", value: "ecoType"},{field: "parentId", operator: "isNull", value: "false"}]}, sort: [{ field: "orderId", dir: "asc" }] }));
                $scope.ezOptions = {
                    placeholder: "Эдийн засаг сонгох...",
                    dataTextField: 'comCdNm',
                    dataValueField: 'id',
                    valuePrimitive: true,
                    autoBind: true,
                    dataSource: $scope.ezDataSource
                };
                $scope.ezEditor = function(container, options) {
                    var editor = $('<select kendo-drop-down-list k-options="ezOptions" required data-bind="value:' + options.field + '"></select>')
                        .appendTo(container);
                };
                $scope.projectDataSource = commonDataSource.urlDataSource("/api/nms/common/list", JSON.stringify({ filter: {logic: "and", filters: [{field: "grpCd", operator: "contains", value: "projectType"},{field: "parentId", operator: "isNull", value: "false"}]}, sort: [{ field: "orderId", dir: "asc" }] }));
                $scope.projectOptions = {
                    placeholder: "Төслийн төрөл сонгох...",
                    dataTextField: 'comCdNm',
                    dataValueField: 'id',
                    valuePrimitive: true,
                    autoBind: true,
                    dataSource: $scope.projectDataSource
                };
                $scope.projectEditor = function(container, options) {
                    $('<select kendo-drop-down-list k-options="projectOptions" required data-bind="value:' + options.field + '"></select>')
                        .appendTo(container);
                };
                $scope.sourceDataSource = new kendo.data.DataSource({
                    transport: {
                        read: {
                            //commonDataSource.urlDataSource("/api/nms/common/list", JSON.stringify({ filter: {logic: "and", filters: [{field: "grpCd", operator: "contains", value: "sourceType"},{field: "parentId", operator: "isNull", value: "false"}]}, sort: [{ field: "orderId", dir: "asc" }] }))
                            url: __env.apiUrl() + "/api/nms/source/type/list",
                            contentType: "application/json; charset=UTF-8",
                            data: {
                                filter: {
                                    logic: "and",
                                    filters: [
                                        {field: "parentId", operator: "isNull", value: "false"}
                                    ]
                                }, sort: [{field: "orderId", dir: "asc"}]
                            },
                            type: "POST",
                            beforeSend: function (req) {
                                if (JSON.parse(localStorage.getItem('currentUser')) !== null) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
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
                    placeholder: "Төслийн төрөл сонгох...",
                    dataTextField: 'name',
                    dataValueField: 'id',
                    valuePrimitive: true,
                    autoBind: true,
                    dataSource: $scope.sourceDataSource
                };
                $scope.sourceEditor = function(container, options) {
                    var editor = $('<select kendo-drop-down-list k-options="sourceOptions" required data-bind="value:' + options.field + '"></select>')
                        .appendTo(container);
                };
                $scope.transOptions = {
                    placeholder: "Шинэ/Шилжих сонгох...",
                    dataTextField: 'value',
                    dataValueField: 'value',
                    valuePrimitive: true,
                    autoBind: true,
                    dataSource: [{"value": "Шинэ"},{"value": "Шилжих"}]
                };
                $scope.transEditor = function(container, options) {
                    var editor = $('<select kendo-drop-down-list k-options="transOptions" required data-bind="value:' + options.field + '"></select>')
                        .appendTo(container);
                };

                $scope.mainGrid = {
                    dataSource: {
                        transport: {
                            read: {
                                url: function (e) {
                                    return __env.apiUrl() + "/api/nms/assessment/list";
                                },
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                data:{sort: [{field: "id", dir: "desc"}]},
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                },
                            },
                            update: {
                                url: __env.apiUrl() + "/api/nms/assessment",
                                contentType: "application/json; charset=UTF-8",
                                type: "PUT",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                },
                                complete: function (e) {
                                    if (e.status === 200) {
                                        $(".main-grid").data("kendoGrid").dataSource.read();
                                        $rootScope.alert(true, "Амжилттай засагдлаа");
                                    }
                                    else if (e.status === 500) {
                                        $rootScope.alert(false, "Амжилтгүй");
                                    }
                                }
                            },
                            destroy: {
                                url: __env.apiUrl() + "/api/nms/assessment",
                                contentType: "application/json; charset=UTF-8",
                                type: "DELETE",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                }
                            },
                            create: {
                                url: __env.apiUrl() + "/api/nms/assessment",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                complete: function (e) {
                                    if (e.status === 200) {
                                        $(".main-grid").data("kendoGrid").dataSource.read();
                                        $rootScope.alert(true, "Амжилттай хадгаллаа");
                                    }
                                    else if (e.status === 409) {
                                        $rootScope.alert(false, "Ийм тохиргоотой өгөгдөл үүсчихсэн байна.");
                                    } else if (e.status === 500) {
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
                                    id: {type: "number", nullable:true},
                                    useYn: { type: "number", defaultValue: 1 },
                                    ezId: {type: "number", nullable:false},
                                    transTp: {type: "string", nullable:false},
                                    sourceId: {type: "number", nullable:false},
                                    ez: {nullable:true},
                                    projectType: {nullable:true},
                                    source: {nullable:true},
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
                            field: "useYn",
                            headerAttributes: {"class": "columnHeader"},
                            template: "#if(useYn==1){# <span class='columnCenter'>Y</span> #}else{#<span class='columnCenter uk-text-danger'>N</span> #}#",
                            title: 'Ашиглах эсэх',
                            width: 80
                        },
                        {
                            field: "ezId",
                            template:"#if(ez!=null){# #=ez.comCdNm# #}#",
                            editor: $scope.ezEditor,
                            title: "Эдийн засгийн ангилал",
                            width:200
                        },
                        {
                            field: "projectTypeId",
                            template:"#if(projectType!=null){# #=projectType.comCdNm# #}#",
                            editor: $scope.projectEditor,
                            title: "Төслийн төрөл",
                            width:200
                        },
                        {
                            field: "transTp",
                            title: "Шинэ/шилжих",
                            editor: $scope.transEditor,
                            width:120
                        },
                        {
                            field: "sourceId",
                            template:"#if(source!=null){# #=source.name# #}#",
                            editor: $scope.sourceEditor,
                            title: "Эх үүсвэр",
                            width:200
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

                $scope.detailGridOptions = function (dataItem) {
                    var comCd = "";
                    if ((dataItem.ez != undefined && dataItem.source.comCd == "01") ||
                        (dataItem.ez != undefined && dataItem.ez.comCd == "01")) {
                        comCd = "1";
                    } else if (dataItem.ez != undefined && dataItem.ez.comCd != "01") {
                        comCd = "2";
                    }
                    $scope.stepOptions = {
                        placeholder: "Үе шат сонгох...",
                        dataTextField: 'comCdNm',
                        dataValueField: 'id',
                        valuePrimitive: true,
                        autoBind: true,
                        dataSource: commonDataSource.urlDataSource("/api/nms/common/data/list", JSON.stringify(
                            /*{ filter: {logic: "and", filters: [
                                {field: "grpCd", operator: "contains", value: "projectStatus"},
                                {field: "length(comCd)", operator: "eq", value: "2"}
                            ]},*/
                            {custom: "where grpCd = 'projectStatus' and length(comCd) = 2 ",
                             sort: [{ field: "orderId", dir: "asc" }]
                            }))
                    };
                    $scope.stepEditor = function(container, options) {
                        var editor = $('<select kendo-drop-down-list k-options="stepOptions" required data-bind="value:' + options.field + '"></select>')
                            .appendTo(container);
                    };
                    return {
                        dataSource: {
                            transport: {
                                read: {
                                    url: __env.apiUrl() + "/api/nms/assessment-step/list",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "POST",
                                    data: {  sort: [{ field: "id", dir: "desc" }] },
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                    }
                                },
                                update: {
                                    url: __env.apiUrl() + "/api/nms/assessment-step",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "PUT",
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                    },
                                    complete: function (e) {
                                        if (e.status === 200) {
                                            $("#detGrid").data("kendoGrid").dataSource.read();
                                            $rootScope.alert(true, "Амжилттай засагдлаа");
                                        }
                                        else if (e.status === 500) {
                                            $rootScope.alert(false, "Амжилтгүй");
                                        }
                                    }
                                },
                                destroy: {
                                    url: __env.apiUrl() + "/api/nms/assessment-step",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "DELETE",
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                    }
                                },
                                create: {
                                    url: __env.apiUrl() + "/api/nms/assessment-step",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "POST",
                                    complete: function (e) {
                                        if (e.status === 200) {
                                            $("#detGrid").data("kendoGrid").dataSource.read();
                                            $rootScope.alert(true, "Амжилттай хадгаллаа");
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
                                        id: { type: "number", nullable: true },
                                        assessmentId: { type: "number", defaultValue: dataItem.id },
                                        stepId: { type: "number" },
                                        checked: { type: "boolean" },
                                        step: { nullable: true },
                                    }
                                }
                            },
                            pageSize: 200,
                            serverPaging: true,
                            serverFiltering: true,
                            serverSorting: true,
                            filter: { field: "assessmentId", operator: "eq", value: dataItem.id }
                        },
                        scrollable: false,
                        sortable: true,
                        pageable: false,
                        toolbar: [{ template: "<button class='md-btn custom-btn k-grid-add'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>" }, "search"],
                        editable: "inline",
                        columns: [
                            {
                                field: "stepId",
                                template:"#if(step!=null){# #=step.comCdNm# #}#",
                                editor: $scope.stepEditor,
                                title: "Үе шат",
                                width: 200
                            },
                            {
                                field: "checked",
                                width: 100,
                                template: "#if(checked===true){# <span class='columnCenter'>Y</span> #}else{#<span class='columnCenter uk-text-danger'>N</span> #}#",
                                title: 'Үнэлгээ хийх эсэх'
                            },
                            {
                                command: [
                                    { name: "edit", text: { edit: " ", update: " ", cancel: " " } },
                                    { name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn" }
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

                var toolbars = [];
                var commands = [];
                if (localStorage.getItem('buttonData').includes("create")) {
                    $scope.mainGrid.toolbar = [{template: "<button class='md-btn custom-btn k-grid-add' ng-click='createAssessment(0)'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>" }];
                }
                if (localStorage.getItem('buttonData').includes("read")) {
                    toolbars.push("search");
                }
                if (localStorage.getItem('buttonData').includes("edit")) {
                    $scope.mainGrid.columns.push({
                        command: [
                            {
                                template:
                                    '<div class="command-container"><a class="grid-btn k-grid-edit"><div class="nimis-icon edit"></div></a><a class="grid-btn k-grid-remove-command"><div class="nimis-icon delete"></div></a><a class="grid-btn k-grid-update"><div class="nimis-icon update"></div></a> <a class="grid-btn k-grid-cancel"><div class="nimis-icon cancel"></div></a></div>',
                            },
                        ], title: "&nbsp;", width: 80, sticky: true, attributes: {"style": "text-align: center;"},
                    });
                }
            }
        ]
    );
