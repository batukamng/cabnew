angular
    .module('altairApp')
    .controller(
        'form50Ctrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$filter',
            '$timeout',
            'mainService',
            'fileUpload',
            '$http',
            'commonDataSource',
            'sweet',
            '__env',
            function ($rootScope, $state, $scope, $filter, $timeout, mainService, fileUpload, $http,commonDataSource, sweet, __env) {
                $scope.user = JSON.parse(localStorage.getItem('currentUser')).user;
                $scope.downloadReport = function (i, repType,noteId) {
                    if (i === 1) {
                        $scope.repType='html';
                        $http.get('/api/adt/main/report/html/'+repType+'/'+noteId)
                            .then(function (response) {
                                $scope.loader = false;
                                var reportData = response.data;
                                var c = new Blob([reportData], { type: "text/html" });
                                const reader = new FileReader();
                                reader.addEventListener('loadend', () => {
                                    $("#html2Viewer").html(reader.result);
                                });
                                reader.readAsText(c);
                            });
                    }
                    else if (i === 2) {
                        $scope.repType='xlsx';
                    }
                    else if (i === 3) {
                        $scope.repType='docx';
                    }
                    else {
                        $scope.repType='pdf';
                    }
                }

                $scope.$on("formChanged50", function (event, args, data) {
                    $timeout(function (){
                        $scope.initForm(data,args);
                    })
                });
                $scope.initForm=function (appId,formId){
                    $scope.appId = appId;
                    $scope.formId = formId;
                    $scope.repType='html';
                    $scope.downloadReport(1,appId,formId)
                }
            }
        ]
    );
