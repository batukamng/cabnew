angular.module("altairApp")
    .controller("951NmsCtrl", [
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
            $scope.menuData = JSON.parse(sessionStorage.getItem("menuData"));

            $scope.dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: __env.apiUrl() + "/api/nms/activity-log/list",
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
                        data: {
                            sort: [{field: "id", dir: "desc"}],
                        },
                        beforeSend: function (req) {
                            req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
                        },
                    },
                    destroy: {
                        url: __env.apiUrl() + "/api/nms/activity-log",
                        contentType: "application/json; charset=UTF-8",
                        beforeSend: function (req) {
                            req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
                        },
                        complete: function (e) {
                            $(".k-grid").data("kendoGrid").dataSource.read();
                        },
                        type: "DELETE",
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
                        field: "eventNm",
                        filterable: {
                            cell: {
                                operator: "contains",
                                suggestionOperator: "contains",
                                showOperators: false
                            }
                        },
                        title: "Төрөл",
                    },
                    {
                        field: "descText",
                        filterable: {
                            cell: {
                                operator: "contains",
                                suggestionOperator: "contains",
                                showOperators: false
                            }
                        },
                        title: "Үйлдэл",
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
                        title: "Хэрэглэгч",
                        headerAttributes: { "class": "checkbox-align"},
                        attributes: {style: "text-align: left;"},
                        width:150
                    },
                    {
                        field: "createdAt",
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
                        width:150
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
                    return $(window).height() - 115;
                }
            };

            $timeout(function (){
                $scope.dataSource.filter({
                    logic: "and",
                    sort: [{field: "id", dir: "asc"}],
                    filters: [{field: "useYn", operator: "eq", value: 1}],
                });
            },100)

            if (sessionStorage.getItem("buttonData").includes("read")) {
                $scope.mainGrid.toolbar = ["excel", "search"];
            }
         /*   if (sessionStorage.getItem("buttonData").includes("create")) {
                $scope.mainGrid.toolbar = [{template: "<button class='md-btn custom-btn' ng-click='add()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>"}];
            }*/
          /*  if (sessionStorage.getItem("buttonData").includes("update") || sessionStorage.getItem("buttonData").includes("edit")) {
                $scope.mainGrid.columns.push({
                    command: [
                        {
                            template:
                                '<div class="flex justify-center gap-3"><button class="grid-btn k-grid-edit" ng-click=\'update(dataItem)\'><div class="nimis-icon see "></div></button><button class="grid-btn k-grid-remove-command" ng-click=\'deleteLevel(dataItem)\'><div class="nimis-icon delete"></div></button></div>',
                        },
                    ],
                    title: "&nbsp;",
                    width: 80,
                });
            }*/

            var modalForm = UIkit.modal("#modal_form", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true
            });

            $scope.add = function () {
                $scope.dataItem = {useYn: 1,orgId:$scope.user.orgId,userId:$scope.user.id, status: "draft"};
                $timeout(() => $rootScope.clearForm("userForm"));
                modalForm.show();
            }
            $scope.update = function (item) {
                $scope.dataItem = item;
                $state.go("restricted.cabinet.plan-org-edit", {id: item.id});
                // modalForm.show();
            }
            var loader = UIkit.modal("#modal_loader", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true,
            });
            $scope.formSubmit = function () {
                var validator = $("#validator").kendoValidator().data("kendoValidator");
                if (validator.validate()) {
                    modalForm.hide();
                    loader.show();
                    var method = "post";
                    if ($scope.dataItem.id !== undefined && $scope.dataItem.id !== null) method = "put";
                    mainService.withResponse("post", "/api/cab/plan/submit", $scope.dataItem).then(function (response) {

                        if(response.status===200){
                            loader.hide();
                            $timeout(function (){
                                $rootScope.alert(true, "Амжилттай хадгаллаа.");
                                $state.go("restricted.cabinet.plan-org-edit", {id: response.data.id});
                            },500)
                        }
                        else{
                            loader.hide();
                            $rootScope.alert(false,"Төлөвлөгөө үүссэн байна!!!");
                        }
                    });
                }
            };


            $scope.progress = function (dataItem) {
                $scope.contractView = dataItem;
                $scope.currentStep = 1;
                mainService.withdata("get", __env.apiUrl() + "/api/nms/activity-log/plan/" + dataItem.id).then(function (data) {
                    $scope.steps = data;
                    if ($scope.steps.length > 0) {
                        $scope.currentStep = $scope.steps[$scope.steps.length - 1].step;
                    }
                    UIkit.modal("#modal_progress", {
                        modal: false,
                        keyboard: false,
                        bgclose: false,
                        center: true,
                    }).show();
                });
            };
        },
    ]);
