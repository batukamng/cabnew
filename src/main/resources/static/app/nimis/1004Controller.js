angular.module("altairApp").controller("1004NmsCtrl", [
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
        $scope.user = JSON.parse(sessionStorage.getItem("currentUser"));

        $scope.app = {useYn: 1, filterType: 0};
        if ($scope.user.user.amgId != null) $scope.app.amgId = $scope.user.user.amgId;

        //Бодлогын бичиг баримт бүтэц
        $scope.docStepDataSource = commonDataSource.urlDataSource(
            "/api/nms/common/list",
            JSON.stringify({
                filter: {
                    logic: "and",
                    filters: [
                        {field: "grpCd", operator: "contains", value: "policyStatus"},
                        {field: "parentId", operator: "isNull", value: "false"},
                      { field: "useYn", operator: "eq", value: 1 }
                    ],
                },
                sort: [{field: "orderId", dir: "asc"}],
            })
        );

        // Баримт бичгийн төрөл
        $scope.docTypeDataSource = commonDataSource.urlDataSource(
            "/api/nms/common/list",
            JSON.stringify({
                filter: {
                    logic: "and",
                    filters: [
                        {field: "grpCd", operator: "contains", value: "policyDocType"},
                        {field: "parentId", operator: "isNull", value: "false"},
                    ],
                },
                sort: [{field: "orderId", dir: "asc"}],
            })
        );

        $scope.refDocTypeDataSource = commonDataSource.urlDataSource(
            "/api/nms/common/list",
            JSON.stringify({
                filter: {
                    logic: "and",
                    filters: [
                        {field: "grpCd", operator: "eq", value: "policyDocDocType"},
                        {field: "parentId", operator: "isNull", value: "false"},
                    ],
                },
                sort: [{field: "orderId", dir: "asc"}],
            })
        );

        //Бодлогын бичиг төрөл
        $scope.typeDataSource = commonDataSource.urlDataSource(
            "/api/nms/common/list",
            JSON.stringify({
                filter: {
                    logic: "and",
                    filters: [
                        {field: "grpCd", operator: "contains", value: "policyType"},
                        {field: "parentId", operator: "isNull", value: "false"},
                    ],
                },
                sort: [{field: "orderId", dir: "asc"}],
            })
        );

        //Аймаг дүүргийн мэдээлэл
        $scope.sAmgDataSource = commonDataSource.urlDataSource(
            "/api/nms/as/code/list",
            JSON.stringify({
                filter: {
                    logic: "and",
                    filters: [
                        {field: "parentId", operator: "isnull", value: true},
                        {field: "useYn", operator: "eq", value: 1},
                    ],
                },
                sort: [{field: "cdNm", dir: "asc"}],
            })
        );

        $scope.docTimeDataSource = commonDataSource.urlDataSource(
            "/api/nms/common/list",
            JSON.stringify({
                filter: {
                    logic: "and",
                    filters: [
                        {field: "grpCd", operator: "contains", value: "policyDocType"},
                        {field: "parentId", operator: "isNull", value: "false"},
                    ],
                },
                sort: [{field: "orderId", dir: "asc"}],
            })
        );

        $scope.docTypeDisable = true;
        $scope.docStepHide = false;
        $scope.amgHide = false;
        $scope.fromTypeChanged = function () {
            $scope.docTypeDisable = false;
            $scope.app.refDocTypeNew = null;

            if ($scope.app.typeId == 211) {
                $scope.docStepHide = false;
                $scope.amgHide = true;
                $scope.app.filterType = 1;
                $scope.app.amgId = null;
                $scope.app.soumId = null;
                $scope.docTypeDataSource = commonDataSource.urlDataSource(
                    "/api/nms/common/list",
                    JSON.stringify({
                        filter: {
                            logic: "and",
                            filters: [
                                {field: "grpCd", operator: "contains", value: "policyCountryDocType"},
                                {field: "parentId", operator: "isNull", value: "false"},
                            ],
                        },
                        sort: [{field: "orderId", dir: "asc"}],
                    })
                );
            }

            if ($scope.app.typeId == 212) {
                $scope.docStepHide = true;
                $scope.amgHide = false;
                $scope.app.filterType = 0;
                $scope.docTypeDataSource = commonDataSource.urlDataSource(
                    "/api/nms/common/list",
                    JSON.stringify({
                        filter: {
                            logic: "and",
                            filters: [
                                {field: "grpCd", operator: "contains", value: "policyProvinceDocType"},
                                {field: "parentId", operator: "isNull", value: "false"},
                            ],
                        },
                        sort: [{field: "orderId", dir: "asc"}],
                    })
                );
            }
        };

        $scope.sAmgChanged = function () {
            $scope.sSoumDataSource = commonDataSource.urlDataSource(
                "/api/nms/as/code/list",
                JSON.stringify({
                    filter: {
                        logic: "and",
                        filters: [
                            {field: "parentId", operator: "eq", value: $scope.app.amgId},
                            {field: "useYn", operator: "eq", value: 1},
                        ],
                    },
                    sort: [{field: "cdNm", dir: "asc"}],
                })
            );
        };

        $scope.docStepDisable = true;
        $scope.fromDocTypeChanged = function () {
            $scope.docStepDisable = false;
        };

        $scope.fileDtl = null;
        $scope.onSelect = function (e) {
            $scope.fileDtl = null;
        };
        $scope.fileOptions = {
            multiple: false,
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
                $scope.fileDtl = e.response;
                $scope.app.fileId = e.response.id;
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
        };

        $scope.yearSelectorOptions = {
            start: "decade",
            depth: "decade"
        };

        $scope.createApp = function () {
            $scope.app = {useYn: 1, filterType: 0};
            $scope.docTypeDisable = true;
            $scope.docStepHide = false;
            $scope.amgHide = false;

            UIkit.modal("#modal_application", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true,
            }).show();

            $scope.fromDateChanged = function () {
                $scope.minDate = new Date($scope.app.sdate);
                $scope.maxDate = new Date($scope.app.sdate + 4);
            };
            $scope.toDateChanged = function () {
                $scope.maxDate = new Date($scope.app.edate);
            };
            $scope.minDate = new Date();
            $scope.maxDate = new Date();
        };

        $scope.submitProject = function (event) {
            event.preventDefault();
            if ($scope.validatorProject.validate()) {
                mainService.withdata("post", __env.apiUrl() + "/api/nms/policy/submit", $scope.app).then(function (data) {
                    $rootScope.alert(true, "Амжилттай хадгаллаа.");
                    UIkit.modal("#modal_application").hide();
                    $(".k-grid").data("kendoGrid").dataSource.read();
                    $scope.stat(2, false, data.id);
                });
            } else {
                $rootScope.alert(false, "Мэдээллийг бүрэн оруулна уу!!!");
            }
        };

        $scope.editApp = function (item) {
            $scope.app.amgId = item.amgId;
            $scope.app.code = item.code;
            $scope.app.description = item.description;
            $scope.app.name = item.name;
            $scope.app.refDocType = item.refDocType;
            $scope.app.refDocTypeNew = item.refDocTypeNew;
            $scope.app.docDocType = item.docDocType;
            $scope.app.steps = item.steps;
            $scope.app.typeId = item.typeId;
            $scope.app.useYn = item.useYn;
            $scope.app.sdate = item.sdate;
            $scope.app.edate = item.edate;
            $scope.app.id = item.id;

            UIkit.modal("#modal_application", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true,
            }).show();

            $scope.fromDateChanged = function () {
                $scope.minDate = new Date($scope.app.sdate);
            };
            $scope.toDateChanged = function () {
                $scope.maxDate = new Date($scope.app.edate);
            };
            $scope.maxDate = new Date();
            $scope.minDate = new Date();
        };

        $scope.gotoDetail = function (item) {
            $scope.editApp(item);
        };

        $scope.gotoDocDetail = function (item) {
            $state.go("restricted.policy.view", {id: item.id});
        };

        $scope.deleteData = function (item) {
            if (confirm("Тухайн бодлогын баримт бичгийг устгахдаа итгэлтэй байна уу?")) {
                mainService.withdata("delete", __env.apiUrl() + "/api/nms/policy/" + item.id).then(function (data) {
                    $rootScope.alert(true, "Устгах үйлдэл амжилттай боллоо.");
                    $(".k-grid").data("kendoGrid").dataSource.read();
                });
            }
        };

        $scope.gotoDocRelationDetail = function (item) {
            $state.go("restricted.policyDocRelation.view", {id: item.id});
        };

        $scope.dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: __env.apiUrl() + "/api/nms/policy/list",
                    contentType: "application/json; charset=UTF-8",
                    type: "POST",
                    data: {sort: [{field: "id", dir: "asc"}]},
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
                    url: __env.apiUrl() + "/api/nms/policy/",
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
                total: "total"
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
                cell: {
                    operator: "eq",
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
                    locked: true,
                    lockable: false,
                    width: 50,
                },
                {
                    field: "code",
                    filterable: { cell: { operator: "contains", showOperators: false } },
                    title: "Код",
                    locked: true,
                    lockable: false,
                    width: 100,
                },
                {
                    field: "name",
                    filterable: {cell: {operator: "contains", showOperators: false}},
                    title: "Гарчиг",
                    locked: true,
                    lockable: false,
                    width: 300
                },
                {
                    field: "fileNm",
                    title: "Файл",
                    template: "<a class='uk-text-primary' target='_blank' href='#=fileUrl#'>#=fileNm#</a>",
                    filterable: {cell: {operator: "contains", showOperators: false}},
                    width: 150,
                    locked: true,
                    lockable: false
                },
                {
                    field: "typeNm",
                    title: "Улс / ОН",
                    filterable: {cell: {operator: "contains", showOperators: false}},
                    width: 150,
                },
                {
                    field: "docTypeNm",
                    title: "Хугацаа",
                    filterable: {cell: {operator: "contains", showOperators: false}},
                    width: 150,
                },
                {
                    field: "docTypeNewNm",
                    title: "Төрөл",
                    filterable: {cell: {operator: "contains", showOperators: false}},
                    width: 200,
                },
                {
                    field: "docDocTypeNm",
                    title: "ББ-ийн төрөл",
                    filterable: {cell: {operator: "contains", showOperators: false}},
                    width: 200,
                },
                {
                    field: "stepNames",
                    title: "Бичиг баримтын бүтэц",
                    filterable: {cell: {operator: "contains", showOperators: false}},
                    width: 250,
                },
                {
                    field: "grpCnt",
                    title: "Үндсэн бүлэг",
                    filterable: {cell: {operator: "contains", showOperators: false}},
                    width: 150,
                },
                {
                    field: "pntCnt",
                    title: "Зорилго",
                    filterable: {cell: {operator: "contains", showOperators: false}},
                    width: 150,
                },
                {
                    field: "tgtCnt",
                    title: "Зорилт",
                    filterable: {cell: {operator: "contains", showOperators: false}},
                    width: 150,
                },
                {
                    field: "rltCnt",
                    title: "Үр дүн",
                    filterable: {cell: {operator: "contains", showOperators: false}},
                    width: 150,
                },
                {
                    field: "proCnt",
                    title: "Төсөл, арга хэмжээ",
                    filterable: {cell: {operator: "contains", showOperators: false}},
                    width: 150,
                },
                {
                    field: "kpiCnt",
                    title: "Шалгуур үзүүлэлт",
                    filterable: {cell: {operator: "contains", showOperators: false}},
                    width: 150,
                },
            ],
            dataBinding: function () {
                record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
            },
            editable: false,
            height: function () {
                return $(window).height() - 160;
            },
        };

        if (sessionStorage.getItem("buttonData").includes("create")) {
            $scope.mainGrid.toolbar = [{template: "<button class='md-btn custom-btn' ng-click='createApp()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>"}];
        }


        if (sessionStorage.getItem("buttonData").includes("read")) {
            $scope.mainGrid.columns.push({
                command: [
                    {
                        template:
                            '<div class="flex gap-3"><button class="grid-btn" ng-click=\'gotoDocDetail(dataItem)\'><div class="nimis-icon see"></div>Харах</button><button class="grid-btn k-grid-edit" ng-click=\'gotoDetail(dataItem)\'><div class="nimis-icon edit"></div></button><button class="grid-btn k-grid-remove-command" ng-click=\'deleteData(dataItem)\'><div class="nimis-icon delete"></div></button></div>',
                    },
                ],
                title: "&nbsp;",
                sticky: true,
                width: 160,
            });
        }
    },
]);
