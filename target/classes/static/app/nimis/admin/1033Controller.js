angular
    .module('altairApp')
    .controller(
        '1033Ctrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$timeout',
            '__env',
            'commonDataSource',
            'categories',
            'mainService',
            '$translate',
            function ($rootScope, $state, $scope, $timeout, __env, commonDataSource,categories,mainService,$translate) {

                $scope.catItems=categories;
                $scope.formSubmit = function () {
                    var validator = $("#validator").kendoValidator().data("kendoValidator");
                    if (validator.validate()) {
                        $scope.dataItem.categoryArr = [];
                        for (var priKey in $scope.categories) {
                            var priv = $scope.categories[priKey];
                            if (priv) $scope.dataItem.categoryArr.push(priKey);
                        }
                        mainService.withdata("post", "/api/admin/organization/submit", $scope.dataItem).then(function (data) {
                            $rootScope.alert(true, "Амжилттай хадгаллаа.");
                            modalForm.hide();
                            $(".k-grid").data("kendoGrid").dataSource.read();
                        });
                    }
                };
                $scope.categories = {};
                var modalForm = UIkit.modal("#modal_form", {
                    modal: false,
                    keyboard: false,
                    bgclose: false,
                    center: true,
                });

                $scope.add=function (){
                    $scope.dataItem = {useYn: 1};
                    $scope.categories = {};
                    $scope.isCheckAll = false;
                    modalForm.show();
                }
                $scope.update = function (item) {
                    $scope.dataItem = item;
                    $scope.categories = {};

                    $scope.isCheckAll = false;
                    if (item.catIds != null && item.catIds.length > 0) {
                        $scope.dataItem.categories = item.catIds.split(",");
                        if ($scope.dataItem.categories !== undefined) {
                            $scope.dataItem.categories.map(function (x) {
                                $scope.categories[parseInt(x)] = 1;
                            });
                        }
                    }
                    modalForm.show();
                };


                $scope.dataSource = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: __env.apiUrl() + "/api/admin/organization/list",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            data: { sort: [{ field: "id", dir: "desc" }] },
                            beforeSend: function (req) {
                                if (JSON.parse(localStorage.getItem('currentUser')) != null) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                }
                                else {
                                    $state.go('login');
                                    $rootScope.$broadcast('LogoutSuccessful');
                                }
                            }
                        },
                        update: {
                            url: __env.apiUrl() + "/api/admin/organization",
                            contentType: "application/json; charset=UTF-8",
                            type: "PUT",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                            },
                            complete: function (e) {
                                if (e.status === 200) {
                                    $rootScope.alert(true, "Амжилттай засагдлаа");
                                }
                                else if (e.status === 500) {
                                    $rootScope.alert(false, "Амжилтгүй");
                                }
                                $(".k-grid ").data("kendoGrid").dataSource.read();
                            }
                        },
                        destroy: {
                            url: __env.apiUrl() + "/api/admin/organization",
                            contentType: "application/json; charset=UTF-8",
                            type: "DELETE",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                            }
                        },
                        create: {
                            url: __env.apiUrl() + "/api/admin/organization",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            complete: function (e) {
                                if (e.status === 200) {
                                    $rootScope.alert(true, "Амжилттай хадгаллаа");
                                }
                                else if (e.status === 409) {
                                    $rootScope.alert(false, "Код давхцаж байна");
                                }
                                else if (e.status === 500) {
                                    $rootScope.alert(false, "Амжилтгүй");
                                }
                                $(".k-grid ").data("kendoGrid").dataSource.read();
                            },
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
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
                                useYn: { type: "number", defaultValue:1 }
                            }
                        }

                    },
                    filter: {field: "useYn", operator: "eq", value: 1},
                    pageSize: 10,
                    serverPaging: true,
                    serverSorting: true,
                    serverFiltering: true
                });
                $scope.mainGrid = {
                    filterable: {
                        mode:"row",
                        extra: false,
                        operators: { // redefine the string operators
                            string: {
                                contains: "Агуулсан",
                                startswith: "Эхлэх утга",
                                eq: "Тэнцүү",
                                gte: "Их",
                                lte: "Бага"
                            }
                        }
                    },
                    excel: {
                        fileName: "Projects.xlsx",
                        allPages: true,
                        filterable: true
                    },
                    sortable: true,
                    resizable: true,
                    reorderable: true,
                    pageable: {
                        pageSizes: [10, 50, 100, 'All'],
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
                        {field: "name", filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: {"class": "columnHeader"},title:'Нэр'},
                        {field: "email", filterable: { cell: { operator: "contains", showOperators: false } },headerAttributes: {"class": "columnHeader"},title: 'И-мэйл хаяг'},
                        {field: "phone", filterable: { cell: { operator: "contains", showOperators: false } },headerAttributes: {"class": "columnHeader"},title: 'Утас'},
                        {field: "description", filterable: { cell: { operator: "contains", showOperators: false } },headerAttributes: {"class": "columnHeader"},title: 'Тухай'},
                        {field: "web", filterable: { cell: { operator: "contains", showOperators: false } },headerAttributes: {"class": "columnHeader"},title: 'Веб сайт'},
                        {field: "facebook", filterable: { cell: { operator: "contains", showOperators: false } },headerAttributes: {"class": "columnHeader"},title: 'Facebook'},
                        {field: "instagram", filterable: { cell: { operator: "contains", showOperators: false } },headerAttributes: {"class": "columnHeader"},title: 'Instagram'},
                        {field: "catNames",filterable: { cell: { operator: "contains", showOperators: false } },headerAttributes: {"class": "columnHeader"}, title: 'Үйлчилгээ'},
                    ],
                    dataBinding: function () {
                        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                    },
                    editable: "inline",
                    height: function () {
                        return $(window).height() - 115;
                    }
                };

                if (localStorage.getItem("buttonData").includes("read")) {
                    $scope.mainGrid.toolbar = ["excel", "search"];
                }
                if (localStorage.getItem("buttonData").includes("create")) {
                    $scope.mainGrid.toolbar = [{template: "<button class='md-btn custom-btn' ng-click='add()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>"}];
                }

                if (localStorage.getItem("buttonData").includes("edit")) {
                   /* $scope.mainGrid.columns.push({
                        command: [
                            {
                                template:
                                    '<div class="flex gap-3"><button class="grid-btn k-grid-edit" ng-click=\'update(dataItem)\'><div class="nimis-icon edit"></div></button><button class="grid-btn k-grid-remove-command"><div class="nimis-icon delete"></div></button></div>',
                            },
                        ],
                        title: "&nbsp;",
                        width: 90,
                        sticky: true,
                        attributes: {style: "text-align: center;"},
                    });*/
                    $scope.mainGrid.columns.push({
                        command: [
                            {
                                template:
                                    '<div class="flex gap-3"><button class="grid-btn k-grid-edit" ng-click=\'update(dataItem)\'><div class="nimis-icon edit"></div></button><button class="grid-btn k-grid-remove-command" ng-click=\'deleteLevel(dataItem)\'><div class="nimis-icon delete"></div></button></div>',
                            },
                        ],
                        title: "&nbsp;",
                        width: 100,
                    });
                }

                $scope.checkAllCategory = function (e) {
                    $scope.catItems.map(function (i) {
                        $scope.categories[parseInt(i.id)] = $scope.isCheckAllCategory == "all" ? 0 : 1;
                    });
                    $scope.isCheckAllCategory = $scope.isCheckAllCategory == "all" ? "" : "all";
                };

                $scope.changeCategoryCheckbox = function () {
                    $scope.isCheckAllCategory = "";
                };

                $scope.uncheckAllControl = function () {
                    $scope.categories = {};
                };
            }
        ]
    );
