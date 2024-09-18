angular
    .module('altairApp')
    .controller(
        '918NmsCtrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$timeout',
            '$translate',
            'commonDataSource',
            'mainService',
            '__env',
            function ($rootScope, $state, $scope, $timeout, $translate, commonDataSource, mainService, __env) {


                $scope.viewFile = function (item) {
                    var modalPdf = UIkit.modal("#modal_pdf_viewer", {
                        modal: false,
                        keyboard: false,
                        bgclose: false,
                        center: true
                    });
                    $scope.$broadcast("loadPdf", 0, item.file.id);
                    modalPdf.show();
                };

                $scope.fileEditor = function (container, options) {
                    $('<input type="file" name="file">').appendTo(container).kendoUpload({
                        multiple: false,
                        autoUpload: false,
                        async: {
                            saveUrl: __env.apiUrl()+"/api/file/uploadFile",
                            removeUrl: __env.apiUrl()+"/api/file/delete",
                            autoUpload: true
                        },
                        showFileList:false,
                        cancel: function (e) {},
                        clear: function (e) {},
                        remove: function (e) {
                            if ($scope.createLink) {
                                $.ajax({
                                    url: __env.apiUrl()+"/api/file/delete",
                                    type: 'DELETE',
                                    success: function (response) {},
                                    data: JSON.stringify($scope.createLink),
                                    dataType: 'json',
                                    contentType: 'application/json; charset=utf-8'
                                });
                            }
                            $(".k-widget.k-upload").find("ul").remove();
                            $(".k-upload-status").remove();
                            $scope.createLink = null;
                            e.preventDefault();
                        },
                        complete: function (e) {},
                        error: function (e) {},
                        progress: function (e) {},
                        select: function (e) {},
                        success: function (e) {
                            $scope.createLink = e.response;
                            options.model.fileId=e.response.id;
                            options.model.dirty=true;
                        },
                        upload: function (e) {
                            var xhr = e.XMLHttpRequest;
                            if (xhr) {
                                xhr.addEventListener("readystatechange", function (e) {
                                    if (xhr.readyState == 1 /* OPENED */) {
                                        xhr.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                    }
                                });
                            }
                        }
                    });
                };

                $scope.gridDataSource = {
                    transport: {
                        read: {
                            url: function (e) {
                                if (sessionStorage.getItem("buttonData").includes("read") && JSON.parse(sessionStorage.getItem('menuData')).url === $state.current.name) {
                                    return __env.apiUrl() + "/api/nms/guide/list";
                                } else {
                                    sessionStorage.removeItem('currentUser');
                                    sessionStorage.removeItem('menuList');
                                    sessionStorage.removeItem('menuData');
                                    $state.go('login');
                                }
                            },
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            data: {sort: [{field: "id", dir: "desc"}]},
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            }
                        },
                        update: {
                            url: __env.apiUrl() + "/api/nms/guide",
                            contentType: "application/json; charset=UTF-8",
                            type: "PUT",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            },
                            complete: function (e) {
                                if (e.status === 200) {
                                    $rootScope.alert(true, "Амжилттай засагдлаа");
                                } else if (e.status === 500) {
                                    $rootScope.alert(false, "Амжилтгүй");
                                }
                            }
                        },
                        destroy: {
                            url: __env.apiUrl() + "/api/nms/guide",
                            contentType: "application/json; charset=UTF-8",
                            type: "DELETE",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            }
                        },
                        create: {
                            url: __env.apiUrl() + "/api/nms/guide",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            complete: function (e) {
                                if (e.status === 200) {
                                    $rootScope.alert(true, "Амжилттай хадгаллаа");
                                } else if (e.status === 409) {
                                    $rootScope.alert(false, "Код давхцаж байна");
                                } else if (e.status === 500) {
                                    $rootScope.alert(false, "Амжилтгүй");
                                }
                                $("#parent").data("kendoGrid").dataSource.read();
                            },
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
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
                                id: {type: "number"},
                                description: {type: "string", validation: {required: true}},
                                name: {type: "string", validation: {required: true}},
                                useYn: {type: "number", defaultValue: 1},
                                typeKey: {type: "string", defaultValue: "02"},
                                subDt: {type: "date", validation: {required: true}},
                                fileId: {type: "number", validation: {required: true}},
                                file: {defaultValue: {}},
                            }
                        }
                    },
                    pageSize: 20,
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true,
                    filter: {
                        logic: "and",
                        filters: [{field: "typeKey", operator: "eq", value: "02"}, {
                            field: "useYn",
                            operator: "eq",
                            value: 1
                        }]
                    }
                };
                $scope.mainGrid = {
                    filterable: {
                        mode: "row",
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
                    pageable: {
                        refresh: true,
                        pageSizes: true,
                        buttonCount: 5
                    },
                    columns: [
                        {
                            title: "#",
                            headerAttributes: {"class": "columnCenter"},
                            attributes: {"style": "text-align: center;"},
                            template: "#= ++record #",
                            sticky: true,
                            width: 50
                        },

                        {
                            field: "name", title: 'Нэр',
                            headerAttributes: {"class": "columnHeader"},
                            filterable: {cell: {operator: "contains", showOperators: false}},
                        },
                        {
                            field: "description", title: 'Тайлбар',
                            headerAttributes: {"class": "columnHeader"},
                            filterable: {cell: {operator: "contains", showOperators: false}},
                        },
                        {field: "code", headerAttributes: {"class": "columnHeader"},title:  'Код'},
                        {field: "subDt", width:200, format: "{0: yyyy-MM-dd HH:mm}",
                            filterable:{
                                operators:{
                                    string:{
                                        eq: "custom equal",
                                        neq: "custom not equal"
                                    }
                                }
                            }, title:  'Огноо'},
                        {
                            field: "fileId",
                            width: 250,
                            filterable: false,
                            headerAttributes: {"class": "columnHeader columnCenter", style: "margin-left:14.5px;"},
                            attributes: {
                                "class": "table-cell",
                                style: "text-align: center;"
                            },
                            template: "#if(fileId!=null && fileId!=0){# <a class='uk-text-primary' target='_blank' href='#=file.uri#'>Татах</a> #if(file!=null && file.mimeType=='pdf'){#  | <a ng-click='viewFile(dataItem)'>Харах</a> #}# #}#",
                            editor: $scope.fileEditor,
                            title: "Файл"
                        },
                    ],
                    dataBinding: function () {
                        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                    },
                    editable: "inline",

                    height: function () {
                        return $(window).height() - 160;
                    }
                };


                if (sessionStorage.getItem('buttonData').includes("read")) {
                    $scope.mainGrid.toolbar = ["excel", "search"];
                }
                if (sessionStorage.getItem('buttonData').includes("create")) {
                    $scope.mainGrid.toolbar = [{ template: "<button class='md-btn custom-btn k-grid-add'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>" }, "search"];
                }
                if (sessionStorage.getItem('buttonData').includes("update") || sessionStorage.getItem('buttonData').includes("edit")) {
                    $scope.mainGrid.columns.push({
                        command: [
                            {
                                template:
                                    '<div class="command-container"><a class="grid-btn k-grid-edit"><div class="nimis-icon edit"></div></a><a class="grid-btn k-grid-remove-command"><div class="nimis-icon delete"></div></a><a class="grid-btn k-grid-update"><div class="nimis-icon update"></div></a> <a class="grid-btn k-grid-cancel"><div class="nimis-icon cancel"></div></a></div>',
                            },
                        ], title: "&nbsp;", sticky: true, width: 80
                    });
                }
            }
        ]
    );
