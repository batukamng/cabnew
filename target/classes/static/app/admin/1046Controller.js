angular
    .module('altairApp')
    .controller(
        '1046Ctrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$timeout',
            '__env',
            'fileUpload',
            '$translate',
            'division',
            'repTp',
            function ($rootScope, $state, $scope, $timeout, __env, fileUpload,$translate, division, repTp) {

                $scope.mainGrid = {
                    dataSource: {
                        transport: {
                            read: {
                                url: function (e) {
                                    if(localStorage.getItem("buttonData").includes("read") && JSON.parse(localStorage.getItem('menuData')).link===$state.current.name){
                                        return __env.apiUrl() + "/api/reportYear/list";
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
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                }
                            },
                            create: {
                                url: __env.apiUrl() + "/api/reportYear/create",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                },
                                complete: function (e) {
                                    $("#mainGrid").data("kendoGrid").dataSource.read();
                                }
                            },
                            update: {
                                url: __env.apiUrl() + "/api/reportYear/update",
                                contentType: "application/json; charset=UTF-8",
                                type: "PUT",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                },
                                complete: function (e) {
                                    $("#mainGrid").data("kendoGrid").dataSource.read();
                                }
                            },
                            destroy: {
                                url: __env.apiUrl() + "/api/reportYear/delete",
                                contentType: "application/json; charset=UTF-8",
                                type: "DELETE",
                                beforeSend: function (req) {
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
                                    id: {editable: false, nullable: true},
                                    type: {type: "number", validation: {required: true}},
                                    year: {type: "text", validation: {required: true}},
                                    divisionId: {type: "number", validation: {required: true}},
                                    useYn: {type: "boolean"}
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
                    resizable: true,
                    pageable: {
                        pageSizes: ['All',20,50],
                        refresh: true,
                        buttonCount: 5,
                        message: {
                            empty: 'No Data',
                            allPages:'All'
                        }
                    },
                    columns: [
                        {
                            title: '{{"Num" | translate}}',
                            headerAttributes: {"class": "columnHeader"},
                            template: "<span class='row-number'></span>",
                            width: "50px"
                        },
                        {field: "type", headerAttributes: {"class": "columnHeader"}, values:repTp,title:"Төрөл"/*'{{"Org name" | translate}}'*/},
                        {field: "year",headerAttributes: {"class": "columnHeader"}, title: "Он"/*'{{"Regnum" | translate}}'*/},
                        {field: "divisionId",headerAttributes: {"class": "columnHeader"},values: division,title: "Хэлтэс" /*'{{"Phone" | translate}}'*/},
                        //{field: "useYn", headerAttributes: {"class": "columnHeader"},title: "Идвэхтэй эсэх" /*'{{"Web" | translate}}'*/},
                        {
                            field: "useYn",
                            headerAttributes: {"class": "columnHeader"},
                            template: "#if(useYn){# <span class='columnCenter'>Y</span> #}else{#<span class='columnCenter uk-text-danger'>N</span> #}#",
                            title: "Ашиглах эсэх" /*'{{"Use" | translate}}'*/,
                            width: 130
                        }
                    ],
                    dataBound: function () {
                        var rows = this.items();
                        $(rows).each(function () {
                            var index = $(this).index() + 1
                                + ($("#mainGrid").data("kendoGrid").dataSource.pageSize() * ($("#mainGrid").data("kendoGrid").dataSource.page() - 1));
                            var rowLabel = $(this).find(".row-number");
                            $(rowLabel).html(index);
                        });
                    },
                    editable: "inline",
                    height: function () {
                        return $(window).height() - 110;
                    }
                };

                $scope.orgEditor = function(container, options) {
                    var editor = $('<select name="spcType" id="sel" required kendo-drop-down-list validationMessage="Сонгоно уу!" data-bind="value:' + options.field + '" k-options="orgOptions" ></select')
                        .appendTo(container);
                };

                $scope.orgDataSource = {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: __env.apiUrl() + "/api/reportYear/select",
                            contentType: "application/json; charset=UTF-8",
                            data: {},
                            type: "POST",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                            }
                        },
                    }
                };
                $scope.orgOptions = {
                    dataSource: $scope.orgDataSource,
                    filter: "contains",
                    minLength: 3,
                    dataTextField: "nameMon",
                    dataValueField: "id",
                };



                $scope.subGridOptions = function(dataItem) {
                    return {
                        dataSource: {
                            transport: {
                                read: {
                                    url: function (e) {
                                        if (localStorage.getItem("buttonData").includes("read") && JSON.parse(localStorage.getItem('menuData')).url === $state.current.name) {
                                            return __env.apiUrl() + "/api/reportYear/listDetail";
                                        } else {
                                            localStorage.removeItem('currentUser');
                                            localStorage.removeItem('menuList');
                                            localStorage.removeItem('menuData');
                                            $state.go('login');
                                        }
                                    },
                                    contentType: "application/json; charset=UTF-8",
                                    data: {
                                        filter: {
                                            logic: "and",
                                            filters: [{field: "repYearId", operator: "eq", value: dataItem.id}]
                                        }
                                    },
                                    type: "POST",
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                    }
                                },
                                create: {
                                    url: __env.apiUrl() + "/api/reportYear/createDetail",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "POST",
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                    },
                                    complete: function (e) {
                                        $("#subGrid").data("kendoGrid").dataSource.read();
                                    }
                                },
                                update: {
                                    url: __env.apiUrl() + "/api/reportYear/updateDetail",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "PUT",
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                    },
                                    complete: function (e) {
                                        $("#subGrid").data("kendoGrid").dataSource.read();
                                    }
                                },
                                destroy: {
                                    url: __env.apiUrl() + "/api/reportYear/deleteDetail",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "DELETE",
                                    beforeSend: function (req) {
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
                                        id: {editable: false, nullable: true},
                                        orgId: {type: "number", validation: {required: true}},
                                        reason: {type: "string", validation: {required: true}},
                                        repYearId: {type: "number" ,defaultValue:dataItem.id},
                                        regDtm: {type: "date", editable: false},
                                        useYn: {type: "boolean"}
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
                        resizable: true,
                        pageable: false,
                            /*{
                            pageSizes: ['All', 20, 50],
                            refresh: true,
                            buttonCount: 5,
                            message: {
                                empty: 'No Data',
                                allPages: 'All'
                            }
                        },*/
                        toolbar: ["create","search"],
                        columns: [
                            {
                                title: '{{"Num" | translate}}',
                                headerAttributes: {"class": "columnHeader"},
                                template: "<span class='row-number'></span>",
                                width: "50px"
                            },
                            {
                                field: "orgId",
                                editable: isEditable,
                                headerAttributes: {"class": "columnHeader"},
                                editor:$scope.orgEditor, template: kendo.template($("#orgNm").html()),
                                title: "Нэр"/*'{{"Org name" | translate}}'*/
                            },
                            {
                                field: "reason",
                                headerAttributes: {"class": "columnHeader"},
                                title: "Тайлбар"/*'{{"Regnum" | translate}}'*/
                            },
                            {
                                field: "regDtm",
                                headerAttributes: {"class": "columnHeader"},
                                format: "{0:yyyy/MM/dd hh:mm:ss }",
                                //template: "#if(useYn){# <span class='columnCenter'>Y</span> #}else{#<span class='columnCenter uk-text-danger'>N</span> #}#",
                                title: "огноо" /*'{{"Use" | translate}}'*/,
                                width: 130
                            },
                            {
                                field: "useYn",
                                headerAttributes: {"class": "columnHeader"},
                                template: "#if(useYn){# <span class='columnCenter'>Y</span> #}else{#<span class='columnCenter uk-text-danger'>N</span> #}#",
                                title: "Ашиглах эсэх" /*'{{"Use" | translate}}'*/,
                                width: 130
                            },

                            {
                                command: [
                                    {name: "edit", text: {edit: " ", update: " ", cancel: " "}},
                                    {name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn"}
                                ], title: "&nbsp;", width: 110
                            }
                        ],
                        dataBound: function () {
                            var rows = this.items();
                            $(rows).each(function () {
                                var index = $(this).index() + 1
                                    + ($("#subGrid").data("kendoGrid").dataSource.pageSize() * ($("#subGrid").data("kendoGrid").dataSource.page() - 1));
                                var rowLabel = $(this).find(".row-number");
                                $(rowLabel).html(index);
                            });
                        },
                        editable: "inline",
                    };
                };

                function isEditable(e){
                    return e.id === null;
                }
                if(JSON.parse(localStorage.getItem('privilege'))!=null){
                    var privileges=JSON.parse(localStorage.getItem('privilege'));
                    angular.forEach(privileges, function(value, key) {
                        if(value.name==='READ'){
                            $scope.mainGrid.toolbar = ["excel","search"];
                        }
                        if(value.name==='WRITE'){
                            $scope.mainGrid.toolbar = ["create","search"];
                        }
                        if(value.name==='UPDATE'){
                            $scope.mainGrid.columns.push({
                                command: [
                                    {name: "edit", text: {edit: " ", update: " ", cancel: " "}},
                                    {name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn"},
                                ], title: "&nbsp;", width: 100
                            });
                        }
                    });
                }

            }
        ]
    );
