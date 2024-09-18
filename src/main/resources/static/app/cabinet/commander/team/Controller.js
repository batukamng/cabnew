angular.module("altairApp")
    .controller("teamUserCtrl", [
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


        mainService.withdomain("get", "/api/nms/user/org/" + $scope.user.orgId).then(function (data) {
            $scope.workers = data;
        });

        $scope.dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: __env.apiUrl() + "/api/admin/v1/cab-team/list",
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
                    title: "Багийн нэр",
                },
                {
                    field: "userNames",
                    filterable: {
                        cell: {
                            operator: "contains",
                            suggestionOperator: "contains",
                            showOperators: false
                        }
                    },
                    title: "ТЖАХ-ийн нэрс",
                    attributes: {style: "text-align: left;"},
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
                            '<div class="flex justify-center gap-3"><button class="grid-btn k-grid-edit" ng-click=\'update(dataItem)\'><div class="nimis-icon edit "></div></button><button class="grid-btn k-grid-remove-command" ng-click=\'deleteLevel(dataItem)\'><div class="nimis-icon delete"></div></button></div>',
                    },
                ],
                title: "&nbsp;",
                width: 80,
            });
        }

        var modalForm = UIkit.modal("#modal_form", {
            modal: false,
            keyboard: false,
            bgclose: false,
            center: true
        });

        $scope.bagObj={};
        $scope.selectAll = function (e) {
            $scope.workers.map(function (i) {
                $scope.bagObj[parseInt(i.id)] = $scope.isCheckAllCategory == "all" ? false : true;
            });
            $scope.isCheckAllCategory = $scope.isCheckAllCategory == "all" ? "" : "all";
        };

        $scope.add = function () {
            $scope.dataItem = {useYn: 1,orgId:$scope.user.orgId,typeStr:'01', status: "draft"};
            $timeout(() => $rootScope.clearForm("userForm"));
            modalForm.show();
        }

        $scope.update = function (item) {
            $scope.dataItem = angular.copy(item);
            $scope.bagObj = {};
            if (item.userIds != null && item.userIds.split(",").length > 0) {
                for (var i = 0; i < item.userIds.split(",").length; i++) {
                    $scope.bagObj[item.userIds.split(",")[i]] = true;
                }
            }
            $timeout(function (){
                modalForm.show();
            },200)
        }

        $scope.formSubmit = function () {
            var validator = $("#validator").kendoValidator().data("kendoValidator");
            if (validator.validate()) {

                $scope.dataItem.userArr = [];
                for (var ezObj in $scope.bagObj) {
                    var ez = $scope.bagObj[ezObj];
                    if (ez) $scope.dataItem.userArr.push(ezObj);
                }
                if($scope.dataItem.userArr.length>0){
                    modalForm.hide();
                    var method = "post";
                    if ($scope.dataItem.id !== undefined && $scope.dataItem.id !== null) method = "put";
                    mainService.withResponse("post", "/api/cab/team/submit", $scope.dataItem).then(function (response) {
                        if(response.status===200){
                            $(".k-grid").data("kendoGrid").dataSource.read();
                            $timeout(() => $rootScope.clearForm("userForm"));
                        }
                        else{
                            $rootScope.alert(false,"Амжилтгүй!!!");
                        }
                    });
                }
                else{
                    $rootScope.alert(false,"Албан хаагч сонгоно уу!!!");
                }
            }
        };

    },
]);
