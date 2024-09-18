angular.module("altairApp").controller("loginCtrl", [
    "$scope",
    "$rootScope",
    "authProvider",
    "$http",
    "$location",
    "$state",
    "utils",
    "loginService",
    "mainService",
    "__env",
    "images",
    function ($scope, $rootScope, authProvider, $http, $location, $state, utils, loginService, mainService, __env, images) {
        $scope.images = images;
        //   $rootScope.loginBack=loginBack;
        $scope.user = null;
        $scope.guides = [];
        var $formValidate = $("#form_validation");

        setTimeout(
            function () {
                $("body").attr("style", "padding-top: 0px!important");
            },
            [200]
        );
        $formValidate
            .parsley()
            .on("form:validated", function () {
                $scope.$apply();
            })
            .on("field:validated", function (parsleyField) {
                $scope.$apply();
                if ($(parsleyField.$element).hasClass("md-input")) {
                    $scope.$apply();
                }
            });

        var $formSignUp = $("#form_sign_up");
        $formSignUp
            .parsley()
            .on("form:validated", function () {
                $scope.$apply();
            })
            .on("field:validated", function (parsleyField) {
                if ($(parsleyField.$element).hasClass("md-input")) {
                    $scope.$apply();
                }
            });

        var $respassword = $("#reset_password");

        $respassword
            .parsley()
            .on("form:validated", function () {
                $scope.$apply();
            })
            .on("field:validated", function (parsleyField) {
                if ($(parsleyField.$element).hasClass("md-input")) {
                    $scope.$apply();
                }
            });

        $scope.registerFormActive = false;

        var $login_card = $("#login_card"),
            $login_form = $("#login_form"),
            $login_help = $("#login_help"),
            $register_form = $("#register_form"),
            $login_password_reset = $("#login_password_reset");

        // show login form (hide other forms)
        var login_form_show = function () {
            $login_form.show().siblings().hide();
        };

        // show register form (hide other forms)
        var register_form_show = function () {
            $register_form.show().siblings().hide();
        };

        // show login help (hide other forms)
        var login_help_show = function () {
            $login_help.show().siblings().hide();
        };

        // show password reset form (hide other forms)
        var password_reset_show = function () {
            $login_password_reset.show().siblings().hide();
        };

        $scope.loginHelp = function ($event) {
            $event.preventDefault();
            utils.card_show_hide($login_card, undefined, login_help_show, undefined);
        };

        $scope.backToLogin = function ($event) {
            $event.preventDefault();
            $scope.registerFormActive = false;
            utils.card_show_hide($login_card, undefined, login_form_show, undefined);
        };

        $scope.registerForm = function ($event) {
            $event.preventDefault();
            $scope.registerFormActive = true;
            utils.card_show_hide($login_card, undefined, register_form_show, undefined);
        };

        $scope.passwordReset = function ($event) {
            $event.preventDefault();
            utils.card_show_hide($login_card, undefined, password_reset_show, undefined);
        };

        $scope.credentials = {};

        if (sessionStorage.getItem("currentUser")) {
            var loggedUser = JSON.parse(sessionStorage.getItem("currentUser"));
            var currentDate = new Date(new Date().getTime());
            var pickUpDate = new Date(loggedUser.expires);
            if (currentDate > pickUpDate) {
                $rootScope.expire = true;
                let tmp = sessionStorage.getItem("fcm_token");
                sessionStorage.clear();
                if (tmp !== null) {
                    sessionStorage.setItem("fcm_token", tmp);
                }
                $state.go("login");
            } else {
                $state.go("restricted.mfa.1000");
            }
        }

        let tmp = window.sessionStorage.getItem("fcm_token");
        window.sessionStorage.clear();
        if (tmp !== null) {
            window.sessionStorage.setItem("fcm_token", tmp);
        }

        $scope.guides = [];
        $scope.budgetType = "";
        $scope.budgetCode = "";
        $scope.planYr = "";
        $scope.planYrs = [2022, 2023];

        mainService.withdomain("get", __env.apiUrl() + "/api/lang/all").then(function (data) {
            sessionStorage.setItem("lang", JSON.stringify(data));
        });

        $scope.loginFacebook = function () {
            window.location.href = "/oauth2/authorize/facebook?redirect_uri=" + encodeURIComponent("http://localhost:8081/#/login/handler");
        };

        $scope.loginGoogle = function () {
            window.location.href = "/oauth2/authorize/google?redirect_uri=" + encodeURIComponent("http://localhost:8081/#/login/handler");
        };

        $scope.loginGithub = function () {
            window.location.href = "/oauth2/authorize/github?redirect_uri=" + encodeURIComponent("http://localhost:8081/#/login/handler");
        };

        $scope.loginItc = function () {
            window.location.href =
                "https://st.auth.itc.gov.mn/auth/realms/Staging/protocol/openid-connect/auth?state=123&response_type=code&client_id=pimis&redirect_uri=" +
                encodeURIComponent("http://localhost:8000/#/login/handler");
        };

        $scope.login = function () {
            $scope.isLoading = true;
            var currentTime = new Date();
            var year = currentTime.getFullYear();
            if ($scope.credentials.username && $scope.credentials.password) {
                loginService.doLogin($scope.credentials.username, $scope.credentials.password);
                sessionStorage.setItem("planYr", year);
            }
        };

        $scope.$on("loggedIn", function (event, data) {
            $scope.loginData = data;
            sessionStorage.setItem("currentUser", JSON.stringify({user: $scope.loginData.user}));
            if (
                $scope.loginData.user.userType &&
                ($scope.loginData.user.userType.comCd === "sysAdmin" ||
                    $scope.loginData.user.userType.comCd === "orgAdmin" ||
                    $scope.loginData.user.userType.comCd === "provinceAdmin" ||
                    $scope.loginData.user.userType.comCd === "supervisorAdmin" ||
                    $scope.loginData.user.userType.comCd === "supervisor" ||
                    $scope.loginData.user.userType.comCd === "executor")
            ) {
                $scope.gotoMain();
            } else {
                $scope.gotoMain();
                /*  $("#login_inner").css("display", "none");
                  $("#modules").css("display", "block");
                  mainService.withdomain("get", __env.apiUrl() + "/api/nms/middle/resource/sourceTypes").then(function (data) {
                      $scope.budgetTypes = data;
                  });*/
            }

            mainService.withdata('post','/api/nms/activity-log/trace',{"event":"login","description":"Системд нэвтэрсэн"}).then(function (data) {});
        });
        $scope.broadcastBanner = function () {
            mainService
                .withdata(
                    "POST",
                    __env.apiUrl() + "/api/nms/splash/list",
                    JSON.stringify({
                        take: 1,
                        skip: 0,
                        page: 1,
                        pageSize: 1,
                        filter: {
                            logic: "and",
                            filters: [
                                {
                                    field: "useYn",
                                    operator: "eq",
                                    value: 1,
                                },
                                {
                                    field: "bannerType",
                                    operator: "eq",
                                    value: "05",
                                },
                                {
                                    field: "lvlId",
                                    operator: "eq",
                                    value: $scope.loginData?.user?.lvlId,
                                },
                                /*{
                                    field: "typeIds",
                                    operator: "contains",
                                    value: $scope.loginData?.user?.userType.id,
                                },*/
                            ],
                        },
                        sort: [{field: "updatedAt", dir: "asc"}],
                    })
                )
                .then(function (data) {
                    if (data.data.length > 0) {
                        $rootScope.$broadcast("bannerShow", {image: data.data[0].image.uri, link: data.data[0].url});
                    }
                });
        };
        $scope.gotoMain = function () {
            const menuList = JSON.parse(sessionStorage.getItem("menuList"));
            var actionStr = "";
            var menuByModule = menuList.filter((i) => i.modules.filter((j) => j.id == $scope.loginData?.user?.modules[0].id).length > 0);
            var tmp = "";

            if ($scope.loginData?.user?.level?.code === "001" || $scope.loginData?.user?.emailVerified === 1) {
                if (menuByModule.length > 0) {
                    var menuData = menuByModule[0];
                    sessionStorage.setItem("buttonData", "");
                    sessionStorage.setItem("menuData", JSON.stringify({}));
                    if (menuData.lutMenus.length > 0) {
                        sessionStorage.setItem(
                            "buttonData",
                            $scope.loginData.user.privileges.filter((i) => i.menuId == menuData.lutMenus[0].id || "")
                        );
                        sessionStorage.setItem("menuData", JSON.stringify(menuData.lutMenus[0]));
                        // $rootScope.$broadcast("loadSubTab", menuData.lutMenus[0], menuData.lutMenus[0].id);
                        tmp = menuData.lutMenus[0].url;
                    } else {
                        sessionStorage.setItem(
                            "buttonData",
                            $scope.loginData.user.privileges.filter((i) => i.menuId == menuData.id || "")
                        );
                        sessionStorage.setItem("menuData", JSON.stringify(menuData));
                        tmp = menuData.url;
                    }
                    $scope.broadcastBanner();
                    $state.go(tmp);
                } else {
                    $state.go("restricted.dashboard");
                }
            } else {
                $scope.broadcastBanner();
                $state.go("restricted.profile");
            }
        };

        $scope.getGuide = function () {
            sessionStorage.removeItem("guide");
            $scope.guides = [];
            var menuId = null;

            if (JSON.parse(sessionStorage.getItem("menuData")).parentId === null) menuId = JSON.parse(sessionStorage.getItem("menuData")).id;
            else menuId = JSON.parse(sessionStorage.getItem("menuData")).parentId;

            var filters = [];
            filters.push({
                field: "id",
                operator: "eq",
                value: menuId,
            });

            mainService
                .withdata("post", __env.apiUrl() + "/api/nms/menu/list", {
                    filter: {
                        logic: "and",
                        filters: filters,
                    },
                    sort: [{field: "id", dir: "asc"}],
                    page: 1,
                    pageSize: 20,
                    skip: 0,
                    take: 20,
                })
                .then(function (resp) {
                    if (resp.total > 0)
                        if (resp.data[0].videoUrl != null) {
                            $scope.guides.push({
                                title: "Видео заавар",
                                content: resp.data[0].videoUrl,
                                type: "video",
                                read: false,
                            });
                        }

                    if (resp.data[0].guideFileId != null) {
                        $scope.guides.push({
                            title: "Гарын авлага",
                            content: resp.data[0].guideFileId,
                            type: "document",
                            read: false,
                        });
                    }
                });
            sessionStorage.setItem("guide", JSON.stringify($scope.guides));
        };

        $scope.setBudgetType = function () {
            if ($scope.budgetType != "" && $scope.planYr != "") {
                sessionStorage.setItem("budgetType", $scope.budgetType);
                sessionStorage.setItem("budgetCode", $scope.budgetCode);
                sessionStorage.setItem("planYr", $scope.planYr);
                $scope.gotoMain();
            } else {
                UIkit.notify("Эх үүсвэр болон тайлант жилээ сонгоно уу", {status: "error", pos: "top-center"});
            }
        };
        $scope.setPlanYr = function (year) {
            $scope.planYr = year;
        };
        $scope.setBudget = function (budget) {
            $scope.budgetType = budget.id;
            $scope.budgetCode = budget.code;
        };

        $scope.showGuide = function (data) {
            console.log('login data ::: ' + data);
            if (data != null)
                window.open(data);
        };

        $rootScope.$on("logInFailed", function (event, data) {
            $scope.message = "Нэвтрэх нэр эсвэл нууц үг буруу байна.";
            if (data) {
                $scope.message = data;
            }
            $scope.error = true;
            $scope.expire = false;
            $scope.failedToLogin = true;
            $scope.loginError = data;
            $scope.isLoading = false;
        });

        $scope.isLoading = false;
        $scope.resetPassword = function (event) {
            $scope.isLoading = true;
            mainService.withResponse("put", __env.apiUrl() + "/api/auth/reset-password", $scope.res).then(function (data) {
                $scope.isLoading = false;
                if (data.status == 200) {
                    console.log(data);
                    UIkit.notify("Нууц үг " + data.data.msg + " руу илгээгдлээ.", {
                        status: "success",
                        pos: "top-center"
                    });
                    $scope.registerFormActive = false;
                    utils.card_show_hide($login_card, undefined, login_form_show, undefined);
                } else {
                    UIkit.notify("Имэйл хаяг бүртгэлгүй байна. Системийн админд хандана уу. Утас: 51-267207", {
                        status: "error",
                        pos: "top-center"
                    });
                    $scope.errorState = true;
                }
                $scope.showAlert = true;
            });
        };

        $scope.signUp = function () {
            $scope.register.role = ["user"];
            mainService.withResponse("post", __env.apiUrl() + "/api/auth/register", $scope.register).then(function (response) {
                if (response.status === 200) {
                    UIkit.notify("Амжилттай бүртгэлээ.", {status: "success", pos: "bottom-center"});
                    utils.card_show_hide($login_card, undefined, login_form_show, undefined);
                    $scope.registerFormActive = false;
                } else {
                    UIkit.notify("Бүртгэл давхцаж байна.", {status: "danger", pos: "bottom-center"});
                }
            });
        };
        $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
            if (handler.active) {
                console.log("$stateChangeError --- event, toState, toParams, fromState, fromParams, error");
                console.log(arguments);
                $state.go("restricted.404");
            }
        });
    },
]);