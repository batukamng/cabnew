angular.module("altairApp")
    .controller("1001AdtCtrl", [
        "$rootScope",
        "$state",
        "$scope",
        "$timeout",
        "mainService",
        "commonDataSource",
        "sweet",
        "$log",
        "Upload",
        "__env",
        function ($rootScope, $state, $scope, $timeout, mainService, commonDataSource, sweet,$log, Upload,  __env) {
            $scope.user = JSON.parse(sessionStorage.getItem("currentUser")).user;
            $("#header_main").attr("style", "filter: none !important;padding: 8px 25px");

            $scope.entity = {
                name : "Test",
                fields :
                    [
                        {type: "text", name: "firstname", label: "Name" , required: true, data:""},
                        {type: "radio", name: "color_id", label: "Colors" , options:[{id: 1, name: "orange"},{id: 2, name: "pink"},{id: 3, name: "gray"},{id: 4, name: "cyan"}], required: true, data:""},
                        {type: "email", name: "emailUser", label: "Email" , required: true, data:""},
                        {type: "text", name: "city", label: "City" , required: true, data:""},
                        {type: "password", name: "pass", label: "Password" , min: 6, max:20, required: true, data:""},
                        {type: "select", name: "teacher_id", label: "Teacher" , options:[{name: "Mark"},{name: "Claire"},{name: "Daniel"},{name: "Gary"}], required: true, data:""},
                        {type: "checkbox", name: "car_id", label: "Cars" , options:[{id: 1, name: "bmw"},{id: 2, name: "audi"},{id: 3, name: "porche"},{id: 4, name: "jaguar"}], required: true, data:""}
                    ]
            };

            $scope.submitForm = function(){
                $log.debug($scope.entity);
            }

            $scope.appDataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: __env.apiUrl() + "/api/adt/registration/main/list",
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
                        data: {
                            custom: {
                                logic: "and",
                                filters: [
                                    {field: "useYn", operator: "eq", value: 1},
                                ],
                            },
                        },
                        beforeSend: function (req) {
                            if (JSON.parse(sessionStorage.getItem("currentUser")) != null) {
                                req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
                            } else {
                                $state.go("login");
                                $rootScope.$broadcast("LogoutSuccessful");
                            }
                        },
                    },
                    parameterMap: function (options) {
                        return JSON.stringify(options);
                    },
                },
                schema: {
                    data: "data",
                    total: "total",
                },
                pageSize: 20,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
            });
            $scope.mainGrid = {
                sortable: true,
                resizable: true,
                persistSelection: true,
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    info: true,
                    buttonCount: 5,
                },
                filterable: {
                    mode: "row",
                    extra: false,
                    cell: {
                        operator: "eq",
                    },
                },
                columns: [
                    {
                        title: "#",
                        headerAttributes: {class: "columnCenter"},
                        attributes: {style: "text-align: center;"},
                        template: "#= ++record #",
                        sticky: true,
                        width: 60,
                    },
                    {
                        field: "code",
                        title: "Аудитын код",
                        attributes: {"style": "text-align: left;"},
                        headerAttributes: {"style": "white-space: normal; vertical-align: middle;text-align: center;"},
                        width: 200,
                        sticky: true,
                        filterable: {cell: {operator: "contains", showOperators: false, suggestionOperator: "contains"}}
                    },
                    {
                        field: "auditTypeNm",
                        title: "Аудитын нэр",
                        attributes: {"style": "text-align: left;"},
                        headerAttributes: {"style": "white-space: normal; vertical-align: middle;text-align: center;"},
                        width: 200,
                        filterable: {cell: {operator: "contains", showOperators: false, suggestionOperator: "contains"}}
                    },
                    {
                        field: "planYr",
                        title: "Тайлант хугацаа",
                        width: 100,
                        attributes: {"style": "text-align: center;"},
                        headerAttributes: {"style": "white-space: normal; vertical-align: middle;text-align: center;"},
                        filterable: {cell: {operator: "contains", showOperators: false, suggestionOperator: "contains"}}
                    },
                    {
                        title: "Аудит хийх",
                        columns: [
                            {
                                field: "strDt",
                                title: "Эхлэх огноо",
                                format: "{0:MM/dd/yyyy}",
                                width: 120,
                                attributes: {"style": "text-align: center;"},
                                headerAttributes: {"style": "white-space: normal; vertical-align: middle;text-align: center;"},
                                filterable: {cell: {operator: "contains", showOperators: false, suggestionOperator: "contains"}}
                            },
                            {
                                field: "endDt",
                                title: "Дуусах огноо",
                                width: 120,
                                format: "{0:MM/dd/yyyy}",
                                attributes: {"style": "text-align: center;"},
                                headerAttributes: {"style": "white-space: normal; vertical-align: middle;text-align: center;"},
                                filterable: {cell: {operator: "contains", showOperators: false, suggestionOperator: "contains"}}
                            },
                        ]
                    },
                    {
                        field: "orgTezNo",
                        title: "ТЕЗ Регистрийн дугаар",
                        attributes: {"style": "text-align: left;"},
                        headerAttributes: {"style": "white-space: normal; vertical-align: middle;text-align: center;"},
                        width: 120,
                        filterable: {cell: {operator: "contains", showOperators: false, suggestionOperator: "contains"}}
                    },
                    {
                        field: "orgTezNm",
                        title: "Төсвийн ерөнхийлөн захирагч",
                        attributes: {"style": "text-align: left;"},
                        headerAttributes: {"style": "white-space: normal; vertical-align: middle;text-align: center;"},
                        width: 200,
                        filterable: {cell: {operator: "contains", showOperators: false, suggestionOperator: "contains"}}
                    },
                    {
                        field: "orgTtzNo",
                        title: "ТТЗ Регистрийн дугаар",
                        attributes: {"style": "text-align: left;"},
                        headerAttributes: {"style": "white-space: normal; vertical-align: middle;text-align: center;"},
                        width: 150,
                        filterable: {cell: {operator: "contains", showOperators: false, suggestionOperator: "contains"}}
                    },
                    {
                        field: "orgTtzNm",
                        title: "ТТЗ",
                        attributes: {"style": "text-align: left;"},
                        headerAttributes: {"style": "white-space: normal; vertical-align: middle;text-align: center;"},
                        width: 200,
                        filterable: {cell: {operator: "contains", showOperators: false, suggestionOperator: "contains"}}
                    },
                    {
                        field: "orgTypeNm",
                        title: "Төсөв захирагчийн ангилал",
                        attributes: {"style": "text-align: left;"},
                        headerAttributes: {"style": "white-space: normal; vertical-align: middle;text-align: center;"},
                        width: 150,
                        filterable: {cell: {operator: "contains", showOperators: false, suggestionOperator: "contains"}}
                    },
                    {
                        field: "orgNm",
                        title: "Шалгагдагч байгууллагын нэр",
                        attributes: {"style": "text-align: left;"},
                        headerAttributes: {"style": "white-space: normal; vertical-align: middle;text-align: center;"},
                        width: 200,
                        filterable: {cell: {operator: "contains", showOperators: false, suggestionOperator: "contains"}}
                    },
                    {
                        field: "orgRegNo",
                        title: "Регистрийн дугаар",
                        attributes: {"style": "text-align: center;"},
                        headerAttributes: {"style": "white-space: normal; vertical-align: middle;text-align: center;"},
                        width: 120,
                        filterable: {cell: {operator: "contains", showOperators: false, suggestionOperator: "contains"}}
                    },
                    {
                        field: "formTypeNm",
                        title: "Аудит хийх хэлбэр",
                        attributes: {"style": "text-align: left;"},
                        headerAttributes: {"style": "white-space: normal; vertical-align: middle;text-align: center;"},
                        width: 150,
                        filterable: {cell: {operator: "contains", showOperators: false, suggestionOperator: "contains"}}
                    },
                    {
                        field: "exeTypeNm",
                        title: "Аудит хийх байгууллагын төрөл",
                        attributes: {"style": "text-align: left;"},
                        headerAttributes: {"style": "white-space: normal; vertical-align: middle;text-align: center;"},
                        width: 200,
                        filterable: {cell: {operator: "contains", showOperators: false, suggestionOperator: "contains"}}
                    },
                    {
                        field: "depNm",
                        title: "Аудит хийх байгууллага,нэгжийн нэр",
                        attributes: {"style": "text-align: left;"},
                        headerAttributes: {"style": "white-space: normal; vertical-align: middle;text-align: center;"},
                        width: 200,
                        filterable: {cell: {operator: "contains", showOperators: false, suggestionOperator: "contains"}}
                    },
                ],
                dataBinding: function () {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                },
                editable: false,
                height: function () {
                    return $(window).height() - 110;
                },
            };

            if (sessionStorage.getItem("buttonData").includes("read")) {
                $scope.mainGrid.toolbar = ["excel", "search"];
            }
            if (sessionStorage.getItem("buttonData").includes("create")) {
                $scope.mainGrid.toolbar = [{template: "<button class='md-btn custom-btn' ng-click='add()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>"}];
            }
            if (sessionStorage.getItem("buttonData").includes("update") || sessionStorage.getItem("buttonData").includes("edit")) {
                $scope.mainGrid.columns.push({
                    command: [
                        {
                            template:
                                '<div class="k-command-cell command-container">' +
                                '<a ng-show="editAble!=dataItem.id" ng-click="gotoDetail(dataItem)" class="grid-btn"><div class="nimis-icon edit"></div>Баг</a>' +
                                '<a ng-show="editAble!=dataItem.id" ng-click="update(dataItem)" class="grid-btn"><div class="nimis-icon edit"></div></a>' +
                                '<a ng-show="editAble!=dataItem.id" class="grid-btn k-grid-remove-command"><div class="nimis-icon delete"></div></a>' +
                                '<a ng-show="editAble==dataItem.id" ng-click="editMode(true,dataItem)" class="grid-btn k-grid-save-command"><div class="nimis-icon update"></div></a> ' +
                                '<a ng-show="editAble==dataItem.id" ng-click="editMode(true,dataItem)"  class="grid-btn k-grid-cancel-command"><div class="nimis-icon cancel"></div></a>' +
                                '</div>',
                        },
                    ],
                    title: "&nbsp;",
                    sticky: true,
                    width: 150,
                });
            }

            var modalForm = UIkit.modal("#modal_form", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true,
                width: 600,
            });

            $scope.gotoDetail = function (item) {
                sessionStorage[$state.current.name + $scope.user.id] = JSON.stringify($scope.grid.getOptions().dataSource.filter);
                $state.go("restricted.adt.1015", {id: item.id});
            };

            $scope.update=function (item){
                $scope.dataItem = item;
                modalForm.show();
            }

            $scope.orgDataSource = commonDataSource.urlDataSource("/api/admin/organization/list",
                JSON.stringify({
                    filter: {
                        logic: "and",
                        filters: [{field: "useYn", operator: "eq", value: 1}]
                    }, sort: [{field: "name", dir: "asc"}]
                })
            );
            $scope.yearDataSource = commonDataSource.urlDataSource("/api/adt/period/list",
                JSON.stringify({
                    filter: {
                        logic: "and",
                        filters: [{field: "useYn", operator: "eq", value: 1}]
                    }, sort: [{field: "name", dir: "asc"}]
                })
            );

            $scope.dataItem = {};
            $scope.editAble = 0;
            $scope.add = function (type) {
                $scope.dataItem = {auditType: 1,confType: 1, useYn: 1, auditOrgType: 1,formType:1,mainType:1};
                $scope.departmentDataSource = commonDataSource.urlDataSource("/api/adt/department/list",
                    JSON.stringify({
                        filter: {
                            logic: "and",
                            filters: [{field: "useYn", operator: "eq", value: 1},{field: "shortName", operator: "neq", value: "ААН"}]
                        }, sort: [{field: "name", dir: "asc"}]
                    })
                );
                modalForm.show();
            };
            $scope.editMode = function (bool, item) {
                if (bool) {
                    $scope.editAble = 0;
                } else {
                    $scope.editAble = item.id;
                }
            }
            $scope.formSubmit = function () {
                var validator = $("#validator").kendoValidator().data("kendoValidator");
                if (validator.validate()) {
                   /* if ($scope.dataItem.confType === 0) $scope.dataItem.parentId = null;
                    if ($scope.dataItem.confType === 1) $scope.dataItem.parentId = $scope.dataItem.confId;*/
                    var method = "post";
                    if ($scope.dataItem.id!==undefined && $scope.dataItem.id!==null) method="put";
                    mainService.withdata(method, "/api/adt/registration", $scope.dataItem).then(function (data) {
                        $rootScope.alert(true, "Амжилттай хадгаллаа.");
                        modalForm.hide();
                        $(".k-grid").data("kendoGrid").dataSource.read();
                    });
                }
            };
            $scope.auditOrgTypeChange=function (i){
                $scope.dataItem.auditOrgType=i;
                if(i===0){
                    $scope.departmentDataSource = commonDataSource.urlDataSource("/api/adt/department/list",
                        JSON.stringify({
                            filter: {
                                logic: "and",
                                filters: [{field: "useYn", operator: "eq", value: 1},{field: "shortName", operator: "eq", value: "ААН"}]
                            }, sort: [{field: "name", dir: "asc"}]
                        })
                    );
                }
               else{
                    $scope.departmentDataSource = commonDataSource.urlDataSource("/api/adt/department/list",
                        JSON.stringify({
                            filter: {
                                logic: "and",
                                filters: [{field: "useYn", operator: "eq", value: 1},{field: "shortName", operator: "neq", value: "ААН"}]
                            }, sort: [{field: "name", dir: "asc"}]
                        })
                    );
                }
            }

        },
    ]);
