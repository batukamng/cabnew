angular.module("altairApp").controller("bannerCtrl", [
  "$timeout",
  "$rootScope",
  "mainService",
  "$scope",
  "$interval",
  "$http",
  "Idle",
  "$window",
  "Upload",
  "$state",
  "__env",
  "commonDataSource",
  "downloadService",
  function ($timeout, $rootScope, mainService, $scope, $interval, $http, Idle, $window, Upload, $state, __env, commonDataSource, downloadService) {
    $scope.user = JSON.parse(sessionStorage.getItem("currentUser"));
    $scope.link = "";
    $scope.image = "";

    $scope.showModal = function () {
      console.log("showmodal");
      UIkit.modal("#modal_banner", {
        modal: true,
        keyboard: false,
        bgclose: false,
        center: true,
      }).show();
    };
    $rootScope.$on("bannerShow", function (event, args) {
      console.log(args);
      $scope.image = args.image;
      $scope.link = args.link;
      console.log("url(" + __env.apiUrl() + args.image + ")");
      $("#banner").css("background-image", "url(" + __env.apiUrl() + args.image + ")");
      $("#link").attr("href", args.link);
      console.log($("#banner"), $("#link"));

      $scope.showModal();
    });
    // $scope.hideBanner = function () {
    //   sessionStorage.setItem("banner", "0");
    // };
  },
]);
