angular
    .module('altairApp')
    .controller(
        'form49Ctrl',
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

                $scope.$on("formChanged49", function (event, args, data) {
                    $scope.initForm(data,args);
                });

                $scope.copyData=function (){
                    console.log("end");
                   /* mainService.withdomain("get", __env.apiUrl() + "/api/nms/funding/expense/copy/" + $scope.funding.id+'/'+$scope.userTp).then(function (data) {
                        $("#app1Data").data("kendoGrid").dataSource.read();
                    });*/
                }

                $scope.appId = 0;
                $scope.formId = 0;
                $scope.initForm=function (appId,formId){
                    $scope.dataSource371= new kendo.data.DataSource({
                        autoSync:true,
                        transport: {
                            read: {
                                url: __env.apiUrl() + "/api/adt/main/adt-risk-finance/list",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                data:{filter:{
                                        logic: "and",
                                        filters: [{ field: "useYn", operator: "eq", value: 0 },],
                                    },sort: [{field: "id", dir: "desc"}]},
                                beforeSend: function(req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                },
                                complete: function (_) {
                                    $timeout(function ( ){});
                                }
                            },
                            update: {
                                url: __env.apiUrl() + "/api/adt/main/adt-risk-finance/submit",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                },
                                complete: function (e) {
                                    $("#appData371").data("kendoGrid").dataSource.read();
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
                                    planId: { type: "number", defaultValue: appId},
                                    subDirNm: { editable: false ,type: "string" },
                                    probability: { type: "string" },
                                    aggInc: { editable: false ,type: "string" },
                                    effect: { type: "string" },
                                    riskNm: {  editable: false ,type: "string" },
                                    confNm: {  editable: false ,type: "string" },
                                    accNm: {  editable: false ,type: "string" },
                                    riskCatTypeNm: {  editable: false ,type: "string" },
                                    dirNm: {  editable: false ,type: "string" },
                                    typeNm: {  editable: false ,type: "string" }
                                }
                            }
                        },
                        pageSize: 20,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    });
                    $scope.dataSource372= new kendo.data.DataSource({
                        autoSync:true,
                        transport: {
                            read: {
                                url: __env.apiUrl() + "/api/adt/main/adt-risk-detail/list",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                data:{filter:{
                                        logic: "and",
                                        filters: [{ field: "useYn", operator: "eq", value: 0 },],
                                    },sort: [{field: "id", dir: "desc"}]},
                                beforeSend: function(req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                },
                                complete: function (_) {
                                    console.log("test37");
                                    $timeout(function ( ){});
                                }
                            },
                            update: {
                                url: __env.apiUrl() + "/api/adt/main/adt-risk/submit",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                },
                                complete: function (e) {
                                    $("#appData37").data("kendoGrid").dataSource.read();
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
                                    planId: { type: "number", defaultValue: appId},
                                    subDirNm: { editable: false ,type: "string" },
                                    probability: { type: "string" },
                                    aggInc: { editable: false ,type: "string" },
                                    effect: { type: "string" },
                                    riskNm: {  editable: false ,type: "string" },
                                    confNm: {  editable: false ,type: "string" },
                                    accNm: {  editable: false ,type: "string" },
                                    riskCatTypeNm: {  editable: false ,type: "string" },
                                    dirNm: {  editable: false ,type: "string" },
                                    typeNm: {  editable: false ,type: "string" }
                                }
                            }
                        },
                        pageSize: 20,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    });
                    $scope.dataSource373= new kendo.data.DataSource({
                        autoSync:true,
                        transport: {
                            read: {
                                url: __env.apiUrl() + "/api/adt/main/adt-risk-detail/list",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                data:{filter:{
                                        logic: "and",
                                        filters: [{ field: "useYn", operator: "eq", value: 0 },],
                                    },sort: [{field: "id", dir: "desc"}]},
                                beforeSend: function(req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                },
                                complete: function (_) {
                                    console.log("test37");
                                    $timeout(function ( ){});
                                }
                            },
                            update: {
                                url: __env.apiUrl() + "/api/adt/main/adt-risk/submit",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                },
                                complete: function (e) {
                                    $("#appData37").data("kendoGrid").dataSource.read();
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
                                    planId: { type: "number", defaultValue: appId},
                                    subDirNm: { editable: false ,type: "string" },
                                    probability: { type: "string" },
                                    aggInc: { editable: false ,type: "string" },
                                    effect: { type: "string" },
                                    riskNm: {  editable: false ,type: "string" },
                                    confNm: {  editable: false ,type: "string" },
                                    accNm: {  editable: false ,type: "string" },
                                    riskCatTypeNm: {  editable: false ,type: "string" },
                                    dirNm: {  editable: false ,type: "string" },
                                    typeNm: {  editable: false ,type: "string" }
                                }
                            }
                        },
                        pageSize: 20,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    });
                    $scope.appId = appId;
                    $scope.formId = formId;
                    $scope.activeTab({id:'01',code:'tab1'});
                }

                $scope.textEditor = function (container, options) {
                    if(options.model.data4==='1'){
                        var editor = $('<textarea rows="3" kendo-text-area   data-bind="value:' + options.field + '"></textarea>').appendTo(container);
                    }
                    else{
                       $rootScope.alert(false,"Залилангийн эрсдэл гарах магадлал сонгоно уу");
                    }
                };

                $scope.mainGrid371 = {
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
                            title: "№",
                            headerAttributes: {
                                "class": "checkbox-align",
                            },
                            attributes: {style: "text-align: center;"},
                            template: "#= ++record #",
                            width: 50,
                        },
                        {field: "riskNm",attributes: {"class": "uk-text-justify"},headerAttributes: {"class": "columnHeader"},title: 'Тодорхойлсон эрсдэл'},
                        {field: "data4",values:[{"text":"Тийм","value":"1"},{"text":"Үгүй","value":"0"}], width:220,attributes: {"class": "text-center"},headerAttributes: {style: "text-align: center; justify-content: center"},title: 'Залилангийн эрсдэл гарах магадлалтай эсэх'},
                        {field: "data5",template:"#if(data5==null){# - #}else{# #=data5# #}#",editor:$scope.textEditor,width: 220, attributes: {"class": "text-center"},headerAttributes: {style: "text-align: center; justify-content: center"},title: 'Залилангийн эрсдэл гарах шалтгаан'},
                        {field: "data6",values:[{"text":"Тийм","value":"1"},{"text":"Үгүй","value":"0"}], width: 220, attributes: {"class": "text-center"},headerAttributes: {style: "text-align: center; justify-content: center"},title: 'Дотоод хяналтын тогтолцооны бүрэлдэхүүн хэсгээс үүссэн дутагдал эсэх'},
                    ],
                    editable:true,
                    dataBinding: function () {
                        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                    },
                    height: function () {
                        return $(window).height() - 132;
                    }
                };
                $scope.mainGrid372 = {
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
                            title: "№",
                            headerAttributes: {
                                "class": "checkbox-align",
                            },
                            attributes: {style: "text-align: center;"},
                            template: "#= ++record #",
                            width: 50,
                        },
                        {field: "riskNm",attributes: {"class": "uk-text-justify"},headerAttributes: {"class": "columnHeader"},title: 'Тодорхойлсон эрсдэл'},
                        {field: "subDirNm", width:150,headerAttributes: {"class": "columnHeader"},title: 'АГАДҮТ-н дэд анги'},
                        /* {field: "riskAccNm", width:200,headerAttributes: {"class": "columnHeader"},title: 'АГАДҮТ-н дэд анги'},
                         {field: "accCode", width:200,headerAttributes: {"class": "columnHeader"},title: 'АГАДҮТ-н дэд анги'},*/
                        {field: "confNm",width: 220, headerAttributes: {"class": "columnHeader"},title: 'Холбогдох батламж мэдэгдлүүд'},
                        {field: "riskCatTypeNm",width: 130,attributes: {"class": "text-center"}, headerAttributes: {style: "text-align: left; justify-content: center"},title: 'Эрсдэлийн төрөл'},
                        {field: "probability", width: 100, values:[{"text":"их","value":"их"},{"text":"бага","value":"бага"}],attributes: {"class": "text-center"},headerAttributes: {style: "text-align: left; justify-content: center"},title: 'Магадлал'},
                        {field: "effect",sortable:false,  headerTemplate: '<span>Үр нөлөө</span>',width: 100,values:[{"text":"их","value":"их"},{"text":"бага","value":"бага"}],attributes: {"class": "text-center"},headerAttributes: {style: "text-align: left; justify-content: center"},title: 'Үр нөлөө'},
                        {field: "aggInc", width: 130, attributes: {"class": "text-center"},headerAttributes: {"class": "columnHeader"},title: 'Нийлбэр үзүүлэлт'},
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
                            row[0].cells[5].style.backgroundColor = "#fff7ed";
                            row[0].cells[6].style.backgroundColor = "#fff7ed";
                            row[0].cells[7].style.backgroundColor = "#eef2fe";
                        }
                    },
                    height: function () {
                        return $(window).height() - 132;
                    }
                };
                $scope.mainGrid373 = {
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
                            title: "№",
                            headerAttributes: {
                                "class": "checkbox-align",
                            },
                            attributes: {style: "text-align: center;"},
                            template: "#= ++record #",
                            width: 50,
                        },
                        {field: "riskNm",attributes: {"class": "uk-text-justify"},headerAttributes: {"class": "columnHeader"},title: 'Тодорхойлсон эрсдэл'},
                        {field: "subDirNm", width:150,headerAttributes: {"class": "columnHeader"},title: 'АГАДҮТ-н дэд анги'},
                        /* {field: "riskAccNm", width:200,headerAttributes: {"class": "columnHeader"},title: 'АГАДҮТ-н дэд анги'},
                         {field: "accCode", width:200,headerAttributes: {"class": "columnHeader"},title: 'АГАДҮТ-н дэд анги'},*/
                        {field: "confNm",width: 220, headerAttributes: {"class": "columnHeader"},title: 'Холбогдох батламж мэдэгдлүүд'},
                        {field: "riskCatTypeNm",width: 130,attributes: {"class": "text-center"}, headerAttributes: {style: "text-align: left; justify-content: center"},title: 'Эрсдэлийн төрөл'},
                        {field: "probability", width: 100, values:[{"text":"их","value":"их"},{"text":"бага","value":"бага"}],attributes: {"class": "text-center"},headerAttributes: {style: "text-align: left; justify-content: center"},title: 'Магадлал'},
                        {field: "effect",sortable:false,  headerTemplate: '<span>Үр нөлөө</span>',width: 100,values:[{"text":"их","value":"их"},{"text":"бага","value":"бага"}],attributes: {"class": "text-center"},headerAttributes: {style: "text-align: left; justify-content: center"},title: 'Үр нөлөө'},
                        {field: "aggInc", width: 130, attributes: {"class": "text-center"},headerAttributes: {"class": "columnHeader"},title: 'Нийлбэр үзүүлэлт'},
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
                            row[0].cells[5].style.backgroundColor = "#fff7ed";
                            row[0].cells[6].style.backgroundColor = "#fff7ed";
                            row[0].cells[7].style.backgroundColor = "#eef2fe";
                        }
                    },
                    height: function () {
                        return $(window).height() - 132;
                    }
                };

                $scope.activeTab = function (item) {
                    $scope.gridActive = item.id;
                    $scope.gridCode = item.code;
                    if(item.code==='tab1'){
                        $scope.dataSource371.filter({
                            logic: "and",
                            filters: [{ field: "useYn", operator: "eq", value: 1 },
                                {field: "stepId", operator: "eq", value: 0},
                                {field: "planId", operator: "eq", value: $scope.appId}],
                        });
                    }
                    if(item.code==='tab2'){
                        $scope.dataSource372.filter({
                            logic: "and",
                            filters: [{ field: "useYn", operator: "eq", value: 1 },
                                {field: "decType", operator: "eq", value: 1},
                                {field: "typeId", operator: "eq", value: 1},
                                {field: "impType", operator: "eq", value: 0},
                                {field: "planId", operator: "eq", value: $scope.appId}],
                        });
                    }
                    if(item.code==='tab3'){
                        $scope.dataSource373.filter({
                            logic: "and",
                            filters: [{ field: "useYn", operator: "eq", value: 1 },
                                {field: "decType", operator: "eq", value: 1},
                                {field: "typeId", operator: "eq", value: 0},
                                {field: "impType", operator: "eq", value: 0},
                                {field: "planId", operator: "eq", value: $scope.appId}],
                        });
                    }
                }



                $(document).ready(function () {
                    $("#radioBtn1").kendoRadioButton({
                        checked: true,
                        label: "Agree"
                    });
                    $("#radioBtn2").kendoRadioButton({
                        label: "Disagree"
                    });
                });
            }
        ]
    );
