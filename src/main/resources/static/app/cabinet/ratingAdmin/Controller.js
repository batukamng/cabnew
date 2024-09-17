angular.module("altairApp")
    .controller("ratingAdminCtrl", [
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
            $scope.user = JSON.parse(localStorage.getItem("currentUser")).user;
            $scope.planYr = JSON.parse(localStorage.getItem("planYr"));
            $("#header_main").attr("style", "filter: none !important;padding: 8px 25px");
            $scope.menuData = JSON.parse(localStorage.getItem("menuData"));
            $scope.formatDate = function (date) {
                return new Date(date);
            };

            $scope.appDataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: function (e) {
                            return __env.apiUrl() + "/api/cab/plan/config/list";
                        },
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
                            pipAmt: {type: "number", editable: false},
                            amount: {type: "number", editable: false},
                            totalAmt: {type: "number", editable: false},
                        },
                    },
                },
                pageSize: 10,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
            });
            $scope.mainGrid = {
                sortable: true,
                resizable: true,
                persistSelection: true,
                pageable: {
                    pageSizes: [10, 20, 50, 100],
                    refresh: true,
                    pageSize: 20,
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
                        headerAttributes: {class: "checkbox-align"},
                        attributes: {style: "text-align: center;"},
                        template: "#= ++record #",
                        width: 50,
                    },
                    {
                        field: "planYr",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        title: "Тайлант он",
                        headerAttributes: {style: "text-align: left;white-space: normal; vertical-align: middle; "},
                        width: 150,
                        attributes: {style: "text-align: left;"},
                    },
                    {
                        field: "objPer",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        title: "Гүйцэтгэлийн зорилт арга хэмжээ",
                        headerAttributes: {style: "text-align: left;white-space: normal; vertical-align: middle; "},
                        attributes: {style: "text-align: left;"},
                    },
                    {
                        field: "skillPer",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        title: "Мэдлэг ур чадвар",
                        headerAttributes: {style: "text-align: left;white-space: normal; vertical-align: middle; "},
                        attributes: {style: "text-align: left;"},
                    },
                    {
                        field: "attitudePer",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        title: "Хандлага ёс зүй, ур чадвар",
                        headerAttributes: {style: "text-align: left;white-space: normal; vertical-align: middle; "},
                        attributes: {style: "text-align: left;"},
                    },
                ],
                dataBinding: function () {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                },
                editable: "inline",
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
                $scope.dataItem = {useYn: 1,planYr:$scope.planYr};
                $timeout(() => $rootScope.clearForm("userForm"));
                modalForm.show();
            }

            $scope.formSubmit = function () {
                var validator = $("#validator").kendoValidator().data("kendoValidator");
                if (validator.validate()) {
                    var method = "post";
                    if((parseFloat($scope.dataItem.objPer)+parseFloat($scope.dataItem.attitudePer)+parseFloat($scope.dataItem.skillPer))===100){
                        if ($scope.dataItem.id !== undefined && $scope.dataItem.id !== null) method = "put";
                        mainService.withResponse("post", "/api/cab/plan/config/submit", $scope.dataItem).then(function (response) {
                            if(response.status===200){
                                modalForm.hide();
                                $(".k-grid").data("kendoGrid").dataSource.read();
                                $timeout(() => $rootScope.clearForm("userForm"));
                            }
                            else{
                                $rootScope.alert(false,"Амжилтгүй. Энэ онд тохируулга хийсэн байна");
                            }
                        });
                    }
                    else{
                        $rootScope.alert(false,"Амжилтгүй. Үнэлгээний нийлбэр 100н оноо байх хэрэгтэй");
                    }
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
                            mainService.withdomain("delete", __env.apiUrl() + "/api/cab/plan/config/" + item.id).then(function (data) {
                                $rootScope.alert(true, "Амжилттай.");
                                $(".k-grid").data("kendoGrid").dataSource.read();
                            });
                        }
                    }
                );
            };
        },
    ]);
