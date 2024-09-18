angular
    .module('altairApp')
    .controller(
        'form34Ctrl',
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

                $scope.$on("formChanged34", function (event, args, data) {
                    $timeout(function (){
                        $scope.initForm(data,args);
                    })
                });

                $scope.dataSource34 = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: __env.apiUrl() + "/api/adt/main/adt-risk/list",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            data:{filter:{
                                    logic: "and",
                                    filters: [{ field: "useYn", operator: "eq", value: 0 },],
                                },sort: [{field: "id", dir: "desc"}]},
                            beforeSend: function(req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            }
                        },
                        destroy: {
                            url: __env.apiUrl() + "/api/adt/main/adt-risk/delete",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            beforeSend: function(req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            },
                            complete: function (e) {
                                $(".k-grid").data("kendoGrid").dataSource.read();
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
                                id: {type: "number"},
                            }
                        }
                    },
                    pageSize: 20,
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true
                });
                $scope.appId = 0;
                $scope.formId = 0;
                $scope.initForm=function (appId,formId){
                    $scope.appId = appId;
                    $scope.formId = formId;
                    $scope.dataSource34.filter({
                        logic: "and",
                        filters: [{ field: "useYn", operator: "eq", value: 1 },
                            {field: "decType", operator: "eq", value: 0},
                            {field: "impType", operator: "eq", value: 0},
                            {field: "planId", operator: "eq", value: appId}],
                    });
                }

                $scope.mainGrid34 = {
                    sortable: true,
                    resizable: true,
                    excel: {
                        fileName: "Export.xlsx",
                        filterable: true,
                        allPages: true
                    },
                    noRecords: {
                        template: function(e){
                            var page = $("#appData34").getKendoGrid().dataSource.page();
                            return "<span class='uk-text-danger' style='display: inline-block;padding: 10px 0;width:100%;;text-align: center;'>Эрсдэл бүртгээгүй байна !!!</span> ";
                        }
                    },
                    pageable: {
                        refresh: true,
                        pageSizes: true,
                        buttonCount: 5
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
                        {field: "mainFactorNm", width:200,headerAttributes: {"class": "columnHeader"},title: 'Хүчин зүйлс'},
                        {field: "factorNm", width:120,headerAttributes: {"class": "columnHeader"},title: 'Дэд хүчин зүйлс'},
                        {field: "conNm", width:200,headerAttributes: {"class": "columnHeader"},title: 'Нөхцөл'},
                        {field: "dirNm", width:120,headerAttributes: {"class": "columnHeader"},title: 'Ерөнхий чиглэл'},
                        {field: "subDirNm",width:150,headerAttributes: {"class": "columnHeader"},title: 'Эрсдлийн дэд чиглэл'},
                        {field: "accNm", width:120,headerAttributes: {"class": "columnHeader"},title: 'Данс'},
                        {field: "typeNm", width:150,headerAttributes: {"class": "columnHeader"},title: 'Эрсдэлийн ангилал'},
                        {field: "confNm", width:150,headerAttributes: {"class": "columnHeader"},title: 'Батламж мэдэгдэл'},
                    ],
                    editable:"inline",
                    dataBinding: function () {
                        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                    },
                    height: function () {
                        return $(window).height() - 90;
                    }
                };
                $scope.mainGrid34.columns.push({
                    template:'<button style="display: inline-flex;" class="grid-btn k-grid-remove-command k-grid-remove-command"><div class="nimis-icon delete"></div></button>',
                    attributes: {style: "text-align: center;"},
                    title: "&nbsp;",
                    sticky: true,
                    width: 50,
                });
                $scope.mainGrid34.toolbar = [{template: "<button class='md-btn custom-btn' ng-click='addRisk()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>"}, "search"];


                $scope.factorDataSource = commonDataSource.urlDataSource("/api/adt/factor/list",
                    JSON.stringify({
                        filter: {
                            logic: "and",
                            filters: [{field: "useYn", operator: "eq", value: 1}, {
                                field: "parentId",
                                operator: "isnull",
                                value: true
                            }]
                        }, sort: [{field: "id", dir: "desc"}]
                    })
                );
                $scope.subFactorDataSource = commonDataSource.urlDataSource("/api/adt/factor/list",
                    JSON.stringify({filter: {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1}]},sort: [{field: "name", dir: "asc"}]})
                );
                $scope.factorQuestionDataSource = commonDataSource.urlDataSource("/api/adt/factor/question/list",JSON.stringify({filter: {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1}]},sort: [{field: "name", dir: "asc"}]}));

                $scope.confirmationDataSource = commonDataSource.urlDataSource("/api/nms/common/list",JSON.stringify({filter: {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1},{field: "parentId", operator: "isnull", value: false},{field: "grpCd", operator: "eq", value: 'confirmationStatement'}]},sort: [{field: "comCdNm", dir: "asc"}]}));

                $scope.filterAcc=function (){
                    mainService.withdata("POST",__env.apiUrl() + "/api/adt/acc/dir/list",
                        {
                            "filter": {
                                "logic": "and",
                                "filters": [
                                    {
                                        "field": "dirId",
                                        "operator": "eq",
                                        "value": $scope.dataItem.question.dirId
                                    },
                                    {
                                        "field": "subDirId",
                                        "operator": "eq",
                                        "value": $scope.dataItem.question.subDirId
                                    }
                                ]
                            },
                            "take": 1000,
                            "skip": 0,
                            "page": 1,
                            "pageSize": 1000
                        }
                    ).then(function (data) {
                        $timeout(function (){
                            $scope.accountDataSource = data.data;
                        },100)

                    });
                }

                var modalForm = UIkit.modal("#modal_form", {
                    modal: false,
                    keyboard: false,
                    bgclose: false,
                    center: true
                });

                $scope.dataItem={};
                $scope.addRisk = function (type){
                    $scope.dataItem={};
                    modalForm.show();
                    $timeout(() => $rootScope.clearForm("validator"));
                }
                $scope.formSubmit = function (type) {
                    var validator = $("#validator").kendoValidator().data("kendoValidator");
                    if (validator.validate()) {
                        var obj={decType:0,impType:0,planId:$rootScope.app.id,accDirId:$scope.dataItem.accId,queId:$scope.dataItem.queId,typeId:$scope.dataItem.typeId,confId:$scope.dataItem.confId}
                        var method = "post";
                        if ($scope.dataItem.id !== undefined && $scope.dataItem.id !== null) method = "put";
                        mainService.withdata(method, "/api/adt/main/form34/submit", obj).then(function (data) {
                            $rootScope.alert(true, "Амжилттай хадгаллаа.");
                            if (type === 1) {
                                modalForm.hide();
                            }
                            $timeout(() => $rootScope.clearForm("validator"));
                            $("#appData34").data("kendoGrid").dataSource.read();
                        });
                    }
                };

                $scope.update = function (item){
                    $scope.dataItem=item;
                    modalForm.show();
                }

            }
        ]
    );
