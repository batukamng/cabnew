angular
    .module('altairApp')
    .controller(
        '923NmsCtrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$timeout',
            '$translate',
            'commonDataSource',
            'mainService',
            '__env',
            function ($rootScope, $state, $scope, $timeout, $translate, commonDataSource,mainService,__env) {

                $scope.gridDataSource = {
                    transport: {
                        read: {
                            url: function (e) {
                                if (sessionStorage.getItem("buttonData").includes("read") && JSON.parse(sessionStorage.getItem('menuData')).url === $state.current.name) {
                                    return __env.apiUrl() + "/api/nms/school/list";
                                }
                                else {
                                    sessionStorage.removeItem('currentUser');
                                    sessionStorage.removeItem('menuList');
                                    sessionStorage.removeItem('menuData');
                                    $state.go('login');
                                }
                            },
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            data: { sort: [{ field: "id", dir: "desc" }] },
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            }
                        },
                        update: {
                            url: __env.apiUrl() + "/api/nms/school",
                            contentType: "application/json; charset=UTF-8",
                            type: "PUT",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            },
                            complete: function (e) {
                                if (e.status === 200) {
                                    $rootScope.alert(true, "Амжилттай засагдлаа");
                                }
                                else if (e.status === 500) {
                                    $rootScope.alert(false, "Амжилтгүй");
                                }
                            }
                        },
                        destroy: {
                            url: __env.apiUrl() + "/api/nms/school",
                            contentType: "application/json; charset=UTF-8",
                            type: "DELETE",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            }
                        },
                        create: {
                            url: __env.apiUrl() + "/api/nms/school",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            complete: function (e) {
                                if (e.status === 200) {
                                    $rootScope.alert(true, "Амжилттай хадгаллаа");
                                }
                                else if (e.status === 409) {
                                    $rootScope.alert(false, "Код давхцаж байна");
                                }
                                else if (e.status === 500) {
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
                                id: { type: "number" },
                                code: { type: "string", validation: { required: true} },
                                name: { type: "string", validation: { required: true} },
                                useYn: { type: "boolean", defaultValue: true }
                            }
                        }
                    },
                    pageSize: 20,
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true,
                    filter: {logic: "and", filters: [{field: "useYn", operator: "eq", value: true}]}
                };
                $scope.mainGrid = {
                    filterable: {
                        mode:"row",
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
                    excel: {
                        fileName: "Organization Export.xlsx",
                        proxyURL: "//demos.telerik.com/kendo-ui/service/export",
                        filterable: true,
                        allPages: true
                    },
                    pageable: {
                        refresh: true,
                        pageSizes: true,
                        buttonCount: 5
                    },
                    columns: [
                        {
                            title: "#",
                            headerAttributes: { "class": "columnCenter" },
                            attributes: { "style": "text-align: center;" },
                            template: "#= ++record #",
                            sticky: true,
                            width: 50
                        },
                        {field: "organizationName",width:300, sticky: true, headerAttributes: { "class": "columnHeader" },filterable: { cell: { operator: "contains", showOperators: false } }, title: "Сургууль/Цэцэрлэгийн нэр"},
                        {field: "geographyCode",width:200, headerAttributes: { "class": "columnHeader" },filterable: { cell: { operator: "contains", showOperators: false } }, title: "Хаяг-ийн код"},
                        {field: "organizationGroup",width:200, headerAttributes: { "class": "columnHeader" },filterable: { cell: { operator: "contains", showOperators: false } }, title: "Сургууль/цэцэрлэг"},
                        {field: "organizationTypeName",width:200, headerAttributes: { "class": "columnHeader" },filterable: { cell: { operator: "contains", showOperators: false } }, title: "Байгууллагийн төрөл"},
                        {field: "institutionTypeName",width:200, headerAttributes: { "class": "columnHeader" },filterable: { cell: { operator: "contains", showOperators: false } }, title: "Сургууль/Цэцэрлэгийн төрөл"},
                        {field: "organizationPropertyName",width:200, headerAttributes: { "class": "columnHeader" },filterable: { cell: { operator: "contains", showOperators: false } }, title: "Өмчийн хэлбэр"},
                        {field: "parentOrganizationName",width:200, headerAttributes: { "class": "columnHeader" },filterable: { cell: { operator: "contains", showOperators: false } }, title: "удирдах байгууллага-ийн ID"},
                        {field: "stuCountPrimaryReal",width:200, headerAttributes: { "class": "columnHeader" },filterable: { cell: { operator: "contains", showOperators: false } }, title: "Бага/цэцэрлэг бол"},
                        {field: "stuCountLowerSReal",width:200, headerAttributes: { "class": "columnHeader" },filterable: { cell: { operator: "contains", showOperators: false } }, title: "Дунд"},
                        {field: "stuCountUpperSReal",width:200, headerAttributes: { "class": "columnHeader" },filterable: { cell: { operator: "contains", showOperators: false } }, title: "Бүрэн дунд"},
                        {field: "stuCountPrimaryStatistic",width:200, headerAttributes: { "class": "columnHeader" },filterable: { cell: { operator: "contains", showOperators: false } }, title: "Бага/цэцэрлэг бол"},
                        {field: "stuCountLowerSStatistic",width:200, headerAttributes: { "class": "columnHeader" },filterable: { cell: { operator: "contains", showOperators: false } }, title: "Дунд"},
                        {field: "stuCountUpperSStatistic",width:200, headerAttributes: { "class": "columnHeader" },filterable: { cell: { operator: "contains", showOperators: false } }, title: "Бүрэн дунд"},
                        {field: "stuCountOfBuilding",width:200, headerAttributes: { "class": "columnHeader" },filterable: { cell: { operator: "contains", showOperators: false } }, title: "Хичээлийн байрны хүчин чадал"},
                        {field: "parentId",width:200, headerAttributes: { "class": "columnHeader" },filterable: { cell: { operator: "contains", showOperators: false } }, title: "Харьяа"}
                    ],
                    dataBinding: function () {
                        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                    },
                    editable: "inline",

                    height: function () {
                        return $(window).height() - 110;
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
                            $scope.dataItem.imageId=e.response.id;
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
                    if ($scope.validator.validate()) {
                        mainService.withdata('post', __env.apiUrl() + '/api/nms/school/submit', $scope.dataItem)
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
                    $scope.dataItem={useYn:true};
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
                    $scope.mainGrid.toolbar = [{ template: "<button class=\"k-button k-button-icontext\" ng-click='add()'><span class=\"k-icon k-i-import\"></span>Импорт</button>" },"search"];
                }
                if (sessionStorage.getItem('buttonData').includes("update") || sessionStorage.getItem('buttonData').includes("edit")) {
                    $scope.mainGrid.columns.push({
                        command: [
                            { template: "<button class=\"k-button k-button-icontext\"  ng-click='update(dataItem)'><span class=\"k-icon k-i-edit\"></span></button>" },
                            { name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn" }
                        ], title: "&nbsp;", sticky: true, width: 100
                    });
                }
            }
        ]
    );
