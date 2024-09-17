angular
    .module('altairApp')
    .controller(
        '938NmsCtrl',
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
                $scope.user = JSON.parse(localStorage.getItem('currentUser')).user;
                $scope.menuData = JSON.parse(localStorage.getItem("menuData"));
                mainService
                    .withdata(
                        "post",
                        "/api/nms/icon/list",
                        JSON.stringify({
                            filter: {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1}]},
                            sort: [{field: "name", dir: "asc"}],
                            take: 60,
                            skip: 0,
                            page: 1,
                            pageSize: 60,
                        })
                    )
                    .then(function (data) {
                        $scope.iconDataSource = data.data;
                    });

                $scope.dataSource = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: "/api/nms/module/list",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            data: {"sort": [{field: 'id', dir: 'asc'}]},
                            beforeSend: function (req) {
                                if (JSON.parse(localStorage.getItem('currentUser')) != null) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                }
                                else {
                                    $state.go('login');
                                    $rootScope.$broadcast('LogoutSuccessful');
                                }
                            }
                        },
                        create: {
                            url: __env.apiUrl() + "/api/nms/module",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                            },
                            complete: function (e) {
                                $(".k-grid").data("kendoGrid").dataSource.read();
                            }
                        },
                        update: {
                            url: __env.apiUrl() + "/api/nms/module",
                            contentType: "application/json; charset=UTF-8",
                            type: "PUT",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                            },
                            complete: function (e) {
                                $(".k-grid").data("kendoGrid").dataSource.read();
                            }
                        },
                        destroy: {
                            url: __env.apiUrl() + "/api/nms/module",
                            contentType: "application/json; charset=UTF-8",
                            type: "DELETE",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
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
                                orderId: { type: "number" }
                            }
                        }

                    },
                    pageSize: 10,
                    serverPaging: true,
                    serverSorting: true,
                    serverFiltering: true
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
                    reorderable: true,
                    pageable: {
                        pageSizes: [10, 50, 100],
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

                        { field: "name",template:"#if(icon!=null){# <div class='avatar-photo custom-icon' style='background-image: url(#:icon.uri#);'></div> <div class='user-name'>#: name # </div>#}else{# #: name # #}#", filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: { "class": "columnHeader" }, title: 'Нэр' },
                        { field: "orderId", filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: { "class": "columnHeader" }, title: 'Эрэмбэ' },
                    ],
                    dataBinding: function () {
                        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                    },
                    editable: false,
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
                        if(e.operation==='upload'){
                            $scope.dataItem.fileId=e.response.id;
                        }
                        $scope.fileDtl = e.response;
                    },
                    upload: function (e) {
                        var xhr = e.XMLHttpRequest;
                        if (xhr) {
                            xhr.addEventListener("readystatechange", function (e) {
                                if (xhr.readyState === 1 /* OPENED */) {
                                    xhr.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                }
                            });
                        }
                    },
                    dropZone: ".dropZoneElement"
                };

                $scope.dataSubmit=function (){
                    if ($scope.validator.validate()) {
                        mainService.withdata('post', __env.apiUrl() + '/api/nms/module/submit', $scope.dataItem)
                            .then(function (data) {
                                modalForm.hide();
                                $timeout(() => $rootScope.clearForm("userForm"));
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
                    $scope.dataItem={useYn:1};
                    $timeout(() => $rootScope.clearForm("userForm"));
                    modalForm.show();
                }
                $scope.update = function (item){
                    $scope.dataItem=item;
                    modalForm.show();
                }

                if (localStorage.getItem('buttonData').includes("read")) {
                    $scope.mainGrid.toolbar = ["excel", "search"];
                }
                if (localStorage.getItem('buttonData').includes("create")) {
                        $scope.mainGrid.toolbar = [{ template: "<button class='md-btn custom-btn k-grid-add' ng-click='add()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>" }];
                }
                if (localStorage.getItem('buttonData').includes("update") || localStorage.getItem('buttonData').includes("edit")) {
                    $scope.mainGrid.columns.push({
/*                        command: [
                            { template: "<button class=\"k-button k-button-icontext\"  ng-click='update(dataItem)'><span class=\"k-icon k-i-edit\"></span></button>" },
                            { name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn" }
                        ]*/
                        command: [
                            {
                                template:
                                    '<div class="command-container" style="padding-left:5px;"><a class="grid-btn k-grid-edit" ng-click=\'update(dataItem)\'><div class="nimis-icon edit"></div></a><a class="grid-btn k-grid-remove-command"><div class="nimis-icon delete"></div></a><a class="grid-btn k-grid-update"><div class="nimis-icon update"></div></a> <a class="grid-btn k-grid-cancel"><div class="nimis-icon cancel"></div></a></div>',
                            },
                        ]
                        , title: "&nbsp;", sticky: true, width: 80
                    });
                }
            }
        ]
    );
