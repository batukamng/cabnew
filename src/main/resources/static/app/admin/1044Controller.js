angular
    .module('altairApp')
    .controller(
        '1044Ctrl',
        [
            '$rootScope',
            '$state',
            '$sce',
            '$scope',
            'Upload',
            'incoming',
            'ongoing',
            '$timeout',
            '__env',
            function ($rootScope, $state, $sce,$scope,Upload,incoming,ongoing, $timeout,__env) {

                $scope.user = JSON.parse(localStorage.getItem('currentUser'));
                $scope.incoming=incoming;
                $scope.ongoing=ongoing;
                console.log($scope.userRooms);
                $scope.modalUpload= function(){
                    UIkit.modal('#modal_upload', {
                        modal: false,
                        keyboard: false,
                        bgclose: false,
                        center: true
                    }).show();
                };

                $scope.StartUserTime = function (count){
                    console.log(count);
                    return count;
                };

                $scope.formFile = {};

                $scope.submitUploadDifference = function (i) {
                    console.log(i);
                    console.log($scope.afl);
                    if ($scope.formFile.afl.$valid && $scope.afl) {
                        $scope.uploadExcel($scope.afl, i);
                    }
                };


                $scope.uploadExcel = function (file, y) {
                    UIkit.modal('#modal_loader', {
                        modal: false,
                        keyboard: false,
                        bgclose: false,
                        center: true
                    }).show();

                    UIkit.modal('#modal_upload').hide();

                    Upload.upload({
                        url: "/api/school/import",
                        data: {file: file}
                    }).then(function (resp) {
                        $(".k-grid").data("kendoGrid").dataSource.read();
                        UIkit.modal('#modal_loader').hide();
                    });
                };

                $scope.trustSrc = function(src) {
                    return $sce.trustAsResourceUrl(src);
                };

                var api;
                $scope.modalConference = function(item){
                    $scope.room=item;
                    //$scope.roomUrl="https://meet.pimis.ml/"+item.roomName;

                    var domain = 'meet.topgenius.mn';
                    var options = {
                        roomName: item.roomName,
                        parentNode: document.querySelector('#mof')
                    };
                    api = new JitsiMeetExternalAPI(domain, options);
                    api.executeCommand('displayName', $scope.user.username);
                    api.executeCommand('subject', ' ');
                    //api.executeCommand('password', '123');

                    console.log($scope.roomUrl);
                    UIkit.modal('#modal_conference', {
                        modal: false,
                        keyboard: false,
                        bgclose: false,
                        center: false
                    }).show();
                };

                $scope.meetExitAlert = function(){
                    if(confirm("Та хурлаас гарахдаа итгэлтэй байна уу?")){
                        $scope.meetDispose();
                    }
                };

                $scope.meetDispose = function(){
                    console.log("dispose");
                    api.dispose();
                    UIkit.modal('#modal_conference').hide();
                };

                $scope.mainGrid = {
                    dataSource: {
                        transport: {
                            read: {
                                url: function (e) {
                                    if(localStorage.getItem("buttonData").includes("read") && JSON.parse(localStorage.getItem('menuData')).link===$state.current.name){
                                        return __env.apiUrl() +"/api/school/list";
                                    }
                                    else{
                                        localStorage.removeItem('currentUser');
                                        localStorage.removeItem('menuList');
                                        localStorage.removeItem('menuData');
                                        $rootScope.$broadcast('LogoutSuccessful');
                                        $state.go('login');
                                        $rootScope.expire=true;
                                    }
                                },
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                }

                            },
                            update: {
                                url: __env.apiUrl() +"/api/school/update",
                                contentType: "application/json; charset=UTF-8",
                                type: "PUT",
                                complete: function (e) {
                                    $(".k-grid").data("kendoGrid").dataSource.read();
                                },
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                }
                            },
                            destroy: {
                                url: __env.apiUrl() +"/api/school/delete",
                                contentType: "application/json; charset=UTF-8",
                                type: "DELETE",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                }
                            },
                            create: {
                                url: __env.apiUrl() +"/api/TpAsCd/create",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                complete: function (e) {
                                    $(".k-grid").data("kendoGrid").dataSource.read();
                                },
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
                                    id: {type: "number", nullable:true},
                                    asCd: {type: "string", validation: {required: true}},
                                    cdNm: {type: "string", validation: {required: true}},
                                    cdDesc: {type: "string"},
                                    abbrNm: {type: "string"},
                                    useYn: {type: "boolean"}
                                }
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
                        {field: "organizationName",headerAttributes: {class:"columnCenter",style: "font-weight: bold"}, title: "Нэр"},
                        {field: "geographyCode",headerAttributes: {class:"columnCenter",style: "font-weight: bold"}, title: "Код"},
                        {field: "organizationGroup",headerAttributes: {class:"columnCenter",style: "font-weight: bold"}, title: "organizationGroup"},
                        {field: "organizationTypeName",headerAttributes: {class:"columnCenter",style: "font-weight: bold"}, title: "organizationTypeName"},
                        {field: "institutionTypeName",headerAttributes: {class:"columnCenter",style: "font-weight: bold"}, title: "institutionTypeName"},
                        {field: "organizationPropertyName",headerAttributes: {class:"columnCenter",style: "font-weight: bold"}, title: "organizationPropertyName"},
                        {field: "parentOrganizationName",headerAttributes: {class:"columnCenter",style: "font-weight: bold"}, title: "parentOrganizationName"},
                        {field: "stuCountPrimaryReal",headerAttributes: {class:"columnCenter",style: "font-weight: bold"}, title: "stuCountPrimaryReal"},
                        {field: "stuCountLowerSReal",headerAttributes: {class:"columnCenter",style: "font-weight: bold"}, title: "stuCountLowerSReal"},
                        {field: "stuCountUpperSReal",headerAttributes: {class:"columnCenter",style: "font-weight: bold"}, title: "stuCountUpperSReal"},
                        {field: "stuCountPrimaryStatistic",headerAttributes: {class:"columnCenter",style: "font-weight: bold"}, title: "stuCountPrimaryStatistic"},
                        {field: "stuCountLowerSStatistic",headerAttributes: {class:"columnCenter",style: "font-weight: bold"}, title: "stuCountLowerSStatistic"},
                        {field: "stuCountUpperSStatistic",headerAttributes: {class:"columnCenter",style: "font-weight: bold"}, title: "stuCountUpperSStatistic"},
                        {field: "stuCountOfBuilding",headerAttributes: {class:"columnCenter",style: "font-weight: bold"}, title: "stuCountOfBuilding"},
                        {field: "parentId",headerAttributes: {class:"columnCenter",style: "font-weight: bold"}, title: "Харьяа"}
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
                        return $(window).height() - 220;
                    }
                };
                if(JSON.parse(localStorage.getItem('menuData'))!=null) {
                    if (JSON.parse(localStorage.getItem('menuData')).rUpdate === '1') {
                        $scope.mainGrid.columns.push({
                            command: [
                                {name: "edit", text: {edit: " ", update: " ", cancel: " "}},
                                //-  {name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn"}
                            ], title: "&nbsp;", width: 100
                        });
                    }
                }
            }]);