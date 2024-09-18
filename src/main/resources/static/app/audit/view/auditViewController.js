angular.module("altairApp")
    .controller("auditViewCtrl", [
    "$rootScope",
    "$state",
    "$stateParams",
    "$scope",
    "$timeout",
    "$translate",
    "commonDataSource",
    "sweet",
    "dataItem",
    "mainService",
    "__env",
    function ($rootScope, $state,$stateParams, $scope, $timeout, $translate, commonDataSource, sweet,dataItem, mainService,__env) {

        $scope.user = JSON.parse(sessionStorage.getItem("currentUser")).user;
        $scope.selectedItem = JSON.parse(sessionStorage.getItem("adtItem"));
        sessionStorage.setItem("menuData", "{}");
        $rootScope.app = dataItem.item[0];
        $scope.formNotes = dataItem.notes;
        $timeout(function (){
            if($scope.selectedItem!==null){
                $scope.viewWork($scope.selectedItem);
            }
            else{
                $scope.viewWork($scope.formNotes[0]);
            }
        },1000);

        $scope.viewWork=function (item){
            $scope.selectedItem=item;
            $rootScope.item=item;
            sessionStorage.setItem("adtItem", JSON.stringify(item));
            $scope.materiality={};
            $scope.form={step:0,files:[]};
            $(".k-upload-files > li").remove();
            if(item.formNo==='3.1'){
                $scope.$broadcast("formChanged31", item.id,$rootScope.app.id);
            }
            else if(item.formNo==='ex-1'){
                $scope.$broadcast("formChanged32", item.id,$rootScope.app.id);
            }

            else if(item.formNo==='plan'){
                $scope.$broadcast("formChanged33", item.id,$rootScope.app.id);
            }
            else if(item.formNo==='3.5'){
                $scope.$broadcast("formChanged35", item.id,$rootScope.app.id);
            }
            else if(item.formNo==='3.4'){
                $scope.$broadcast("formChanged34", item.id,$rootScope.app.id);
            }
            else if(item.formNo==='3.6'){
                $scope.journalDataSource = {
                    transport: {
                        read: {
                            url: __env.apiUrl() + "/api/audit/registration/journal/list",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            data:{"custom":" where planId="+$scope.app.id+""},
                            beforeSend: function(req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            }
                        },
                        update: {
                            url: __env.apiUrl() + "/api/audit/registration/journal/update",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            beforeSend: function(req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            },
                            complete: function (e) {
                                $(".k-grid").data("kendoGrid").dataSource.read();
                            }
                        },
                        destroy: {
                            url: __env.apiUrl() + "/api/audit/registration/journal/delete",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            beforeSend: function(req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            },
                            complete: function (e) {
                                $(".k-grid").data("kendoGrid").dataSource.read();
                            }
                        },
                        create: {
                            url: __env.apiUrl() + "/api/audit/registration/journal/create",
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
                                accName: {type: "string",editable:false},
                                accCode:{type:"string",editable:false},
                                repName:{type:"string",editable:false},
                                dbCr:{type:"string",editable:false},
                                amount:{type:"number",editable:false},
                                matAmt:{type:"number",editable:false},
                                perMatCof:{type:"number"},
                                perMatAmt:{type:"number",editable:false},
                                matCof:{type:"number"},
                                useYn: {type: "boolean",defaultValue:true}
                            }
                        }
                    },
                    autoSync: true,
                    pageSize: 20,
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true
                };
                $scope.journalGrid = {
                    sortable: true,
                    resizable: true,
                    navigatable: true,
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
                        {field: "accCode",sticky: true,width:60,headerAttributes: {"class": "columnHeader"},title: 'Данс'},
                        {field: "accName",sticky: true,width:180, headerAttributes: {"class": "columnHeader"},title: 'Дансны нэр'},
                        {field: "repName", width:180,headerAttributes: {"class": "columnHeader"},title: 'Нөлөөлж буй АГАДҮТ'},
                        {field: "dbCr", template: "#if(dbCr=='credit'){# Кт #}else{# Дт #}#",width:50,attributes: {"class":"uk-text-center"},headerAttributes: {"class": "columnHeader"},title: 'Дт Кт C1'},
                        {field: "amount",width:150,template:"<span ng-bind='dataItem.amount | number:2'></span>",attributes: {"class":"uk-text-right"},headerAttributes: {"class": "columnHeader uk-text-right"},title: 'Дүн'},
                        {field: "matCof", attributes: {"class":"uk-text-center"},values:[{"text":"0.5%","value":"0.005"},{"text":"1.0%","value":"0.01"},{"text":"1.5%","value":"0.015"},{"text":"2.0%","value":"0.02"}],width:100,headerAttributes: {"class": "columnHeader uk-text-center"},title: 'Материаллаг байдлын түвшин'},
                        {field: "matAmt", width:120,template:"<span ng-bind='dataItem.matAmt | number:2'></span>",attributes: {"class":"uk-text-right"},headerAttributes: {"class": "columnHeader uk-text-center"},title: 'Материаллаг байдал'},
                        {field: "perMatCof", width:120,values:[{"text":"60%","value":"0.6"},{"text":"65%","value":"0.65"},{"text":"70%","value":"0.7"},{"text":"75%","value":"0.75"},{"text":"80%","value":"0.8"}],attributes: {"class":"uk-text-center"},headerAttributes: {"class": "columnHeader uk-text-center"},title: 'Гүйцэтгэлийн материаллаг байдал тооцох хувь'},
                        {field: "perMatAmt", width:120,template:"<span ng-bind='dataItem.perMatAmt | number:2'></span>",attributes: {"class":"uk-text-right"},headerAttributes: {"class": "columnHeader uk-text-center"},title: 'Гүйцэтгэлийн материаллаг байдал'}
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

                                var matCof = dataItem.get("matCof");

                                var cell = row.children().eq(6);
                                if (matCof>=0) {
                                    cell.addClass("range1Cell");
                                }

                                var perMatCof = dataItem.get("perMatCof");

                                var cell1 = row.children().eq(8);
                                if (perMatCof>=0) {
                                    cell1.addClass("range1Cell");
                                }
                                //  cell.addClass("range0Cell");
                                /*if (units<5) {
                                    cell.addClass("range0Cell");
                                }
                                else if(units>5 && units<20){
                                    cell.addClass("range1Cell");
                                }
                                else if(units>20 && units<40){
                                    cell.addClass("range1Cell");
                                }
                                else if(units>40 && units<60){
                                    cell.addClass("range2Cell");
                                }
                                else if(units>60 && units<80){
                                    cell.addClass("range3Cell");
                                }
                                else if(units>80){
                                    cell.addClass("range4Cell");
                                }*/
                            }
                        }
                    },
                    height: function () {
                        return $(window).height() - 175;
                    }
                };
            }
            else if(item.formNo==='3.7'){
                $scope.$broadcast("formChanged37", item.id,$rootScope.app.id);
            }
            else if(item.formNo==='3.8'){
                $scope.$broadcast("formChanged38", item.id,$rootScope.app.id);
            }
            else if(item.formNo==='3.9'){
                $scope.journalDataSource = {
                    transport: {
                        read: {
                            url: __env.apiUrl() + "/api/audit/registration/journal/list",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            data:{"custom":" where planId="+$scope.app.id+"",sort: [{field: "id", dir: "desc"}]},
                            beforeSend: function(req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            }
                        },
                        update: {
                            url: __env.apiUrl() + "/api/audit/registration/journal/update",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            beforeSend: function(req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            },
                            complete: function (e) {
                                $(".k-grid").data("kendoGrid").dataSource.read();
                            }
                        },
                        destroy: {
                            url: __env.apiUrl() + "/api/audit/registration/journal/delete",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            beforeSend: function(req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            },
                            complete: function (e) {
                                $(".k-grid").data("kendoGrid").dataSource.read();
                            }
                        },
                        create: {
                            url: __env.apiUrl() + "/api/audit/registration/journal/create",
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
                                useYn: {type: "boolean",defaultValue:true}
                            }
                        }
                    },
                    autoSync: true,
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
                };
                $scope.journalGrid = {
                    sortable: true,
                    resizable: true,
                    excel: {
                        fileName: "Export.xlsx",
                        filterable: true,
                        allPages: true
                    },
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
                        /* {field: "method", values:[{"text":"Статистик","value":"1"},{"text":"Статистикийн бус","value":"2"}],width:200,attributes: {"class":"uk-text-center"},headerAttributes: {"class": "columnHeader uk-text-center"},title: 'Сонголт хийсэн арга'}*/
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
                        return $(window).height() - 175;
                    }
                };
            }
            else if(item.formNo==='3.10'){
                $scope.journalDataSource = {
                    transport: {
                        read: {
                            url: __env.apiUrl() + "/api/audit/registration/journal/list",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            data:{"custom":" where planId="+$scope.app.id+"",sort: [{field: "id", dir: "desc"}]},
                            beforeSend: function(req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            }
                        },
                        update: {
                            url: __env.apiUrl() + "/api/audit/registration/journal/update",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            beforeSend: function(req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            },
                            complete: function (e) {
                                $(".k-grid").data("kendoGrid").dataSource.read();
                            }
                        },
                        destroy: {
                            url: __env.apiUrl() + "/api/audit/registration/journal/delete",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            beforeSend: function(req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            },
                            complete: function (e) {
                                $(".k-grid").data("kendoGrid").dataSource.read();
                            }
                        },
                        create: {
                            url: __env.apiUrl() + "/api/audit/registration/journal/create",
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
                                accName: {type: "string",editable:false},
                                accCode:{type:"string",editable:false},
                                repName:{type:"string",editable:false},
                                dbCr:{type:"string",editable:false},
                                amount:{type:"number",editable:false},
                                matAmt:{type:"number",editable:false},
                                cnt:{type:"number",editable:false},
                                dnCnt:{type:"number",editable:false},
                                dnAmount:{type:"number",editable:false},
                                samAmt:{type:"number",editable:false},
                                ehCnt:{type:"number",editable:false},
                                ehAmount:{type:"number",editable:false},
                                abCof:{type:"number"},
                                samCnt:{type:"number",editable:false},
                                riskName:{type:"string",editable:false},
                                abCnt:{type:"number"},
                                abAmount:{type:"number"},
                                perMatCof:{type:"number"},
                                perMatAmt:{type:"number",editable:false},
                                matCof:{type:"number"},
                                method:{type:"number"},
                                useYn: {type: "boolean",defaultValue:true}
                            }
                        }
                    },
                    autoSync: true,
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
                        { field: "samAmt", aggregate: "sum" },
                    ]
                };
                $scope.journalGrid = {
                    sortable: true,
                    resizable: true,
                    excel: {
                        fileName: "Export.xlsx",
                        filterable: true,
                        allPages: true
                    },
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
                        {field: "riskName", width:300,headerAttributes: {"class": "columnHeader"},title: 'Тодорхойлсон эрсдэл'},
                        {field: "repName", width:150,headerAttributes: {"class": "columnHeader uk-text-center"},title: 'Нөлөөлж буй АГАДҮТ'},
                        {field: "accName", width:150,attributes: {"class":"uk-text-center"},headerAttributes: {"class": "columnHeader uk-text-center"},title: 'АГАДҮТ-н дэд анги'},
                        {field: "method", values:[{"text":"Статистик","value":"1"},{"text":"Статистикийн бус","value":"2"}],width:150,attributes: {"class":"uk-text-center"},headerAttributes: {"class": "columnHeader uk-text-center"},title: 'Сонголт хийсэн арга'},
                        {field: "samCnt",template:"#if(samCnt>0){# <button class='uk-text-bold uk-text-primary w-full md-btn' ng-click='viewJournal(dataItem)' ng-bind='dataItem.samCnt | number:0'></button> #}else{# <span ng-bind='dataItem.samCnt | number:0'></span> #}#",footerTemplate: "<span style='text-align: center;display: block;'> #=kendo.toString(data.samCnt?data.samCnt.sum : 0, \"n0\") #</span>", width:120,attributes: {"class":"uk-text-center uk-abs-wrap"},headerAttributes: {"class": "columnHeader uk-text-center"},title: 'Тооцоолсон түүврийн хэмжээ'},
                        {field: "samAmt",template:"<span ng-show='dataItem.status!=null' ng-bind='dataItem.samAmt | number:2'></span> <span style='display: block;text-align: center;' ng-show='dataItem.status==null'>-</span>",footerTemplate: "<span style='text-align: right;display: block;'> #=kendo.toString(data.samAmt?data.samAmt.sum : 0, \"n0\") #</span>", width:120,attributes: {"class":"uk-text-right"},headerAttributes: {"class": "columnHeader uk-text-center"},title: 'Тооцоолсон түүврийн үнэ цэнэ'},

                        {headerAttributes: {"class": "columnHeader"},title: 'Түүврийн алдаа',
                            columns:[
                                {field: "cnt",template:"<span ng-show='dataItem.status!=null' ng-bind='dataItem.cnt | number:0'></span> <span style='display: block;text-align: center;' ng-show='dataItem.status==null'>-</span>",aggregates: ["sum"], footerTemplate: "<span style='text-align: center;display: block;'> #=kendo.toString(data.cnt?data.cnt.sum : 0, \"n0\") #</span>", width:60,attributes: {"class":"uk-text-center"},headerAttributes: {"class": "columnHeader uk-text-center"},title: 'тоо'},
                                {field: "amount",template:"<span ng-show='dataItem.status!=null' ng-bind='dataItem.amount | number:2'></span> <span style='display: block;text-align: center;' ng-show='dataItem.status==null'>-</span>",aggregates: ["sum"], footerTemplate: "<span style='float:right;'> #=kendo.toString(data.amount?data.amount.sum : 0, \"n2\") #</span>",width:150,attributes: {"class":"uk-text-right"},headerAttributes: {"class": "columnHeader uk-text-right"},title: 'дүн'}
                            ]
                        },
                        {headerAttributes: {"class": "columnHeader"},title: 'Дангаараа нөлөө бүхий зүйлсийн алдаа',
                            columns:[
                                {field: "dnCnt",template:"<span ng-show='dataItem.status!=null' ng-bind='dataItem.dnCnt | number:0'></span> <span style='display: block;text-align: center;' ng-show='dataItem.status==null'>-</span>",width:60,footerTemplate: "<span style='text-align: center;display: block;'> #=kendo.toString(data.dnCnt?data.dnCnt.sum : 0, \"n0\") #</span>",attributes: {"class":"uk-text-center"},headerAttributes: {"class": "columnHeader uk-text-center"},title: 'тоо'},
                                {field: "dnAmount",template:"<span ng-show='dataItem.status!=null' ng-bind='dataItem.dnAmount | number:2'></span> <span style='display: block;text-align: center;' ng-show='dataItem.status==null'>-</span>",width:150,footerTemplate: "<span style='float:right;'> #=kendo.toString(data.dnAmount?data.dnAmount.sum : 0, \"n2\") #</span>",attributes: {"class":"uk-text-right"},headerAttributes: {"class": "columnHeader uk-text-right"},title: 'дүн'}
                            ]
                        },
                        {headerAttributes: {"class": "columnHeader"},title: 'Ердийн бус зүйлсийн алдаа',
                            columns:[
                                {field: "abCnt",template:"<span ng-show='dataItem.status!=null' ng-bind='dataItem.abCnt | number:0'></span> <span style='display: block;text-align: center;' ng-show='dataItem.status==null'>-</span>",width:100,footerTemplate: "<span style='text-align: center;display: block;'> #=kendo.toString(data.abCnt?data.abCnt.sum : 0, \"n0\") #</span>",attributes: {"class":"uk-text-center"},headerAttributes: {"class": "columnHeader uk-text-center"},title: 'тоо'},
                                {field: "abAmount",template:"<span ng-show='dataItem.status!=null' ng-bind='dataItem.abAmount | number:2'></span> <span style='display: block;text-align: center;' ng-show='dataItem.status==null'>-</span>",width:150,footerTemplate: "<span style='float:right;'> #=kendo.toString(data.abAmount?data.abAmount.sum : 0, \"n2\") #</span>",attributes: {"class":"uk-text-right"},headerAttributes: {"class": "columnHeader uk-text-right"},title: 'дүн'}
                            ]
                        },
                        {headerAttributes: {"class": "columnHeader"},title: 'Нийт алдаа',
                            columns:[
                                {field: "ehCnt",template:"<span ng-show='dataItem.status!=null' ng-bind='dataItem.ehCnt | number:0'></span> <span style='display: block;text-align: center;' ng-show='dataItem.status==null'>-</span>",width:60,footerTemplate: "<span style='text-align: center;display: block;'> #=kendo.toString(data.ehCnt?data.ehCnt.sum : 0, \"n0\") #</span>",attributes: {"class":"uk-text-center"},headerAttributes: {"class": "columnHeader uk-text-center"},title: 'тоо'},
                                {field: "ehAmount",template:"<span ng-show='dataItem.status!=null' ng-bind='dataItem.ehAmount | number:2'></span> <span style='display: block;text-align: center;' ng-show='dataItem.status==null'>-</span>",width:150,footerTemplate: "<span style='float:right;'> #=kendo.toString(data.ehAmount?data.ehAmount.sum : 0, \"n2\") #</span>",attributes: {"class":"uk-text-right"},headerAttributes: {"class": "columnHeader uk-text-right"},title: 'дүн'}
                            ]
                        },
                        {field: "method", width:200,attributes: {"class":"uk-text-center"},headerAttributes: {"class": "columnHeader uk-text-center"},title: 'Харьцуулан шилжүүлсэн алдааны дүн'},
                        {field: "dbCr", hidden:true,values:[{"text":"Дт","value":"debit"},{"text":"Кт","value":"credit"}],title: ' '}
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

                                var method = dataItem.get("samCnt");
                                var cell = row.children().eq(5);
                                if (method>0) {
                                    // cell.addClass("range1Cell");
                                }

                                /*   var abCnt = dataItem.get("abCnt");
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
                                   }*/
                            }
                        }
                    },
                    height: function () {
                        return $(window).height() - 175;
                    }
                };
            }
            else if(item.formNo==='3.11'){
                $scope.journalDataSource = {
                    transport: {
                        read: {
                            url: __env.apiUrl() + "/api/audit/registration/journal/list",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            data:{"custom":" where planId="+$scope.app.id+"",sort: [{field: "id", dir: "desc"}]},
                            beforeSend: function(req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            }
                        },
                        update: {
                            url: __env.apiUrl() + "/api/audit/registration/journal/update",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            beforeSend: function(req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            },
                            complete: function (e) {
                                $(".k-grid").data("kendoGrid").dataSource.read();
                            }
                        },
                        destroy: {
                            url: __env.apiUrl() + "/api/audit/registration/journal/delete",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            beforeSend: function(req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            },
                            complete: function (e) {
                                $(".k-grid").data("kendoGrid").dataSource.read();
                            }
                        },
                        create: {
                            url: __env.apiUrl() + "/api/audit/registration/journal/create",
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
                                useYn: {type: "boolean",defaultValue:true}
                            }
                        }
                    },
                    autoSync: true,
                    pageSize: 20,
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true
                };
                $scope.journalGrid = {
                    sortable: true,
                    resizable: true,
                    excel: {
                        fileName: "Export.xlsx",
                        filterable: true,
                        allPages: true
                    },
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
                        {field: "riskName",width:300,attributes: {"style":"text-align: justify;"}, headerAttributes: {"class": "columnHeader"},title: 'Тодорхойлсон эрсдэл'},
                        {field: "accName",width:180, headerAttributes: {"class": "columnHeader"},title: 'Дэд анги'},
                        {field: "noticeStr", width:200,headerAttributes: {"class": "columnHeader"},title: 'Батламж мэдэгдэл'},
                        {field: "tryMode",width:200, headerAttributes: {"class": "columnHeader"},title: 'Горимийн шинж чанар'},
                        {field: "tryName", width:200,headerAttributes: {"class": "columnHeader"},title: 'Гүйцэтгэх горим,сорил'},
                        {field: "standardStr", width:200,headerAttributes: {"class": "columnHeader"},title: 'Нөхцөл байдал'},
                        {field: "lawStr", width:200,headerAttributes: {"class": "columnHeader"},title: 'Горим сорилын үр дүн'},
                    ],
                    editable:true,
                    dataBinding: function () {
                        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                    },
                    height: function () {
                        return $(window).height() - 175;
                    }
                };
            }
            else if(item.formNo==='3.12'){
                $scope.journalDataSource = {
                    transport: {
                        read: {
                            url: __env.apiUrl() + "/api/audit/registration/journal/list",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            data:{"custom":" where planId="+$scope.app.id+"",sort: [{field: "id", dir: "desc"}]},
                            beforeSend: function(req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            }
                        },
                        update: {
                            url: __env.apiUrl() + "/api/audit/registration/journal/update",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            beforeSend: function(req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            },
                            complete: function (e) {
                                $(".k-grid").data("kendoGrid").dataSource.read();
                            }
                        },
                        destroy: {
                            url: __env.apiUrl() + "/api/audit/registration/journal/delete",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            beforeSend: function(req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            },
                            complete: function (e) {
                                $(".k-grid").data("kendoGrid").dataSource.read();
                            }
                        },
                        create: {
                            url: __env.apiUrl() + "/api/audit/registration/journal/create",
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
                                useYn: {type: "boolean",defaultValue:true}
                            }
                        }
                    },
                    autoSync: true,
                    pageSize: 20,
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true,
                    aggregate: [{ field: "perMatAmt", aggregate: "sum" },
                        { field: "cnt", aggregate: "sum" },
                        { field: "amount", aggregate: "sum" },
                    ]
                };
                $scope.journalGrid = {
                    sortable: true,
                    resizable: true,
                    excel: {
                        fileName: "Export.xlsx",
                        filterable: true,
                        allPages: true
                    },
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
                        {field: "repName",width:180,headerAttributes: {"class": "columnHeader"},title: 'Нөлөөлж буй АГАДҮТ'},
                        {field: "accName",width:180, headerAttributes: {"class": "columnHeader"},title: 'Дэд анги'},
                        {field: "accName",width:180, headerAttributes: {"class": "columnHeader"},title: 'Алдаа зөрчлийн утга'},
                        {field: "perMatAmt",aggregates: ["sum"], groupHeaderTemplate: "#=sum#", footerTemplate: "<span style='float:right;'> #=kendo.toString(data.perMatAmt?data.perMatAmt.sum : 0, \"n2\") #</span>", width:120,template:"<span ng-bind='dataItem.perMatAmt | number:2'></span>",headerAttributes: {"class": "columnHeader uk-text-center"},attributes: {"class":"uk-text-right"},title: 'Мөнгөн дүн'},
                        {field: "accName",width:180, headerAttributes: {"class": "columnHeader"},title: 'Материаллаг эсэх'},
                        {field: "accName",width:180, headerAttributes: {"class": "columnHeader"},title: 'Залруулах боломжтой эсэх'},
                        {headerAttributes: {"class": "columnHeader"},title: 'Шалгуур үзүүлэлт',
                            columns:[
                                {field: "cnt",width:250,attributes: {"class":"uk-text-left"},headerAttributes: {"class": "columnHeader uk-text-left"},title: 'Стандартын заалт'},
                                {field: "amount",width:250,attributes: {"class":"uk-text-left"},headerAttributes: {"class": "columnHeader uk-text-left"},title: 'Хууль тогтоомжийн заалт'}
                            ]
                        }
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
                        return $(window).height() - 175;
                    }
                };
            }
            else if(item.formNo==='ex-2'){
                $scope.$broadcast("formChanged40", item.id,$rootScope.app.id);
            }
            else if(item.formNo==='4.1'){
                $scope.$broadcast("formChanged41", item.id,$rootScope.app.id);
            }
            else if(item.formNo==='4.2'){
                $scope.$broadcast("formChanged42", item.id,$rootScope.app.id);
            }
            else if(item.formNo==='4.3'){
                $scope.$broadcast("formChanged43", item.id,$rootScope.app.id);
            }
            else if(item.formNo==='4.4'){
                $scope.$broadcast("formChanged44", item.id,$rootScope.app.id);
            }
            else if(item.formNo==='4.5'){
                $scope.$broadcast("formChanged45", item.id,$rootScope.app.id);
            }
            else if(item.formNo==='4.6'){
                $scope.$broadcast("formChanged46", item.id,$rootScope.app.id);
            }
            else if(item.formNo==='4.7'){
                $scope.$broadcast("formChanged47", item.id,$rootScope.app.id);
            }
            else if(item.formNo==='4.8'){
                $scope.$broadcast("formChanged48", item.id,$rootScope.app.id);
            }
            else if(item.formNo==='4.9'){
                $scope.$broadcast("formChanged49", item.id,$rootScope.app.id);
            }
            else if(item.formNo==='report'){
                $scope.$broadcast("formChanged50", item.id,$rootScope.app.id);
            }
        };
    },
]);
