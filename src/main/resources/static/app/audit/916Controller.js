angular.module("altairApp")
    .controller("916NmsCtrl", [
        "$rootScope",
        "$state",
        "$scope",
        "$timeout",
        "mainService",
        "commonDataSource",
        "Upload",
        "$http",
        "__env",
        function ($rootScope, $state, $scope, $timeout, mainService, commonDataSource, Upload, $http, __env) {
            $scope.user = JSON.parse(sessionStorage.getItem("currentUser")).user;
            $scope.menuData = JSON.parse(sessionStorage.getItem("menuData"));

            $scope.tezTypeDataSource = commonDataSource.urlDataSource("/api/nms/common/list",
                JSON.stringify({
                    filter: {
                        logic: "and",
                        filters: [{field: "useYn", operator: "eq", value: 1}, {
                            field: "parentId",
                            operator: "isnull",
                            value: false
                        }, {field: "grpCd", operator: "eq", value: "tezType"}]
                    }, sort: [{field: "comCd", dir: "desc"}]
                })
            );
            $scope.selectOptions = {
                placeholder: "Сонгох...",
                dataTextField: "comCdNm",
                dataValueField: "id",
                valuePrimitive: true,
                autoBind: true
            };
            $scope.dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "/api/adt/department/list",
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
                        data: {sort: [{field: "ordNo", dir: "asc"}]},
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
                        url: __env.apiUrl() + "/api/adt/department",
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
                            id: {type: "number", nullable: true},
                            name: {type: "string", validation: {required: true}},
                            ordNo: {type: "number", validation: {required: true}},
                            useYn: {type: "number", defaultValue: 1},
                        },
                    },
                },
                pageSize: 20,
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true,
            });
            $scope.dataSource.filter({
                logic: "and",
                sort: [{field: "id", dir: "asc"}],
                filters: [{field: "useYn", operator: "eq", value: 1}],
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
                excel: {
                    fileName: "Projects.xlsx",
                    allPages: true,
                    filterable: true,
                },
                sortable: true,
                resizable: true,
                reorderable: true,
                pageable: {
                    pageSizes: [10, 50, 100, "All"],
                    refresh: true,
                    pageSize: 10,
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
                    {
                        field: "name",
                        template: "#if(image!=null){# <div class='avatar-photo' style='background-image: url(#:image.uri#);'></div> <div class='user-name'>#: name # </div>#}else{# #: name # #}#",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        headerAttributes: {class: "columnHeader"},
                        title: "Нэр",
                    },
                    {
                        field: "shortName",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        headerAttributes: {class: "columnHeader"},
                        title: "Товчлол",
                        width: 150
                    },
                    {
                        field: "ordNo",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        headerAttributes: {class: "columnHeader"},
                        title: "Эрэмбэ",
                        width: 150
                    },
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
                },
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
                        $scope.dataItem.imageId = e.response.id;
                    }
                    $scope.fileDtl = e.response;
                },
                upload: function (e) {
                    var xhr = e.XMLHttpRequest;
                    if (xhr) {
                        xhr.addEventListener("readystatechange", function (e) {
                            if (xhr.readyState == 1 /* OPENED */) {
                                xhr.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
                            }
                        });
                    }
                },
                dropZone: ".dropZoneElement",
            };

            if (sessionStorage.getItem("buttonData").includes("read")) {
                $scope.mainGrid.toolbar = ["excel", "search"];
            }
            if (sessionStorage.getItem("buttonData").includes("create")) {
                $scope.mainGrid.toolbar = [{template: "<button class='md-btn custom-btn' ng-click='add()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>"}, "search"];
            }
            if (sessionStorage.getItem("buttonData").includes("update") || sessionStorage.getItem("buttonData").includes("edit")) {
                $scope.mainGrid.columns.push({
                    command: [
                        {
                            template:
                                '<div class="flex gap-3"><button style="margin-left: 10px;" class="grid-btn k-grid-edit" ng-click=\'update(dataItem)\'><div class="nimis-icon edit"></div></button><button class="grid-btn k-grid-remove-command" ng-click=\'deleteData(dataItem)\'><div class="nimis-icon delete"></div></button></div>',
                        },
                    ],
                    title: "&nbsp;",
                    sticky: true,
                    width: 90,
                });
            }

            var modalForm = UIkit.modal("#modal_form", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true,
            });

            $scope.dataItem = {};
            $scope.add = function () {
                $scope.dataItem = {useYn: 1};
                modalForm.show();
                $timeout(() => $rootScope.clearForm("validator"));
            };
            $scope.update = function (item) {
                $scope.dataItem = item;
                modalForm.show();
            };

            $scope.formSubmit = function (type) {
                var validator = $("#validator").kendoValidator().data("kendoValidator");
                if (validator.validate()) {
                    var method = "post";
                    if ($scope.dataItem.id !== undefined && $scope.dataItem.id !== null) method = "put";
                    mainService.withdata(method, "/api/adt/department", $scope.dataItem).then(function (data) {
                        $rootScope.alert(true, "Амжилттай хадгаллаа.");
                        if (type === 1) {
                            modalForm.hide();
                        }
                        $timeout(() => $rootScope.clearForm("validator"));
                        $(".k-grid").data("kendoGrid").dataSource.read();
                    });
                }
            };
        },
    ]);
