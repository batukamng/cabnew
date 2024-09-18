angular
    .module('altairApp')
    .controller(
        'organizationCtrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$timeout',
            '__env',
            'commonDataSource',
            'mainService',
            '$translate',
            function ($rootScope, $state, $scope, $timeout, __env, commonDataSource,mainService,$translate) {

                $scope.formSubmit = function () {
                    var validator = $("#validator").kendoValidator().data("kendoValidator");
                    if (validator.validate()) {
                        var method = "post";
                        if ($scope.dataItem.id!==undefined && $scope.dataItem.id!==null) method="put";

                        var obj={
                            id:$scope.dataItem.id,
                            name:$scope.dataItem.name,
                            email:$scope.dataItem.email,
                            phone:$scope.dataItem.phone,
                            address:$scope.dataItem.address,
                            web:$scope.dataItem.web
                        };

                        mainService.withdata(method, "/api/admin/organization",obj).then(function (data) {
                            $rootScope.alert(true, "Амжилттай хадгаллаа.");
                            modalForm.hide();
                            $(".k-grid").data("kendoGrid").dataSource.read();
                        });
                    }
                };
                $scope.categories = {};
                var modalForm = UIkit.modal("#modal_form", {
                    modal: false,
                    keyboard: false,
                    bgclose: false,
                    center: true,
                });

                $scope.add=function (){
                    $scope.dataItem = {useYn: 1};
                    $scope.categories = {};
                    $scope.isCheckAll = false;
                    modalForm.show();
                }
                $scope.update = function (item) {
                    $scope.dataItem = item;
                  /*  $scope.categories = {};

                    $scope.isCheckAll = false;
                    if (item.catIds != null && item.catIds.length > 0) {
                        $scope.dataItem.categories = item.catIds.split(",");
                        if ($scope.dataItem.categories !== undefined) {
                            $scope.dataItem.categories.map(function (x) {
                                $scope.categories[parseInt(x)] = 1;
                            });
                        }
                    }*/
                    modalForm.show();
                };


                $scope.dataSource = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: __env.apiUrl() + "/api/admin/organization/list",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            data: { sort: [{ field: "id", dir: "desc" }] },
                            beforeSend: function (req) {
                                if (JSON.parse(sessionStorage.getItem('currentUser')) != null) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                }
                                else {
                                    $state.go('login');
                                    $rootScope.$broadcast('LogoutSuccessful');
                                }
                            }
                        },
                        destroy: {
                            url: __env.apiUrl() + "/api/admin/organization",
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
                                id: { type: "number", nullable: true },
                                useYn: { type: "number", defaultValue:1 }
                            }
                        }

                    },
                    //filter: {field: "useYn", operator: "eq", value: 1},
                    pageSize: 50,
                    serverPaging: true,
                    serverSorting: true,
                    serverFiltering: true
                });
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
                    excel: {
                        fileName: "Projects.xlsx",
                        allPages: true,
                        filterable: true
                    },
                    sortable: true,
                    resizable: true,
                    reorderable: true,
                    pageable: {
                        pageSizes: [10, 50, 100, 'All'],
                        refresh: true,
                        pageSize: 10,
                        buttonCount: 5
                    },
                    persistSelection: true,
                    columns: [
                        {
                            field: "useYn", width: 55, title:" ", filterable: false, headerAttributes: {"class": "columnHeader"},
                            template: "<label class=\"relative inline-flex cursor-pointer items-center\">\n" +
                            "    <input type=\"checkbox\" ng-click=\"changeUseYn(dataItem)\" ng-checked='dataItem.useYn' class=\"peer sr-only\" />\n" +
                            "    <div class=\"peer h-6 w-11 rounded-full border bg-slate-200 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-green-300\"></div>\n" +
                            "  </label>",
                        },
                        {
                            title: "#",
                            headerAttributes: { "style": "text-align: center;" },
                            attributes: { "style": "text-align: center;" },
                            template: "#= ++record #",
                            sticky: true,
                            width: 50
                        },
                        {field: "name", filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: {"class": "columnHeader"},title:'Нэр'},
                        // {field: "email", filterable: { cell: { operator: "contains", showOperators: false } },headerAttributes: {"class": "columnHeader"},title: 'И-мэйл хаяг'},
                        {field: "phone", filterable: { cell: { operator: "contains", showOperators: false } },headerAttributes: {"class": "columnHeader"},title: 'Утас'},
                        {field: "address", filterable: { cell: { operator: "contains", showOperators: false } },headerAttributes: {"class": "columnHeader"},title: 'Хаяг'},
                        {field: "web", filterable: { cell: { operator: "contains", showOperators: false } },headerAttributes: {"class": "columnHeader"},title: 'Веб сайт'},
                        //{field: "useYn", filterable: { cell: { operator: "contains", showOperators: false } },headerAttributes: {"class": "columnHeader"},title: 'Ашиглах эсэх'},
                      ],
                    dataBinding: function () {
                        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                    },
                    editable: "inline",
                    height: function () {
                        return $(window).height() - 115;
                    }
                };

                if (sessionStorage.getItem("buttonData").includes("read")) {
                    $scope.mainGrid.toolbar = ["excel", "search"];
                }
                // if (sessionStorage.getItem("buttonData").includes("create")) {
                //     $scope.mainGrid.toolbar = [{template: "<button class='md-btn custom-btn' ng-click='add()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>"}];
                // }

                if (sessionStorage.getItem("buttonData").includes("edit")) {
                    /* $scope.mainGrid.columns.push({
                         command: [
                             {
                                 template:
                                     '<div class="flex gap-3"><button class="grid-btn k-grid-edit" ng-click=\'update(dataItem)\'><div class="nimis-icon edit"></div></button><button class="grid-btn k-grid-remove-command"><div class="nimis-icon delete"></div></button></div>',
                             },
                         ],
                         title: "&nbsp;",
                         width: 90,
                         sticky: true,
                         attributes: {style: "text-align: center;"},
                     });*/
                    /*$scope.mainGrid.columns.push({
                        command: [
                            {
                                template:
                                    '<div class="flex justify-center gap-3"><button class="grid-btn k-grid-edit" ng-click=\'update(dataItem)\'><div class="nimis-icon edit"></div></button><button class="grid-btn k-grid-remove-command" ng-click=\'deleteLevel(dataItem)\'><div class="nimis-icon delete"></div></button></div>',
                            },
                        ],
                        title: "&nbsp;",
                        width: 80,
                    });*/
                }

                $scope.checkAllCategory = function (e) {
                    $scope.catItems.map(function (i) {
                        $scope.categories[parseInt(i.id)] = $scope.isCheckAllCategory == "all" ? 0 : 1;
                    });
                    $scope.isCheckAllCategory = $scope.isCheckAllCategory == "all" ? "" : "all";
                };

                $scope.changeCategoryCheckbox = function () {
                    $scope.isCheckAllCategory = "";
                };

                $scope.uncheckAllControl = function () {
                    $scope.categories = {};
                };

                $scope.changeUseYn= function (dataItem){
                    if(dataItem.useYn==0){
                        dataItem.useYn=1;
                    }
                    else{
                        dataItem.useYn=0
                    }
                    mainService.withdata("post", "/api/admin/organization/save", dataItem).then(function (data) {
                        $rootScope.alert(true, "Амжилттай хадгаллаа.");
                        $("#app1Data").data("kendoGrid").dataSource.read();
                    });
                }
            }
        ]
    );
