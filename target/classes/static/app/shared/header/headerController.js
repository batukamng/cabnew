angular
    .module("altairApp")
    .controller("main_headerCtrl", [
        "$timeout",
        "$rootScope",
        "mainService",
        "$scope",
        "$interval",
        "$http",
        "Idle",
        "$window",
        "Upload",
        "$state",
        "__env",
        "commonDataSource",
        "downloadService",
        function ($timeout, $rootScope, mainService, $scope, $interval, $http, Idle, $window, Upload, $state, __env, commonDataSource, downloadService) {
            $scope.planYr = localStorage.getItem("planYr");
            $scope.budgetCode = localStorage.getItem("budgetCode");
            $scope.notifCount = 0;
            $scope.currentUser = JSON.parse(localStorage.getItem("currentUser"));
            mainService.withResponse("GET", __env.apiUrl() + "/api/notification/count/" + $scope.currentUser.user.id).then(function (data) {
                $scope.notifCount = data.data;
            });
            $scope.guides = [];
            $scope.fileUrl = null;

            var today = new Date();
            var curHr = today.getHours();
            $rootScope.module = localStorage.getItem("module");

            mainService.withdomain("get", __env.apiUrl() + "/api/nms/common/grp/auditType")
                .then(function (data) {
                $scope.budgetDataSource = data;
            });


            mainService.withdomain("get", __env.apiUrl() + "/api/nms/common/grp/auditType")
                .then(function (data) {
                    $scope.budgetDataSource = data;
                });

            $scope.yearDataSource = [
                {label: "2022", value: "2022"},
                {label: "2023", value: "2023"},
                {label: "2024", value: "2024"},
                {label: "2025", value: "2025"},
            ];

            if($scope.currentUser.user.orgId!=null){
                mainService.withdomain("get", __env.apiUrl() + "/api/admin/v1/list/cab-plan-user-drop/"+$scope.currentUser.user.orgId)
                    .then(function (data) {
                        $scope.yearDataSource  = data;
                    });
            }



            $scope.planYrOptions = {select: $scope.changePlanYear};
            if (localStorage.getItem("currentUser") == null) {
                $state.go("login");
            }

            $scope.moduleChange = function (item) {
                $rootScope.module = item.id;
                localStorage.setItem("module", item.id);
                $rootScope.$broadcast("loadModule", item.id);
                const menuList = JSON.parse(localStorage.getItem("menuList"));
                if (menuList == null || menuList == undefined) return;
                var menuByModule = menuList.filter((i) => i.modules.filter((j) => j.id == item.id).length > 0);

                if (menuByModule.length > 0) {
                    var menuData = menuByModule[0];
                    localStorage.setItem("buttonData", "");
                    localStorage.setItem("menuData", JSON.stringify({}));
                    $rootScope.$broadcast("loadModule", item.id);
                }
            };

            if (curHr < 12) {
                $scope.greeting = "Өглөөний мэнд";
            } else if (curHr < 18) {
                $scope.greeting = "Өдрийн мэнд";
            } else {
                $scope.greeting = "Оройн мэнд";
            }

            $scope.user_data = {
                alerts: [],
                messages: [],
                alerts_read: [],
                messages_read: [],
            };
            mainService
                .withdata("POST", __env.apiUrl() + "/api/notification/list", {
                    page: 1,
                    take: 10,
                    pageSize: 1,
                    skip: 0,
                    filter: {
                        logic: "AND",
                        filters: [{field: "userId", value: $scope.currentUser.user.id, operator: "eq"}]
                    },
                    sort: [{field: "createdAt", dir: "desc"}],
                })
                .then(function (data) {
                    $scope.notifs = data.data;
                });


            $scope.deleteNotif = function (id, index) {
                mainService.withdomain("delete", "/api/notification/delete/" + id).then(function (data) {
                    $scope.notifs.splice(index, 1);
                });
            };

            $scope.openChat = function (e) {
                $("#chat .k-card-title").text(e.name);
                $("#chatDropdown").addClass("uk-dropdown-close");
                $("#chat").css("display", "flex");
            };

            function initListener() {
                const eventSource = new EventSource("/subscription");
                eventSource.onopen = (e) => console.log("open");
                eventSource.onerror = (e) => {
                    if (e.readyState == EventSource.CLOSED) {
                        console.log("close");
                    } else {
                        console.log(e);
                    }
                    //  initListener();
                };
                eventSource.addEventListener($scope.currentUser.id, eventHandler, false);
            }

            //initListener();
            function eventHandler(event) {
                var eventData = JSON.parse(event.data);
                $scope.notifs.unshift(eventData);
                $scope.unreadCount();
                UIkit.notify("Амжилтгүй. Шинэ нууц үг таарахгүй байна", {
                    status: "danger",
                    pos: "bottom-right",
                    message:
                        '<div class="toast">\n' +
                        '      <div class="content">\n' +
                        '        <div class="icon"> <i style="vertical-align: -5px;color: white" class="material-icons md-24">\n' +
                        "                    priority_high\n" +
                        "                </i></div>\n" +
                        '        <div class="details">\n' +
                        "          <span>" +
                        eventData.title +
                        "</span>\n" +
                        "          <p>" +
                        eventData.content +
                        "</p>\n" +
                        "        </div>\n" +
                        "      </div>\n" +
                        '      <div class="close-icon"><i style="vertical-align: -5px;" class="material-icons md-24">close</i></div>\n' +
                        "    </div>",
                });
                $scope.$apply();
            }

            $scope.titleAnim = false;
            $scope.showModules = function (e) {
            };

            $scope.user = JSON.parse(localStorage.getItem("currentUser"));
            mainService.user = $scope.user.user;
            $scope.$watch(
                function () {
                    return mainService.user;
                },
                function (user) {
                    $scope.user.user = user;
                }
            );

            if ($scope.user !== null) {
                var loggedUser = JSON.parse(localStorage.getItem("currentUser"));
                var currentDate = new Date(new Date().getTime());
                var pickUpDate = new Date(loggedUser.expires);
                if (currentDate > pickUpDate) {
                    $rootScope.expire = true;
                    localStorage.removeItem("currentUser");
                    localStorage.removeItem("menuList");
                    localStorage.removeItem("menuData");
                    localStorage.removeItem("roles");
                    $state.go("login");
                }
                $scope.section = JSON.parse(localStorage.getItem("menuData"));
                $scope.module = JSON.parse(localStorage.getItem("module"));
                var menuList = JSON.parse(localStorage.getItem("menuList")) || [];
                if ($scope.section && $scope.section.parentId != null && $scope.section.pageType === 0 && menuList.length > 0) {
                    $scope.sections = menuList.filter((i) => i.id == $scope.section.parentId)[0].lutMenus || [];
                    $("body").attr("style", "padding-top: 109px");
                } else {
                    $scope.sections = [];
                    $("body").attr("style", "padding-top: 59px");
                }
            } else {
                $state.go("login");
                localStorage.removeItem("currentUser");
                localStorage.removeItem("menuList");
                localStorage.removeItem("menuData");
                localStorage.removeItem("roles");
                $rootScope.expire = true;
            }
            $("#menu_top")
                .children("[data-uk-dropdown]")
                .on("show.uk.dropdown", function () {
                    $timeout(function () {
                        $($window).resize();
                    }, 280);
                });

            // autocomplete
            $(".header_main_search_form").on("click", "#autocomplete_results .item", function (e) {
                e.preventDefault();
                var $this = $(this);
                $state.go($this.attr("href"));
                $(".header_main_search_input").val("");
            });

            $scope.logout = function () {
                $rootScope.$broadcast("LogoutSuccessful");
                $timeout(function (){
                    localStorage.removeItem("currentUser");
                    localStorage.removeItem("menuList");
                    localStorage.removeItem("menuData");
                    mainService.withdata('post','/api/nms/activity-log/trace',{"event":"logout","description":"Системээс гарсан"}).then(function (data) {});
                    $state.go("login");
                },100)

                $rootScope.expire = true;
            };

            // append modal to <body>
            $("body").append(
                '<div class="uk-modal" id="modal_idle">' +
                '<div class="uk-modal-dialog">' +
                '<div class="uk-modal-header">' +
                '<h3 class="uk-modal-title">Your session is about to expire!</h3>' +
                "</div>" +
                "<p>You've been inactive for a while. For your security, we'll log you out automatically.</p>" +
                '<p>Your session will expire in <span class="uk-text-bold md-color-red-500" id="sessionSecondsRemaining"></span> seconds.</p>' +
                "</div>" +
                "</div>"
            );

            var modal = UIkit.modal("#modal_idle", { bgclose: false}),
                $sessionCounter = $("#sessionSecondsRemaining");

            Idle.watch();
            $scope.$on("IdleWarn", function (e, countdown) {
                modal.show();
                $sessionCounter.html(countdown);
            });

            $scope.$on("IdleEnd", function () {
                modal.hide();
                $sessionCounter.html("");
            });

            $scope.$on("IdleTimeout", function () {
                modal.hide();
                // log out user
                $timeout(function (){
                    $state.go("login");
                    $rootScope.expire = true;
                    localStorage.removeItem("currentUser");
                },500)

            });

            $scope.push_to_userInfo = function () {
                localStorage.setItem("buttonData", "");
                localStorage.setItem("menuData", "{}");
                $state.go("restricted.profile");
            };

            $scope.push_to_email = function () {
                // $state.go("restricted.profile");
            };

            $scope.push_to_feedback = function () {
                localStorage.setItem("buttonData", "");
                localStorage.setItem("menuData", "{}");
                $state.go("restricted.feedback");
            };

            $scope.modalData = {};
            $scope.showNotification = function (item) {
                if (item.seen == 1) {
                    mainService
                        .withdata("POST", __env.apiUrl() + "/api/notification/read", {
                            userId: $scope.currentUser.user.id,
                            ntfId: item.id,
                        })
                        .then(function (data) {
                            var index = $scope.notifs.indexOf(item);
                            $scope.notifs[index].seen = data.seen;

                            mainService.withResponse("GET", __env.apiUrl() + "/api/notification/count/" + $scope.currentUser.user.id).then(function (data) {
                                localStorage.setItem("notif_count", data.data);
                                $timeout(function (){
                                    $scope.notifCount = data.data;
                                },100)
                            });
                        });
                }

                $scope.modalData = item;
                UIkit.modal("#modal_notif", {
                    modal: false,
                    keyboard: false,
                    bgclose: false,
                    center: false,
                }).show();
            };
            $scope.showAllNotif = function () {
                localStorage.setItem("buttonData", "");
                localStorage.setItem("menuData", "{}");
                mainService.withResponse("GET", __env.apiUrl() + "/api/notification/count/" + $scope.currentUser.user.id).then(function (data) {
                    localStorage.setItem("notif_count", data.data);
                    $scope.notifCount = data.data;
                });
                $state.go("restricted.notification");
            };

            $scope.clickGuideIcon = function (data) {
                $scope.guides = [];
                var menuId = null;

                if (JSON.parse(localStorage.getItem("menuData")).parentId === null) menuId = JSON.parse(localStorage.getItem("menuData")).id;
                else menuId = JSON.parse(localStorage.getItem("menuData")).parentId;

                mainService.withdomain("get", __env.apiUrl() + "/api/nms/menu/item/"+menuId)
                    .then(function (data) {
                        if (data!=null){
                            if (data.videoUrl != null) {
                                $scope.guides.push({
                                    title: "Видео заавар",
                                    content: data.videoUrl,
                                    type: "video",
                                    read: false,
                                });
                            }

                            if (data.guideFileId != null) {
                                $scope.guides.push({
                                    title: "Гарын авлага",
                                    content: data.guideFileId,
                                    type: "document",
                                    read: false,
                                });
                            }
                        }
                    });
            };

            $scope.showGuide = function (data) {
                if (data.type === "video") window.open(data.content);

                if (data.type === "document") {
                    $scope.viewFile(data.content);
                }
            };

            $scope.viewFile = function (item) {
                mainService.withdata("get", __env.apiUrl() + "/api/file/item/" + item).then(function (resp) {
                    if (resp != null) {
                        if (resp.mimeType === "pdf") {
                            $("#pdfViewer").html("");
                            var pdfViewer = $("#pdfViewer").kendoPDFViewer({
                                width: "100%",
                                height: "100%"
                            }).data("kendoPDFViewer");
                            pdfViewer.fromFile(resp.uri);
                            UIkit.modal("#modal_pdf", {
                                modal: false,
                                keyboard: false,
                                bgclose: false,
                                center: false,
                            }).show();
                        }
                    }
                });
            };

            $scope.downloadDocument = function (item) {
                mainService.withdata("get", __env.apiUrl() + "/api/file/item/" + item.content).then(function (resp) {
                    if (resp != null) {
                        if (resp.mimeType == "pdf") {
                            $scope.fileUrl = resp.uri;
                            downloadService.download($scope.fileUrl);
                        }
                    }
                });
            };

            $("#planYrRadio").kendoRadioGroup({
                items: $scope.yearDataSource,
                layout: "vertical",
                value: $scope.planYr,
            });

            //test for iterating over child elements
            $("#languages").kendoDropDownList({
                dataTextField: "ContactName",
                dataTextField: "CustomerID",
                headerTemplate: '<div class="dropdown-header k-widget k-header">' + "<span>Photo</span>" + "<span>Contact info</span>" + "</div>",
                footerTemplate: "Total #: instance.dataSource.total() # items found",
                valueTemplate: '<span class="selected-value" style="background-image: url(\'../content/web/Customers/#:data.CustomerID#.jpg\')"></span><span>#:data.ContactName#</span>',
                template:
                    '<span class="k-state-default" style="background-image: url(\'../content/web/Customers/#:data.CustomerID#.jpg\')"></span>' +
                    '<span class="k-state-default"><h3>#: data.ContactName #</h3><p>#: data.CompanyName #</p></span>',
                dataSource: {
                    transport: {
                        read: {
                            dataType: "jsonp",
                            url: "https://demos.telerik.com/kendo-ui/service/Customers",
                        },
                    },
                },
                height: 400,
            });

            $scope.$on("on-foreground-notification", function (event, data) {
                let payload = data.payload;
                console.debug(payload.data);
                mainService.withResponse("GET", __env.apiUrl() + "/api/notification/count/" + $scope.currentUser.user.id).then(function (data) {
                    localStorage.setItem("notif_count", data.data);
                    $timeout(function (){
                        $scope.notifCount = data.data;
                    },100)
                });
                mainService
                    .withdata("POST", __env.apiUrl() + "/api/notification/list", {
                        page: 1,
                        take: 10,
                        pageSize: 1,
                        skip: 0,
                        filter: {
                            logic: "AND",
                            filters: [{field: "userId", value: $scope.currentUser.user.id, operator: "eq"}]
                        },
                        sort: [{field: "createdAt", dir: "desc"}],
                    })
                    .then(function (data) {
                        $scope.notifs = data.data;
                    });
               /* $scope.notifs.push({
                    title: payload.notification.title,
                    content: payload.notification.body,
                    regDtm: new Date(),
                    type: "alert",
                    read: false,
                    id: new Date().getTime(),
                });
                console.log($scope.notifs);*/

                /* url: payload.data.url,*/
                $scope.titleAnim = true;
                $scope.changeTitle();
            });
            self.addEventListener("notificationclick", (event) => {
                if (!event.action) {
                    $state.href(event.notification.data.stateUrl, {id: event.notification.data.stateParamId});
                    return;
                }

                switch (event.action) {
                    case "url-action":
                        $state.href(event.notification.data.stateUrl, {id: event.notification.data.stateParamId});
                        break;
                    default:
                        console.log(`Unknown action clicked: '${event.action}'`);
                        break;
                }
            });
            $scope.changeTitle = function () {
                $timeout(() => {
                    if ($rootScope.page_title.startsWith("(")) {
                        $rootScope.page_title = $rootScope.page_title.replace(/\([0-9]*\) /g, "");
                        if ($scope.titleAnim) {
                            setTimeout(() => $scope.changeTitle(), 1000);
                        }
                    } else {
                        $rootScope.page_title = "(1) " + $rootScope.page_title;
                        if ($scope.titleAnim) {
                            setTimeout(() => $scope.changeTitle(), 5000);
                        }
                    }
                });
            };
            $rootScope.$on("loadSubTab", function (section, id) {
                $scope.section = JSON.parse(localStorage.getItem("menuData"));
                $scope.module = JSON.parse(localStorage.getItem("module"));
                var menuList = JSON.parse(localStorage.getItem("menuList")) || [];
                if ($scope.section && $scope.section.parentId != null && $scope.section.pageType === 0 && menuList.length > 0) {
                    $scope.sections = menuList.filter((i) => i.id == $scope.section.parentId)[0].lutMenus || [];
                    $("body").attr("style", "padding-top: 109px");
                } else {
                    $scope.sections = [];
                    $("body").attr("style", "padding-top: 59px");
                }
            });
            $scope.actionBtn = function (id) {
                var actionStr = "";
                angular.forEach($scope.user.user.privileges, function (role, key) {
                    if (id === role.menuId) {
                        actionStr = role.actionName;
                    }
                });
                return actionStr;
            };
            $scope.log = function (item) {
                $scope.section = item;
                localStorage.removeItem("menuData");
                localStorage.setItem("menuData", JSON.stringify(item));
                localStorage.removeItem("buttonData");
                localStorage.setItem("buttonData", $scope.actionBtn(item.id));
            };
            $scope.miniSidebarHiddenLarge = $rootScope.miniSidebarHiddenLarge;
            $scope.budgetChange = function (value) {
                $scope.budgetType = $scope.budgetDataSource.filter((i) => i.id == value.id)[0];
                console.log($scope.budgetType);
                localStorage.setItem("budgetType", value.id);
                localStorage.setItem("budgetCode", value.comCd);
                $state.reload();
            };
            $scope.yearChange = function (value) {
                $scope.planYr = value;
                localStorage.setItem("planYr", value);
                $state.reload();
            };
        },
    ])

    .config(function (IdleProvider, KeepaliveProvider) {
        // configure Idle settings
        IdleProvider.idle(6000); // in seconds
        IdleProvider.timeout(30); // in seconds
        IdleProvider.keepalive(false);
    });
