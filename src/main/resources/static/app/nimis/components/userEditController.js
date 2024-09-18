angular
    .module('altairApp')
    .controller(
        'userEditCtrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$filter',
            '$timeout',
            'mainService',
            'fileUpload',
            'commonDataSource',
            'sweet',
            '__env',
            function ($rootScope, $state, $scope, $filter, $timeout, mainService, fileUpload, commonDataSource, sweet, __env) {
                $scope.user = JSON.parse(sessionStorage.getItem('currentUser')).user;

                $scope.levelDataSource=[];
             /*   if($scope.user.level!=null && $scope.user.level.levelSubs.length>0){
                    for (var i = 0; i < $scope.user.level.levelSubs.length; i++) {
                        if($scope.user.lvlId===$scope.user.level.levelSubs[i].levId && $scope.user.posId===$scope.user.level.levelSubs[i].posId){
                            $scope.levelDataSource=$scope.user.level.levelSubs[i].levels;
                        }
                    }
                }*/

                if($scope.user.level!=null && $scope.user.level.level.levels.length>0){
                    $scope.levelDataSource= $scope.user.level.level.levels;
                }

                $scope.userTypeDataSource = commonDataSource.urlDataSource("/api/nms/resource/commonCode/list",
                    JSON.stringify({
                        filter: {
                            logic: "and",
                            filters: [{field: "useYn", operator: "eq", value: 1}, {
                                field: "grpCd",
                                operator: "eq",
                                value: "userType"
                            }, {field: "parentId", operator: "isnull", value: false}]
                        }, sort: [{field: "id", dir: "desc"}]
                    })
                );

                $scope.tezTypeDataSource = commonDataSource.urlDataSource("/api/nms/resource/governor/list",
                    JSON.stringify({
                        filter: {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1}]},
                        sort: [{field: "id", dir: "desc"}]
                    })
                );

                $scope.ttzTypeDataSource = commonDataSource.urlDataSource("/api/nms/resource/central/list",
                    JSON.stringify({
                        filter: {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1}]},
                        sort: [{field: "id", dir: "desc"}]
                    })
                );

                $scope.organizationDataSource = commonDataSource.urlDataSource("/api/nms/resource/organization/list",
                    JSON.stringify({
                        filter: {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1}]},
                        sort: [{field: "id", dir: "desc"}]
                    })
                );

                $scope.amgDataSource = commonDataSource.urlDataSource("/api/nms/resource/province/list",
                    JSON.stringify({
                        filter: {
                            logic: "and",
                            filters: [{field: "parentId", operator: "isnull", value: true}, {
                                field: "useYn",
                                operator: "eq",
                                value: 1
                            }]
                        }, sort: [{field: "id", dir: "desc"}]
                    })
                );
                $scope.sumDataSource = commonDataSource.urlDataSource("/api/nms/resource/province/list",
                    JSON.stringify({
                        filter: {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1}]},
                        sort: [{field: "id", dir: "desc"}]
                    })
                );

                $scope.roleDataSource = commonDataSource.urlDataSource("/api/nms/resource/role/list",
                    JSON.stringify({
                        filter: {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1}]},
                        sort: [{field: "id", dir: "desc"}]
                    })
                );
                $scope.userItem = {};
                $scope.requireList = [];
                $scope.roles = [];

                $scope.levelTypeSelect = function (selected) {
                    UIkit.modal("#modal_loader").show();
                    mainService.withdata("GET", __env.apiUrl() + "/api/nms/user/level/pos/" + selected.id).then(function (res) {
                        UIkit.modal("#modal_loader").hide();
                        $timeout(() => {
                            $scope.userTypes = res;
                            setTimeout(function ( ){
                                $("#typeId-list").parent().parent().css("height", $scope.userTypes.length * 30 + "px");
                                $("#typeId-list").parent().css("height", $scope.userTypes.length * 30 + "px");
                            }, 500);
                        });
                       /* if ($scope.userItem.userType) {
                            $scope.userTypeSelect({dataItem: $scope.userItem.userType});
                        }*/
                    });
                };
                $scope.userTypeSelect = function (selected) {
                    $scope.roleDataSource = [];
                    $scope.requireList=[];
                    mainService.withdata("GET", __env.apiUrl() + "/api/nms/user/level/related/" + $scope.userItem.lvlId + "/" + selected.id).then(function (res) {
                        $timeout(() => {
                          //  $scope.userItem.typeId = selected.id;
                            $scope.userItem.typeId = selected.id;
                            $scope.roleDataSource = res.roles;
                            $scope.requireList = res.requires;
                            if ($scope.userItem.roles != null) {
                                $scope.roles = {};
                                $scope.userItem.roles.map(function (x) {
                                    if ($scope.roleDataSource.filter(role => role.id === x.id).length > 0) {
                                        $scope.roles[x.id] = true;
                                    }
                                });
                            }
                        },100);
                    });


                   /* for (var i = 0; i < $scope.userItem.level.levelTypes.length; i++) {
                        if ($scope.userItem.level.levelTypes[i].posId === selected.id) {
                            $scope.roleDataSource = $scope.userItem.level.levelTypes[i].roles;
                        }
                    }

                    for (var r = 0; r < $scope.userItem.level.levelRequires.length; r++) {
                        if ($scope.userItem.level.levelRequires[r].posId === selected.id) {
                            $scope.requireList = $scope.userItem.level.levelRequires[r].requires;
                        }
                    }*/

                    if ($scope.userItem.roles != null) {
                        $scope.roles = {};
                        $scope.userItem.roles.map(function (x) {
                            if ($scope.roleDataSource.filter(role => role.id === x.id).length > 0) {
                                $scope.roles[x.id] = true;
                            }
                        });
                    }
                };

                $scope.$on("editUser", function (event, step, data) {
                    UIkit.modal('#modal_loader').hide();
                    $scope.userItem = {};
                    if (data !== null && data!==0) {
                        mainService.withdomain('get', __env.apiUrl() + '/api/nms/user/' + step)
                            .then(function (data) {
                                    $scope.userItem = data;
                                    $scope.levelTypeSelect(data.level);
                                    $scope.userItem.userType = data.detail.userType;
                                    $scope.userTypeSelect(data.detail.userType);
                                    $scope.userItem.firstname = data.detail.firstname;
                                    $scope.userItem.lastname = data.detail.lastname;
                                    $scope.userItem.orgId = data.detail.orgId;
                                    $scope.userItem.tezId = data.detail.tezId;
                                    $scope.userItem.ttzId = data.detail.ttzId;
                                    $scope.userItem.amgId = data.detail.amgId;
                                    $scope.userItem.sumId = data.detail.sumId;
                                    $scope.userItem.password = data.password;
                                    $scope.userItem.organization = data.detail.organization;

                                    if(data.detail.orgId!=null){
                                        $scope.organizationDataSource = commonDataSource.urlDataSource("/api/nms/resource/organization/list",
                                        JSON.stringify({
                                            filter: {
                                                logic: "or",
                                                filters: [{field: "id", operator: "eq", value: data.detail.orgId}]
                                            }, sort: [{field: "id", dir: "desc"}]
                                        })
                                    );
                                    }
                                }
                            );
                    }
                });

                $scope.stat = function (step, back) {
                    if (back) {
                        $(".stat-screen").hide();
                        $("#main_content").show();
                    } else {
                        $("#main_content").hide();
                        $("#form" + step).show();
                    }
                    $rootScope.$broadcast("loadBack", 1);
                };
                $scope.togglePanel = function (panelId, btnId) {
                    var panel = $("#" + panelId);
                    var button = $("#" + btnId);
                    if (panel.css("max-height") != "0px") {
                        panel.css("max-height", "0px");
                        button.css("transform", "rotate(0)");
                    } else {
                        panel.css("max-height", panel.prop("scrollHeight") + 30 + "px");
                        button.css("transform", "rotate(90deg)");
                    }
                };

                $scope.submit = function (event) {
                    var validator = $("#contentForm").kendoValidator().data("kendoValidator");
                    if (validator.validate()) {
                        event.preventDefault();
                        console.log($scope.roles);
                        UIkit.modal('#modal_loader', {
                            modal: false,
                            keyboard: false,
                            bgclose: false,
                            center: true
                        }).show();
                        $scope.userItem.rolesArr = [];
                        for (let roleKey in $scope.roles) {
                            let role = $scope.roles[roleKey];
                            if (role) $scope.userItem.rolesArr.push(roleKey);
                        }
                        mainService.withResponse('post', __env.apiUrl() + '/api/nms/user/submit', $scope.userItem)
                            .then(function (response) {
                                    UIkit.modal('#modal_loader').hide();
                                    if (response.status === 200) {
                                        sweet.show('Анхаар!', 'Амжилттай!!!', 'success');
                                        $(".k-grid").data("kendoGrid").dataSource.read();
                                        $rootScope.alert(true, "Амжилттай.");
                                        $timeout(function () {
                                            $scope.stat(2, true);
                                        }, 300);
                                    } else if (response.status === 405) {
                                        $rootScope.alert(false, "Амжилтгүй. Нэвтрэх нэр давхцаж байна:");
                                    }
                                    else if (response.status === 400) {
                                        $rootScope.alert(false, "Амжилтгүй. И-мэйл хаяг давхцаж байна:");
                                    }
                                }
                            );
                    } else {
                        console.log("could not validate");
                    }
                };
            }
        ]
    );
