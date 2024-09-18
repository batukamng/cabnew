angular
    .module('altairApp')
    .controller(
        '1031Ctrl',
        [
            '$rootScope',
            '$state',
            'Upload',
            '$scope',
            '$timeout',
            '__env',
            function ($rootScope, $state, Upload, $scope, $timeout, __env) {

                $scope.showModal= function () {
                    sweet.show({
                        title: 'Database backup',
                        text: 'Та энэ үйлдлийг хийхдээ итгэлтэй байна уу?',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#DD6B55',
                        confirmButtonText: 'Тийм',
                        cancelButtonText: 'Үгүй',
                        closeOnConfirm: false,
                        closeOnCancel: true

                    }, function (inputvalue) {
                        if (inputvalue) {
                            mainService.withResponse('get', __env.apiUrl() + '/api/schedule/backup').then(function (response) {
                                console.log(response);
                                if (response) {
                                    sweet.show('Анхаар!', 'Амжилттай!!!', 'success');
                                } else {
                                    sweet.show('Анхаар!', 'Алдаа үүслээ!!!', 'error');
                                }
                                //  $(".k-grid").data("kendoGrid").dataSource.read();
                            });
                        }
                    });
                };
                $scope.showFileModal= function () {
                    sweet.show({
                        title: 'Storage backup',
                        text: 'Та энэ үйлдлийг хийхдээ итгэлтэй байна уу?',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#DD6B55',
                        confirmButtonText: 'Тийм',
                        cancelButtonText: 'Үгүй',
                        closeOnConfirm: false,
                        closeOnCancel: true

                    }, function (inputvalue) {
                        if (inputvalue) {
                            mainService.withResponse('get', __env.apiUrl() + '/api/schedule/zip-download').then(function (response) {
                                console.log(response);
                                if (response) {
                                    sweet.show('Анхаар!', 'Амжилттай!!!', 'success');
                                } else {
                                    sweet.show('Анхаар!', 'Алдаа үүслээ!!!', 'error');
                                }
                                //  $(".k-grid").data("kendoGrid").dataSource.read();
                            });
                        }
                    });
                };

                $('.dropify').dropify();
                $scope.showModal= function () {
                    UIkit.modal("#modal_payment_request_import").show();
                };

                $scope.getMainAttach = function (file) {
                    $scope.excelFile = file;
                };

                $scope.excelFileSelectedEvent = function(file){
                    $scope.excelFile = file;
                };
                $scope.uploadExcelFile = function () {
                    if ($scope.excelFile !== null && $scope.excelFile !== undefined){
                        Upload.upload({
                            url: '/api/file/uploadFile',
                            data: {file: $scope.excelFile}
                        }).then(function (resp) {
                            UIkit.modal("#modal_payment_request_import").hide();
                            $(".k-grid").data("kendoGrid").dataSource.read();
                        }, function (resp) {
                          //  sweet.show('Анхаар!', 'Файл хуулахад алдаа үүслээ!', 'error');
                        }, function (evt) {
                            $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        });
                    }
                };
                var position=[{"text":"Дээр","value":true},{"text":"Доор","value":false}];
                $scope.mainGrid = {
                    dataSource: {
                        transport: {
                            read: {
                                url: function (e) {
                                    if(sessionStorage.getItem("buttonData").includes("read") && JSON.parse(sessionStorage.getItem('menuData')).link===$state.current.name){
                                        return __env.apiUrl() + "/api/file/list";
                                    }
                                    else{
                                        sessionStorage.removeItem('currentUser');
                                        sessionStorage.removeItem('menuList');
                                        sessionStorage.removeItem('menuData');
                                        $state.go('login');
                                    }
                                },
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                data: {"custom":"where proType!=1" ,"sort": [{field: 'id', dir: 'desc'}]},
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                }
                            },
                            destroy: {
                                url: __env.apiUrl() + "/api/file/delete",
                                contentType: "application/json; charset=UTF-8",
                                type: "DELETE",
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
                                    id: {editable: false, nullable: true},
                                    name: {type: "string", validation: {required: true}},
                                    filePath: {type: "string", defaultValue:0},
                                    fileSize: {type: "number"},
                                    fileSaveNm: {type: "string"},
                                    mimeType: {type: "string"},
                                    fileType: {type: "string"},
                                    type: {type: "string"},
                                    size: {type: "number"}
                                }
                            }
                        },
                        pageSize: 20,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    },
                    filterable: true,
                    sortable: true,
                    resizable: true,
                    pageable: {
                        pageSizes: ['All',20,50],
                        refresh: true,
                        buttonCount: 5,
                        message: {
                            empty: 'No Data',
                            allPages:'All'
                        }
                    },
                    columns: [
                        {
                            title: "Д/д",
                            headerAttributes: {"class": "columnHeader"},
                            template: "<span class='row-number'></span>",
                            width: "50px"
                        },
                       /* {field: "lutUser.username", template:"#if(lutUser!=null){# #=lutUser.username# #}#", title: "Хэрэглэгчийн нэр",headerAttributes: {style: "font-weight: bold"}},*/
                        {field: "name", title: "Файлын нэр",headerAttributes: {style: "font-weight: bold"}},
                        {field: "uri", template:"<a href='#=uri#'>татах</a>",title: "URL",headerAttributes: {style: "font-weight: bold"}},
                        {
                            field: "fileSize",
                            width:150,
                            title: "Хэмжээ", format: "{0:n2}",
                            template: '#= kendo.toString(fileSize/1024, "n2")# KB',
                            headerAttributes: {style: "text-align: center; font-weight: bold"}
                        },
                        {
                            field: "mimeType",
                            title: "Төрөл",
                            width:150,
                            headerAttributes: {style: "text-align: center; font-weight: bold"}
                        },
                        {
                            field: "regDtm",
                            filterable: {
                                operators: {
                                    string: {
                                        eq: "Тэнцүү",
                                        gte: "Их буюу тэнцүү",
                                        lte: "Бага буюу тэнцүү"
                                    }
                                }
                            },
                            width:150,
                            title: "Огноо",
                            headerAttributes: {style: "text-align: center; font-weight: bold"}
                        },
                        {
                            field: "useYn", headerAttributes: {style: "text-align: center; font-weight: bold"},
                            template: "#if(useYn){# <span class='columnCenter'>Y</span> #}else{#<span class='columnCenter uk-text-danger'>N</span> #}#",
                            title: "Ашиглах эсэх",
                            width: 130
                        }
                    ],
                    dataBound: function () {
                        var rows = this.items();
                        $(rows).each(function () {
                            var index = $(this).index() + 1
                                + ($(".k-grid").data("kendoGrid").dataSource.pageSize() * ($(".k-grid").data("kendoGrid").dataSource.page() - 1));
                            var rowLabel = $(this).find(".row-number");
                            $(rowLabel).html(index);
                        });
                    },
                    editable: "inline",

                    height: function () {
                        return $(window).height() - 110;
                    }
                };

                if(sessionStorage.getItem('buttonData').includes("R")){
                    $scope.mainGrid.toolbar = ["excel","search"];
                }
                if(sessionStorage.getItem('buttonData').includes("C")){
                    $scope.mainGrid.toolbar = [{template:"<button class=\"k-button k-button-icontext\" ng-click='showModal()' ><span class=\"k-icon k-i-plus\"></span>Нэмэх</button>"},"search"];
                }
                if(sessionStorage.getItem('buttonData').includes("U")){
                    $scope.mainGrid.columns.push({
                        command: [
                            {name: "edit", text: {edit: " ", update: " ", cancel: " "}},
                            {name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn"}
                        ], title: "&nbsp;", width: 100
                    });
                }

            }
        ]
    );
