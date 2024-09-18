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

            $scope.tryOutDataSource = commonDataSource.urlDataSource("/api/adt/try/out/list",
                JSON.stringify({ filter: { logic: "and", filters: [{ field: "useYn", operator: "eq", value: 1 }] }, sort: [{ field: "name", dir: "asc" }] })
            );
            $scope.confirmationStatementDataSource = commonDataSource.urlDataSource("/api/nms/common/list",
                JSON.stringify({
                    filter: {
                        logic: "and",
                        filters: [{field: "useYn", operator: "eq", value: 1}, {
                            field: "parentId",
                            operator: "isnull",
                            value: false
                        }, {field: "grpCd", operator: "eq", value: "confirmationStatement"}]
                    }, sort: [{field: "orderId", dir: "asc"}]
                })
            );

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

            $scope.selectOptions = {
                placeholder: "Сонгох...",
                dataTextField: "name",
                dataValueField: "id",
                valuePrimitive: true,
                autoBind: true,
                dataSource:$scope.tryOutDataSource
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
                    {field: "typeNm", width: 150, filterable: { cell: { operator: "contains", suggestionOperator:"contains", showOperators: false } }, headerAttributes: {"class": "columnHeader"},title: 'АГАДҮТ'},
                    {field: "confNm", width: 150, filterable: { cell: { operator: "contains", suggestionOperator:"contains", showOperators: false } }, headerAttributes: {"class": "columnHeader"},title: 'Батламж мэдэгдэл'},
                    {field: "confDesc", width: 250, filterable: { cell: { operator: "contains", suggestionOperator:"contains", showOperators: false } }, headerAttributes: {"class": "columnHeader"},title: 'Батламж мэдэгдэл тайлбар'},
                    {field: "name",  width: 300, filterable: { cell: { operator: "contains", suggestionOperator:"contains",showOperators: false } },headerAttributes: {"class": "columnHeader"},title: 'Батламж мэдэгдэл хангахгүй байх эрсдэл'},
                    {field: "tryNm", width: 350, filterable: { cell: { operator: "contains", suggestionOperator:"contains",showOperators: false } },headerAttributes: {"class": "columnHeader"},title: ' Эрсдэл байхгүйг нотлох гүйцэтгэх горим, сорил'},
                    {field: "tryDesc",template: "<span style='display:block;text-align: justify;' ng-bind-html='dataItem.tryDesc'></span>", filterable: { cell: { operator: "contains", suggestionOperator:"contains",showOperators: false } },headerAttributes: {"class": "columnHeader"},title: 'Горим, сорил тайлбар'},
                ],
                dataBinding: function () {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                },
                editable:"inline",
                height: function () {
                    return $(window).height() - 110;
                }
            };

            if (sessionStorage.getItem("buttonData").includes("create")) {
                $scope.mainGrid.toolbar = [{template: "<button class='md-btn custom-btn' ng-click='add()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>"}];
            }
            if (sessionStorage.getItem("buttonData").includes("update") || sessionStorage.getItem("buttonData").includes("edit")) {
                $scope.mainGrid.columns.push({
                    command: [
                        {
                            template:
                                '<div class="k-command-cell command-container">' +
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

            var modalForm = UIkit.modal("#modal_form", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true,
                width: 600,
            });

            $scope.dataItem = {};
            $scope.editAble = 0;

            $scope.add = function () {
                $scope.dataItem = {useYn: 1};
                modalForm.show();
                $timeout(() => $rootScope.clearForm("validator"));
            };
            $scope.update = function (item) {
                $scope.dataItem = item;
                if(item.tryIds!=null && item.tryIds.length>0 && item.tryIds.includes(',')){
                    $scope.dataItem.tryIds = item.tryIds.split(',');
                }else if(item.dirIds!=null && item.dirIds.length>0 ){
                    $scope.dataItem.tryIds=[item.dirIds];
                }
                else {
                    $scope.dataItem.tryIds=[];
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
