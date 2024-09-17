angular
    .module('altairApp')
    .controller(
        '1011CntCtrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$timeout',
            'mainService',
            'sweet',
            '__env',
            function ($rootScope, $state, $scope, $timeout, mainService, sweet, __env) {
                $scope.user = JSON.parse(localStorage.getItem('currentUser'));
                $scope.planYr = localStorage.getItem('planYr');
                $scope.dataSource = function (planYr) {
                    $scope.planYr = planYr;
                    $scope.appDataSource = new kendo.data.DataSource({
                        transport: {
                            read: {
                                url: function (e) {
                                    if (localStorage.getItem("buttonData").includes("read") && JSON.parse(localStorage.getItem('menuData')).url === $state.current.name) {
                                        return __env.apiUrl() + "/api/cnt/done/list";
                                    }
                                    // else {
                                    //     localStorage.removeItem('currentUser');
                                    //     localStorage.removeItem('menuList');
                                    //     localStorage.removeItem('menuData');
                                    //     $rootScope.$broadcast('LogoutSuccessful');
                                    //     $state.go('login');
                                    //     $rootScope.expire = true;
                                    // }
                                },
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
//                                data: { planYr: $scope.planYr, parent: $scope.amg ? false : true, sort: [{ field: "fundTp", dir: "desc" }, { field: "lawNo", dir: "asc" }] },
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
                        pageSize: 10,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    });
                }

                $scope.dataSource($scope.planYr);
                $scope.planYr=localStorage.getItem('planYr');
                $scope.$on("loadPlanYr", function (event, obj) {
                    $scope.planYr = obj.planYr;
                    $scope.dataSource($scope.planYr);
                });

                $scope.statusFilter = function(element) {
                    element.kendoDropDownList({
                        dataSource: [{
                            text: "Нийтэлсэн",
                            value: "done"
                        }, {
                            title: "Нийтлээгүй",
                            value: ""
                        }],
                        operator: "eq",
                        optionLabel: "--Select Value--"
                    });
                }

                $scope.mainGrid = {
                    excel: {
                        fileName: "Projects.xlsx",
                        allPages: true,
                        filterable: true
                    },
                    sortable: true,
                    resizable: true,
                    persistSelection: true,
                    pageable: {
                        refresh: true,
                        pageSizes: true,
                        buttonCount: 5
                    },
                    filterable: {
                        mode: "row",
                        extra: false,
                        cell: {
                            operator: "eq"
                        }
                    },
                    columns: [
                        {
                            title: "#",
                            headerAttributes: { "class": "columnCenter" },
                            attributes: { "style": "text-align: center;" },
                            template: "#= ++record #",
                            stickable: true,
                            width: 80
                        },
                        {
                            field: "pipNm",
                            title: "Төсөл, арга хэмжээний нэр, хүчин чадал, байршил ТБХ",
                            width: 350,
                            filterable: { cell: { operator: "contains", showOperators: false } },
                            stickable: true,
                            sticky: true,
                        },
                        {
                            field: "status",
                            title: "Төлөв",
                            width: 100,
                            dataTextField: "text",
                            dataValueField: "value",
                            dataSource: [{
                               text: "Нийтэлсэн",
                               value: "done"
                           }, {
                               title: "Нийтлээгүй",
                               value: undefined
                           }],
                            filterable: { cell: { showOperators: false } },
                            stickable: true,
                            template: "<span>#if(status=='done'){# Нийтэлсэн #} else {# Нийтлээгүй #}#</span>",
                            sticky: true,
                        },
                        {
                            field: "lawNo",
                            title: "Хуулийн дугаар",
                            width: 120,
                            filterable: { cell: { operator: "contains", showOperators: false } },
                            stickable: true,
                        },
                        {
                            field: "tezId",
                            width: 240,
                            filterable: {
                                cell: {
                                    operator: "eq",
                                    suggestionOperator: "eq",
                                    showOperators: false
                                }
                            },
                            dataTextField: "name", dataValueField: "id", dataSource: $scope.sTezDataSource,
                            template: "<span>#if(minister!=null){# #=minister.name# #}#</span>",
                            title: "ТЕЗ ТБХ"
                        },
                        {
                            field: "aimag",
                            title: "Аймаг/Нийслэл ТБХ",
                            stickable: true,
                            filterable: {
                                cell: {
                                    operator: "eq",
                                    suggestionOperator: "eq",
                                    showOperators: false
                                }
                            },
                            width: 160,
                        },
                        {
                            field: "soum",
                            title: "Сум/Дүүрэг ТБХ",
                            stickable: true,
                            width: 170,
                        },
                        {
                            field: "srtDt",
                            title: "Эхлэх",
                            width: 100,
                            filterable: { cell: { operator: "startswith", showOperators: false } },
                            stickable: true,
                            attributes: { style: "text-align: center;" }
                        },
                        {
                            field: "endDt",
                            title: "Дуусах",
                            width: 100,
                            stickable: true,
                            filterable: { cell: { operator: "startswith", showOperators: false } },
                            attributes: { style: "text-align: center;" }
                        },
                        {
                            field: "pprAmt",
                            filterable: { cell: { operator: "eq", showOperators: false } },
                            template: "<span class='cellRight'>#= kendo.toString(pprAmt, 'n1') # </span>",
                            title: "Төсөвт өртөг (сая)",
                            aggregates: ["sum"],
                            stickable: true,
                            /*  footerTemplate: "#= kendo.toString(sum, 'n1')#",*/
                            width: 130
                        },
                        /*{
                            field: "objId",
                            title: "Объект",
                            stickable: true,
                            filterable: {
                                cell: {
                                    operator: "eq",
                                    suggestionOperator: "eq",
                                    showOperators: false
                                }
                            },
                            dataTextField: "cdNm", dataValueField: "id", dataSource: $scope.sObjDataSource,
                            template: "<span>#if(object!=null){# #=object.name# #}#</span>",
                            width: 150,
                        },*/
                        {
                            field: "supervisor.name",
                            title: "Хянагч байгууллага",
                            width: 200,
                            filterable: { multi: true, search: true },
                            template: "#if(supervisor!=null){# #=supervisor.name# #}#"
                        },
                        {
                            field: "consumer.name",
                            title: "Эрх шилжүүлсэн байгууллага",
                            width: 200,
                            filterable: { multi: true, search: true },
                            template: "#if(consumer!=null){# #=consumer.name# #}#"
                        },
                    ],
                    dataBinding: function () {
                        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                    },
                    editable: false,
                    height: function () {
                        return $(window).height() - 115;
                    }
                };
                $scope.mainGrid.toolbar = [];

                if(localStorage.getItem('buttonData').includes("C")){
                }
                if(localStorage.getItem('buttonData').includes("R")){
                    $scope.mainGrid.toolbar.push("search");
                }
                if(localStorage.getItem('buttonData').includes("U")){
                    $scope.mainGrid.columns.push({
                        command: [
                            {template:"<button class=\"k-button k-button-icontext\" ng-if=\"dataItem.status!='done'\" ng-click='publish(dataItem)'>Нийтлэх</button>"+
                                    "<button class=\"k-button k-button-icontext\" ng-if=\"dataItem.status=='done'\" ng-click='publish(dataItem)'>Засах</button>"+
                                    "<button class=\"k-button k-button-icontext\" ng-if=\"dataItem.status=='done'\" ng-click='stopPublishing(dataItem)'><span class=\"k-icon k-i-trash\"></span></button>"
                            }
                        ], title: "&nbsp;", width: 140,sticky: true, attributes: {"style":"text-align: left;"},
                    });
                }

                $scope.publish = function(apprDone) {
                    $scope.$broadcast("publishDone", apprDone);
                    $("#main_content").hide();
                    $("#publishScreen").show();
                }

                $scope.stopPublishing = function(apprDone) {
                    sweet.show({
                        title: 'Нийтлэхийг болих',
                        text: 'Та энэ үйлдлийг хийхдээ итгэлтэй байна уу?',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#DD6B55',
                        confirmButtonText: 'Тийм',
                        cancelButtonText: 'Үгүй',
                        closeOnConfirm: false,
                        closeOnCancel: true
                    }, function (inputvalue) {
                        if(inputvalue) {
                            mainService.withdata('post', __env.apiUrl() + '/api/cnt/done/unpublish/'+apprDone.id, {}).then(function() {
                                sweet.close();
                                $("#appData").data("kendoGrid").dataSource.read();
                                $rootScope.alert(true, "Нийтэлснийг болиуллаа");
                            });
                        }
                    });
                }
            }
        ]
    );
