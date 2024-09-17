angular
    .module('altairApp')
    .controller(
        '1028Ctrl',
        [
            '$rootScope',
            '$state',
            'Upload',
            '$scope',
            'mainService',
            '$timeout',
            'commonDataSource',
            '__env',
            function ($rootScope, $state, Upload, $scope,mainService, $timeout,commonDataSource, __env) {
                $scope.treeListOptions = {
                    dataSource: {
                        transport: {
                            read: {
                                url: __env.apiUrl() + '/api/nms/contract/milestone/list/' + contractView.id,
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                data: {sort: [{field: "id", dir: "desc"}]},
                                beforeSend: function (req) {
                                    req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
                                },
                            },
                            update: {
                                url: __env.apiUrl() + "/api/nms/contract/milestone",
                                contentType: "application/json; charset=UTF-8",
                                type: "PUT",
                                beforeSend: function (req) {
                                    req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
                                }
                            },
                            destroy: {
                                url: __env.apiUrl() + "/api/nms/contract/milestone",
                                contentType: "application/json; charset=UTF-8",
                                beforeSend: function (req) {
                                    req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
                                },
                                type: "DELETE"
                            },
                            create: {
                                url: __env.apiUrl() + "/api/nms/contract/milestone",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                beforeSend: function (req) {
                                    req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
                                },
                            },
                            parameterMap: function (options) {
                                return JSON.stringify(options);
                            },
                        },
                        schema: {
                            model: {
                                id: "id",
                                parentId: "parentId",
                                fields: {
                                    id: {type: "number", editable: false, nullable: false},
                                    parentId: {nullable: true, type: "number"},
                                    workName: {type: "string", validation: {required: true}},
                                    amount: {type: "number", validation: {required: true}},
                                    strDt: {type: "string", validation: {required: true}},
                                    endDt: {type: "string", validation: {required: true}},
                                    duration: {type: "string", validation: {required: true}},
                                    contractId: {type: "number", defaultValue: contractView.id},
                                },
                                expanded: true
                            }
                        }
                    },
                    sortable: true,
                    toolbar: ["create"],
                    editable: {
                        move: {
                            reorderable: true
                        }
                    },
                    height: 540,
                    columns: [
                        {field: "workName", title: "Ажлын нэр, төрөл"},
                        {
                            field: "amount",
                            template: "<span ng-bind='dataItem.amount | number :2'></span>",
                            title: "Зардлын дүн",
                            width: 150,
                            attributes: {style: "text-align: right;"}
                        },
                        {field: "strDt", title: "Эхлэх", width: 150},
                        {field: "endDt", title: "Дуусах", width: 150},
                        {field: "duration", title: "Хүн өдөр", width: 150},
                        {command: [{name: "createchild", text: "нэмэх"}, "edit", "destroy"], width: 300},

                    ],
                };
                $scope.parentEditor = function (container, options) {
                    $scope.parentDataSource = commonDataSource.urlDataSource("/api/program/list",JSON.stringify({"custom":"where id!="+options.model.id+" and parentId is null"}));
                    var editor = $('<input kendo-drop-down-list  k-data-text-field="\'name\'" k-data-value-field="\'id\'" k-data-source="parentDataSource" data-bind="value:' + options.field + '"/>')
                        .appendTo(container);
                };
                $scope.filterDataSource = commonDataSource.urlDataSource("/api/program/list",JSON.stringify({"custom":"where parentId is null"}));
                $scope.mainGrid = {
                    dataSource: {
                        transport: {
                            read: {
                                url: function (e) {
                                    if(localStorage.getItem("buttonData").includes("read") && JSON.parse(localStorage.getItem('menuData')).link===$state.current.name){
                                        return __env.apiUrl() + "/api/program/list";
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
                                data: {"custom":"where useYn=true" ,"sort": [{field: 'id', dir: 'desc'}]},
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                }
                            },
                            create: {
                                url: __env.apiUrl() + "/api/program/create",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                },
                                complete: function (e) {
                                    $(".k-grid").data("kendoGrid").dataSource.read();
                                }
                            },
                            update: {
                                url: __env.apiUrl() + "/api/program/update",
                                contentType: "application/json; charset=UTF-8",
                                type: "PUT",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                },
                                complete: function (e) {
                                    $(".k-grid").data("kendoGrid").dataSource.read();
                                }
                            },
                            destroy: {
                                url: __env.apiUrl() + "/api/program/delete",
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
                                    name: {type: "string", validation: {required: true}},
                                    proUrl: {type: "string"},
                                    useYn: {type: "boolean", defaultValue:true},
                                    menuUseAt: {type: "boolean", defaultValue:true},
                                    parentId: {type: "number", defaultValue:0},
                                    program:{defaultValue:null}
                                }
                            }
                        },
                        pageSize: 20,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    },
                    filterable: {
                        extra: false,
                        operators: {
                            string: {
                                startswith: "Эхлэх утга",
                                eq: "Тэнцүү",
                                neq: "Тэнцүү биш"
                            }
                        }
                    },
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
                            title: "#",
                            headerAttributes: {"class": "columnCenter"},
                            attributes: {"style": "text-align: center;"},
                            template: "#= ++record #",
                            width: 50
                        },
                        {field: "name", title: "Нэр"},
                        {field: "proUrl", title: "Хаяг (URL)"},
                        {
                            field: "parentId",
                            title: "Төрөл",
                            dataTextField: "name", dataValueField: "id",dataSource:$scope.filterDataSource,
                            editor:$scope.parentEditor,
                            template: "#if(program!=null){# #=program.name# #}#",
                            width:150,
                            headerAttributes: {style: "text-align: center; font-weight: bold"}
                        },
                        {
                            field: "menuUseAt", headerAttributes: {style: "text-align: center; font-weight: bold"},
                            template: "#if(menuUseAt){# <span class='columnCenter'>Y</span> #}else{#<span class='columnCenter uk-text-danger'>N</span> #}#",
                            title: "Ашиглах эсэх",
                            width: 130
                        }
                    ],
                    dataBinding: function() {
                        record = (this.dataSource.page() -1) * this.dataSource.pageSize();
                    },
                    editable: "inline",
                    height: function () {
                        return $(window).height() - 110;
                    }
                };

                $scope.mainGrid2 = {
                    dataSource: {
                        transport: {
                            read: {
                                url: function (e) {
                                    if(localStorage.getItem("buttonData").includes("read") && JSON.parse(localStorage.getItem('menuData')).link===$state.current.name){
                                        return __env.apiUrl() + "/api/program/list";
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
                                url: __env.apiUrl() + "/api/program/create",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                },
                                complete: function () {
                                    alert();
                                    $(".k-grid").data("kendoTreeList").dataSource.read();
                                }
                            },
                            update: {
                                url: __env.apiUrl() + "/api/program/update",
                                contentType: "application/json; charset=UTF-8",
                                type: "PUT",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                },
                                complete: function (e) {
                                    $(".k-grid").data("kendoTreeList").dataSource.read();
                                }
                            },
                            destroy: {
                                url: __env.apiUrl() + "/api/program/delete",
                                contentType: "application/json; charset=UTF-8",
                                type: "DELETE",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                }
                            },
                            parameterMap: function(options, operation) {
                                /* if (operation !== "read" && options.models) {
                                     return {models: JSON.stringify(options.models)};
                                 }
                                 else{
                                     return JSON.stringify(options);
                                 }*/
                                return JSON.stringify(options);
                            }
                        },
                        /* batch: true,*/
                        schema: {
                            data: "data",
                            total: "total",
                            model: {
                                id: "id",
                                parentId: "parentId",
                                expanded: true,
                                fields: {
                                    id: {type: "number",editable: false, nullable: true},
                                    name: {type: "string", validation: {required: true}},
                                    proUrl: {type: "string"},
                                    useYn: {type: "boolean", defaultValue:true},
                                    menuUseAt: {type: "boolean", defaultValue:true},
                                    program:{defaultValue:null},
                                    parentId: {type: "number", nullable: true,defaultValue:0},
                                }
                            }
                        },
                        pageSize: 20,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    },
                    columns: [
                        {field: "name", title: "Нэр"},
                        {field: "proUrl", title: "Хаяг (URL)"},
                        /*  {
                              field: "parentId",
                              title: "Төрөл",
                              dataTextField: "name", dataValueField: "id",dataSource:$scope.filterDataSource,
                              editor:$scope.parentEditor,
                              template: "#if(program!=null){# #=program.name# #}#",
                              width:150,
                              headerAttributes: {style: "text-align: center; font-weight: bold"}
                          },*/
                        {
                            field: "menuUseAt", headerAttributes: {style: "text-align: center; font-weight: bold"},
                            template: "#if(menuUseAt){# <span class='columnCenter'>Y</span> #}else{#<span class='columnCenter uk-text-danger'>N</span> #}#",
                            title: "Ашиглах эсэх",
                            width: 130
                        }
                    ],
                    sortable: true,
                    editable: true,
                    height: function () {
                        return $(window).height() - 110;
                    },
                    pageable: {
                        pageSize: 15,
                        pageSizes: true
                    }
                };


                if(localStorage.getItem('buttonData').includes("R")){
                    $scope.mainGrid.toolbar = ["excel","search"];
                }
                if(localStorage.getItem('buttonData').includes("C")){
                    $scope.mainGrid.toolbar = [{template:"<button class=\"k-button k-button-icontext k-grid-add\"><span class=\"k-icon k-i-plus\"></span>Нэмэх</button>"},"search"];
                }
                if(localStorage.getItem('buttonData').includes("U")){
                    $scope.mainGrid.columns.push({
                        command: [
                            {name: "edit", text: {edit: " ", update: " ", cancel: " "}},
                            {name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn"}
                        ], title: "&nbsp;", width: 100
                    });
                }

            }
        ]
    );
