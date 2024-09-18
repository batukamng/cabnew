altairApp
    .controller('pdfViewCtrl', [
        '$rootScope',
        '$scope',
        'mainService',
        '__env',
        '$timeout',
        function ($rootScope, $scope, mainService, __env, $timeout) {
            var ctrl = this;
            $scope.user = JSON.parse(sessionStorage.getItem('currentUser')).user;

            $scope.$on("loadPdf", function (event, step,id) {
                loadApp(id);
            });
            var pdfViewer = $("#pdfViewer").kendoPDFViewer({ width: "100%", height: "100%" }).data("kendoPDFViewer");
            function loadApp(id) {
                if(id!=0){
                    UIkit.modal('#modal_loader', {
                        modal: false,
                        keyboard: false,
                        bgclose: false,
                        center: true
                    }).show();
                    mainService.withdata('get', __env.apiUrl() + '/api/file/item/'+id)
                        .then(function (item) {
                           $scope.file=item;
                            if(item.mimeType =='pdf'){
                                pdfViewer.fromFile(item.uri);
                                UIkit.modal("#modal_pdf", {
                                    modal: false,
                                    keyboard: false,
                                    bgclose: false,
                                    center: false
                                }).show();
                            }
                                UIkit.modal('#modal_loader').hide();
                            }
                        );
                }
            }
        }
    ]);
