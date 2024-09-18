angular
    .module('altairApp')
    .controller(
        '924NmsCtrl',
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

                $scope.memberDataSource = commonDataSource.urlDataSource("/api/nms/user/list", JSON.stringify({ filter: {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1}]}, sort: [{ field: "name", dir: "asc" }] }));
                $scope.ministerDataSource = commonDataSource.urlDataSource("/api/nms/general/governor/list", JSON.stringify({ filter: {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1}]}, sort: [{ field: "name", dir: "asc" }] }));

                $scope.selectOptions = {
                    placeholder: "Яам сонгох...",
               /*     valuePrimitive: true,*/
                    autoBind: true,
                    dataSource: $scope.ministerDataSource
                };

                $scope.ministerEditor = function(container, options) {
                    var editor = $('<select  kendo-multi-select k-options="selectOptions" k-data-text-field="\'name\'" k-data-value-field="\'id\'" data-bind="value:' + options.field + '"></select>')
                        .appendTo(container);
                };

                $scope.selectMemberOptions = {
                    placeholder: "Гишүүн сонгох...",
               /*     valuePrimitive: true,*/
                    autoBind: true,
                    dataSource: $scope.memberDataSource
                };

                $scope.memberEditor = function(container, options) {
                    var editor = $('<select  kendo-multi-select k-options="selectMemberOptions" k-data-text-field="\'name\'" k-data-value-field="\'id\'" data-bind="value:' + options.field + '"></select>')
                        .appendTo(container);
                };

                $scope.gridDataSource = {
                    transport: {
                        read: {
                            url: function (e) {
                                if (sessionStorage.getItem("buttonData").includes("read") && JSON.parse(sessionStorage.getItem('menuData')).url === $state.current.name) {
                                    return __env.apiUrl() + "/api/nms/stan/com/list";
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
                            url: __env.apiUrl() + "/api/nms/stan/com",
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
                            url: __env.apiUrl() + "/api/nms/stan/com",
                            contentType: "application/json; charset=UTF-8",
                            type: "DELETE",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            }
                        },
                        create: {
                            url: __env.apiUrl() + "/api/nms/stan/com",
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
                                id: {type: "number", nullable:true},
                                ministers: [],
                                members: [],
                                name: {type: "string"},
                                description: {type: "string"},
                                useYn: { type: "number", defaultValue: 1 }
                            }
                        }
                    },
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
                        {field: "name", title: "Нэр", width:250,  filterable: { cell: { operator: "contains", showOperators: false }}},
                        {field: "description", title: "Тайлбар", filterable: { cell: { operator: "contains", showOperators: false }}},
                        {field: "ministers",sortable:false, headerAttributes: {"class": "columnHeader"},editor:$scope.ministerEditor,  filterable:false,  template:"#for (var i=0,len=ministers.length; i<len; i++){#<span>${ ministers[i].name } #if(i!=ministers.length-1){#<span>,</span>#}# </span> # } #", title: "Яам"},
                        {field: "members",sortable:false, headerAttributes: {"class": "columnHeader"},editor:$scope.memberEditor,  filterable:false,  template:"#for (var i=0,len=members.length; i<len; i++){#<span>${ members[i].firstName } #if(i!=members.length-1){#<span>,</span>#}# </span> # } #", title: "Гишүүн"},
                    ],
                    dataBinding: function () {
                        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                    },
                    editable: "inline",

                    height: function () {
                        return $(window).height() - 110;
                    }
                };

                if (sessionStorage.getItem('buttonData').includes("read")) {
                    $scope.mainGrid.toolbar = ["excel", "search"];
                }
                if (sessionStorage.getItem('buttonData').includes("create")) {
                    $scope.mainGrid.toolbar = [{ template: "<button class='md-btn custom-btn k-grid-add'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>" }, "search"];
                }
                if (sessionStorage.getItem('buttonData').includes("update") || sessionStorage.getItem('buttonData').includes("edit")) {
                    $scope.mainGrid.columns.push({
                        command: [
                            {
                                template:
                                    '<div class="command-container"><a class="grid-btn k-grid-edit"><div class="nimis-icon edit"></div></a><a class="grid-btn k-grid-remove-command"><div class="nimis-icon delete"></div></a><a class="grid-btn k-grid-update"><div class="nimis-icon update"></div></a> <a class="grid-btn k-grid-cancel"><div class="nimis-icon cancel"></div></a></div>',
                            },
                        ], title: "&nbsp;", width: 80
                    });
                }
            }
        ]
    );
