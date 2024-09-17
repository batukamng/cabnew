angular.module("altairApp").controller("921NmsCtrl", [
  "$rootScope",
  "$state",
  "$stateParams",
  "$scope",
  "$timeout",
  "mainService",
  "commonDataSource",
  "Upload",
  "$http",
  "__env",
  "userItem",
  "levels",
  "userTypes",
  "fromData",
  "tezList",
  "amgList",
  "orgList",
  "allRightTezList",
  "allRightAmgList",
  function ($rootScope, $state, $stateParams, $scope, $timeout, mainService, commonDataSource, Upload, $http, __env,
            userItem, levels, userTypes, fromData, tezList, amgList, orgList, allRightTezList, allRightAmgList) {
    $scope.user = JSON.parse(localStorage.getItem("currentUser")).user;
    $scope.levels = levels;
    $scope.userTypes = userTypes.data;
    $scope.isNewUser = $stateParams.id == 0;

    $scope.userItem = userItem;
    $scope.userItem.rolesArr = [];
    $scope.userItem.amgArr = [];
    $scope.userItem.tezArr = [];
    $scope.userItem.ecoArr = [];
    $scope.userItem.sectorArr = [];
    $scope.userItem.parDistArr = [];
    $scope.showTez = false;
    $scope.showAmg = false;
    $scope.showSum = false;
    $scope.showOrg = false;

    let nonInitOrg = false;// first time called

    $scope.roles = {};

    if (userItem.roles)
      $scope.userItem.rolesArr = userItem.roles.map((x) => {
        return x.id;
      });
    if ($scope.userItem.ecoList) {
      $scope.userItem.ecoArr = $scope.userItem.ecoList.map((x) => {
        return x.id;
      });
    }
    if ($scope.userItem.governors)
      $scope.userItem.tezArr = $scope.userItem.governors.map((x) => {
        return x.id;
      });
    if ($scope.userItem.provinces)
      $scope.userItem.amgArr = $scope.userItem.provinces.map((x) => {
        return x.id;
      });
    if ($scope.user.tezId != null) {
      tezList = tezList.filter(tez => tez.id == $scope.user.tezId);
    }

    $scope.levelTypeSelect = function (selected) {
      console.debug("level type changed");
      console.debug(selected);
      let dataItem = selected.dataItem;
      UIkit.modal("#modal_loader").show();
      mainService.withdata("GET", __env.apiUrl() + "/api/nms/user/level/pos/" + dataItem.id).then(function (res) {
        UIkit.modal("#modal_loader").hide();
        $timeout(() => {
          $scope.userTypes = res;
          console.debug($scope.userItem.level);
        });

        if ($scope.userItem.userType) {
          $scope.userTypeSelect({dataItem: $scope.userItem.userType});
        }
      });
    };

    $scope.userTypeSelect = function (selected) {
      console.debug("user type changed");
      console.debug(selected);
      let dataItem = selected.dataItem;
      mainService.withdata("GET", __env.apiUrl() + "/api/nms/user/level/related/" + $scope.userItem.lvlId + "/" + dataItem.id).then(function (res) {
        $timeout(() => {
          $scope.userItem.typeId = dataItem.id;

          $scope.roleDataSource = res.roles;
          if ($scope.userItem.roles != null) {
            $scope.roles = {};
            $scope.userItem.roles.map(function (x) {
              if ($scope.roleDataSource.filter(role => role.id === x.id).length > 0) {
                $scope.roles[x.id] = true;
              }
            });
          }

          $scope.showTez = false;
          $scope.showAmg = false;
          $scope.showSum = false;
          $scope.showOrg = false;
          res.requires.map((i) => {
            if (i.comCd === "reqTez") {
              $scope.showTez = true;
            }
            if (i.comCd === "reqProvince") {
              $scope.showAmg = true;
            }
            if (i.comCd === "reqOrg") {
              $scope.showOrg = true;
            }
            if (i.comCd === "reqDistrict") {
              $scope.showSum = true;
            }
          });
          if ($scope.showTez) {
            if (["provinceAdmin", "province", "local_agency", "district"].includes(dataItem.comCd)) {
              $scope.tezDataSource = tezList.filter(tez => tez.tezType === "02");
            } else if (["ministry", "agency", "orgAdmin"].includes(dataItem.comCd)) {
              $scope.tezDataSource = tezList.filter(tez => tez.tezType === "01");
            } else {
              $scope.tezDataSource = tezList;
            }
            if ($scope.userItem.governor) {
              $scope.tezChange();
            }
          } else {
            $scope.userItem.tezId = null;
            $scope.rightTezChange();
          }
          if (!$scope.showAmg) {
            $scope.userItem.amgId = null;
            $scope.rightAmgChange();
          }
          if (!$scope.showSum) {
            $scope.userItem.sumId = null;
          }
          console.debug(nonInitOrg);
          if (nonInitOrg) {
            $scope.userItem.organization = null;
            $scope.userItem.orgId = null;
            $scope.orgDataSource = [];
          }
          if ($scope.showOrg) {
            if (["supervisor", "supervisorAdmin"].includes(dataItem.comCd)) {
              $scope.initOrgDataSource();
            }
          }
        });
      });
    };

    $scope.tezDataSource = tezList;
    $scope.tezChange = function () {
      console.debug("tez changed " + $scope.userItem.tezId);
      if ($scope.showAmg) {
        console.debug("clearing");
        if (nonInitOrg) {
          $timeout(() => {
            $scope.userItem.organization = null;
            $scope.userItem.orgId = null;
            $scope.orgDataSource = [];
          });
        }
        $timeout(() => {
          console.debug($scope.userItem.governor);
          if ($scope.userItem.governor.tezType == "02") {
            $scope.amgDataSource = amgList.filter(amg => amg.asCd === $scope.userItem.governor.ggCd.substring(1));
          } else {
            $scope.amgDataSource = amgList;
          }
        });
        $scope.amgChange();// Tez, aimag holbogdvol eniig hiih
      } else {
        $scope.initOrgDataSource();// Tez, aimag holbogdoogui tul zovhon tez haruuldag torol songovl baiguullage huuchniihaar haragdana.
        $scope.rightAmgChange();
      }
      $scope.rightTezChange();
    };

    $scope.amgDataSource = amgList;
    $scope.amgChange = function () {
      console.debug("amg changed " + $scope.userItem.amgId);
      if ($scope.showSum) {
        console.debug("clearing amg "  + nonInitOrg);
        if (nonInitOrg) {
          $timeout(() => {
            $scope.userItem.organization = null;
            $scope.userItem.orgId = null;
            $scope.orgDataSource = [];
          });
        }
      } else {
        $scope.initOrgDataSource();
      }
      if ($scope.userItem.amgId) {
        $scope.sumDataSource.filter({
          logic: "and",
          filters: [
            { field: "useYn", operator: "eq", value: 1 },
            {field: "parentId", operator: "eq", value: $scope.userItem.amgId},
          ],
        });
        $scope.sumChange();
      }
      $scope.rightAmgChange();
    };
    $scope.amgSelect = function () {
      $timeout(() => {
        $scope.userItem.sumId = null;
      });
    };

    $scope.sumDataSource = commonDataSource.urlDataSource(
      "/api/nms/as/code/list",
      JSON.stringify({
        sort: [{ field: "cdNm", dir: "asc" }],
      }),
      30,
      {
        logic: "and",
        filters: [
          { field: "useYn", operator: "eq", value: 1 }
        ],
      }
    );
    $scope.sumChange = function () {
      console.debug("sum changed " + $scope.userItem.sumId);
      // $scope.sumDataSource.data();
      if ($scope.userItem.sumId) {
        $scope.initOrgDataSource();
      }
    };

    if (["supervisorAdmin"].includes($scope.user.userType?.comCd) && $scope.user.orgId) {
      orgList = orgList.filter(org => org.id == $scope.user.orgId);
    }
    $scope.orgDataSource = orgList;// commented because it takes too much memory
    $scope.initOrgDataSource = function () {
      if ($scope.showOrg) {
        console.debug("filtering org");
        let dataSource = orgList;
        if (["supervisor", "supervisorAdmin"].includes($scope.userItem.userType.comCd)) {
          dataSource = orgList.filter(org => org.typeCh == 1);
          console.debug("filtering org with typeCh 1");
        } else {
          if ($scope.showTez && $scope.userItem.tezId) {
            dataSource = dataSource.filter(org => org.tezId == $scope.userItem.tezId);
            console.debug("filtering org with tezId" + $scope.userItem.tezId);
          }
          if ($scope.showAmg && $scope.userItem.amgId) {
            dataSource = dataSource.filter(org => org.amgId == $scope.userItem.amgId);
            console.debug("filtering org with amgId " + $scope.userItem.amgId);
          }
          if ($scope.showSum && $scope.userItem.sumId) {
            console.debug(dataSource);
            dataSource = dataSource.filter(org => org.sumId == $scope.userItem.sumId);
            console.debug("filtering org with sumId " + $scope.userItem.sumId);
            console.debug(dataSource);
          }
        }
        console.debug($scope.userItem.userType);
        $timeout(() => {
          $scope.orgDataSource = dataSource;
          console.debug("Selected org: " + $scope.userItem.orgId);
          if (!nonInitOrg) {
            nonInitOrg = true;
          }
        });
      }
    };
    $scope.orgSelect = function (org) {
      console.debug("org changed");
      $scope.userItem.orgId = org?.dataItem?.id;
      console.debug($scope.userItem.orgId);
    };

    console.debug($scope.userItem);
    if ($scope.userItem.level) {
      $scope.levelTypeSelect({dataItem: $scope.userItem.level});
    }

    $scope.userSubmit = function () {
      if ($scope.validator.validate()) {
        /*const regex = /^[А-ЯЁӨҮ]{2}\d{8}$/;
        if (!regex.test($scope.userItem.regNo.toUpperCase())) {
          $rootScope.alert(false, "Регистрийн дугаараа зөв оруулна уу.");
          return;
        }*/
        if ($stateParams.from == 1) {
          $scope.userItem.orgId = $scope.user.orgId;
        }

        $scope.userItem.rolesArr = [];
        for (let roleKey in $scope.roles) {
          let role = $scope.roles[roleKey];
          if (role) $scope.userItem.rolesArr.push(roleKey);
        }

        $scope.userItem.stansArr = [];
        for (let stans in $scope.userItem.stanIds) {
          let role = $scope.userItem.stanIds[stans];
          if (role) $scope.userItem.stansArr.push(role.id);
        }

        mainService.withResponse("post", "/api/nms/user/submit", $scope.userItem).then(function (data) {
          if (data.status === 200) {
            $rootScope.alert(true, "Амжилттай хадгаллаа.");
            $scope.back();
          } else if (data.status === 405) {
            $rootScope.alert(false, "Хэрэглэгчийн нэр давхцаж байна.");
          } else {
            $rootScope.alert(false, "Серверт алдаа гарлаа");
          }
        });
      }
    };

    // right-side
    mainService.withdata("post", "/api/nms/common/list", {
      filter: {
        logic: "and",
        filters: [
          { field: "parentId", operator: "isnull", value: false },
          { field: "grpCd", operator: "eq", value: "ecoType" },
          {
            logic: "or",
            filters: [
              { field: "comCd", operator: "eq", value: "01" },
              { field: "comCd", operator: "eq", value: "02" },
              { field: "comCd", operator: "eq", value: "03" },
              { field: "comCd", operator: "eq", value: "04" },
            ],
          },
        ],
      },
      take: 10,
      page: 1,
      pageSize: 10,
      skip: 0,
      sort: [{ field: "comCd", dir: "asc" }],
    })
    .then(function (data) {
      $scope.rightEcoList = data.data;
      $scope.isAllRightEco = $scope.userItem.ecoArr.length === $scope.rightEcoList.length;
    });
    mainService.withdata("post", "/api/nms/par/dist/list", {
      filter: { logic: "and", filters: [{ field: "useYn", operator: "eq", value: 1 }] },
      take: 100,
      page: 1,
      pageSize: 100,
      skip: 0,
      sort: [{ field: "name", dir: "asc" }],
    })
    .then(function (data) {
      $scope.allRightParDistList = data.data;
    });

    $scope.checkAllEco = function () {
      if (!$scope.isAllRightEco)
        $scope.userItem.ecoArr = $scope.rightEcoList.map((i) => {
          return i.id;
        });
      else $scope.userItem.ecoArr = [];
      $scope.isAllRightEco = $scope.userItem.ecoArr.length === $scope.rightEcoList.length;
    };
    $scope.checkAllTez = function () {
      if (!$scope.isAllRightTez)
        $scope.userItem.tezArr = $scope.rightTezList.map((i) => {
          return i.id;
        });
      else $scope.userItem.tezArr = [];
      $scope.isAllRightTez = $scope.userItem.tezArr.length === $scope.rightTezList.length;
    };
    $scope.checkAllAmg = function () {
      if (!$scope.isAllRightAmg)
        $scope.userItem.amgArr = $scope.rightAmgList.map((i) => {
          return i.id;
        });
      else $scope.userItem.amgArr = [];
      $scope.isAllRightAmg = $scope.userItem.amgArr.length === $scope.rightAmgList.length;
    };
    $scope.deleteItem = function (arr, item) {
      let index = arr.indexOf(item);
      return arr.splice(index, 1);
    };
    $scope.selectRightEco = function (item) {
      $scope.userItem.ecoArr.includes(item.id) ? $scope.deleteItem($scope.userItem.ecoArr, item.id) : $scope.userItem.ecoArr.push(item.id);
      $scope.isAllRightEco = $scope.userItem.ecoArr.length === $scope.rightEcoList.length;
    };
    $scope.selectRightTez = function (item) {
      $scope.userItem.tezArr.includes(item.id) ? $scope.deleteItem($scope.userItem.tezArr, item.id) : $scope.userItem.tezArr.push(item.id);
      $scope.isAllRightTez = $scope.userItem.tezArr.length === $scope.rightTezList.length;
    };
    $scope.selectRightAmg = function (item) {
      $scope.userItem.amgArr.includes(item.id) ? $scope.deleteItem($scope.userItem.amgArr, item.id) : $scope.userItem.amgArr.push(item.id);
      $scope.isAllRightAmg = $scope.userItem.amgArr.length === $scope.rightAmgList.length;
    };
    // right-side filter
    $scope.rightTezChange = function () {
      if (["ministry", "agency"].includes($scope.userItem.userType?.comCd)) {
        $scope.rightTezList = allRightTezList.filter((t) => t.id == $scope.userItem.tezId);
      } else if (["province", "district"].includes($scope.userItem.userType?.comCd)) {
        $scope.rightTezList = allRightTezList.filter((t) => t.commonCd.comCd === "01");
        $scope.rightTezList = $scope.rightTezList.concat(allRightTezList.filter((t) => t.id == $scope.userItem.tezId));
        $scope.rightTezList = [...new Set($scope.rightTezList)];
      } else if (["local_agency"].includes($scope.userItem.userType?.comCd)) {
        $scope.rightTezList = $scope.rightTezList.concat(allRightTezList.filter((t) => t.id == $scope.userItem?.organization?.tezId));
        $scope.rightTezList = [...new Set($scope.rightTezList)];
      } else {
        $scope.rightTezList = allRightTezList;
      }
      $timeout(() => {
        $scope.isAllRightTez = $scope.userItem.tezArr.length === $scope.rightTezList.length;
        console.debug($scope.rightTezList);
      });
    };
    $scope.rightAmgChange = function () {
      if (["province", "local_agency", "district"].includes($scope.userItem.userType?.comCd)) {
        $scope.rightAmgList = allRightAmgList.filter((t) => t.id == $scope.userItem.amgId);
      } else {
        $scope.rightAmgList = allRightAmgList;
      }
      $scope.userItem.amgArr = $scope.userItem.amgArr.filter(amgId => $scope.rightAmgList.filter(rAmg => rAmg.id === amgId).length > 0);
      $timeout(() => {
        $scope.isAllRightAmg = $scope.userItem.amgArr.length === $scope.rightAmgList.length;
        console.debug($scope.rightAmgList);
      });
    };

    // utils
    $scope.back = function () {
      if ($stateParams.from == 0) {
        $state.go("restricted.nms.920");
      } else {
        $state.go("restricted.nms.imp.1067");
      }
    };
    $scope.$on('$stateChangeStart', function() {
      console.debug("clearing...");
      delete tezList;
      delete orgList;
      delete amgList;
      delete allRightTezList;
      delete allRightAmgList;
    });

    $scope.$on('$destroy', function() {
      console.debug("clearing...");
      delete tezList;
      delete orgList;
      delete amgList;
      delete allRightTezList;
      delete allRightAmgList;
    });

  },
]);
