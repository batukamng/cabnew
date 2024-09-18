angular.module("altairApp").controller("main_sidebarCtrl", [
    "$timeout",
    "$scope",
    "$rootScope",
    "$filter",
    "$state",
    "mainService",
    "__env",
    "$translate",
    function ($timeout, $scope, $rootScope, $filter, $state, mainService, __env, $translate) {
        $scope.user = JSON.parse(sessionStorage.getItem("currentUser")).user;
        var today = new Date();
        var curHr = today.getHours();
        $scope.guides = [];

        $scope.$on("loadModule", function (event, step, id, stage) {
            $scope.module = parseInt(step);
            var user = JSON.parse(sessionStorage.getItem("currentUser")).user;
            var tmpMenus = JSON.parse(sessionStorage.getItem("menuList"));
            if (user) var menus = tmpMenus.filter((i) => i.modules.filter((j) => j.id == $scope.module).length > 0);

            if (menus) {
                var firstMenu = menus.sort((a, b) => parseFloat(a.orderId) - parseFloat(b.orderId))[0];
                if (firstMenu.lutMenus.length > 0) {
                    var menuByModule = firstMenu.lutMenus.filter((i) => i.modules.filter((j) => j.id == $scope.module).length > 0);
                    if (menuByModule.length > 0) {
                        user.privileges.map((role) => {
                            if (menuByModule[0].id === role.menuId) actionStr = role.actionName;
                        });
                        // sessionStorage.setItem("buttonData", actionStr);
                        // sessionStorage.setItem("menuData", JSON.stringify(menuByModule[0]));
                        // $scope.getGuide();
                        $(".submenu").css("display", "none");
                        $(".dark-panel").css("display", "none");
                        $("body").attr("style", "padding-top: 59px");
                        $("#header_main").attr("style", "padding-bottom: 8px");
                        // $rootScope.$broadcast("loadSubTab", menuByModule[0].id, menuByModule[0]);

                        var tmp = $state.go(menuByModule[0].url);
                        if (tmp.$$state.status == 2) $state.go("restricted.404");
                    }
                } else {
                    user.privileges.map((role) => {
                        if (firstMenu.id === role.menuId) actionStr = role.actionName;
                    });
                    // sessionStorage.setItem("buttonData", actionStr);
                    // sessionStorage.setItem("menuData", JSON.stringify(firstMenu));
                    var tmp = $state.go(firstMenu.url);
                    if (tmp.$$state.status == 2) $state.go("restricted.404");
                }
            }
        });

        if (curHr < 12) {
            $scope.greeting = "Өглөөний мэнд";
        } else if (curHr < 18) {
            $scope.greeting = "Өдрийн мэнд";
        } else {
            $scope.greeting = "Оройн мэнд";
        }
        $scope.$on("onLastRepeat", function (scope, element, attrs) {
            $timeout(function () {
                if (!$rootScope.miniSidebarActive) {
                    // activate current section
                    $("#sidebar_main").find(".current_section > a").trigger("click");
                } else {
                    // add tooltips to mini sidebar
                    var tooltip_elem = $("#sidebar_main").find(".menu_tooltip");
                    tooltip_elem.each(function () {
                        var $this = $(this);

                        $this.attr("title", $this.find(".menu_title").text());
                        UIkit.tooltip($this, {
                            pos: "right",
                        });
                    });
                }
            });
        });

        $scope.roles = JSON.parse(sessionStorage.getItem("roles"));
        $scope.menuData = {};
        // if (sessionStorage.getItem("menuData")) {
        //   $scope.menuData = JSON.parse(sessionStorage.getItem("menuData"));
        //   $rootScope.$broadcast("loadSubTab", $scope.menuData.id, $scope.menuData);
        // }
        $rootScope.admin = false;
        angular.forEach($scope.roles, function (value, key) {
            if (value.auth === "Admin") {
                // $rootScope.admin=true;
            }
        });

        $scope.actionBtn = function (id) {
            var actionStr = "";
            angular.forEach($scope.user.privileges, function (role, key) {
                if (id === role.menuId) {
                    actionStr = role.actionName;
                }
            });
            return actionStr;
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

        $scope.module = parseInt(sessionStorage.getItem("module"));
        $scope.sections = JSON.parse(sessionStorage.getItem("menuList"));

        $timeout(function () {
        }, 100);

        $scope.getIcon = function (name) {
            var pathname = "/assets/icons/menu-icons/ic_menu_";
            switch (name) {
                case "dashboard":
                    return pathname + "dashboard.svg";
                    break;
                default:
                    return pathname + "dashboard.svg";
                    break;
            }
        };
        $scope.log = function () {
            $(".submenu").css("display", "none");
            $(".dark-panel").css("display", "none");
        };
    },
]);
