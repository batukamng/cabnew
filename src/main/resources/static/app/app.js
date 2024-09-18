/*
 *  Altair Admin AngularJS
 */
("use strict");

// Assign default environment variables
var env = {
    apiUrl: "",
    baseUrl: "/",
    enableDebug: true,
};

// Import variables if present (from env.js)
if (window) {
    env = window.__env;
    sessionStorage.setItem("apiUrl", "");
    sessionStorage.setItem("baseUrl", "/");
    sessionStorage.setItem("enableDebug", true);
}

var altairApp = angular.module("altairApp", ["ui.router", "oc.lazyLoad", "ngSanitize", "ngRetina", "ncy-angular-breadcrumb", "ngFileUpload", "app.i18n", "hSweetAlert", "ConsoleLogger"]);

altairApp.constant("variables", {
    header_main_height: 48,
    easing_swiftOut: [0.4, 0, 0.2, 1],
    easing_swiftLeft: [0, 0.1, 0, 1],
    bez_easing_swiftOut: $.bez([0.4, 0, 0.2, 1]),
});

/*altairApp.factory('asyncLoader', function ($q, $timeout,$http) {
    return function (options) {
        var deferred = $q.defer(), translations;
        $http({
         //   headers: {'Authorization': 'Bearer'+JSON.parse(sessionStorage.getItem('currentUser')).token},
            method:'GET',
            url:'/api/label/lang/' + options.key
        }).then(function (response) {
            sessionStorage.removeItem('langData');
            sessionStorage.setItem('langData', JSON.stringify({ langData: response.data}));
            deferred.resolve(response.data);
        });

        return deferred.promise;
    };
});*/
altairApp.config(function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(["self", "https://www.youtube.com/**", "https://w.soundcloud.com/**"]);
});

// breadcrumbs
altairApp.config(function ($breadcrumbProvider) {
    $breadcrumbProvider.setOptions({
        prefixStateName: "restricted",
        templateUrl: "app/templates/breadcrumbs.tpl.html",
    });
});

var baseAddress = "http://192.168.1.108:8080";

var applicationConstants = {
    authenticationUrl: baseAddress + "/rest/auth/token",
    logoutUrl: baseAddress + "/rest/logout",
    registrationUrl: baseAddress + "/rest/register",
    profileUrl: baseAddress + "/api/profile",
    chatUrl: baseAddress + "/rest/socket",
};

altairApp.constant("constants", applicationConstants);

altairApp.factory("__env", function () {
    return {
        apiUrl: function () {
            return sessionStorage.getItem("apiUrl") ? sessionStorage.getItem("apiUrl") : "";
        },
        baseUrl: function () {
            return sessionStorage.getItem("baseUrl") ? sessionStorage.getItem("baseUrl") : "/";
        },
        enableDebug: function () {
            return sessionStorage.getItem("enableDebug") ? sessionStorage.getItem("enableDebug") : true;
        },
    };
});

altairApp
    .factory("authHttpResponseInterceptor", [
        "$window",
        "$q",
        "$location",
        "$injector",
        function ($window, $q, $location, $injector) {
            return {
                request: function (config) {
                    config.headers = config.headers || {};
                    if (sessionStorage.getItem("currentUser")) {
                        // may also use sessionStorage
                        config.headers.Authorization = "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token;
                    }
                    return config || $q.when(config);
                },
                response: function (response) {
                    if (response.status === 401) {
                        sessionStorage.removeItem("currentUser");

                        $injector.get("$state").transitionTo("login");
                    }
                    return response || $q.when(response);
                },
                responseError: function (rejection) {
                    if (rejection.status === 401) {
                        $injector.get("$state").transitionTo("login");
                    } else if (rejection.status === 403) {
                        $injector.get("$state").transitionTo("login");
                    }
                    return $q.reject(rejection);
                },
            };
        },
    ])
    .config([
        "$qProvider",
        function ($qProvider) {
            $qProvider.errorOnUnhandledRejections(false);
        },
    ])
    .config([
        "$httpProvider",
        function ($httpProvider) {
            $httpProvider.interceptors.push("authHttpResponseInterceptor");
        },
    ]);

/* detect IE */
function detectIE() {
    var a = window.navigator.userAgent,
        b = a.indexOf("MSIE ");
    if (0 < b) return parseInt(a.substring(b + 5, a.indexOf(".", b)), 10);
    if (0 < a.indexOf("Trident/")) return (b = a.indexOf("rv:")), parseInt(a.substring(b + 3, a.indexOf(".", b)), 10);
    b = a.indexOf("Edge/");
    return 0 < b ? parseInt(a.substring(b + 5, a.indexOf(".", b)), 10) : !1;
}

/* Run Block */
altairApp
    .run([
        "$rootScope",
        "$state",
        "$location",
        "$stateParams",
        "$http",
        "$window",
        "$timeout",
        "variables",
        "$transitions",
        "$trace",
        "$q",
        "mainService",
        function ($rootScope, $state, $location, $stateParams, $http, $window, $timeout, variables, $transitions, $trace, $q,mainService) {
            var user = JSON.parse(sessionStorage.getItem("currentUser"));
            var currentMenu = null;
            if (user == null) {
                //    $state.go('login');
                $location.url('/login');
                let tmp = window.sessionStorage.getItem("fcm_token");
                window.sessionStorage.clear();
                if (tmp !== null) {
                    window.sessionStorage.setItem("fcm_token", tmp);
                }
            }
            var actionUrls = ["restricted.feedback", "restricted.profileVerify", "restricted.profile", "restricted.notification"];
            $trace.enable("TRANSITION");
            $rootScope.menuAccordionMode = true;
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.clearForm = function (formName) {
                $("#" + formName + " .ng-invalid").removeClass("ng-invalid");
                $("#" + formName + " .ng-invalid-required").removeClass("ng-invalid-required");
                $("#" + formName + " .ng-touched").removeClass("ng-touched");
                $("#" + formName + " .k-invalid").removeClass("k-invalid");
            };
            $rootScope.isInStep = function (stepId) {
                let user = JSON.parse(sessionStorage.getItem("currentUser")).user;
                return user.fundingStepIds.includes(stepId);
            };
            $rootScope.isAmg = function (user) {
                return user.governor && user.governor.commonCd.comCd === "02" && user.userType && user.userType.comCd === "province";
            };
            $rootScope.isTez = function (user) {
                return user.governor && user.governor.commonCd.comCd === "01" && user.userType && user.userType.comCd === "ministry";
            };
            $rootScope.isMof = function (user) {
                //return user.governor && user.governor.commonCd.comCd === "01" && user.userType && user.userType.comCd === "mof";
                return user.userType.comCd === "mof" && user.level && user.level.mof === 1;
            };
            $rootScope.isAdmin = function (user) {
                return user.userType.comCd === "sysAdmin";
            };

            $rootScope.alert = function (type, message) {
                if (type) {
                    UIkit.notify("Амжилтгүй. Шинэ нууц үг таарахгүй байна", {
                        status: "danger",
                        pos: "bottom-center",
                       // timeout: 500000000,
                        message:
                            '<div class="toast">\n' +
                            '      <div class="w-full flex gap-2 content">\n' +
                            '        <div class="icon"> <i style="vertical-align: -5px;color: white" class="material-icons md-24">\n' +
                            "                    priority_high\n" +
                            "                </i></div>\n" +
                            '        <div class="details">\n' +
                            "          <span>Амжилттай</span>\n" +
                            "          <p>" +
                            message +
                            "</p>\n" +
                            "        </div>\n" +
                            "      </div>\n" +
                            '      <div class="close-icon"><i style="vertical-align: -5px;" class="material-icons md-24">close</i></div>\n' +
                            "    </div>",
                    });
                } else {
                    // timeout: 500000000,
                    UIkit.notify("Амжилтгүй. Шинэ нууц үг таарахгүй байна", {
                        status: "danger",
                        pos: "bottom-center",
                        message:
                            '<div class="toast danger">\n' +
                            '      <div class="w-full flex gap-2 content">\n' +
                            '        <div class="icon dangerIcon" > <i style="vertical-align: -5px;color: white" class="material-icons md-24">\n' +
                            "                    priority_high\n" +
                            "                </i></div>\n" +
                            '        <div class="details">\n' +
                            "          <span>Анхаар</span>\n" +
                            "          <p>" +
                            message +
                            "</p>\n" +
                            "        </div>\n" +
                            "      </div>\n" +
                            '      <div class="close-icon"><i style="vertical-align: -5px;" class="material-icons md-24">close</i></div>\n' +
                            "    </div>",
                    });
                }
            };
            $rootScope.toLogin = function (transition) {
                sessionStorage.removeItem("currentUser");
                sessionStorage.removeItem("menuList");
                sessionStorage.removeItem("menuData");
                if (sessionStorage.getItem("version") === null) {
                    sessionStorage.clear();
                    sessionStorage.setItem("version", "3.1");
                }
                return transition.router.stateService.target("login");
            };

            $transitions.onBefore({}, function ($transition) {
                const deferred = $q.defer();
                var user = JSON.parse(sessionStorage.getItem("currentUser"));

                if (user != null) {
                    try {
                        const menuList = JSON.parse(sessionStorage.getItem("menuList"));
                        if (menuList) {
                            var menuData = menuList.filter((i) => i.url == $transition.$to().name);
                            if (menuData.length > 0) {
                                sessionStorage.setItem("menuData", JSON.stringify(menuData[0]));
                                var actionName = user.user.privileges.filter((i) => i.menuId == menuData[0].id)[0].actionName;
                                if (actionName && actionName.includes("read")) {
                                    sessionStorage.setItem("buttonData", actionName);
                                    return menuData[0];
                                } else {
                                    return $rootScope.toLogin($transition);
                                }
                            } else {
                                menuList.map((i) => {
                                    let item = i.lutMenus.filter(({url}) => url === $transition.$to().name);
                                    if (item.length > 0) {
                                        sessionStorage.setItem("menuData", JSON.stringify(item[0]));
                                        var actionName = user.user.privileges.filter((i) => i.menuId == item[0].id)[0].actionName;
                                        if (actionName && actionName.includes("read")) {
                                            sessionStorage.setItem("buttonData", actionName);
                                            return item;
                                        } else {
                                            return $rootScope.toLogin($transition);
                                        }
                                    }
                                });
                            }
                            // if (!actionUrls.includes($transition.$to().name)) {
                            //   console.log(3333);
                            //   return $rootScope.toLogin($transition);
                            // }
                        }
                    } catch (e) {
                        if (sessionStorage.getItem("version") === null) {
                            sessionStorage.clear();
                            sessionStorage.setItem("version", "3.1");
                            return $rootScope.toLogin($transition);
                        }
                    }
                }
                if (user == null && $transition.$to().name != "login") {
                    return $rootScope.toLogin($transition);
                }
            });
            $transitions.onStart({}, function ($transition) {
                $rootScope.buttonData = false;

                // main search
                $rootScope.mainSearchActive = false;
                // secondary sidebar
                $rootScope.sidebar_secondary = false;
                $rootScope.secondarySidebarHiddenLarge = false;
                $rootScope.miniSidebarHiddenLarge = false;

                if ($($window).width() < 1220) {
                    // hide primary sidebar
                    $rootScope.primarySidebarActive = false;
                    $rootScope.hide_content_sidebar = false;
                }

                var params = $transition.params();
                if (!params.hasOwnProperty("hidePreloader")) {
                    $rootScope.pageLoading = true;
                    $rootScope.pageLoaded = false;
                }
                currentMenu = JSON.parse(sessionStorage.getItem("menuData"));

                if (currentMenu !== null) {
                    $rootScope.$broadcast("loadSubTab", currentMenu, currentMenu.id);
                }
            });
            $transitions.onSuccess({}, function ($transition) {
                // scroll view to top
                $("html, body").animate(
                    {
                        scrollTop: 0,
                    },
                    200
                );

                if (detectIE()) {
                    $("svg,canvas,video").each(function () {
                        $(this).css("height", 0);
                    });
                }

                $timeout(function () {
                    $rootScope.pageLoading = false;
                }, 300);

                $rootScope.pageLoaded = true;
                $rootScope.appInitialized = true;
                // wave effects
                $window.Waves.attach(".md-btn-wave,.md-fab-wave", ["waves-button"]);
                $window.Waves.attach(".md-btn-wave-light,.md-fab-wave-light", ["waves-button", "waves-light"]);
                if (detectIE()) {
                    $("svg,canvas,video").each(function () {
                        var $this = $(this),
                            height = $(this).attr("height"),
                            width = $(this).attr("width");

                        if (height) {
                            $this.css("height", height);
                        }
                        if (width) {
                            $this.css("width", width);
                        }
                        var peity = $this.prev(".peity_data,.peity");
                        if (peity.length) {
                            peity.peity().change();
                        }
                    });
                }
                currentMenu = JSON.parse(sessionStorage.getItem("menuData"));
                if (currentMenu !== null) {
                    $rootScope.$broadcast("loadSubTab", currentMenu, currentMenu.id);
                }

                mainService.withdata('post','/api/nms/activity-log/event',{"current":$state.current.name}).then(function (data) {});
            });



            // fastclick (eliminate the 300ms delay between a physical tap and the firing of a click event on mobile browsers)
            FastClick.attach(document.body);

            // get version from package.json
            $http.get("./package.json").then(function onSuccess(response) {
                $rootScope.appVer = response.version;
            });

            // modernizr
            $rootScope.Modernizr = Modernizr;

            // get window width
            var w = angular.element($window);
            $rootScope.largeScreen = w.width() >= 1220;

            w.on("resize", function () {
                $rootScope.largeScreen = w.width() >= 1220;
                if ($rootScope.largeScreen) $rootScope.miniSidebarActive = true;
                return $rootScope.largeScreen;
            });
            if ($rootScope.largeScreen) $rootScope.miniSidebarActive = true;

            // show/hide main menu on page load
            $rootScope.primarySidebarOpen = $rootScope.largeScreen;

            $rootScope.pageLoading = true;

            // wave effects
            $window.Waves.init();
        },
    ])
    .run([
        "PrintToConsole",
        function (PrintToConsole) {
            PrintToConsole.active = false;
        },
    ]);
