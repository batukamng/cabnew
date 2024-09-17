angular
    .module('altairApp')
    .controller(
        '1047Ctrl',
        [
            '$rootScope',
            'gridService',
            'mainService',
            '$state',
            '$scope',
            '$timeout',
            '__env',
            'fileUpload',
            '$translate',
            'lcType',
            'step',
            function ($rootScope, gridService, mainService, $state, $scope, $timeout, __env, fileUpload, $translate, lcType, step) {

                $scope.genShow=false;
                $scope.showModal= function(dataItem){
                    if(dataItem!==undefined){
                        $scope.main=dataItem;

                    }
                    else{
                        $scope.main={};
                    }
                    UIkit.modal('#modalForm', {
                        modal: false,
                        keyboard: false,
                        bgclose: false,
                        center: true
                    }).show();
                };


                $scope.yesNoOptions = {
                    dataSource: [{"text":"Тийм","value":1},{"text":"Үгүй","value":0}],
                    dataTextField: "text",
                    dataValueField: "value",
                    optionLabel: "Сонгоно уу...",
                };
                $scope.licTypeOptions = {
                    dataSource: lcType,
                    dataTextField: "text",
                    dataValueField: "value",
                    optionLabel: "Сонгоно уу...",
                };
                $scope.stepOptions = {
                    dataSource: step,
                    dataTextField: "text",
                    dataValueField: "value",
                    optionLabel: "Сонгоно уу...",
                    validation: { required: true }
                };

                $scope.mainGrid = {
                    dataSource: {
                        transport: {
                            read: {
                                url: function (e) {
                                    if(localStorage.getItem("buttonData").includes("read") && JSON.parse(localStorage.getItem('menuData')).link===$state.current.name){
                                        return __env.apiUrl() + "/api/formNotes/list";
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
                            destroy: {
                                url: __env.apiUrl() + "/api/formNotes/delete",
                                contentType: "application/json; charset=UTF-8",
                                type: "DELETE",
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
                                    noteNm: {type: "string", validation: {required: true}},
                                    repTp: {type: "string", validation: {required: true}},
                                    deptId: {type: "string"},
                                    licTp: {type: "string"},
                                    groupTp: {type: "string", validation: {required: true}},
                                    noteDesc: {type: "string", validation: {required: true}},

                                }
                            }
                        },
                        pageSize: 20,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    },
                    //toolbar: kendo.template($("#Radd").html()),
                    // filterable: true,
                    filterable: {
                        mode: "row"
                    },
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
                        {field: "noteNm", headerAttributes: {"class": "columnHeader"},title: "Нэр"},//'{{"Org name" | translate}}'},
                        {field: "licTp",headerAttributes: {"class": "columnHeader"}, values:lcType, title: "ТЗ-ийн төрөл", width: 200},//'{{"Regnum" | translate}}'},
                        {field: "groupTp", headerAttributes: {"class": "columnHeader"}, values:step, title: "Харяалагдах бүлэг", width: 200},//'{{"Web" | translate}}'},
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
                    height: function () {
                        return $(window).height() - 110;
                    }
                };
                if(JSON.parse(localStorage.getItem('privilege'))!==null){
                    var privileges=JSON.parse(localStorage.getItem('privilege'));
                    angular.forEach(privileges, function(value, key) {
                        if(value.name==='READ'){
                            $scope.mainGrid.toolbar = ["excel","search"];
                        }
                        if(value.name==='WRITE'){
                            $scope.mainGrid.toolbar = [{template: "<button class='k-button k-button-icontext md-btn-primary' ng-click='showModal()'><span class=\"k-icon k-i-add\"></span>Нэмэх</button>"},"search"];
                        }
                        if(value.name==='UPDATE'){
                            $scope.mainGrid.columns.push({
                                command: [
                                    //{name: "edit", text: {edit: " ", update: " ", cancel: " "}},
                                    {template: "<button class='k-button k-button-icontext' ng-click='showModal(dataItem)'><span class=\"k-icon k-i-edit\"></span></button>"},
                                    {name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn"}
                                ], title: "&nbsp;", width: 100
                            });
                        }
                    });
                }
                $scope.fileSelected=false;
                $scope.selectFile=function(){
                    $scope.fileSelected=true;
                };

                var formDataAttach = new FormData();
                $scope.getTheFiles = function ($files) {
                    angular.forEach($files, function (value, key) {
                        formDataAttach.append("file", value);
                    });
                };
                $scope.validate = function(event) {
                    event.preventDefault();
                    if ($scope.validator.validate()) {
                        $scope.validationMessage = "Амжилттай!";
                        $scope.validationClass = "valid";
                       /* $scope.getTheFiles = function ($files) {
                            angular.forEach($files, function (value, key) {
                                formDataAttach.append("file", value);
                            });
                        };*/
                        delete $scope.main ['licType'];
                        delete $scope.main ['groupType'];

                        formDataAttach.delete("data");
                        formDataAttach.append("data", JSON.stringify($scope.main));
                        fileUpload.uploadFileToUrl(__env.apiUrl()+'api/formNotes/create',formDataAttach).then(function (data) {
                            console.log(data);
                           /* if(data==="ok"){
                                UIkit.notify("Амжилттай хадгаллаа.", {status: 'success', pos: 'bottom-center'});
                            }
                            else {UIkit.notify("Амжилтгүй.", {status: 'danger', pos: 'bottom-center'});}*/
                            $(".k-grid").data("kendoGrid").dataSource.read();
                            UIkit.modal('#modal_loader').hide();
                            UIkit.modal('#modalForm').hide();
                        });
                    } else {
                        $scope.validationMessage = "Форм-г бүтэн бөглөнө үү...";
                        $scope.validationClass = "invalid";
                    }
                };

                $scope.hasForm= function (){
                    if($scope.main.file==='true'){
                        $scope.main.isfile=false;
                    }
                };

                $scope.syyyync= function (){
                    mainService.withdata('get','api/formNotes/syyyn',$scope.grp).then(function (data) {
                        $scope.getRooms();
                        UIkit.modal("#modal_group").hide();
                    });
                };

            }
        ]
    );
