angular
    .module('altairApp')
    .controller(
        '1041Ctrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$timeout',
            'mainService',
            '__env',
            function ($rootScope, $state, $scope, $timeout, mainService, __env) {
                $scope.user = JSON.parse(localStorage.getItem('currentUser'));
                $scope.dataSource = new kendo.data.PivotDataSource({
                    transport: {
                        read: {
                            url: function (e) {
                                if(localStorage.getItem("buttonData").includes("read") && JSON.parse(localStorage.getItem('menuData')).link===$state.current.name){
                                    return  __env.apiUrl() + "/api/user/all";
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
                        parameterMap: function (options) {
                            return JSON.stringify(options);
                        }
                    },
                    schema: {
                        cube: {
                            dimensions: {
                                username: { caption: "Нэвтрэх нэр" },
                                firstName: { caption: "Овог" },
                                lastName: { caption: "Нэр" },
                                position: { caption: "Албан тушаал" }
                            },
                            measures: {
                                "Count": { field: "username", aggregate: "count" }
                            }
                        }
                    },
                    columns: [{ name: "position.comCdNm"} ],
                    rows: [{ name: "username", expand: true }],
                    measures: ["Count"]
                });
                $scope.options = {
                    columnWidth: 200,
                    height: function () {
                        return $(window).height() - 110;
                    },
                    filterable: true,
                    excel: {
                        fileName: "Kendo UI PivotGrid Export.xlsx",
                        proxyURL: "https://demos.telerik.com/kendo-ui/service/export",
                        filterable: true
                    },
                    dataSource: $scope.dataSource
                };
            }
        ]
    );
