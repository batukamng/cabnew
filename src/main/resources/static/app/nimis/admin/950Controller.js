angular.module("altairApp")
    .controller("950NmsCtrl", [
    "$rootScope",
    "$state",
    "$scope",
    "$timeout",
    "__env",
    "mainService",
    "commonDataSource",
    "userTypes",
    "controlTypes",
    "levels",
    "roleTypes",
    function ($rootScope, $state, $scope, $timeout, __env, mainService, commonDataSource,userTypes,controlTypes,levels,roleTypes) {
        $scope.menuData = JSON.parse(localStorage.getItem("menuData"));
        $scope.userTypes=userTypes;
        $scope.controlTypes=controlTypes;
        $scope.userlevels=levels;
        $scope.roleTypes=roleTypes;

        $scope.controls = {};
        $scope.levels = {};
        $scope.roles = {};
        $scope.types = {};
        $scope.dataItem={};
        $scope.selectOptions = {
            placeholder: "Сонгох...",
            dataTextField: "comCdNm",
            dataValueField: "id",
            valuePrimitive: true,
            autoBind: true
        };

        var modalForm = UIkit.modal("#modal_form", {
            modal: false,
            keyboard: false,
            bgclose: false,
            center: true,
        });

        $scope.add=function (){
            $scope.dataItem = {useYn: 1};
            $scope.controls = {};
            $scope.levels = {};
            $scope.types = {};
            $scope.roles = {};
            $scope.isCheckAll = false;
            modalForm.show();
        }
        $scope.update = function (item) {
            $scope.dataItem = item;
            $scope.controls = {};
            $scope.levels = {};
            $scope.types = {};
            $scope.roles = {};

            $scope.isCheckAll = false;

            if (item.typeIds != null && item.typeIds.length > 0) {
                $scope.dataItem.types = item.typeIds.split(",");
                if ($scope.dataItem.types !== undefined) {
                    $scope.dataItem.types.map(function (x) {
                        $scope.types[parseInt(x)] = 1;
                    });
                }
            }
            if (item.controlIds != null && item.controlIds.length > 0) {
                $scope.dataItem.controls = item.controlIds.split(",");
                if ($scope.dataItem.controls !== undefined) {
                    $scope.dataItem.controls.map(function (x) {
                        $scope.controls[parseInt(x)] = 1;
                    });
                }
            }
            if (item.levelIds != null && item.levelIds.length > 0) {
                $scope.dataItem.levels = item.levelIds.split(",");
                if ($scope.dataItem.levels !== undefined) {
                    $scope.dataItem.levels.map(function (x) {
                        $scope.levels[parseInt(x)] = 1;
                    });
                }
            }
            if (item.roleIds != null && item.roleIds.length > 0) {
                $scope.dataItem.roleIdArr = item.roleIds.split(",");
                if ($scope.dataItem.roleIdArr !== undefined) {
                    $scope.dataItem.roleIdArr.map(function (x) {
                        $scope.roles[parseInt(x)] = 1;
                    });
                }
            }
            modalForm.show();
        };
        $scope.formSubmit = function () {
            var validator = $("#validator").kendoValidator().data("kendoValidator");
            if (validator.validate()) {
                $scope.dataItem.typesArr = [];
                $scope.dataItem.rolesArr = [];
                $scope.dataItem.controlsArr = [];
                $scope.dataItem.levelsArr = [];
                for (var priKey in $scope.roles) {
                    var priv = $scope.roles[priKey];
                    if (priv) $scope.dataItem.rolesArr.push(priKey);
                }
                for (var modId in $scope.controls) {
                    var mod = $scope.controls[modId];
                    if (mod) $scope.dataItem.controlsArr.push(modId);
                }
                for (var levKey in $scope.levels) {
                    var levId = $scope.levels[levKey];
                    if (levId) $scope.dataItem.levelsArr.push(levKey);
                }
                for (var typeKey in $scope.types) {
                    var tpId = $scope.types[typeKey];
                    if (tpId) $scope.dataItem.typesArr.push(typeKey);
                }
                var obj={
                    typeId:$scope.dataItem.typeId,
                    controlsArr:$scope.dataItem.controlsArr,
                    levelsArr:$scope.dataItem.levelsArr,
                    rolesArr:$scope.dataItem.rolesArr,
                    typesArr:$scope.dataItem.typesArr,
                    name:$scope.dataItem.name,
                    code:$scope.dataItem.code,
                    id:$scope.dataItem.id
                }
                mainService.withdata("post", "/api/nms/level/config/submit", obj).then(function (data) {
                    $rootScope.alert(true, "Амжилттай хадгаллаа.");
                    modalForm.hide();
                    $(".k-grid").data("kendoGrid").dataSource.read();
                });
            }
        };


        $scope.dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: __env.apiUrl() + "/api/nms/level/config/list",
                    contentType: "application/json; charset=UTF-8",
                    type: "POST",
                    data: {
                        filter: {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1}]},
                        sort: [{field: "id", dir: "asc"}]
                    },
                    beforeSend: function (req) {
                        req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
                    },
                },
                destroy: {
                    url: __env.apiUrl() + "/api/nms/level/config",
                    contentType: "application/json; charset=UTF-8",
                    type: "DELETE",
                    beforeSend: function (req) {
                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                    },
                    complete: function (e) {
                        $(".k-grid").data("kendoGrid").dataSource.read();
                    }
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
                    title: "#",
                    headerAttributes: {class: "columnCenter"},
                    attributes: {style: "text-align: center;"},
                    template: "#= ++record #",
                    sticky: true,
                    width: 50,
                },
                {
                    field: "name",
                    filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Тохиргооны нэр",
                },
              /*  {
                    field: "code",
                    filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Код",
                },*/
                {
                    field: "typeNames",
                    filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Удирдах багана",
                },
                {
                    field: "roleNames",
                    filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Харгалзах эрхүүд",
                },
                {
                    field: "levelNames",
                    filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Удирдах түвшин",
                },
                {
                    field: "controlNames",
                    filterable: {cell: {operator: "contains", suggestionOperator: "contains", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Удирдах бүлэг",
                }
            ],
            dataBinding: function () {
                record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
            },
            editable: "inline",
            height: function () {
                if ($scope.menuData.pageType === 0) {
                    return $(window).height() - 160;
                }
                return $(window).height() - 115;
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
                            '<div class="flex gap-3"><button class="grid-btn k-grid-edit" ng-click=\'update(dataItem)\'><div class="nimis-icon edit"></div></button><button class="grid-btn k-grid-remove-command" ng-click=\'deleteLevel(dataItem)\'><div class="nimis-icon delete"></div></button></div>',
                    },
                ],
                title: "&nbsp;",
                width: 80,
            });
        }

        $scope.checkAllRole= function (e) {
            $scope.roleTypes.map(function (i) {
                $scope.roles[parseInt(i.id)] = $scope.isCheckAllRole == "all" ? 0 : 1;
            });
            $scope.isCheckAllRole= $scope.isCheckAllRole == "all" ? "" : "all";
        };

        $scope.changeRoleCheckbox = function () {
            $scope.isCheckAllRole= "";
        };

        $scope.uncheckAllRole = function () {
            $scope.roles = {};
        };

        $scope.checkAllControl = function (e) {
            $scope.controlTypes.map(function (i) {
                $scope.controls[parseInt(i.id)] = $scope.isCheckAllControl == "all" ? 0 : 1;
            });
            $scope.isCheckAllControl = $scope.isCheckAllControl == "all" ? "" : "all";
        };

        $scope.changeControlCheckbox = function () {
            $scope.isCheckAllControl = "";
        };

        $scope.uncheckAllControl = function () {
            $scope.controls = {};
        };

        $scope.checkAllLevel = function (e) {
            $scope.userlevels.map(function (i) {
                $scope.levels[parseInt(i.id)] = $scope.isCheckAllLevel == "all" ? 0 : 1;
            });
            $scope.isCheckAllLevel = $scope.isCheckAllLevel == "all" ? "" : "all";
        };

        $scope.changeLevelCheckbox = function () {
            $scope.isCheckAllLevel = "";
        };

        $scope.uncheckAllLevel = function () {
            $scope.levels = {};
        };

        $scope.checkAllType = function (e) {
            $scope.userTypes.map(function (i) {
                $scope.types[parseInt(i.id)] = $scope.isCheckAllType == "all" ? 0 : 1;
            });
            $scope.isCheckAllType = $scope.isCheckAllType == "all" ? "" : "all";
        };

        $scope.changeTypeCheckbox = function () {
            $scope.isCheckAllType = "";
        };

        $scope.uncheckAllType = function () {
            $scope.types = {};
        };

    },
]);
