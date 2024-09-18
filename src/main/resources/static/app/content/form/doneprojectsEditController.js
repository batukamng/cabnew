angular
    .module('altairApp')
    .controller(
        'doneprojectsEditCtrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$timeout',
            'mainService',
            'fileUpload',
            'commonDataSource',
            '__env',
            function ($rootScope, $state, $scope, $timeout, mainService, fileUpload,commonDataSource, __env) {
                $scope.user = JSON.parse(sessionStorage.getItem('currentUser'));
                $scope.planYr=sessionStorage.getItem('planYr');

                $scope.$on("publishDone", function (event, data) {
                    UIkit.modal('#modal_loader').hide();
                    $scope.appr = data;
                    if ($scope.appr.done != null) {
                        $scope.done = $scope.appr.done;
                    } else {
                        $scope.done = {
                            "gallery": []
                        };
                    }
                    console.log($scope.done);
                    if ($scope.done.gallery.length == 0) {
                        mainService.withdomain('get', __env.apiUrl() + '/api/cnt/done/oldgallery/' + $scope.appr.codingBlock).then(function (data) {
                            $timeout(function() {
                                $scope.done.gallery = data;
                            });
                        });
                    }
                    $timeout(function (){
                        $(".lightgallery").each(function () {
                            $(this).lightGallery({
                                selector: '.item'
                            });
                        });
                    }, 100);
                });

                var drEvent = $('.dropify2').dropify({
                    messages: {
                        default: 'Зургаа сонгоно уу',
                        replace: 'Солих',
                        remove: 'Болих',
                        error: 'Алдаа үүслээ'
                    }
                });
                $scope.deleteImg = function (index, elementId) {
                    $timeout(function() {
                        $scope.done.gallery.splice(index, 1);
                    });
                }
                var formDataAttach = new FormData();
                $scope.getTheUFilesAttach2 = function ($files) {
                    formDataAttach.delete("file");
                    angular.forEach($files, function (value, key) {
                        formDataAttach.append("file", value);
                    });
                };
                drEvent.on('dropify.fileReady', function(event, element){
                    if (formDataAttach.has("file")) {
                        fileUpload.uploadFileToUrl(__env.apiUrl() + '/api/file/uploadFile', formDataAttach, {
                            headers: {'Content-Type': undefined}
                        }).then(function (resp) {
                            $timeout(function() {
                                $("#galleryAttach .dropify-clear").trigger("click");
                                $scope.done.gallery.push({
                                    id: resp.id,
                                    fileId: resp.id,
                                    uri: resp.fileDownloadUri
                                });
                            });
                        });
                    }
                });

                $scope.notf1Options = {
                    position: {
                        pinned: true,
                        bottom: 25,
                        right: 300
                    },
                    //autoHideAfter: 10,
                    stacking: "up",
                    templates: [{
                        type: "ngTemplate",
                        template: $("#notificationTemplate").html()
                    }]
                };

                $scope.publish = function () {
                    var stepOneValidate = $("#stepOne").kendoValidator().data("kendoValidator");
                    if (stepOneValidate.validate()) {
                        mainService.withdata('post', __env.apiUrl() + '/api/cnt/done/create', $scope.done).then(function (data) {
                            mainService.withdata('post', __env.apiUrl() + '/api/cnt/done/publish/'+$scope.appr.id, data.id).then(function() {
                                $scope.back();
                                $rootScope.alert(true, "Амжилттай нийтэллээ");
                            });
                        });
                    }
                }

                $scope.back = function() {
                    $("#appData").data("kendoGrid").dataSource.read();
                    $("#publishScreen").hide();
                    $("#main_content").show();
                }
            }
        ]
    );
