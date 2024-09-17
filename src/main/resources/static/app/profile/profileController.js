angular.module("altairApp").controller("profilenCtrl", [
  "$rootScope",
  "$scope",
  "$state",
  "$timeout",
  "__env",
  "commonDataSource",
  "mainService",
  function ($rootScope, $scope, $state, $timeout, __env, commonDataSource, mainService) {
    $scope.user = JSON.parse(localStorage.getItem("currentUser"));
    $scope.notifList = [1, 2, 3, 4, 5, 6];
    $scope.selectedItem = "email";
    $scope.goToEdit = function (proStep) {
      console.log("step2", proStep);
      $state.go("restricted.profileVerify", { step1: proStep });
    };
    $scope.selectedItem = "email";

    $scope.updateNotifs = function () {
      mainService
          .withdata("PUT", __env.apiUrl() + "/api/user/notification", {
            id: $scope.user.id,
            pushWeb: $scope.user.user.pushWeb ? 1 : 0,
            pushEmail: $scope.user.user.pushEmail ? 1 : 0,
            pushNews: $scope.user.user.pushNews ? 1 : 0,
            pushSystem: $scope.user.user.pushSystem ? 1 : 0,
          })
          .then(function (data) {
            localStorage.setItem("currentUser", JSON.stringify($scope.user));
            $rootScope.alert(true, "Амжилттай хадгаллаа.");
          });
    };
    // $scope.init();
  },
]);
