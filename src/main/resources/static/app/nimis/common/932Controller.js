angular.module("altairApp").controller("932NmsCtrl", [
    "$rootScope",
    "$state",
    "$scope",
    "$timeout",
    "$translate",
    "commonDataSource",
    "mainService",
    "__env",
    function ($rootScope, $state, $scope, $timeout, $translate, commonDataSource, mainService, __env) {

        $scope.appDataSource = {
            transport: {
                read: {
                    url: function (e) {
                        if (sessionStorage.getItem("buttonData").includes("read") && JSON.parse(sessionStorage.getItem("menuData")).url === $state.current.name) {
                            return __env.apiUrl() + "/api/nms/splash/list";
                        } else {
                            $state.go("login");
                        }
                    },
                    contentType: "application/json; charset=UTF-8",
                    type: "POST",
                    data: {sort: [{field: "id", dir: "desc"}]},
                    beforeSend: function (req) {
                        req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
                    },
                },
                destroy: {
                    url: __env.apiUrl() + "/api/nms/splash",
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
                        id: {type: "number"},
                    },
                },
            },
            pageSize: 20,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            filter: {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1}]},
        };
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
            excel: {
                fileName: "Organization Export.xlsx",
                proxyURL: "//demos.telerik.com/kendo-ui/service/export",
                filterable: true,
                allPages: true,
            },
            pageable: {
                refresh: true,
                pageSizes: true,
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
                    field: "image.name",
                    template: "#if(image!=null){# <div class='avatar-photo' style='background-image: url(#:image.uri#);'></div> #=image.name# #}#",
                    filterable: {cell: {operator: "contains", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Зураг",
                },
                {
                    field: "code",
                    title: "Код",
                    headerAttributes: {class: "columnHeader"},
                    values: [
                        {text: "Сурталчилгаа", value: "01"},
                        {text: "Мэдээлэл", value: "02"},
                    ],
                    filterable: {cell: {operator: "contains", showOperators: false}},
                },
                {
                    field: "title",
                    title: "Нэр",
                    headerAttributes: {class: "columnHeader"},
                    filterable: {cell: {operator: "contains", showOperators: false}},
                },
                {
                    field: "srtDt",
                    title: "Эхлэх",
                    headerAttributes: {class: "columnHeader"},
                    filterable: {cell: {operator: "contains", showOperators: false}},
                },
                {
                    field: "endDt",
                    title: "Дуусах",
                    headerAttributes: {class: "columnHeader"},
                    filterable: {cell: {operator: "contains", showOperators: false}},
                },
                {
                    field: "bannerType",
                    title: "Төрөл",
                    headerAttributes: {class: "columnHeader"},
                    values: [
                        {text: "Сайт үндсэн", value: "01"},
                        {text: "Сайт нэвтрэх", value: "02"},
                        {text: "Апп үндсэн", value: "03"},
                        {text: "Апп жижиг", value: "04"},
                    ],
                    filterable: {cell: {operator: "contains", showOperators: false}},
                },
                {
                    field: "url",
                    title: "Хаяг /URL/",
                    template: "#if(url!=null){# <a class='uk-text-primary' href='#=url#' target='_blank'> #=url#</a>#}#",
                    headerAttributes: {class: "columnHeader"},
                    filterable: {cell: {operator: "contains", showOperators: false}},
                },
            ],
            dataBinding: function () {
                record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
            },
            editable: "inline",

            height: function () {
                return $(window).height() - 110;
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

        $scope.dataSubmit = function () {
            if ($scope.validator.validate()) {
                $scope.dataItem.image = null;
                if ($scope.dataItem.typeIdArr) {
                    $scope.dataItem.typeIds = $scope.dataItem.typeIdArr.join(",");
                    console.log($scope.dataItem.typeIdStr, "id");
                }
                var method = "";
                if ($scope.dataItem.id != null) {
                    method = "put";
                } else {
                    method = "post";
                }
                mainService.withdata(method, __env.apiUrl() + "/api/nms/splash", $scope.dataItem).then(function (data) {
                    modalForm.hide();
                    $(".k-grid").data("kendoGrid").dataSource.read();
                    $rootScope.alert(true, "Амжилттай.");
                });
            }
        };

        var modalForm = UIkit.modal("#modal_form", {
            modal: false,
            keyboard: false,
            bgclose: false,
            center: true,
        });
        $scope.dataItem = {};
        $scope.maxDate = new Date();
        $scope.minDate = new Date(2000, 0, 1, 0, 0, 0);
        $scope.fromDateChanged = function () {
            $scope.minDate = new Date($scope.dataItem.srtDt);
        };
        $scope.toDateChanged = function () {
            $scope.maxDate = new Date($scope.dataItem.endDt);
        };

        $scope.add = function () {
            $scope.dataItem = {useYn: 1, code: "01", bannerType: "01", fileType: "02", typeIds: ""};
            modalForm.show();
        };
        $scope.update = function (item) {
            if (item.typeIds) item.typeIdArr = item.typeIds.split(",");
            $scope.dataItem = item;
            if ($scope.dataItem.lvlId)
                mainService.withdata("GET", __env.apiUrl() + "/api/nms/user/level/pos/" + $scope.dataItem.lvlId).then(function (res) {
                    UIkit.modal("#modal_loader").hide();
                    $scope.userTypes = res;
                    console.log("userTypes", $scope.userTypes);
                });
            modalForm.show();
        };
        $scope.typeOptions = {
            placeholder: "Төрөл сонгоно уу...",
            dataTextField: "comCdNm",
            dataValueField: "id",
            valuePrimitive: true,
            autoBind: false,
        };

        mainService.withdata("GET", __env.apiUrl() + "/api/nms/user/level/sub/" + JSON.parse(sessionStorage.getItem("currentUser")).user.lvlId).then(function (data) {
            console.log(data);
            $scope.levels = data;
        });
        $scope.levelTypeChanged = function () {
            UIkit.modal("#modal_loader").show();
            mainService.withdata("GET", __env.apiUrl() + "/api/nms/user/level/pos/" + $scope.dataItem.lvlId).then(function (res) {
                UIkit.modal("#modal_loader").hide();
                $scope.userTypes = res;
                $scope.dataItem.typeIdArr = [];
            });
        };
        if (sessionStorage.getItem("buttonData").includes("read")) {
            $scope.mainGrid.toolbar = ["excel", "search"];
        }
        if (sessionStorage.getItem("buttonData").includes("create")) {
            $scope.mainGrid.toolbar = [{template: "<button class=\"md-btn custom-btn\" ng-click='add()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>"}, "search"];
        }
        if (sessionStorage.getItem("buttonData").includes("update") || sessionStorage.getItem("buttonData").includes("edit")) {
            $scope.mainGrid.columns.push({
                command: [
                    {
                        template:
                            '<div class="flex gap-3"><button class="grid-btn k-grid-edit" ng-click=\'update(dataItem)\'><div class="nimis-icon edit"></div></button>' +
                            '<button class="grid-btn k-grid-remove-command"><div class="nimis-icon delete"></div></button></div>',
                    },
                ],
                title: "&nbsp;",
                width: 100,
                sticky: true,
                attributes: {style: "text-align: center;"},
            });
        }
    },
]);
