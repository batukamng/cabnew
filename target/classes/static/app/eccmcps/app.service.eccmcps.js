altairApp
    .factory('customLoader', function ($http, $q) {
        return function (options) {
            var deferred = $q.defer();
            /*   $http({
                    method:'GET',
                    url:'/audit/api/lang/' + options.key
               }).success(function (data) {
                 deferred.resolve(data);
               }).error(function () {
                 deferred.reject(options.key);
               });*/

            return deferred.promise;
        }
    })
    .factory('dataService', ['$resource',
        function ($resource) {
            var service = $resource('/API/V1', {}, {
                get: {
                    url: '/form/paginated',
                    method: 'GET',
                }
            });
            return service;
        }
    ])
    .service('gridService', ['$http', function ($http) {

        var self = this;

        self.getStudents = function getStudents(url, pageNumber, size) {
            pageNumber = pageNumber > 0 ? pageNumber - 1 : 0;
            return $http({
                method: 'GET',
                url: 'api/' + url + '/get?page=' + pageNumber + '&size=' + size
            }).then(function (response) {
                return response.data;
            });
        };
        self.readAll = function (url, pageSize, pageNumber, sort, filter) {
            return $http({
                method: 'GET',
                url: 'api/' + url + '/list',
                params: {
                    pageSize: pageSize,
                    pageNumber: pageNumber,
                    sort: sort,
                    filter: filter
                }
            }).then(function (response) {
                return response.data;
            });
        };
        self.create = function (url, data) {
            return $http({
                method: 'POST',
                url: 'api/' + url + '/create',
                data: data,
                params: {
                    returnObject: true
                }
            }).then(function (response) {
                return response.data;
            }, function (response) {
                return response;
            })
        };
        self.update = function (url, id, data) {
            return $http({
                method: 'PUT',
                url: 'api/' + url + '/' + id,
                data: data
            }).then(function (response) {
                return response.data;
            });
        };
        self.update = function (url, data) {
            return $http({
                method: 'PUT',
                url: 'api/' + url + '/update',
                data: data
            }).then(function (response) {
                return response.data;
            });
        };
        self.detail = function (url, id) {
            return $http({
                method: 'GET',
                url: 'api/' + url + '/' + id,
            }).then(function (response) {
                return response.data;
            });
        };
    }])

    .service('sessionService', [
        '$rootScope',
        '$http',
        '$location',
        function ($rootScope, $http, $location, $state) {


            var session = {};
            session.login = function (data) {
                return $http.post("/login", "username=" + data.username +
                    "&password=" + data.password, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).then(function (data) {
                    var success = data.data;
                    if (success != false) {
                        // alert("hooo noo success");
                        $rootScope.authenticated = true;
                        localStorage.setItem("session", {});
                    }
                    else {
                        $rootScope.authenticated = false;
                    }
                }, function (data) {
                    // alert("error logging in");
                });
            };

            session.logout = function () {
                $http.post("/logout", {}).success(function () {
                    $rootScope.authenticated = false;
                    $location.path("/login");
                    localStorage.setItem("session", false);
                }).error(function (data) {
                    $rootScope.authenticated = false;
                });
            };

            session.isLoggedIn = function () {
                return localStorage.getItem("session") !== null;
            };
            return session;
        }])

    .service('APIInterceptor', ['$state', '$injector', function ($state, $injector) {
        var service = this;
        service.request = function (config) {
            //config.headers['API-state'] = $injector.get('$state').current.name;
            //console.log("stateSS="+$state.current.name);
            if ($state.current.name !== "") {
                config.headers['API-state'] = $state.current.name;
            }
            //console.log("check="+$injector.get('$state').current.name);
            return config
        }
    }])

    .service('mainService', function ($http, $q,$state) {
        this.user = JSON.parse(localStorage.getItem('currentUser'));
        this.btnData=function(stateUrl){
            var actionStr = "";
            angular.forEach(this.user.privileges, function (role, key) {
                console.log(role);
                if (stateUrl === role.url) {
                    actionStr = role.actionName;
                }
            });
          /*  if(!actionStr.includes("read")){
                $state.go("login");
            }*/
            return actionStr;
        };
        this.withdomain = function (method, url) {
            var deferred = $q.defer();
            $http({
                method: method,
                url: url
            })
                .then(function (response) {
                    deferred.resolve(response.data);
                });

            return deferred.promise;
        };

        this.withdomainstatus = function (method, url) {
            var deferred = $q.defer();
            $http({
                method: method,
                url: url
            })
                .then(function (response) {
                    deferred.resolve(response);
                });

            return deferred.promise;
        };

        this.withdata = function (method, url, data) {
            var deferred = $q.defer();

            $http({
                method: method,
                url: url,
                data: data
            }).then(function (response) {
                if (response.status === 200) {
                    deferred.resolve(response.data);
                }
                else {
                    deferred.resolve('Error occured doing action withdata');
                }
            }).catch(function (response) {
                deferred.resolve(response);
            });

            return deferred.promise;
        };
        this.withdataWithoutTimestamp = function (method, url, data) {
            var deferred = $q.defer();

            function removeRecurse(obj) {
                if (obj instanceof Object) {
                    if ("createdAt" in obj) {
                        delete obj.createdAt;
                    }
                    if ("updatedAt" in obj) {
                        delete obj.updatedAt;
                    }
                    for (const [key, value] of Object.entries(obj)) {
                        obj[key] = removeRecurse(value);
                    }
                }
                return obj;
            }
            data = removeRecurse(JSON.parse(JSON.stringify(data)));

            $http({
                method: method,
                url: url,
                data: data
            }).then(function (response) {
                if (response.status === 200) {
                    deferred.resolve(response.data);
                }
                else {
                    deferred.resolve('Error occured doing action withdata');
                }
            }).catch(function (response) {
                deferred.resolve(response);
            });

            return deferred.promise;
        };

        this.withResponse = function (method, url, data) {
            var deferred = $q.defer();

            $http({
                method: method,
                url: url,
                data: data
            })
                .then(function (response) {
                    deferred.resolve(response);
                })
                .catch(function onError(response) {
                    deferred.resolve(response);
                });

            return deferred.promise;
        };

        this.withformdata = function (url, data) {
            var deferred = $q.defer();
            $http.post(url, data, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            })
                .then(function (response) {
                    deferred.resolve(response.data);
                });

            return deferred.promise;
        }

    });
