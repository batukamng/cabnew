angular
    .module('altairApp')
    .controller(
        'form45Ctrl',
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

                $scope.$on("formChanged45", function (event, args, data) {
                    $timeout(function (){
                        $scope.initForm(data,args);
                    })
                });

                $scope.dataSource45 = new kendo.data.DataSource({
                    autoSync:true,
                    transport: {
                        read: {
                            url: __env.apiUrl() + "/api/adt/main/adt-risk-detail/list",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            data:{filter:{
                                    logic: "and",
                                    filters: [{ field: "useYn", operator: "eq", value: 0 }],
                                },sort: [{field: "id", dir: "desc"}]},
                            beforeSend: function(req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            }
                        },
                        update: {
                            url: __env.apiUrl() + "/api/adt/main/adt-risk/submit",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            },
                            complete: function (e) {
                                $("#appData45").data("kendoGrid").dataSource.read();
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
                                planId: { type: "number", defaultValue: $scope.appId},
                                subDirNm: { editable: false ,type: "string" },
                                probability: { type: "string" },
                                aggInc: { editable: false ,type: "string" },
                                effect: { type: "string" },
                                riskNm: {  editable: false ,type: "string" },
                                confNm: {  editable: false ,type: "string" },
                                accNm: {  editable: false ,type: "string" },
                                tryNm: {  editable: false ,type: "string" },
                                implMode: {  editable: false ,type: "string" },
                                riskCatTypeNm: {  editable: false ,type: "string" },
                                standard: {  type: "string" },
                                law: { type: "string" }
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
                        $scope.dataSource45.filter({
                            logic: "and",
                            filters: [
                                { field: "useYn", operator: "eq", value: 1 },
                                {field: "planId", operator: "eq", value: appId},
                                {field: "aggInc", operator: "eq", value: 'их'},
                                {field: "impType", operator: "eq", value: '1'},
                            ],
                        });
                    },10)
                }

                $scope.textEditor = function (container, options) {
                    var editor = $('<textarea rows="3" kendo-text-area   data-bind="value:' + options.field + '"></textarea>').appendTo(container);
                };

                $scope.mainGrid45 = {
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
                        {field: "riskNm",width:300,attributes: {"class": "uk-text-justify"},headerAttributes: {"class": "columnHeader"},title: 'Тодорхойлсон эрсдэл'},
                        {field: "subDirNm", width:200,headerAttributes: {"class": "columnHeader"},title: 'АГАДҮТ-н дэд анги'},
                        {field: "confNm",width:150, headerAttributes: {"class": "columnHeader"},title: 'Холбогдох батламж мэдэгдлүүд'},
                        {field: "featMode",width:150,values:[{"text":"Хяналтад найдах",value:"0"},{"text":"Биет горим хэрэгжүүлэх",value:"1"}], headerAttributes: {"class": "columnHeader"},title: 'Горимын шинж чанар'},
                        {field: "implMode",width:150,values:[{"text":"Шинжилгээний горим",value:"1"},{"text":"Нарийвчилсан сорил",value:"0"}], headerAttributes: {"class": "columnHeader"},title: 'Хэрэгжүүлэх горим, сорил'},
                        {field: "tryNm",width:150, headerAttributes: {"class": "columnHeader"},title: 'Гүйцэтгэх горим, сорил'},
                        {columns:[
                                {field: "standard",width:200, editor:$scope.textEditor,headerAttributes: {"class": "columnHeader"},title: 'Стандартын заалт'},
                                {field: "law",width:200,  editor:$scope.textEditor,headerAttributes: {"class": "columnHeader"},title: 'Хууль тогтоомжийн заалт'}
                            ], headerAttributes: {"class": "columnHeader"},title: 'Шалгуур'},
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
                            row[0].cells[4].style.backgroundColor = "#fff7ed";
                            //  row[0].cells[6].style.backgroundColor = "#fff7ed";
                            row[0].cells[7].style.backgroundColor = "#eef2fe";
                            row[0].cells[8].style.backgroundColor = "#eef2fe";
                        }
                    },
                    height: function () {
                        return $(window).height() - 90;
                    }
                };
            }
        ]
    );
