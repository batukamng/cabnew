angular
    .module('altairApp')
    .controller(
        'step1001Ctrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$timeout',
            'mainService',
            'commonDataSource',
            'Upload',
            '__env',
            function ($rootScope, $state, $scope, $timeout,mainService,commonDataSource,Upload, __env) {
                $scope.app = { useYn: 1, systemType: 1, ecoType : 430, required : 1, orderId : 1 };
                $scope.privileges = {};
                $scope.answerDisable = true;
                $scope.confirmDisable = false;

                $scope.tab = 1;
                $scope.user = JSON.parse(sessionStorage.getItem("currentUser")).user;
                $scope.sEcoDataSource = $scope.user.ecoList;
                $scope.ecoType = {};
                $scope.ezDataSource = commonDataSource.urlDataSource("/api/nms/common/list", JSON.stringify({ filter: {logic: "and", filters: [{field: "grpCd", operator: "contains", value: "ecoType"},{field: "parentId", operator: "isNull", value: "false"}]}, sort: [{ field: "orderId", dir: "asc" }] }));
                $scope.ezOptions = {
                    placeholder: "Эдийн засаг сонгох...",
                    dataTextField: 'comCdNm',
                    dataValueField: 'id',
                    valuePrimitive: true,
                    autoBind: true,
                    dataSource: $scope.ezDataSource
                };

                $scope.docDataSource = commonDataSource.urlDataSource("/api/nms/common/list", JSON.stringify({ filter: {logic: "and", filters: [{field: "grpCd", operator: "contains", value: "docsToValidate"},{field: "parentId", operator: "isNull", value: "false"}]}, sort: [{ field: "orderId", dir: "asc" }] }));
                $scope.docOptions = {
                    placeholder: "Баталгаажуулах мэдээлэл сонгох...",
                    dataTextField: 'comCdNm',
                    dataValueField: 'id',
                    valuePrimitive: true,
                    autoBind: true,
                    dataSource: $scope.docDataSource
                };

                $scope.stepDataSource = commonDataSource.urlDataSource("/api/nms/funding/step/list", JSON.stringify({ filter: {logic: "and", filters: [{field: "stepType", operator: "eq", value: 2},{field: "useYn", operator: "eq", value: 1}]}, sort: [{ field: "id", dir: "asc" }] }));
                $scope.stepOptions = {
                    placeholder: "Үе шат сонгох...",
                    dataTextField: 'name',
                    dataValueField: 'id',
                    valuePrimitive: true,
                    autoBind: true,
                    dataSource: $scope.stepDataSource
                };

                $scope.ezEditor = function(container, options) {
                    var editor = $('<select kendo-drop-down-list k-options="ezOptions" required data-bind="value:' + options.field + '"></select>')
                        .appendTo(container);
                };

                $scope.docEditor = function(container, options) {
                    var editor = $('<select kendo-drop-down-list k-options="docOptions" required data-bind="value:' + options.field + '"></select>')
                        .appendTo(container);
                };

                $scope.stepEditor = function(container, options) {
                    var editor = $('<select kendo-drop-down-list k-options="stepOptions" required data-bind="value:' + options.field + '"></select>')
                        .appendTo(container);
                };

                $scope.onChangeEco = function (item) {
                    $scope.ecoType = item;
                    $scope.postEcoChange();
                };

                $scope.postEcoChange = function () {
                    let levels = $scope.sEcoDataSource;
                    $scope.app.levels = [];
                    for (let i = 0; i < levels.length; i++) {
                        if (levels[i].comCd === $scope.ecoType.comCd) {
                            $scope.app.levels.push(levels[i].id);
                        }
                    }
                };

                $scope.mainGrid = {
                    dataSource: {
                        transport: {
                            read: {
                                url: function (e) {
                                    return __env.apiUrl() + "/api/nms/step/validation/list";
                                },
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                data:{sort: [{field: "id", dir: "desc"}]},
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                }
                            },
                            update: {
                                url: __env.apiUrl() +"/api/nms/step/validation",
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
                                url: __env.apiUrl() +"/api/nms/step/validation",
                                contentType: "application/json; charset=UTF-8",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                },
                                type: "DELETE",
                                complete: function (e) {
                                    $(".k-grid").data("kendoGrid").dataSource.read();
                                }
                            },
                            create: {
                                url: __env.apiUrl() +"/api/nms/step/validation",
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
                                    documentId: {type: "number", nullable:false},
                                    stepId: {type: "number", nullable:false},
                                    required: {type: "number", defaultValue:1},
                                    ez: {nullable:true},
                                    document: {nullable:true},
                                    step: {nullable:true},
                                }
                            }
                        },
                        pageSize: 15,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    },
                    filterable: {
                        mode: "row",
                        extra: false,
                        operators: {
                            string: {
                                contains: "Агуулсан",
                                startswith: "Эхлэх утга",
                                eq: "Тэнцүү",
                                gte: "Их",
                                lte: "Бага",
                            },
                        },
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
                        {
                            title: "№",
                            headerAttributes: {class: "columnCenter"},
                            attributes: {style: "text-align: center;"},
                            template: "#= ++record #",
                            sticky: true,
                            width: 50,
                        },
                        {
                            field: "answer",
                            title: "Асуулт/Бат.мэдээлэл",
                            filterable: {cell: {operator: "contains", showOperators: false,suggestionOperator: 'contains'}}
                        },
                        {
                            field: "systemType",
                            values: [{"text":"Асуулт","value":1},{"text":"Баталгаажуулалт","value":2}],
                            title: "Төрөл",
                            filterable: {cell: {operator: "eq", showOperators: false}}
                        },
                        {
                            field: "levelId",
                            title: "Эдийн засгийн ангилал",
                            filterable: {cell: {operator: "contains", showOperators: false,suggestionOperator: 'contains'}}
                        },
                        {
                            field: "stepName",
                            title: "Төлөвлөлтийн үе шат",
                            filterable: {cell: {operator: "contains", showOperators: false,suggestionOperator: 'contains'}}
                        },
                        {
                            field: "required",
                            headerAttributes: {"class": "columnHeader"},
                            values: [{"text":"Тийм","value":1},{"text":"Үгүй","value":0}],
                            template: "#if(required==1){# <span class='columnCenter'>Тийм</span> #}else{#<span class='columnCenter uk-text-danger'>Үгүй</span> #}#",
                            title: 'Заавал шаардагдах эсэх',
                            filterable: {cell: {operator: "eq", showOperators: false}}
                        },
                        {
                            field: "orderId",
                            headerAttributes: {"class": "columnHeader"},
                            title: 'Эрэмбэ',
                            filterable: {cell: {operator: "contains", showOperators: false}},
                            width: 100
                        }
                    ],
                    editable: "inline",
                    dataBinding: function () {
                        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                    },
                    height: function () {
                        return $(window).height() - 110;
                    }
                };

                if (sessionStorage.getItem('buttonData').includes("read")) {
                    $scope.mainGrid.toolbar = ["excel", "search"];
                }
                if (sessionStorage.getItem("buttonData").includes("create")) {
                    $scope.mainGrid.toolbar = [{template: "<button class='md-btn custom-btn' ng-click='addLevel()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>"}];
                }

                if (sessionStorage.getItem('buttonData').includes("edit")) {
                    $scope.mainGrid.columns.push({
                        command: [
                            {
                                template:
                                    '<div class="flex gap-3"><button class="grid-btn k-grid-edit" ng-click=\'update(dataItem)\'><div class="nimis-icon edit"></div></button><button class="grid-btn k-grid-remove-command" ng-click=\'deleteData(dataItem)\'><div class="nimis-icon delete"></div></button></div>',
                            },
                        ], title: "&nbsp;", width: 120, sticky: true, attributes: {"style": "text-align: center;"},
                    });
                }

                $scope.update = function (item) {
                    $scope.app = item;
                    $scope.changeSystemType($scope.app.systemType);
                    $scope.privileges = {};
                    if ($scope.app.levelIds) {
                        let levelsIds = $scope.app.levelIds.split(",");
                        for (let i = 0; i < levelsIds.length; i++) {
                            $scope.privileges[levelsIds[i]] = true;
                        }
                    }
                    UIkit.modal("#modal_funding", {
                        modal: false,
                        keyboard: false,
                        bgclose: false,
                        center: true
                    }).show();
                };

                $scope.addLevel = function () {
                    $scope.app = {};
                    UIkit.modal("#modal_funding", {
                        modal: false,
                        keyboard: false,
                        bgclose: false,
                        center: true
                    }).show();
                    $scope.tab = 1;
                    $scope.modalType = "add";
                };


                $scope.formSubmit = function (event) {
/*                    event.preventDefault();
                    if ($scope.validatorProject.validate()) {*/
                        UIkit.modal("#modal_loader").show();

                        $scope.app.rolePrivileges = [];
                        for (var menuKey in $scope.privileges)
                            if ($scope.privileges[menuKey])
                                $scope.app.rolePrivileges.push(menuKey);

                        mainService.withResponse("post", __env.apiUrl() + "/api/nms/step/validation/submit", $scope.app).then(function (data) {
                            UIkit.modal("#modal_loader").hide();
                            if (data.status === 200) {
                                UIkit.modal('#modal_funding').hide();
                                $(".k-grid").data("kendoGrid").dataSource.read();
                                $timeout(() => $rootScope.clearForm("validator"));
                                $rootScope.alert(true, "Амжилттай хадгаллаа.");

                                $scope.app = {useYn: 1, systemType: 1, ecoType: 430, required: 1, orderId: 1};
                                $scope.privileges = {};
                                // $scope.stat(2, false, data.id);
                            } else {
                                $rootScope.alert(false, "Алдаа гарлаа.");
                            }
                        });
               /*     }
                    else {
                        $rootScope.alert(false,"Бүрэн бөглөнө үү.");
                    }*/
                };

                $scope.changeSystemType= function (id){
                    $scope.app.systemType = id;

                    if($scope.app.systemType == 1){
                        $scope.answerDisable = true;
                        $scope.confirmDisable = false;
                    }

                    if($scope.app.systemType == 2){
                        $scope.answerDisable = false;
                        $scope.confirmDisable = true;
                    }
                }

            }
        ]
    );
