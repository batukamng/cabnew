angular.module("altairApp").controller("1001CntCtrl", [
    "$rootScope",
    "$state",
    "$scope",
    "$timeout",
    "mainService",
    "__env",
    function ($rootScope, $state, $scope, $timeout, mainService, __env) {
        $scope.user = JSON.parse(sessionStorage.getItem("currentUser"));
        $("#header_main").attr("style", "filter: none !important;padding: 8px 25px");

        $scope.mainGrid = {
            dataSource: {
                transport: {
                    read: {
                        url: __env.apiUrl() + "/api/cnt/content/list",
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
                        data: {sort: [{field: "id", dir: "desc"}]},
                        beforeSend: function (req) {
                            req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
                        },
                    },
                    destroy: {
                        url: __env.apiUrl() + "/api/cnt/content/delete",
                        contentType: "application/json; charset=UTF-8",
                        type: "DELETE",
                        beforeSend: function (req) {
                            req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
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
                        fields: {
                            id: {editable: false, nullable: true},
                            title: {type: "string", validation: {required: true}},
                            type: {type: "string"},
                            status: {type: "string"},
                            visibility: {type: "string"},
                            slug: {type: "string"},
                            regId: {type: "number"},
                            useYn: {type: "boolean"},
                            user: {editable: false},
                            cntTermTaxonomies: {defaultValue: []},
                        },
                    },
                },
                pageSize: 20,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
            },
            filterable: {
                mode: "row",
                extra: false,
                operators: {
                    // redefine the string operators
                    string: {
                        contains: "Агуулсан",
                        startswith: "Эхлэх утга",
                        eq: "Тэнцүү",
                        gte: "Их",
                        lte: "Бага",
                    },
                },
            },
            sortable: true,
            resizable: true,
            pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5,
            },
            columns: [
                {
                    title: "#",
                    headerAttributes: {class: "columnCenter"},
                    attributes: {style: "text-align: center;"},
                    template: "#= ++record #",
                    sticky: true,
                    width: 50,
                },
                /*{
                                    field: "image",
                                    title: "Зураг",
        //                            template: '<img src="{{image.location}}"/>',
                                    template: '#if(image !=null && image.compressedLocation != null){# <img src="#=image.compressedLocation#" height=""/># }' +
                                        'else if(image !=null && image.location != null){# <img src="#=image.location#" height=""/> #}#',
                                    headerAttributes: {style: "text-align: left; font-weight: bold"}
                                },*/
                {
                    field: "title",
                    title: "Гарчиг",
                    filterable: {cell: {operator: "contains", showOperators: false}},
                    headerAttributes: {style: "text-align: left;"},
                },
                {
                    field: "type",
                    title: "Төрөл",
                    filterable: {cell: {operator: "eq", showOperators: false}},
                    headerAttributes: {style: "text-align: left;"},
                    width: 100,
                    values: [
                        {text: "Хуудас", value: "Page"},
                        {text: "Мэдээ", value: "Content"},
                    ],
                    template: "#if(type=='Page'){# Хуудас #}else{# Мэдээ #}#"
                },
                {
                    field: "status",
                    title: "Төлөв",
                    filterable: {cell: {operator: "contains", showOperators: false}},
                    headerAttributes: {style: "text-align: left;"},
                    width: 100,
                },
                {
                    field: "visibility",
                    title: "Хүлээн авагч",
                    filterable: {cell: {operator: "contains", showOperators: false}},
                    headerAttributes: {style: "text-align: left;"},
                    width: 100,
                },
                {
                    field: "regDtm",
                    title: "Огноо",
                    filterable: {cell: {operator: "contains", showOperators: false}},
                    headerAttributes: {style: "text-align: left;"},
                },
                {
                    field: "user",
                    title: "Ажилтан",
                    filterable: {cell: {operator: "contains", showOperators: false}},
                    headerAttributes: {style: "text-align: left;"},
                },
            ],
            dataBinding: function () {
                record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
            },
            editable: "inline",
            height: function () {
                return $(window).height() - 110;
            },
        };

        if (sessionStorage.getItem("buttonData").includes("read")) {
            $scope.mainGrid.toolbar = ["excel", "search"];
        }
        if (sessionStorage.getItem("buttonData").includes("create")) {
            $scope.mainGrid.toolbar = [{template: "<button class='md-btn custom-btn' ng-click='addNew(0)'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>"}];
        }
        if (sessionStorage.getItem("buttonData").includes("update") || sessionStorage.getItem("buttonData").includes("edit")) {
            $scope.mainGrid.columns.push({
                command: [
                    {
                        template:
                            '<div class="flex gap-3"><button class="grid-btn k-grid-edit" ng-click=\'edit(dataItem.id)\'><div class="nimis-icon edit"></div></button><button class="grid-btn k-grid-remove-command"><div class="nimis-icon delete"></div></button></div>',
                    },
                ],
                title: "&nbsp;",
                width: 100,
            });
        }

        $scope.addNew = function (id) {
            $scope.view(2, false, id);
        };
        $scope.gotoDetail = function (id) {
            UIkit.modal("#modal_loader", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true,
            }).show();
            mainService.withdata("get", __env.apiUrl() + "/api/cnt/content/item/" + id).then(function (data) {
                UIkit.modal("#modal_loader").hide();
                $(".uk-modal").hide();
                setTimeout(function () {
                    $scope.view(1, false, data);
                }, 10);
            });
        };
        $scope.edit = function (id) {
            UIkit.modal("#modal_loader", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true,
            }).show();
            mainService.withdata("get", __env.apiUrl() + "/api/cnt/content/item/" + id).then(function (data) {
                UIkit.modal("#modal_upload").hide();
                $scope.view(2, false, data);
            });
        };
        $scope.view = function (step, back, appId) {
            if (back) {
                $(".stat-screen").hide();
                $("#main_content").show();
            } else {
                $("#main_content").hide();
                $("#form" + step).show();
            }

            if (appId == 0) {
                appId = {};
            }
            if (step === 2) {
                $scope.$broadcast("editContent", step, appId);
            } else {
                $scope.$broadcast("loadContent", step, appId);
            }
        };
    },
]);
