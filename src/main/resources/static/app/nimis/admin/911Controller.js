angular.module("altairApp")
    .controller("911AdminCtrl", [
        "$rootScope",
        "$scope",
        "$state",
        "$timeout",
        "sweet",
        "__env",
        "commonDataSource",
        "mainService",
        function ($rootScope, $scope, $state, $timeout, sweet, __env, commonDataSource, mainService) {
            $scope.user = JSON.parse(sessionStorage.getItem("currentUser")).user;
            $scope.menuData = JSON.parse(sessionStorage.getItem("menuData"));
            $scope.app = {useYn: 1, fileIds: ""};

            $scope.dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: function (e) {
                            return __env.apiUrl() + "/api/admin/channel/list";
                        },
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
                        data: {sort: [{field: "id", dir: "desc"}]},
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
                        url: __env.apiUrl() + "/api/admin/channel",
                        contentType: "application/json; charset=UTF-8",
                        type: "DELETE",
                        beforeSend: function (req) {
                            req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
                        },
                        complete: function (e) {
                            $(".k-grid").data("kendoGrid").dataSource.read();
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
                            sponsorOrg: {editable: false},
                            checkOrg: {editable: false},
                            pipAmt: {type: "number"},
                        },
                    },
                },
                pageSize: 10,
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true,
            });
            $scope.dataSource.filter({
                logic: "or",
                sort: [{field: "id", dir: "asc"}],
                filters: [{field: "code", operator: "eq", value: '01'},{field: "code", operator: "eq", value: '02'}],
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
                pageable: {
                    pageSizes: [10, 50, 100],
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
                        field: "code",
                        title: "Төрөл",
                        width: 150,
                        values:[{"text":"Public","value":"01"},{"text":"Private","value":"02"}],
                        filterable: {cell: {operator: "contains", showOperators: false}},
                    },
                    {
                        field: "topic",
                        title: "Гарчиг",
                        template:"#if(imgUrl!=null){# <div class='avatar-photo' style='background-image: url(#:imgUrl#);'></div> #=topic#  #}#",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                    },
                    {
                        field: "descText",
                        title: "Тайлбар",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                    },
                    {
                        field: "subCnt",
                        title: "Хэрэглэгч",
                        width: 150,
                        attributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                        filterable: {cell: {operator: "contains", showOperators: false}},
                    },
                    {
                        field: "createdAt",
                        title: "Ирсэн огноо",
                        width: 150,
                        attributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                        filterable: {cell: {operator: "contains", showOperators: false}},
                    }
                ],
                dataBinding: function () {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                },
                editable: false,
                height: function () {
                    if ($scope.menuData.pageType === 0) {
                        return $(window).height() - 160;
                    }
                    return $(window).height() - 110;
                },
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
                                '<div class="flex gap-3"><button class="grid-btn k-grid-edit" style="margin-left: 10px;" ng-click=\'update(dataItem)\'><div class="nimis-icon edit"></div></button><button ng-click="delete(dataItem)" class="grid-btn k-grid-remove-command"><div class="nimis-icon delete"></div></button></div>',
                        },
                    ],
                    title: "&nbsp;",
                    width: 80,
                });
            }

            $scope.levelDataSource = commonDataSource.urlDataSource("/api/nms/resource/userLevel/list",
                JSON.stringify({
                    filter: { logic: "and",  filters: [{field: "useYn", operator: "eq", value: 1}]}, sort: [{field: "id", dir: "desc"}]
                })
            );

            var modalForm = UIkit.modal("#modal_form", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true,
                width: 600,
            });

            $scope.levelTypeSelect = function (selected) {
                $scope.userTypes=[];
                for(var i=0;i<selected.levelTypes.length;i++){
                    $scope.userTypes.push(selected.levelTypes[i].position);
                }
            };

            $scope.dataItem = {};
            $scope.add = function () {
                $scope.dataItem = {code:'01',useYn: 1};
                modalForm.show();
                $timeout(() => $rootScope.clearForm("validator"));
            };
            $scope.update = function (item) {
                mainService.withdomain("get", "/api/admin/channel/"+item.id).then(function (data) {
                    modalForm.show();
                    $scope.dataItem = data;
                    $scope.levelTypeSelect(data.level);
                });
            };

            $scope.formSubmit = function (type) {
                var validator = $("#validator").kendoValidator().data("kendoValidator");
                if (validator.validate()) {
                    var method = "post";
                    $scope.dataItem.level=null;
                    $scope.dataItem.userType=null;
                    if ($scope.dataItem.id !== undefined && $scope.dataItem.id !== null) method = "put";
                    mainService.withdata(method, "/api/admin/channel", $scope.dataItem).then(function (data) {
                        $rootScope.alert(true, "Амжилттай хадгаллаа.");
                        modalForm.hide();
                        $timeout(() => $rootScope.clearForm("validator"));
                        $(".k-grid").data("kendoGrid").dataSource.read();
                    });
                }
            };

            $scope.delete = function (item) {
                sweet.show(
                    {
                        title: "Устгах",
                        text: "Та энэ үйлдлийг хийхдээ итгэлтэй байна уу?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Тийм",
                        cancelButtonText: "Үгүй",
                        closeOnConfirm: true,
                        closeOnCancel: true,
                    },
                    function (inputvalue) {
                        if (inputvalue) {
                            mainService.withdomain("delete", __env.apiUrl() + "/api/admin/channel/delete/"+ item.id).then(function (data) {
                                $rootScope.alert(true, "Амжилттай.");
                                $(".k-grid").data("kendoGrid").dataSource.read();
                            });
                        }
                    }
                );
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
                                xhr.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
                            }
                        });
                    }
                },
                dropZone: ".dropZoneElement",
            };
        },
    ]);
