angular.module("altairApp").controller("myratingAdminCtrl", [
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
                    headerAttributes: { "class": "checkbox-align"},
                    attributes: {style: "text-align: center;"},
                    title: "Гүйцэтгэлийн зорилт, арга хэмжээ",
                    columns:[
                        {
                            field: "obj1Cnt",
                            filterable: {
                                cell: {
                                    operator: "eq",
                                    suggestionOperator: "eq",
                                    showOperators: false
                                }
                            },
                            headerAttributes: { "class": "checkbox-align"},
                            attributes: {style: "text-align: center;"},
                            title: "Зорилт",
                            width: 130,
                        },
                        {
                            field: "obj1TypeCnt",
                            filterable: {
                                cell: {
                                    operator: "eq",
                                    suggestionOperator: "eq",
                                    showOperators: false
                                }
                            },
                            headerAttributes: { "class": "checkbox-align"},
                            attributes: {style: "text-align: center;"},
                            title: "Арга хэмжээ",
                            width: 130,
                        },
                    ]
                },
                {
                    headerAttributes: { "class": "checkbox-align"},
                    attributes: {style: "text-align: center;"},
                    title: "Мэдлэг, ур чадвараа дээшлүүлэх",
                    columns:[
                        {
                            field: "obj2Cnt",
                            filterable: {
                                cell: {
                                    operator: "contains",
                                    suggestionOperator: "contains",
                                    showOperators: false
                                }
                            },
                            headerAttributes: { "class": "checkbox-align"},
                            attributes: {style: "text-align: center;"},
                            title: "Зорилт",
                            width: 130,
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
                            headerAttributes: { "class": "checkbox-align"},
                            attributes: {style: "text-align: center;"},
                            title: "Арга хэмжээ",
                            width: 130,
                        },
                    ]
                },
                {
                    headerAttributes: { "class": "checkbox-align"},
                    attributes: {style: "text-align: center;"},
                    title: "Үнэлгээ",
                    columns:[
                        {
                            field: "obj2Cnt",
                            filterable: {
                                cell: {
                                    operator: "contains",
                                    suggestionOperator: "contains",
                                    showOperators: false
                                }
                            },
                            template: "<span ng-click='gotoAttitude(dataItem)' class='cursor-pointer bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300' ng-bind='dataItem.userRate | number:1 || 0'></span>",
                            headerAttributes: { "class": "checkbox-align"},
                            attributes: {style: "text-align: center;"},
                            title: "Хамт олон",
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
                            template: "<span ng-click='myRate(dataItem)' class='cursor-pointer bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300' ng-bind='dataItem.userRate | number:1 || 0'></span>",
                            headerAttributes: { "class": "checkbox-align text-center"},
                            attributes: {style: "text-align: center;"},
                            title: "Гүйцэтгэл",
                            width: 100,
                        }
                    ]
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

        var modalAttitude = UIkit.modal("#modal_form_attitude", {
            modal: false,
            keyboard: false,
            bgclose: false,
            center: true
        });

        $scope.formSubmit = function () {
            var validator = $("#validatorAttitude").kendoValidator().data("kendoValidator");
            if (validator.validate()) {
                modalForm.hide();
                loader.show();
                var method = "post";
                if ($scope.dataItem.id !== undefined && $scope.dataItem.id !== null) method = "put";
                mainService.withResponse("post", "/api/cab/plan/attitude/submit", $scope.dataItem).then(function (response) {

                    if(response.status===200){
                        loader.hide();
                        $timeout(function (){
                            $rootScope.alert(true, "Амжилттай хадгаллаа.");
                            $state.go("restricted.cabinet.plan-org-edit", {id: response.data.id});
                        },500)
                    }
                    else{
                        $rootScope.alert(false,"Амжилтгүй!!!");
                    }
                });
            }
        };

        $scope.gotoAttitude = function (item) {
            $scope.attitudeItem = item;
            modalAttitude.show();
        }

        $scope.gotoDetail = function (item) {
            $state.go("restricted.cabinet.plan-item", {id: item.id,userId: item.userId});
        }

        $scope.myRate = function (item) {
            $state.go("restricted.cabinet.my-rate", {id: item.id,userId: item.userId});
        }

        $scope.gotoRep = function (item) {
            $state.go("restricted.cabinet.report-rate", {id: item.id,userId: item.userId});
        }
    },
]);
