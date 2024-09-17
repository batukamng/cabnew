angular.module("altairApp").controller("920NmsCtrl", [
    "$rootScope",
    "$state",
    "$scope",
    "$timeout",
    "mainService",
    "commonDataSource",
    "Upload",
    "$http",
    "__env",
    function ($rootScope, $state, $scope, $timeout, mainService, commonDataSource, Upload, $http, __env) {
        $scope.user = JSON.parse(localStorage.getItem("currentUser")).user;


        var yesNo = [{ "text": "N", "value": 0 }, { "text": "Y", "value": 1 }];

/*
        $scope.stageDataSource = commonDataSource.urlDataSource("/api/comCd/list", JSON.stringify({ "custom": "where grpCd='stageOfFinancing' and useYn=true and parentId is not null", sort: [{ field: "orderId", dir: "asc" }] }));
        $scope.ecoDataSource = commonDataSource.urlDataSource("/api/comCd/list", JSON.stringify({ "custom": "where grpCd='ecoType' and useYn=true and parentId is not null", sort: [{ field: "orderId", dir: "asc" }] }));
        $scope.responsibilityDataSource = commonDataSource.urlDataSource("/api/comCd/list", JSON.stringify({ "custom": "where grpCd='responsibility' and useYn=true and parentId is not null", sort: [{ field: "orderId", dir: "asc" }] }));
*/

        $scope.stageDataSource = commonDataSource.urlDataSource("/api/nms/common/list", JSON.stringify({ filter: {logic: "and", filters: [{field: "grpCd", operator: "contains", value: "stageOfFinancing"},{field: "parentId", operator: "isNull", value: "false"}]}, sort: [{ field: "orderId", dir: "asc" }] }));
        $scope.ecoDataSource = commonDataSource.urlDataSource("/api/nms/common/list", JSON.stringify({ filter: {logic: "and", filters: [{field: "grpCd", operator: "contains", value: "ecoType"},{field: "parentId", operator: "isNull", value: "false"}]}, sort: [{ field: "orderId", dir: "asc" }] }));
        $scope.responsibilityDataSource = commonDataSource.urlDataSource("/api/nms/common/list", JSON.stringify({ filter: {logic: "and", filters: [{field: "grpCd", operator: "contains", value: "responsibility"},{field: "parentId", operator: "isNull", value: "false"}]}, sort: [{ field: "orderId", dir: "asc" }] }));

        $scope.responsibilityEditor = function (container, options) {
          /*  $scope.responsibilities = [];
            if (options.model.id != null && options.model.responsibilities.length > 0) {
                angular.forEach(options.model.responsibilities, function (value, key) {
                    $scope.responsibilities.push(value.id);
                });
            }*/
         //   options.model.responsibilities = $scope.responsibilities;
            $scope.selectPriOptions = {
                dataTextField: "comCdNm",
                dataValueField: "id",
                placeholder: "Сонгох...",
                autoBind: true,
                dataSource: $scope.responsibilityDataSource
            };
            var editor = $('<select  kendo-multi-select required k-ng-model="responsibilities" k-options="selectPriOptions" data-bind="value:' + options.field + '"></select>')
                .appendTo(container);
        };
        $scope.ecoEditor = function (container, options) {
            $scope.ecoList = [];
            if (options.model.id != null && options.model.ecoList.length > 0) {
                angular.forEach(options.model.ecoList, function (value, key) {
                    $scope.ecoList.push(value.id);
                });
            }
            options.model.ecoList = $scope.ecoList;
            $scope.selectEcoOptions = {
                dataTextField: "comCdNm",
                dataValueField: "id",
                placeholder: "Сонгох...",
                valuePrimitive: true,
                autoBind: true,
                dataSource: $scope.ecoDataSource
            };
            var editor = $('<select  kendo-multi-select required k-ng-model="ecoList" k-options="selectEcoOptions" data-bind="value:' + options.field + '"></select>')
                .appendTo(container);
        };
        $scope.stepEditor = function (container, options) {
            $scope.stages = [];
            if (options.model.id != null && options.model.stages.length > 0) {
                angular.forEach(options.model.stages, function (value, key) {
                    $scope.stages.push(value.id);
                });
            }
            options.model.stages = $scope.stages;

            $scope.selectStepOptions = {
                dataTextField: "comCdNm",
                dataValueField: "id",
                placeholder: "Сонгох...",
                valuePrimitive: true,
                autoBind: true,
                dataSource: $scope.stageDataSource
            };
            var editor = $('<select  kendo-multi-select required k-ng-model="stages" k-options="selectStepOptions" data-bind="value:' + options.field + '"></select>')
                .appendTo(container);
        };

        $scope.mainGrid = {
            dataSource: {
                transport: {
                    read: {
                        url: "/api/nms/form/note/list",
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
                        data: {"sort": [{field: 'id', dir: 'desc'}]},
                        beforeSend: function (req) {
                            if (JSON.parse(localStorage.getItem('currentUser')) != null) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                            }
                            else {
                                $state.go('login');
                            }
                        }
                    },
                    create: {
                        url: __env.apiUrl() + "/api/nms/form/note/submit",
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
                        complete: function (e) {
                            $("#parent").data("kendoGrid").dataSource.read();
                        },
                        beforeSend: function (req) {
                            req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                        }
                    },
                    update: {
                        url: __env.apiUrl() + "/api/nms/form/note/submit",
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
                        beforeSend: function (req) {
                            req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                        },
                        complete: function (e) {
                            $("#parent").data("kendoGrid").dataSource.read();
                        }
                    },
                    destroy: {
                        url: __env.apiUrl() + "/api/nms/form/note",
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
                            id: { editable: false, nullable: true },
                            name: { type: "string", validation: { required: true } },
                            orderId: { type: "number", validation: { required: true } },
                            conFun: { type: "string", defaultValue:"1",validation: { required: true } },
                            conMain: { type: "string", defaultValue:"1",validation: { required: true } },
                            description: { type: "string" },
                            required: { type: "number" },
                            useYn: { type: "number" },
                            stages: { defaultValue: [] },
                            ecoList: { defaultValue: [] },
                            responsibilities: { defaultValue: [] }
                        }
                    }

                },
                pageSize: 20,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: {
                mode: "row",
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
            pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            },
            columns: [
                {
                    title: "#",
                    headerAttributes: { "class": "columnCenter" },
                    attributes: { "style": "text-align: center;" },
                    template: "#= ++record #",
                    sticky: true,
                    width: 50
                },
                {
                    field: "name",
                    title: "Нэр",
                    filterable: {
                        cell: {
                            operator: "contains",
                            showOperators: false,
                            suggestionOperator: "contains"
                        }
                    },
                    headerAttributes: { style: "text-align: left;" }
                },
                {
                    field: "description",
                    title: "Тайлбар",
                    filterable: {
                        cell: {
                            operator: "contains",
                            showOperators: false,
                            suggestionOperator: "contains"
                        }
                    },
                    headerAttributes: { style: "text-align: left;" }
                },
                {
                    field: "conFun",
                    title: "Төрөл",
                    width: 100,
                    filterable: {
                        cell: {
                            operator: "eq",
                            showOperators: false,
                            suggestionOperator: "eq"
                        }
                    },
                    values:[{"text":"Санхүүжилт","value":"0"},{"text":"Гэрээ","value":"1"}],
                    attributes: { style: "text-align: center;" },
                    headerAttributes: { style: "text-align: left;" }
                },
                {
                    field: "conMain",
                    title: "Гэрээний төрөл",
                    width: 130,
                    filterable: {
                        cell: {
                            operator: "eq",
                            showOperators: false,
                            suggestionOperator: "eq"
                        }
                    },
                    template: "#if(conFun=='1'){# #if(conMain=='1'){# Үндсэн #}else if(conMain=='2'){# Монгол тал #}else{# Нэмэлт#}# #}else{# - #}#",
                    values:[{"text":"Үндсэн","value":"1"},{"text":"Нэмэлт","value":"0"},{"text":"Монгол тал","value":"2"}],
                    attributes: { style: "text-align: center;" },
                    headerAttributes: { style: "text-align: left;" }
                },
                {
                    field: "orderId",
                    title: "Эрэмбэ",
                    width: 100,
                    filterable: {
                        cell: {
                            operator: "eq",
                            showOperators: false,
                            suggestionOperator: "eq"
                        }
                    },
                    attributes: { style: "text-align: center;" },
                    headerAttributes: { style: "text-align: left;" }
                },
                {
                    field: "ecoList",
                    title: "Эдийн засгийн ангилал",
                    editor: $scope.ecoEditor,
                    width: 200,
                    dataTextField: "comCdNm", dataValueField: "id", dataSource: $scope.ecoDataSource,
                    filterable: {
                        cell: {
                            operator: "contains",
                            showOperators: false,
                            suggestionOperator: "contains"
                        }
                    },
                    template: "#for (var i=0,len=ecoList.length; i<len; i++){#<span>${ ecoList[i].comCdNm } #if(i!=ecoList.length-1){#<span>,</span>#}# </span> # } #",
                    headerAttributes: { style: "text-align: left;" }
                },
                {
                    field: "stages",
                    title: "Санхүүжилтийн аль үе шат",
                    editor: $scope.stepEditor,
                    width: 200,
                    dataTextField: "comCdNm", dataValueField: "id", dataSource: $scope.stageDataSource,
                    filterable: { multi: true, search: true },
                    template: "#for (var i=0,len=stages.length; i<len; i++){#<span>${ stages[i].comCdNm } #if(i!=stages.length-1){#<span>,</span>#}# </span> # } #",
                    headerAttributes: { style: "text-align: left;" }
                },
                {
                    field: "responsibilities",
                    editor: $scope.responsibilityEditor,
                    title: "Хариуцах байгууллага",
                    width: 200,
                    dataTextField: "comCdNm", dataValueField: "id", dataSource: $scope.responsibilityDataSource,
                    filterable: { multi: true, search: true },
                    template: "#for (var i=0,len=responsibilities.length; i<len; i++){#<span>${ responsibilities[i].comCdNm } #if(i!=responsibilities.length-1){#<span>,</span>#}# </span> # } #",
                    headerAttributes: { style: "text-align: left;" }
                },
                {
                    field: "required",
                    title: "Заавал эсэх",
                    values: [{"text":"Тийм","value":"1"},{"text":"Үгүй","value":"0"}],
                    width: 100,
                    template: "#if(required===1){# <span class='columnCenter'>Y</span> #}else{#<span class='columnCenter uk-text-danger'>N</span> #}#",
                    headerAttributes: { style: "text-align: center;" }
                },
            ],
            dataBinding: function () {
                record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
            },
            editable: "inline",
            height: function () {
                return $(window).height() - 110;
            }
        };

        if (localStorage.getItem("buttonData").includes("read")) {
            $scope.mainGrid.toolbar = ["excel", "search"];
        }
        if (localStorage.getItem("buttonData").includes("create")) {
            $scope.mainGrid.toolbar = [{ template: "<button class='md-btn custom-btn k-grid-add'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>" }];
        }
        if (localStorage.getItem("buttonData").includes("update") || localStorage.getItem("buttonData").includes("edit")) {
            $scope.mainGrid.columns.push({
                command: [
                    {
                        template:
                            '<div class="command-container"><a class="grid-btn k-grid-edit"><div class="nimis-icon edit"></div></a><a class="grid-btn k-grid-remove-command"><div class="nimis-icon delete"></div></a><a class="grid-btn k-grid-update"><div class="nimis-icon update"></div></a> <a class="grid-btn k-grid-cancel"><div class="nimis-icon cancel"></div></a></div>',
                    },
                ],
                title: "&nbsp;",
                sticky: true,
                width: 80,
            });
        }
    },
]);
