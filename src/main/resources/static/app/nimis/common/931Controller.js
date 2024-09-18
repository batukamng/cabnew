angular
    .module('altairApp')
    .controller(
        '931NmsCtrl',
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

                $scope.sSectorDataSource = commonDataSource.urlPageDataSource("/api/nms/sector/list", JSON.stringify({
                    filter: {
                        logic: "and",
                        filters: [{field: "parentId", operator: "isnull", value: true}]
                    }, sort: [{field: "id", dir: "asc"}]
                }), 60);
                $scope.sSubSectorDataSource = commonDataSource.urlPageDataSource("/api/nms/sector/list", JSON.stringify({
                    filter: {
                        logic: "and",
                        filters: [{field: "parentId", operator: "isnull", value: true}]
                    }, sort: [{field: "id", dir: "asc"}]
                }), 60);
                $scope.sInvTypeDataSource = commonDataSource.urlPageDataSource("/api/nms/investment/category/sub/list", JSON.stringify({
                    filter: {
                        logic: "and",
                        filters: [{field: "useYn", operator: "eq", value: 1}]
                    }, sort: [{field: "id", dir: "asc"}]
                }), 60);

                $scope.appDataSource = {
                    transport: {
                        read: {
                            url: function (e) {
                                if (sessionStorage.getItem("buttonData").includes("read") && JSON.parse(sessionStorage.getItem('menuData')).url === $state.current.name) {
                                    return __env.apiUrl() + "/api/nms/investment/survey/list";
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
                        destroy: {
                            url: __env.apiUrl() + "/api/nms/investment/survey",
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
                                id: { type: "number" }
                            }
                        }
                    },
                    group: {
                        title:" ",
                        field: "catName", aggregates: [
                            { field: "catName", aggregate: "count" },
                        ]
                    },
                  /*  aggregate: [ { field: "catName", aggregate: "count" }],*/
                    pageSize: 20,
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true,
                    filter: {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1}]}
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
                        {
                            field: "title", title: 'Асуулт',
                            headerAttributes: { "class": "columnHeader" },
                            filterable: { cell: { operator: "contains", showOperators: false } },
                        },
                        {
                            field: "catName", title: 'Төрөл',
                            headerAttributes: { "class": "columnHeader" },hidden:true,
                            filterable: { cell: { operator: "contains", showOperators: false } },
                        },
                        {
                            field: "subSecName", title: 'Дэд салбар',
                            headerAttributes: { "class": "columnHeader" },
                            filterable: { cell: { operator: "contains", showOperators: false } },
                        },
                        {
                            field: "secName", title: 'Салбар',
                            headerAttributes: { "class": "columnHeader" },
                            filterable: { cell: { operator: "contains", showOperators: false } }
                        },
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
                            $scope.dataItem.fileId=e.response.id;
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
                        $scope.dataItem.image=null;
                        var method="";
                        if($scope.dataItem.id!=null){
                            method="put"
                        }
                        else{
                            method="post"
                        }
                        mainService.withdata(method, __env.apiUrl() + '/api/nms/investment/survey', $scope.dataItem)
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
                $scope.dataItem={};
                $scope.maxDate = new Date();
                $scope.minDate = new Date(2000, 0, 1, 0, 0, 0);
                $scope.fromDateChanged = function () {
                    $scope.minDate = new Date($scope.dataItem.srtDt);
                };
                $scope.toDateChanged = function () {
                    $scope.maxDate = new Date($scope.dataItem.endDt);
                };

                $scope.add = function (){
                    $scope.dataItem={useYn:1,code:'01',bannerType:'01',fileType:'01'};
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
                    $scope.mainGrid.toolbar = [{ template: "<button class=\"md-btn custom-btn\" ng-click='add()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>" },"search"];
                }
                if (sessionStorage.getItem('buttonData').includes("update") || sessionStorage.getItem('buttonData').includes("edit")) {
                    $scope.mainGrid.columns.push({
                        command: [
                            {
                                template:
                                    '<div class="flex gap-3"><button class="grid-btn k-grid-edit" ng-click=\'update(dataItem)\'><div class="nimis-icon edit"></div></button>' +
                                    '<button class="grid-btn k-grid-remove-command"><div class="nimis-icon delete"></div></button></div>',
                            }
                        ], title: "&nbsp;", width: 100, sticky: true, attributes: {"style": "text-align: center;"}
                    });
                }
            }
        ]
    );
