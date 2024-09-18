angular.module("altairApp")
    .controller("1003AdtCtrl", [
        "$rootScope",
        "$state",
        "$scope",
        "$timeout",
        "mainService",
        "commonDataSource",
        "sweet",
        "Upload",
        "__env",
        function ($rootScope, $state, $scope, $timeout, mainService, commonDataSource, sweet, Upload, __env) {
            $scope.user = JSON.parse(sessionStorage.getItem("currentUser")).user;
            $("#header_main").attr("style", "filter: none !important;padding: 8px 25px");

            $scope.factorDataSource = commonDataSource.urlDataSource("/api/adt/factor/list",
                JSON.stringify({
                    filter: {
                        logic: "and",
                        filters: [{field: "useYn", operator: "eq", value: 1}]
                    }, sort: [{field: "name", dir: "asc"}]
                })
            );

            $scope.appDataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: __env.apiUrl() + "/api/adt/factor/list",
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
                        data: {
                            custom: {
                                logic: "and",
                                filters: [
                                    {field: "useYn", operator: "eq", value: 1},
                                ],
                            },
                            sort: [{field: "parentId", dir: "asc"}]
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
                    update: {
                        url: __env.apiUrl() + "/api/adt/factor/submit",
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
                        beforeSend: function (req) {
                            req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                        },
                        complete: function (e) {
                            $(".k-grid").data("kendoGrid").dataSource.read();
                        }
                    },
                    destroy: {
                        url: __env.apiUrl() + "/api/adt/factor",
                        contentType: "application/json; charset=UTF-8",
                        type: "DELETE",
                        beforeSend: function (req) {
                            req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                        },
                        complete: function (e) {
                            $(".k-grid").data("kendoGrid").dataSource.read();
                        }
                    },
                    create: {
                        url: __env.apiUrl() + "/api/adt/factor/submit",
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
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
                group: [{
                    field: "parentNm",
                    dir: "asc"
                }],
                schema: {
                    data: "data",
                    total: "total",
                    model: {
                        id: "id",
                        fields: {
                            id: {type: "number", nullable: true},
                            parentId: {type: "number", nullable: true},
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
                        width: 60,
                    },
                    {
                        field: "name",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        headerAttributes: {"class": "columnHeader"},
                        title: 'Хүчин зүйлсийн нэр'
                    },
                    {field: "parentNm",hidden:true,template:"#if(parentId!=null){# <span class='uk-badge' style='border-radius: 50px;background: rgba(218,244,235,255); color:rgba(78,203,157,255);font-weight: bold;'>#=parentNm#</span> #}else{# #=parentNm# #}#",filterable: { cell: { operator: "eq", showOperators: false } },headerAttributes: {"class": "columnHeader"}, title: 'Төрөл'},
                    {
                        field: "confNm",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        headerAttributes: {"class": "columnHeader"},
                        width: 150,
                        title: 'Ангилал'
                    },
                    /*{
                        field: "sample",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        headerAttributes: {"class": "columnHeader"},
                        title: 'Жишээ'
                    }*/
                ],
                dataBinding: function () {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                },
                editable: "inline",
                height: function () {
                    return $(window).height() - 110;
                },
            };

            /*if (sessionStorage.getItem("buttonData").includes("read")) {
                $scope.mainGrid.toolbar = ["excel", "search"];
            }
            if (sessionStorage.getItem("buttonData").includes("create")) {
                $scope.mainGrid.toolbar = [{template: "<button class='md-btn custom-btn k-grid-add' ng-click='add()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>"}];
            }
            if (sessionStorage.getItem("buttonData").includes("update") || sessionStorage.getItem("buttonData").includes("edit")) {
                $scope.mainGrid.columns.push({
                    command: [
                        {
                            template:
                                '<div class="command-container"><a class="grid-btn k-grid-edit"><div class="nimis-icon edit"></div></a><a class="grid-btn k-grid-remove-command"><div class="nimis-icon delete"></div></a><a class="grid-btn k-grid-update"><div class="nimis-icon update"></div></a> <a class="grid-btn k-grid-cancel"><div class="nimis-icon cancel"></div></a></div>',
                        },
                    ],
                    title: "&nbsp;",
                    width: 80,
                });
            }*/

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
                if (item.noticeIds != null && item.noticeIds.length > 0 && item.noticeIds.includes(',')) {
                    $scope.dataItem.notices = item.noticeIds.split(',');
                } else if (item.noticeIds != null && item.noticeIds.length > 0) {
                    $scope.dataItem.notices = [item.noticeIds];
                } else {
                    $scope.dataItem.notices = [];
                }

                $scope.factorDataSource.filter({
                    logic: "and",
                    sort: [{field: "id", dir: "asc"}],
                    filters: [{field: "useYn", operator: "eq", value: 1},{field: "id", operator: "neq", value: item.id}],
                });
                modalForm.show();
            }

            $scope.dataItem = {};
            $scope.editAble = 0;
            $scope.add = function (type) {
                $scope.dataItem = {confType: 0, useYn: 1, parentId: null};
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
                    if ($scope.dataItem.confType === 0) $scope.dataItem.parentId = null;
                    if ($scope.dataItem.confType === 1) $scope.dataItem.parentId = $scope.dataItem.confId;
                    var method = "post";
                    //if ($scope.dataItem.id!==undefined && $scope.dataItem.id!==null) method="put";
                    mainService.withdata(method, "/api/adt/factor/submit", $scope.dataItem).then(function (data) {
                        $rootScope.alert(true, "Амжилттай хадгаллаа.");
                        modalForm.hide();
                        $(".k-grid").data("kendoGrid").dataSource.read();
                    });
                }
            };
        },
    ]);
