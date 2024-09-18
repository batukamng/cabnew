angular.module("altairApp")
    .controller("feedback", [
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
            $scope.item={useYn: 1};
            $scope.images = [];
            $scope.isAdmin = false;
            if ($scope.user.level.code === "001") $scope.isAdmin = true;

            console.log($scope.user.level.code );
            console.log($scope.isAdmin);

            $scope.feedbackTypeSource = commonDataSource.urlDataSource("/api/nms/common/list",
                JSON.stringify({ filter: { logic: "and", filters: [{ field: "grpCd", operator: "eq", value: "feedbackType" },{ field: "useYn", operator: "eq", value: 1 },{ field: "parentId", operator: "isnull", value: false }] }, sort: [{ field: "id", dir: "asc" }] })
            );

            $scope.getDatasource = function () {
                mainService.withdata("get", __env.apiUrl() + "/api/admin/feedback/item/" + $scope.user.id).then(function (data) {
                    $scope.feedbackSource = data;
                });
            };
            $scope.app={};
            //Санал хүсэлтийн жагсаалт
            $scope.getDatasource();
            $scope.clickItem = function (item) {
                $scope.item = item;

                $scope.app.id = item.id;
                $scope.app.replyData = "";
                UIkit.modal("#modal_view",{
                    modal: false,
                    keyboard: false,
                    bgclose: false,
                    center: true,
                }).show();
            };

            $scope.fileArr=function (str){
                var  fileArray=[];
                if(str!==undefined && str.indexOf(",")){
                    fileArray=str.split(',');
                }
                else{
                    fileArray.push(str);
                }
                return fileArray;
            }

            $scope.send = function () {
                var validator = $("#sendFeedback").kendoValidator().data("kendoValidator");
                if (validator.validate()) {
                    UIkit.modal("#modal_loader").show();
                    $scope.app.status = 1;
                    $scope.app.sendType = 1;
                    $scope.app.senderName = $scope.user.username;
                    if ($scope.user.phone != null) $scope.app.senderPhone = $scope.user.phone;

                    if ($scope.images.length > 0) {
                        $scope.app.filesArr=$scope.images.map((i) => i.id);
                    }

                    mainService.withResponse("post", __env.apiUrl() + "/api/admin/feedback/submit", $scope.app).then(function (data) {
                        if (data.status === 200) {
                            UIkit.modal("#modal_loader").hide();
                            $rootScope.alert(true, "Амжилттай хадгаллаа.");
                            UIkit.modal("#modal_funding").hide();
                            $timeout(() => $rootScope.clearForm("sendFeedback"));
                            $scope.app = {useYn: 1};
                            $scope.images = [];
                            $scope.getDatasource();
                        } else {
                            $rootScope.alert(false, "Алдаа гарлаа.");
                        }
                    });
                } else {
                    $rootScope.alert(false, "Бүрэн бөглөнө үү.");
                }
            };
            $scope.reply = function () {
                var validator = $("#validator").kendoValidator().data("kendoValidator");
                if (validator.validate()) {
                    UIkit.modal("#modal_loader").show();
                    $scope.app.status = 2;
                    $scope.app.sendType = 2;
                    mainService.withResponse("post", __env.apiUrl() + "/api/admin/feedback/reply", $scope.app).then(function (data) {
                        if (data.status === 200) {
                            UIkit.modal("#modal_loader").hide();
                            $rootScope.alert(true, "Амжилттай хадгаллаа.");
                            UIkit.modal("#modal_view").hide();
                            $(".k-grid").data("kendoGrid").dataSource.read();
                            $scope.getDatasource();
                        } else {
                            $rootScope.alert(false, "Алдаа гарлаа.");
                        }
                    });
                } else {
                    $rootScope.alert(false, "Хариу бичнэ үү.");
                }
            };

            $scope.dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: function (e) {
                            return __env.apiUrl() + "/api/admin/feedback/list";
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
                        url: __env.apiUrl() + "/api/admin/feedback/",
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
                        field: "createdAt",
                        title: "Ирсэн огноо",
                        width: 150,
                        filterable: {cell: {operator: "contains", showOperators: false}},
                    },
                    {
                        field: "senderName",
                        title: "Хэрэглэгч",
                        width: 150,
                        filterable: {cell: {operator: "contains", showOperators: false}},
                    },
                    {
                        field: "senderPhone",
                        title: "Утас",
                        width: 150,
                        filterable: {cell: {operator: "contains", showOperators: false}},
                    },
                    {
                        field: "typeName",
                        title: "Төрөл",
                        width: 150,
                        filterable: {cell: {operator: "contains", showOperators: false}},
                    },
                    {
                        field: "senderData",
                        title: "Агуулга",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                    },
                    {
                        field: "status",
                        values:[{"text":"Үгүй","value":"1"},{"text":"Тийм","value":"2"}],
                        filterable: {cell: {operator: "eq", showOperators: false}},
                        attributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                        template: '#if(status==1){# <span class="k-status-waiting" style="text-align:center; width:100px; float:left;margin-left:10px;">Үгүй</span> #}else{# <span class="k-status-reply" style="text-align:center; width:100px; float:left;margin-left:10px;">Тийм</span> #}# ',
                        title: "Хариу өгсөн эсэх",
                        width: 150,
                    },
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
            $scope.mainGrid.columns.push({
                command: [
                    {
                        template:
                            '<div class="flex gap-3" style="margin-left: 10px;"><button class="grid-btn" style="width: 100px;" ng-click=\'clickItem(dataItem)\'><div class="nimis-icon see"></div>Харах</button></div>',
                    },
                ],
                title: "&nbsp;",
                sticky: true,
                width: 130,
            });

            $scope.fileOptions = {
                multiple: false,
                autoUpload: true,
                showFileList: false,
                async: {
                    saveUrl: __env.apiUrl() + "/api/file/uploadFile",
                    removeUrl: __env.apiUrl() + "/api/file/delete",
                    autoUpload: true,
                },
                success: function (e) {
                    $scope.images=[];
                    $scope.images.push(e.response);
                    $scope.$apply();
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
                validation: {
                    maxFileSize: 20000000, //20mb (in bytes)  allowedExtensions: ["doc", "txt", "docx", "pdf", "jpg", "jpeg", "png", "xlsx", "xls"],
                },
            };
            $scope.deleteImg = function (imgId) {
                sweet.show(
                    {
                        title: "Устгах",
                        text: "Энэ файлыг устгах уу?",
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
                            mainService.withdomain("get", __env.apiUrl() + "/api/file/delete/" + imgId).then(function (data) {
                                for (var i = 0; i < $scope.images.length; i++) {
                                    if ($scope.images[i].id == imgId) {
                                        $timeout(function () {
                                            $scope.images.splice(i, 1);
                                            $scope.$apply();
                                            i--;
                                        });
                                        break;
                                    }
                                }
                            });
                        }
                    }
                );
            };
        },
    ]);
