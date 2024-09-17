angular.module("altairApp").controller("946NmsCtrl", [
    "$rootScope",
    "$state",
    "$scope",
    "$timeout",
    "mainService",
    "commonDataSource",
    "__env",
    "roles",
    "item",
    "userTypes",
    "userRequiredType",
    "levelList",
    function ($rootScope, $state, $scope, $timeout, mainService, commonDataSource,  __env, roles, item,userTypes,userRequiredType,levelList) {

        $scope.arr = {useYn: 1};
        $scope.otherStatus=userTypes;
        $scope.requiredList=userRequiredType;
        $scope.levelList=levelList;
        $scope.typeDataSource = commonDataSource.urlDataSource("/api/nms/resource/levelConfig/list",
            JSON.stringify({ filter: { logic: "and", filters: [{ field: "useYn", operator: "eq", value: 1 }] }, sort: [{ field: "id", dir: "asc" }] })
        );

        $scope.configChange=function (){
            console.log($scope.dataItem);
        }

        $scope.privileges = {};
        $scope.roles = roles.data;
        $scope.allPriv = "all";
        $scope.roleObj = {};
        $scope.lvlObj = {};
        $scope.reqObj = {};
        $scope.roleStatus = [];
        $scope.lvlStatus = [];


        mainService
            .withdata(
                "post",
                "/api/nms/user/level/list",
                JSON.stringify({
                    filter: {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1}]},
                    sort: [{field: "name", dir: "asc"}],
                    take: 60,
                    skip: 0,
                    page: 1,
                    pageSize: 60,
                })
            )
            .then(function (data) {
                $scope.levelDataSource = data.data;
            });

        /*$scope.changeStat = function (type) {
            var filters = [];
            filters.push({
                field: "grpCd",
                operator: "eq",
                value: "userType",
            });
            filters.push({
                field: "parentId",
                operator: "isNull",
                value: false,
            });
            if (type == "mof") {
                filters.push({
                    logic: "or",
                    filters: [
                        {field: "comCd", operator: "eq", value: type},
                        {
                            field: "comCd",
                            operator: "eq",
                            value: "treasury",
                        },
                    ],
                });
            } else if (type == "all") {
                filters.push({
                    field: "comCd",
                    operator: "neq",
                    value: "sysAdmin",
                });
                filters.push({
                    field: "comCd",
                    operator: "neq",
                    value: "orgAdmin",
                });
                filters.push({
                    field: "comCd",
                    operator: "neq",
                    value: "supervisorAdmin",
                });
                filters.push({
                    field: "comCd",
                    operator: "neq",
                    value: "provinceAdmin",
                });
                filters.push({
                    field: "comCd",
                    operator: "neq",
                    value: "mof",
                });
                filters.push({
                    field: "comCd",
                    operator: "neq",
                    value: "executor",
                });
            }

            mainService
                .withdata("post", __env.apiUrl() + "/api/nms/common/list", {
                    filter: {
                        logic: "and",
                        filters: filters,
                    },
                    sort: [{field: "comCdNm", dir: "asc"}],
                    page: 1,
                    pageSize: 20,
                    skip: 0,
                    take: 20,
                })
                .then(function (resp) {
                    console.log(resp);
                    if (resp.total > 0) {
                        $scope.lvlStatus = resp.data;
                        if (type != "all" && type != "mof") {
                            $scope.roleStatus = resp.data.filter((i) => i.comCd == type);
                        } else if (type == "mof") {
                            console.log("mof", resp.data);
                            $scope.roleStatus = resp.data.filter((i) => i.comCd == type || i.comCd == "treasury");
                            console.log($scope.roleStatus);
                        } else {
                            $scope.roleStatus = resp.data;
                        }
                    }
                });
        };
        $scope.changeOtherStat = function (type) {
            var filters = [];
            filters.push({
                field: "grpCd",
                operator: "eq",
                value: "userType",
            });
            filters.push({
                field: "parentId",
                operator: "isNull",
                value: false,
            });
            if (type == "executor") {
                filters.push({
                    field: "comCd",
                    operator: "eq",
                    value: "executor",
                });
            } else {
                filters.push({
                    field: "comCd",
                    operator: "neq",
                    value: "sysAdmin",
                });
                // filters.push({
                //   field: "comCd",
                //   operator: "neq",
                //   value: "orgAdmin",
                // });
                // filters.push({
                //   field: "comCd",
                //   operator: "neq",
                //   value: "supervisorAdmin",
                // });
                // filters.push({
                //   field: "comCd",
                //   operator: "neq",
                //   value: "provinceAdmin",
                // });
                filters.push({
                    field: "comCd",
                    operator: "neq",
                    value: "mof",
                });
                filters.push({
                    field: "comCd",
                    operator: "neq",
                    value: "executor",
                });
            }

            mainService
                .withdata("post", __env.apiUrl() + "/api/nms/common/list", {
                    filter: {
                        logic: "and",
                        filters: filters,
                    },
                    sort: [{field: "comCdNm", dir: "asc"}],
                    page: 1,
                    pageSize: 20,
                    skip: 0,
                    take: 20,
                })
                .then(function (resp) {
                    console.log("otherStatus", resp);
                    if (resp.total > 0) $scope.otherStatus = resp.data;
                });
        };*/

        if (item != null) {
            item.levelRequires.map((i) => {
                $scope.reqObj[i.posId] = {};
                i.requires.map((j) => {
                    $scope.reqObj[i.posId][j.id] = true;
                });
            });
            item.levelTypes.map((i) => {
                $scope.roleObj[i.posId] = {};
                i.roles.map((j) => {
                    $scope.roleObj[i.posId][j.id] = true;
                });
            });
            item.levelSubs.map((i) => {
                $scope.lvlObj[i.posId] = {};
                i.levels.map((j) => {
                    $scope.lvlObj[i.posId][j.id] = true;
                });
            });
            item["rolesArr"] = [];
            item["levelsArr"] = [];
            item["reqArr"] = [];
            item["levelRequires"] = null;
            item["levelTypes"] = null;
            item["levelSubs"] = null;
            $scope.dataItem = item;
        } else {
            $scope.dataItem = {useYn: 1, rolesArr: [], levelsArr: [], reqArr: []};
        }

        $scope.statusChange = function () {
            $scope.arr.useYn = $scope.arr.useYn == 1 ? 0 : 1;
        };

        $scope.formSubmit = function () {
            var validator = $("#userForm").kendoValidator().data("kendoValidator");

            if (validator.validate()) {
                console.log($scope.roleObj);

                // roles
                Object.keys($scope.roleObj).map((roleKey) => {
                    var role = $scope.roleObj[roleKey];
                    var stats = [];
                    if (role) {
                        var obj = {};
                        obj["posId"] = roleKey;
                        Object.keys(role).map((r) => {
                            if (role[r]) {
                                console.log("role", role[r]);
                                stats.push(r);
                            }
                        });
                        obj["roleId"] = stats;
                        $scope.dataItem.rolesArr.push(obj);
                    }
                });
                // levels

                Object.keys($scope.lvlObj).map((lvlKey) => {
                    var level = $scope.lvlObj[lvlKey];
                    var stats = [];
                    if (level) {
                        var obj = {};
                        obj["posId"] = lvlKey;
                        Object.keys(level).map((l) => {
                            if (level[l]) {
                                stats.push(l);
                            }
                        });
                        obj["lvlId"] = stats;
                        $scope.dataItem.levelsArr.push(obj);
                    }
                });
                // requiredList
                console.log($scope.reqObj);
                Object.keys($scope.reqObj).map((reqKey) => {
                    var req = $scope.reqObj[reqKey];
                    var stats = [];
                    if (req) {
                        var obj = {};
                        obj["posId"] = reqKey;
                        Object.keys(req).map((l) => {
                            if (req[l]) {
                                stats.push(l);
                            }
                        });
                        obj["reqId"] = stats;
                        if (stats.length > 0) $scope.dataItem.reqArr.push(obj);
                    }
                });
                console.log("reqArr", $scope.dataItem.reqArr);
               // $scope.dataItem.level=null;
                mainService.withResponse("post", "/api/nms/user/level/submit", $scope.dataItem).then(function (data) {
                    console.log(data, data.status, data.status == 200);
                    if (data.status === 200) {
                        $state.go("restricted.nms.939");
                        $rootScope.alert(true, "Амжилттай хадгаллаа.");
                    } else {
                        $rootScope.alert(false, "Алдаа гарлаа.");
                    }
                });
            }
        };

        $scope.deleteLevel = function (item) {
            mainService.withdata("post", __env.apiUrl() + "/api/nms/user/level/setInactive", item).then(function (data) {
                $rootScope.alert(true, "Устгах үйлдэл амжилттай боллоо.");
                $(".k-grid").data("kendoGrid").dataSource.read();
            });
        };
    },
]);
