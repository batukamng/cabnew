angular
    .module('altairApp')
    .controller(
        '932NmsCtrl',
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

                $scope.menuDataSource = commonDataSource.urlDataSource("/api/nms/menu/data/list", JSON.stringify({ sort: [{ field: "name", dir: "asc" }] }));
                $scope.moduleDataSource = commonDataSource.urlDataSource("/api/nms/module/list", JSON.stringify({ sort: [{ field: "name", dir: "asc" }] }));

                $scope.dataSource = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: "/api/nms/component/list",
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
                        destroy: {
                            url: __env.apiUrl() + "/api/nms/component",
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
                                sponsorOrg: { editable: false },
                                checkOrg: { editable: false },
                                pipAmt: { type: "number" }
                            }
                        }

                    },
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
                        { field: "url", filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: { "class": "columnHeader" }, title: 'Хаяг' },
                        { field: "menuId", template: "#if(menu!=null){# #=menu.name# #}#", filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: { "class": "columnHeader" }, title: 'Цэс' },
                        { field: "moduleId", template: "#if(module!=null){# #=module.name# #}#", filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: { "class": "columnHeader" }, title: 'Дэд систем' },
                    ],
                    dataBinding: function () {
                        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                    },
                    editable: "inline",
                    height: function () {
                        return $(window).height() - 115;
                    }
                };

                $scope.dataSubmit=function (){
                    if ($scope.validator.validate()) {
                        mainService.withdata('post', __env.apiUrl() + '/api/nms/component/submit', $scope.dataItem)
                            .then(function (data) {
                                    modalForm.hide();
                                    $(".k-grid").data("kendoGrid").dataSource.read();
                                    $rootScope.alert(true, "Амжилттай.");
                                }
                            );
                    }
                }

                var modalForm = UIkit.modal("#modal_form", {
                    modal: false,
                    keyboard: false,
                    bgclose: false,
                    center: true
                });

                $scope.add = function (){
                    $scope.dataItem={useYn:true};
                    modalForm.show();
                }
                $scope.update = function (item){
                    $scope.dataItem=item;
                    modalForm.show();
                }

                if (sessionStorage.getItem('buttonData').includes("read")) {
                    $scope.mainGrid.toolbar = ["excel", "search"];
                }
                if (sessionStorage.getItem('buttonData').includes("create")) {
                    $scope.mainGrid.toolbar = [{ template: "<button class=\"k-button k-button-icontext\" ng-click='add()'><span class=\"k-icon k-i-plus\"></span>Нэмэх</button>" },"search"];
                }
                if (sessionStorage.getItem('buttonData').includes("update") || sessionStorage.getItem('buttonData').includes("edit")) {
                    $scope.mainGrid.columns.push({
                        command: [
                            { template: "<button class=\"k-button k-button-icontext\"  ng-click='update(dataItem)'><span class=\"k-icon k-i-edit\"></span></button>" },
                            { name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn" }
                        ], title: "&nbsp;", sticky: true, width: 100
                    });
                }
            }
        ]
    );
