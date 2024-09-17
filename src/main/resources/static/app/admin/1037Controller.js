angular
    .module('altairApp')
    .controller(
        '1037Ctrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$timeout',
            '__env',
            function ($rootScope, $state, $scope, $timeout,__env) {

                $scope.mainGrid = {
                    dataSource: {
                        transport: {
                            read: {
                                url: function (e) {
                                    if(localStorage.getItem("buttonData").includes("read") && JSON.parse(localStorage.getItem('menuData')).link===$state.current.name){
                                        return __env.apiUrl() + "/api/privilege/list";
                                    }
                                    else{
                                        localStorage.removeItem('currentUser');
                                        localStorage.removeItem('menuList');
                                        localStorage.removeItem('menuData');
                                        $state.go('login');
                                    }
                                },
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                data:{
                                    sort: [{field: "id", dir: "desc"}]
                                },
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                }
                            },
                            update: {
                                url: __env.apiUrl() +"/api/privilege/update",
                                contentType: "application/json; charset=UTF-8",
                                type: "PUT",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                }
                            },
                            destroy: {
                                url: __env.apiUrl() +"/api/privilege/delete",
                                contentType: "application/json; charset=UTF-8",
                                type: "DELETE",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                }
                            },
                            create: {
                                url: __env.apiUrl() +"/api/privilege/create",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
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
                                    id: {type: "number", nullable:true},
                                    name: {type: "string", validation: {required: true}},
                                    modDtm: {type: "date", editable:false},
                                    regDtm: {type: "date", editable:false}
                                }
                            }
                        },
                        pageSize: 20,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    },
                    filterable: true,
                    sortable: true,
                    columnMenu: true,
                    resizable: true,
                    excel: {
                        fileName: "Organization Export.xlsx",
                        proxyURL: "//demos.telerik.com/kendo-ui/service/export",
                        filterable: true,
                        allPages: true
                    },
                    pageable: {
                        refresh: true,
                        pageSizes: true,
                        buttonCount: 5
                    },
                    columns: [
                        {title: "#", headerAttributes: {"class": "columnHeader"}, template: "<span class='row-number'></span>", width: "50px"},
                        {field: "name", headerAttributes: {"class": "columnHeader"},title: '{{"Name" | translate}}'},
                        {field: "regDtm", headerAttributes: {"class": "columnHeader"},title: '{{"Reg date" | translate}}', template: "<div style='text-align: center;width:100%;'>#=(regDtm == null)? '' : kendo.toString(kendo.parseDate(regDtm, 'yyyy-MM-dd'), 'yyyy/MM/dd') #</div>", width:150},
                        {field: "modDtm", headerAttributes: {"class": "columnHeader"},title: '{{"Mod date" | translate}}',template: "<div style='text-align: center;width:100%;'>#=(modDtm == null)? '' : kendo.toString(kendo.parseDate(modDtm, 'yyyy-MM-dd'), 'yyyy/MM/dd') #</div>", width:150}
                    ],
                    dataBound: function () {
                        var rows = this.items();
                        $(rows).each(function () {
                            var index = $(this).index() + 1
                                + ($(".k-grid").data("kendoGrid").dataSource.pageSize() * ($(".k-grid").data("kendoGrid").dataSource.page() - 1));
                            var rowLabel = $(this).find(".row-number");
                            $(rowLabel).html(index);
                        });
                    },
                    editable:"inline",

                    height: function () {
                        return $(window).height() - 110;
                    }
                };
                if(JSON.parse(localStorage.getItem('privilege'))!=null){
                    var privileges=JSON.parse(localStorage.getItem('privilege'));
                    angular.forEach(privileges, function(value, key) {
                        if(value.name==='READ'){
                            $scope.mainGrid.toolbar = ["create","search"];
                        }
                        if(value.name==='UPDATE'){
                            $scope.mainGrid.columns.push({
                                command: [
                                    {name: "edit", text: {edit: " ", update: " ", cancel: " "}},
                                    {name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn"}
                                ], title: "&nbsp;", width: 100
                            });
                        }
                    });
                }
            }
        ]
    );
