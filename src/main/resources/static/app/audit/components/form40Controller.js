angular
    .module('altairApp')
    .controller(
        'form40Ctrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$filter',
            '$timeout',
            'mainService',
            'Upload',
            'commonDataSource',
            'sweet',
            '__env',
            function ($rootScope, $state, $scope, $filter, $timeout, mainService, Upload, commonDataSource, sweet, __env) {
                $scope.user = JSON.parse(localStorage.getItem('currentUser')).user;
                $scope.app = $rootScope.app;

                $scope.$on("formChanged40", function (event, args, data) {
                    $timeout(function () {
                        $scope.initForm(data, args);
                    })
                });

                $scope.dataSource32 = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: __env.apiUrl() + "/api/nms/resource/ct1a/list",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            beforeSend: function (req) {
                                if (JSON.parse(localStorage.getItem('currentUser')) != null) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                }
                            }
                        },
                        parameterMap: function (options, operation) {
                            return JSON.stringify(options);
                        }
                    },
                    schema: {
                        data: "data",
                        total: "total",
                        aggregates: "aggregates",
                        model: {
                            id: "id",
                            fields: {
                                id: {type: "number", nullable: true},
                                planId: {type: "number", defaultValue: $scope.appId},
                                data3: {type: "number"},
                                data4: {type: "number"},
                                dataSum3: {type: "number"},
                                dataSum4: {type: "number"},
                                dataDiff3: {type: "number"},
                                dataDiff4: {type: "number"},
                            }
                        }

                    },
                    aggregate: [
                        { field: "data3", aggregate: "sum" },
                        { field: "data4", aggregate: "sum" },
                    ],
                    pageSize: 1000,
                    serverPaging: true,
                    serverSorting: true,
                    serverAggregates: true,
                    serverFiltering: true
                });
                $scope.mainGrid32 = {
                    sortable: true,
                    resizable: true,
                    reorderable: true,
                    pageable: false,
                    filterable: false,
                    editable: false,
                    columns: [
                        {
                            field: "data1",
                            title: "Код",
                            width: 80,
                            template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data1\"></span>",
                            attributes: {"style": "text-align: left;"},
                            headerAttributes: {style: "text-align: center; justify-content: center"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                        {
                            field: "data2",
                            title: "Үзүүлэлт",
                            template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data2\"></span>",
                            attributes: {"style": "text-align: left;"},
                            headerAttributes: {"style": "white-space: normal; vertical-align: middle;text-align: center;"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                        {
                            title: "Тайлан",
                            headerAttributes: {style: "text-align: center; justify-content: center"},
                            columns:[
                                {
                                    field: "data3",
                                    width: 150,
                                    title: "Эхний үлдэгдэл",
                                    template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data3 | number:1\"></span>",
                                    aggregates: ["sum"],
                                    footerTemplate: "<span style='display: block;text-align: right;'> #=kendo.toString(sum, \"n0\")#</span>",
                                    attributes: {"style": "text-align: right;"},
                                    headerAttributes: {style: "text-align: center; justify-content: center"},
                                    filterable: {cell: {operator: "contains", showOperators: false}}
                                },
                                {
                                    field: "data4",
                                    width: 150,
                                    title: "Эцсийн үлдэгдэл",
                                    template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data4 | number:1\"></span>",
                                    aggregates: ["sum"],
                                    footerTemplate: "<span style='display: block;text-align: right;'> #=kendo.toString(sum, \"n0\")#</span>",
                                    attributes: {"style": "text-align: right;"},
                                    headerAttributes: {style: "text-align: center; justify-content: center"},
                                    filterable: {cell: {operator: "contains", showOperators: false}}
                                },
                            ]
                        },
                        /*  {
                              title: "Систем",
                              columns:[
                                  {
                                      field: "dataSum3",
                                      width: 150,
                                      title: "Эхний үлдэгдэл",
                                      template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.dataSum3 | number:1\"></span>",
                                      aggregates: ["sum"],
                                      footerTemplate: "<span style='display: block;text-align: right;'> #=kendo.toString(sum, \"n0\")#</span>",
                                      attributes: {"style": "text-align: right;"},
                                      headerAttributes: {style: "text-align: center; justify-content: center"},
                                      filterable: {cell: {operator: "contains", showOperators: false}}
                                  },
                                  {
                                      field: "dataSum4",
                                      width: 150,
                                      title: "Эцсийн үлдэгдэл",
                                      template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.dataSum4 | number:1\"></span>",
                                      aggregates: ["sum"],
                                      footerTemplate: "<span style='display: block;text-align: right;'> #=kendo.toString(sum, \"n0\")#</span>",
                                      attributes: {"style": "text-align: right;"},
                                      headerAttributes: {style: "text-align: center; justify-content: center"},
                                      filterable: {cell: {operator: "contains", showOperators: false}}
                                  },
                              ]
                          },
                          {
                              title:"Зөрүү",
                              columns:[
                                  {
                                      field: "dataDiff3",
                                      width: 150,
                                      title: "Эхний үлдэгдэл",
                                      template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.dataDiff3 | number:1\"></span>",
                                      aggregates: ["sum"],
                                      footerTemplate: "<span style='display: block;text-align: right;'> #=kendo.toString(sum, \"n0\")#</span>",
                                      attributes: {"style": "text-align: right;"},
                                      headerAttributes: {style: "text-align: center; justify-content: center"},
                                      filterable: {cell: {operator: "contains", showOperators: false}}
                                  },
                                  {
                                      field: "dataDiff4",
                                      width: 150,
                                      title: "Эцсийн үлдэгдэл",
                                      template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.dataDiff4 | number:1\"></span>",
                                      aggregates: ["sum"],
                                      footerTemplate: "<span style='display: block;text-align: right;'> #=kendo.toString(sum, \"n0\")#</span>",
                                      attributes: {"style": "text-align: right;"},
                                      headerAttributes: {style: "text-align: center; justify-content: center"},
                                      filterable: {cell: {operator: "contains", showOperators: false}}
                                  }
                              ]
                          }*/
                    ],
                    dataBinding: function () {
                        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                    },
                    dataBound: function (e) {
                        var grid = this;
                        var rows = grid.tbody.children();
                        for (var j = 0; j < rows.length; j++) {
                            var row = $(rows[j]);
                            var dataItem = e.sender.dataItem(row);
                            if (dataItem.get("childCnt") != null) {
                                if (dataItem.get("childCnt") >0) {
                                    row[0].cells[1].style.fontWeight = "500 !important";
                                }
                            }
                            var dataDiff3 = dataItem.get("dataDiff3");
                            if (dataDiff3 != null) {
                                if (dataDiff3 !== 0) {
                                    row[0].cells[6].style.backgroundColor = "#FB7185";
                                }
                            }
                            var dataDiff4 = dataItem.get("dataDiff4");
                            if (dataDiff4 != null) {
                                if (dataDiff4 !== 0) {
                                    row[0].cells[7].style.backgroundColor = "#FB7185";
                                }
                            }
                            /* row[0].cells[4].style.backgroundColor = "#e0e7ff";
                             row[0].cells[5].style.backgroundColor = "#e0e7ff";
                             row[0].cells[2].style.backgroundColor = "#fff7ed";
                             row[0].cells[3].style.backgroundColor = "#fff7ed";*/

                        }
                    },
                    height: function () {
                        return $(window).height() - 132;
                    },
                };
                $scope.dataSource33 = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: __env.apiUrl() + "/api/nms/resource/ct2a/list",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            beforeSend: function (req) {
                                if (JSON.parse(localStorage.getItem('currentUser')) != null) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                }
                            }
                        },
                        parameterMap: function (options, operation) {
                            return JSON.stringify(options);
                        }
                    },
                    schema: {
                        data: "data",
                        total: "total",
                        aggregates: "aggregates",
                        model: {
                            id: "id",
                            fields: {
                                id: {type: "number", nullable: true},
                                planId: {type: "number", defaultValue: $scope.appId},
                                data3: {type: "number"},
                                data4: {type: "number"},
                                dataSum3: {type: "number"},
                                dataSum4: {type: "number"},
                                dataDiff3: {type: "number"},
                                dataDiff4: {type: "number"},
                            }
                        }

                    },
                    aggregate: [
                        { field: "data3", aggregate: "sum" },
                        { field: "data4", aggregate: "sum" },
                        /*  { field: "dataSum3", aggregate: "sum" },
                          { field: "dataSum4", aggregate: "sum" },
                          { field: "dataDiff3", aggregate: "sum" },
                          { field: "dataDiff4", aggregate: "sum" }*/
                    ],
                    pageSize: 1000,
                    serverPaging: true,
                    serverSorting: true,
                    serverAggregates: true,
                    serverFiltering: true
                });
                $scope.mainGrid33 = {
                    sortable: true,
                    resizable: true,
                    reorderable: true,
                    pageable: false,
                    filterable: false,
                    editable: false,
                    columns: [
                        {
                            field: "data1",
                            title: "Код",
                            width: 80,
                            template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data1\"></span>",
                            attributes: {"style": "text-align: left;"},
                            headerAttributes: {style: "text-align: center; justify-content: center"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                        {
                            field: "data2",
                            title: "Үзүүлэлт",
                            template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data2\"></span>",
                            attributes: {"style": "text-align: left;"},
                            headerAttributes: {"style": "white-space: normal; vertical-align: middle;text-align: center;"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                        {
                            title: "Тайлан",
                            headerAttributes: {style: "text-align: center; justify-content: center"},
                            columns:[
                                {
                                    field: "data3",
                                    width: 150,
                                    title: "Эхний үлдэгдэл",
                                    template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data3 | number:1\"></span>",
                                    aggregates: ["sum"],
                                    footerTemplate: "<span style='display: block;text-align: right;'> #=kendo.toString(sum, \"n0\")#</span>",
                                    attributes: {"style": "text-align: right;"},
                                    headerAttributes: {style: "text-align: center; justify-content: center"},
                                    filterable: {cell: {operator: "contains", showOperators: false}}
                                },
                                {
                                    field: "data4",
                                    width: 150,
                                    title: "Эцсийн үлдэгдэл",
                                    template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data4 | number:1\"></span>",
                                    aggregates: ["sum"],
                                    footerTemplate: "<span style='display: block;text-align: right;'> #=kendo.toString(sum, \"n0\")#</span>",
                                    attributes: {"style": "text-align: right;"},
                                    headerAttributes: {style: "text-align: center; justify-content: center"},
                                    filterable: {cell: {operator: "contains", showOperators: false}}
                                },
                            ]
                        },
                        /*    {
                                title: "Систем",
                                columns:[
                                    {
                                        field: "dataSum3",
                                        width: 150,
                                        title: "Эхний үлдэгдэл",
                                        template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.dataSum3 | number:1\"></span>",
                                        aggregates: ["sum"],
                                        footerTemplate: "<span style='display: block;text-align: right;'> #=kendo.toString(sum, \"n0\")#</span>",
                                        attributes: {"style": "text-align: right;"},
                                        headerAttributes: {style: "text-align: center; justify-content: center"},
                                        filterable: {cell: {operator: "contains", showOperators: false}}
                                    },
                                    {
                                        field: "dataSum4",
                                        width: 150,
                                        title: "Эцсийн үлдэгдэл",
                                        template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.dataSum4 | number:1\"></span>",
                                        aggregates: ["sum"],
                                        footerTemplate: "<span style='display: block;text-align: right;'> #=kendo.toString(sum, \"n0\")#</span>",
                                        attributes: {"style": "text-align: right;"},
                                        headerAttributes: {style: "text-align: center; justify-content: center"},
                                        filterable: {cell: {operator: "contains", showOperators: false}}
                                    },
                                ]
                            },
                            {
                                title:"Зөрүү",
                                columns:[
                                    {
                                        field: "dataDiff3",
                                        width: 150,
                                        title: "Эхний үлдэгдэл",
                                        template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.dataDiff3 | number:1\"></span>",
                                        aggregates: ["sum"],
                                        footerTemplate: "<span style='display: block;text-align: right;'> #=kendo.toString(sum, \"n0\")#</span>",
                                        attributes: {"style": "text-align: right;"},
                                        headerAttributes: {style: "text-align: center; justify-content: center"},
                                        filterable: {cell: {operator: "contains", showOperators: false}}
                                    },
                                    {
                                        field: "dataDiff4",
                                        width: 150,
                                        title: "Эцсийн үлдэгдэл",
                                        template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.dataDiff4 | number:1\"></span>",
                                        aggregates: ["sum"],
                                        footerTemplate: "<span style='display: block;text-align: right;'> #=kendo.toString(sum, \"n0\")#</span>",
                                        attributes: {"style": "text-align: right;"},
                                        headerAttributes: {style: "text-align: center; justify-content: center"},
                                        filterable: {cell: {operator: "contains", showOperators: false}}
                                    }
                                ]
                            }*/
                    ],
                    dataBinding: function () {
                        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                    },
                    dataBound: function (e) {
                        var grid = this;
                        var rows = grid.tbody.children();
                        for (var j = 0; j < rows.length; j++) {
                            var row = $(rows[j]);
                            var dataItem = e.sender.dataItem(row);
                            if (dataItem.get("childCnt") != null) {
                                if (dataItem.get("childCnt") >0) {
                                    row[0].cells[1].style.fontWeight = "500 !important";
                                }
                            }
                            var dataDiff3 = dataItem.get("dataDiff3");
                            if (dataDiff3 != null) {
                                if (dataDiff3 !== 0) {
                                    row[0].cells[6].style.backgroundColor = "#FB7185";
                                }
                            }
                            var dataDiff4 = dataItem.get("dataDiff4");
                            if (dataDiff4 != null) {
                                if (dataDiff4 !== 0) {
                                    row[0].cells[7].style.backgroundColor = "#FB7185";
                                }
                            }
                            /*   row[0].cells[4].style.backgroundColor = "#e0e7ff";
                               row[0].cells[5].style.backgroundColor = "#e0e7ff";
                               row[0].cells[2].style.backgroundColor = "#fff7ed";
                               row[0].cells[3].style.backgroundColor = "#fff7ed";*/

                        }
                    },
                    height: function () {
                        return $(window).height() - 132;
                    },
                };
                $scope.dataSource34 = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: __env.apiUrl() + "/api/nms/resource/ct3a/list",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            beforeSend: function (req) {
                                if (JSON.parse(localStorage.getItem('currentUser')) != null) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                }
                            }
                        },
                        parameterMap: function (options, operation) {
                            return JSON.stringify(options);
                        }
                    },
                    schema: {
                        data: "data",
                        total: "total",
                        aggregates: "aggregates",
                        model: {
                            id: "id",
                            fields: {
                                id: {type: "number", nullable: true},
                                planId: {type: "number", defaultValue: $scope.appId},
                                data3: {type: "number"},
                                data4: {type: "number"},
                                dataSum3: {type: "number"},
                                dataSum4: {type: "number"},
                                dataDiff3: {type: "number"},
                                dataDiff4: {type: "number"},
                            }
                        }

                    },
                    aggregate: [
                        { field: "data3", aggregate: "sum" },
                        { field: "data4", aggregate: "sum" },
                        /*    { field: "dataSum3", aggregate: "sum" },
                            { field: "dataSum4", aggregate: "sum" },
                            { field: "dataDiff3", aggregate: "sum" },
                            { field: "dataDiff4", aggregate: "sum" }*/
                    ],
                    pageSize: 1000,
                    serverPaging: true,
                    serverSorting: true,
                    serverAggregates: true,
                    serverFiltering: true
                });
                $scope.mainGrid34 = {
                    sortable: true,
                    resizable: true,
                    reorderable: true,
                    pageable: false,
                    filterable: false,
                    editable: false,
                    columns: [
                        {
                            field: "data1",
                            title: "Код",
                            width: 80,
                            template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data1\"></span>",
                            attributes: {"style": "text-align: left;"},
                            headerAttributes: {style: "text-align: center; justify-content: center"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                        {
                            field: "data2",
                            title: "Үзүүлэлт",
                            template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data2\"></span>",
                            attributes: {"style": "text-align: left;"},
                            headerAttributes: {"style": "white-space: normal; vertical-align: middle;text-align: center;"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                        {
                            title: "Тайлан",
                            headerAttributes: {style: "text-align: center; justify-content: center"},
                            columns:[
                                {
                                    field: "data3",
                                    width: 150,
                                    title: "Эхний үлдэгдэл",
                                    template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data3 | number:1\"></span>",
                                    aggregates: ["sum"],
                                    footerTemplate: "<span style='display: block;text-align: right;'> #=kendo.toString(sum, \"n0\")#</span>",
                                    attributes: {"style": "text-align: right;"},
                                    headerAttributes: {style: "text-align: center; justify-content: center"},
                                    filterable: {cell: {operator: "contains", showOperators: false}}
                                },
                                {
                                    field: "data4",
                                    width: 150,
                                    title: "Эцсийн үлдэгдэл",
                                    template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data4 | number:1\"></span>",
                                    aggregates: ["sum"],
                                    footerTemplate: "<span style='display: block;text-align: right;'> #=kendo.toString(sum, \"n0\")#</span>",
                                    attributes: {"style": "text-align: right;"},
                                    headerAttributes: {style: "text-align: center; justify-content: center"},
                                    filterable: {cell: {operator: "contains", showOperators: false}}
                                },
                            ]
                        },
                        /*   {
                               title: "Систем",
                               columns:[
                                   {
                                       field: "dataSum3",
                                       width: 150,
                                       title: "Эхний үлдэгдэл",
                                       template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.dataSum3 | number:1\"></span>",
                                       aggregates: ["sum"],
                                       footerTemplate: "<span style='display: block;text-align: right;'> #=kendo.toString(sum, \"n0\")#</span>",
                                       attributes: {"style": "text-align: right;"},
                                       headerAttributes: {style: "text-align: center; justify-content: center"},
                                       filterable: {cell: {operator: "contains", showOperators: false}}
                                   },
                                   {
                                       field: "dataSum4",
                                       width: 150,
                                       title: "Эцсийн үлдэгдэл",
                                       template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.dataSum4 | number:1\"></span>",
                                       aggregates: ["sum"],
                                       footerTemplate: "<span style='display: block;text-align: right;'> #=kendo.toString(sum, \"n0\")#</span>",
                                       attributes: {"style": "text-align: right;"},
                                       headerAttributes: {style: "text-align: center; justify-content: center"},
                                       filterable: {cell: {operator: "contains", showOperators: false}}
                                   },
                               ]
                           },
                           {
                               title:"Зөрүү",
                               columns:[
                                   {
                                       field: "dataDiff3",
                                       width: 150,
                                       title: "Эхний үлдэгдэл",
                                       template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.dataDiff3 | number:1\"></span>",
                                       aggregates: ["sum"],
                                       footerTemplate: "<span style='display: block;text-align: right;'> #=kendo.toString(sum, \"n0\")#</span>",
                                       attributes: {"style": "text-align: right;"},
                                       headerAttributes: {style: "text-align: center; justify-content: center"},
                                       filterable: {cell: {operator: "contains", showOperators: false}}
                                   },
                                   {
                                       field: "dataDiff4",
                                       width: 150,
                                       title: "Эцсийн үлдэгдэл",
                                       template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.dataDiff4 | number:1\"></span>",
                                       aggregates: ["sum"],
                                       footerTemplate: "<span style='display: block;text-align: right;'> #=kendo.toString(sum, \"n0\")#</span>",
                                       attributes: {"style": "text-align: right;"},
                                       headerAttributes: {style: "text-align: center; justify-content: center"},
                                       filterable: {cell: {operator: "contains", showOperators: false}}
                                   }
                               ]
                           }*/
                    ],
                    dataBinding: function () {
                        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                    },
                    dataBound: function (e) {
                        var grid = this;
                        var rows = grid.tbody.children();
                        for (var j = 0; j < rows.length; j++) {
                            var row = $(rows[j]);
                            var dataItem = e.sender.dataItem(row);
                            if (dataItem.get("childCnt") != null) {
                                if (dataItem.get("childCnt") >0) {
                                    row[0].cells[1].style.fontWeight = "500 !important";
                                }
                            }
                            var dataDiff3 = dataItem.get("dataDiff3");
                            if (dataDiff3 != null) {
                                if (dataDiff3 !== 0) {
                                    row[0].cells[6].style.backgroundColor = "#FB7185";
                                }
                            }
                            var dataDiff4 = dataItem.get("dataDiff4");
                            if (dataDiff4 != null) {
                                if (dataDiff4 !== 0) {
                                    row[0].cells[7].style.backgroundColor = "#FB7185";
                                }
                            }
                            /*  row[0].cells[4].style.backgroundColor = "#e0e7ff";
                              row[0].cells[5].style.backgroundColor = "#e0e7ff";
                              row[0].cells[2].style.backgroundColor = "#fff7ed";
                              row[0].cells[3].style.backgroundColor = "#fff7ed";*/

                        }
                    },
                    height: function () {
                        return $(window).height() - 132;
                    },
                };
                $scope.dataSource35 = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: __env.apiUrl() + "/api/nms/resource/ct4a/list",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            data: {
                                sort: [{ field: "id", dir: "asc" }],
                            },
                            beforeSend: function (req) {
                                if (JSON.parse(localStorage.getItem('currentUser')) != null) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                }
                            }
                        },
                        parameterMap: function (options, operation) {
                            return JSON.stringify(options);
                        }
                    },
                    schema: {
                        data: "data",
                        total: "total",
                        aggregates: "aggregates",
                        model: {
                            id: "id",
                            fields: {
                                id: {type: "number", nullable: true},
                                planId: {type: "number", defaultValue: $scope.appId},
                                data3: {type: "number"},
                                data4: {type: "number"},
                                dataSum3: {type: "number"},
                                dataSum4: {type: "number"},
                                dataDiff3: {type: "number"},
                                dataDiff4: {type: "number"},
                            }
                        }

                    },
                    aggregate: [
                        { field: "data3", aggregate: "sum" },
                        { field: "data4", aggregate: "sum" },
                        { field: "data5", aggregate: "sum" },
                        { field: "data6", aggregate: "sum" },
                        { field: "data7", aggregate: "sum" },
                        { field: "data8", aggregate: "sum" },
                        { field: "data9", aggregate: "sum" },
                        { field: "data10", aggregate: "sum" },
                    ],
                    pageSize: 1000,
                    serverPaging: true,
                    serverSorting: true,
                    serverAggregates: true,
                    serverFiltering: true
                });
                $scope.mainGrid35 = {
                    sortable: true,
                    resizable: true,
                    reorderable: true,
                    pageable: false,
                    filterable: false,
                    editable: false,
                    columns: [
                        {
                            field: "data1",
                            title: "Код",
                            width: 80,
                            template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data1\"></span>",
                            attributes: {"style": "text-align: center;"},
                            headerAttributes: {style: "text-align: center; justify-content: center"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                        {
                            field: "data2",
                            title: "Үзүүлэлт",
                            width: 200,
                            template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data2\"></span>",
                            attributes: {"style": "text-align: left;"},
                            headerAttributes: {"style": "white-space: normal; vertical-align: middle;text-align: center;"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                        {
                            field: "data3",
                            width: 150,
                            title: "Засгийн газрын оруулсан капитал",
                            hidden:$scope.app.accountability==0,
                            template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data3 | number:1\"></span>",
                            aggregates: ["sum"],
                            footerTemplate: "<span style='display: block;text-align: right;'> #=kendo.toString(sum, \"n0\")#</span>",
                            attributes: {"style": "text-align: right;"},
                            headerAttributes: {style: "text-align: center; justify-content: center"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                        {
                            field: "data4",
                            width: 150,
                            title: "Дахин үнэлгээний нөөц",
                            hidden:$scope.app.accountability==0,
                            template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data4 | number:1\"></span>",
                            aggregates: ["sum"],
                            footerTemplate: "<span style='display: block;text-align: right;'> #=kendo.toString(sum, \"n0\")#</span>",
                            attributes: {"style": "text-align: right;"},
                            headerAttributes: {style: "text-align: center; justify-content: center"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                        {
                            field: "data5",
                            width: 150,
                            title: "Хуримтлагдсан дүн",
                            hidden:$scope.app.accountability==0,
                            template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data5 | number:1\"></span>",
                            aggregates: ["sum"],
                            footerTemplate: "<span style='display: block;text-align: right;'> #=kendo.toString(sum, \"n0\")#</span>",
                            attributes: {"style": "text-align: right;"},
                            headerAttributes: {style: "text-align: center; justify-content: center"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                        {
                            field: "data6",
                            width: 150,
                            hidden:$scope.app.accountability==0,
                            title: "Засгийн газрын хувь оролцооний нийт дүн",
                            template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data6 | number:1\"></span>",
                            aggregates: ["sum"],
                            footerTemplate: "<span style='display: block;text-align: right;'> #=kendo.toString(sum, \"n0\")#</span>",
                            attributes: {"style": "text-align: right;"},
                            headerAttributes: {style: "text-align: center; justify-content: center"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                        {
                            field: "data3",
                            width: 100,
                            title: "Өмч",
                            hidden:$scope.app.accountability==1,
                            template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data3 | number:1\"></span>",
                            aggregates: ["sum"],
                            footerTemplate: "<span style='display: block;text-align: right;'> #=kendo.toString(sum, \"n0\")#</span>",
                            attributes: {"style": "text-align: right;"},
                            headerAttributes: {style: "text-align: center; justify-content: center"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                        {
                            field: "data4",
                            width: 100,
                            title: "Халаасны хувьцаа",
                            hidden:$scope.app.accountability==1,
                            template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data4 | number:1\"></span>",
                            aggregates: ["sum"],
                            footerTemplate: "<span style='display: block;text-align: right;'> #=kendo.toString(sum, \"n0\")#</span>",
                            attributes: {"style": "text-align: right;"},
                            headerAttributes: {style: "text-align: center; justify-content: center"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                        {
                            field: "data5",
                            width: 150,
                            title: "Нэмж төлөгдсөн капитал",
                            hidden:$scope.app.accountability==1,
                            template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data5 | number:1\"></span>",
                            aggregates: ["sum"],
                            footerTemplate: "<span style='display: block;text-align: right;'> #=kendo.toString(sum, \"n0\")#</span>",
                            attributes: {"style": "text-align: right;"},
                            headerAttributes: {style: "text-align: center; justify-content: center"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                        {
                            field: "data6",
                            width: 150,
                            hidden:$scope.app.accountability==1,
                            title: "Хөрөнгийн дахин үнэлгээний нэмэгдэл",
                            template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data6 | number:1\"></span>",
                            aggregates: ["sum"],
                            footerTemplate: "<span style='display: block;text-align: right;'> #=kendo.toString(sum, \"n0\")#</span>",
                            attributes: {"style": "text-align: right;"},
                            headerAttributes: {style: "text-align: center; justify-content: center"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                        {
                            field: "data7",
                            width: 150,
                            hidden:$scope.app.accountability==1,
                            title: "Гадаад валютын хөрвүүлэлтийн нөөц",
                            template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data7 | number:1\"></span>",
                            aggregates: ["sum"],
                            footerTemplate: "<span style='display: block;text-align: right;'> #=kendo.toString(sum, \"n0\")#</span>",
                            attributes: {"style": "text-align: right;"},
                            headerAttributes: {style: "text-align: center; justify-content: center"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                        {
                            field: "data8",
                            width: 150,
                            hidden:$scope.app.accountability==1,
                            title: "Эздийн өмчийн бусад хэсэг",
                            template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data8 | number:1\"></span>",
                            aggregates: ["sum"],
                            footerTemplate: "<span style='display: block;text-align: right;'> #=kendo.toString(sum, \"n0\")#</span>",
                            attributes: {"style": "text-align: right;"},
                            headerAttributes: {style: "text-align: center; justify-content: center"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                        {
                            field: "data9",
                            width: 150,
                            hidden:$scope.app.accountability==1,
                            title: "Хуримтлагдсан ашиг",
                            template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data9 | number:1\"></span>",
                            aggregates: ["sum"],
                            footerTemplate: "<span style='display: block;text-align: right;'> #=kendo.toString(sum, \"n0\")#</span>",
                            attributes: {"style": "text-align: right;"},
                            headerAttributes: {style: "text-align: center; justify-content: center"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                        {
                            field: "data10",
                            width: 150,
                            hidden:$scope.app.accountability==1,
                            title: "Нийт дүн",
                            template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data10 | number:1\"></span>",
                            aggregates: ["sum"],
                            footerTemplate: "<span style='display: block;text-align: right;'> #=kendo.toString(sum, \"n0\")#</span>",
                            attributes: {"style": "text-align: right;"},
                            headerAttributes: {style: "text-align: center; justify-content: center"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                    ],
                    dataBinding: function () {
                        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                    },
                    dataBound: function (e) {
                        var grid = this;
                        var rows = grid.tbody.children();
                        for (var j = 0; j < rows.length; j++) {
                            var row = $(rows[j]);
                            var dataItem = e.sender.dataItem(row);

                            /*   row[0].cells[4].style.backgroundColor = "#fff7ed";
                               row[0].cells[5].style.backgroundColor = "#fff7ed";
                               row[0].cells[6].style.backgroundColor = "#fff7ed";
                               row[0].cells[7].style.backgroundColor = "#fff7ed";
                               row[0].cells[8].style.backgroundColor = "#fff7ed";
                               row[0].cells[9].style.backgroundColor = "#fff7ed";
                               row[0].cells[10].style.backgroundColor = "#fff7ed";
                               row[0].cells[11].style.backgroundColor = "#fff7ed";
                               row[0].cells[12].style.backgroundColor = "#fff7ed";
                               row[0].cells[13].style.backgroundColor = "#fff7ed";
                               row[0].cells[2].style.backgroundColor = "#fff7ed";
                               row[0].cells[3].style.backgroundColor = "#fff7ed";*/

                        }
                    },
                    height: function () {
                        return $(window).height() - 132;
                    },
                };
                $scope.dataSource36 = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: __env.apiUrl() + "/api/nms/resource/ct5a/list",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            data: {
                                sort: [{ field: "id", dir: "asc" }],
                            },
                            beforeSend: function (req) {
                                if (JSON.parse(localStorage.getItem('currentUser')) != null) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                }
                            }
                        },
                        parameterMap: function (options, operation) {
                            return JSON.stringify(options);
                        }
                    },
                    schema: {
                        data: "data",
                        total: "total",
                        aggregates: "aggregates",
                        model: {
                            id: "id",
                            fields: {
                                id: {type: "number", nullable: true},
                                planId: {type: "number", defaultValue: $scope.appId},
                                data3: {type: "number"},
                                data4: {type: "number"},
                                dataSum3: {type: "number"},
                                dataSum4: {type: "number"},
                                dataDiff3: {type: "number"},
                                dataDiff4: {type: "number"},
                            }
                        }

                    },
                    aggregate: [
                        { field: "data3", aggregate: "sum" }
                    ],
                    pageSize: 1000,
                    serverPaging: true,
                    serverSorting: true,
                    serverAggregates: true,
                    serverFiltering: true
                });
                $scope.mainGrid36 = {
                    sortable: true,
                    resizable: true,
                    reorderable: true,
                    pageable: false,
                    filterable: false,
                    editable: false,
                    columns: [
                        {
                            field: "data1",
                            title: "Код",
                            width: 80,
                            template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data1\"></span>",
                            attributes: {"style": "text-align: left;"},
                            headerAttributes: {style: "text-align: center; justify-content: center"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                        {
                            field: "data2",
                            title: "Үзүүлэлт",
                            template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data2\"></span>",
                            attributes: {"style": "text-align: left;"},
                            headerAttributes: {"style": "white-space: normal; vertical-align: middle;text-align: center;"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                        {
                            field: "data3",
                            width: 200,
                            title: "Тайлант оны гүйцэтгэл",
                            template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data3 | number:1\"></span>",
                            aggregates: ["sum"],
                            footerTemplate: "<span style='display: block;text-align: right;'> #=kendo.toString(sum, \"n0\")#</span>",
                            attributes: {"style": "text-align: right;"},
                            headerAttributes: {style: "text-align: center; justify-content: center"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                    ],
                    dataBinding: function () {
                        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                    },
                    dataBound: function (e) {
                        var grid = this;
                        var rows = grid.tbody.children();
                        for (var j = 0; j < rows.length; j++) {
                            var row = $(rows[j]);
                            var dataItem = e.sender.dataItem(row);
                            /* row[0].cells[2].style.backgroundColor = "#e0e7ff";
                             row[0].cells[5].style.backgroundColor = "#e0e7ff";
                             row[0].cells[2].style.backgroundColor = "#fff7ed";
                             row[0].cells[3].style.backgroundColor = "#fff7ed";*/

                        }
                    },
                    height: function () {
                        return $(window).height() - 132;
                    },
                };
                $scope.dataSource37 = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: __env.apiUrl() + "/api/nms/resource/ct6a/list",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            data: {
                                sort: [{ field: "id", dir: "asc" }],
                            },
                            beforeSend: function (req) {
                                if (JSON.parse(localStorage.getItem('currentUser')) != null) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                }
                            }
                        },
                        parameterMap: function (options, operation) {
                            return JSON.stringify(options);
                        }
                    },
                    schema: {
                        data: "data",
                        total: "total",
                        aggregates: "aggregates",
                        model: {
                            id: "id",
                            fields: {
                                id: {type: "number", nullable: true},
                                planId: {type: "number", defaultValue: $scope.appId},
                                data3: {type: "number"},
                                data4: {type: "number"},
                                data5: {type: "number"},
                                data6: {type: "number"},
                            }
                        }

                    },
                    aggregate: [
                        { field: "data3", aggregate: "sum" },
                        { field: "data4", aggregate: "sum" },
                        { field: "data5", aggregate: "sum" },
                        { field: "data6", aggregate: "sum" }
                    ],
                    pageSize: 1000,
                    serverPaging: true,
                    serverSorting: true,
                    serverAggregates: true,
                    serverFiltering: true
                });
                $scope.mainGrid37 = {
                    sortable: true,
                    resizable: true,
                    reorderable: true,
                    pageable: false,
                    filterable: false,
                    editable: false,
                    columns: [
                        {
                            field: "data1",
                            title: "Код",
                            width: 80,
                            template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data1\"></span>",
                            attributes: {"style": "text-align: left;"},
                            headerAttributes: {style: "text-align: center; justify-content: center"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                        {
                            field: "data2",
                            title: "Үзүүлэлт",
                            template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data2\"></span>",
                            attributes: {"style": "text-align: left;"},
                            headerAttributes: {"style": "white-space: normal; vertical-align: middle;text-align: center;"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                        {
                            field: "data3",
                            width: 150,
                            title: "Төлөвлөгөө",
                            template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data3 | number:1\"></span>",
                            aggregates: ["sum"],
                            footerTemplate: "<span style='display: block;text-align: right;'> #=kendo.toString(sum, \"n0\")#</span>",
                            attributes: {"style": "text-align: right;"},
                            headerAttributes: {style: "text-align: center; justify-content: center"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                        {
                            field: "data4",
                            width: 150,
                            title: "Төсвийн гүйцэтгэлийн тайлан",
                            template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data4 | number:1\"></span>",
                            aggregates: ["sum"],
                            footerTemplate: "<span style='display: block;text-align: right;'> #=kendo.toString(sum, \"n0\")#</span>",
                            attributes: {"style": "text-align: right;"},
                            headerAttributes: {style: "text-align: center; justify-content: center"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                        {
                            field: "data5",
                            width: 150,
                            title: "Зөрүү",
                            template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data5 | number:1\"></span>",
                            aggregates: ["sum"],
                            footerTemplate: "<span style='display: block;text-align: right;'> #=kendo.toString(sum, \"n0\")#</span>",
                            attributes: {"style": "text-align: right;"},
                            headerAttributes: {style: "text-align: center; justify-content: center"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                        {
                            field: "data6",
                            width: 150,
                            title: "Хувь",
                            template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data6 | number:1\"></span>",
                            aggregates: ["sum"],
                            footerTemplate: "<span style='display: block;text-align: right;'> -</span>",
                            attributes: {"style": "text-align: right;"},
                            headerAttributes: {style: "text-align: center; justify-content: center"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        }
                    ],
                    dataBinding: function () {
                        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                    },
                    dataBound: function (e) {
                        var grid = this;
                        var rows = grid.tbody.children();
                        for (var j = 0; j < rows.length; j++) {
                            var row = $(rows[j]);
                            var dataItem = e.sender.dataItem(row);
                        }
                    },
                    height: function () {
                        return $(window).height() - 132;
                    },
                };

                $scope.dataSource38 = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: __env.apiUrl() + "/api/nms/resource/journal/list",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            beforeSend: function (req) {
                                if (JSON.parse(localStorage.getItem('currentUser')) != null) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                }
                            }
                        },
                        parameterMap: function (options, operation) {
                            return JSON.stringify(options);
                        }
                    },
                    schema: {
                        data: "data",
                        total: "total",
                        aggregates: "aggregates",
                        model: {
                            id: "id",
                            fields: {
                                id: {type: "number", nullable: true},
                                planId: {type: "number", defaultValue: $scope.appId},
                            }
                        }

                    },
                    pageSize: 20,
                    serverPaging: true,
                    serverSorting: true,
                    serverAggregates: true,
                    serverFiltering: true
                });
                $scope.mainGrid38 = {
                    sortable: true,
                    resizable: true,
                    reorderable: true,
                    pageable: {
                        pageSizes: [20, 50, 100],
                        refresh: true,
                        pageSize: 10,
                        buttonCount: 5,
                    },
                    filterable: {
                        mode: "row",
                        extra: false,
                        cell: {
                            operator: "eq",
                        },
                    },
                    editable: false,
                    columns: [
                        {
                            field: "data1",
                            title: "Д/д",
                            width: 80,
                            template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data1\"></span>",
                            attributes: {"style": "text-align: center;"},
                            headerAttributes: {style: "text-align: center; justify-content: center"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                        {
                            field: "data2",
                            title: "Огноо",
                            width: 100,
                            template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data2\"></span>",
                            attributes: {"style": "text-align: center;"},
                            headerAttributes: {style: "text-align: center; justify-content: center"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                        {
                            field: "data3",
                            width: 150,
                            title: "Баримт №",
                            attributes: {"style": "text-align: left;"},
                            headerAttributes: {style: "text-align: center; justify-content: left"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                        {
                            field: "data4",
                            title: "Гүйлгээний утга",
                            attributes: {"style": "text-align: left;"},
                            headerAttributes: {style: "text-align: center; justify-content: left"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                        {
                            field: "data5",
                            width: 150,
                            title: "Мөнгөн дүн",
                            attributes: {"style": "text-align: right;"},
                            headerAttributes: {style: "text-align: center; justify-content: center"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                        {
                            field: "data6",
                            width: 150,
                            title: "Дебет",
                            attributes: {"style": "text-align: center;"},
                            headerAttributes: {style: "text-align: center; justify-content: center"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                        {
                            field: "data7",
                            width: 150,
                            title: "Кредит",
                            attributes: {"style": "text-align: center;"},
                            headerAttributes: {style: "text-align: center; justify-content: center"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                    ],
                    dataBinding: function () {
                        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                    },
                    dataBound: function (e) {
                        var grid = this;
                        var rows = grid.tbody.children();
                        for (var j = 0; j < rows.length; j++) {
                            var row = $(rows[j]);
                            var dataItem = e.sender.dataItem(row);
                            if (dataItem.get("childCnt") != null) {
                                if (dataItem.get("childCnt") >0) {
                                    row[0].cells[1].style.fontWeight = "500 !important";
                                }
                            }
                            var dataDiff3 = dataItem.get("dataDiff3");
                            if (dataDiff3 != null) {
                                if (dataDiff3 !== 0) {
                                    row[0].cells[6].style.backgroundColor = "#FB7185";
                                }
                            }
                            var dataDiff4 = dataItem.get("dataDiff4");
                            if (dataDiff4 != null) {
                                if (dataDiff4 !== 0) {
                                    row[0].cells[7].style.backgroundColor = "#FB7185";
                                }
                            }
                            row[0].cells[4].style.backgroundColor = "#fff7ed";
                            row[0].cells[5].style.backgroundColor = "#e0e7ff";
                            row[0].cells[6].style.backgroundColor = "#e0e7ff";
                          //  row[0].cells[2].style.backgroundColor = "#fff7ed";
                          //  row[0].cells[3].style.backgroundColor = "#fff7ed";

                        }
                    },
                    height: function () {
                        return $(window).height() - 130;
                    },
                };

                $scope.dataSource39 = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: __env.apiUrl() + "/api/nms/resource/validation/list",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            beforeSend: function (req) {
                                if (JSON.parse(localStorage.getItem('currentUser')) != null) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                }
                            }
                        },
                        parameterMap: function (options, operation) {
                            return JSON.stringify(options);
                        }
                    },
                    schema: {
                        data: "data",
                        total: "total",
                        aggregates: "aggregates",
                        model: {
                            id: "id",
                            fields: {
                                id: {type: "number", nullable: true},
                                planId: {type: "number", defaultValue: $scope.appId},
                                data3: {type: "number"},
                                data4: {type: "number"}
                            }
                        }

                    },
                    aggregate: [
                        { field: "data3", aggregate: "sum" }
                    ],
                    pageSize: 1000,
                    serverPaging: true,
                    serverSorting: true,
                    serverAggregates: true,
                    serverFiltering: true
                });
                $scope.mainGrid39 = {
                    sortable: true,
                    resizable: true,
                    reorderable: true,
                    pageable: false,
                    filterable: false,
                    editable: false,
                    columns: [
                        {
                            title: "№",
                            headerAttributes: {style: "text-align: center; justify-content: center"},
                            attributes: {style: "text-align: center;"},
                            template: "#= ++record #",
                            width: 50,
                        },
                        {
                            field: "repNm1",
                            title: "Тайлан",
                            width: 150,
                            attributes: {"style": "text-align: left;"},
                            headerAttributes: {style: "text-align: center; justify-content: center"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                        {
                            field: "indicator1",
                            title: "Үзүүлэлт-1",
                            width: 150,
                            attributes: {"style": "text-align: left;"},
                            headerAttributes: {"style": "white-space: normal; vertical-align: middle;text-align: center;"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                        {
                            field: "indicator2",
                            title: "Үзүүлэлт-2",
                            width: 150,
                            template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.indicator2\"></span>",
                            attributes: {"style": "text-align: left;"},
                            headerAttributes: {"style": "white-space: normal; vertical-align: middle;text-align: center;"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                        {
                            field: "description",
                            title: "Тайлбар",
                            template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.description\"></span>",
                            attributes: {"style": "text-align: left;"},
                            headerAttributes: {"style": "white-space: normal; vertical-align: middle;text-align: center;"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                        {
                            field: "data1",
                            title: "Дүн-1",
                            width: 150,
                            template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data1 | number:1\"></span>",
                            attributes: {"style": "text-align: right;"},
                            headerAttributes: {style: "text-align: center; justify-content: center"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                        {
                            field: "data2",
                            width: 150,
                            title: "Дүн-2",
                            template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data2 | number:1\"></span>",
                            attributes: {"style": "text-align: right;"},
                            headerAttributes: {style: "text-align: center; justify-content: center"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                        {
                            field: "data3",
                            width: 150,
                            title: "Зөрүү",
                            template:"<span ng-class=\"dataItem.childCnt>0?'font-medium':''\" ng-bind=\"dataItem.data3 | number:1\"></span>",
                            aggregates: ["sum"],
                            footerTemplate: "<span style='display: block;text-align: right;'> #=kendo.toString(sum, \"n0\")#</span>",
                            attributes: {"style": "text-align: right;"},
                            headerAttributes: {style: "text-align: center; justify-content: center"},
                            filterable: {cell: {operator: "contains", showOperators: false}}
                        },
                    ],
                    dataBinding: function () {
                        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                    },
                    dataBound: function (e) {
                        var grid = this;
                        var rows = grid.tbody.children();
                        for (var j = 0; j < rows.length; j++) {
                            var row = $(rows[j]);
                            var dataItem = e.sender.dataItem(row);

                            /* row[0].cells[4].style.backgroundColor = "#e0e7ff";
                             row[0].cells[5].style.backgroundColor = "#e0e7ff";
                             row[0].cells[2].style.backgroundColor = "#fff7ed";
                             row[0].cells[3].style.backgroundColor = "#fff7ed";*/

                        }
                    },
                    height: function () {
                        return $(window).height() - 132;
                    },
                };

                $scope.activeTab = function (item) {
                    $scope.gridActive = item.id;
                    $scope.gridCode = item.code;
                    if(item.code==='СБД'){
                        $scope.dataSource32.filter({
                            logic: "and",
                            filters: [{field: "useYn", operator: "eq", value: 1}, {field: "stepId", operator: "eq", value: 1},{
                                field: "planId",
                                operator: "eq",
                                value: $scope.appId
                            }],
                        });
                    }
                    if(item.code==='ОДТ'){
                        $scope.dataSource33.filter({
                            logic: "and",
                            filters: [{field: "useYn", operator: "eq", value: 1},{field: "stepId", operator: "eq", value: 1}, {
                                field: "planId",
                                operator: "eq",
                                value: $scope.appId
                            }],
                        });
                    }
                    if(item.code==='МГТ'){
                        $scope.dataSource34.filter({
                            logic: "and",
                            filters: [{field: "useYn", operator: "eq", value: 1}, {field: "stepId", operator: "eq", value: 1},{
                                field: "planId",
                                operator: "eq",
                                value: $scope.appId
                            }],
                        });
                    }
                    if(item.code==='ӨӨТ'){
                        $scope.dataSource35.filter({
                            logic: "and",
                            filters: [{field: "useYn", operator: "eq", value: 1},{field: "stepId", operator: "eq", value: 1}, {
                                field: "planId",
                                operator: "eq",
                                value: $scope.appId
                            }],
                        });
                    }
                    if(item.code==='НСТ'){
                        $scope.dataSource36.filter({
                            logic: "and",
                            filters: [{field: "useYn", operator: "eq", value: 1},{field: "stepId", operator: "eq", value: 1}, {
                                field: "planId",
                                operator: "eq",
                                value: $scope.appId
                            }],
                        });
                    }
                    if(item.code==='ТГ'){
                        $scope.dataSource37.filter({
                            logic: "and",
                            filters: [{field: "useYn", operator: "eq", value: 1}, {field: "stepId", operator: "eq", value: 1},{
                                field: "planId",
                                operator: "eq",
                                value: $scope.appId
                            }],
                        });
                    }
                    if(item.code==='Тулгалт'){
                        $scope.dataSource39.filter({
                            logic: "and",
                            filters: [{field: "useYn", operator: "eq", value: 1},{field: "stepId", operator: "eq", value: 1}, {
                                field: "planId",
                                operator: "eq",
                                value: $scope.appId
                            }],
                        });
                    }
                    if(item.code==='Журнал'){
                        $scope.dataSource38.filter({
                            logic: "and",
                            filters: [{field: "useYn", operator: "eq", value: 1}, {field: "stepId", operator: "eq", value: 1},{
                                field: "planId",
                                operator: "eq",
                                value: $scope.appId
                            }],
                        });
                    }
                    if(item.code==='Тодруулга'){
                        UIkit.modal("#modal_loader", {
                            modal: false,
                            keyboard: false,
                            bgclose: false,
                            center: true,
                        }).show();
                        mainService.withdomain("get", "/api/nms/resource/item/ctt1/list/" + $scope.appId).then(function (data) {
                            $scope.clarifications = data;
                            UIkit.modal("#modal_loader").hide();
                        });
                    }
                }

                $scope.reportChange = function (i) {
                    sweet.show(
                        {
                            title: "Анхаар",
                            text: "Тайлангийн мэдээлэл устахыг анхаарна уу. Үргэлжлүүлэх?",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "Тийм",
                            cancelButtonText: "Үгүй",
                            closeOnConfirm: true,
                            closeOnCancel: true,
                        },
                        function (inputvalue) {
                            if (inputvalue) {
                                $scope.app.accountability=i;
                                $scope.app.stepId=1;
                                mainService.withdata("post", "/api/adt/main/accountability/submit", $scope.app).then(function (data) {
                                    $timeout(function () {
                                        $scope.initForm($scope.appId,$scope.formId)
                                    }, 10)
                                });
                            }
                        }
                    );
                }

                $scope.appId = 0;
                $scope.formId = 0;
                $scope.initForm = function (appId, formId) {
                    $scope.appId = appId;
                    $scope.formId = formId;
                    console.log($scope.app.accountability);
                    mainService.withdata("get", "/api/adt/report/org-type/" + $scope.app.accountability).then(function (data) {
                        $scope.reports = data;
                        $timeout(function () {
                            $scope.activeTab(data[0]);
                        }, 10)
                    });
                }

                $scope.onSelect = function (e) {
                    $scope.createLink = e.response;
                    $scope.form.files.push(e.response.id);
                }
                $scope.onUpload = function (e) {
                    var xhr = e.XMLHttpRequest;
                    if (xhr) {
                        xhr.addEventListener("readystatechange", function (e) {
                            if (xhr.readyState == 1 /* OPENED */) {
                                xhr.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                            }
                        });
                    }
                }
                $scope.fileAttachmentOptions = {
                    multiple: true,
                    autoUpload: false,
                    showFileList: true,
                    files: [],
                    validation: {
                        maxFileSize: 20000000, //20mb (in bytes)  allowedExtensions: ["doc", "txt", "docx", "pdf", "jpg", "jpeg", "png", "xlsx", "xls"],
                    }
                };

                $scope.formUpload = {};
                $scope.formFile = {};
                $scope.formTsalin = {};
                $scope.formHuulga = {};

                $scope.change = function (index, item) {
                    if (index === 1) {
                        $scope.afl = item;
                    }
                    if (index === 2) {
                        $scope.uploadfile = item;
                    }
                    if (index === 3) {
                        $scope.tsalin = item;
                    }

                }
                $scope.submitUploadDifference = function () {
                    $scope.sendBtn = false;
                    $scope.uploadReport($scope.afl, 1);
                };
                $scope.submitUploadReport = function () {
                    $scope.sendBtn = false;
                    $scope.uploadReport($scope.uploadfile, 2);
                };
                $scope.submitUploadJournal = function () {
                    $scope.sendBtn = false;
                    $scope.uploadReport($scope.uploadfile, 3);
                };

                $scope.submitUploadHuulga = function () {
                    $scope.sendBtn = false;
                    if ($scope.formHuulga.huulga.$valid && $scope.huulga) {
                        $scope.uploadReport($scope.huulga, 4);
                    }
                };
                $scope.uploadReport = function (file, y) {
                    UIkit.modal('#modal_loader', {
                        modal: false,
                        keyboard: false,
                        bgclose: false,
                        center: true
                    }).show();

                    var xurl = "";
                    if (y === 1) {
                        xurl = '/api/adt/main/checker/' + $scope.appId + '/' + $scope.formId;
                    } else if (y === 2) {
                        xurl = '/api/adt/main/convert/' + $scope.appId + '/1';
                    } else if (y === 3) {
                        xurl = '/api/adt/main/journal/' + $scope.appId + '/1';
                    } else if (y === 4) {
                        xurl = '/api/adt/main/tsh/1';
                    } else {
                        xurl = '/api/adt/main/tsh/2';
                    }
                    Upload.upload({
                        url: xurl,
                        data: {file: file}
                    }).then(function (response) {
                        if (y === 1) {
                            if (response.data.length === 0) {
                                $rootScope.alert(true, "Дансны код тохирч байна.");
                                $scope.diffence = [];
                                $scope.afl = null;
                            } else {
                                $scope.diffence = data.data;
                            }
                            UIkit.modal('#modal_loader').hide();
                        } else if (y === 2) {
                            if(!response.data.valid){
                                $rootScope.alert(false,"Тайлан тохирохгүй байна.");
                            }
                            UIkit.modal('#modal_loader').hide();
                        } else if (y === 3) {
                            if(!response.data.valid){
                                $rootScope.alert(false,"Тайлан тохирохгүй байна.");
                            }
                            UIkit.modal('#modal_loader').hide();
                        }
                        $scope.uploadfile=null;
                        $scope.activeTab($scope.reports[0]);
                    });
                };


            }
        ]
    );
