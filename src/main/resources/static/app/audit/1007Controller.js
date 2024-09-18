angular.module("altairApp")
    .controller("1007AdtCtrl", [
        "$rootScope",
        "$state",
        "$scope",
        "$timeout",
        "mainService",
        "commonDataSource",
        "sweet",
        "Upload",
        "orgTypes",
        "__env",
        function ($rootScope, $state, $scope, $timeout, mainService, commonDataSource, sweet, Upload,orgTypes, __env) {
            $scope.user = JSON.parse(sessionStorage.getItem("currentUser")).user;
            $("#header_main").attr("style", "filter: none !important;padding: 8px 25px");

            $scope.subDropDownOptions = {
                valueTemplate: "<span style='width:100px;margin-right:10px;' class='uk-text-right'>{{dataItem.code}}</span><span>#=name#</span>",
                template: "<span style='width:100px;margin-right:10px;' class='uk-text-right'>{{dataItem.code}}</span><span>#=name#</span>",
            };
            $scope.orgTypeDataSource = orgTypes;
            $scope.reportTypeDataSource = commonDataSource.urlPageDataSource("/api/adt/report/list",
                JSON.stringify({
                    filter: {
                        logic: "and",
                        filters: [{field: "useYn", operator: "eq", value: 1}]
                    }, sort: [{field: "name", dir: "asc"}]
                }),100
            );

            $scope.dropReportOptions = {
                dataTextField: "name",
                dataValueField: "id",
                placeholder: "Сонгох...",
                template:"<span class='w-full'><span ng-bind='dataItem.name'></span><span style='float: right' ng-bind='dataItem.code'></span></span>",
                valuePrimitive: true,
                autoBind: true
            };

            $scope.accountDataSource1 = commonDataSource.urlDataSource("/api/adt/account/list", JSON.stringify({
                filter: {
                    logic: "and",
                    filters: [{field: "useYn", operator: "eq", value: 1}]
                }, sort: [{field: "name", dir: "asc"}]
            }));

            $scope.accountDataSource2 = commonDataSource.urlDataSource("/api/adt/account/list", JSON.stringify({
                filter: {
                    logic: "and",
                    filters: [{field: "useYn", operator: "eq", value: 1}]
                }, sort: [{field: "name", dir: "asc"}]
            }));

            $scope.accSelect = true;
            $timeout(function () {
                $('#sliderGallery').lightGallery({
                    selector: '.item',
                    thumbnail: true,
                    animateThumb: false,
                    showThumbByDefault: false
                })

                $("#sliderGallery").each(function () {
                    $(this).lightGallery({
                        selector: '.item',
                    });
                });
            }, 100);
            $scope.appDataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: __env.apiUrl() + "/api/adt/validation/list",
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
                        data: {
                            custom: {
                                logic: "and",
                                filters: [
                                    {field: "fundTp", operator: "contains", value: sessionStorage.getItem("budgetCode")},
                                ],
                            },
                        },
                        beforeSend: function (req) {
                            if (JSON.parse(sessionStorage.getItem("currentUser")) != null) {
                                req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
                            } else {
                                $state.go("login");
                                $rootScope.$broadcast("LogoutSuccessful");
                            }
                        },
                    },
                    destroy: {
                        url: __env.apiUrl() + "/api/adt/validation",
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
                    },
                },
                schema: {
                    data: "data",
                    total: "total",
                    model: {
                        id: "id",
                        fields: {
                            id: {type: "number", nullable: true}
                        }
                    }
                },
                pageSize: 20,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
            });
            $scope.mainGrid = {
                sortable: true,
                resizable: true,
                persistSelection: true,
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5,
                },
                filterable: {
                    mode: "row",
                    extra: false,
                    cell: {
                        operator: "eq",
                    },
                },
                columns: [
                    {
                        title: "#",
                        headerAttributes: {
                            "class": "checkbox-align",
                        },
                        attributes: {style: "text-align: center;"},
                        template: "#= ++record #",
                        width: 50,
                    },
                    {
                        field: "orgTpNm",filterable: {cell: {operator: "contains", showOperators: false}}, headerAttributes: {"class": "checkbox-align"},
                        title: "Байгууллага", attributes: {style: "text-align: center;"}, width: 100
                    },
                    {
                        title: "Үзүүлэлт-1",
                        columns:[
                            {
                                field: "repNm1", filterable: {cell: {operator: "contains", showOperators: false}},
                                headerAttributes: {"class": "columnHeader"}, title: "Тайлан", width: 80
                            },
                            {
                                field: "accCode1", filterable: {cell: {operator: "contains", showOperators: false}},
                                headerAttributes: {"class": "columnHeader"}, title: "Код", width: 80
                            },
                            {
                                field: "accNm1", filterable: {cell: {operator: "contains", showOperators: false}},
                                headerAttributes: {"class": "columnHeader"}, title: "Нэр", width: 200
                            },
                            {
                                field: "accPos", filterable: {cell: {operator: "contains", showOperators: false}},
                                headerAttributes: {"class": "columnHeader"}, title: " Үлдэгдэл", width: 120
                            },
                            {
                                field: "formula1", filterable: {cell: {operator: "contains", showOperators: false}},
                                headerAttributes: {"class": "columnHeader"}, title: "Формула", width: 150
                            },
                        ]
                    },
                    {
                        field: "operatorNm",filterable: {cell: {operator: "contains", showOperators: false}}, headerAttributes: {"class": "checkbox-align"},
                        title: "Тулгалт", attributes: {style: "text-align: center;"}, width: 100
                    },
                    {
                        title: "Үзүүлэлт-2",
                        columns:[
                            {
                                field: "indicator2", filterable: {cell: {operator: "contains", showOperators: false}},
                                headerAttributes: {"class": "columnHeader"}, title: "Тулгалт хийгдэж буй үзүүлэлт", width: 300
                            },
                            {
                                field: "formula2", filterable: {cell: {operator: "contains", showOperators: false}},
                                headerAttributes: {"class": "columnHeader"}, title: "Формула 2", width: 200
                            }
                        ]
                    }
                ],
                editable: "inline",
                dataBinding: function () {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                },
                height: function () {
                    return $(window).height() - 116;
                }
            };

            if (sessionStorage.getItem("buttonData").includes("read")) {
                $scope.mainGrid.toolbar = ["excel", "search"];
            }
            if (sessionStorage.getItem("buttonData").includes("create")) {
                $scope.mainGrid.toolbar = [{template: "<button class='md-btn custom-btn' ng-click='add()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>"}];
            }
            if (sessionStorage.getItem("buttonData").includes("update") || sessionStorage.getItem("buttonData").includes("edit")) {
                $scope.mainGrid.columns.push({
                    command: [
                        {
                            template:
                                '<div class="k-command-cell command-container" style="margin-left:5px;">' +
                                '<a ng-show="editAble!=dataItem.id" ng-click="update(dataItem)" class="grid-btn"><div class="nimis-icon edit"></div></a>' +
                                '<a ng-show="editAble!=dataItem.id" class="grid-btn k-grid-remove-command"><div class="nimis-icon delete"></div></a>' +
                                '<a ng-show="editAble==dataItem.id" ng-click="editMode(true,dataItem)" class="grid-btn k-grid-save-command"><div class="nimis-icon update"></div></a> ' +
                                '<a ng-show="editAble==dataItem.id" ng-click="editMode(true,dataItem)"  class="grid-btn k-grid-cancel-command"><div class="nimis-icon cancel"></div></a>' +
                                '</div>',
                        },
                    ],
                    title: "&nbsp;",
                    width: 80,
                });
            }

            $scope.dropOptions = {
                dataTextField: "comCdNm",
                dataValueField: "id",
                placeholder: "Сонгох...",
                valuePrimitive: true,
                autoBind: true
            };
            var modalForm = UIkit.modal("#modal_form", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true,
                width: 600,
            });

            $scope.update=function (item){
                $scope.dataItem = item;
                $timeout(function (){
                    modalForm.show();
                },500)
            }

            $scope.dataItem = {};
            $scope.editAble = 0;
            $scope.add = function (type) {
                $scope.dataItem = {useYn: 1,accPos:'Эцсийн үлдэгдэл',operator:"eq"};
                modalForm.show();
            };
            $scope.editMode = function (bool, item) {
                if (bool) {
                    $scope.editAble = 0;
                } else {
                    $scope.editAble = item.id;
                }
            }

            $scope.formSubmit = function () {
                var validator = $("#validator").kendoValidator().data("kendoValidator");
                if (validator.validate()) {
                    var method = "post";
                    if ($scope.dataItem.id!==undefined && $scope.dataItem.id!==null) method="put";
                    mainService.withdata(method, "/api/adt/validation", $scope.dataItem).then(function (data) {
                        $rootScope.alert(true, "Амжилттай хадгаллаа.");
                        modalForm.hide();
                        $(".k-grid").data("kendoGrid").dataSource.read();
                    });
                }
            };
        },
    ]);
