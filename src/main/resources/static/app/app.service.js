altairApp
    .service('detectBrowser', [
        '$window',
        function($window) {
            // http://stackoverflow.com/questions/22947535/how-to-detect-browser-using-angular
            return function() {
                var userAgent = $window.navigator.userAgent,
                    browsers  = {
                        chrome  : /chrome/i,
                        safari  : /safari/i,
                        firefox : /firefox/i,
                        ie      : /internet explorer/i
                    };

                for ( var key in browsers ) {
                    if ( browsers[key].test(userAgent) ) {
                        return key;
                    }
                }
                return 'unknown';
            }
        }
    ])
    .service('pagingService', function ($http, $q) {
        this.pageRequest=function(url,pageNumber,size,search,sort){
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: url+'?page='+pageNumber+'&size='+size+(search==undefined?'':search)+(sort==undefined?'':sort)
            })
                .then(function (response) {
                    deferred.resolve(response.data);
                });
            return deferred.promise;
        };
    })
    .service('mainService', function ($http, $q) {
        this.user = JSON.parse(sessionStorage.getItem('currentUser'));

        this.withDomain=function(method,url){
            var deferred = $q.defer();
            $http({
                method:method,
                url:url
            })
                .then(function (response) {
                    deferred.resolve(response.data);
                });

            return deferred.promise;
        };
        this.withData=function(method,url,data){
            console.log(url, data)
            var deferred = $q.defer();

            $http({
                method:method,
                url:url,
                data: data
            })
                .then(function (response) {
                    if (response.status === 200) {
                        deferred.resolve(response.data);
                    }
                    else {
                        deferred.reject('Error occured doing action withdata');
                    }
                });

            return deferred.promise;
        };

    })
    .service('fileUpload', ['$http','$q', function ($http,$q) {
        this.uploadFileToUrl = function(uploadUrl, file){
            var deferred = $q.defer();
            var fd = new FormData();
            fd.append('file', file);
            $http.post(uploadUrl, file, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
                .then(function (response) {
                    deferred.resolve(response.data);
                });

            return deferred.promise;
        }
    }])
    .service('fileUploadMulti', ['$http','$q', function ($http,$q) {
        this.uploadFileToUrl = function(file, uploadUrl){
            var deferred = $q.defer();
            var fd = new FormData();
            fd.append('file', file);
            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
                .then(function (response) {
                    deferred.resolve(response.data);
                });

            return deferred.promise;
        }
    }])
    .service('preloaders', [
        '$rootScope',
        '$timeout',
        'utils',
        function($rootScope,$timeout,utils) {
            $rootScope.content_preloader_show = function(style,variant,container,width,height) {
                var $body = $('body');
                if(!$body.find('.content-preloader').length) {
                    var image_density = utils.isHighDensity() ? '@2x' : '',
                        width = width ? width : 48,
                        height = height ? height : 48;

                    var preloader_content = (style == 'regular')
                        ? '<img src="assets/img/spinners/spinner' + image_density + '.gif" alt="" width="32" height="32">'
                        : '<div class="md-preloader"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="'+height+'" width="'+width+'" viewbox="0 0 75 75"><circle cx="37.5" cy="37.5" r="33.5" stroke-width="8"/></svg></div>';

                    var thisContainer = (typeof container !== 'undefined') ? $(container) : $body;

                    thisContainer.append('<div class="content-preloader content-preloader-'+variant+'" style="height:'+height+'px;width:'+width+'px;margin-left:-'+width/2+'px">' + preloader_content + '</div>');
                    $timeout(function() {
                        $('.content-preloader').addClass('preloader-active');
                    });
                }
            };
            $rootScope.content_preloader_hide = function() {
                var $body = $('body');
                if($body.find('.content-preloader').length) {
                    // hide preloader
                    $('.content-preloader').removeClass('preloader-active');
                    // remove preloader
                    $timeout(function() {
                        $('.content-preloader').remove();
                    }, 500);
                }
            };

        }
    ])
;
