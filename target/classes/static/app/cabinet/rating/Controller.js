angular.module("altairApp")
    .controller("rateUserCtrl", [
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
        $scope.menuData = JSON.parse(localStorage.getItem("menuData"));

        $scope.planDatasource = commonDataSource.urlDataSource("/api/cab/plan/list",
            JSON.stringify({
                filter: {
                    logic: "and",
                    filters: [{field: "useYn", operator: "eq", value: 1},{
                        field: "orgId",
                        operator: "eq",
                        value: $scope.user.orgId,
                    }]
                }, sort: [{field: "id", dir: "asc"}]
            })
        );

        $scope.dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: __env.apiUrl() + "/api/admin/v1/cab-rate-user/list",
                    contentType: "application/json; charset=UTF-8",
                    type: "POST",
                    data: {
                        sort: [{field: "id", dir: "desc"}],
                    },
                    beforeSend: function (req) {
                        req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
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
                    template: "<div class='flex' style='justify-content: space-between;'><span ng-bind='dataItem.userNm'></span> </div>",
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
                    headerAttributes: { "class": "checkbox-align"},
                    attributes: {style: "text-align: center;"},
                    width:100
                },
              /*  {
                    field: "statusNm",
                    filterable: {
                        cell: {
                            operator: "contains",
                            suggestionOperator: "contains",
                            showOperators: false
                        }
                    },
                    template: "<span class='cursor-pointer bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300' ng-bind='dataItem.userStatusNm'></span>",
                    headerAttributes: { "class": "checkbox-align"},
                    attributes: {style: "text-align: center;"},
                    title: "Төлөв",
                    width: 100,
                },*/
                {
                    field: "typeStr",
                    filterable: {
                        cell: {
                            operator: "contains",
                            suggestionOperator: "contains",
                            showOperators: false
                        }
                    },
                    values:[{"text":"Эхний хагас жил","value":"01"},{"text":"Cүүлийн хагас жил","value":"02"}],
                    template: "<span class=\"cursor-pointer  text-xs font-medium me-2 px-2.5 py-0.5 rounded\" ng-class=\"dataItem.typeStr=='01'?'bg-green-100 text-green-800':'bg-indigo-100 text-green-800'\" ng-bind=\"dataItem.typeStr=='01'?'Эхний хагас жил':'Cүүлийн хагас жил'\"></span>",
                    headerAttributes: { "class": "checkbox-align"},
                    attributes: {style: "text-align: center;"},
                    title: "Төрөл",
                    width: 150,
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
                    headerAttributes: { "class": "checkbox-align"},
                    attributes: {style: "text-align: center;"},
                    title: "Нийт зорилт",
                    width: 100,
                },

                {
                    field: "obj2Cnt",
                    filterable: {
                        cell: {
                            operator: "contains",
                            suggestionOperator: "contains",
                            showOperators: false
                        }
                    },
                    template: "<span ng-click='gotoEvaluation(dataItem)' class='cursor-pointer bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300'></span>",
                    headerAttributes: { "class": "checkbox-align"},
                    attributes: {style: "text-align: center;"},
                    title: "Ярилцлага",
                    width: 100,
                },
                {
                    field: "obj2TypeCnt",
                    filterable: {
                        cell: {
                            operator: "contains",
                            suggestionOperator: "contains",
                            showOperators: false
                        }
                    },
                    headerAttributes: { "class": "checkbox-align"},
                    attributes: {style: "text-align: center;"},
                    template: "<span ng-click='gotoRep(dataItem)' class='cursor-pointer bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300' ng-bind='dataItem.userRate | number:1 || 0'></span>",
                    title: "Тайлан",
                    width: 100,
                },
                {
                    field: "obj2TypeCnt",
                    filterable: {
                        cell: {
                            operator: "eq",
                            suggestionOperator: "eq",
                            showOperators: false
                        }
                    },
                    headerAttributes: { "class": "checkbox-align text-center"},
                    attributes: {style: "text-align: center;"},
                    title: "Ажлын дундаж",
                    width: 100,
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

        if (localStorage.getItem("buttonData").includes("read")) {
            $scope.mainGrid.toolbar = ["excel", "search"];
        }
        if (localStorage.getItem("buttonData").includes("create")) {
            $scope.mainGrid.toolbar = [{template: "<button class='md-btn custom-btn' ng-click='add()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>"}];
        }
        if (localStorage.getItem("buttonData").includes("update") || localStorage.getItem("buttonData").includes("edit")) {
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

        var modalForm = UIkit.modal("#modal_form", {
            modal: false,
            keyboard: false,
            bgclose: false,
            center: true
        });

        $scope.add = function () {
            $scope.dataItem = {useYn: 1,orgId:$scope.user.orgId,typeStr:'01', status: "draft"};
            $timeout(() => $rootScope.clearForm("userForm"));
            modalForm.show();
        }

        $scope.formSubmit = function () {
            var validator = $("#validator").kendoValidator().data("kendoValidator");
            if (validator.validate()) {
                modalForm.hide();
                var method = "post";
                if ($scope.dataItem.id !== undefined && $scope.dataItem.id !== null) method = "put";
                mainService.withResponse("post", "/api/cab/rate/submit", $scope.dataItem).then(function (response) {
                    if(response.status===200){
                        $(".k-grid").data("kendoGrid").dataSource.read();
                        $timeout(() => $rootScope.clearForm("userForm"));
                    }
                    else{
                        $rootScope.alert(false,"Амжилтгүй!!!");
                    }
                });
            }
        };

        $scope.gotoDetail = function (item) {
            $state.go("restricted.cabinet.plan-item", {id: item.id,userId: item.userId});
        }
    },
]);
