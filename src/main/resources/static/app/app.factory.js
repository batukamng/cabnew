altairApp
    .factory("windowDimensions", [
      "$window",
      function ($window) {
        return {
          height: function () {
            return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
          },
          width: function () {
            return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
          },
        };
      },
    ])
    .factory("crudDataSource", [
      "__env",
      "$rootScope",
      function (__env, $rootScope) {
        return {
          getDataSource: function (url, size, field, filter) {
            return new kendo.data.DataSource({
              transport: {
                read: {
                  url: __env.apiUrl() + url + "/list",
                  contentType: "application/json; charset=UTF-8",
                  type: "POST",
                  data: { sort: [{ field: "id", dir: "desc" }] },
                  beforeSend: function (req) {
                    if (JSON.parse(sessionStorage.getItem("currentUser")) != null) {
                      req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
                    } else {
                      $rootScope.$broadcast("LogoutSuccessful");
                    }
                  },
                },
                create: {
                  url: __env.apiUrl() + url,
                  contentType: "application/json; charset=UTF-8",
                  type: "POST",
                  beforeSend: function (req) {
                    req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
                  },
                  complete: function (e) {
                    $(".k-grid").data("kendoGrid").dataSource.read();
                  },
                },
                update: {
                  url: __env.apiUrl() + url,
                  contentType: "application/json; charset=UTF-8",
                  type: "PUT",
                  beforeSend: function (req) {
                    req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
                  },
                  complete: function (e) {
                    $(".k-grid").data("kendoGrid").dataSource.read();
                  },
                },
                destroy: {
                  url: __env.apiUrl() + url,
                  contentType: "application/json; charset=UTF-8",
                  type: "DELETE",
                  beforeSend: function (req) {
                    req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
                  },
                  complete: function (e) {
                    $(".k-grid").data("kendoGrid").dataSource.read();
                  },
                },
                parameterMap: function (options) {
                  return JSON.stringify(options);
                },
              },
              schema: {
                data: "data",
                total: "total",
                model: {
                  id: "id",
                  fields: field,
                },
              },
              pageSize: size,
              filter: filter,
              serverPaging: true,
              serverFiltering: true,
              serverSorting: true,
            });
          },
        };
      },
    ])
    .factory("commonDataSource", [
      "__env",
      "$rootScope",
      function (__env, $rootScope) {
        return {
          commonDataSource: function (typeStr) {
            return new kendo.data.DataSource({
              transport: {
                read: {
                  url: __env.apiUrl() + "/api/comCd/list",
                  contentType: "application/json; charset=UTF-8",
                  data: { sort: [{ field: "orderId", dir: "asc" }], custom: "where grpCd='" + typeStr + "' and parentId != null and useYn=1" },
                  type: "POST",
                  beforeSend: function (req) {
                    if (JSON.parse(sessionStorage.getItem("currentUser")) != null) {
                      req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
                    } else {
                      $rootScope.$broadcast("LogoutSuccessful");
                    }
                  },
                },
                parameterMap: function (options) {
                  return JSON.stringify(options);
                },
              },
              schema: {
                data: "data",
                total: "total",
              },
              serverPaging: true,
              serverFiltering: true,
              serverSorting: true,
            });
          },
          getDataSource: function (url) {
            return new kendo.data.DataSource({
              transport: {
                read: {
                  url: __env.apiUrl() + url,
                  contentType: "application/json; charset=UTF-8",
                  type: "POST",
                  beforeSend: function (req) {
                    if (JSON.parse(sessionStorage.getItem("currentUser")) != null) {
                      req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
                    }
                  },
                },
                parameterMap: function (options) {
                  return JSON.stringify(options);
                },
              },
              schema: {
                data: function (data) {
                  if (data.total == 0) {
                    return [];
                  }
                  return data.data;
                },
                total: "total",
              },
              pageSize: 60,
              serverPaging: true,
              serverFiltering: true,
              serverSorting: true,
            });
          },
          urlDataSource: function (url, data, page = 20, filter = {}) {
            return new kendo.data.DataSource({
              transport: {
                read: {
                  url: __env.apiUrl() + url,
                  contentType: "application/json; charset=UTF-8",
                  data: JSON.parse(data),
                  type: "POST",
                  beforeSend: function (req) {
                    if (JSON.parse(sessionStorage.getItem("currentUser")) != null) {
                      req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
                    } else {
                      $rootScope.$broadcast("LogoutSuccessful");
                    }
                  },
                },
                parameterMap: function (options) {
                  return JSON.stringify(options);
                },
              },
              schema: {
                data: function (data) {
                  if (data.total == 0) {
                    return [];
                  }
                  return data.data;
                },
                total: "total",
              },
              filter: filter,
              pageSize: page,
              serverPaging: true,
              serverFiltering: true,
              serverSorting: true,
            });
          },
          urlDataSourceThen: function (url, data, then, page = 20) {
            return new kendo.data.DataSource({
              transport: {
                read: {
                  url: __env.apiUrl() + url,
                  contentType: "application/json; charset=UTF-8",
                  data: JSON.parse(data),
                  type: "POST",
                  beforeSend: function (req) {
                    if (JSON.parse(sessionStorage.getItem("currentUser")) != null) {
                      req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
                    } else {
                      $rootScope.$broadcast("LogoutSuccessful");
                    }
                  },
                  complete: then,
                },
                parameterMap: function (options) {
                  return JSON.stringify(options);
                },
              },
              schema: {
                data: function (data) {
                  if (data.total == 0) {
                    return [];
                  }
                  return data.data;
                },
                total: "total",
              },
              pageSize: page,
              serverPaging: true,
              serverFiltering: true,
              serverSorting: true,
            });
          },
          urlPageDataSource: function (url, data, size) {
            return new kendo.data.DataSource({
              transport: {
                read: {
                  url: __env.apiUrl() + url,
                  contentType: "application/json; charset=UTF-8",
                  data: JSON.parse(data),
                  type: "POST",
                  beforeSend: function (req) {
                    if (JSON.parse(sessionStorage.getItem("currentUser")) !== null) {
                      req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
                    } else {
                      $rootScope.$broadcast("LogoutSuccessful");
                    }
                  },
                },
                parameterMap: function (options) {
                  return JSON.stringify(options);
                },
              },
              schema: {
                data: function (data) {
                  if (data.total === 0) {
                    return [];
                  }
                  return data.data;
                },
                total: "total",
              },
              pageSize: size,
              serverPaging: true,
              serverFiltering: true,
              serverSorting: true,
            });
          },
        };
      },
    ])
    .factory("pagerService", function PagerService() {
      // service definition
      var service = {};

      service.GetPager = GetPager;

      return service;

      // service implementation
      function GetPager(itemCount, currentPage, itemPerPage) {
        currentPage = currentPage || 1;
        var startPage, endPage;

        var totalPages = Math.ceil(itemCount / itemPerPage);
        if (totalPages <= itemPerPage) {
          startPage = 1;
          endPage = totalPages;
        } else {
          if (currentPage + 1 >= totalPages) {
            startPage = totalPages - (itemPerPage - 1);
            endPage = totalPages;
          } else {
            startPage = currentPage - parseInt(itemPerPage / 2);
            startPage = startPage <= 0 ? 1 : startPage;
            endPage = startPage + itemPerPage - 1 <= totalPages ? startPage + itemPerPage - 1 : totalPages;
            if (totalPages === endPage) {
              startPage = endPage - itemPerPage + 1;
            }
          }
        }

        var startIndex = (currentPage - 1) * itemPerPage;
        var endIndex = startIndex + itemPerPage - 1;

        var index = startPage;
        var pages = [];
        for (; index < endPage + 1; index++) pages.push(index);

        // return object with all pager properties required by the view
        return {
          currentPage: currentPage,
          totalPages: totalPages,
          startPage: startPage,
          endPage: endPage,
          startIndex: startIndex,
          endIndex: endIndex,
          pages: pages,
        };
      }
    })
    .factory("sse", function ($rootScope) {
      var sse = new EventSource("/subscription");
      return {
        addEventListener: function (eventName, callback) {
          sse.addEventListener(eventName, function () {
            var args = arguments;
            $rootScope.$apply(function () {
              callback.apply(sse, args);
            });
          });
        },
      };
    })
    .factory("asyncLoader", function ($q, $timeout, $http, __env) {
      return function (options) {
        var deferred = $q.defer(),
            translations;
        $http({
          //   headers: {'Authorization': 'Bearer'+JSON.parse(sessionStorage.getItem('currentUser')).token},
          method: "GET",
          url: __env.apiUrl() + "/api/label/lang/" + options.key,
        }).then(function (response) {
          sessionStorage.removeItem("langData");
          sessionStorage.setItem("langData", JSON.stringify({ langData: response.data }));
          deferred.resolve(response.data);
        });

        return deferred.promise;
      };
    })
    .factory("loginService", [
      "$rootScope",
      "constants",
      "$http",
      "authProvider",
      "__env",
      function ($rootScope, constants, $http, authProvider,__env) {
        var loginUrl = constants.authenticationUrl;
        var logoutUrl = constants.logoutUrl;
        return {
          doLogin: function (username, password) {
            var credentials = { username: username, password: password, fcmToken: sessionStorage.getItem("fcm_token") };
            $http
                .post(__env.apiUrl()+"/api/auth/sign-in", credentials)
                .then(function (data, status, headers, config) {
                  var authToken = data.data.token;
                  if (authToken == null) {
                    $rootScope.$broadcast("logInFailed", "Нэвтрэх нэр эсвэл нууц үг буруу байна.");
                    return;
                  }
                  $http.defaults.headers.common["Authorization"] = "Bearer " + data.data.token;
                  authProvider.user = data.data;
                  authProvider.authToken = data.data.token;
                  sessionStorage.setItem("menuList", JSON.stringify(data.data.user.menus));
                  data.data.user.modules = data.data.user.modules.sort((a, b) => parseFloat(a.orderId) - parseFloat(b.orderId));
                  var tmpMenus = data.data.user.menus;
                  var menus = tmpMenus.filter((i) => i.modules.filter((j) => j.id == data.data.user.modules[0].id).length > 0);
                  if (menus) var firstMenu = menus.sort((a, b) => parseFloat(a.orderId) - parseFloat(b.orderId))[0];

                  $rootScope.$broadcast("loggedIn", { firstMenu: firstMenu || null, user: data.data.user });
                  var currentDate = new Date(new Date().getTime());
                  var expireDate = new Date(new Date().getTime() + 1000 * 86400);
                  sessionStorage.setItem(
                      "currentUser",
                      JSON.stringify({ username: data.data.user.username, id: data.data.user.id, user: data.data.user, token: data.data.token, expires: expireDate, loginDate: currentDate })
                  );
                  sessionStorage.setItem("roles", JSON.stringify(data.data.user.roles));
                  sessionStorage.setItem("module", JSON.stringify(data.data.user.modules[0].id));
                })
                .catch(function (data, status) {
                  if (data.status === 400) {
                    $rootScope.$broadcast("logInFailed", "Энэ хэрэглэгч идэвхгүй байна.");
                    return;
                  }
                  $rootScope.$broadcast("logInFailed");
                });
          },
          doLogout: function () {
            $http
                .post(logoutUrl)
                .success(function (data, status, headers, config) {
                  authProvider.user = null;
                  crossOriginIsolated.log("doLogout");
                  sessionStorage.removeItem("currentUser");
                  sessionStorage.removeItem("menuList");
                  sessionStorage.removeItem("menuData");
                  delete $http.defaults.headers.common["Authorization"];
                  $rootScope.$broadcast("loggedOut", "");
                })
                .error(function (data, status) {
                  $rootScope.$broadcast("logOutFailed");
                });
          },
        };
      },
    ])
    .factory("downloadService", [
      "$q",
      "$timeout",
      "$window",
      function ($q, $timeout, $window) {
        return {
          download: function (name) {
            var defer = $q.defer();

            $timeout(function () {
              $window.location = name;
            }, 500).then(
                function (response) {
                  defer.resolve("success");
                },
                function () {
                  defer.reject("error");
                }
            );
            return defer.promise;
          },
        };
      },
    ])
    .factory("authProvider", [
      "$rootScope",
      function ($rootScope) {
        var userName;
        var userRoles;
        var authToken;

        return {
          set User(aUser) {
            userName = aUser;
          },
          get User() {
            return userName;
          },
          set AuthToken(token) {
            authToken = token;
          },
          get AuthToken() {
            return authToken;
          },
          set Roles(roles) {
            userRoles = roles;
          },
          get Roles() {
            return userRoles;
          },
          hasRole: function (role) {
            return this.isLoggedIn() && this.roles.indexOf(role) > -1;
          },
          isLoggedIn: function () {
            return this.user != null;
          },
        };
      },
    ])
    .factory("chat", function ($q, $http) {
      var stompClient = null,
          room;
      return {
        connect: function (roomId, messageHandlerCallback, errorHandlerCallBack) {
          room = roomId;
          var deferred = $q.defer();
          var socket = new SockJS("/chat/rooms/" + roomId);
          stompClient = Stomp.over(socket);
          stompClient.debug = null;
          var headers = {};
          headers["Authorization"] = $http.defaults.headers.common.Authorization;
          stompClient.connect(
              headers,
              function (frame) {
                deferred.resolve(frame);
                stompClient.subscribe("/topic/rooms/" + roomId, function (messageOutput) {
                  var message = JSON.parse(messageOutput.body);
                  messageHandlerCallback(message);
                });
                stompClient.subscribe("/user/queue/error", function (messageOutput) {
                  var message = JSON.parse(messageOutput.body);
                  errorHandlerCallBack(message);
                });
              },
              function (frame) {
                deferred.reject(frame);
              }
          );

          return deferred.promise;
        },
        disconnect: function () {
          stompClient.disconnect();
        },
        sendMessage: function (message) {
          stompClient.send("/api/conversation/chat/rooms/" + room, {}, JSON.stringify(message));
        },
      };
    })
    .factory("ChatSocket", [
      "$rootScope",
      function ($rootScope) {
        var stompClient;

        return {
          init: function (url) {
            stompClient = Stomp.over(new SockJS(url));
          },
          connect: function (successCallback, errorCallback) {
            stompClient.connect(
                {},
                function (frame) {
                  $rootScope.$apply(function () {
                    successCallback(frame);
                  });
                },
                function (error) {
                  $rootScope.$apply(function () {
                    errorCallback(error);
                  });
                }
            );
          },
          subscribe: function (destination, callback) {
            stompClient.subscribe(destination, function (message) {
              $rootScope.$apply(function () {
                callback(message);
              });
            });
          },
          send: function (destination, headers, object) {
            stompClient.send(destination, headers, object);
          },
          getConnected: function () {
            return stompClient;
          },
        };
      },
    ])
    .factory("utils", [
      function () {
        return {
          // Util for finding an object by its 'id' property among an array
          findByItemId: function findById(a, id) {
            for (var i = 0; i < a.length; i++) {
              if (a[i].item_id == id) return a[i];
            }
            return null;
          },
          findById: function findById(a, id) {
            for (var i = 0; i < a.length; i++) {
              if (a[i].id == id) return a[i];
            }
            return null;
          },
          // serialize form
          serializeObject: function (form) {
            var o = {};
            var a = form.serializeArray();
            $.each(a, function () {
              if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                  o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || "");
              } else {
                o[this.name] = this.value || "";
              }
            });
            return o;
          },
          // high density test
          isHighDensity: function () {
            return (
                (window.matchMedia &&
                    (window.matchMedia("only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)").matches ||
                        window.matchMedia(
                            "only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)"
                        ).matches)) ||
                (window.devicePixelRatio && window.devicePixelRatio > 1.3)
            );
          },
          // touch device test
          isTouchDevice: function () {
            return !!("ontouchstart" in window);
          },
          // local storage test
          lsTest: function () {
            var test = "test";
            try {
              sessionStorage.setItem(test, test);
              sessionStorage.removeItem(test);
              return true;
            } catch (e) {
              return false;
            }
          },
          // show/hide card
          card_show_hide: function (card, begin_callback, complete_callback, callback_element) {
            $(card)
                .velocity(
                    {
                      scale: 0,
                      opacity: 0.2,
                    },
                    {
                      duration: 400,
                      easing: [0.4, 0, 0.2, 1],
                      // on begin callback
                      begin: function () {
                        if (typeof begin_callback !== "undefined") {
                          begin_callback(callback_element);
                        }
                      },
                      // on complete callback
                      complete: function () {
                        if (typeof complete_callback !== "undefined") {
                          complete_callback(callback_element);
                        }
                      },
                    }
                )
                .velocity("reverse");
          },
          randomNUmber: function (min, max) {
            const crypto = require("crypto");
            const array = new Uint32Array(1);
            const tmp = crypto.getRandomValues(array);
            let result = "";
            for (let i = 0; i < tmp.length; i++) {
              result += String(array[i]);
            }
            const safe_randStr = String(result).substring(0, 6);

            return Math.floor(safe_randStr * (max - min + 1) + min);
          },
        };
      },
    ]);

angular.module("ConsoleLogger", []).factory("PrintToConsole", [
  "$rootScope",
  function ($rootScope) {
    var handler = { active: false };
    handler.toggle = function () {
      handler.active = !handler.active;
    };
    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
      console.log("Asdasdasd");
      if (handler.active) {
        console.log("$stateChangeStart --- event, toState, toParams, fromState, fromParams");
        console.log(arguments);
      }
    });
    $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
      if (handler.active) {
        console.log("$stateChangeError --- event, toState, toParams, fromState, fromParams, error");
        console.log(arguments);
      }
    });
    $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
      console.log("stateChangeSuccess");
      if (handler.active) {
        console.log("$stateChangeSuccess --- event, toState, toParams, fromState, fromParams");
        console.log(arguments);
      }
    });
    $rootScope.$on("$viewContentLoading", function (event, viewConfig) {
      if (handler.active) {
        console.log("$viewContentLoading --- event, viewConfig");
        console.log(arguments);
      }
    });
    $rootScope.$on("$viewContentLoaded", function (event) {
      if (handler.active) {
        console.log("$viewContentLoaded --- event");
        console.log(arguments);
      }
    });
    $rootScope.$on("$stateNotFound", function (event, unfoundState, fromState, fromParams) {
      if (handler.active) {
        console.log("$stateNotFound --- event, unfoundState, fromState, fromParams");
        console.log(arguments);
      }
    });
    return handler;
  },
]);