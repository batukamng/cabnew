angular.module("altairApp").controller("927NmsCtrl", [
    '$rootScope',
    '$state',
    '$scope',
    '$timeout',
    '$translate',
    'commonDataSource',
    'mainService',
    '__env',
    function ($rootScope, $state, $scope, $timeout, $translate, commonDataSource,mainService,__env) {
        $scope.user = JSON.parse(localStorage.getItem("currentUser")).user;
        $scope.planYr = localStorage.getItem("planYr");

        $scope.hidden = false;
        $scope.toggleSidebar = function() {
            $scope.hidden = !$scope.hidden;
        }

        //Төрөл
        $scope.sProTypeDataSource = commonDataSource.urlDataSource("/api/nms/common/list", JSON.stringify({ filter: {logic: "and", filters: [{field: "grpCd", operator: "contains", value: "propType"},{field: "parentId", operator: "isNull", value: "false"}]}, sort: [{ field: "orderId", dir: "asc" }] }));

        $scope.init = function () {
            var filters = JSON.parse(localStorage.getItem("filters"));
            $scope.dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: function (e) {
                            if (localStorage.getItem("buttonData").includes("read") && JSON.parse(localStorage.getItem('menuData')).url === $state.current.name) {
                                return __env.apiUrl() + "/api/nms/state/prop/list";
                            }
                            else {
                                localStorage.removeItem('currentUser');
                                localStorage.removeItem('menuList');
                                localStorage.removeItem('menuData');
                                $state.go('login');
                            }
                        },
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
                        data: {
                            filter: {
                                logic: "and",
                                filters: filters || [],
                            },
                            sort: [{field: "orgName", dir: "asc"}, {field: "orgRegNo", dir: "asc"}, {field: "orgPropRegNum", dir: "asc"}],
                        },
                        beforeSend: function (req) {
                            req.setRequestHeader(
                                "Authorization",
                                "Bearer " +
                                JSON.parse(localStorage.getItem("currentUser")).token
                            );
                        },
                    },
                    update: {
                        url: __env.apiUrl() + "/api/nms/state/prop",
                        contentType: "application/json; charset=UTF-8",
                        type: "PUT",
                        beforeSend: function (req) {
                            req.setRequestHeader(
                                "Authorization",
                                "Bearer " +
                                JSON.parse(localStorage.getItem("currentUser")).token
                            );
                        },
                        complete: function (e) {
                            $(".k-grid").data("kendoGrid").dataSource.read();
                        },
                    },
                    destroy: {
                        url: __env.apiUrl() + "/api/nms/state/prop",
                        contentType: "application/json; charset=UTF-8",
                        type: "DELETE",
                        beforeSend: function (req) {
                            req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                        }
                    },
                    create: {
                        url: __env.apiUrl() + "/api/nms/state/prop",
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
                        beforeSend: function (req) {
                            req.setRequestHeader(
                                "Authorization",
                                "Bearer " +
                                JSON.parse(localStorage.getItem("currentUser")).token
                            );
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
                            orgName: {type: "string", nullable: true},
                            orgRegNo: {type: "string", nullable: true},
                            orgPropRegNum: {type: "string", nullable: true},
                            bldNm: {type: "string", nullable: true},
                            propTypeName: {type: "string", nullable: true},
                            amgNm: {type: "string", nullable: true},
                            sumNm: {type: "string", nullable: true},
                            bagNm: {type: "string", nullable: true},
                            commissionedDate: {type: "string", nullable: true},
                            totServiceLife: {type: "string", nullable: true},
                            repAmt: {type: "string", nullable: true},
                            accDepAmt: {type: "string", nullable: true},
                            resCostAmt: {type: "string", nullable: true},
                            statusName: {type: "string", nullable: true},
                            finBalanceStatus: {type: "string", nullable: true},
                            statePropTypeName: {type: "string", nullable: true},
                            statePropType: {type: "string", nullable: true},
                            parentOrgName: {type: "string", nullable: true},
                            amgId: {type: "number", nullable: true},
                            sumId: {type: "number", nullable: true},
                            bagId: {type: "number", nullable: true},
                            useYn: {type: "number", defaultValue: 1},
                        },
                    },
                },
                pageSize: 20,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
                filter: {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1}]}
            });
        };
        $scope.init();
        $scope.main1Grid = {
            filterable: {
                mode: "row",
                extra: false,
                operators: {
                    string: {
                        contains: "Агуулсан",
                        startswith: "Эхлэх утга",
                        isnull: "Хоосон",
                        eq: "Тэнцүү",
                        gte: "Их",
                        lte: "Бага",
                    },
                },
            },
            sortable: true,
            resizable: true,
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
                    width: 50,
                    sticky: true,
                },
                {
                    field: "orgName",
                    filterable: {cell: {operator: "eq", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Нэр",
                    width: 120,
                    sticky: true,
                },
                {
                    field: "orgRegNo",
                    filterable: {cell: {operator: "eq", showOperators: true}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Регистр",
                    width: 120,
                    sticky: true,
                },
                {
                    field: "orgPropRegNum",
                    filterable: {cell: {operator: "eq", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Өмчийн бүртгэлийн дугаар",
                    width: 120,
                    sticky: true,
                },
                {
                    field: "bldNm",
                    filterable: {cell: {operator: "eq", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Өмчийн нэр",
                    width: 200,
                    sticky: true,
                },
                {
                    field: "propTypeName",
                    filterable: {cell: {operator: "eq", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Өмчийн төрөл",
                    width: 120,
                },
                {
                    field: "amgNm",
                    filterable: {cell: {operator: "eq", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Аймаг",
                    width: 100,
                },
                {
                    field: "sumNm",
                    filterable: {cell: {operator: "eq", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Сум",
                    width: 100,
                },
                {
                    field: "bagNm",
                    filterable: {cell: {operator: "eq", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Баг",
                    width: 100,
                },
                {
                    field: "commissionedDate",
                    template: "<div style='text-align: left;width:100%;'>#=(commissionedDate == null)? '' : kendo.toString(kendo.parseDate(commissionedDate, 'yyyyMMdd'), 'yyyy.MM.dd') #</div>",
                    filterable: {cell: {operator: "eq", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Ашиглалтад орсон огноо",
                    width: 100,
                    attributes: { "style": "text-align: center;" }
                },
                {
                    field: "totServiceLife",
                    filterable: {cell: {operator: "eq", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Ашиглалтын нийт хугацаа",
                    width: 100,
                    attributes: { "style": "text-align: right;" }
                },
                {
                    field: "repAmt",
                    template: "<span>{{dataItem.repAmt | number :0}} ₮</span>",
                    format: "{0:#,##0.##}",
                    filterable: {cell: {operator: "eq", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Санхүүгийн тайланд тусгагдсан дүн",
                    width: 100,
                    attributes: { "style": "text-align: right;" }
                },
                {
                    field: "accDepAmt",
                    template: "<span>{{dataItem.accDepAmt | number :0}} ₮</span>",
                    format: "{0:#,##0.##}",
                    filterable: {cell: {operator: "eq", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Хуримтлагдсан элэгдэл",
                    width: 100,
                    attributes: { "style": "text-align: right;" }
                },
                {
                    field: "resCostAmt",
                    template: "<span>{{dataItem.resCostAmt | number :0}} ₮</span>",
                    format: "{0:#,##0.##}",
                    filterable: {cell: {operator: "eq", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Үлдэгдэл өртөг",
                    width: 100,
                    attributes: { "style": "text-align: right;" }
                },
                {
                    field: "statusName",
                    filterable: {cell: {operator: "eq", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Төлөв",
                    width: 100,
                    attributes: { "style": "text-align: center;" }
                },
                {
                    field: "finBalanceStatus",
                    filterable: {cell: {operator: "eq", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Тайлбар",
                    width: 100,
                },
                {
                    field: "statePropTypeName",
                    filterable: {cell: {operator: "eq", showOperators: false}},
                    headerAttributes: {class: "columnHeader"},
                    title: "Хөрөнгийн төрөл",
                    width: 100,
                    attributes: { "style": "text-align: center;" }
                }
            ],
            dataBinding: function () {
                record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
            },
            editable: false,
            scrollable: true,
            height: function () {
                return $(window).height() - 160;
            },
        };
        if (localStorage.getItem("buttonData").includes("R")) {
            $scope.main1Grid.toolbar = ["excel", "search"];
        }

        if (localStorage.getItem("buttonData").includes("create")) {
            $scope.main1Grid.toolbar = [
                { template: "<button class='md-btn custom-btn' ng-click='createApp(0)'><i class='material-icons text-white mr-1'>add</i>Хайх</button>" },
                "search"
            ];
        }

        if (localStorage.getItem('buttonData').includes("update") || localStorage.getItem('buttonData').includes("edit")) {
            $scope.main1Grid.columns.push({
                command: [
                    {
                        template:
                            '<div class="flex gap-3"><button class="grid-btn k-grid-edit" ng-click=\'gotoDetail(dataItem)\'><div class="nimis-icon edit"></div></button><button class="grid-btn k-grid-remove-command" ng-click=\'deleteData(dataItem)\'><div class="nimis-icon delete"></div></button></div>',
                    },
                ], title: "&nbsp;", sticky: true, width: 100
            });
        }

        $scope.deleteData = function (item) {
            if(confirm("Тухайн бүртгэлийг устгахдаа итгэлтэй байна уу?")){
                mainService.withdata('delete', __env.apiUrl() + '/api/nms/state/prop/' + item.id)
                    .then(function (data) {
                            $rootScope.alert(true, "Устгах үйлдэл амжилттай боллоо.");
                            $(".k-grid").data("kendoGrid").dataSource.read();
                        }
                    );
            }
        };

        $scope.statePropInfo = {};
        $scope.statePropInfoWs = {};
        $scope.gotoDetail = function (item) {
            $scope.statePropInfo.id = item.id;
            $scope.statePropInfo.orgName = item.orgName;
            $scope.statePropInfo.orgRegNo = item.orgRegNo;
            $scope.statePropInfo.orgPropRegNum = item.orgPropRegNum;
            $scope.statePropInfo.bldNm = item.bldNm;
            $scope.statePropInfo.propTypeName = item.propTypeName;
            $scope.statePropInfo.amgNm = item.amgNm;
            $scope.statePropInfo.sumNm = item.sumNm;
            $scope.statePropInfo.bagNm = item.bagNm;
            $scope.statePropInfo.commissionedDate = item.commissionedDate;
            $scope.statePropInfo.totServiceLife = item.totServiceLife;
            $scope.statePropInfo.repAmt = item.repAmt;
            $scope.statePropInfo.accDepAmt = item.accDepAmt;
            $scope.statePropInfo.resCostAmt = item.resCostAmt;
            $scope.statePropInfo.statusName = item.statusName;
            $scope.statePropInfo.statePropTypeName = item.statePropTypeName;
            $scope.statePropInfo.finBalanceStatus = item.finBalanceStatus;
            $scope.statePropInfo.amgId = item.amgId;
            $scope.statePropInfo.sumId = item.sumId;
            $scope.statePropInfo.bagId = item.bagId;

            mainService.withdata("post",__env.apiUrl() + "/api/nms/state/prop/checkstateprop/",
                JSON.stringify({xxRegNo: item.orgRegNo, xxOrganizationPropertyRegNum: item.orgPropRegNum, xxType:item.statePropType})).then(function (data) {
                $scope.statePropInfoWs = data;
                $scope.statePropInfoWs.amgId = item.amgId;
                $scope.statePropInfoWs.sumId = item.sumId;
                $scope.statePropInfoWs.bagId = item.bagId;
            });
            UIkit.modal("#modal_application", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true,
            }).show();
        };

        $scope.submitProject = function (event) {
            event.preventDefault();
            if ($scope.validatorProject.validate()) {
                $scope.statePropMainInfo = $scope.statePropInfo;
                $scope.statePropInfoFromWs = $scope.statePropInfoWs;

                if ($scope.statePropMainInfo != null) {
                    $scope.statePropInfoFromWs.id = $scope.statePropMainInfo.id;
                    $scope.statePropInfoFromWs.amgId = $scope.statePropMainInfo.amgId;
                    $scope.statePropInfoFromWs.sumId = $scope.statePropMainInfo.sumId;
                    $scope.statePropInfoFromWs.bagId = $scope.statePropMainInfo.bagId;
                    $scope.statePropInfoFromWs.parentOrgName = $scope.statePropInfoWs.parentOrgName;
                }
                mainService.withdata("post", __env.apiUrl() + "/api/nms/state/prop/createMain", $scope.statePropInfoFromWs)
                    .then(function (data) {
                        $rootScope.alert(true, "Амжилттай.");
                        UIkit.modal("#modal_application").hide();
                        $("#app1Data").data("kendoGrid").dataSource.read();
                        // $timeout(function () { $state.go("restricted.nms.common.927");}, 10);
                    });
            } else {
                $rootScope.alert(false, "Бүрэн бөглөнө үү.");
            }
        };

        $scope.getInfo = function () {

            if ($scope.app.xxRegNo != null && $scope.app.xxOrganizationPropertyRegNum != null && $scope.app.xxType != null) {
                mainService.withdata("post",__env.apiUrl() + "/api/nms/state/prop/checkstateprop/",
                    JSON.stringify({xxRegNo: $scope.app.xxRegNo, xxOrganizationPropertyRegNum: $scope.app.xxOrganizationPropertyRegNum, xxType:$scope.app.xxType})).then(function (data) {
                    $scope.statePropInfoWs = data;
                });
            } else {
                $rootScope.alert(false, "Хайлтын нөхцлүүдийг бүрэн оруулж шалгана уу!!!");
            }
        }

        $scope.saveInfo = function (event) {
            event.preventDefault();
            $scope.statePropInfoFromWs = $scope.statePropInfoWs;
            if ($scope.statePropInfoWs != null) {
                mainService.withdata("post", __env.apiUrl() + "/api/nms/state/prop/saveInfo", $scope.statePropInfoFromWs)
                    .then(function (data) {
                        $rootScope.alert(true, "Амжилттай.");
                        UIkit.modal("#modal_application_ws").hide();
                        $timeout(function () { $state.go("restricted.nms.common.927");}, 10);
                    });
            } else {
                $rootScope.alert(false, "Хадгалах мэдээл алга!!!");
            }
        };

        $scope.app = {};
        $scope.createApp = function () {
            UIkit.modal("#modal_application_ws", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true,
            }).show();
        };
    },
]);