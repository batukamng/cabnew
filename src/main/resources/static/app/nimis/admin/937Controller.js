angular.module("altairApp").controller("937NmsCtrl", [
    "$rootScope",
    "$state",
    "$scope",
    "$timeout",
    "mainService",
    "__env",
    function ($rootScope, $state, $scope, $timeout, mainService, __env) {
        $scope.createModal = function () {
            $scope.arr = {};
            $state.go("restricted.nms.940", {id: 0});
        };
        $scope.updateModal = function (item) {
            $state.go("restricted.nms.940", {id: item.id});
        };
        $scope.menuData = JSON.parse(sessionStorage.getItem("menuData"));
        $scope.mainGrid = {
            dataSource: {
                transport: {
                    read: {
                        url: __env.apiUrl() + "/api/nms/role/list",
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
                        data: {
                            filter: {
                                logic: "and",
                                filters: [{field: "useYn", operator: "eq", value: 1}],
                            },
                            sort: [{field: "name", dir: "asc"}],
                        },
                        beforeSend: function (req) {
                            req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
                        },
                    },
                    destroy: {
                        url: __env.apiUrl() + "/api/nms/role",
                        contentType: "application/json; charset=UTF-8",
                        beforeSend: function (req) {
                            req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
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
                    },
                },
                pageSize: 20,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
            },
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
            columns: [
                {
                    title: "#",
                    headerAttributes: {class: "checkbox-align"},
                    attributes: {style: "text-align: center;"},
                    template: "#= ++record #",
                    sticky: true,
                    width: 50,
                },
                {
                    field: "name",
                    headerAttributes: {class: "columnHeader"},
                    filterable: {cell: {operator: "contains", showOperators: false}},
                    title: '{{"Role" | translate}}' + " (mn)",
                },
                {
                    field: "auth",
                    headerAttributes: {class: "columnHeader"},
                    filterable: {cell: {operator: "contains", showOperators: false}},
                    title: '{{"Role" | translate}}' + " (en)",
                },

                /*  {field: "rolePrivileges", headerAttributes: {"class": "columnHeader"},editor:$scope.menuEditor,  filterable:false,  template:"#for (var i=0,len=rolePrivileges.length; i<len; i++){#<span>${ rolePrivileges[i].menu.name } #if(i!=rolePrivileges.length-1){#<span>,</span>#}# </span> # } #", title: '{{"Menu" | translate}}'},*/
                /*{field: "privileges", headerAttributes: {"class": "columnHeader"},width:200, editor:$scope.priEditor,  filterable:false,  template:"#for (var i=0,len=privileges.length; i<len; i++){#<span>${ privileges[i].name } #if(i!=privileges.length-1){#<span>,</span>#}# </span> # } #", title: '{{"Role" | translate}}'},*/
               /* {
                    field: "useYn",
                    headerAttributes: {class: "columnHeader"},
                    template: "#if(useYn){# <span class='columnCenter'>Y</span> #}else{#<span class='columnCenter uk-text-danger'>N</span> #}#",
                    title: '{{"Use" | translate}}',
                    width: 130,
                },*/
            ],
            dataBinding: function () {
                record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
            },
            editable: "inline",
            height: function () {
                if ($scope.menuData.pageType === 0) {
                    return $(window).height() - 160;
                }
                return $(window).height() - 115;
            }
        };
        $scope.mainGrid.toolbar = [{template: "<button class='md-btn custom-btn k-grid-add' ng-click='createModal()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>"}];
        $scope.mainGrid.columns.push({
            command: [
                {
                    template:
                        '<div class="command-container" style="padding-left:5px;"><a class="grid-btn k-grid-edit" ng-click="updateModal(dataItem)"><div class="nimis-icon edit"></div></a><a class="grid-btn k-grid-remove-command"><div class="nimis-icon delete"></div></a><a class="grid-btn k-grid-update"><div class="nimis-icon update"></div></a> <a class="grid-btn k-grid-cancel"><div class="nimis-icon cancel"></div></a></div>',
                },
            ],
            title: "&nbsp;",
            width: 80,
        });
        if (JSON.parse(sessionStorage.getItem("roles")) != null) {
            var privileges = JSON.parse(sessionStorage.getItem("roles"));
            angular.forEach(privileges, function (value, key) {
                if (value.name === "WRITE") {
                    $scope.mainGrid.toolbar = [
                        {
                            template: '<button class="k-button k-button-icontext k-grid-add"><span class="k-icon k-i-plus"></span>Нэмэх</button>',
                        },
                        "search",
                    ];
                }
                if (value.name === "UPDATE") {
                    $scope.mainGrid.columns.push({
                        command: [
                            {name: "edit", text: {edit: " ", update: " ", cancel: " "}},
                            {name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn"},
                        ],
                        title: "&nbsp;",
                        width: 100,
                    });
                }
            });
        }
    },
]);
