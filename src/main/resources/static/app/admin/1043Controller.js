angular
    .module('altairApp')
    .controller(
        '1043Ctrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            'mainService',
            '$timeout',
            '__env',
            function ($rootScope, $state, $scope, mainService,$timeout,__env) {

                $scope.modalUpload= function(){
                    UIkit.modal('#modal_upload', {
                        modal: false,
                        keyboard: false,
                        bgclose: false,
                        center: false
                    }).show();
                };

                $scope.fromDateString;
                $scope.fromDateObject = null;
                $scope.toDateString;
                $scope.toDateObject = null;
                $scope.maxDate = new Date();
                $scope.minDate = new Date(2000, 0, 1, 0, 0, 0);
                $scope.fromDateChanged = function(){
                    $scope.minDate = new Date($scope.fromDateString);
                    console.log("min changed " + $scope.fromDateString);
                };
                $scope.toDateChanged = function(){
                    $scope.maxDate = new Date($scope.toDateString);
                    console.log("min changed " + $scope.toDateString);
                };


                $scope.roomSubmit = function(){
                    if ($scope.validator.validate()) {
                        $scope.conf.startDate=$scope.fromDateString;
                        $scope.conf.endDate=$scope.toDateString;
                        $scope.conf.active=true;

                        mainService.withdata('post', '/api/conference/create', $scope.conf).then(function (data) {
                            UIkit.notify("Амжилттай хадгаллаа.", {status: 'success', pos: 'bottom-center'});
                            UIkit.modal('#modal_upload').hide();
                            $(".k-grid").data("kendoGrid").dataSource.read();
                        });
                    }
                    else{
                        $scope.validationMessage = "Oops! There is invalid data in the form.";
                        $scope.validationClass = "uk-text-danger";
                    }
                };

                $scope.update=function(item){
                    $scope.conf=item;
                    $scope.fromDateString=item.startDate;
                    $scope.toDateString=item.endDate;
                    $scope.conf.userIds = [];
                    angular.forEach(item.userCollection, function(value, key){
                        $scope.conf.userIds.push(value.id);
                    });
                    UIkit.modal('#modal_upload', {
                        modal: false,
                        keyboard: false,
                        bgclose: false,
                        center: false
                    }).show();
                };

                $scope.selectOptions = {
                    placeholder: "Хэрэглэгч сонгох...",
                    dataTextField: "username",
                    dataValueField: "id",
                    valuePrimitive: true,
                    autoBind: true,
                    dataSource: {
                        transport: {
                            read: {
                                url: __env.apiUrl() + "/api/user/list",
                                contentType: "application/json; charset=UTF-8",
                                data:{"custom":"where posId!=5205"},
                                type: "POST",
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
                        //pageSize: 20,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    }
                };

                $scope.mainGrid = {
                    dataSource: {
                        transport: {
                            read: {
                                url: function (e) {
                                    if(sessionStorage.getItem("buttonData").includes("read") && JSON.parse(sessionStorage.getItem('menuData')).link===$state.current.name){
                                        return __env.apiUrl() +"/api/conference/list";
                                    }
                                    else{
                                        sessionStorage.removeItem('currentUser');
                                        sessionStorage.removeItem('menuList');
                                        sessionStorage.removeItem('menuData');
                                        $rootScope.$broadcast('LogoutSuccessful');
                                        $state.go('login');
                                        $rootScope.expire=true;
                                    }
                                },
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                }

                            },
                            update: {
                                url: __env.apiUrl() +"/api/conference/update",
                                contentType: "application/json; charset=UTF-8",
                                type: "PUT",
                                complete: function (e) {
                                    $(".k-grid").data("kendoGrid").dataSource.read();
                                },
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                }
                            },
                            destroy: {
                                url: __env.apiUrl() +"/api/conference/delete",
                                contentType: "application/json; charset=UTF-8",
                                type: "DELETE",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                }
                            },
                            create: {
                                url: __env.apiUrl() +"/api/conference/create",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                complete: function (e) {
                                    $(".k-grid").data("kendoGrid").dataSource.read();
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
                            }
                        },
                        pageSize: 10,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    },
                    filterable: true,
                    sortable: true,
                    resizable: true,
                    excel: {
                        fileName: "Organization Export.xlsx",
                        proxyURL: "//demos.telerik.com/kendo-ui/service/export",
                        filterable: true,
                        allPages: true
                    },
                    toolbar: [{template: "<button class='k-button k-button-icontext md-btn-primary' ng-click='modalUpload()'><span class=\"k-icon k-i-download\"></span>Импортлох</button>"},"search"],
                    pageable: {
                        refresh: true,
                        pageSizes: true,
                        buttonCount: 5
                    },

                    columns: [
                        {title: "#", headerAttributes: {"class": "columnHeader"}, template: "<span class='row-number'></span>", width: "50px"},
                        {field: "roomName",headerAttributes: {class:"columnCenter",style: "font-weight: bold"}, title: "Нэр"},
                        {field: "roomInfo",headerAttributes: {class:"columnCenter",style: "font-weight: bold"}, title: "Тайлбар"},
                        {field: "userCollection",attributes:{class:"uk-text-center"},headerAttributes: {class:"columnCenter",style: "font-weight: bold"},  filterable:false,  template:"#for (var i=0,len=userCollection.length; i<len; i++){#<span>${ userCollection[i].username } #if(i!=userCollection.length-1){#<span>,</span>#}# </span> # } #", title: "Хэрэглэгчид"},
                        {field: "startDate",width:200,attributes:{class:"uk-text-center"},headerAttributes: {class:"columnCenter",style: "font-weight: bold"}, title: "Эхлэх"},
                        {field: "endDate",width:200,attributes:{class:"uk-text-center"},headerAttributes: {class:"columnCenter",style: "font-weight: bold"}, title: "Дуусах"},
                        {field: "active",width:120,attributes:{class:"uk-text-center"},template:"#if(active){# <span class='uk-text-success uk-text-bold'>Тийм</span> #}else{# <span class='uk-text-danger uk-text-bold'>Үгүй</span> #}#",headerAttributes: {class:"columnCenter",style: "font-weight: bold"}, title: "Идэвхтэй"},
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

                if(JSON.parse(sessionStorage.getItem('privilege'))!=null){
                    var privileges=JSON.parse(sessionStorage.getItem('privilege'));
                    angular.forEach(privileges, function(value, key) {
                        if(value.name==='WRITE'){
                            $scope.mainGrid.toolbar = [{template: "<button class='k-button k-button-icontext md-btn-primary' ng-click='modalUpload()'><span class=\"k-icon k-i-plus\"></span>Нэмэх</button>"},"search"];
                        }
                        if(value.name==='UPDATE'){
                            $scope.mainGrid.columns.push({
                                command: [
                                    { template: '<button style="min-width: 35px" class=\'k-button k-button-icontext\' ng-click=\'update(dataItem)\'><i class="k-icon k-i-edit"></i></button>' },
                                    {name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn"}
                                ], title: "&nbsp;", width: 100
                            });
                        }
                    });
                }
            }
        ]
    );
