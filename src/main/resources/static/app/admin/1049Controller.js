angular
    .module('altairApp')
    .controller(
        '1049Ctrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$timeout',
            '__env',
            'fileUpload',
            '$translate',
            function ($rootScope, $state, $scope, $timeout, __env, fileUpload,$translate) {

                $scope.modalUpload=function(i,typeId,id){
                    if(i===0){
                        $scope.formName="Нэмэх";
                        $scope.fileType=null;
                        $scope.typeId=null;
                        $scope.id=0;
                    }
                    else{
                        $scope.formName="Засах";
                        $scope.fileType=typeId;
                        $scope.id=id;
                    }
                    $scope.comDataSource = new kendo.data.DataSource({
                        serverFiltering: true,
                        transport: {
                            read: {
                                url: "/api/comCd/list",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                },
                                data: {
                                    "custom":"where grpCd='config' and parentId is not null"
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
                        pageSize: 50,
                        serverPaging: true
                    });
                    UIkit.modal('#modal_upload', {
                        modal: false,
                        keyboard: false,
                        bgclose: false,
                        center: false
                    }).show();
                };

                $scope.fileSelected=false;
                $scope.selectFile=function(){
                    $scope.fileSelected=true;
                };

                $scope.submitUploadDifference = function (i) {
                    if ($scope.formFile.act.$valid && $scope.act) {
                        $scope.uploadExcel($scope.act);
                    }
                };

                $scope.uploadExcel = function (file) {
                    UIkit.modal('#modal_loader', {
                        modal: false,
                        keyboard: false,
                        bgclose: false,
                        center: true
                    }).show();

                    var formDataAttach = new FormData();
                    formDataAttach.append("file", file);
                    UIkit.modal('#modal_upload').hide();

                    fileUpload.uploadFileToUrl("/api/config/create/"+$scope.fileType+"/"+$scope.id,formDataAttach).then(function (resp) {
                        $(".k-grid").data("kendoGrid").dataSource.read();
                        UIkit.modal('#modal_loader').hide();
                    });
                };

                $scope.mainGrid = {
                    dataSource: {
                        transport: {
                            read: {
                                url: function (e) {
                                    if(sessionStorage.getItem("buttonData").includes("read") && JSON.parse(sessionStorage.getItem('menuData')).link===$state.current.name){
                                        return __env.apiUrl() + "/api/config/list";
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
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                }
                            },
                            destroy: {
                                url: __env.apiUrl() + "/api/config/delete",
                                contentType: "application/json; charset=UTF-8",
                                type: "DELETE",
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
                                id: "id"
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
                        {field: "comCd.comCdNm", headerAttributes: {"class": "columnHeader"},title:'Төрөл'},
                        {field: "fileType",headerAttributes: {"class": "columnHeader"},title: 'Файлын төрөл'},
                        {field: "fileUrl",headerAttributes: {"class": "columnHeader"},title: 'Хаяг'},
                        {
                            field: "useYn",
                            headerAttributes: {"class": "columnHeader"},
                            template: "#if(useYn){# <span class='columnCenter'>Y</span> #}else{#<span class='columnCenter uk-text-danger'>N</span> #}#",
                            title: '{{"Use" | translate}}',
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
                    editable: "inline",
                    height: function () {
                        return $(window).height() - 110;
                    }
                };

                if(JSON.parse(sessionStorage.getItem('privilege'))!=null){
                    var privileges=JSON.parse(sessionStorage.getItem('privilege'));
                    angular.forEach(privileges, function(value, key) {
                        if(value.name==='READ'){
                            $scope.mainGrid.toolbar = ["excel","search"];
                        }
                        if(value.name==='WRITE'){
                            $scope.mainGrid.toolbar = [{template: "<button class='k-button k-button-icontext md-btn-primary' ng-click='modalUpload(0)'><span class=\"k-icon k-i-plus\"></span>Нэмэх</button>"},"search"];
                        }
                        if(value.name==='UPDATE'){
                            $scope.mainGrid.columns.push({
                                command: [
                                    {name: "edit", template: "<button class='k-button k-button-icontext' ng-click='modalUpload(1,dataItem.typeId,dataItem.id)'><span class=\"k-icon k-i-edit\"></span></button>"},
                                    {name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn"}
                                ], title: "&nbsp;", width: 100
                            });
                        }
                    });
                }
            }
        ]
    );
