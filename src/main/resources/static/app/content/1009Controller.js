angular
    .module('altairApp')
    .controller(
        '1009CntCtrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$timeout',
            'mainService',
            '__env',
            function ($rootScope, $state, $scope, $timeout, mainService, __env) {
                $scope.user = JSON.parse(sessionStorage.getItem('currentUser'));
                $scope.newsList = [];
                $scope.news = {};
                mainService.withdata('post', __env.apiUrl() + '/api/cnt/content/list',
                    JSON.stringify({ "custom": "where useYn=true", sort: [{ field: "regDtm", dir: "desc" }] }))
                .then(function (data) {
                    $scope.newsList = data.data;
                });

                $scope.read = function(news) {
                    $scope.news = news;
                    $scope.moreText = news.moreText;
                    $("#aside-backdrop").fadeIn(200);
                    $("#aside2").show("slide", { direction: "right" }, 200);
                    setTimeout(function() {
                        $(".lightgallery").each(function () {
                            $(this).lightGallery({
                                selector: '.item'
                            });
                        });
                    }, 500);
                }
                $scope.hideAside = function() {
                    $("#aside-backdrop").fadeOut(100);
                    $("#aside2").hide("slide", { direction: "right" }, 100);
                }
            }
        ]
    );
