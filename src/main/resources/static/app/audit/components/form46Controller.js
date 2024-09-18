angular
    .module('altairApp')
    .controller(
        'form46Ctrl',
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

                $scope.$on("formChanged46", function (event, args, data) {
                    $timeout(function (){
                        $scope.initForm(data,args);
                    })
                });

                $scope.dataSource46 = new kendo.data.DataSource({
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
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            }
                        },
                        update: {
                            url: __env.apiUrl() + "/api/adt/main/adt-journal/submit",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
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
                                accCode:{type:"string",editable:false},
                                repName:{type:"string",editable:false},
                                dbCr:{type:"string",editable:false},
                                amount:{type:"number",editable:false},
                                matAmt:{type:"number",editable:false},
                                cnt:{type:"number",editable:false},
                                dnCnt:{type:"number",editable:false},
                                dnAmount:{type:"number",editable:false},
                                ehCnt:{type:"number",editable:false},
                                ehAmount:{type:"number",editable:false},
                                abCof:{type:"number"},
                                samCnt:{type:"number",editable:false},
                                abCnt:{type:"number"},
                                abAmount:{type:"number"},
                                perMatCof:{type:"number"},
                                perMatAmt:{type:"number",editable:false},
                                matCof:{type:"number"},
                                method:{type:"number"},
                            }
                        }
                    },
                    pageSize: 20,
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true,
                    group: {
                        field: "dbCr",
                        dir: "desc",
                        aggregates: [
                            { field: "perMatAmt", aggregate: "sum" }
                        ]
                    },
                    aggregate: [{ field: "perMatAmt", aggregate: "sum" },
                        { field: "cnt", aggregate: "sum" },
                        { field: "amount", aggregate: "sum" },
                        { field: "dnCnt", aggregate: "sum" },
                        { field: "dnAmount", aggregate: "sum" },
                        { field: "abCnt", aggregate: "sum" },
                        { field: "abAmount", aggregate: "sum" },
                        { field: "ehCnt", aggregate: "sum" },
                        { field: "ehAmount", aggregate: "sum" },
                        { field: "samCnt", aggregate: "sum" },
                    ]
                });
                $scope.appId = 0;
                $scope.formId = 0;
                $scope.initForm=function (appId,formId){
                    $scope.appId = appId;
                    $scope.formId = formId;
                    $timeout(function (){
                        $scope.dataSource46.filter({
                            logic: "and",
                            filters: [
                                { field: "useYn", operator: "eq", value: '1'},
                                {field: "planId", operator: "eq", value: appId}
                            ],
                        });
                    },10)
                }

                $scope.textEditor = function (container, options) {
                    var editor = $('<textarea rows="3" kendo-text-area   data-bind="value:' + options.field + '"></textarea>').appendTo(container);
                };

                $scope.mainGrid46 = {
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
                        {field: "accCode",sticky: true,width:60,headerAttributes: {"class": "columnHeader"},title: 'Данс'},
                        {field: "accName",sticky: true,width:180, headerAttributes: {"class": "columnHeader"},title: 'Дансны нэр'},
                        {field: "repName", width:180,headerAttributes: {"class": "columnHeader"},title: 'Нөлөөлж буй АГАДҮТ'},
                        {field: "dbCr", hideOnGroup: true, template: "#if(dbCr=='credit'){# Кт #}else{# Дт #}#",width:50,attributes: {"class":"uk-text-center"},headerAttributes: {"class": "columnHeader"},title: 'Дт Кт C1'},
                        {field: "perMatAmt",aggregates: ["sum"], groupHeaderTemplate: "#=sum#", footerTemplate: "<span style='float:right;'> #=kendo.toString(data.perMatAmt?data.perMatAmt.sum : 0, \"n2\") #</span>", width:120,template:"<span ng-bind='dataItem.perMatAmt | number:2'></span>",headerAttributes: {"class": "columnHeader uk-text-center"},attributes: {"class":"uk-text-right"},title: 'Гүйцэтгэлийн материаллаг байдал'},
                        {headerAttributes: {"class": "columnHeader"},title: 'А.Данс',
                            columns:[
                                {field: "cnt",aggregates: ["sum"], footerTemplate: "<span style='text-align: center;display: block;'> #=kendo.toString(data.cnt?data.cnt.sum : 0, \"n0\") #</span>", width:60,attributes: {"class":"uk-text-center"},headerAttributes: {"class": "columnHeader uk-text-center"},title: 'тоо'},
                                {field: "amount",aggregates: ["sum"], footerTemplate: "<span style='float:right;'> #=kendo.toString(data.amount?data.amount.sum : 0, \"n2\") #</span>",width:150,template:"<span ng-bind='dataItem.amount | number:2'></span>",attributes: {"class":"uk-text-right"},headerAttributes: {"class": "columnHeader uk-text-right"},title: 'дүн'}
                            ]
                        },
                        {headerAttributes: {"class": "columnHeader"},title: 'Б.Дангаараа нөлөө бүхий',
                            columns:[
                                {field: "dnCnt",width:60,footerTemplate: "<span style='text-align: center;display: block;'> #=kendo.toString(data.dnCnt?data.dnCnt.sum : 0, \"n0\") #</span>",attributes: {"class":"uk-text-center"},headerAttributes: {"class": "columnHeader uk-text-center"},title: 'тоо'},
                                {field: "dnAmount",width:150,footerTemplate: "<span style='float:right;'> #=kendo.toString(data.dnAmount?data.dnAmount.sum : 0, \"n2\") #</span>",template:"<span ng-bind='dataItem.dnAmount | number:2'></span>",attributes: {"class":"uk-text-right"},headerAttributes: {"class": "columnHeader uk-text-right"},title: 'дүн'}
                            ]
                        },
                        {headerAttributes: {"class": "columnHeader"},title: 'В.Ердийн бус зүйлс',
                            columns:[
                                {field: "abCnt",width:100,footerTemplate: "<span style='text-align: center;display: block;'> #=kendo.toString(data.abCnt?data.abCnt.sum : 0, \"n0\") #</span>",attributes: {"class":"uk-text-center"},headerAttributes: {"class": "columnHeader uk-text-center"},title: 'тоо'},
                                {field: "abAmount",width:150,footerTemplate: "<span style='float:right;'> #=kendo.toString(data.abAmount?data.abAmount.sum : 0, \"n2\") #</span>",template:"<span ng-bind='dataItem.abAmount | number:2'></span>",attributes: {"class":"uk-text-right"},headerAttributes: {"class": "columnHeader uk-text-right"},title: 'дүн'}
                            ]
                        },
                        {headerAttributes: {"class": "columnHeader"},title: 'Г.Эх олонлогоос үлдсэн',
                            columns:[
                                {field: "ehCnt",width:60,footerTemplate: "<span style='text-align: center;display: block;'> #=kendo.toString(data.ehCnt?data.ehCnt.sum : 0, \"n0\") #</span>",attributes: {"class":"uk-text-center"},headerAttributes: {"class": "columnHeader uk-text-center"},title: 'тоо'},
                                {field: "ehAmount",width:150,footerTemplate: "<span style='float:right;'> #=kendo.toString(data.ehAmount?data.ehAmount.sum : 0, \"n2\") #</span>",template:"<span ng-bind='dataItem.ehAmount | number:2'></span>",attributes: {"class":"uk-text-right"},headerAttributes: {"class": "columnHeader uk-text-right"},title: 'дүн'}
                            ]
                        },
                        {field: "abCof", values:[{"text":"Найдвартай","value":"0.9"},{"text":"Дунд зэрэг","value":"1.6"},{"text":"Найдваргүй","value":"3"}],width:120,attributes: {"class":"uk-text-center"},headerAttributes: {"class": "columnHeader uk-text-center"},title: 'Хяналтын найдвартай байдал'},
                        {field: "samCnt",footerTemplate: "<span style='text-align: center;display: block;'> #=kendo.toString(data.samCnt?data.samCnt.sum : 0, \"n0\") #</span>", width:120,attributes: {"class":"uk-text-center"},headerAttributes: {"class": "columnHeader uk-text-center"},title: 'Тооцоолсон түүврийн хэмжээ'},
                    ],
                    editable:true,
                    dataBinding: function () {
                        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                    },
                    dataBound: function (e) {
                        if(e.sender.tbody.children()!==undefined){
                            var rows = e.sender.tbody.children();
                            for (var j = 0; j < rows.length; j++) {
                                var row = $(rows[j]);
                                var dataItem = e.sender.dataItem(row);

                                var abCof = dataItem.get("abCof");
                                var cell = row.children().eq(15);
                                if (abCof>=0) {
                                    cell.addClass("range1Cell");
                                }

                                var abCnt = dataItem.get("abCnt");
                                var cell1 = row.children().eq(11);
                                if (abCnt>=0) {
                                    cell1.addClass("range1Cell");
                                }

                                var abAmt = dataItem.get("abAmount");
                                var cell2 = row.children().eq(12);
                                if (abAmt>=0) {
                                    cell2.addClass("range1Cell");
                                }

                                var method = dataItem.get("method");
                                var cell3 = row.children().eq(17);
                                if (method>=0) {
                                    cell3.addClass("range1Cell");
                                }
                            }
                        }
                    },
                    height: function () {
                        return $(window).height() - 90;
                    }
                };
            }
        ]
    );
