angular
    .module('altairApp')
    .controller(
        'form43Ctrl',
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
                $scope.user = JSON.parse(localStorage.getItem('currentUser')).user;

                $scope.$on("formChanged43", function (event, args, data) {
                    $timeout(function (){
                        $scope.initForm(data,args);
                    })
                });

                $scope.dataSource43 = new kendo.data.DataSource({
                    autoSync:true,
                    transport: {
                        read: {
                            url: __env.apiUrl() + "/api/adt/main/adt-journal/list",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            data:{filter:{
                                    logic: "and",
                                    filters: [{ field: "useYn", operator: "eq", value: 0 }],
                                },sort: [{field: "num", dir: "asc"}]},
                            beforeSend: function(req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                            }
                        },
                        update: {
                            url: __env.apiUrl() + "/api/adt/main/adt-journal/submit",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                            },
                            complete: function (e) {
                                $("#appData43").data("kendoGrid").dataSource.read();
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
                                accName: {type: "string",editable:false},
                                riskNm:{type:"string",editable:false},
                                accCode:{type:"string",editable:false},
                                repName:{type:"string",editable:false},
                                dbCr:{type:"string",editable:false},
                                amount:{type:"number",editable:false},
                                matAmt:{type:"number",editable:false},
                                perMatCof:{type:"number"},
                                perMatAmt:{type:"number",editable:false},
                                matCof:{type:"number"}
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
                    $timeout(function (){
                        $scope.dataSource43.filter({
                            logic: "and",
                            filters: [
                                { field: "useYn", operator: "eq", value: '1' },
                                {field: "planId", operator: "eq", value: appId}
                            ],
                        });
                    },10)
                }

                $scope.mainGrid43 = {
                    sortable: true,
                    resizable: true,
                    excel: {
                        fileName: "Export.xlsx",
                        filterable: true,
                        allPages: true
                    },
                    noRecords: {
                        template: function(e){
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
                        {field: "riskNm",width:310,attributes: {"class": "uk-text-justify"},headerAttributes: {style: "text-align: center; justify-content: center"},title: 'Тодорхойлсон эрсдэл'},
                        {field: "repName",width:160, headerAttributes: {"class": "columnHeader"},title: 'Нөлөөлж буй АГАДҮТ'},
                        {field: "accName",width:240, headerAttributes: {"class": "columnHeader"},title: 'АГАДҮТ-н дэд анги'},
                        {field: "dbCr",width:43,template: "#if(dbCr=='credit'){# Кт #}else{# Дт #}#",attributes: {"class":"uk-text-center"},headerAttributes: {style: "text-align: center; justify-content: center"}, title: 'Дт Кт C1'},
                        {field: "amount",width:150, template:"<span ng-bind='dataItem.amount | number:2'></span>",attributes: {"class":"uk-text-right"},headerAttributes: {style: "text-align: center; justify-content: center"},title: 'Эх олонлогийн хэмжээ'},
                        {field: "matCof",width:100, attributes: {"class":"uk-text-center"},values:[{"text":"0.5%","value":"0.005"},{"text":"1.0%","value":"0.01"},{"text":"1.5%","value":"0.015"},{"text":"2.0%","value":"0.02"}],headerAttributes: {style: "text-align: center; justify-content: center"},title: 'Материаллаг байдлын түвшин'},
                        {field: "matAmt",width:100, template:"<span ng-bind='dataItem.matAmt | number:2'></span>",attributes: {"class":"uk-text-right"},headerAttributes: {style: "text-align: center; justify-content: center"},title: 'Материаллаг байдал'},
                        {field: "perMatCof",width:100,values:[{"text":"60%","value":"0.6"},{"text":"65%","value":"0.65"},{"text":"70%","value":"0.7"},{"text":"75%","value":"0.75"},{"text":"80%","value":"0.8"}],attributes: {"class":"uk-text-center"}, headerAttributes: {style: "text-align: center; justify-content: center"},title: 'Материаллаг байдал тооцох хувь'},
                        {field: "perMatAmt",width:100, template:"<span ng-bind='dataItem.perMatAmt | number:2'></span>",attributes: {"class":"uk-text-right"},headerAttributes: {style: "text-align: center; justify-content: center"},title: 'Гүйцэтгэлийн материаллаг байдал'},
                    ],
                    editable:true,
                    dataBinding: function () {
                        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                    },
                    dataBound: function (e) {
                        var grid = this;
                        var rows = grid.tbody.children();
                        for (var j = 0; j < rows.length; j++) {
                            var row = $(rows[j]);
                            row[0].cells[6].style.backgroundColor = "#fff7ed";
                            row[0].cells[8].style.backgroundColor = "#fff7ed";
                        }
                    },
                    height: function () {
                        return $(window).height() - 90;
                    }
                };
            }
        ]
    );
