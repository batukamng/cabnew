angular
    .module('altairApp')
    .controller(
        '1052Ctrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$timeout',
            '$translate',
            '__env',
            'fileUpload',
            function ($rootScope, $state, $scope, $timeout, $translate,__env, fileUpload) {

                $scope.id=0;

                $scope.mainGrid = {
                    dataSource: {
                        transport: {
                            read: {
                                url: function (e) {
                                    return __env.apiUrl() + "/api/formTemp/list";
                                },
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                data: {"sort": [{field: 'id', dir: 'asc'}]},
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
                                    modDtm: {type:"date"},
                                }
                            }
                        },
                        pageSize: 15,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    },
                    /*filterable: {
                        "mode":"row",
                        extra: false,
                        showOperators: false,
                        operators: { // redefine the string operators
                            string: {
                                contains: "Contains",
                            }
                        }
                    },*/
                    /*excel: {
                        allPages: true
                    },*/
                    //sortable: true,
                    resizable: true,
                    /*pageable: {
                        refresh: true,
                        pageSizes: true,
                        buttonCount: 5
                    },*/
                    columns: [
                        {
                            title: "Д/д",
                            headerAttributes: {"class": "columnHeader", style: "text-align: center"},
                            template: "<span class='row-number'></span>",
                            width: 50
                        },
                        {
                            field: "tempName",
                            title: "Нэр",
                            headerAttributes: {style: "text-align: center;"},
                            //width: 150
                        },
                        {
                            field: "fileName",
                            title: "Файлын нэр",
                            headerAttributes: {style: "text-align: center;"},
                            //width: 150
                        },
                        {
                            field: "modDtm",
                            title: "Шинэчилсэн огноо",
                            format      : "{0:yyyy-MM-dd HH:mm:ss}",
                            headerAttributes: {style: "text-align: center;"},
                            //width: 150
                        },
                        {
                            field: "version",
                            headerAttributes: {style: "text-align: center;"},
                            title: "Version",
                            //width: 150
                        },
                        {
                            title: "Шинэчлэх",
                            attributes: {style: "text-align:center;"},
                            width: 100,
                            headerAttributes:{style: "text-align:center;"},
                            template: "<button type='button' ng-click='fileUpload(dataItem.id)' class='md-btn md-btn-mini'>Шинэчлэх</button>"

                        },
                    ],
                    dataBound: function () {
                        var rows = this.items();
                        $(rows).each(function () {
                            var index = $(this).index() + 1 + ($(".k-grid").data("kendoGrid").dataSource.pageSize() * ($(".k-grid").data("kendoGrid").dataSource.page() - 1));
                            var rowLabel = $(this).find(".row-number");
                            $(rowLabel).html(index);
                        });
                    },
                    editable: "inline",
                    //height: 535
                };

                $scope.fileUpload=function (id){
                    UIkit.modal('#import').show();
                    $scope.id=id;
                };

                $scope.validate = function() {
                    let formDataAttach= new FormData();
                    angular.forEach($scope.excel, function (val) {
                        formDataAttach.append('excel', val);
                    });
                    //formDataAttach.append('data', $scope.id);
                    fileUpload.uploadFileToUrl(__env.apiUrl() +'/api/formTemp/update/'+$scope.id, formDataAttach)
                        .then(function(resp){
                            console.log(resp);
                            if(resp.id>0){
                                UIkit.notify("Амжилттай хадгаллаа.", {status: 'warning', pos: 'bottom-center'});
                                $("#dataTable").data("kendoGrid").dataSource.read();
                                UIkit.modal('#import').hide();
                            }
                        });
                };
            }
        ]
    );