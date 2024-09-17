angular.module("altairApp")
    .controller("planWorkerCtrl", [
        "$rootScope",
        "$state",
        "$scope",
        "$timeout",
        "mainService",
        "commonDataSource",
        "sweet",
        "Upload",
        "__env",
        function ($rootScope, $state, $scope, $timeout, mainService, commonDataSource, sweet, Upload, __env) {
            $scope.user = JSON.parse(localStorage.getItem("currentUser")).user;
            $("#header_main").attr("style", "filter: none !important;padding: 8px 25px");
            $scope.menuData = JSON.parse(localStorage.getItem("menuData"));
            $scope.planYr = 2026;
            $scope.selectedTab = 'tab1';
            $scope.editable = false;
            $scope.bags = [];
            $scope.workers = [];
            $scope.bagObj = {};
            $scope.detailShow=false;

            $scope.loadDetail = function (id,userId){
                mainService.withResponse("get", "/api/admin/v1/item/cab-plan-user-obj/"+ id+'/'+ userId).then(function (response) {
                    if(response.status===200){
                        $scope.details=response.data;
                        $scope.childDetails=response.data.filter(v=> v.parentId!=null);
                    }
                });
                mainService.withResponse("get", "/api/admin/v1/item/cab-plan-user-criteria/"+ id+'/'+ userId).then(function (response) {
                    if(response.status===200){
                        $scope.criterias=response.data;
                    }
                });

                mainService.withResponse("get", "/api/admin/v1/list/cab-plan-obj/"+id).then(function (response) {
                    if(response.status===200){
                        $scope.groups=response.data;
                    }
                });
            }
            $scope.loadEvent = function (id,userId){
                mainService.withResponse("get", "/api/admin/v1/multiple/cab-plan-user-objective/"+id+"/"+userId).then(function (response) {
                    if(response.status===200){
                        $scope.objectives=response.data;
                        $scope.objectives2=response.data;
                    }
                });
            }

            mainService.withdomain("get", __env.apiUrl() + "/api/admin/v1/multiple/user-plan/" + $scope.planYr+'/'+ $scope.user.id).then(function (data) {
                if(data.length>0){
                    $scope.app=data[0];
                    $scope.detailShow=true;
                    if($scope.app.userStatusNm==='Хадгалсан' || $scope.app.userStatusNm==='Цуцалсан'){
                        $scope.editable = true;
                    }

                    $scope.loadDetail($scope.app.id,$scope.app.userId);
                    $scope.loadEvent($scope.app.id,$scope.app.userId);
                   // $state.go("restricted.cabinet.worker-plan-edit", {id: data[0].id,userId: $scope.user.id});

                    mainService.withdomain("get", "/api/nms/user/org/" + $scope.app.orgId).then(function (data) {
                        $scope.workers = data;
                    });
                }
                else{
                    $scope.dataSource = new kendo.data.DataSource({
                        transport: {
                            read: {
                                url: __env.apiUrl() + "/api/admin/v1/cab-plan-user/list",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                data: {
                                    sort: [{field: "id", dir: "desc"}],
                                },
                                beforeSend: function (req) {
                                    req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
                                },
                            },
                            parameterMap: function (options) {
                                return JSON.stringify(options);
                            },
                        },
                        schema: {
                            data: "data",
                            total: "total",
                            model: {
                                id: "id",
                                fields: {
                                    id: {type: "number", nullable: true},
                                    useYn: {type: "number", defaultValue: 1}
                                },
                            },
                        },
                        filter: {
                            logic: "and",
                            filters: [
                                {
                                    field: "useYn",
                                    operator: "eq",
                                    value: 1,
                                },
                                {
                                    field: "userId",
                                    operator: "eq",
                                    value: $scope.user.id
                                },
                                {
                                    field: "statusNm",
                                    operator: "neq",
                                    value: 'Хадгалсан'
                                }
                            ],
                        },
                        pageSize: 20,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true,
                    });
                    $scope.mainGrid = {
                        filterable: {
                            mode: "row",
                            extra: false,
                            operators: {
                                // redefine the string operators
                                string: {
                                    contains: "Агуулсан",
                                    startswith: "Эхлэх утга",
                                    eq: "Тэнцүү",
                                    gte: "Их",
                                    lte: "Бага",
                                },
                            },
                        },
                        sortable: true,
                        resizable: true,
                        pageable: {
                            refresh: true,
                            pageSizes: true,
                            buttonCount: 5,
                        },
                        // toolbar: ["excel"],
                        columns: [
                            {
                                title: "#",
                                headerAttributes: {class: "checkbox-align"},
                                attributes: {style: "text-align: center;"},
                                template: "#= ++record #",
                                width: 50,
                            },
                            // {
                            //     field: "orgNm",
                            //     filterable: {
                            //         cell: {
                            //             operator: "contains",
                            //             suggestionOperator: "contains",
                            //             showOperators: false
                            //         }
                            //     },
                            //     title: "Байгууллага",
                            // },
                            // {
                            //     field: "userNm",
                            //     filterable: {
                            //         cell: {
                            //             operator: "contains",
                            //             suggestionOperator: "contains",
                            //             showOperators: false
                            //         }
                            //     },
                            //     title: "Албан хаагч",
                            // },

                            {
                                field: "fullDesc",
                                filterable: {
                                    cell: {
                                        operator: "contains",
                                        suggestionOperator: "contains",
                                        showOperators: false
                                    }
                                },
                                title: "Төлөвлөгөөний нэр",
                            },
                            {
                                field: "planYr",
                                filterable: {
                                    cell: {
                                        operator: "contains",
                                        suggestionOperator: "contains",
                                        showOperators: false
                                    }
                                },
                                title: "Огноо",
                                headerAttributes: { "class": "checkbox-align"},
                                attributes: {style: "text-align: center;"},
                                width:100
                            },
                            {
                                field: "userStatusNm",
                                filterable: {
                                    cell: {
                                        operator: "contains",
                                        suggestionOperator: "contains",
                                        showOperators: false
                                    }
                                },
                                title: "Төлөв",
                                headerAttributes: { "class": "checkbox-align"},
                                attributes: {style: "text-align: center;"},
                                template: "<span ng-if='dataItem.userStatusNm==\"Баталсан\"' ng-click='' class='cursor-pointer bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300' ng-bind='dataItem.userStatusNm'></span><span ng-if='dataItem.userStatusNm==\"Илгээсэн\"' ng-cloak='' class='cursor-pointer bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300' ng-bind='dataItem.userStatusNm'></span><span ng-if='dataItem.userStatusNm==\"Цуцалсан\"' ng-cloak='' class='cursor-pointer bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300' ng-bind='dataItem.userStatusNm'></span></div><span ng-if='dataItem.userStatusNm==\"Хадгалсан\"' ng-cloak='' class='cursor-pointer bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300' ng-bind='dataItem.userStatusNm'></span></div>",
                                width:100
                            },
                            {
                                field: "reason",
                                filterable: {
                                    cell: {
                                        operator: "contains",
                                        suggestionOperator: "contains",
                                        showOperators: false
                                    }
                                },
                                headerAttributes: { "class": "checkbox-align"},
                                attributes: {style: "text-align: center;"},
                                title: "Тайлбар",
                                width: 100,
                            },
                            // {
                            //     headerAttributes: { "class": "checkbox-align"},
                            //     attributes: {style: "text-align: center;"},
                            //     title: "Гүйцэтгэлийн зорилт, арга хэмжээ",
                            //     columns:[
                            //         {
                            //             field: "cnt01",
                            //             filterable: {
                            //                 cell: {
                            //                     operator: "eq",
                            //                     suggestionOperator: "eq",
                            //                     showOperators: false
                            //                 }
                            //             },
                            //             headerAttributes: { "class": "checkbox-align"},
                            //             attributes: {style: "text-align: center;"},
                            //             title: "Үндсэн",
                            //             width: 120,
                            //         },
                            //         {
                            //             field: "subCnt01",
                            //             filterable: {
                            //                 cell: {
                            //                     operator: "eq",
                            //                     suggestionOperator: "eq",
                            //                     showOperators: false
                            //                 }
                            //             },
                            //             headerAttributes: { "class": "checkbox-align"},
                            //             attributes: {style: "text-align: center;"},
                            //             title: "Дэд",
                            //             width: 120,
                            //         },
                            //     ]
                            // },
                            // {
                            //     headerAttributes: { "class": "checkbox-align"},
                            //     attributes: {style: "text-align: center;"},
                            //     title: "Мэдлэг, ур чадвараа дээшлүүлэх",
                            //     columns:[
                            //         {
                            //             field: "cnt02",
                            //             filterable: {
                            //                 cell: {
                            //                     operator: "contains",
                            //                     suggestionOperator: "contains",
                            //                     showOperators: false
                            //                 }
                            //             },
                            //             headerAttributes: { "class": "checkbox-align"},
                            //             attributes: {style: "text-align: center;"},
                            //             title: "Үндсэн",
                            //             width: 120,
                            //         },
                            //         {
                            //             field: "subCnt02",
                            //             filterable: {
                            //                 cell: {
                            //                     operator: "eq",
                            //                     suggestionOperator: "eq",
                            //                     showOperators: false
                            //                 }
                            //             },
                            //             headerAttributes: { "class": "checkbox-align"},
                            //             attributes: {style: "text-align: center;"},
                            //             title: "Дэд",
                            //             width: 120,
                            //         },
                            //     ]
                            // },
                            // {
                            //     headerAttributes: { "class": "checkbox-align"},
                            //     attributes: {style: "text-align: center;"},
                            //     title: "Нэмэлт",
                            //     columns:[
                            //         {
                            //             field: "cnt03",
                            //             filterable: {
                            //                 cell: {
                            //                     operator: "contains",
                            //                     suggestionOperator: "contains",
                            //                     showOperators: false
                            //                 }
                            //             },
                            //             headerAttributes: { "class": "checkbox-align"},
                            //             attributes: {style: "text-align: center;"},
                            //             title: "Үндсэн",
                            //             width: 100,
                            //         },
                            //         {
                            //             field: "subCnt03",
                            //             filterable: {
                            //                 cell: {
                            //                     operator: "eq",
                            //                     suggestionOperator: "eq",
                            //                     showOperators: false
                            //                 }
                            //             },
                            //             headerAttributes: { "class": "checkbox-align"},
                            //             attributes: {style: "text-align: center;"},
                            //             title: "Дэд",
                            //             width: 100,
                            //         },
                            //     ]
                            // },
                        ],
                        dataBinding: function () {
                            record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                        },
                        editable: "inline",
                        scrollable: true,
                        height: function () {
                            if ($scope.menuData.pageType === 0) {
                                return $(window).height() - 160;
                            }
                            return $(window).height() - 110;
                        }
                    };

                    if (localStorage.getItem("buttonData").includes("read")) {
                        $scope.mainGrid.toolbar = ["excel", "search"];
                    }
                    if (localStorage.getItem("buttonData").includes("update") || localStorage.getItem("buttonData").includes("edit")) {
                        $scope.mainGrid.columns.push({
                            command: [
                                {
                                    template:
                                        '<div class="flex justify-center gap-3"><button class="grid-btn" ng-click=\'gotoDetail(dataItem)\'><div class="nimis-icon see "></div>Харах</button></div>',
                                },
                            ],
                            title: "&nbsp;",
                            headerAttributes: {class: "rightMinus"},
                            attributes: {class: "rightMinus uk-text-center"},
                            sticky: true,
                            width: 100,
                        });
                    }
                    $scope.gotoDetail = function (item) {
                        $state.go("restricted.cabinet.worker-plan-edit", {id: item.id,userId: item.userId});
                    }
                }
            });

            var modalRemove = UIkit.modal("#modal_form_remove", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true
            });

            let crudServiceBaseUrl = "/api/cab/criteria";
            $scope.selectDataSource = new kendo.data.DataSource({
                batch: true,
                transport: {
                    read:  {
                        url: crudServiceBaseUrl + "/list",
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
                        data: {filter: {logic: "and", filters: [{field: "orgId", operator: "eq", value: JSON.parse(localStorage.getItem("currentUser")).user.orgId}]},"sort": [{field: 'id', dir: 'desc'}]},
                        beforeSend: function (req) {
                            req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                        }
                    },
                    create: {
                        url: crudServiceBaseUrl + "/submit",
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
                    data: "data",
                    total: "total",
                    model: {
                        id: "id",
                        fields: {
                            id: { type: "number" },
                            title: { type: "string" }
                        }
                    }
                },
                pageSize: 20,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            });

            $scope.addNew=function(widgetId, value) {
                let widget = $("#" + widgetId).getKendoAutoComplete();
                let dataSource = widget.dataSource;

                if (confirm("Бүртгэх үү?")) {
                    dataSource.add({
                        id: 0,
                        title: value
                    });

                    dataSource.one("sync", function() {
                        widget.close();
                    });

                    dataSource.sync();
                }
            };
            $scope.selectionOptions = {
                dataSource: $scope.selectDataSource,
                filter: "startswith",
                dataTextField: "title",
                dataValueField: "title",
                noDataTemplate: $("#noDataTemplate").html()
            };

            $scope.removePurpose = function (item) {
                $scope.removeItem = {useYn: 1, detId:item.id,userId:$scope.app.userId};
                $timeout(() => $rootScope.clearForm("removeForm"));
                modalRemove.show();
            }
            $scope.formRemoveSubmit = function () {
                var validator = $("#removeForm").kendoValidator().data("kendoValidator");
                if (validator.validate()) {
                    var method = "post";
                    if ($scope.removeItem.id !== undefined && $scope.removeItem.id !== null) method = "put";
                    mainService.withdata("post", "/api/cab/plan/detail/request/submit", $scope.removeItem).then(function (data) {
                        modalRemove.hide();
                        $scope.loadDetail();
                    });
                }
            };

            $scope.types=[{"comCd":"А","objType":"01","objTypeNm":"Гүйцэтгэлийн зорилт, арга хэмжээ"},{"comCd":"Б","objType":"02","objTypeNm":"Мэдлэг, ур чадвараа дээшлүүлэх зорилт, арга хэмжээ"},{"comCd":"В","objType":"03","objTypeNm":"Нэмэлт"}];

            var modalDetail = UIkit.modal("#modal_form_detail", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true
            });
            $scope.minDate = new Date(2018, 0, 1, 0, 0, 0);
            $scope.minDateApp = new Date(2020, 0, 1, 0, 0, 0);

            $scope.addDetail = function (item,objType,tp,childItem) {
                $scope.formTp=tp;
                $scope.detailItem = {useYn: 1, objType:objType,eventType:'01',userType:'02',userId:$scope.app.userId,criterias:[{}]};


                if(item!=null && objType==='01'){
                    console.log(objType)
                    $scope.detailItem.objId=item.objId;
                    $scope.detailItem.parentId=item.id;
                    $scope.detailItem.parentTitle=item.title;
                    $scope.parents=$scope.details.filter(v => v.objId===item.objId && v.parentId===item.id);
                }
                else if(item!=null && objType!=='01'){
                    $scope.detailItem.objId=item.id;
                    // $scope.detailItem.parentId=item.id;
                    $scope.parents=$scope.details.filter(v => v.objId===item.id && v.parentId===null);
                }
                else{
                    $scope.detailItem.planId=$stateParams.id;
                }

                if($scope.detailItem.objType==='01'){
                    $scope.detailItem.parentId=item.id;
                    $scope.detailItem.parentTitle=item.title;
                }

                if($scope.formTp===0){
                    $scope.detailItem.parentId=childItem.id;
                }

                $timeout(() => $rootScope.clearForm("detailForm"));
                modalDetail.show();

                $scope.fromDateChanged = function (dt) {
                    $scope.minDate = new Date(dt);
                };
                $scope.toDateChanged = function (dt) {
                    $scope.maxDate = dt;
                };
                $("#products").val('');
            }
            $scope.updateDetail = function (item) {
                $scope.formTp=3;
                //  $scope.detailItem = angular.copy(item);
                mainService.withdomain("get", "/api/cab/plan/detail/"+item.id).then(function (data) {
                    $scope.detailItem = data;
                    if($scope.detailItem.criterias.length>0){
                        for(var i=0; i<$scope.detailItem.criterias.length;i++){
                            var obj=$scope.criterias.filter((v)=> v.criteria==$scope.detailItem.criterias[i].criteria)[0];
                            $scope.detailItem.criterias[i].critObj= {title:obj.criteria}
                        }
                    }

                    /*  if(data.parentId!=null){
                          $scope.parents=$scope.details.filter(v => v.objId===item.objId && v.parentId===null);
                      }*/
                });

                if(item.parentId!=null && item.objType!=='01'){
                    $scope.parents=$scope.details.filter(v => v.id===item.parentId && v.parentId===null);
                }
                else{
                    $scope.parents=$scope.details.filter(v => v.id===item.parentId);
                }

                modalDetail.show();
                $scope.fromDateChanged = function () {
                    $scope.minDate = new Date($scope.detailItem.srtDt);
                };
                $scope.toDateChanged = function () {
                    $scope.maxDate = $scope.maxDateApp;
                };
            }
            $scope.deleteDetail = function (index,item) {
                sweet.show(
                    {
                        title: "Санамж",
                        text: "Та Устгах товчийг дарснаар мэдээлэл дахин сэргэх боломжгүй болохыг анхаарна уу!!!",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Тийм",
                        cancelButtonText: "Үгүй",
                        closeOnConfirm: true,
                        closeOnCancel: true,
                    },
                    function (inputvalue) {
                        if (inputvalue) {
                            mainService.withdomain("delete", "/api/cab/plan/detail/"+item.id).then(function (data) {
                                $scope.loadDetail();
                            });
                        }
                    }
                );
            }
            $scope.formDetailSubmit = function () {
                var validator = $("#validatorDetail").kendoValidator().data("kendoValidator");
                var crits=[];
                if($scope.detailItem.criterias.length>0){
                    for(var i=0; i<$scope.detailItem.criterias.length;i++){
                        var critObj=$scope.detailItem.criterias[i].critObj;
                        if(critObj===null){
                            $scope.detailItem.criterias[i].title=$("#criteria"+i).val();
                        }
                        else{
                            $scope.detailItem.criterias[i].title=$scope.detailItem.criterias[i].critObj.title;
                        }
                        crits.push($scope.detailItem.criterias[i]);
                    }

                    $scope.detailItem.criterias=crits;
                }
                /*    if($scope.detailItem.critObj===null){
                        $scope.detailItem.criteria= $("#products").val();
                    }
                    else{
                        $scope.detailItem.criteria= $scope.detailItem.critObj.title;
                    }*/
                /*    if($scope.detailItem.eventType==='01'){
                        $scope.detailItem.parentId=null;
                    }*/
                if (validator.validate()) {
                    var method = "post";
                    $scope.detailItem.userId=$scope.app.userId;
                    if ($scope.detailItem.id !== undefined && $scope.detailItem.id !== null) method = "put";
                    mainService.withdata("post", "/api/cab/plan/detail/user/submit", $scope.detailItem).then(function (data) {
                        modalDetail.hide();
                        $scope.loadDetail();
                    });
                }
            };

            var modalCriteria = UIkit.modal("#modal_form_criteria", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true
            });
            $scope.updateCriteria = function (item) {
                $scope.criteriaItem = item;
                modalCriteria.show();
            }
            $scope.formCriteriaSubmit = function () {
                var validator = $("#validatorCriteria").kendoValidator().data("kendoValidator");
                if (validator.validate()) {
                    var method = "post";
                    if($scope.criteriaItem.baseline>100){
                        $scope.criteriaItem.baseline=100;
                    }
                    if($scope.criteriaItem.firstHalf>100){
                        $scope.criteriaItem.firstHalf=100;
                    }
                    if($scope.criteriaItem.secondHalf>100){
                        $scope.criteriaItem.secondHalf=100;
                    }
                    if ($scope.criteriaItem.id !== undefined && $scope.criteriaItem.id !== null) method = "put";
                    mainService.withdata(method, "/api/cab/plan/criteria", $scope.criteriaItem).then(function (data) {
                        modalCriteria.hide();
                        $scope.loadDetail();
                    });
                }
            };
            $scope.sendPlan=function (){
                sweet.show(
                    {
                        title: "Санамж",
                        text: "Та ИЛГЭЭХ товчийг дарснаар төлөвлөгөөний мэдээллийг дахин засах боломжгүй болохыг анхаарна уу!!!",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Илгээх",
                        cancelButtonText: "Үгүй",
                        closeOnConfirm: true,
                        closeOnCancel: true,
                    },
                    function (inputvalue) {
                        if (inputvalue) {
                            var obj = {
                                planId: $scope.app.id,
                                userId: $scope.app.userId,
                                status: "sent",
                                name: "Төлөвлөгөөний мэдээлэл бүртгэж илгээсэн.",
                            };
                            mainService.withdata("post", __env.apiUrl() + "/api/cab/plan/user/change-status", obj).then(function (data) {
                                $rootScope.alert(true, "Амжилттай илгээлээ.");
                                $state.go("restricted.cabinet.worker-plan");
                            });
                        }
                    }
                );
            }
            $scope.changeStatus=function (){
                sweet.show(
                    {
                        title: "Санамж",
                        text: "Та БАТЛАХ товчийг дарснаар төлөвлөгөөний мэдээлэл албан хаагчид хуваарилагдана",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Илгээх",
                        cancelButtonText: "Үгүй",
                        closeOnConfirm: true,
                        closeOnCancel: true,
                    },
                    function (inputvalue) {
                        if (inputvalue) {
                            var obj = {
                                planId: $scope.app.id,
                                userId: $scope.app.userId,
                                status: "approved",
                                name: "Төлөвлөгөө баталсан.",
                            };
                            mainService.withdata("post", __env.apiUrl() + "/api/cab/plan/user/change-status", obj).then(function (data) {
                                $rootScope.alert(true, "Амжилттай илгээлээ.");
                            });
                        }
                    }
                );
            }

            $scope.deleteCriteria = function (index,item) {
                sweet.show(
                    {
                        title: "Санамж",
                        text: "Та Устгах товчийг дарснаар мэдээлэл дахин сэргэх боломжгүй болохыг анхаарна уу!!!",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Тийм",
                        cancelButtonText: "Үгүй",
                        closeOnConfirm: true,
                        closeOnCancel: true,
                    },
                    function (inputvalue) {
                        if (inputvalue) {
                            mainService.withdomain("delete", "/api/cab/plan/criteria/"+item.id).then(function (data) {
                                $scope.loadDetail();
                            });
                        }
                    }
                );
            }

            $scope.criteriaDataSource  = new kendo.data.DataSource({
                batch: true,
                transport: {
                    read:  {
                        url: "/api/cab/criteria/list",
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
                        data: { filter: {logic: "and", filters: [{field: "orgId", operator: "eq", value:$scope.user.orgId}]}, sort: [{ field: "id", dir: "asc" }] },
                        beforeSend: function (req) {
                            req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                        }
                    },
                    parameterMap: function (options) {
                        return JSON.stringify(options);
                    }
                },
                schema: {
                    data: function (e){
                        $scope.crits=e.data;
                        return e.data;
                    },
                    total: "total",
                    model: {
                        id: "title",
                        fields: {
                            id: { type: "number" },
                            title: { type: "string" }
                        }
                    }
                },
                pageSize: 20,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            });


            var modalForm = UIkit.modal("#modal_form", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true
            });
            $scope.add = function (objType) {
                $scope.bagObj = {};
                $scope.dataItem = {useYn: 1, orgId: $scope.user.orgId, objType: objType, planId: $scope.app.id};
                $timeout(() => $rootScope.clearForm("userForm"));
                modalForm.show();
            }
            $scope.update = function (item) {
                $scope.bagObj = {};
                if (item.userIds != null && item.userIds.split(",").length > 0) {
                    for (var i = 0; i < item.userIds.split(",").length; i++) {
                        console.log(item.userIds.split(",")[i]);
                        $scope.bagObj[item.userIds.split(",")[i]] = true;
                    }
                }
                $scope.dataItem = item;
                modalForm.show();
            }
            $scope.delete = function (item) {
                sweet.show(
                    {
                        title: "Санамж",
                        text: "Та Устгах товчийг дарснаар мэдээлэл дахин сэргэх боломжгүй болохыг анхаарна уу!!!",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Тийм",
                        cancelButtonText: "Үгүй",
                        closeOnConfirm: true,
                        closeOnCancel: true,
                    },
                    function (inputvalue) {
                        if (inputvalue) {
                            mainService.withdomain("delete", "/api/cab/plan/objective/"+item.id).then(function (data) {
                                $scope.loadEvent();
                                modalForm.hide();
                            });
                        }
                    }
                );
            }
            $scope.formSubmit = function () {
                $scope.dataItem.userArr = [];

                /* for (var ezObj in $scope.bagObj) {
                     var ez = $scope.bagObj[ezObj];
                     if (ez) $scope.dataItem.userArr.push(ezObj);
                 }*/
                $scope.dataItem.userArr.push($scope.user.id.toString());
                var validator = $("#validator").kendoValidator().data("kendoValidator");
                if (validator.validate()) {
                    loader.show();
                    modalForm.hide();
                    var method = "post";
                    if ($scope.dataItem.id !== undefined && $scope.dataItem.id !== null) method = "put";
                    mainService.withdata("post", "/api/cab/plan/objective/submit", $scope.dataItem).then(function (data) {
                        modalForm.hide();
                        $scope.loadDetail();
                        loader.hide();
                        $rootScope.alert(true, "Амжилттай хадгаллаа");
                    });
                }
            };


            var modalFormPurpose = UIkit.modal("#modal_form_purpose", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true
            });
            $scope.addAdditionalPurpose=function (item,type){
                $scope.purposeItem = {useYn: 1,objType:'03',planId:$scope.app.id};
                if(type===1){
                    $scope.purposeItem.parentId = item.id;
                    $scope.purposeItem.typeId = item.typeId;
                }
                $timeout(() => $rootScope.clearForm("purposeForm"));
                modalFormPurpose.show();
            }
            $scope.addPurpose=function (item,type){
                $scope.purposeItem = {useYn: 1,objType:item.objType,planId:$scope.app.id};
                if(type===1){
                    $scope.purposeItem.parentId = item.id;
                    $scope.purposeItem.typeId = item.typeId;
                }
                $timeout(() => $rootScope.clearForm("purposeForm"));
                modalFormPurpose.show();
            }
            $scope.updatePurpose=function (item){
                $scope.purposeItem = item;
                $timeout(() => $rootScope.clearForm("purposeForm"));
                modalFormPurpose.show();
            }
            $scope.deletePurpose=function (item){
                modalFormPurpose.hide();
                sweet.show(
                    {
                        title: "Санамж",
                        text: "Та Устгах товчийг дарснаар мэдээлэл дахин сэргэх боломжгүй болохыг анхаарна уу!!!",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Тийм",
                        cancelButtonText: "Үгүй",
                        closeOnConfirm: true,
                        closeOnCancel: true,
                    },
                    function (inputvalue) {
                        if (inputvalue) {
                            mainService.withdomain("delete", "/api/cab/plan/objective/"+item.id).then(function (data) {
                                $scope.loadEvent();
                            });
                        }
                    }
                );
            }
            $scope.formPurposeSubmit = function () {
                //  $scope.dataItem.userArr = [];
                var validator = $("#purposeForm").kendoValidator().data("kendoValidator");
                if (validator.validate()) {
                    var method = "post";
                    $scope.purposeItem.userArr = [];
                    $scope.purposeItem.userId=$scope.user.id;

                    if ($scope.purposeItem.id !== undefined && $scope.purposeItem.id !== null) method = "put";
                    mainService.withdata("post", "/api/cab/plan/objective/submit", $scope.purposeItem).then(function (data) {
                        modalFormPurpose.hide();
                        $timeout(() => $rootScope.clearForm("purposeForm"));
                        $scope.loadEvent();
                    });
                }
            };

            $scope.$watch("childDetails", () => {
                $scope.$evalAsync(function() {
                    $.each($(".des-dugaar"), (i, v) => {
                        $(v).html(i + 1);
                    });
                });
            });
            $scope.$watch("objectives2", () => {
                $scope.$evalAsync(function() {
                    $.each($(".des-dugaar2"), (i, v) => {
                        $(v).html(i + 1);
                    });
                });
            });
            $scope.$watch("objectives", () => {
                $scope.$evalAsync(function() {
                    $.each($(".des-dugaar3"), (i, v) => {
                        $(v).html(i + 1);
                    });
                });
            });
        },
    ]);
