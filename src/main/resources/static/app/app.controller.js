/*
 *  Altair Admin angularjs
 *  controller
 */

angular
    .module('altairApp')
    .controller('mainCtrl', [ '$rootScope','$scope','mainService',
        function ($rootScope,$scope,mainService) {
            $scope.$on("LogoutSuccessful", function (event, data) {
                mainService.withdata('post','/api/nms/activity-log/trace',{"event":"logout","description":"Системээс гарсан"}).then(function (data) {});
            });
        }
    ])
;
