angular.module("altairApp")
    .controller("planEditCtrl", [
        "$rootScope",
        "$state",
        "$scope",
        "$timeout",
        "mainService",
        "commonDataSource",
        "sweet",
        "item",
        "__env",
        function ($rootScope, $state, $scope, $timeout, mainService, commonDataSource, sweet, item, __env) {
            $scope.user = JSON.parse(localStorage.getItem("currentUser")).user;
            $("#header_main").attr("style", "filter: none !important;padding: 8px 25px");
            $scope.menuData = JSON.parse(localStorage.getItem("menuData"));
            $scope.app = item;
            $scope.selectedTab = 'tab1';
            $scope.editable =true;
            if($scope.app.statusNm==='Баталсан'){
                $scope.editable =false;
            }
            $scope.types=[{"comCd":"А","objType":"01","objTypeNm":"Гүйцэтгэлийн зорилт, арга хэмжээ"},{"comCd":"Б","objType":"02","objTypeNm":"Мэдлэг, ур чадвараа дээшлүүлэх зорилт, арга хэмжээ"},{"comCd":"В","objType":"03","objTypeNm":"Нэмэлт"}];
            $scope.item={};
            $scope.durations=[{"text":"I-улирал",value:"1"},{"text":"II-улирал",value:"2"},{"text":"III-улирал",value:"3"},{"text":"IV-улирал",value:"4"}]
            $scope.bags = [];
            $scope.workers = [];
            $scope.bagObj = {};
            mainService.withdomain("get", "/api/nms/user/org/" + $scope.app.orgId).then(function (data) {
                $scope.workers = data;
            });

            var modalForm = UIkit.modal("#modal_form", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true
            });
            $scope.add = function () {
                $scope.bagObj = {};
                $scope.dataItem = {useYn: 1, orgId: $scope.user.orgId, objType: "01", planId: $scope.app.id};
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
                for (var ezObj in $scope.bagObj) {
                    var ez = $scope.bagObj[ezObj];
                    if (ez) $scope.dataItem.userArr.push(ezObj);
                }
                var validator = $("#validator").kendoValidator().data("kendoValidator");
                if (validator.validate()) {
                    modalForm.hide();
                    var method = "post";
                    if ($scope.dataItem.id !== undefined && $scope.dataItem.id !== null) method = "put";
                    mainService.withdata("post", "/api/cab/plan/objective/submit", $scope.dataItem).then(function (data) {
                        modalForm.hide();
                        $scope.loadEvent();
                    });
                }
            };

            $scope.allChecked=false;
            var modalDetail = UIkit.modal("#modal_form_detail", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true
            });
            $scope.addDetail = function (item,tp) {
                $scope.formTp=tp;
                $timeout(() => {
                    $scope.detailItem = {useYn: 1, objId: item.objId,orgId:$scope.user.orgId,objType:'01',criteria:null,eventType:'01',criterias:[{}]};
                    if(tp===1){
                        $scope.detailItem.parentId=item.id;
                        $scope.detailItem.eventType='02';
                    }
                    else {
                        $scope.detailItem.objId=item.id;
                    }
                    $rootScope.clearForm("detailForm");
                });
                modalDetail.show();
                // selectAll();
                $("#products").val('');
                $timeout(function (){
                    $scope.allChecked=true;
                    $scope.selectAll();
                },200)
            }
            $scope.updateDetail = function (item) {
                $scope.detailItem = angular.copy(item);


            /*    $timeout(function (){
                    if(item.criteria!=null){
                        var obj=$scope.crits.filter((v)=> v.title==item.criteria)[0];
                        $scope.detailItem.critObj= {title:item.criteria};
                    }
                },100);*/

                mainService.withdomain("get", "/api/cab/plan/detail/"+item.id).then(function (data) {
                    $scope.detailItem = data;
                    $scope.detailItem.critObj= {title:data.criteria};
                   /* if($scope.detailItem.criterias.length>0){
                        for(var i=0; i<$scope.detailItem.criterias.length;i++){
                            var obj=$scope.criterias.filter((v)=> v.criteria==$scope.detailItem.criterias[i].criteria)[0];
                            $scope.detailItem.criterias[i].critObj= {title:obj.criteria}
                        }
                    }*/
                });


                if(item.parentId!=null){
                    $scope.detailItem.eventType='02';
                }


                $scope.bagObj = {};
                if (item.userIds != null && item.userIds.split(",").length > 0) {
                    for (var i = 0; i < item.userIds.split(",").length; i++) {
                        $scope.bagObj[item.userIds.split(",")[i]] = true;
                    }
                }
                $timeout(function (){
                    modalDetail.show();
                },200)
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
                $scope.detailItem.userArr = [];
                for (var ezObj in $scope.bagObj) {
                    var ez = $scope.bagObj[ezObj];
                    if (ez) $scope.detailItem.userArr.push(ezObj);
                }
                if($scope.detailItem.critObj===null){
                    $scope.detailItem.criteria= $("#products").val();
                }
                else{
                    $scope.detailItem.criteria= $scope.detailItem.critObj.title;
                }

                if($scope.detailItem.eventType==='01'){
                    $scope.detailItem.parentId=null;
                }

                $scope.detailItem.orgId = $scope.user.orgId;
                var validator = $("#validatorDetail").kendoValidator().data("kendoValidator");
                if (validator.validate()) {
                    modalDetail.hide();
                    UIkit.modal("#modal_loader_main", {
                        modal: false,
                        keyboard: false,
                        bgclose: false,
                        center: true,
                    }).show();
                    if($scope.detailItem.eventType === '01'){
                        $scope.detailItem.userArr=[];
                        $scope.sendForm();
                    }
                    else{
                        if ($scope.detailItem.userArr.length > 0) {
                            $scope.sendForm();
                        } else {
                            $rootScope.alert(false, "Ажилтан сонгоно уу");
                        }
                    }
                }
            };
            $scope.sendForm=function (){
                var method = "post";
                if ($scope.detailItem.id !== undefined && $scope.detailItem.id !== null) method = "put";
                mainService.withdata("post", "/api/cab/plan/detail/submit", $scope.detailItem).then(function (data) {
                    $scope.bagObj={};
                    UIkit.modal("#modal_loader_main").hide();
                    $scope.loadDetail();
                    //    $(".k-grid").data("kendoGrid").dataSource.read();
                });
            }


            $scope.sendPlan=function (i){
                if(i===0){
                    sweet.show(
                        {
                            title: "Санамж",
                            text: "Та БАТЛАХ товчийг дарснаар төлөвлөгөөний мэдээлэл албан хаагчид хуваарилагдана",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "Батлах",
                            cancelButtonText: "Үгүй",
                            closeOnConfirm: true,
                            closeOnCancel: true,
                        },
                        function (inputvalue) {
                            if (inputvalue) {
                                $scope.subPlan();
                            }
                        }
                    );
                }
                else if(i===1){
                    sweet.show(
                        {
                            title: "Санамж",
                            text: "Та БАТЛАХ товчийг дарснаар төлөвлөгөөний мэдээлийг засварлах боломжгүй болно",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "Батлах",
                            cancelButtonText: "Үгүй",
                            closeOnConfirm: true,
                            closeOnCancel: true,
                        },
                        function (inputvalue) {
                            if (inputvalue) {
                                $scope.subPlan();
                            }
                        }
                    );
                }
                else if(i===2){
                    sweet.show(
                        {
                            title: "Санамж",
                            text: "Та Цуцлах товчийг дарснаар төлөвлөгөөний мэдээлийг бүх ажилтан засварлах боломжтой болно",
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
                                $scope.subPlan();
                            }
                        }
                    );
                }
            }

            $scope.subPlan=function (){
                var obj = {
                    planId: $scope.app.id,
                    status: "approved",
                    name: "Төлөвлөгөөний мэдээлэл бүртгэж баталсан.",
                };

                if($scope.app.statusNm=='Хувиарласан' && $scope.user.level.name=='Нэгжийн дарга'){
                    obj.status='approved';
                    obj.name="Төлөвлөгөөний мэдээлэл бүртгэж баталсан.";
                }
                else if($scope.app.statusNm=='Хадгалсан' && $scope.user.level.name=='Нэгжийн дарга'){
                    obj.status='checked';
                    obj.name="Нэгжийн төлөвлөгөө батлагдсан.";
                }
                else if($scope.app.statusNm=='Баталсан' && $scope.user.level.name=='Нэгжийн дарга'){
                    obj.status='rejected';
                    obj.name="Төлөвлөгөө цуцалсан.";
                }

                mainService.withdata("post", __env.apiUrl() + "/api/cab/plan/change-status", obj).then(function (data) {
                    $rootScope.alert(true, "Амжилттай илгээлээ.");
                    $state.go("restricted.cabinet.plan-org");
                });
            }

            $scope.selectAll = function (e) {
                $scope.workers.map(function (i) {
                    $scope.bagObj[parseInt(i.id)] = $scope.isCheckAllCategory == "all" ? false : true;
                });
                $scope.isCheckAllCategory = $scope.isCheckAllCategory == "all" ? "" : "all";
            };

            $scope.detailDataSource = commonDataSource.urlPageDataSource(__env.apiUrl() + "/api/cab/plan/detail/list", JSON.stringify({
                sort: [{field: "id", dir: "asc"}],
                filters: [{field: "useYn", operator: "eq", value: 0}],
            }), 60);
            $scope.objChange=function (tp){
                $scope.detailItem.eventType=tp;
                $scope.detailDataSource=angular.copy($scope.details).filter((v)=>v.objId=$scope.detailItem.objId && v.parentId==null && v.objId==$scope.detailItem.objId)
            }
            $scope.loadEvent = function (){
                mainService.withResponse("get", "/api/admin/v1/list/cab-plan-obj/"+$scope.app.id).then(function (response) {
                    if(response.status===200){
                        $scope.groups=response.data;
                        $scope.objectives=response.data;
                    }
                });
            }
            $scope.loadDetail = function (){
                mainService.withResponse("get", "/api/admin/v1/list/cab-plan-detail-obj/"+$scope.app.id).then(function (response) {
                    if(response.status===200){
                        $scope.details=response.data;
                    }
                });
            }
            $scope.loadRequestList= function (){
                mainService.withResponse("get", "/api/admin/v1/list/cab-plan-request-app/"+$scope.app.id).then(function (response) {
                    if(response.status===200){
                        $scope.requestItems=response.data;
                    }
                });
            }
            $scope.loadDetail();
            $scope.loadEvent();
            $scope.loadRequestList();


            var modalRequest = UIkit.modal("#modal_form_request", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true
            });
            $scope.loadRequest=function (item){
                $scope.accepted=item;
                if($scope.requestItems.filter(f => f.detId===item.id).length>0){
                    mainService.withdomain("get", "/api/admin/v1/list/cab-plan-request/"+item.id).then(function (data) {
                        $scope.requests=data;
                        modalRequest.show();
                    });
                }
                else{
                    $rootScope.alert(false,"Хүсэлт гараагүй байна");
                }
            }

            var modalApproveRequest = UIkit.modal("#modal_approve_request", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true
            });

            $scope.approveItem={};
            $scope.approve = function (dt){
                $scope.approveItem=dt;
                $scope.approveItem.useYn=0;
                $scope.approveItem.responseType="0";
                mainService.withdata("post", "/api/cab/plan/detail/request/submit", $scope.approveItem).then(function (data) {
                    modalRequest.hide();
                    $rootScope.alert(true,"Хүсэлтийг зөвшөөрсөн.");
                    $scope.loadEvent();
                    $scope.loadDetail();
                });
            }


            var modalDenyRequest = UIkit.modal("#modal_deny_request", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true
            });

            $scope.deny = function (dt){
                $scope.denyItem=dt;
                modalRequest.hide();
                modalDenyRequest.show();
            }
            $scope.denySubmit = function (){
               // $scope.denyItem.useYn=0;
                $scope.denyItem.responseType="1";
                var denyForm = $("#denyForm").kendoValidator().data("kendoValidator");
                if (denyForm.validate()) {
                    mainService.withdata("post", "/api/cab/plan/detail/request/submit", $scope.denyItem).then(function (data) {
                        modalDenyRequest.hide();
                        $scope.loadEvent();
                        $scope.loadDetail();
                    });
                }
            }

            $scope.$watch("groups", () => {
                $timeout(function (){
                    $scope.$evalAsync(function() {
                        $.each($(".des-dugaar"), (i, v) => {
                            $(v).html(i + 1);
                        });
                    });
                },300)
            });
        },
    ]);
