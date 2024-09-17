angular.module("altairApp")
    .controller("PlanningViewCtrl", [
    "$rootScope",
    "$state",
    "$stateParams",
    "$scope",
    "$timeout",
    "$translate",
    "commonDataSource",
    "sweet",
    "dataItem",
    "mainService",
    "__env",
    function ($rootScope, $state,$stateParams, $scope, $timeout, $translate, commonDataSource, sweet,dataItem, mainService, __env) {

        $scope.user = JSON.parse(localStorage.getItem("currentUser")).user;
        localStorage.setItem("menuData", "{}");

        $scope.user1DataSource = commonDataSource.urlDataSource("/api/nms/user/list", JSON.stringify({
                filter: {
                    logic: "and",
                    filters: [{field: "useYn", operator: "eq", value: 1}]
                }, sort: [{field: "name", dir: "asc"}]
            }));
        $scope.user2DataSource = commonDataSource.urlDataSource("/api/nms/user/list", JSON.stringify({
                filter: {
                    logic: "and",
                    filters: [{field: "useYn", operator: "eq", value: 1}]
                }, sort: [{field: "name", dir: "asc"}]
            }));
        $scope.user3DataSource = commonDataSource.urlDataSource("/api/nms/user/list", JSON.stringify({
                filter: {
                    logic: "and",
                    filters: [{field: "useYn", operator: "eq", value: 1}]
                }, sort: [{field: "name", dir: "asc"}]
            }));

        $scope.app = dataItem;
        $scope.modules = {};
        $scope.dataItem = {};
        mainService.withdata("post","/api/nms/user/list",JSON.stringify({
                    filter: {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1}]},
                    sort: [{field: "id", dir: "asc"}],
                    take: 60,
                    skip: 0,
                    page: 1,
                    pageSize: 60,
                }))
            .then(function (data) {
            $scope.teamDataSource = data.data;
        });
        $scope.checkAll = function (e) {
            $scope.teamDataSource.map(function (i) {
                $scope.teams[parseInt(i.id)] = $scope.isCheckAll == "all" ? 0 : 1;
            });
            $scope.isCheckAll = $scope.isCheckAll == "all" ? "" : "all";
        };

        $scope.changeCheckbox = function () {
            $scope.isCheckAll = "";
        };

        $scope.uncheckAll = function () {
            $scope.teams = {};
        };

        //Нэмэлт мэдээлэл
        var modalForm = UIkit.modal("#modal_other", {
            modal: false,
            keyboard: false,
            bgclose: false,
            center: true,
        });
        $scope.updateOther = function (item) {
            $scope.dataItem = angular.copy(item);
            $scope.dataItem.teams=[];
            //$scope.dataItem = {useYn: 1, teams: []};
            $scope.teams = {};
            $scope.isCheckAll = false;
            modalForm.show();
        };
        $scope.formSubmit = function (type) {
            var validator = $("#validator").kendoValidator().data("kendoValidator");

            for (var modId in $scope.teams) {
                var mod = $scope.teams[modId];
                if (mod) $scope.dataItem.teams.push(modId);
            }

            if (validator.validate() && $scope.dataItem.teams.length>0) {
                var method = "post";
                $scope.dataItem.id= $scope.app.id;
                $scope.dataItem.code= $scope.app.code;
                //if ($scope.dataItem.id !== undefined && $scope.dataItem.id !== null) method = "put";
                mainService.withResponse(method, "/api/adt/registration/additional", $scope.dataItem).then(function (response) {
                    if (response.status === 200) {
                        $rootScope.alert(true, "Амжилттай хадгаллаа.");
                        modalForm.hide();
                        $scope.app = response.data;
                        $timeout(() => $rootScope.clearForm("validator"));
                        $(".k-grid").data("kendoGrid").dataSource.read();
                    } else {
                        $rootScope.alert(false, "Алдаа үүслээ!!!.");
                    }
                });
            }else{
                $rootScope.alert(false, "Дутуу талбаруудыг бөглөнө үү!!!.");
            }
        };


        $scope.filterNegtgelUnselected=  {field: 'asd', operator: 'eq', value: 'ss'};
    },
]);
