angular.module("altairApp").controller("notificationCtrl", [
  "$rootScope",
  "$scope",
  "$state",
  "$timeout",
  "__env",
  "commonDataSource",
  "mainService",
  function ($rootScope, $scope, $state, $timeout, __env, commonDataSource, mainService) {
    $scope.modalData = {};
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));
    mainService
      .withdata("POST", __env.apiUrl() + "/api/notification/list", {
        page: 1,
        take: 10,
        pageSize: 1,
        skip: 0,
        filter: { logic: "AND", filters: [{ field: "userId", value: currentUser.user.id, operator: "eq" }] },
        sort: [{ field: "createdAt", dir: "desc" }],
      })
      .then(function (data) {
        console.log("notif list", data);
        $scope.notifs = data.data;
      });
    $scope.showNotification = function (data) {
      console.log(data);
      $scope.modalData = data;
      UIkit.modal("#modal_notif", {
        modal: false,
        keyboard: false,
        bgclose: false,
        center: false,
      }).show();
    };
    $scope.showAllNotif = function () {
      mainService.withdata("POST", __env.apiUrl() + "/api/notification/read/all/" + currentUser.user.id).then(function (data) {
        mainService.withResponse("GET", __env.apiUrl() + "/api/notification/count/" + currentUser.user.id).then(function (res) {
          console.log("count", data);
          localStorage.setItem("notif_count", res.data);
          $scope.notifCount = res.data;
        });
      });
    };
  },
]);
