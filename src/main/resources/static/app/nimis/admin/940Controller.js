angular.module("altairApp").controller("940NmsCtrl", [
  "$rootScope",
  "$state",
  "$scope",
  "$timeout",
  "mainService",
  "commonDataSource",
  "Upload",
  "$http",
  "__env",
  "menus",
  "item",
  function ($rootScope, $state, $scope, $timeout, mainService, commonDataSource, Upload, $http, __env, menus, item) {
    $scope.arr = { useYn: 1 };
    $scope.privileges = {};
    $scope.allPriv = "all";
    if (item != null) {
      $scope.arr = item;
      item.rolePrivileges.map(function (x) {
        if (!$scope.privileges[x.menuId]) $scope.privileges[x.menuId] = {};
        $scope.privileges[x.menuId][x.privilegeId] = 1;
      });
    }
    $scope.status = 1;
    $scope.allMenus = menus;
    $scope.statusChange = function () {
      $scope.arr.useYn = $scope.arr.useYn == 1 ? 0 : 1;
    };

    $scope.translateMon = function (engName) {
      switch (engName) {
        case "READ":
          return "ХАРАХ";
          break;
        case "UPDATE":
          return "ЗАСАХ";
          break;
        case "DELETE":
          return "УСТГАХ";
          break;
        case "CREATE":
          return "НЭМЭХ";
          break;
        default:
          return engName;
          break;
      }
    };
    $scope.submitProject = function (event) {
      // if ($scope.validatorProject.validate()) {
      UIkit.modal("#modal_loader").show();
      $scope.arr.rolePrivileges = [];
      for (var menuKey in $scope.privileges) {
        var menu = $scope.privileges[menuKey];
        for (var priKey in menu) {
          var priName = menu[priKey];
          if (priName) $scope.arr.rolePrivileges.push({ menuId: menuKey, privilegeId: priKey });
        }
      }
      mainService.withResponse("post", __env.apiUrl() + "/api/nms/role/submit", $scope.arr).then(function (data) {
        UIkit.modal("#modal_loader").hide();
        if (data.status === 200) {
          $rootScope.alert(true, "Амжилттай хадгаллаа.");
          $timeout(function () {
            $state.go("restricted.nms.937");
          }, 300);
        } else {
          $rootScope.alert(false, "Алдаа гарлаа.");
        }
        $state.go("restricted.scr.1035");
      });
      /*      } else {
        $rootScope.alert(false, "Бүрэн бөглөнө үү.");
      }*/
    };
    $scope.handleCheckAll = function (checked, priId, childMenus) {
      console.log(priId);
      if (childMenus) {
        childMenus.map((x) => {
          if (
            x.privileges.filter(function (i) {
              return i.id === priId;
            }).length > 0
          ) {
            if (!$scope.privileges[x.id]) $scope.privileges[x.id] = {};
            $scope.privileges[x.id][priId] = checked ? 1 : 0;
          }
        });
      }
    };
    $scope.handleCheck = function (checked, subId, priId) {
      console.log(checked, $scope.privileges[subId]);
      if ($scope.privileges[subId]) {
        if (checked == 1) $scope.privileges[subId][priId] = checked;
      } else {
        var obj = {};
        obj[priId] = checked ? 1 : 0;
        $scope.privileges[subId] = obj;
      }
    };
    $scope.backToList = function () {
      $state.go("restricted.nms.937");
    };
    $scope.selectAllPriv = function (checked, item) {
      if (checked) {
        if (!$scope.privileges[item.id]) $scope.privileges[item.id] = {};
        item.privileges.map((x) => {
          $scope.privileges[item.id][x.id] = 1;
          $scope.handleCheckAll(1, x.id, item.lutMenus);
        });
      } else {
        item.privileges.map((x) => {
          $scope.privileges[item.id][x.id] = 0;
          $scope.handleCheckAll(0, x.id, item.lutMenus);
        });
      }
    };
    $scope.selectAll = function (event) {
      var menus = $scope.allMenus.filter((item) => item.parentId == null);
      menus.map((x, i) => {
        $scope.selectAllPriv(event.target.checked, x);
        $("#" + x.id + "-" + i + "-allPriv").prop("checked", event.target.checked);
      });
    };
  },
]);
