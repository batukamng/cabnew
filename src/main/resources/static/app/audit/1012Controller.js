angular.module("altairApp")
    .controller("1012AdtCtrl", [
        "$rootScope",
        "$state",
        "$scope",
        "$timeout",
        "mainService",
        "commonDataSource",
        "sweet",
        "Upload",
        "__env",
        function ($rootScope, $state, $scope, $timeout, mainService, commonDataSource, sweet, Upload, __env) {
            $scope.user = JSON.parse(sessionStorage.getItem("currentUser")).user;
            $("#header_main").attr("style", "filter: none !important;padding: 8px 25px");

            var filters=[ {field: "useYn", operator: "eq", value: 1}];
            if($scope.user.level.code!=='001'){
                filters.push( {field: "depId", operator: "eq", value: $scope.user.depId});
                filters.push( {field: "userStr", operator: "contains", value: $scope.user.id+"-"+$scope.user.username});
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
                                filters: filters,
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
                    {
                        title: "Баг",
                        columns: [
                            {
                                field: "leaderNm",
                                title: "Багийн ахлах",
                                width: 120,
                                attributes: {"style": "text-align: left;"},
                                headerAttributes: {"style": "white-space: normal; vertical-align: middle;text-align: left;"},
                                filterable: {cell: {operator: "contains", showOperators: false, suggestionOperator: "contains"}}
                            },
                            {
                                field: "memberNm",
                                title: "Багийн гишүүд",
                                width: 300,
                                attributes: {"style": "text-align: left;"},
                                headerAttributes: {"style": "white-space: normal; vertical-align: middle;text-align: left;"},
                                filterable: {cell: {operator: "contains", showOperators: false, suggestionOperator: "contains"}}
                            },
                        ]
                    },
                    {
                        title: "Батлах хэрэглэгчид",
                        columns: [
                            {
                                field: "approve1",
                                title: "I түвшин",
                                width: 120,
                                attributes: {"style": "text-align: left;"},
                                headerAttributes: {"style": "white-space: normal; vertical-align: middle;text-align: left;"},
                                filterable: {cell: {operator: "contains", showOperators: false, suggestionOperator: "contains"}}
                            },
                            {
                                field: "approve2",
                                title: "II түвшин",
                                width: 120,
                                attributes: {"style": "text-align: left;"},
                                headerAttributes: {"style": "white-space: normal; vertical-align: middle;text-align: left;"},
                                filterable: {cell: {operator: "contains", showOperators: false, suggestionOperator: "contains"}}
                            },
                            {
                                field: "approve3",
                                title: "III түвшин",
                                width: 120,
                                attributes: {"style": "text-align: left;"},
                                headerAttributes: {"style": "white-space: normal; vertical-align: middle;text-align: left;"},
                                filterable: {cell: {operator: "contains", showOperators: false, suggestionOperator: "contains"}}
                            },
                        ]
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

            if (($rootScope.buttonData && sessionStorage.getItem("buttonData").includes("update")) || sessionStorage.getItem("buttonData").includes("edit")) {
                $scope.mainGrid.columns.push({
                    command: [
                        {
                            template:'<button class="grid-btn" ng-click="gotoDetail(dataItem)" style="width: 80px;margin-left: 8px;"><div class="nimis-icon see" style="line-height: 15px;display: inline"></div><span>Харах</span></button>'
                        },
                    ],
                    title: "&nbsp;",
                    headerAttributes: {class: "rightMinus"},
                    attributes: {class: "rightMinus uk-text-center"},
                    sticky: true,
                    width: 100,
                });
            }

            $scope.gotoDetail = function (item) {
                sessionStorage[$state.current.name + $scope.user.id] = JSON.stringify($scope.grid.getOptions().dataSource.filter);
                $state.go("restricted.adt.auditView", {id: item.id});
            };
        },
    ]);
