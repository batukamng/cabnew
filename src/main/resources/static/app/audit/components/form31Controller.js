angular
    .module('altairApp')
    .controller(
        'form31Ctrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$filter',
            '$timeout',
            'mainService',
            'fileUpload',
            'commonDataSource',
            'sweet',
            '__env',
            function ($rootScope, $state, $scope, $filter, $timeout, mainService, fileUpload, commonDataSource, sweet, __env) {
                $scope.user = JSON.parse(sessionStorage.getItem('currentUser')).user;

                $scope.$on("formChanged31", function (event, args, data) {
                    $timeout(function (){
                        $scope.initForm(data,args);
                    })
                });



                $scope.appId = 0;
                $scope.formId = 0;
                $scope.gridActive = 0;
                $scope.activeTab=function (i){
                    $scope.gridActive = i;
                    $scope.questionDataSource = new kendo.data.DataSource({
                        autoSync:true,
                        transport: {
                            read: {
                                url: "/api/adt/main/adt-question-view/list",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                data: {"sort": [{field: 'code', dir: 'asc'}]},
                                beforeSend: function (req) {
                                    if (JSON.parse(sessionStorage.getItem('currentUser')) != null) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                    }
                                }
                            },
                            update: {
                                url: __env.apiUrl() + "/api/adt/main/question/submit",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                },
                                complete: function (e) {
                                    $(".k-grid").data("kendoGrid").dataSource.read();
                                }
                            },
                            destroy: {
                                url: __env.apiUrl() + "/api/adt/main/question",
                                contentType: "application/json; charset=UTF-8",
                                type: "DELETE",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                },
                                complete: function (e) {
                                    $(".k-grid").data("kendoGrid").dataSource.read();
                                }
                            },
                            parameterMap: function (options,operation) {
                                if (operation === "update") {
                                    options.planId=$scope.appId;
                                    return JSON.stringify(options);
                                }
                                return JSON.stringify(options);
                            }
                        },
                        schema: {
                            data: function (data) {
                                var arr=[];
                                for(var i=0;i<$scope.questions.length;i++){
                                    var obj=$scope.questions[i];
                                    if($scope.gridActive===obj.parentId){
                                        if(data.data!==undefined){
                                            for(var y=0;y<data.data.length;y++){
                                                if(obj.id==data.data[y].queId){
                                                    obj.description=data.data[y].description;
                                                    obj.planId=data.data[y].planId;
                                                }
                                            }
                                        }
                                        obj.queId=obj.id;
                                        arr.push(obj);
                                    }
                                }
                                return arr;
                            },
                            total: "total",
                            model: {
                                id: "id",
                                fields: {
                                    id: { type: "number", nullable: true },
                                    planId: { type: "number", defaultValue: $scope.appId},
                                    title: { editable: false ,type: "string" },
                                    description: { type: "string" },
                                }
                            }

                        },
                        pageSize: 100,
                        serverPaging: true,
                        serverSorting: true,
                        serverFiltering: true
                    });
                    $scope.questionDataSource.filter({
                        logic: "and",
                        sort: [{field: "id", dir: "asc"}],
                        filters: [{field: "useYn", operator: "eq", value: 1},{field: "groupId", operator: "eq", value: i},
                            {field: "planId", operator: "eq", value: $scope.appId}],
                    });
                }
                $scope.initForm = function (appId, formId) {
                    $scope.appId = appId;
                    $scope.formId = formId;
                    mainService.withdomain("get", "/api/adt/question/list/all").then(function (data) {
                        $scope.questions=data;
                        $scope.gridActive = $scope.questions[0].id;
                        $scope.activeTab($scope.questions[0].id);
                    });
                }

                let columns = [
                    {
                        title: "#",
                        headerAttributes: {
                            "class": "checkbox-align",
                        },
                        attributes: {style: "text-align: center;"},
                        template: "#= ++record #",
                        width: 50,
                    },
                    {
                        field: "title",
                        title: "Байгууллагын үйл ажиллагаа",
                        attributes: {"style": "text-align: left;"},
                        width: 350,
                        headerAttributes: {"style":"white-space: normal; vertical-align: middle;text-align: center;"},
                        filterable: {cell: {operator: "contains",showOperators: false}}
                    },
                   /* {
                        field: "code",
                        title: "Байгууллагын үйл ажиллагаа",
                        attributes: {"style": "text-align: left;"},
                        width: 350,
                        headerAttributes: {"style":"white-space: normal; vertical-align: middle;text-align: center;"},
                        filterable: {cell: {operator: "contains",showOperators: false}}
                    },*/
                    {
                        field: "description",
                        title: "Аудитад хамааралтай мэдээлэл",
                        attributes: {"style": "text-align: left;"},
                        headerAttributes: {"style":"white-space: normal; vertical-align: middle;text-align: center;"},
                        filterable: {cell: {operator: "contains",showOperators: false}}
                    }
                ];
                $scope.dataGrid = {
                    sortable: true,
                    resizable: true,
                    reorderable: true,
                    pageable: false,
                    filterable: false,
                    editable: true,
                    columns: columns,
                    dataBinding: function () {
                        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                    },
                    dataBound: function (e) {
                        var grid = this;
                        grid.tbody.find("tr").dblclick(function (e) {
                            var dataItem = grid.dataItem(this);
                        });

                        if (e.sender.tbody.children() !== undefined) {
                            var rows = e.sender.tbody.children();
                            for (var j = 0; j < rows.length; j++) {
                                var row = $(rows[j]);
                                var dataItem = e.sender.dataItem(row);

                                var units = dataItem.get("prCnt");
                                var cell = row.children().eq(7);
                                if (units > 0 && units < 5) {
                                    cell.addClass("range0Cell");
                                } else if (units > 5 && units < 20) {
                                    cell.addClass("range1Cell");
                                } else if (units > 20 && units < 40) {
                                    cell.addClass("range1Cell");
                                } else if (units > 40 && units < 60) {
                                    cell.addClass("range2Cell");
                                } else if (units > 60 && units < 80) {
                                    cell.addClass("range3Cell");
                                } else if (units > 80) {
                                    cell.addClass("range4Cell");
                                }
                            }
                        }
                    },
                    height: function () {
                        return $(window).height() - 132;
                    },
                };
            }
        ]
    );
