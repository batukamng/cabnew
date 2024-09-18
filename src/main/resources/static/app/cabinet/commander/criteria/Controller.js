angular.module("altairApp")
    .controller("criteriaCtrl", [
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
        $scope.user = JSON.parse(sessionStorage.getItem("currentUser")).user;
        $scope.menuData = JSON.parse(sessionStorage.getItem("menuData"));


        $scope.dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: __env.apiUrl() + "/api/admin/v1/cab-criteria/list",
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
                    field: "title",
                    filterable: {
                        cell: {
                            operator: "contains",
                            suggestionOperator: "contains",
                            showOperators: false
                        }
                    },
                    title: "Шалгуур үзүүлэлт",
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
                    width:140
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
        if (sessionStorage.getItem("buttonData").includes("create")) {
            $scope.mainGrid.toolbar = [{template: "<button class='md-btn custom-btn' ng-click='add()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>"}];
        }

        if (sessionStorage.getItem("buttonData").includes("update") || sessionStorage.getItem("buttonData").includes("edit")) {
            $scope.mainGrid.columns.push({
                command: [
                    {
                        template:
                            '<div class="flex justify-center gap-2">' +
                            '<button class="grid-btn" ng-click=\'update(dataItem)\'><div class="nimis-icon edit "></div></button>' +
                            '<button class="grid-btn" ng-click=\'delete(dataItem)\'><div class="nimis-icon delete "></div></button>' +
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
            $scope.dataItem = {useYn: 1,orgId:$scope.user.orgId,typeStr:'01',typeScr:'02', status: "draft"};
            $timeout(() => $rootScope.clearForm("userForm"));
            modalForm.show();
        }

        $scope.formSubmit = function () {
            var validator = $("#validator").kendoValidator().data("kendoValidator");
            if (validator.validate()) {
                modalForm.hide();
                var method = "post";
                if ($scope.dataItem.id !== undefined && $scope.dataItem.id !== null) method = "put";
                mainService.withResponse(method, "/api/cab/criteria", $scope.dataItem).then(function (response) {
                    if(response.status===200){
                        $(".k-grid").data("kendoGrid").dataSource.read();
                        $timeout(() => $rootScope.clearForm("userForm"));
                    }
                    else{
                        $rootScope.alert(false,"Амжилтгүй. Шалгуур үзүүлэлт бүртгэсэн байна");
                    }
                });
            }
        };

        $scope.update = function (item) {
            $scope.dataItem=item;
            modalForm.show();
        };
        $scope.delete = function (item) {
            sweet.show(
                {
                    title: "Устгах",
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
                        mainService.withdomain("delete", __env.apiUrl() + "/api/cab/criteria/" + item.id).then(function (data) {
                            $rootScope.alert(true, "Амжилттай.");
                            $(".k-grid").data("kendoGrid").dataSource.read();
                        });
                    }
                }
            );
        };
    },
]);
