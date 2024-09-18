angular.module("altairApp").controller("944NmsCtrl", [
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
        $scope.user = JSON.parse(sessionStorage.getItem("currentUser"));
        $scope.modules = {};

        $scope.dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: __env.apiUrl() + "/api/nms/funding/step/level/list",
                    contentType: "application/json; charset=UTF-8",
                    type: "POST",
                    data: {sort: [{field: "id", dir: "desc"}]},
                    beforeSend: function (req) {
                        req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
                    },
                },
                destroy: {
                    url: __env.apiUrl() + "/api/nms/funding/step/level",
                    contentType: "application/json; charset=UTF-8",
                    type: "DELETE",
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
                        id: {editable: false, nullable: true},
                        name: {type: "string", validation: {required: true}},
                    },
                },
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
                pageSizes: ["All", 20, 50],
                refresh: true,
                buttonCount: 5,
                message: {
                    empty: "No Data",
                    allPages: "All",
                },
            },
            columns: [
                {
                    title: "№",
                    headerAttributes: {class: "columnCenter"},
                    attributes: {style: "text-align: center;"},
                    template: "#= ++record #",
                    sticky: true,
                    width: 50,
                },
                {
                    field: "typeName",
                    filterable: {cell: {operator: "contains", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Хэрэглэгчийн түвшин",
                    width: 200,
                },
                {
                    field: "sourceName",
                    filterable: {cell: {operator: "contains", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Эх үүсвэр",
                    width: 200,
                },
                {
                    field: "stepNames",
                    filterable: {cell: {operator: "contains", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Харгалзах үе шат",
                },
            ],
            dataBinding: function () {
                record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
            },
            editable: "inline",
            height: function () {
                return $(window).height() - 110;
            },
        };
        $scope.userTypes = commonDataSource.urlDataSource(
            "/api/nms/common/list",
            JSON.stringify({
                filter: {
                    logic: "and",
                    filters: [{ field: "useYn", operator: "eq", value: 1 },
                        {field: "parentId", operator: "isnull", value: false},
                        {field: "grpCd", operator: "eq", value: "userType"}],
                },
                sort: [{ field: "shortCd", dir: "asc" }],
            })
        );
        $scope.fundSteps = [];
        mainService
            .withdata("post", __env.apiUrl() + "/api/nms/source/type/list", {
                filter: {
                    filters: [
                        {field: "parentId", operator: "isnull", value: true},
                        {field: "useYn", operator: "eq", value: 1},
                    ],
                    logic: "and",
                },
                sort: [{field: "id", dir: "asc"}],
                page: 1,
                pageSize: 20,
                skip: 0,
                take: 20,
            })
            .then(function (res) {
                $scope.sources = res.data;
            });

        if (sessionStorage.getItem("buttonData").includes("read")) {
            $scope.mainGrid.toolbar = ["excel", "search"];
        }
        if (sessionStorage.getItem("buttonData").includes("create")) {
            $scope.mainGrid.toolbar = [{template: "<button class='md-btn custom-btn' ng-click='add()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>"}];
        }

        if (sessionStorage.getItem("buttonData").includes("edit")) {
            $scope.mainGrid.columns.push({
                command: [
                    {
                        template:
                            '<div class="flex gap-3"><button class="grid-btn k-grid-edit" ng-click=\'update(dataItem)\'><div class="nimis-icon edit"></div></button><button class="grid-btn k-grid-remove-command"><div class="nimis-icon delete"></div></button></div>',
                    },
                ],
                title: "&nbsp;",
                width: 80,
                sticky: true,
                attributes: {style: "text-align: center;"},
            });
        }

        $scope.update = function (item) {
            $scope.uncheckAll();
            $scope.app = item;
            var details = $scope.sources.filter((i) => i.id == item.sourceId)[0].details;
            $scope.fundSteps = details.filter((i) => i.step.stepType == 1);
            if (item.stepIds) item.stepIds.split(",").map((i) => ($scope.modules[i] = 1));

            UIkit.modal("#modal_add", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true,
            }).show();
        };

        $scope.submit = function (event) {
            UIkit.modal("#modal_loader").show();
            $scope.app.fundSteps = [];
            Object.keys($scope.modules).forEach(function (key) {
                if ($scope.modules[key] == 1) $scope.app.fundSteps.push(key);
            });
            mainService.withResponse("post", __env.apiUrl() + "/api/nms/funding/step/level/submit", $scope.app).then(function (data) {
                if (data.status === 200) {
                    $rootScope.alert(true, "Амжилттай хадгаллаа.");
                    $scope.app = {useYn: 1};
                    $scope.modules = {};
                    $scope.fundSteps = [];
                    $(".k-grid").data("kendoGrid").dataSource.read();
                } else {
                    $rootScope.alert(false, "Алдаа гарлаа.");
                }
                UIkit.modal("#modal_loader").hide();
                UIkit.modal("#modal_add").hide();
            });
        };

        $scope.selectAll = function (event) {
            var menus = $scope.allMenus.filter((item) => item.parentId == null);
            menus.map((x, i) => {
                $scope.selectAllPriv(event.target.checked, x);
                $("#" + x.id + "-" + i + "-allPriv").prop("checked", event.target.checked);
            });
        };
        $scope.changeCheckbox = function () {
            $scope.isCheckAll = "";
        };
        $scope.checkAll = function (e) {
            $scope.fundSteps.map(function (i) {
                $scope.modules[parseInt(i.step.id)] = $scope.isCheckAll == "all" ? 0 : 1;
            });
            $scope.isCheckAll = $scope.isCheckAll == "all" ? "" : "all";
        };

        $scope.uncheckAll = function () {
            $scope.isCheckAll = "";
            //   $scope.fundSteps.map((i) => ($scope.modules[i.step.id] = 0));
            $scope.modules = {};
        };
        $scope.changeLevel = function () {
            var details = $scope.sources.filter((i) => i.id == $scope.app.sourceId)[0].details;
            $scope.fundSteps = details.filter((i) => i.step.stepType == 1);
        };

        $scope.add = function () {
            $scope.app = {useYn: 1};
            $scope.privileges = {};
            $scope.modalType = "add";
            UIkit.modal("#modal_add", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true,
            }).show();
        };
    },
]);
