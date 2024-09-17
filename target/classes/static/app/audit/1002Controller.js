angular.module("altairApp")
    .controller("1002AdtCtrl", [
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
            $scope.user = JSON.parse(localStorage.getItem("currentUser")).user;
            $("#header_main").attr("style", "filter: none !important;padding: 8px 25px");

            $scope.workDataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: __env.apiUrl() + "/api/adt/form/note/list",
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
                            if (JSON.parse(localStorage.getItem("currentUser")) != null) {
                                req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
                            } else {
                                $state.go("login");
                                $rootScope.$broadcast("LogoutSuccessful");
                            }
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
                            id: {type: "number",nullable:true},
                        }
                    }
                },
                pageSize: 100,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
            });
            $scope.appDataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: __env.apiUrl() + "/api/adt/form/note/list",
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
                            if (JSON.parse(localStorage.getItem("currentUser")) != null) {
                                req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
                            } else {
                                $state.go("login");
                                $rootScope.$broadcast("LogoutSuccessful");
                            }
                        },
                    },
                    destroy: {
                        url: __env.apiUrl() + "/api/adt/form/note",
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
                        beforeSend: function(req) {
                            req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
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
                pageSize: 100,
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
                    {field: "confTypeNm",  width: 120, filterable: { cell: { operator: "contains", showOperators: false } },headerAttributes: {"class": "columnHeader"},title: 'Төрөл'},
                    {field: "auditTypeNm", width: 250, filterable: { cell: { operator: "contains", showOperators: false } },headerAttributes: {"class": "columnHeader"},title: 'Аудит хийх хэлбэр'},
                    {field: "name", template: "<span style='margin-left: {{dataItem.lvl*20}}px' ng-bind='dataItem.name'></span>", filterable: { cell: { operator: "contains", showOperators: false } },headerAttributes: {"class": "columnHeader"},title: 'Ажлын нэр'},
                 /*   {field: "description",  filterable: { cell: { operator: "contains", showOperators: false } },headerAttributes: {"class": "columnHeader"},title: 'Тайлбар'},*/
                    {field: "formName",width: 130,filterable: { cell: { operator: "contains", suggestionOperator:"contains",showOperators: false } },headerAttributes: {"class": "columnHeader"},title: 'Маягтын нэр'},
                    {field: "formNo",width: 130,
                        filterable: { cell: { operator: "contains", suggestionOperator:"contains", showOperators: false } },
                        headerAttributes: {"class": "columnHeader"},title: 'Маягтын дугаар'
                    },
                    {field: "orderNo",  width: 100,
                        filterable: { cell: { operator: "contains", suggestionOperator:"contains", showOperators: false } },
                        headerAttributes: {"class": "columnHeader"},title: 'Дараалал'
                    },
                    {field: "fileNm",width: 150,
                        template: "<a ng-if='dataItem.fileId!=null' class='uk-text-primary' href='{{dataItem.fileUri}}' target='_blank'>{{dataItem.fileNm}}</a>",
                        filterable: { cell: { operator: "contains", suggestionOperator:"contains", showOperators: false } },
                        headerAttributes: {"class": "columnHeader"},title: 'Загвар'
                    }
                ],
                dataBinding: function () {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                },
                editable:"inline",
                height: function () {
                    return $(window).height() - 110;
                },
            };

            if (localStorage.getItem("buttonData").includes("read")) {
                $scope.mainGrid.toolbar = ["excel", "search"];
            }
            if (localStorage.getItem("buttonData").includes("create")) {
                $scope.mainGrid.toolbar = [{template: "<button class='md-btn custom-btn' ng-click='add()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>"}];
            }
            if (localStorage.getItem("buttonData").includes("update") || localStorage.getItem("buttonData").includes("edit")) {
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

            $scope.update=function (item){
                $scope.dataItem = item;
               /* if (item.noticeIds != null && item.noticeIds.length > 0 && item.noticeIds.includes(',')) {
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
                });*/
                modalForm.show();
            }

            $scope.dataItem = {};
            $scope.editAble = 0;
            $scope.add = function (type) {
                $scope.dataItem = {auditType: 1,confType: 1, useYn: 1, parentId: null};
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
                    if ($scope.dataItem.id!==undefined && $scope.dataItem.id!==null) method="put";
                    mainService.withdata(method, "/api/adt/form/note", $scope.dataItem).then(function (data) {
                        $rootScope.alert(true, "Амжилттай хадгаллаа.");
                        modalForm.hide();
                        $(".k-grid").data("kendoGrid").dataSource.read();
                    });
                }
            };

            $scope.fileDtl = null;
            $scope.onSelect = function (e) {
                $scope.fileDtl = null;
            };
            $scope.fileOptions = {
                multiple: true,
                autoUpload: false,
                async: {
                    saveUrl: __env.apiUrl() + "/api/file/uploadFile",
                    removeUrl: __env.apiUrl() + "/api/file/delete",
                    //  autoUpload: true,
                },
                showFileList: false,
                remove: function (e) {
                    if ($scope.createLink) {
                        $.ajax({
                            url: __env.apiUrl() + "/api/file/delete",
                            type: "DELETE",
                            success: function (response) {
                            },
                            data: JSON.stringify($scope.createLink),
                            dataType: "json",
                            contentType: "application/json; charset=utf-8",
                        });
                    }
                    $(".k-widget.k-upload").find("ul").remove();
                    $(".k-upload-status").remove();
                    $scope.createLink = null;
                    e.preventDefault();
                },
                success: function (e) {
                    if (e.operation == "upload") {
                        $scope.dataItem.fileId = e.response.id;
                    }
                    $scope.fileDtl = e.response;
                },
                upload: function (e) {
                    var xhr = e.XMLHttpRequest;
                    if (xhr) {
                        xhr.addEventListener("readystatechange", function (e) {
                            if (xhr.readyState == 1 /* OPENED */) {
                                xhr.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
                            }
                        });
                    }
                },
                dropZone: ".dropZoneElement",
            };


        },
    ]);
