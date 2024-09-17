angular
    .module('altairApp')
    .controller(
        '1051Ctrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$timeout',
            '$translate',
            '__env',
            function ($rootScope, $state, $scope, $timeout, $translate,__env) {

                var yesNo = [{"text": "N", "value": false}, {"text": "Y", "value": true}];
                $scope.gridDataSource = {
                    transport: {
                        read: {
                            url: function (e) {
                                if(localStorage.getItem("buttonData").includes("read") && JSON.parse(localStorage.getItem('menuData')).link===$state.current.name){
                                    return __env.apiUrl() + "/api/formSrc/list";
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
                            data:{"custom":"where parentId is null",sort: [{field: "id", dir: "desc"}]},
                            beforeSend: function(req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                            }
                        },
                        update: {
                            url: __env.apiUrl() + "/api/formSrc/update",
                            contentType: "application/json; charset=UTF-8",
                            type: "PUT",
                            beforeSend: function(req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                            },
                            complete: function (e) {
                                if (e.status === 200) {
                                    UIkit.notify("Амжилттай засагдлаа.", {
                                        status: 'warning',
                                        pos: 'bottom-center'
                                    });
                                }
                                else if (e.status === 500) {
                                    UIkit.notify("Амжилтгүй.", {
                                        status: 'danger',
                                        pos: 'bottom-center'
                                    });
                                }
                            }
                        },
                        destroy: {
                            url: __env.apiUrl() + "/api/formSrc/delete",
                            contentType: "application/json; charset=UTF-8",
                            type: "DELETE",
                            beforeSend: function(req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                            }
                        },
                        create: {
                            url: __env.apiUrl() + "/api/formSrc/createGrp",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            complete: function (e) {
                                if (e.status === 200) {
                                    UIkit.notify("Амжилттай хадгаллаа.", {
                                        status: 'success',
                                        pos: 'bottom-center'
                                    });
                                }
                                else if (e.status === 409) {
                                    UIkit.notify("Код давхцаж байна.", {
                                        status: 'danger',
                                        pos: 'bottom-center'
                                    });
                                }
                                else if (e.status === 500) {
                                    UIkit.notify("Амжилтгүй.", {
                                        status: 'danger',
                                        pos: 'bottom-center'
                                    });
                                }
                                $("#parent").data("kendoGrid").dataSource.read();
                            },
                            beforeSend: function(req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
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
                                grpCd: {type: "string"},
                                comCdNm: {type: "string"},
                                comCdEn: {type: "string"},
                                comCdKr: {type: "string"},
                                shortCd: {type: "string"},
                                comCd: {type: "string", defaultValue:null},
                                ord: {type: "number"},
                                useYn: {type: "boolean"}
                            }
                        }
                    },
                    pageSize: 20,
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true
                };
                $scope.mainGrid = {
                    filterable: true,
                    sortable: true,
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
                        {
                            title: '{{"Num" | translate}}',
                            headerAttributes: {"class": "columnHeader"},
                            template: "<span class='row-number' style='text-align: center; float: left; width: 100%;'></span>",
                            width: "60px"
                        },
                        {
                            field: "grpCd", title:'{{"Sys08" | translate}}',
                            headerAttributes: {"class": "columnHeader"}
                        },
                        {
                            field: "comCdNm", title:'{{"Name" | translate}}',
                            headerAttributes: {"class": "columnHeader"}
                        },
                        {field: "useYn", headerAttributes: {"class": "columnHeader"}, width: 130, template:"#if(useYn===true){# <span class='columnCenter'>Y</span> #}else{#<span class='columnCenter uk-text-danger'>N</span> #}#",  title: '{{"Cmn06" | translate}}' }
                    ],
                    dataBound: function () {
                      //  this.expandRow(this.tbody.find("tr.k-master-row").first());
                        var rows = this.items();
                        $(rows).each(function () {
                            var index = $(this).index() + 1
                                + ($(".k-grid").data("kendoGrid").dataSource.pageSize() * ($(".k-grid").data("kendoGrid").dataSource.page() - 1));
                            var rowLabel = $(this).find(".row-number");
                            $(rowLabel).html(index);
                        });
                    },
                    editable: "inline",

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
                                ], title: "&nbsp;", width: 110
                            });
                        }
                    });
                }

                $scope.detailGridOptions = function(dataItem) {
                    return {
                        dataSource: {
                            transport: {
                                read: {
                                    url: __env.apiUrl() + "/api/formSrc/list",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "POST",
                                    data:{"custom":"where 1=1",sort: [{field: "id", dir: "desc"}]},
                                    beforeSend: function(req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                    }
                                },
                                update: {
                                    url: __env.apiUrl() + "/api/formSrc/update",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "PUT",
                                    beforeSend: function(req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                    },
                                    complete: function (e) {
                                        if (e.status === 200) {
                                            UIkit.notify("Амжилттай засагдлаа.", {
                                                status: 'warning',
                                                pos: 'bottom-center'
                                            });
                                        }
                                        else if (e.status === 500) {
                                            UIkit.notify("Амжилтгүй.", {
                                                status: 'danger',
                                                pos: 'bottom-center'
                                            });
                                        }
                                    }
                                },
                                destroy: {
                                    url: __env.apiUrl() + "/api/formSrc/delete",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "DELETE",
                                    beforeSend: function(req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                    }
                                },
                                create: {
                                    url: __env.apiUrl() + "/api/formSrc/create",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "POST",
                                    complete: function (e) {
                                        if (e.status === 200) {
                                            UIkit.notify("Амжилттай хадгаллаа.", {
                                                status: 'success',
                                                pos: 'bottom-center'
                                            });
                                        }
                                        else if (e.status === 409) {
                                            UIkit.notify("Код давхцаж байна.", {
                                                status: 'danger',
                                                pos: 'bottom-center'
                                            });
                                        }
                                        else if (e.status === 500) {
                                            UIkit.notify("Амжилтгүй.", {
                                                status: 'danger',
                                                pos: 'bottom-center'
                                            });
                                        }
                                        $("#detGrid").data("kendoGrid").dataSource.read();
                                    },
                                    beforeSend: function(req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
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
                                        id: {type: "number",nullable:true},
                                        grpCd: {type: "string", editable:false,defaultValue:dataItem.grpCd},
                                        comCdNm: {type: "string"},
                                        comCdEn: {type: "string"},
                                        parentId: {type: "number",defaultValue:dataItem.id},
                                        shortCd: {type: "string"},
                                        orderId: {type: "number"},
                                        useYn: {type: "boolean"}
                                    }
                                }
                            },
                            pageSize: 200,
                            serverPaging: true,
                            serverFiltering: true,
                            serverSorting: true,
                            filter: { field: "parentId", operator: "eq", value: dataItem.id }
                        },
                        scrollable: false,
                        sortable: true,
                        pageable: false,
                        toolbar: ["create","search"],
                        editable:"inline",
                        columns: [
                            {
                                title: '{{"Num" | translate}}',
                                headerAttributes: {"class": "columnHeader"},
                                template: "<span class='row-number' style='text-align: center; float: left; width: 100%;'></span>",
                                width: "60px"
                            },
                            {
                                field: "comCdNm",
                                title: '{{"Cmn01" | translate}}',
                                headerAttributes: {style: "text-align: center;"}
                            },
                            {
                                field: "comCdEn",
                                title: '{{"Cmn02" | translate}}',
                                headerAttributes: {style: "text-align: center;"}
                            },
                            {
                                field: "shortCd",
                                title: '{{"Cmn04" | translate}}',
                                width: 200,
                                headerAttributes: {style: "text-align: center;"}
                            },
                            {
                                field: "orderId",
                                title: '{{"Cmn05" | translate}}',
                                filterable:false,
                                width: 100,
                                headerAttributes: {style: "text-align: center;"}
                            },
                            {field: "useYn",  width: 130, template:"#if(useYn===true){# <span class='columnCenter'>Y</span> #}else{#<span class='columnCenter uk-text-danger'>N</span> #}#",  title: '{{"Cmn06" | translate}}' },
                            {
                                command: [
                                    {name: "edit", text: {edit: " ", update: " ", cancel: " "}},
                                    {name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn"}
                                ], title: "&nbsp;", width: 100
                            }
                        ],
                        dataBound: function () {
                            var rows = this.items();
                            $(rows).each(function () {
                                var index = $(this).index() + 1
                                    + ($(".k-grid").data("kendoGrid").dataSource.pageSize() * ($(".k-grid").data("kendoGrid").dataSource.page() - 1));
                                var rowLabel = $(this).find(".row-number");
                                $(rowLabel).html(index);
                            });
                        }
                    };
                };
            }
        ]
    );
