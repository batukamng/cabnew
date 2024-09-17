angular.module("altairApp")
    .controller("1008AdtCtrl", [
        "$rootScope",
        "$state",
        "$scope",
        "$timeout",
        "mainService",
        "commonDataSource",
        "orgTypes",
        "repTypes",
        "sweet",
        "Upload",
        "__env",
        function ($rootScope, $state, $scope, $timeout, mainService, commonDataSource,orgTypes, repTypes,sweet, Upload,  __env) {
            $scope.user = JSON.parse(localStorage.getItem("currentUser")).user;
            $("#header_main").attr("style", "filter: none !important;padding: 8px 25px");

            $scope.orgTypeDataSource=orgTypes;

            $scope.reportTypeDataSource = commonDataSource.urlPageDataSource("/api/adt/report/list",
                JSON.stringify({
                    filter: {
                        logic: "and",
                        filters: [{field: "useYn", operator: "eq", value: 1}]
                    }, sort: [{field: "name", dir: "asc"}]
                }),100
            );

            $scope.accountDataSource = commonDataSource.urlPageDataSource("/api/adt/account/list",
                JSON.stringify({
                    filter: {
                        logic: "and",
                        filters: [{field: "useYn", operator: "eq", value: 1}]
                    }, sort: [{field: "name", dir: "asc"}]
                }),
                100
            );
            $scope.dropReportOptions = {
                dataTextField: "name",
                dataValueField: "id",
                placeholder: "Сонгох...",
                template:"<span class='w-full'><span ng-bind='dataItem.name'></span><span style='float: right' ng-bind='dataItem.code'></span></span>",
                valuePrimitive: true,
                autoBind: true
            };

            $scope.dropOptions = {
                dataTextField: "name",
                dataValueField: "id",
                placeholder: "Сонгох...",
                valuePrimitive: true,
                autoBind: true,
                template:
                    "<span style='width:100px;margin-right:10px;' class='uk-text-right'>{{dataItem.code}}</span><span>#=name#</span><span>#=orgTypeNm#</span>",
                filtering: function (ev) {
                    var filterValue = ev.filter != undefined ? ev.filter.value : "";
                    ev.preventDefault();
                    this.dataSource.filter({
                        logic: "and",
                        filters: [
                            {
                                field: "accNum",
                                operator: "eq",
                                value: filterValue,
                            },
                        ],
                    });
                },
            };

            $scope.selectOptions = {
                placeholder: "Сонгох...",
                dataTextField: "comCdNm",
                dataValueField: "id",
                valuePrimitive: true,
                autoBind: false,
                dataSource: $scope.orgTypeDataSource
            };

            $scope.appDataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: __env.apiUrl() + "/api/adt/account/list",
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
                        data: {
                            custom: {
                                logic: "and",
                                filters: [
                                    {field: "useYn", operator: "eq", value: 1},
                                ],
                            },
                        },
                        beforeSend: function (req) {
                            if (JSON.parse(localStorage.getItem("currentUser")) != null) {
                                req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
                            } else {
                                $state.go("login");
                                $rootScope.$broadcast("LogoutSuccessful");
                            }
                        },
                    },
                    destroy: {
                        url: __env.apiUrl() + "/api/adt/account",
                        contentType: "application/json; charset=UTF-8",
                        type: "DELETE",
                        beforeSend: function(req) {
                            req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                        },
                        complete: function (e) {
                            $(".k-grid").data("kendoGrid").dataSource.read();
                        }
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
                            id: {type: "number",nullable:true},
                            name: {type: "string"},
                            code:{type:"string"},
                            orgTypeId: {type: "number"},
                            repTypeId: {type: "number"},
                            orgType: {defaultValue:{}},
                            repType: {defaultValue:{}},
                            useYn: {type: "number",defaultValue:1}
                        }
                    }
                },
                pageSize: 100,
              /*  group: {
                    field: "reportTypeNm",
                    dir: "desc"
                },*/
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
            });
            $scope.mainGrid = {
                sortable: true,
                resizable: true,
                persistSelection: true,
                pageable: {
                    refresh: true,
                    pageSizes: [20,50, 100,300],
                    buttonCount: 5,
                },
                filterable: {
                    mode: "row",
                    extra: false,
                    cell: {
                        operator: "eq",
                    },
                },
                columns: [
                    {
                        title: "#",
                        headerAttributes: {
                            "class": "checkbox-align",
                        },
                        attributes: {style: "text-align: center;"},
                        template: "#= ++record #",
                        width: 50,
                    },
                  /*  {field: "accCode",  width: 100, title: "Код", filterable: { cell: { operator: "startswith", suggestionOperator:"startswith",showOperators: false } }},*/
                    {field: "parentCode", title: "Толгой данс", width: 100,filterable: { cell: { operator: "startswith", suggestionOperator:"contains",showOperators: false } }},
                    {field: "accNum",  width: 100, title: "Дугаар", filterable: { cell: { operator: "startswith", suggestionOperator:"startswith",showOperators: false } }},
                    {field: "catNm", title: "Ангилал", width: 100,filterable: { cell: { operator: "contains", suggestionOperator:"contains",showOperators: false } }},
                    {field: "name", title: "Нэр", filterable: { cell: { operator: "contains", suggestionOperator:"contains",showOperators: false } }},

                    {field: "sample",values:[{"text":"Тийм","value":1},{"text":"Үгүй","value":0}], width: 100,title: "Түүвэр", filterable: { cell: { operator: "eq", suggestionOperator:"contains",showOperators: false } }},
                    {field: "reportTypeNm", width: 100, attributes: {style: "text-align: left;"},title: "Тайлан", filterable: { cell: { operator: "eq", suggestionOperator:"contains",showOperators: false } }},
                    {field: "orgTypeNm", width: 180,title: "Байгууллагын төрөл", filterable: { cell: { operator: "eq", suggestionOperator:"contains",showOperators: false } }},
                ],
                dataBinding: function () {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                },
                editable:"inline",
                height: function () {
                    return $(window).height() - 110;
                },
            };

            if (localStorage.getItem("buttonData").includes("create")) {
                $scope.mainGrid.toolbar = [{template: "<button class='md-btn custom-btn' ng-click='add()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>"}];
            }
            if (localStorage.getItem("buttonData").includes("update") || localStorage.getItem("buttonData").includes("edit")) {
                $scope.mainGrid.columns.push({
                    command: [
                        {
                            template:
                                '<div class="k-command-cell command-container">' +
                                '<a ng-show="editAble!=dataItem.id" ng-click="update(dataItem)" class="grid-btn"><div class="nimis-icon edit"></div></a>' +
                                '<a ng-show="editAble!=dataItem.id" class="grid-btn k-grid-remove-command"><div class="nimis-icon delete"></div></a>' +
                                '<a ng-show="editAble==dataItem.id" ng-click="editMode(true,dataItem)" class="grid-btn k-grid-save-command"><div class="nimis-icon update"></div></a> ' +
                                '<a ng-show="editAble==dataItem.id" ng-click="editMode(true,dataItem)"  class="grid-btn k-grid-cancel-command"><div class="nimis-icon cancel"></div></a>' +
                                '</div>',
                        },
                    ],
                    title: "&nbsp;",
                    width: 80,
                });
            }

            var modalForm = UIkit.modal("#modal_form", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true,
                width: 600,
            });

            $scope.dataItem = {};
            $scope.editAble = 0;

            $scope.add = function () {
                $scope.dataItem = {accType:1,useYn: 1};
                modalForm.show();
                $timeout(() => $rootScope.clearForm("validator"));
            };
            $scope.update = function (item) {
                $scope.dataItem={};
                $timeout(() => $rootScope.clearForm("validator"));
                if(item.parentId!=null){
                    $scope.accountDataSource.filter({
                        logic: "and",
                        filters: [{field: "useYn", operator: "eq", value: 1},{field: "id", operator: "eq", value: item.parentId}],
                    });
                }
                $timeout(function (){
                    $scope.dataItem = item;
                    modalForm.show();
                },100);
            };

            $scope.formSubmit = function (type) {
                var validator = $("#validator").kendoValidator().data("kendoValidator");
                if (validator.validate()) {
                    var method="post";
                  /*  var strIds= $scope.dataItem.orgIds;
                    if(strIds.includes(",")){
                        $scope.dataItem.orgIds=strIds.split(",");
                    }
                    else{
                        $scope.dataItem.orgIds=[strIds];
                    }*/
                  //  console.log($scope.dataItem);
                   /* if( $scope.dataItem.parent!=undefined || $scope.dataItem.parent!=null){
                        $scope.dataItem.parentId=$scope.dataItem.parent.id;
                    }*/

                 //   if ($scope.dataItem.id!==undefined && $scope.dataItem.id!==null) method="put";
                    mainService.withdata(method, "/api/adt/account/submit", $scope.dataItem).then(function (data) {
                        $rootScope.alert(true, "Амжилттай хадгаллаа.");
                        if(type===1){
                            modalForm.hide();
                        }
                        $timeout(() => $rootScope.clearForm("validator"));
                        $(".k-grid").data("kendoGrid").dataSource.read();
                    });
                }
            };
        },
    ]);
