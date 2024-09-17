angular.module("altairApp").controller("loginHandleCtrl", [
  "$scope",
  "$rootScope",
  "$window",
  "authProvider",
  "$http",
  "$location",
  "$state",
  "utils",
  "mainService",
  "__env",
  function ($scope, $rootScope, $window, authProvider, $http, $location, $state, utils, mainService, __env) {
    if (window.location.href.indexOf("?") > -1) {
      var callbackResponse = document.URL.split("?")[1];
      var responseParamArr = callbackResponse.split("#");
      var responseParameters;
      if (responseParamArr.length > 1 && responseParamArr[1].startsWith("/")) {
        responseParameters = responseParamArr[0].split("&");
      } else {
        responseParameters = responseParamArr[0].split("&");
      }

      console.log(responseParameters);
      var parameterMap = [];
      for (var i = 0; i < responseParameters.length; i++) {
        parameterMap[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
      }
      console.log(parameterMap.state);
      $scope.data = {};
      $scope.data.client_secret = "2823c42b-0998-4619-a91e-649b75fef4c6";
      $scope.data.grant_type = "authorization_code";
      $scope.data.redirect_uri = "http://localhost:8000/";
      $scope.data.client_id = "pimis";
      $scope.data.state = parameterMap.state;
      $scope.data.code = parameterMap.code;

      var fd = new FormData();
      for (let i in $scope.data) {
        fd.append(i, $scope.data[i]);
      }

      var tokenUrl = "https://st.auth.itc.gov.mn/auth/realms/Staging/protocol/openid-connect/token";

      // mainService.withdomain("get",tokenUrl).then(function (data) {
      //     console.log(data);
      // })

      mainService.withdomain("get", __env.apiUrl() + "/api/public/token/" + parameterMap.code + "/" + parameterMap.state).then(function (data) {
        console.log(data);
      });

      // mainService.withformdata(tokenUrl,fd).then(function (data) {
      //     console.log(data);
      // })

      // var token = $location.search().token;
      // console.log(token);
      if (parameterMap.token !== undefined && parameterMap.token !== null) {
        $http.defaults.headers.common["Authorization"] = "Bearer " + parameterMap.token.replace("#/login/handler", "");

        var expireDate = new Date(new Date().getTime() + 1000 * 86400);

        mainService.withdomain("get", "/user/me").then(function (data) {
          // localStorage.setItem('currentUser', JSON.stringify({ username: data.name, token: parameterMap.token.replace("#/login",""), expires:expireDate, data: data}));
          $state.go("restricted.dashboard");
          // $window.location.href = "/";
        });
      }
    }
  },
]);
