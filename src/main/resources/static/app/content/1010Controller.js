angular
    .module('altairApp')
    .controller(
        '1010CntCtrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$timeout',
            'mainService',
            '__env',
            function ($rootScope, $state, $scope, $timeout, mainService, __env) {
                $scope.user = JSON.parse(sessionStorage.getItem('currentUser'));

                $scope.mainGrid = {
                    dataSource: {
                        transport: {
                            read: {
                                url: function (e) {
                                    return __env.apiUrl() + "/api/service/v1/featured/list";
                                },
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                data: {"sort": [{field: 'id', dir: 'desc'}], "showUseYn": true},
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                }
                            },
                            destroy: {
                                url: __env.apiUrl() + "/api/cnt/featured/delete",
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
                                    title: {type: "string", validation: {required: true}},
                                    type: {type: "string"},
                                    status: {type: "string"},
                                    visibility: {type: "string"},
                                    slug: {type: "string"},
                                    regId: {type: "number"},
                                    useYn: {type: "boolean"},
                                    user: { editable: false },
                                    cntTermTaxonomies: {defaultValue:[]}
                                }
                            }
                        },
                        pageSize: 20,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
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
                            { name: "shortText", operator: "contains" },
                        ]
                    },
                    columns: [
                        {
                            title: "#",
                            headerAttributes: {"class": "columnCenter"},
                            attributes: {"style": "text-align: center;"},
                            template: "#= ++record #",
                            sticky: true,
                            width: 50
                        },
                        {
                            field: "title",
                            filterable: {
                                cell: {
                                    operator: "contains",
                                    showOperators: false,
                                    suggestionOperator: "contains"
                                }
                            },
                            title: "Гарчиг",
                            headerAttributes: {style: "text-align: left; font-weight: bold"}
                        },
                        {
                            field: "useYn",
                            filterable: {
                                cell: {
                                    operator: "useYn",
                                    showOperators: false,
                                    suggestionOperator: "contains"
                                }
                            },
                            template: "# if (useYn == true) {# <span>Нийтлэх</span> # } else {# <span>Нийтлэхгүй</span># } #",
                            title: "Төлөв",
                            headerAttributes: {style: "text-align: left; font-weight: bold"}
                        },
                        {
                            field: "status",
                            filterable: {
                                cell: {
                                    operator: "contains",
                                    showOperators: false,
                                    suggestionOperator: "contains"
                                }
                            },
                            title: "Төрөл",
                            headerAttributes: {style: "text-align: left; font-weight: bold"}
                        },
                        {
                            field: "appTitle",
                            filterable: {
                                cell: {
                                    operator: "contains",
                                    showOperators: false,
                                    suggestionOperator: "contains"
                                }
                            },
//                            template: "# if (appr != null) {# <span>#=appr.pipNm#</span> #} else if (app != null) {# <span>#=app.name#</span> #}#",
                            title: "Холбогдох төсөл",
                            headerAttributes: {style: "text-align: left; font-weight: bold"}
                        },
                        {
                            field: "subtitle",
                            filterable: {
                                cell: {
                                    operator: "contains",
                                    showOperators: false,
                                    suggestionOperator: "contains"
                                }
                            },
                            title: "Товч тайлбар",
                            headerAttributes: {style: "text-align: left; font-weight: bold"}
                        }
                    ],
                    dataBinding: function() {
                        record = (this.dataSource.page() -1) * this.dataSource.pageSize();
                    },
                    editable: "inline",
                    height: function () {
                        return $(window).height() - 110;
                    }
                };
                $scope.mainGrid.toolbar = [];

                $scope.planYr=sessionStorage.getItem('planYr');
                $scope.$on("loadPlanYr", function (event, obj) {
                    $scope.planYr = obj.planYr;
                    $scope.readDataSource($scope.planYr);
                });
                var steps = [];
                $scope.appOrAppr = 'appr';
                angular.forEach($scope.user.user.roles, function (value, key) {
                    if (value.auth === 'Tra0201') {
                        steps = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                    }
                    if (value.auth === 'Tra03') {
                        steps = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                    }
                    if (value.auth === 'Tra04') {
                        steps = [5, 6, 7, 8, 9, 10];
                    }
                });
                $scope.appDataSource = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: __env.apiUrl() + "/api/app/list",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            data: { status: ["saved", "sent"], stepId: steps, "sourceType": "УТ", sort: [{ field: "id", dir: "desc" }] },
                            beforeSend: function (req) {
                                if (JSON.parse(sessionStorage.getItem('currentUser')) != null) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                }
                                else {
                                    $state.go('login');
                                    $rootScope.$broadcast('LogoutSuccessful');
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
                    pageSize: 20,
                    serverPaging: true,
                    serverSorting: true,
//                    serverFiltering: true,
                    /*  serverGrouping: true,
                    serverAggregates: false,*/
                    /* group: [{
                         field: "tezId",
                         dir: "asc"
                     }]*/
                });
                $scope.apprDataSource = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: __env.apiUrl() + "/api/appr/list",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            data: { planYr: $scope.planYr, status: ["saved", "sent"], stepId: steps, "sourceType": "УТ", sort: [{ field: "id", dir: "desc" }] },
                            beforeSend: function (req) {
                                if (JSON.parse(sessionStorage.getItem('currentUser')) != null) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                }
                                else {
                                    $state.go('login');
                                    $rootScope.$broadcast('LogoutSuccessful');
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
                    pageSize: 20,
                    serverPaging: true,
                    serverSorting: true,
//                    serverFiltering: true,
                    /*  serverGrouping: true,
                    serverAggregates: false,*/
                    /* group: [{
                         field: "tezId",
                         dir: "asc"
                     }]*/
                });
                $scope.appOptions = {
                    placeholder: "Сонгоно уу...",
                    valuePrimitive: true,
                    autoBind: false,
                    dataValueField: "id",
                    dataTextField: "name",
                    virtual: {
                        itemHeight: 27,
                        valueMapper: function(options) {
                        }
                    },
                };
                $scope.apprOptions = {
                    placeholder: "Сонгоно уу...",
                    valuePrimitive: true,
                    autoBind: false,
                    dataValueField: "id",
                    dataTextField: "pipNm",
                    virtual: {
                        itemHeight: 27,
                        valueMapper: function(options) {
                        }
                    },
                };

                $scope.submitProject = function (event) {
                    event.preventDefault();
                    if ($scope.validatorProject.validate()) {
                        var requestData = {"useYn": 0};
                        if ($scope.appOrAppr == 'appr') {
                            requestData["apprId"] = $scope.apprId;
                        } else {
                            requestData["appId"] = $scope.appId;
                        }
                        mainService.withdata('post', __env.apiUrl() + '/api/cnt/featured/create', requestData).then(function (data) {
                            $state.go('restricted.front.1010edit', { id: data.id })
                            UIkit.modal('#modal_application').hide();
                        });
                    }
                }
                $scope.edit = function (id){
                    $state.go('restricted.front.1010edit', { "id": id });
                };

                if(sessionStorage.getItem('buttonData').includes("C")){
                    $scope.mainGrid.toolbar.push({template: "<button class='k-button k-button-icontext' ng-click='addNew(0)'><span class=\"k-icon k-i-plus\"></span>Нэмэх</button>"});
                }
                if(sessionStorage.getItem('buttonData').includes("R")){
                    $scope.mainGrid.toolbar.push("search");
                }
                if(sessionStorage.getItem('buttonData').includes("U")){
                    $scope.mainGrid.columns.push({
                        command: [
                            {template:"<button class=\"k-button k-button-icontext\"  ng-click='edit(dataItem.id)'>Засах</button>"},
                            {name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn"}
                        ], title: "&nbsp;", width: 140,sticky: true, attributes: {"style":"text-align: left;"},
                    });
                }

                $scope.addNew = function (id) {
                    UIkit.modal('#modal_application', {
                        modal: false,
                        keyboard: false,
                        bgclose: false,
                        center: true
                    }).show();
                };
                $scope.view = function(step, back,appId) {
                    if (back) {
                        $(".stat-screen").hide();
                        $("#main_content").show();

                    } else {
                        $("#main_content").hide();
                        $("#form"+step).show();
                    }

                    if (appId == 0) {
                        appId = {};
                    }
                    if(step===2){
                        $scope.$broadcast("editContent", step,appId);
                    }
                    else{
                        $scope.$broadcast("loadContent", step,appId);
                    }
                };
            }
        ]
    );
