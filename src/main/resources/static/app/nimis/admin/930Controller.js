angular
    .module('altairApp')
    .controller(
        '930NmsCtrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$timeout',
            'mainService',
            'commonDataSource',
            'Upload',
            '$http',
            '__env',
            function ($rootScope, $state, $scope, $timeout, mainService, commonDataSource, Upload, $http, __env) {
                $scope.user = JSON.parse(sessionStorage.getItem('currentUser'));
                $scope.menuData = JSON.parse(sessionStorage.getItem("menuData"));
                $scope.dataSource = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: "/api/nms/privilege/list",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            data: {"sort": [{field: 'id', dir: 'asc'}]},
                            beforeSend: function (req) {
                                if (JSON.parse(sessionStorage.getItem('currentUser')) != null) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                }
                                else {
                                    $state.go('login');
                                    $rootScope.$broadcast('LogoutSuccessful');
                                }
                            }
                        },
                        create: {
                            url: __env.apiUrl() + "/api/nms/privilege",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            },
                            complete: function (e) {
                                $(".k-grid").data("kendoGrid").dataSource.read();
                            }
                        },
                        update: {
                            url: __env.apiUrl() + "/api/nms/privilege",
                            contentType: "application/json; charset=UTF-8",
                            type: "PUT",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            },
                            complete: function (e) {
                                $(".k-grid").data("kendoGrid").dataSource.read();
                            }
                        },
                        destroy: {
                            url: __env.apiUrl() + "/api/nms/privilege",
                            contentType: "application/json; charset=UTF-8",
                            type: "DELETE",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            },
                            complete: function (e) {
                                $(".k-grid").data("kendoGrid").dataSource.read();
                            }
                        },
                        parameterMap: function (options) {
                            return JSON.stringify(options);
                        }
                    },
                    schema: {
                        data: "data",
                        total: "total",
                        model: {
                            id: "id",
                            fields: {
                                id: { type: "number", nullable: true },
                                name: { type: "string" },
                                shortName: { type: "string" },
                                description: { type: "string" }
                            }
                        }

                    },
                    pageSize: 20,
                    serverPaging: true,
                    serverSorting: true,
                    serverFiltering: true
                });
                $scope.mainGrid = {
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
                    reorderable: true,
                    pageable: {
                        pageSizes: [10, 50, 100],
                        refresh: true,
                        pageSize: 10,
                        buttonCount: 5
                    },
                    columns: [
                        {
                            title: "#",
                            headerAttributes: { "class": "columnCenter" },
                            attributes: { "style": "text-align: center;" },
                            template: "#= ++record #",
                            sticky: true,
                            width: 50
                        },
                        { field: "name", filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: { "class": "columnHeader" }, title: 'Нэр' },
                        { field: "shortName", filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: { "class": "columnHeader" }, title: 'Товчлол' },
                        { field: "description", filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: { "class": "columnHeader" }, title: 'Тайлбар' }

                    ],
                    dataBinding: function () {
                        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                    },
                    editable: "inline",
                    height: function () {
                        if ($scope.menuData.pageType === 0) {
                            return $(window).height() - 160;
                        }
                        return $(window).height() - 115;
                    }
                };

                if (sessionStorage.getItem('buttonData').includes("read")) {
                    $scope.mainGrid.toolbar = ["excel", "search"];
                }
                if (sessionStorage.getItem('buttonData').includes("create")) {
                    $scope.mainGrid.toolbar = [{ template: "<button class='md-btn custom-btn k-grid-add'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>" }];
                }
                if (sessionStorage.getItem('buttonData').includes("update") || sessionStorage.getItem('buttonData').includes("edit")) {
                    $scope.mainGrid.columns.push({
                        command: [
                            {
                                template:
                                    '<div class="command-container" style="padding-left:5px;"><a class="grid-btn k-grid-edit"><div class="nimis-icon edit"></div></a><a class="grid-btn k-grid-remove-command"><div class="nimis-icon delete"></div></a><a class="grid-btn k-grid-update"><div class="nimis-icon update"></div></a> <a class="grid-btn k-grid-cancel"><div class="nimis-icon cancel"></div></a></div>',
                            },
                        ], title: "&nbsp;", sticky: true, width: 80
                    });
                }
            }
        ]
    );
