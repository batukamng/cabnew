altairApp.config([
    "$stateProvider",
    "$urlRouterProvider",
    "$locationProvider",
    "$httpProvider",
    function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
        $httpProvider.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
        //  $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix("");

        $urlRouterProvider.when("/dashboard", "/").otherwise("/login");
        // $urlRouterProvider.otherwise(function ($injector) {
        //   $injector.invoke(function ($state) {
        //     $state.transitionTo("restricted.404", {}, false);
        //   });
        // });
        $stateProvider
            // -- ERROR PAGES --
            .state("error", {
                url: "/error",
                templateUrl: "app/views/error.html",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["lazy_uikit"]);
                        },
                    ],
                },
            })
            .state("error.500", {
                url: "/500",
                templateUrl: "app/components/pages/error_500View.html",
            })

            // -- LOGIN PAGE --
            .state("login", {
                url: "/login",
                templateUrl: "app/eccmcps/pages/login/loginView.html",
                controller: "loginCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["lazy_uikit", "lazy_iCheck", "lazy_parsleyjs", "app/eccmcps/pages/login/loginController.js"]);
                        },
                    ],
                    images: function ($http, $stateParams, __env) {
                        return $http({
                            method: "POST",
                            url: __env.apiUrl() + "/api/nms/splash/list",
                            data: {
                                sort: [
                                    {
                                        field: "id",
                                        dir: "desc",
                                    },
                                ],
                                take: 20,
                                skip: 0,
                                page: 1,
                                pageSize: 20,
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
                                            value: "02",
                                        },
                                    ],
                                },
                            },
                        }).then(function (res) {
                            return res.data.data;
                        });
                    },
                },
            })
            .state("loginHandler", {
                url: "/login/handler",
                templateUrl: "app/eccmcps/pages/login/loginHandlerView.html",
                controller: "loginHandleCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["lazy_uikit", "lazy_iCheck", "lazy_parsleyjs", "app/eccmcps/pages/login/loginHandleController.js"]);
                        },
                    ],
                },
            })
            // -- RESTRICTED --
            .state("restricted", {
                abstract: true,
                url: "",
                templateUrl: "app/views/restricted.html",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                "lazy_uikit",
                                "lazy_selectizeJS",
                                "lazy_switchery",
                                "lazy_prismJS",
                                "lazy_parsleyjs",
                                "lazy_autosize",
                                "lazy_iCheck",
                                "lazy_themes",
                                "lazy_KendoUI",
                                "lazy_dropify",
                                "assets/js/custom/uikit_fileinput.min.js",
                                "lazy_idle_timeout",
                            ]);
                        },
                    ],
                },
            })
        /*    .state("restricted.dashboard", {
                url: "/dashboard",
                template: '<div ui-view autoscroll="false"/>',
                abstract: true,
            })*/
            .state("restricted.profile", {
                url: "/profile",
                templateUrl: "app/profile/profileView.html",
                controller: "profilenCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/profile/profileController.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Хэрэглэгчийн бүртгэл",
                },
                ncyBreadcrumb: {
                    label: "Хэрэглэгчийн бүртгэл",
                },
            })
            .state("restricted.feedback", {
                url: "/feedback",
                templateUrl: "app/profile/feedbackView.html",
                controller: "feedback",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/profile/feedbackController.js", "lazy_sweet"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Санал хүсэлт",
                },
                ncyBreadcrumb: {
                    label: "Санал хүсэлт",
                },
            })
            .state("restricted.notification", {
                url: "/notification",
                templateUrl: "app/profile/notificationView.html",
                controller: "notificationCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/profile/notificationController.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Мэдэгдэл",
                },
                ncyBreadcrumb: {
                    label: "Мэдэгдэл",
                },
            })
            .state("restricted.profileVerify", {
                url: "/profileVerify",
                templateUrl: "app/profile/profileVerifyView.html",
                controller: "profileVerifyCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/profile/profileVerifyController.js", "lazy_sweet"]);
                        },
                    ],
                    step1: function ($http, $stateParams, __env) {
                        console.log("stateParams", $stateParams);
                        return $stateParams.step1;
                    },
                },
                data: {
                    pageTitle: "Хэрэглэгчийн бүртгэл баталгаажуулах",
                },
                ncyBreadcrumb: {
                    label: "Хэрэглэгчийн бүртгэл баталгаажуулах",
                },
            })

            // -- Аж ахуйн нэгж --
            .state("restricted.com", {
                url: "",
                template: '<div ui-view autoscroll="false"/>',
                abstract: true,
            })
            .state("restricted.com.1003", {
                url: "/com/1003",
                templateUrl: "app/company/com1003View.html",
                controller: "com1003Ctrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["lazy_Pdf", "app/company/com1003Controller.js"]);
                        },
                    ],
                    helpLink: function ($http, __env) {
                        return $http({
                            method: "GET",
                            url: __env.apiUrl() + "/api/config/comCd/helpLink",
                        }).then(function (data) {
                            return data.data;
                        });
                    },
                },
                data: {
                    pageTitle: "Тусламж",
                },
                ncyBreadcrumb: {
                    label: "Тусламж",
                },
            })

            // -- Admin --
            .state("restricted.scr", {
                url: "/admin",
                template: '<div ui-view autoscroll="false"/>',
                abstract: true,
            })
            .state("restricted.scr.1029", {
                url: "/1029/list",
                templateUrl: "app/admin/1029View.html",
                controller: "1029Ctrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/admin/1029Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Нийтлэг кодын удирдлага",
                },
                ncyBreadcrumb: {
                    label: '{{"Sys02" | translate}}',
                },
            })
            .state("restricted.scr.1030", {
                url: "/1030/list",
                templateUrl: "app/admin/1030View.html",
                controller: "1030Ctrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/admin/1030Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Системийн лог",
                },
                ncyBreadcrumb: {
                    label: '{{"Sys12" | translate}}',
                },
            })
            .state("restricted.scr.1031", {
                url: "/1031/list",
                templateUrl: "app/admin/1031View.html",
                controller: "1031Ctrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["lazy_dropify", "app/admin/1031Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Файлын удирдлага",
                },
                ncyBreadcrumb: {
                    label: '{{"Sys13" | translate}}',
                },
            })
            .state("restricted.scr.1033", {
                url: "/1033/list",
                templateUrl: "app/nimis/admin/1033View.html",
                controller: "1033Ctrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/nimis/admin/1033Controller.js"]);
                        },
                    ],
                    categories: function ($http, $stateParams, __env) {
                        return $http({
                            method: "GET",
                            url: __env.apiUrl() + "/api/tel/category/list/all",
                        }).then(function (data) {
                            return data.data;
                        });
                    },
                },
                data: {
                    pageTitle: "Байгууллагын удирдлага",
                },
                ncyBreadcrumb: {
                    label: '{{"Sys16" | translate}}',
                },
            })
            .state("restricted.scr.1038", {
                url: "/1038/list",
                templateUrl: "app/admin/1038View.html",
                controller: "1038Ctrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/admin/1038Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Хэлний удирдлага",
                },
                ncyBreadcrumb: {
                    label: '{{"Sys07" | translate}}',
                },
            })

            // -- Аж ахуйн нэгж --
            .state("restricted.nms", {
                url: "",
                template: '<div ui-view autoscroll="false"/>',
                abstract: true
            })
            .state("restricted.nms.900", {
                url: "/admin/900",
                templateUrl: "app/nimis/admin/900View.html",
                controller: "900NmsCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/nimis/admin/900Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Үйлдлүүд",
                },
                ncyBreadcrumb: {
                    label: "Үйлдлүүд",
                },
            })
            .state("restricted.nms.919", {
                url: "/admin/919",
                templateUrl: "app/audit/admin/919View.html",
                controller: "919NmsCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/audit/admin/919Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Хүснэгтийн тохиргоо",
                },
                ncyBreadcrumb: {
                    label: "Хүснэгтийн тохиргоо",
                },
            })
            .state("restricted.nms.921", {
                url: "/nimis/921/:id/:from",
                templateUrl: "app/nimis/admin/921View.html",
                controller: "921NmsCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/nimis/admin/921Controller.js"]);
                        },
                    ],
                    fromData: function ($http, $stateParams, __env) {
                        return $stateParams.from;
                    },
                    userItem: function ($http, $stateParams, __env) {
                        if ($stateParams.id == 0) {
                            return {};
                        }
                        return $http({
                            method: "GET",
                            url: __env.apiUrl() + "/api/nms/user/" + $stateParams.id,
                        }).then(function (data) {
                            if (data.data.orgId) {
                                try {
                                    data.data.orgId = parseInt(data.data.orgId);
                                } catch (e) {
                                }
                            }
                            return data.data;
                        });
                    },
                    levels: function ($http, $stateParams, __env) {
                        return $http({
                            method: "GET",
                            url: __env.apiUrl() + "/api/nms/user/level/sub/" + JSON.parse(localStorage.getItem("currentUser")).user.lvlId,
                        }).then(function (data) {
                            return data.data;
                        });
                    },
                    userTypes: function ($http, $stateParams, __env) {
                        return $http({
                            method: "POST",
                            url: __env.apiUrl() + "/api/nms/common/list",
                            data: {
                                filter: {
                                    logic: "and",
                                    filters: [
                                        {
                                            field: "grpCd",
                                            operator: "eq",
                                            value: "userType",
                                        },
                                        {
                                            field: "parentId",
                                            operator: "isNull",
                                            value: false,
                                        },
                                    ],
                                },
                                sort: [{field: "comCdNm", dir: "asc"}],
                                take: 60,
                                skip: 0,
                                page: 1,
                                pageSize: 60,
                            },
                        }).then(function (data) {
                            return data.data;
                        });
                    },
                    tezList: function ($http, $stateParams, __env) {
                        return $http({
                            method: "GET",
                            url: __env.apiUrl() + "/api/nms/middle/resource/governors",
                        }).then(function (data) {
                            return data.data;
                        });
                    },
                    amgList: function ($http, $stateParams, __env) {
                        return $http({
                            method: "GET",
                            url: __env.apiUrl() + "/api/nms/middle/resource/provinces",
                        }).then(function (data) {
                            return data.data;
                        });
                    },
                    orgList: function ($http, $stateParams, __env) {
                        return $http({
                            method: "GET",
                            url: __env.apiUrl() + "/api/nms/middle/resource/organizations",
                        }).then(function (data) {
                            return data.data;
                        });
                    },
                    allRightTezList: function ($http, $stateParams, __env) {
                        return $http({
                            method: "POST",
                            url: __env.apiUrl() + "/api/nms/general/governor/list",
                            data: {
                                filter: {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1}]},
                                take: 200,
                                page: 1,
                                pageSize: 200,
                                skip: 0,
                            }
                        }).then(function (resp) {
                            return resp.data.data;
                        });
                    },
                    allRightAmgList: function ($http, $stateParams, __env) {
                        return $http({
                            method: "POST",
                            url: __env.apiUrl() + "/api/nms/as/code/list",
                            data: {
                                filter: {
                                    logic: "and", filters: [
                                        {field: "useYn", operator: "eq", value: 1},
                                        {field: "parentId", operator: "isnull", value: true}
                                    ]
                                },
                                take: 200,
                                page: 1,
                                pageSize: 200,
                                skip: 0,
                            }
                        }).then(function (resp) {
                            return resp.data.data;
                        });
                    },
                },
                data: {
                    pageTitle: "Хэрэглэгчийн бүртгэл",
                },
                ncyBreadcrumb: {
                    label: "Хэрэглэгчийн бүртгэл",
                },
            })
            .state("restricted.nms.common", {
                url: "/nimis/common",
                template: '<div ui-view autoscroll="false"/>',
                abstract: false,
                data: {
                    pageTitle: "Лавлах сан",
                },
                ncyBreadcrumb: {
                    label: "Лавлах сан",
                },
            })
            .state("restricted.nms.common.926", {
                url: "/926",
                templateUrl: "app/nimis/common/926View.html",
                controller: "926NmsCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/nimis/common/926Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Эх үүсвэрийн төрөл",
                },
                ncyBreadcrumb: {
                    label: "Эх үүсвэрийн төрөл",
                },
            })
            .state("restricted.nms.common.929", {
                url: "/929",
                templateUrl: "app/nimis/common/929View.html",
                controller: "929NmsCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/nimis/common/929Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Засаг захиргааны нэгж",
                },
                ncyBreadcrumb: {
                    label: "Засаг захиргааны нэгж",
                },
            })
            .state("restricted.nms.common.932", {
                url: "/932",
                templateUrl: "app/nimis/common/932View.html",
                controller: "932NmsCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/nimis/common/932Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Баннер",
                },
                ncyBreadcrumb: {
                    label: "Баннер",
                },
            })
            .state("restricted.nms.930", {
                url: "/admin/930",
                templateUrl: "app/nimis/admin/930View.html",
                controller: "930NmsCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/nimis/admin/930Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Үйлдлүүд",
                },
                ncyBreadcrumb: {
                    label: "Үйлдлүүд",
                },
            })
            .state("restricted.nms.932", {
                url: "/admin/932",
                templateUrl: "app/nimis/admin/932View.html",
                controller: "932NmsCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/nimis/admin/932Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Компонент",
                },
                ncyBreadcrumb: {
                    label: "Компонент",
                },
            })
            .state("restricted.nms.933", {
                url: "/admin/933",
                templateUrl: "app/nimis/admin/933View.html",
                controller: "933NmsCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/nimis/admin/933Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Айкон",
                },
                ncyBreadcrumb: {
                    label: "Айкон",
                },
            })
            .state("restricted.nms.934", {
                url: "/admin/934",
                templateUrl: "app/nimis/admin/934View.html",
                controller: "934NmsCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/nimis/admin/934Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Программын удирдлага",
                },
                ncyBreadcrumb: {
                    label: "Программын удирдлага",
                },
            })
            .state("restricted.nms.935", {
                url: "/admin/935",
                templateUrl: "app/nimis/admin/935View.html",
                controller: "935NmsCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/nimis/admin/935Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Нийтлэг код",
                },
                ncyBreadcrumb: {
                    label: "Нийтлэг код",
                },
            })
            .state("restricted.nms.936", {
                url: "/admin/936",
                templateUrl: "app/nimis/admin/936View.html",
                controller: "936NmsCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/nimis/admin/936Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Цэсний удирдлага",
                },
                ncyBreadcrumb: {
                    label: "Цэсний удирдлага",
                },
            })
            .state("restricted.nms.937", {
                url: "/admin/937",
                templateUrl: "app/nimis/admin/937View.html",
                controller: "937NmsCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/nimis/admin/937Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Хэрэглэгчийн эрх",
                },
                ncyBreadcrumb: {
                    label: "Хэрэглэгчийн эрх",
                },
            })
            .state("restricted.nms.938", {
                url: "/admin/938",
                templateUrl: "app/nimis/admin/938View.html",
                controller: "938NmsCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/nimis/admin/938Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Дэд систем",
                },
                ncyBreadcrumb: {
                    label: "Дэд систем",
                },
            })
            .state("restricted.nms.939", {
                url: "/admin/939",
                templateUrl: "app/nimis/admin/939View.html",
                controller: "939NmsCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/nimis/admin/939Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Хэрэглэгчийн түвшин",
                },
                ncyBreadcrumb: {
                    label: "Хэрэглэгчийн түвшин",
                },
            })
            .state("restricted.nms.940", {
                url: "/admin/940/:id",
                templateUrl: "app/nimis/admin/940View.html",
                controller: "940NmsCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/nimis/admin/940Controller.js"]);
                        },
                    ],
                    item: function ($http, $stateParams, __env) {
                        return $http({
                            method: "GET",
                            url: __env.apiUrl() + "/api/nms/role/item/" + $stateParams.id,
                        }).then(function (data) {
                            return data.data;
                        });
                    },
                    menus: function ($http, $stateParams, __env) {
                        return $http({
                            method: "GET",
                            url: __env.apiUrl() + "/api/nms/menu/items",
                        }).then(function (data) {
                            return data.data;
                        });
                    },
                },
                data: {
                    pageTitle: "Хэрэглэгчийн эрхийн бүртгэл",
                },
                ncyBreadcrumb: {
                    label: "Хэрэглэгчийн эрхийн бүртгэл",
                },
            })
            .state("restricted.nms.946", {
                url: "/admin/946/:id",
                templateUrl: "app/nimis/admin/946View.html",
                controller: "946NmsCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/nimis/admin/946Controller.js"]);
                        },
                    ],
                    item: function ($http, $stateParams, __env) {
                        if ($stateParams.id != 0)
                            return $http({
                                method: "GET",
                                url: __env.apiUrl() + "/api/nms/user/level/" + $stateParams.id,
                            }).then(function (data) {
                                return data.data;
                            });
                        else return null;
                    },
                    userTypes: function ($http, $stateParams, __env) {
                        return $http({
                            method: "GET",
                            url: __env.apiUrl() + "/api/nms/common/grp/userType",
                        }).then(function (data) {
                            return data.data;
                        });
                    },
                    userRequiredType: function ($http, $stateParams, __env) {
                        return $http({
                            method: "GET",
                            url: __env.apiUrl() + "/api/nms/common/grp/userRequiredType",
                        }).then(function (data) {
                            return data.data;
                        });
                    },
                    levelList: function ($http, $stateParams, __env) {
                        return $http({
                            method: "GET",
                            url: __env.apiUrl() + "/api/nms/common/grp/userRequiredType",
                        }).then(function (data) {
                            return data.data;
                        });
                    },
                    roles: function ($http, $stateParams, __env) {
                        return $http({
                            method: "POST",
                            url: __env.apiUrl() + "/api/nms/role/list",
                            data: {
                                filter: {
                                    logic: "and",
                                    filters: [{field: "useYn", operator: "eq", value: 1}],
                                },
                                sort: [{field: "name", dir: "asc"}],
                                take: 30,
                                skip: 0,
                                page: 1,
                                pageSize: 30,
                            },
                        }).then(function (data) {
                            return data.data;
                        });
                    },
                },
                data: {
                    pageTitle: "Хэрэглэгчийн түвшин бүртгэх",
                },
                ncyBreadcrumb: {
                    label: "Хэрэглэгчийн түвшин бүртгэх",
                },
            })
            .state("restricted.nms.950", {
                url: "/admin/950",
                templateUrl: "app/nimis/admin/950View.html",
                controller: "950NmsCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/nimis/admin/950Controller.js"]);
                        },
                    ],
                    levels: function ($http, $stateParams, __env) {
                        return $http({
                            method: "GET",
                            url: __env.apiUrl() + "/api/nms/user/level/list/all",
                        }).then(function (data) {
                            return data.data;
                        });
                    },
                    userTypes: function ($http, $stateParams, __env) {
                        return $http({
                            method: "GET",
                            url: __env.apiUrl() + "/api/nms/common/grp/userType",
                        }).then(function (data) {
                            return data.data;
                        });
                    },
                    controlTypes: function ($http, $stateParams, __env) {
                        return $http({
                            method: "GET",
                            url: __env.apiUrl() + "/api/nms/common/grp/controlTypes",
                        }).then(function (data) {
                            return data.data;
                        });
                    },
                    roleTypes: function ($http, $stateParams, __env) {
                        return $http({
                            method: "GET",
                            url: __env.apiUrl() + "/api/nms/role/list/all",
                        }).then(function (data) {
                            return data.data;
                        });
                    },
                },
                data: {
                    pageTitle: "Түвшний тохиргоо",
                },
                ncyBreadcrumb: {
                    label: "Түвшний тохиргоо",
                    parent: "restricted.nms",
                },
            })
            .state("restricted.nms.920", {
                url: "/admin/920",
                templateUrl: "app/nimis/admin/920View.html",
                controller: "920NmsCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/nimis/components/userEditController.js","app/nimis/admin/920Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Хэрэглэгч",
                },
                ncyBreadcrumb: {
                    label: "Хэрэглэгч",
                },
            })

            .state("restricted.nms.951", {
                url: "/admin/951",
                templateUrl: "app/nimis/admin/951View.html",
                controller: "951NmsCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/nimis/admin/951Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Лог удирдлага",
                },
                ncyBreadcrumb: {
                    label: "Лог удирдлага",
                },
            })

            .state("restricted.nms.channel", {
                url: "/admin/911",
                templateUrl: "app/nimis/admin/911View.html",
                controller: "911AdminCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/nimis/admin/911Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Суваг",
                },
                ncyBreadcrumb: {
                    label: "Суваг",
                },
            })
            .state("restricted.nms.notification", {
                url: "/admin/912",
                templateUrl: "app/nimis/admin/912View.html",
                controller: "912AdminCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/nimis/admin/912Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Мэдэгдэл",
                },
                ncyBreadcrumb: {
                    label: "Мэдэгдэл",
                },
            })





            .state("restricted.nms.org", {
                url: "/admin",
                template: '<div ui-view autoscroll="false"/>',
                abstract: false,
                data: {
                    pageTitle: "Байгууллага",
                },
                ncyBreadcrumb: {
                    label: "Байгууллага",
                },
            })
            .state("restricted.nms.org.914", {
                url: "/914",
                templateUrl: "app/audit/914View.html",
                controller: "914NmsCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/audit/914Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Төсвийн ерөнхийлөн захирагч",
                },
                ncyBreadcrumb: {
                    parent:"restricted.nms.org",
                    label: "Төсвийн ерөнхийлөн захирагч",
                },
            })
            .state("restricted.nms.org.915", {
                url: "/915",
                templateUrl: "app/audit/915View.html",
                controller: "915NmsCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/audit/915Controller.js"]);
                        },
                    ],
                    governors: function ($http, $stateParams, __env) {
                        return $http({
                            method: "GET",
                            url: __env.apiUrl() + "/api/nms/resource/governor/list",
                        }).then(function (data) {
                            return data.data;
                        });
                    },
                },
                data: {
                    pageTitle: "Төсвийн төвлөрүүлэн захирагч",
                },
                ncyBreadcrumb: {
                    parent:"restricted.nms.org",
                    label: "Төсвийн төвлөрүүлэн захирагч",
                },
            })
            .state("restricted.nms.org.916", {
                url: "/916",
                templateUrl: "app/audit/916View.html",
                controller: "916NmsCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/audit/916Controller.js"]);
                        },
                    ],
                },
                data: {
                    parent:"restricted.nms.org",
                    pageTitle: "Аудитын байгууллага",
                },
                ncyBreadcrumb: {
                    label: "Аудитын байгууллага",
                },
            })
            .state("restricted.nms.org.917", {
                url: "/917",
                templateUrl: "app/audit/917View.html",
                controller: "917NmsCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/audit/917Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Үйлчлүүлэгч байгууллага",
                },
                ncyBreadcrumb: {
                    parent:"restricted.nms.org",
                    label: "Үйлчлүүлэгч байгууллага",
                },
            })

            .state("restricted.404", {
                url: "/404",
                templateUrl: "app/nimis/404View.html",
                controller: "404Ctrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/nimis/404Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "404",
                },
                ncyBreadcrumb: {
                    label: "404",
                },
            })

            .state("restricted.tel", {
                url: "/admin",
                template: '<div ui-view autoscroll="false"/>',
                abstract: true
            })
            .state("restricted.tel.faq", {
                url: "/1001",
                templateUrl: "app/nimis/telemedicine/1001View.html",
                controller: "1001TelCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/nimis/telemedicine/1001Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Асуулт, хариулт",
                },
                ncyBreadcrumb: {
                    label: "Асуулт, хариулт",
                },
            })
            .state("restricted.tel.banner", {
                url: "/919",
                templateUrl: "app/nimis/admin/919View.html",
                controller: "919AdminCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/nimis/admin/919Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Баннер",
                },
                ncyBreadcrumb: {
                    label: "Баннер",
                },
            })
            .state("restricted.tel.channel", {
                url: "/911",
                templateUrl: "app/nimis/admin/911View.html",
                controller: "911AdminCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/nimis/admin/911Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Суваг",
                },
                ncyBreadcrumb: {
                    label: "Суваг",
                },
            })
            .state("restricted.tel.notification", {
                url: "/912",
                templateUrl: "app/nimis/admin/912View.html",
                controller: "912AdminCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/nimis/admin/912Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Мэдэгдэл",
                },
                ncyBreadcrumb: {
                    label: "Мэдэгдэл",
                },
            })
            .state("restricted.tel.organization", {
                url: "/1000",
                templateUrl: "app/nimis/telemedicine/1000View.html",
                controller: "1000TelCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/nimis/telemedicine/1000Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Байгууллага",
                },
                ncyBreadcrumb: {
                    label: "Байгууллага",
                },
            })


            .state("restricted.tez", {
                url: "/gov",
                template: '<div ui-view autoscroll="false"/>',
                abstract: true
            })
            .state("restricted.tez.rate", {
                url: "/attitude",
                templateUrl: "app/cabinet/governor/attitude/View.html",
                controller: "attitudeCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/governor/attitude/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Үнэлгээ өгөх",
                },
                ncyBreadcrumb: {
                    label: "Үнэлгээ өгөх",
                },
            })
            .state("restricted.tez.complain", {
                url: "/complain",
                templateUrl: "app/cabinet/governor/complain/View.html",
                controller: "complainCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/governor/complain/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Үнэлгээний гомдол",
                },
                ncyBreadcrumb: {
                    label: "Үнэлгээний гомдол",
                },
            })


            /*                Cabinet project states      */

            .state("restricted.cabinet", {
                url: "/cab",
                template: '<div ui-view autoscroll="false"/>',
                abstract: true
            })

            .state("restricted.dashboard", {
                url: "/",
                templateUrl: "app/cabinet/dashboard/View.html",
                controller: "dashboardCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["lazy_chart","app/cabinet/dashboard/Controller.js"]);
                        },
                    ],
                    mainItem: function ($http, $stateParams, $state, __env) {
                        var userData = JSON.parse(localStorage.getItem("currentUser")).user;
                        var planYr = JSON.parse(localStorage.getItem("planYr"));

                        if(userData.level.code==='001'){
                            return $http({
                                method: "POST",
                                url: __env.apiUrl() + "/api/admin/v1/item/admin-pivot",
                                data:{"planYr":planYr,"orgId":0}
                            }).then(function (data) {
                                localStorage["fromData"] = JSON.stringify({"mode": "mof", data: data.data[0]});
                                return data.data;
                            });
                        }
                        else{
                            return $http({
                                method: "POST",
                                url: __env.apiUrl() + "/api/admin/v1/item/org-dashboard",
                                data:{"planYr":planYr,"orgId":userData.orgId}
                            }).then(function (data) {
                                console.log(data.data.userCnt);
                                localStorage["fromData"] = JSON.stringify({"mode": "amg", data: data.data[0]});
                                return data.data;
                            });
                        }
                    },
                    reportItem: function ($http, $stateParams, $state, __env) {
                        var userData = JSON.parse(localStorage.getItem("currentUser")).user;
                        var planYr = JSON.parse(localStorage.getItem("planYr"));

                        if(userData.level.code==='001'){
                            return $http({
                                method: "POST",
                                url: __env.apiUrl() + "/api/admin/v1/item/admin-pivot",
                                data:{"planYr":planYr,"orgId":0}
                            }).then(function (data) {
                                localStorage["fromData"] = JSON.stringify({"mode": "mof", data: data.data[0]});
                                return data.data;
                            });
                        }
                        else{
                            return $http({
                                method: "POST",
                                url: __env.apiUrl() + "/api/admin/v1/item/darga-dashboard",
                                data:{"planYr":planYr,"orgId":userData.orgId}
                            }).then(function (data) {
                                return data.data;
                            });
                        }
                    },
                },
                data: {
                    pageTitle: "Хянах самбар",
                },
                ncyBreadcrumb: {
                    label: "Хянах самбар",
                },
            })

            .state("restricted.cabinet.criteria", {
                url: "/criteria",
                templateUrl: "app/cabinet/commander/criteria/View.html",
                controller: "criteriaCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/commander/criteria/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Шалгуур үзүүлэлт",
                },
                ncyBreadcrumb: {
                    label: "Шалгуур үзүүлэлт",
                },
            })

            /*       Planning admin        */
            .state("restricted.cabinet.myrating", {
                url: "/myrating/user",
                templateUrl: "app/cabinet/myrating/View.html",
                controller: "myratingAdminCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/myrating/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Жагсаалт"
                },
                ncyBreadcrumb: {
                    label: "Жагсаалт"
                },
            })
            .state("restricted.cabinet.plan-item", {
                url: "/plan/item/:id/:userId",
                templateUrl: "app/cabinet/planning/edit/View.html",
                controller: "planViewCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/planning/edit/Controller.js"]);
                        },
                    ],
                    item: function ($http, $stateParams, __env) {
                        return $http({
                            method: "GET",
                            url: __env.apiUrl() + "/api/admin/v1/item/cab-plan-user/" + $stateParams.id+'/'+ $stateParams.userId,
                        }).then(function (data) {
                            return data.data;
                        });
                    },
                },
                data: {
                    pageTitle: "Төлөвлөгөө",
                },
                ncyBreadcrumb: {
                    label: "Төлөвлөгөө",
                },
            })
            .state("restricted.cabinet.plan-rate", {
                url: "/plan/rate/:id/:userId",
                templateUrl: "app/cabinet/planning/rate/View.html",
                controller: "planRateViewCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/planning/rate/Controller.js"]);
                        },
                    ],
                    item: function ($http, $stateParams, __env) {
                        return $http({
                            method: "GET",
                            url: __env.apiUrl() + "/api/admin/v1/item/cab-plan-user/" + $stateParams.id+'/'+ $stateParams.userId,
                        }).then(function (data) {
                            return data.data;
                        });
                    },
                },
                data: {
                    pageTitle: "Гүйцэтгэлийн үнэлгээний жагсаалт",
                },
                ncyBreadcrumb: {
                    label: "Гүйцэтгэлийн үнэлгээний жагсаалт",
                },
            })

            .state("restricted.cabinet.my-rate", {
                url: "/myrating/rate/:id/:userId",
                templateUrl: "app/cabinet/myrating/rate/View.html",
                controller: "myratingViewCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/myrating/rate/Controller.js"]);
                        },
                    ],
                    item: function ($http, $stateParams, __env) {
                        return $http({
                            method: "GET",
                            url: __env.apiUrl() + "/api/admin/v1/item/cab-plan-user/" + $stateParams.id+'/'+ $stateParams.userId,
                        }).then(function (data) {
                            return data.data;
                        });
                    },
                },
                data: {
                    pageTitle: "Гүйцэтгэлийн үнэлгээний жагсаалт",
                },
                ncyBreadcrumb: {
                    label: "Гүйцэтгэлийн үнэлгээний жагсаалт",
                },
            })

            .state("restricted.cabinet.plan-org", {
                url: "/plan/org",
                templateUrl: "app/cabinet/planTest/View.html",
                controller: "planTestCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/planTest/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Гүйцэтгэлийн төлөвлөгөө",
                },
                ncyBreadcrumb: {
                    label: "Гүйцэтгэлийн төлөвлөгөө",
                },
            })
            .state("restricted.cabinet.plan-org-edit", {
                url: "/plan/org/edit/:id",
                templateUrl: "app/cabinet/planTest/edit/View.html",
                controller: "planEditCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/planTest/edit/Controller.js"]);
                        },
                    ],
                    item: function ($http, $stateParams, __env) {
                        return $http({
                            method: "GET",
                            url: __env.apiUrl() + "/api/admin/v1/item/cab-plan/" + $stateParams.id,
                        }).then(function (data) {
                            return data.data;
                        });
                    },
                },
                data: {
                    pageTitle: "Байгууллагын төлөвлөгөө",
                },
                ncyBreadcrumb: {
                    label: "Байгууллагын төлөвлөгөө",
                },
            })
            .state("restricted.cabinet.plan-user", {
                url: "/plan/user",
                templateUrl: "app/cabinet/planning/View.html",
                controller: "planningAdminCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/planning/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Гүйцэтгэлийн төлөвлөгөө"
                },
                ncyBreadcrumb: {
                    label: "Гүйцэтгэлийн төлөвлөгөө"
                },
            })

            .state("restricted.cabinet.worker-plan", {
                url: "/emp-p",
                templateUrl: "app/cabinet/worker/plan/View.html",
                controller: "planWorkerCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/worker/plan/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Төлөвлөгөө",
                },
                ncyBreadcrumb: {
                    label: "Төлөвлөгөө",
                },
            })
            .state("restricted.cabinet.meeting", {
                url: "/emp-i",
                templateUrl: "app/cabinet/worker/plan-interview/View.html",
                controller: "interviewWorkerUserCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/worker/plan-interview/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Ярилцлага"
                },
                ncyBreadcrumb: {
                    label: "Ярилцлага"
                },
            })

            .state("restricted.cabinet.worker-plan-edit", {
                url: "/worker/plan/edit/:id/:userId",
                templateUrl: "app/cabinet/planWorker/edit/View.html",
                controller: "workerPlanEditCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/planWorker/edit/Controller.js"]);
                        },
                    ],
                    item: function ($http, $stateParams, __env) {
                        return $http({
                            method: "GET",
                            url: __env.apiUrl() + "/api/admin/v1/item/cab-plan-user/" + $stateParams.id+'/'+ $stateParams.userId,
                        }).then(function (data) {
                            return data.data;
                        });
                    },
                    objectives: function ($http, $stateParams, __env) {
                        return $http({
                            method: "GET",
                            url: __env.apiUrl() + "/api/admin/v1/item/cab-plan-user-obj/" + $stateParams.id+'/'+ $stateParams.userId,
                        }).then(function (data) {
                            return data.data;
                        });
                    },
                },
                data: {
                    pageTitle: "Төлөвлөгөө оруулах",
                },
                ncyBreadcrumb: {
                    label: "Төлөвлөгөө оруулах",
                },
            })
            .state("restricted.cabinet.worker-community-rating", {
                url: "/w/rate-c",
                templateUrl: "app/cabinet/worker/rate-community/View.html",
                controller: "rateCommunityCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/worker/rate-community/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Үнэлгээний хэсэг",
                },
                ncyBreadcrumb: {
                    label: "Үнэлгээний хэсэг",
                },
            })
            .state("restricted.cabinet.my-rating", {
                url: "/w/rate-u",
                templateUrl: "app/cabinet/worker/rate-user/View.html",
                controller: "rateUserCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/worker/rate-user/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Үнэлгээний хэсэг"
                },
                ncyBreadcrumb: {
                    label: "Үнэлгээний хэсэг"
                },
            })

            .state("restricted.cabinet.worker-report", {
                url: "/emp-r",
                templateUrl: "app/cabinet/worker/report/View.html",
                controller: "reportWorkerCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/worker/report/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Тайлан",
                },
                ncyBreadcrumb: {
                    label: "Тайлан",
                },
            })
            .state("restricted.cabinet.worker-report-edit", {
                url: "/worker/report/edit/:id/:planId/:userId",
                templateUrl: "app/cabinet/reportWorker/edit/View.html",
                controller: "workerReportEditCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/reportWorker/edit/Controller.js"]);
                        },
                    ],
                    item: function ($http, $stateParams, __env) {
                        return $http({
                            method: "GET",
                            url: __env.apiUrl() + "/api/admin/v1/item/cab-report-user/" + $stateParams.id,
                        }).then(function (data) {
                            return data.data;
                        });
                    },
                    objectives: function ($http, $stateParams, __env) {
                        return $http({
                            method: "GET",
                            url: __env.apiUrl() + "/api/admin/v1/item/cab-plan-user-obj/" + $stateParams.planId+'/'+ $stateParams.userId,
                        }).then(function (data) {
                            return data.data;
                        });
                    },
                },
                data: {
                    pageTitle: "Тайлангийн биелэлт",
                },
                ncyBreadcrumb: {
                    label: "Тайлангийн биелэлт",
                },
            })

            .state("restricted.cabinet.report-user", {
                url: "/report/user",
                templateUrl: "app/cabinet/report/View.html",
                controller: "reportAdminCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/report/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Жагсаалт"
                },
                ncyBreadcrumb: {
                    label: "Жагсаалт"
                },
            })
            .state("restricted.cabinet.report-rate", {
                url: "/report/rate/:id/:userId",
                templateUrl: "app/cabinet/report/rate/View.html",
                controller: "reportRateViewCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/report/rate/Controller.js"]);
                        },
                    ],
                    item: function ($http, $stateParams, __env) {
                        return $http({
                            method: "GET",
                            url: __env.apiUrl() + "/api/admin/v1/item/cab-plan-user/" + $stateParams.id+'/'+ $stateParams.userId,
                        }).then(function (data) {
                            return data.data;
                        });
                    },
                },
                data: {
                    pageTitle: "Гүйцэтгэлийн тайлангийн жагсаалт",
                },
                ncyBreadcrumb: {
                    label: "Гүйцэтгэлийн тайлангийн жагсаалт",
                },
            })



            .state("restricted.cabinet.report-employee", {
                url: "/com-r",
                templateUrl: "app/cabinet/commander/report/View.html",
                controller: "reportUserCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/commander/report/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Ажилтны  тайлан"
                },
                ncyBreadcrumb: {
                    label: "Ажилтны  тайлан"
                },
            })
            .state("restricted.cabinet.interview-employee", {
                url: "/com-i",
                templateUrl: "app/cabinet/commander/meeting/View.html",
                controller: "interviewUserCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/commander/meeting/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Ярилцлага"
                },
                ncyBreadcrumb: {
                    label: "Ярилцлага"
                },
            })
            .state("restricted.cabinet.rate-user", {
                url: "/emp-e",
                templateUrl: "app/cabinet/commander/rating/View.html",
                controller: "rateUserCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/commander/rating/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Ажилтны үнэлгээ"
                },
                ncyBreadcrumb: {
                    label: "Ажилтны үнэлгээ"
                },
            })
            .state("restricted.cabinet.team", {
                url: "/com-t",
                templateUrl: "app/cabinet/commander/team/View.html",
                controller: "teamUserCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/commander/team/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Үнэлгээний баг"
                },
                ncyBreadcrumb: {
                    label: "Үнэлгээний баг"
                },
            })





            .state("restricted.cabinet.report", {
                url: "/emp-r",
                templateUrl: "app/cabinet/commander/report/View.html",
                controller: "reportUserCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/commander/report/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Ажилтны тайлан"
                },
                ncyBreadcrumb: {
                    label: "Ажилтны тайлан"
                },
            })
            .state("restricted.cabinet.rate-performance", {
                url: "/rate-p",
                templateUrl: "app/cabinet/commander/performance/View.html",
                controller: "ratePerformanceCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/commander/performance/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Ажилтны үнэлгээ"
                },
                ncyBreadcrumb: {
                    label: "Ажилтны үнэлгээ"
                },
            })
            .state("restricted.cabinet.rate-attitude", {
                url: "/rate-a",
                templateUrl: "app/cabinet/commander/attitude/View.html",
                controller: "rateAttitudeCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/commander/attitude/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Ажилтны үнэлгээ"
                },
                ncyBreadcrumb: {
                    label: "Ажилтны үнэлгээ"
                },
            })
            .state("restricted.cabinet.rate-report", {
                url: "/emp-e",
                templateUrl: "app/cabinet/commander/rating/View.html",
                controller: "rateUserCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/commander/rating/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Ажилтны үнэлгээ"
                },
                ncyBreadcrumb: {
                    label: "Ажилтны үнэлгээ"
                },
            })

            .state("restricted.cabinet.rate-performance-det", {
                url: "/rate-d/:planYr/:userId",
                templateUrl: "app/cabinet/commander/performance/edit/View.html",
                controller: "rateDetUserCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/commander/performance/edit/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Ажилтны үнэлгээ"
                },
                ncyBreadcrumb: {
                    label: "Ажилтны үнэлгээ"
                },
            })












            /*       Credit        */
            .state("restricted.cabinet.credit", {
                url: "/credit",
                templateUrl: "app/cabinet/credit/View.html",
                controller: "creditAdminCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/credit/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Хамт олноо үнэлэх"
                },
                ncyBreadcrumb: {
                    label: "Хамт олноо үнэлэх"
                },
            })
            /*       Rating admin        */
            .state("restricted.cabinet.ratingAdmin", {
                url: "/cabinet/ratingAdmin",
                templateUrl: "app/cabinet/ratingAdmin/View.html",
                controller: "ratingAdminCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/ratingAdmin/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Үнэлгээний удирдлага",
                },
                ncyBreadcrumb: {
                    label: "Үнэлгээний удирдлага",
                },
            })
            // view
            .state("restricted.cabinet.ratingAdminView", {
                url: "/cabinet/ratingAdminView/:id",
                templateUrl: "app/cabinet/ratingAdmin/detail/View.html",
                controller: "ratingAdminInfoCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/ratingAdmin/detail/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Үнэлгээний удирдлага",
                },
                ncyBreadcrumb: {
                    label: "Үнэлгээний удирдлага",
                },
            })

            // Edit
            .state("restricted.cabinet.ratingAdminEdit", {
                url: "/cabinet/ratingAdminEdit/:id",
                templateUrl: "app/cabinet/ratingAdmin/edit/View.html",
                controller: "ratingAdminComponentCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/ratingAdmin/edit/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Үнэлгээний удирдлага",
                },
                ncyBreadcrumb: {
                    label: "Үнэлгээний удирдлага",
                },
            })

            /*       Contact        */
            .state("restricted.cabinet.contact", {
                url: "/cabinet/contact",
                templateUrl: "app/cabinet/contact/View.html",
                controller: "contactCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/contact/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Үнэлгээний удирдлага",
                },
                ncyBreadcrumb: {
                    label: "Үнэлгээний удирдлага",
                },
            })

            /*       Employee        */
            .state("restricted.cabinet.employee", {
                url: "/cabinet/employee",
                templateUrl: "app/cabinet/employee/View.html",
                controller: "employeeCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/employee/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Албан хаагч удирдлага",
                },
                ncyBreadcrumb: {
                    label: "Албан хаагч удирдлага",
                },
            })
            .state("restricted.cabinet.worker-complain", {
                url: "/worker/complain",
                templateUrl: "app/cabinet/complainWorker/View.html",
                controller: "complainWorkerCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/complainWorker/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Гомдол гаргах",
                },
                ncyBreadcrumb: {
                    label: "Гомдол гаргах",
                },
            })
            .state("restricted.cabinet.worker-complain-edit", {
                url: "/worker/complain/edit/:id/:userId",
                templateUrl: "app/cabinet/complainWorker/edit/View.html",
                controller: "workerComplainEditCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/complainWorker/edit/Controller.js"]);
                        },
                    ],
                    item: function ($http, $stateParams, __env) {
                        return $http({
                            method: "GET",
                            url: __env.apiUrl() + "/api/admin/v1/item/cab-plan-user/" + $stateParams.id+'/'+ $stateParams.userId,
                        }).then(function (data) {
                            return data.data;
                        });
                    },
                },
                data: {
                    pageTitle: "Гомдол гаргах",
                },
                ncyBreadcrumb: {
                    label: "Гомдол гаргах",
                },
            })
            .state("restricted.cabinet.communityRating", {
                url: "/worker/community-rating",
                templateUrl: "app/cabinet/communityRating/View.html",
                controller: "communityRatingCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/communityRating/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Үнэлгээний хэсэг",
                },
                ncyBreadcrumb: {
                    label: "Үнэлгээний хэсэг",
                },
            })


            // intention list
            .state("restricted.cabinet.intention", {
                url: "/cabinet/intention",
                templateUrl: "app/cabinet/intention/View.html",
                controller: "intentionCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/intention/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Зорилт удирдлага",
                },
                ncyBreadcrumb: {
                    label: "Зорилт удирдлага",
                },
            })

            // plan list
            .state("restricted.cabinet.plan", {
                url: "/cabinet/plan",
                templateUrl: "app/cabinet/plan/View.html",
                controller: "planCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/plan/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Зорилт удирдлага",
                },
                ncyBreadcrumb: {
                    label: "Зорилт удирдлага",
                },
            })

            // add intention
            .state("restricted.cabinet.intentionAdd", {
                url: "/cabinet/intentionAdd",
                templateUrl: "app/cabinet/intention/edit/View.html",
                controller: "intentionComponentCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/intention/edit/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Зорилт удирдлага",
                },
                ncyBreadcrumb: {
                    label: "Зорилт удирдлага",
                },
            })



            /*       Organization        */
            .state("restricted.cabinet.organization", {
                url: "/cabinet/organization",
                templateUrl: "app/cabinet/organization/View.html",
                controller: "organizationCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/organization/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Байгууллагын удирдлага",
                },
                ncyBreadcrumb: {
                    label: "Байгууллагын удирдлага",
                },
            })

             /*       Performance Rating        */
            .state("restricted.cabinet.performanceRating", {
                url: "/cabinet/performanceRating",
                templateUrl: "app/cabinet/performanceRating/View.html",
                controller: "performanceRatingCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/performanceRating/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Гүйцэтгэлийн үнэлгээ удирдлага",
                },
                ncyBreadcrumb: {
                    label: "Гүйцэтгэлийн үнэлгээ удирдлага",
                },
            })

            /*       Performance Rating Employee        */
            .state("restricted.cabinet.performanceRatingEmployee", {
                url: "/cabinet/performanceRatingEmployee",
                templateUrl: "app/cabinet/performanceRatingEmployee/View.html",
                controller: "performanceRatingEmployeeCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/performanceRatingEmployee/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Гүйцэтгэлий үнэлгээ удирдлага",
                },
                ncyBreadcrumb: {
                    label: "Гүйцэтгэлий үнэлгээ удирдлага",
                },
            })

            /*       Performance Target       */
            .state("restricted.cabinet.performanceTarget", {
                url: "/cabinet/performanceTarget",
                templateUrl: "app/cabinet/performanceTarget/View.html",
                controller: "performanceTargetCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/performanceTarget/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Гүйцэтгэлийн зорилт удирдлага",
                },
                ncyBreadcrumb: {
                    label: "Гүйцэтгэлийн зорилт удирдлага",
                },
            })

            /*       project        */
            .state("restricted.cabinet.project", {
                url: "/cabinet/performanceTarget",
                templateUrl: "app/cabinet/project/View.html",
                controller: "projectCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/project/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "project удирдлага",
                },
                ncyBreadcrumb: {
                    label: "project удирдлага",
                },
            })

            /*       Rating        */
            .state("restricted.cabinet.rating", {
                url: "/cabinet/rating",
                templateUrl: "app/cabinet/rating/View.html",
                controller: "ratingCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/rating/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Үнэлгээний удирдлага",
                },
                ncyBreadcrumb: {
                    label: "Үнэлгээний удирдлага",
                },
            })

            /*       Statistic     and report  */
            .state("restricted.cabinet.statistic", {
                url: "/cabinet/statistic",
                templateUrl: "app/cabinet/statisticAndReport/View.html",
                controller: "statisticAndReportCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/statisticAndReport/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Статистик ба тайлан удирдлага",
                },
                ncyBreadcrumb: {
                    label: "Статистик ба тайлан удирдлага",
                },
            })

            /*       User */
            .state("restricted.cabinet.users", {
                url: "/cabinet/user",
                templateUrl: "app/cabinet/user/View.html",
                controller: "usersCtrl",
                resolve: {
                    deps: [
                        "$ocLazyLoad",
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(["app/cabinet/users/Controller.js"]);
                        },
                    ],
                },
                data: {
                    pageTitle: "Хэрэглэгчийн удирдлага",
                },
                ncyBreadcrumb: {
                    label: "Хэрэглэгчийн удирдлага",
                },
            })

    },
]);
