angular.module("altairApp")
    .controller("planTestCtrl", [
        "$rootScope",
        "$state",
        "$scope",
        "$timeout",
        "mainService",
        "commonDataSource",
        "sweet",
        "Upload",
        "__env",
        function ($rootScope, $state, $scope, $timeout, mainService, commonDataSource, sweet, Upload, __env) {
            $scope.user = JSON.parse(sessionStorage.getItem("currentUser")).user;
            $("#header_main").attr("style", "filter: none !important;padding: 8px 25px");
            $scope.menuData = JSON.parse(sessionStorage.getItem("menuData"));


            var statusArr=statusArr=[{"text":"Баталсан","value":"Баталсан"},{"text":"Хянасан","value":"Хянасан"},{"text":"Буцаасан","value":"Цуцалсан"},{"text":"Хадгалсан","value":"Хадгалсан"}];

            $scope.years=[{text:"2024",value:2024},{text:"2025",value:2025},{text:"2026",value:2026},{text:"2027",value:2027},{text:"2028",value:2028},{text:"2029",value:2029},{text:"2030",value:2030}];
            $scope.dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: __env.apiUrl() + "/api/cab/plan/list",
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
                        data: {
                            sort: [{field: "id", dir: "desc"}],
                        },
                        beforeSend: function (req) {
                            req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
                        },
                    },
                    destroy: {
                        url: __env.apiUrl() + "/api/cab/plan",
                        contentType: "application/json; charset=UTF-8",
                        beforeSend: function (req) {
                            req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
                        },
                        complete: function (e) {
                            $(".k-grid").data("kendoGrid").dataSource.read();
                        },
                        type: "DELETE",
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
                            useYn: {type: "number", defaultValue: 1}
                        },
                    },
                },
                filter: {
                    logic: "and",
                    filters: [
                        {
                            field: "useYn",
                            operator: "eq",
                            value: 1,
                        },
                        {
                            field: "orgId",
                            operator: "eq",
                            value: $scope.user.orgId,
                        }
                    ],
                },
                pageSize: 20,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
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
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5,
                },
                // toolbar: ["excel"],
                columns: [
                    {
                        title: "#",
                        headerAttributes: {class: "checkbox-align"},
                        attributes: {style: "text-align: center;"},
                        template: "#= ++record #",
                        width: 50,
                    },
                    {
                        field: "orgNm",
                        filterable: {
                            cell: {
                                operator: "contains",
                                suggestionOperator: "contains",
                                showOperators: false
                            }
                        },
                        title: "Байгууллага",
                    },
                    {
                        field: "fullDesc",
                        filterable: {
                            cell: {
                                operator: "contains",
                                suggestionOperator: "contains",
                                showOperators: false
                            }
                        },
                        title: "Төлөвлөгөө",
                    },
                    {
                        field: "planYr",
                        filterable: {
                            cell: {
                                operator: "contains",
                                suggestionOperator: "contains",
                                showOperators: false
                            }
                        },
                        title: "Огноо",
                        headerAttributes: { "class": "checkbox-align"},
                        attributes: {style: "text-align: center;"},
                        width:100
                    },

                    {
                        field: "statusNm",
                        filterable: {cell: {operator: "contains", showOperators: false}},
                        attributes: {style: "text-align: center;"},
                        headerAttributes: { "class": "checkbox-align"},
                        values:statusArr,
                        template:
                            '#if(statusNm!=null){#<button class=\'grid-btn grid-stat\' ng-class=\'{"bg-emerald-600 text-white": dataItem.statusNm=="Баталсан","bg-rose-500 text-white": dataItem.statusNm=="Цуцалсан","bg-rose-500 text-white": dataItem.statusNm=="Нэмэлт гэрээ", "bg-orange-600": dataItem.statusNm=="Илгээсэн",' +
                            " \"bg-indigo-400\": dataItem.statusNm==\"Хувиарласан\", \"bg-zinc-500\": dataItem.statusNm==\"Хадгалсан\", \"bg-red-500\": dataItem.statusNm==\"Цуцалсан\"}' style='display: inline-flex;' ng-click='progress(dataItem)'><div class='nimis-icon see'></div><span ng-bind='dataItem.statusNm'></span></button> #}#",
                        title: "Төлөв",
                        width: 120,
                    },
                    {
                        attributes: {"class": "checkbox-align"},
                        headerAttributes: { "class": "checkbox-align"},
                        title: "Гүйцэтгэлийн зорилт, арга хэмжээ",
                        columns:[
                            {
                                field: "obj1Cnt",
                                filterable: {
                                    cell: {
                                        operator: "contains",
                                        suggestionOperator: "contains",
                                        showOperators: false
                                    }
                                },
                                attributes: {"class": "checkbox-align",style:"text-align:center;"},
                                headerAttributes: {"class": "checkbox-align"},
                                title: "Зорилт",
                                width: 120,
                            },
                            {
                                field: "det1Cnt",
                                filterable: {
                                    cell: {
                                        operator: "contains",
                                        suggestionOperator: "contains",
                                        showOperators: false
                                    }
                                },
                                attributes: {"class": "checkbox-align",style:"text-align:center;"},
                                headerAttributes: {"class": "checkbox-align"},
                                title: "Арга хэмжээ",
                                width: 120,
                            },
                        ]
                    },
                    {
                        headerAttributes: { "class": "checkbox-align"},
                        title: "Мэдлэг, ур чадвараа дээшлүүлэх",
                        columns:[
                            {
                                field: "obj2Cnt",
                                filterable: {
                                    cell: {
                                        operator: "contains",
                                        suggestionOperator: "contains",
                                        showOperators: false
                                    }
                                },
                                attributes: {"class": "checkbox-align",style:"text-align:center;"},
                                headerAttributes: {"class": "checkbox-align"},
                                title: "Зорилт",
                                width: 120,
                            },
                            {
                                field: "det2Cnt",
                                filterable: {
                                    cell: {
                                        operator: "contains",
                                        suggestionOperator: "contains",
                                        showOperators: false
                                    }
                                },
                                attributes: {"class": "checkbox-align",style:"text-align:center;"},
                                headerAttributes: {"class": "checkbox-align"},
                                title: "Арга хэмжээ",
                                width: 120,
                            },
                        ]
                    },
                    {
                        field: "userCnt",
                        filterable: {
                            cell: {
                                operator: "contains",
                                suggestionOperator: "contains",
                                showOperators: false
                            }
                        },
                        title: "Албан хаагч",
                        headerAttributes: { "class": "checkbox-align"},
                        attributes: {style: "text-align: center;"},
                        width:100
                    },
                ],
                dataBinding: function () {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                },
                editable: "inline",
                scrollable: true,
                height: function () {
                    if ($scope.menuData.pageType === 0) {
                        return $(window).height() - 160;
                    }
                    return $(window).height() - 115;
                }
            };

            if (sessionStorage.getItem("buttonData").includes("read")) {
                $scope.mainGrid.toolbar = ["excel", "search"];
            }
            if (sessionStorage.getItem("buttonData").includes("create")) {
                $scope.mainGrid.toolbar = [{template: "<button class='md-btn custom-btn' ng-click='add()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>"}];
            }
            if (sessionStorage.getItem("buttonData").includes("update") || sessionStorage.getItem("buttonData").includes("edit")) {
                $scope.mainGrid.columns.push({
                    command: [
                        {
                            template:
                                '<div class="flex justify-center gap-3"><button label="detail" class="grid-btn k-grid-edit" ng-click=\'update(dataItem)\'><div class="nimis-icon see "></div></button><button label="delete" class="grid-btn k-grid-remove-command" ng-click=\'deleteLevel(dataItem)\'><div class="nimis-icon delete"></div></button></div>',
                        },
                    ],
                    title: "Үйлдэл",
                    width: 80,
                });
            }

            var modalForm = UIkit.modal("#modal_form", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true
            });

            $scope.add = function () {
                $scope.dataItem = {useYn: 1,orgId:$scope.user.orgId,userId:$scope.user.id, status: "draft"};
                $timeout(() => $rootScope.clearForm("userForm"));
                modalForm.show();
            }
            $scope.update = function (item) {
                $scope.dataItem = item;
                $state.go("restricted.cabinet.plan-org-edit", {id: item.id});
               // modalForm.show();
            }
            var loader = UIkit.modal("#modal_loader", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true,
            });
            $scope.formSubmit = function () {
                var validator = $("#validator").kendoValidator().data("kendoValidator");
                if (validator.validate()) {
                    modalForm.hide();
                    loader.show();
                    var method = "post";
                    if ($scope.dataItem.id !== undefined && $scope.dataItem.id !== null) method = "put";
                    mainService.withResponse("post", "/api/cab/plan/submit", $scope.dataItem).then(function (response) {

                        if(response.status===200){
                            loader.hide();
                            $timeout(function (){
                                $rootScope.alert(true, "Төлөвлөгөө амжилттай бүртгэлээ.");
                                $state.go("restricted.cabinet.plan-org-edit", {id: response.data.id});
                            },500)
                        }
                        else{
                            loader.hide();
                            $rootScope.alert(false,"Төлөвлөгөө үүссэн байна!!!");
                        }
                    });
                }
            };


            $scope.progress = function (dataItem) {
                $scope.contractView = dataItem;
                $scope.currentStep = 1;
                mainService.withdata("get", __env.apiUrl() + "/api/nms/activity-log/plan/" + dataItem.id).then(function (data) {
                    $scope.steps = data;
                    if ($scope.steps.length > 0) {
                        $scope.currentStep = $scope.steps[$scope.steps.length - 1].step;
                    }
                    UIkit.modal("#modal_progress", {
                        modal: false,
                        keyboard: false,
                        bgclose: false,
                        center: true,
                    }).show();
                });
            };
        },
    ]);
