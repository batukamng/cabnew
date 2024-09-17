angular.module("altairApp")
    .controller("interviewUserCtrl", [
        "$rootScope",
        "$state",
        "$scope",
        "$timeout",
        "mainService",
        "commonDataSource",
        "sweet",
        "$http",
        "__env",
        function ($rootScope, $state, $scope, $timeout, mainService, commonDataSource, sweet, $http, __env) {
            $scope.user = JSON.parse(localStorage.getItem("currentUser")).user;
            $scope.menuData = JSON.parse(localStorage.getItem("menuData"));

            $scope.dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: __env.apiUrl() + "/api/admin/v1/cab-plan-boss-meeting/list",
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
                    {
                        field: "fullDesc",
                        filterable: {
                            cell: {
                                operator: "contains",
                                suggestionOperator: "contains",
                                showOperators: false
                            }
                        },
                        title: "Төлөвлөгөө",
                        headerAttributes: {"class": "checkbox-align"},
                        attributes: {style: "text-align: left;"}
                    },
                    {
                        field: "userNm",
                        filterable: {
                            cell: {
                                operator: "contains",
                                suggestionOperator: "contains",
                                showOperators: false
                            }
                        },
                        width: 150,
                        headerAttributes: {"class": "checkbox-align"},
                        attributes: {style: "text-align: center;"},
                        template: "<div class='flex' style='justify-content: space-between;'><span ng-bind='dataItem.userNm'></span> </div>",
                        title: "Албан хаагч",
                    },

                    {
                        title: "Ярилцлага",
                        headerAttributes: {"class": "checkbox-align"},
                        attributes: {style: "text-align: left;"},
                        columns: [
                            {
                                field: "ttlCnt",
                                filterable: {
                                    cell: {
                                        operator: "eq",
                                        suggestionOperator: "contains",
                                        showOperators: false
                                    }
                                },
                                title: "Илгээсэн",
                                headerAttributes: {"class": "checkbox-align"},
                                attributes: {style: "text-align: center;"},
                                width: 150
                            },
                            {
                                field: "repCnt",
                                filterable: {
                                    cell: {
                                        operator: "eq",
                                        suggestionOperator: "contains",
                                        showOperators: false
                                    }
                                },
                                title: "Хянаагүй",
                                headerAttributes: {"class": "checkbox-align"},
                                attributes: {style: "text-align: center;"},
                                width: 150
                            },
                            {
                                field: "aprCnt",
                                filterable: {
                                    cell: {
                                        operator: "eq",
                                        suggestionOperator: "contains",
                                        showOperators: false
                                    }
                                },
                                title: "Баталсан",
                                headerAttributes: {"class": "checkbox-align"},
                                attributes: {style: "text-align: center;"},
                                width: 150
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

            /* if (localStorage.getItem("buttonData").includes("read")) {
               $scope.mainGrid.toolbar = ["excel", "search"];
           }
         if (localStorage.getItem("buttonData").includes("create")) {
               $scope.mainGrid.toolbar = [{template: "<button class='md-btn custom-btn' ng-click='add()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>"}];
           }*/
            if (localStorage.getItem("buttonData").includes("update") || localStorage.getItem("buttonData").includes("edit")) {
                $scope.mainGrid.columns.push({
                    command: [
                        {
                            template:
                                '<div class="flex justify-center gap-2">' +
                                '<button class="grid-btn" ng-click=\'gotoDetail(dataItem)\'><div class="nimis-icon see "></div>Харах</button>' +
                                '</div>',
                        },
                    ],
                    title: "&nbsp;",
                    headerAttributes: {class: "rightMinus"},
                    attributes: {class: "rightMinus uk-text-center"},
                    sticky: true,
                    width: 90,
                });
            }

            var modalForm = UIkit.modal("#modal_form", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true
            });

            $scope.add = function () {
                $scope.dataItem = {useYn: 1,  progress:0,  typeStr:'01'};
                $timeout(() => $rootScope.clearForm("userForm"));
                modalForm.show();
            }

            $scope.formSubmit = function () {
                var validator = $("#validator").kendoValidator().data("kendoValidator");
                if (validator.validate()) {
                    modalForm.hide();
                    var method = "post";
                    $scope.dataItem.userId=$scope.dataItem.planObj.userId;
                    if ($scope.dataItem.id !== undefined && $scope.dataItem.id !== null) method = "put";
                    mainService.withResponse(method, "/api/cab/plan/meeting", $scope.dataItem).then(function (response) {
                        if (response.status === 200) {
                            $(".k-grid").data("kendoGrid").dataSource.read();
                            $timeout(() => $rootScope.clearForm("userForm"));
                        } else {
                            $rootScope.alert(false, "Амжилтгүй!!!");
                        }
                    });
                }
            };

            var modalView = UIkit.modal("#modal_view", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true
            });
            $scope.gotoDetail = function (item) {
                $scope.dataItem=item;
                mainService.withdomain("get", __env.apiUrl() + "/api/admin/v1/multiple/cab-plan-meeting/" + item.id+"/"+item.userId).then(function (data) {
                    modalView.show();
                    $scope.meetings=data;
                });
            }
            $scope.update = function (item) {
                $scope.dataItem=item;
            };
            $scope.approveItem = function (item) {
                sweet.show(
                    {
                        title: "Батлах",
                        text: "Та энэ үйлдлийг хийхдээ итгэлтэй байна уу?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Тийм",
                        cancelButtonText: "Үгүй",
                        closeOnConfirm: true,
                        closeOnCancel: true,
                    },
                    function (inputvalue) {
                        if (inputvalue) {
                            var obj={
                                id:item.id,
                                description:"Ярилцлага баталсан",
                                status:"approved",
                                name:"Ярилцлага",
                            }
                            mainService.withResponse("post", "/api/cab/plan/meeting/change-status", obj).then(function (response) {
                                if (response.status === 200) {
                                    item.statusNm='Баталсан';
                                    $(".k-grid").data("kendoGrid").dataSource.read();
                                } else {
                                    $rootScope.alert(false, "Амжилтгүй!!!");
                                }
                            });
                        }
                    }
                );
            };
        },
    ]);
