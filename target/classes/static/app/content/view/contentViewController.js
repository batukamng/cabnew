angular
    .module('altairApp')
    .controller(
        'contentViewCtrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$timeout',
            'mainService',
            'commonDataSource',
            '__env',
            function ($rootScope, $state, $scope, $timeout,mainService,commonDataSource, __env) {
                $scope.success=false;
                $scope.show4=true;
                $scope.planYr=localStorage.getItem('planYr');
                $scope.$on("loadContent", function (event, step,data) {
                    if(data!=0){
                        $scope.tenderId=data.id;
                        $scope.cnt=data;
                        $timeout(function (){
                            $(".lightgallery").each(function () {
                                $(this).lightGallery();
                            });
                        },100);
                    }
                });
                $scope.stat = function(step, back) {
                    if (back) {
                        $(".stat-screen").hide();
                        $("#main_content").show();
                    } else {
                        $("#main_content").hide();
                        $("#form"+step).show();
                    }
                    $rootScope.$broadcast("loadBack", 1);
                }

                $scope.editApp = function (){
                    $("#main_content").hide();
                    $("#form2").show();
                    $("#form1").hide();
                    $rootScope.$broadcast("editContent", 1,$scope.cnt);
                }

                $scope.tenderTypes=[{"text":"Ажил","value":"2"},{"text":"Зөвлөх үйлчилгээ","value":"3"},{"text":"Зөвлөхөөс бусад үйлчилгээ","value":"4"},{"text":"Бараа","value":"1"},{"text":"Концесс","value":"5"}];

                var pdfViewer = $("#pdfViewer").kendoPDFViewer({ width: "100%", height: "100%" }).data("kendoPDFViewer");
                $scope.viewFile = function (item){
                    $scope.viewItem = item;
                    if(item.type =='pdf'){
                        pdfViewer.fromFile(item.uri);
                        UIkit.modal("#modal_pdf", {
                            modal: false,
                            keyboard: false,
                            bgclose: false,
                            center: false
                        }).show();
                    }
                };
            }
        ]
    );
