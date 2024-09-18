angular.module("altairApp")
    .controller("1005AdtCtrl", [
        "$rootScope",
        "$state",
        "$scope",
        "$timeout",
        "mainService",
        "commonDataSource",
        "sweet",
        "Upload",
        "__env",
        function ($rootScope, $state, $scope, $timeout, mainService, commonDataSource, sweet, Upload,  __env) {
            $scope.user = JSON.parse(sessionStorage.getItem("currentUser")).user;
            $("#header_main").attr("style", "filter: none !important;padding: 8px 25px");

            $scope.typeDataSource = commonDataSource.urlDataSource("/api/nms/common/list",
                JSON.stringify({ filter: { logic: "and", filters: [{ field: "useYn", operator: "eq", value: 1 },{ field: "parentId", operator: "isnull", value: false },{ field: "grpCd", operator: "eq", value: "riskType" }] }, sort: [{ field: "orderId", dir: "asc" }] })
            );
            $scope.catDataSource = commonDataSource.urlDataSource("/api/nms/common/list",
                JSON.stringify({ filter: { logic: "and", filters: [{ field: "useYn", operator: "eq", value: 1 },{ field: "parentId", operator: "isnull", value: false },{ field: "grpCd", operator: "eq", value: "categoryType" }] }, sort: [{ field: "orderId", dir: "asc" }] })
            );
            $scope.stepDataSource = commonDataSource.urlDataSource("/api/nms/common/list",
                JSON.stringify({ filter: { logic: "and", filters: [{ field: "useYn", operator: "eq", value: 1 },{ field: "parentId", operator: "isnull", value: false },{ field: "grpCd", operator: "eq", value: "stepType" }] }, sort: [{ field: "orderId", dir: "asc" }] })
            );
            $scope.directionDataSource = commonDataSource.urlDataSource("/api/adt/direction/list",
                JSON.stringify({ filter: { logic: "and", filters: [{ field: "useYn", operator: "eq", value: 1 }] }, sort: [{ field: "name", dir: "asc" }] })
            );
            $scope.directionOptions = {
                placeholder: "Чиглэл сонгох...",
                dataTextField: "name",
                dataValueField: "id",
                valuePrimitive: true,
                autoBind: true,
                dataSource:$scope.directionDataSource
            };

            $scope.appDataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: __env.apiUrl() + "/api/adt/risk/list",
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
                        data: {
                            custom: {
                                logic: "and",
                                filters: [
                                    {field: "useYn", operator: "eq", value: 1},
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
                        url: __env.apiUrl() + "/api/adt/risk",
                        contentType: "application/json; charset=UTF-8",
                        type: "DELETE",
                        beforeSend: function(req) {
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
                            id: {type: "number",nullable:true},
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
                        headerAttributes: {class: "columnCenter"},
                        attributes: {style: "text-align: center;"},
                        template: "#= ++record #",
                        stickable: true,
                        width: 60,
                    },
                    {field: "name",  filterable: { cell: { operator: "contains", suggestionOperator:"contains",showOperators: false } },headerAttributes: {"class": "columnHeader"},title: 'Нэр'},
                    {field: "dirNm", filterable: { cell: { operator: "contains", suggestionOperator:"contains", showOperators: false } }, headerAttributes: {"class": "columnHeader"},title: 'Чиглэл'},
                    {field: "typeNm", filterable: { cell: { operator: "contains", suggestionOperator:"contains",showOperators: false } },headerAttributes: {"class": "columnHeader"},title: 'Төрөл'},
                    {field: "catNm", filterable: { cell: { operator: "contains", suggestionOperator:"contains",showOperators: false } },headerAttributes: {"class": "columnHeader"},title: 'Эрсдэлийн ангилал'},
                    {field: "stepNm", filterable: { cell: { operator: "contains", suggestionOperator:"contains", showOperators: false } }, headerAttributes: {"class": "columnHeader"},title: 'Аудитын үе шат'},
                ],
                dataBinding: function () {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                },
                editable:"inline",
                height: function () {
                    return $(window).height() - 110;
                }
            };

            if (sessionStorage.getItem("buttonData").includes("edit")) {
                $scope.mainGrid.toolbar = [{template: "<a class='gridBtn custom-btn' ng-click='add()'><span class=\"k-icon k-i-plus\"></span>Нэмэх</a>"}];
            }

            if (sessionStorage.getItem("buttonData").includes("update") || sessionStorage.getItem("buttonData").includes("edit")) {
                $scope.mainGrid.columns.push({
                    command: [
                        {
                            template:
                                '<div class="command-container"><a ng-click="update(dataItem)" class="grid-btn"><div class="nimis-icon edit"></div></a><a class="grid-btn k-grid-delete"><div class="nimis-icon delete"></div></a><a class="grid-btn k-grid-update"><div class="nimis-icon update"></div></a> <a class="grid-btn k-grid-cancel"><div class="nimis-icon cancel"></div></a></div>',
                        },
                    ],
                    title: "&nbsp;",
                    width: 100,
                });
            }

            var modalForm = UIkit.modal("#modal_form", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true,
                width: 600,
            });

            $scope.dataItem = {};

            $scope.add = function () {
                $scope.dataItem = {useYn: 1};
                modalForm.show();
                $timeout(() => $rootScope.clearForm("validator"));
            };
            $scope.update = function (item) {
                $scope.dataItem = item;
                if(item.dirIds!=null && item.dirIds.length>0 && item.dirIds.includes(',')){
                    $scope.dataItem.directions = item.dirIds.split(',');
                }else if(item.dirIds!=null && item.dirIds.length>0 ){
                    $scope.dataItem.directions=[item.dirIds];
                }
                else {
                    $scope.dataItem.directions=[];
                }
                modalForm.show();
            };

            $scope.formSubmit = function (type) {
                var validator = $("#validator").kendoValidator().data("kendoValidator");
                if (validator.validate()) {
                    var method="post";
                   // if ($scope.dataItem.id!==undefined && $scope.dataItem.id!==null) method="put";
                    mainService.withdata(method, "/api/adt/risk/submit", $scope.dataItem).then(function (data) {
                        $rootScope.alert(true, "Амжилттай хадгаллаа.");
                        if(type===1){
                            modalForm.hide();
                        }
                        $timeout(() => $rootScope.clearForm("validator"));
                        $(".k-grid").data("kendoGrid").dataSource.read();
                    });
                }
            };
        },
    ]);
