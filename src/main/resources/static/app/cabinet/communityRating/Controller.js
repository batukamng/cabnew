angular.module("altairApp")
    .controller("communityRatingCtrl", [
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

            $scope.dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: __env.apiUrl() + "/api/admin/v1/cab-plan-user/list",
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
                        data: {
                            sort: [{field: "id", dir: "desc"}],
                        },
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
                            field: "userId",
                            operator: "eq",
                            value: $scope.user.id
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
                        field: "userNm",
                        filterable: {
                            cell: {
                                operator: "contains",
                                suggestionOperator: "contains",
                                showOperators: false
                            }
                        },
                        title: "Албан хаагч",
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
                        width:150
                    },
                    {
                        field: "userStatusNm",
                        filterable: {
                            cell: {
                                operator: "contains",
                                suggestionOperator: "contains",
                                showOperators: false
                            }
                        },
                        title: "Төлөв",
                        headerAttributes: { "class": "checkbox-align"},
                        attributes: {style: "text-align: center;"},
                        width:150
                    },
                    {
                        field: "objCnt",
                        filterable: {
                            cell: {
                                operator: "contains",
                                suggestionOperator: "contains",
                                showOperators: false
                            }
                        },
                        headerAttributes: { "class": "checkbox-align"},
                        attributes: {style: "text-align: center;"},
                        title: "Нийт зорилт",
                        width: 150,
                    },
                    {
                        headerAttributes: { "class": "checkbox-align"},
                        attributes: {style: "text-align: center;"},
                        title: "Гүйцэтгэлийн зорилт, арга хэмжээ",
                        columns:[
                            {
                                field: "obj1Cnt",
                                filterable: {
                                    cell: {
                                        operator: "eq",
                                        suggestionOperator: "eq",
                                        showOperators: false
                                    }
                                },
                                headerAttributes: { "class": "checkbox-align"},
                                attributes: {style: "text-align: center;"},
                                title: "Зорилт",
                                width: 150,
                            },
                            {
                                field: "obj1TypeCnt",
                                filterable: {
                                    cell: {
                                        operator: "eq",
                                        suggestionOperator: "eq",
                                        showOperators: false
                                    }
                                },
                                headerAttributes: { "class": "checkbox-align"},
                                attributes: {style: "text-align: center;"},
                                title: "Арга хэмжээ",
                                width: 150,
                            },
                        ]
                    },
                    {
                        headerAttributes: { "class": "checkbox-align"},
                        attributes: {style: "text-align: center;"},
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
                                headerAttributes: { "class": "checkbox-align"},
                                attributes: {style: "text-align: center;"},
                                title: "Зорилт",
                                width: 150,
                            },
                            {
                                field: "obj2TypeCnt",
                                filterable: {
                                    cell: {
                                        operator: "eq",
                                        suggestionOperator: "eq",
                                        showOperators: false
                                    }
                                },
                                headerAttributes: { "class": "checkbox-align"},
                                attributes: {style: "text-align: center;"},
                                title: "Арга хэмжээ",
                                width: 150,
                            },
                        ]
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
                    return $(window).height() - 110;
                }
            };

            if (sessionStorage.getItem("buttonData").includes("read")) {
                $scope.mainGrid.toolbar = ["excel", "search"];
            }
            if (sessionStorage.getItem("buttonData").includes("update") || sessionStorage.getItem("buttonData").includes("edit")) {
                $scope.mainGrid.columns.push({
                    command: [
                        {
                            template:
                                '<div class="flex justify-center gap-3"><button class="grid-btn" ng-click=\'gotoDetail(dataItem)\'><div class="nimis-icon see "></div>Харах</button></div>',
                        },
                    ],
                    title: "&nbsp;",
                    headerAttributes: {class: "rightMinus"},
                    attributes: {class: "rightMinus uk-text-center"},
                    sticky: true,
                    width: 100,
                });
            }

            $scope.gotoDetail = function (item) {
                $state.go("restricted.cabinet.worker-plan-edit", {id: item.id,userId: item.userId});
            }
        },
    ]);
