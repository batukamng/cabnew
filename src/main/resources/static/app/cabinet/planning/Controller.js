angular.module("altairApp").controller("planningAdminCtrl", [
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
        $scope.user = JSON.parse(sessionStorage.getItem("currentUser")).user;
        $scope.menuData = JSON.parse(sessionStorage.getItem("menuData"));

        $scope.dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: __env.apiUrl() + "/api/admin/v1/cab-plan-user/list",
                    contentType: "application/json; charset=UTF-8",
                    type: "POST",
                    data: {
                        sort: [{field: "id", dir: "desc"}],
                    },
                    beforeSend: function (req) {
                        req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
                    },
                },
                parameterMap: function (options) {
                    return JSON.stringify(options);
                },
            },
            schema: {
                data: "data",
                total: "total",
                model: {
                    id: "id",
                    fields: {
                        id: {type: "number", nullable: true},
                        useYn: {type: "number", defaultValue: 1}
                    },
                },
            },
            filter: {
                logic: "and",
                filters: [
                    {
                        field: "useYn",
                        operator: "eq",
                        value: 1,
                    },

                    {
                        field: "userStatusNm",
                        operator: "neq",
                        value: 'Хадгалсан'
                    },
                    {
                        field: "orgId",
                        operator: "eq",
                        value: $scope.user.orgId
                    }
                ],
            },
            pageSize: 20,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
        });
        $scope.mainGrid = {
            filterable: {
                mode: "row",
                extra: false,
                operators: {
                    // redefine the string operators
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
            pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5,
            },
            // toolbar: ["excel"],
            columns: [
                {
                    title: "#",
                    headerAttributes: {class: "checkbox-align"},
                    attributes: {style: "text-align: center;"},
                    template: "#= ++record #",
                    width: 50,
                },
                /*  {
                      field: "orgNm",
                      filterable: {
                          cell: {
                              operator: "contains",
                              suggestionOperator: "contains",
                              showOperators: false
                          }
                      },
                      title: "Байгууллага",
                  },*/
                {
                    field: "userNm",
                    filterable: {
                        cell: {
                            operator: "contains",
                            suggestionOperator: "contains",
                            showOperators: false
                        }
                    },
                    template: "<div class='flex' style='justify-content: space-between;'><span ng-bind='dataItem.userNm'></span> <span ng-cloak='' class='cursor-pointer bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300' ng-bind='dataItem.userStatusNm'></span></div>",
                    title: "Албан хаагч",
                },
                {
                    field: "planYr",
                    filterable: {
                        cell: {
                            operator: "contains",
                            suggestionOperator: "contains",
                            showOperators: false
                        }
                    },
                    title: "Огноо",
                    headerAttributes: {"class": "checkbox-align"},
                    attributes: {style: "text-align: center;"},
                    width: 100
                },
                {
                    field: "objCnt",
                    filterable: {
                        cell: {
                            operator: "contains",
                            suggestionOperator: "contains",
                            showOperators: false
                        }
                    },
                    headerAttributes: {"class": "checkbox-align"},
                    attributes: {style: "text-align: center;"},
                    title: "Нийт зорилт",
                    width: 100,
                },
                {
                    headerAttributes: {"class": "checkbox-align"},
                    attributes: {style: "text-align: center;"},
                    title: "Гүйцэтгэлийн зорилт, арга хэмжээ",
                    columns: [
                        {
                            field: "cnt01",
                            filterable: {
                                cell: {
                                    operator: "eq",
                                    suggestionOperator: "eq",
                                    showOperators: false
                                }
                            },
                            headerAttributes: {"class": "checkbox-align"},
                            attributes: {style: "text-align: center;"},
                            title: "Үндсэн",
                            width: 120,
                        },
                        {
                            field: "subCnt01",
                            filterable: {
                                cell: {
                                    operator: "eq",
                                    suggestionOperator: "eq",
                                    showOperators: false
                                }
                            },
                            headerAttributes: {"class": "checkbox-align"},
                            attributes: {style: "text-align: center;"},
                            title: "Дэд",
                            width: 120,
                        },
                    ]
                },
                {
                    headerAttributes: {"class": "checkbox-align"},
                    attributes: {style: "text-align: center;"},
                    title: "Мэдлэг, ур чадвараа дээшлүүлэх",
                    columns: [
                        {
                            field: "cnt02",
                            filterable: {
                                cell: {
                                    operator: "contains",
                                    suggestionOperator: "contains",
                                    showOperators: false
                                }
                            },
                            headerAttributes: {"class": "checkbox-align"},
                            attributes: {style: "text-align: center;"},
                            title: "Үндсэн",
                            width: 120,
                        },
                        {
                            field: "subCnt02",
                            filterable: {
                                cell: {
                                    operator: "eq",
                                    suggestionOperator: "eq",
                                    showOperators: false
                                }
                            },
                            headerAttributes: {"class": "checkbox-align"},
                            attributes: {style: "text-align: center;"},
                            title: "Дэд",
                            width: 120,
                        },
                    ]
                },
                {
                    headerAttributes: {"class": "checkbox-align"},
                    attributes: {style: "text-align: center;"},
                    title: "Нэмэлт",
                    columns: [
                        {
                            field: "cnt03",
                            filterable: {
                                cell: {
                                    operator: "contains",
                                    suggestionOperator: "contains",
                                    showOperators: false
                                }
                            },
                            headerAttributes: {"class": "checkbox-align"},
                            attributes: {style: "text-align: center;"},
                            title: "Үндсэн",
                            width: 100,
                        },
                        {
                            field: "subCnt03",
                            filterable: {
                                cell: {
                                    operator: "eq",
                                    suggestionOperator: "eq",
                                    showOperators: false
                                }
                            },
                            headerAttributes: {"class": "checkbox-align"},
                            attributes: {style: "text-align: center;"},
                            title: "Дэд",
                            width: 100,
                        },
                    ]
                },
                
            ],
            dataBinding: function () {
                record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
            },
            editable: "inline",
            scrollable: true,
            height: function () {
                if ($scope.menuData.pageType === 0) {
                    return $(window).height() - 160;
                }
                return $(window).height() - 110;
            }
        };

        if (sessionStorage.getItem("buttonData").includes("read")) {
            $scope.mainGrid.toolbar = ["excel", "search"];
        }
        if (sessionStorage.getItem("buttonData").includes("update") || sessionStorage.getItem("buttonData").includes("edit")) {
            $scope.mainGrid.columns.push({
                command: [
                    {
                        template:
                            '<div class="flex justify-center gap-3"><button class="grid-btn" ng-click=\'gotoDetail(dataItem)\'><div class="nimis-icon see "></div>Харах</button></div>',
                    },
                ],
                title: "&nbsp;",
                headerAttributes: {class: "rightMinus"},
                attributes: {class: "rightMinus uk-text-center"},
                sticky: true,
                width: 100,
            });
        }

        var modalAttitude = UIkit.modal("#modal_form_attitude", {
            modal: false,
            keyboard: false,
            bgclose: false,
            center: true
        });

        var modalEvaluation = UIkit.modal("#modal_form_evaluation", {
            modal: false,
            keyboard: false,
            bgclose: false,
            center: true
        });

        $scope.formSubmit = function () {
            var validator = $("#validatorAttitude").kendoValidator().data("kendoValidator");
            if (validator.validate()) {
                modalAttitude.hide();
                var method = "post";
                if ($scope.attitudeItem.id !== undefined && $scope.attitudeItem.id !== null) method = "put";
                mainService.withResponse("post", "/api/cab/plan/user/rate/submit", $scope.attitudeItem).then(function (response) {
                    if (response.status === 200) {
                        $timeout(function () {
                            //  $rootScope.alert(true, "Амжилттай хадгаллаа.");
                            // $state.go("restricted.cabinet.plan-org-edit", {id: response.data.id});
                        }, 500)
                    } else {
                        $rootScope.alert(false, "Амжилтгүй!!!");
                    }
                });
            }
        };

        $scope.gotoAttitude = function (item) {
            $scope.attitudeItem = item;
            $scope.attitudeItem.planId = item.id;
            if ($scope.attitudeItem.season == null) {
                $scope.attitudeItem.season = '01';
            }
            modalAttitude.show();
        }

        $scope.gotoEvaluation = function (item) {
            $scope.evaluationItem = item;
            $scope.evaluationItem.planId = item.id;
            /*if( $scope.attitudeItem.season==null){
                $scope.attitudeItem.season='01';
            }*/
            modalEvaluation.show();
        }

        $scope.gotoDetail = function (item) {
            $state.go("restricted.cabinet.plan-item", {id: item.id, userId: item.userId});
        }

        $scope.gotoRate = function (item) {
            $state.go("restricted.cabinet.plan-rate", {id: item.id, userId: item.userId});
        }

        $scope.gotoRep = function (item) {
            $state.go("restricted.cabinet.report-rate", {id: item.id, userId: item.userId});
        }
    },
]);
