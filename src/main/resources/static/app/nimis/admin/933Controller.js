angular
    .module('altairApp')
    .controller(
        '933NmsCtrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$timeout',
            'mainService',
            'commonDataSource',
            'Upload',
            '$http',
            '__env',
            function ($rootScope, $state, $scope, $timeout, mainService, commonDataSource, Upload, $http, __env) {
                $scope.user = JSON.parse(sessionStorage.getItem('currentUser'));
                $scope.menuData = JSON.parse(sessionStorage.getItem("menuData"));
                $scope.dataSource = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: "/api/nms/icon/list",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            data: {"sort": [{field: 'id', dir: 'desc'}]},
                            beforeSend: function (req) {
                                if (JSON.parse(sessionStorage.getItem('currentUser')) != null) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                }
                                else {
                                    $state.go('login');
                                    $rootScope.$broadcast('LogoutSuccessful');
                                }
                            }
                        },
                        create: {
                            url: __env.apiUrl() + "/api/nms/icon",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            },
                            complete: function (e) {
                                $(".k-grid").data("kendoGrid").dataSource.read();
                            }
                        },
                        update: {
                            url: __env.apiUrl() + "/api/nms/icon",
                            contentType: "application/json; charset=UTF-8",
                            type: "PUT",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            },
                            complete: function (e) {
                                $(".k-grid").data("kendoGrid").dataSource.read();
                            }
                        },
                        destroy: {
                            url: __env.apiUrl() + "/api/nms/icon",
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
                        }
                    },
                    schema: {
                        data: "data",
                        total: "total",
                        model: {
                            id: "id",
                            fields: {
                                id: { type: "number", nullable: true },
                                sponsorOrg: { editable: false },
                                checkOrg: { editable: false },
                                pipAmt: { type: "number" }
                            }
                        }

                    },
                    pageSize: 20,
                    serverPaging: true,
                    serverSorting: true,
                    serverFiltering: true
                });
                $scope.mainGrid = {
                    filterable: {
                        mode: "row",
                        extra: false,
                        operators: {
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
                    reorderable: true,
                    pageable: {
                        pageSizes: [20, 50, 100],
                        refresh: true,
                        pageSize: 10,
                        buttonCount: 5
                    },
                    columns: [
                        {
                            title: "#",
                            headerAttributes: { "class": "checkbox-align" },
                            attributes: { "style": "text-align: center;" },
                            template: "#= ++record #",
                            sticky: true,
                            width: 50
                        },
                        {
                            field: "name",
                            template: "#if(icon!=null){# <div class='avatar-photo custom-icon' style='background-image: url(#:icon.uri#);'></div> <div class='user-name'>#: name # </div> #}#",
                            filterable: {cell: {operator: "contains", showOperators: false}},
                            headerAttributes: {class: "columnHeader"},
                            title: "Айкон",
                        },
                        {
                            field: "typeStr",
                            filterable: {cell: {operator: "contains", showOperators: false}},
                            headerAttributes: {class: "columnHeader"},
                            title: "Төрөл",
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
                    }
                };

                $scope.fileDtl = null;
                $scope.onSelect = function (e) {
                    $scope.fileDtl = null;
                }
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
                                type: 'DELETE',
                                success: function (response) { },
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
                    success: function (e) {
                        if(e.operation=='upload'){
                            $timeout(function (){
                                $scope.dataItem.fileId=e.response.id;
                                $scope.dataItem.name=e.response.name;
                            },10)
                        }
                        $scope.fileDtl = e.response;
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
                    },
                    dropZone: ".dropZoneElement"
                };

                $scope.dataSubmit=function (){
                    var validator = $("#validator").kendoValidator().data("kendoValidator");
                    if (validator.validate()) {
                        if ($scope.dataItem.useYn){
                            $scope.dataItem.useYn = 1;
                        }else{
                            $scope.dataItem.useYn = 0;
                        }
                        mainService.withdata('post', __env.apiUrl() + '/api/nms/icon/submit', $scope.dataItem)
                            .then(function (data) {
                                    modalForm.hide();
                                    $(".k-grid").data("kendoGrid").dataSource.read();
                                    $rootScope.alert(true, "Амжилттай.");
                                }
                            );
                    }
                }

                var modalForm = UIkit.modal("#modal_form", {
                    modal: false,
                    keyboard: false,
                    bgclose: false,
                    center: true
                });

                $scope.add = function (){
                    $scope.dataItem={useYn:1,typeStr:'transparent'};
                    modalForm.show();
                }
                $scope.update = function (item){
                    $scope.dataItem=item;
                    modalForm.show();
                }

                if (sessionStorage.getItem('buttonData').includes("read")) {
                    $scope.mainGrid.toolbar = ["excel", "search"];
                }
                if (sessionStorage.getItem('buttonData').includes("create")) {
                    $scope.mainGrid.toolbar = [
                        {template: "<button class='md-btn custom-btn' ng-click='add()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>"},
                        "search"
                    ];
                }
                if (sessionStorage.getItem('buttonData').includes("update") || sessionStorage.getItem('buttonData').includes("edit")) {
                    $scope.mainGrid.columns.push({
                        command: [
                            {
                                template:
                                    '<div class="flex justify-center gap-3"><button class="grid-btn k-grid-edit" ng-click=\'update(dataItem)\'><div class="nimis-icon edit"></div></button><button class="grid-btn k-grid-remove-command" ng-click=\'deleteData(dataItem)\'><div class="nimis-icon delete"></div></button></div>',
                            },
                        ], title: "&nbsp;", sticky: true, width: 80
                    });
                }
            }
        ]
    );
