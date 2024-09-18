angular
    .module('altairApp')
    .controller(
        '1038Ctrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$timeout',
            'mainService',
            '__env',
            function ($rootScope, $state, $scope, $timeout,mainService,__env) {

                $scope.gridDataSource = {
                    transport: {
                        read: {
                            url: function (e) {
                                if(sessionStorage.getItem("buttonData").includes("read") && JSON.parse(sessionStorage.getItem('menuData')).link===$state.current.name){
                                    return __env.apiUrl() + "/api/lang/list";
                                }
                                else{
                                    sessionStorage.removeItem('currentUser');
                                    sessionStorage.removeItem('menuList');
                                    sessionStorage.removeItem('menuData');
                                    $state.go('login');
                                }
                            },
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            data:{"custom":"where useYn=true",sort: [{field: "id", dir: "desc"}]},
                            beforeSend: function(req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            }
                        },
                        update: {
                            url: __env.apiUrl() + "/api/lang/update",
                            contentType: "application/json; charset=UTF-8",
                            type: "PUT",
                            beforeSend: function(req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
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
                            url: __env.apiUrl() + "/api/lang/delete",
                            contentType: "application/json; charset=UTF-8",
                            type: "DELETE",
                            beforeSend: function(req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            }
                        },
                        create: {
                            url: __env.apiUrl() + "/api/lang/create",
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
                            },
                            beforeSend: function(req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
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
                                name: {type: "string"},
                                icon: {type: "string"},
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
                            title: "Д/д",
                            headerAttributes: {"class": "columnHeader"},
                            template: "<span class='row-number'></span>",
                            width: "50px"
                        },
                        {field: "name", headerAttributes: {"class": "columnHeader"},title: "Нэр"},
                        {field: "abbr", headerAttributes: {"class": "columnHeader"},title: "Товчлол"},
                        {field: "icon", headerAttributes: {"class": "columnHeader"},title: "Икон"},
                        {
                            field: "useYn",
                            template: "#if(useYn){# <span class='columnCenter'>Y</span> #}else{#<span class='columnCenter uk-text-danger'>N</span> #}#",
                            title: "Ашиглах эсэх",
                            width: 130
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
                    },
                    editable:"inline",

                    height: function () {
                        return $(window).height() - 110;
                    }
                };

                if(sessionStorage.getItem('buttonData').includes("R")){
                    $scope.mainGrid.toolbar = ["excel","search"];
                }
                if(sessionStorage.getItem('buttonData').includes("C")){
                    $scope.mainGrid.toolbar = [{template:"<button class=\"k-button k-button-icontext k-grid-add\"><span class=\"k-icon k-i-plus\"></span>Нэмэх</button>"},"search"];
                }
                if(sessionStorage.getItem('buttonData').includes("U")){
                    $scope.mainGrid.columns.push({
                        command: [
                            {name: "edit", text: {edit: " ", update: " ", cancel: " "}},
                            {name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn"}
                        ], title: "&nbsp;", width: 100
                    });
                }

                $scope.submitCopy = function (event) {
                    event.preventDefault();
                    if ($scope.validator.validate()) {
                        mainService.withResponse('get', __env.apiUrl() + '/api/lang/copy/'+$scope.dataItem.id+'/'+$scope.langId).then(function (response) {
                            if(response.status===200){
                                sweet.show('Анхаар!', 'Амжилттай!!!', 'success');
                            } else {
                                sweet.show('Анхаар!', 'Алдаа үүслээ!!!', 'error');
                            }
                            UIkit.modal("#modal_copy").hide();
                            $("#detGrid").data("kendoGrid").dataSource.read();
                        });
                    }
                };

                $scope.copy= function(){
                    $scope.ddlDataSource = new kendo.data.HierarchicalDataSource({
                        transport: {
                            read: {
                                url: __env.apiUrl() + "/api/lang/list",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                data: {
                                     "custom":"where id!="+$scope.dataItem.id+""
                                },
                                sort: [{field: "id", dir: "desc"}],
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                }
                            },
                            parameterMap: function (options) {
                                return JSON.stringify(options);
                            }
                        },
                        schema: {
                            data: "data",
                            total: "total"
                        },
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    });

                    $scope.customOptions = {
                        dataSource: $scope.ddlDataSource,
                        dataTextField: "name",
                        dataValueField: "id",
                        optionLabel: "Select language..."
                    };

                    UIkit.modal("#modal_copy", {modal: false, keyboard: false, bgclose: false, center: false}).show();
                };

                $scope.detailGridOptions = function(dataItem) {
                    $scope.dataItem=dataItem;
                    return {
                        dataSource: {
                            transport: {
                                read: {
                                    url: __env.apiUrl() +"/api/label/list",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "POST",
                                    data:{
                                        sort: [{field: "id", dir: "desc"}]
                                    },
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                    }

                                },
                                update: {
                                    url: __env.apiUrl() +"/api/label/update",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "PUT",
                                    complete: function (e) {
                                        $("#detGrid").data("kendoGrid").dataSource.read();
                                    },
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                    }
                                },
                                destroy: {
                                    url: __env.apiUrl() +"/api/label/delete",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "DELETE",
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                    }
                                },
                                create: {
                                    url: __env.apiUrl() +"/api/label/create",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "POST",
                                    complete: function (e) {
                                        $("#detGrid").data("kendoGrid").dataSource.read();
                                    },
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
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
                                        labelId: {type: "string", validation: {required: true}},
                                        labelMg: {type: "string", validation: {required: true}},
                                        useYn: {type: "boolean"},
                                        lang: {type: "string", defaultValue:dataItem.name},
                                        langId: {type: "number", defaultValue:dataItem.id}
                                    }
                                }
                            },
                            pageSize: 50,
                            serverPaging: true,
                            serverFiltering: true,
                            serverSorting: true,
                            filter: { field: "langId", operator: "eq", value: dataItem.id }
                        },
                        scrollable: false,
                        sortable: true,
                        pageable: true,
                        toolbar: ["create",{template: $("#Radd").html()},"search"],
                        editable:"inline",
                        columns: [
                            {
                                title: "Д/д",
                                headerAttributes: {"class": "columnHeader"},
                                template: "<span class='row-number'></span>",
                                width: "50px"
                            },
                            {field: "labelId", title: "Түлхүүр үг"},
                            {field: "labelMg", title: "Утга"},
                            {
                                field: "useYn",
                                template: "#if(useYn){# <span class='columnCenter'>Y</span> #}else{#<span class='columnCenter uk-text-danger'>N</span> #}#",
                                title: "Ашиглах эсэх",
                                width: 130
                            },
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
            }]
    );
