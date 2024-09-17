angular.module("altairApp").controller("1016NmsCtrl", [
  "$rootScope",
  "$stateParams",
  "$state",
  "$scope",
  "$timeout",
  "mainService",
  "commonDataSource",
  "Upload",
  "$http",
  "__env",
  function ($rootScope, $stateParams, $state, $scope, $timeout, mainService, commonDataSource, Upload, $http, __env) {
    $scope.user = JSON.parse(localStorage.getItem("currentUser"));

    $scope.amgId = null;
    if ($scope.user.user.amgId != null) $scope.amgId = $scope.user.user.amgId;
    else if ($scope.user.user.organization.amgId != null) $scope.amgId = $scope.user.user.organization.amgId;

    $scope.relation = { useYn: 1 };
    /*            mainService.withdomain('get', __env.apiUrl() + '/api/policy/doc/' + $stateParams.id).then(function (data) {
              $scope.relation.docId = data.docId;
              $scope.relation.relationDocId = data.relationDocId;*/

    $scope.policyDocDataSource = commonDataSource.urlDataSource(
      "/api/nms/policy/list",
      JSON.stringify({
        filter: {
          logic: "and",
          filters: [
            { field: "useYn", operator: "eq", value: 1 },
            { field: "amgId", operator: "eq", value: $scope.amgId },
          ],
        },
        sort: [{ field: "id", dir: "asc" }],
      })
    );
    $scope.relationDocDataSource = commonDataSource.urlDataSource(
      "/api/nms/policy/list",
      JSON.stringify({
        filter: {
          logic: "and",
          filters: [
            { field: "useYn", operator: "eq", value: 1 },
            { field: "typeId", operator: "eq", value: 211 },
          ],
        },
        sort: [{ field: "id", dir: "asc" }],
      })
    );
    /*});*/

    $scope.app = { useYn: 1, headerId: $stateParams.id };
    $scope.app.amgId = $scope.user.user.amgId;

    $scope.app.docIds = [];
    $scope.app.relationDocIds = [];

    //Бодлогын бичиг баримт бүтэц
    $scope.docStepDataSource = commonDataSource.urlDataSource(
      "/api/nms/common/code/list",
      JSON.stringify({
        filter: {
          logic: "and",
          filters: [
            { field: "grpCd", operator: "contains", value: "policyStatus" },
            { field: "parentId", operator: "isNull", value: "false" },
          ],
        },
        sort: [{ field: "orderId", dir: "asc" }],
      })
    );

    // Баримт бичгийн төрөл
    $scope.docTypeDataSource = commonDataSource.urlDataSource(
      "/api/nms/common/code/list",
      JSON.stringify({
        filter: {
          logic: "and",
          filters: [
            { field: "grpCd", operator: "contains", value: "policyDocType" },
            { field: "parentId", operator: "isNull", value: "false" },
          ],
        },
        sort: [{ field: "orderId", dir: "asc" }],
      })
    );

    //Бодлогын бичиг төрөл
    $scope.typeDataSource = commonDataSource.urlDataSource(
      "/api/nms/common/code/list",
      JSON.stringify({
        filter: {
          logic: "and",
          filters: [
            { field: "grpCd", operator: "contains", value: "policyType" },
            { field: "parentId", operator: "isNull", value: "false" },
          ],
        },
        sort: [{ field: "orderId", dir: "asc" }],
      })
    );

    $scope.docTypeDisable = true;
    $scope.docStepHide = false;
    $scope.docRelationStepHide = false;

    $scope.docStepDisable = true;
    $scope.fromDocTypeChanged = function () {
      $scope.docStepDisable = false;
    };

    $scope.fileDtl = null;
    $scope.onSelect = function (e) {
      $scope.fileDtl = null;
    };

    $scope.fileOptions = {
      multiple: false,
      autoUpload: false,
      async: {
        saveUrl: __env.apiUrl() + "/api/file/uploadFile",
        removeUrl: __env.apiUrl() + "/api/file/delete",
        //  autoUpload: true,
      },
      showFileList: false,
      remove: function (e) {
        if ($scope.createLink) {
          $.ajax({
            url: __env.apiUrl() + "/api/file/delete",
            type: "DELETE",
            success: function (response) {},
            data: JSON.stringify($scope.createLink),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
          });
        }
        $(".k-widget.k-upload").find("ul").remove();
        $(".k-upload-status").remove();
        $scope.createLink = null;
        e.preventDefault();
      },
      success: function (e) {
        $scope.fileDtl = e.response;
        $scope.app.fileId = e.response.id;
      },
      upload: function (e) {
        var xhr = e.XMLHttpRequest;
        if (xhr) {
          xhr.addEventListener("readystatechange", function (e) {
            if (xhr.readyState == 1 /* OPENED */) {
              xhr.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
            }
          });
        }
      },
    };

    $scope.createApp = function () {
      UIkit.modal("#modal_application", {
        modal: false,
        keyboard: false,
        bgclose: false,
        center: true,
      }).show();
      $scope.yearSelectorOptions = {
        start: "month",
        depth: "year",
        format: "dd-MM-yyyy",
      };

      $scope.fromDateChanged = function () {
        $scope.minDate = new Date($scope.app.srtDt);
      };
      $scope.toDateChanged = function () {
        $scope.maxDate = new Date($scope.app.endDt);
      };
      $scope.maxDate = new Date();
      $scope.minDate = new Date();
    };

    $scope.submitProject = function (event) {
      if ($scope.app.docIds.length == 0 || $scope.app.relationDocIds.length == 0) $rootScope.alert(false, "Холбох мэдээллүүдийг сонгоно уу!!!");

      if ($scope.amgId != null) $scope.app.amgId = $scope.amgId;

      mainService.withdata("post", __env.apiUrl() + "/api/nms/policy/relation/submit", $scope.app).then(function (data) {
        $rootScope.alert(true, "Амжилттай хадгаллаа.");
        UIkit.modal("#modal_application").hide();
        $(".k-grid").data("kendoGrid").dataSource.read();
        $scope.stat(2, false, data.id);
      });
    };

    $scope.editApp = function (item) {
      $scope.app = item;
      UIkit.modal("#modal_application", {
        modal: false,
        keyboard: false,
        bgclose: false,
        center: true,
      }).show();
      $scope.yearSelectorOptions = {
        start: "month",
        depth: "year",
        format: "dd-MM-yyyy",
      };
      $scope.fromDateChanged = function () {
        $scope.minDate = new Date($scope.app.srtDt);
      };
      $scope.toDateChanged = function () {
        $scope.maxDate = new Date($scope.app.endDt);
      };
      $scope.maxDate = new Date();
      $scope.minDate = new Date();
    };

    $scope.gotoDetail = function (item) {
      $scope.editApp(item);
    };

    $scope.gotoDocRelationDetail = function (item) {
      $state.go("restricted.policyDocRelation.view", { id: item.id });
    };

    $scope.dataSource = new kendo.data.DataSource({
      transport: {
        read: {
          url: function (e) {
            return __env.apiUrl() + "/api/nms/policy/relation/list";
          },
          contentType: "application/json; charset=UTF-8",
          type: "POST",
          data: {
            sort: [
              { field: "docId", dir: "asc" },
              { field: "docCode", dir: "asc" },
              { field: "relationDocCode", dir: "asc" },
            ],
          },
          beforeSend: function (req) {
            if (JSON.parse(localStorage.getItem("currentUser")) != null) {
              req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
            } else {
              $state.go("login");
              $rootScope.$broadcast("LogoutSuccessful");
            }
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
            id: { type: "number", nullable: true },
            sponsorOrg: { editable: false },
            checkOrg: { editable: false },
            pipAmt: { type: "number" },
          },
        },
      },
      pageSize: 10,
      serverPaging: true,
      serverSorting: true,
      serverFiltering: true,
    });

    $scope.dataSource.filter({
      logic: "and",
      sort: [{ field: "id", dir: "asc" }],
      filters: [
        { field: "useYn", operator: "eq", value: 1 },
        { field: "amgId", operator: "eq", value: $scope.amgId },
      ],
    });

    $scope.docGroupDataSource = new kendo.data.DataSource({
      transport: {
        read: {
          url: function (e) {
            return __env.apiUrl() + "/api/policy/group/byNative";
            /*                                if (JSON.parse(localStorage.getItem('menuData')).rRead === '1' && JSON.parse(localStorage.getItem('menuData')).link === $state.current.name) {
                                                        return __env.apiUrl() + "/api/policy/group/byNative";
                                                    }
                                                    else {
                                                        localStorage.removeItem('currentUser');
                                                        localStorage.removeItem('menuList');
                                                        localStorage.removeItem('menuData');
                                                        $state.go('login');
                                                    }*/
          },
          contentType: "application/json; charset=UTF-8",
          type: "GET",
          data: { sort: [{ field: "id", dir: "asc" }] },
          beforeSend: function (req) {
            if (JSON.parse(localStorage.getItem("currentUser")) != null) {
              req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
            } else {
              $state.go("login");
              $rootScope.$broadcast("LogoutSuccessful");
            }
          },
        },
      },
      schema: {
        data: "data",
        total: "total",
        model: {
          id: "id",
          fields: {
            id: { type: "number", nullable: true },
            code: { type: "string" },
            name: { type: "string" },
            stepName: { type: "string" },
          },
        },
      },
      pageSize: 10,
      serverPaging: true,
      serverSorting: true,
      serverFiltering: true,
    });

    $scope.docGroupDataSource.filter({
      logic: "and",
      sort: [{ field: "id", dir: "asc" }],
      filters: [
        { field: "useYn", operator: "eq", value: 1 },
        { field: "docId", operator: "eq", value: $scope.app.docId },
      ],
    });

    $scope.docGroupRelationDataSource = new kendo.data.DataSource({
      transport: {
        read: {
          url: function (e) {
            return __env.apiUrl() + "/api/policy/group/byNative";
            /*if (JSON.parse(localStorage.getItem('menuData')).rRead === '1' && JSON.parse(localStorage.getItem('menuData')).link === $state.current.name) {
                        return __env.apiUrl() + "/api/policy/group/byNative";
                    }
                    else {
                        localStorage.removeItem('currentUser');
                        localStorage.removeItem('menuList');
                        localStorage.removeItem('menuData');
                        $state.go('login');
                    }*/
          },
          contentType: "application/json; charset=UTF-8",
          type: "GET",
          data: { sort: [{ field: "id", dir: "asc" }] },
          beforeSend: function (req) {
            if (JSON.parse(localStorage.getItem("currentUser")) != null) {
              req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
            } else {
              $state.go("login");
              $rootScope.$broadcast("LogoutSuccessful");
            }
          },
        },
      },
      schema: {
        data: "data",
        total: "total",
        model: {
          id: "id",
          fields: {
            id: { type: "number", nullable: true },
            code: { type: "string" },
            name: { type: "string" },
            stepName: { type: "string" },
          },
        },
      },
      pageSize: 10,
      serverPaging: true,
      serverSorting: true,
      serverFiltering: true,
    });

    $scope.docGroupRelationDataSource.filter({
      logic: "and",
      sort: [{ field: "id", dir: "asc" }],
      filters: [
        { field: "useYn", operator: "eq", value: 1 },
        { field: "docId", operator: "eq", value: $scope.app.relationDocId },
      ],
    });

    $scope.mainGrid = {
      filterable: {
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
      columnMenu: {
        componentType: "modern",
        columns: {
          groups: [
            { title: "Address", columns: ["name", "tezId", "ezId", "amgId", "sumId", "status", "amount", "payAmount", "paidAmount", "srtDt", "endDt", "objId", "measId", "capacity", "contractor"] },
          ],
        },
      },
      excel: {
        fileName: "Projects.xlsx",
        allPages: true,
        filterable: true,
      },
      sortable: true,
      resizable: true,
      reorderable: true,
      pageable: {
        pageSizes: [10, 50, 100, "All"],
        refresh: true,
        pageSize: 10,
        buttonCount: 5,
      },
      columns: [
/*        {
          title: "#",
          headerAttributes: { class: "columnCenter" },
          attributes: { style: "text-align: center;" },
          template: "#= ++record #",
          sticky: true,
          width: 50,
        },*/
        {
          field: "relationDocName",
          filterable: { cell: { operator: "contains", showOperators: false } },
          title: "Нэр",
          width: "200px",
        },
        {
          field: "relationDocCode",
          filterable: { cell: { operator: "contains", showOperators: false } },
          title: "Код",
          width: "100px",
        },
        {
          field: "relationDocSourceName",
          filterable: { cell: { operator: "contains", showOperators: false } },
          title: "Үзүүлэлт",
        },
        {
          field: "relationDocStepName",
          filterable: { cell: { operator: "contains", showOperators: false } },
          title: "Үе шат",
          width: "100px",
        }
      ],
      dataBinding: function () {
        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
      },
      editable: false,
      height: function () {
        return $(window).height() - 70;
      },
    };

    $scope.mainGridGroup = {
      filterable: {
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
      columnMenu: {
        componentType: "modern",
        columns: {
          groups: [
            { title: "Address", columns: ["name", "tezId", "ezId", "amgId", "sumId", "status", "amount", "payAmount", "paidAmount", "srtDt", "endDt", "objId", "measId", "capacity", "contractor"] },
          ],
        },
      },
      excel: {
        fileName: "Projects.xlsx",
        allPages: true,
        filterable: true,
      },
      sortable: true,
      resizable: true,
      reorderable: true,
      pageable: {
        pageSizes: [10, 50, 100, "All"],
        refresh: true,
        pageSize: 10,
        buttonCount: 5,
      },
      columns: [
        {
          field: "code",
          filterable: { cell: { operator: "contains", showOperators: false } },
          title: "Код",
          width: "60px",
        },
        {
          field: "name",
          filterable: { cell: { operator: "contains", showOperators: false } },
          title: "Бүлэг нэр",
        },
      ],
      dataBinding: function () {
        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
      },
      editable: false,
      height: function () {
        return $(window).height() - 270;
      },
      detailTemplate: kendo.template($("#template").html()),
      detailInit: detailInit,
      dataBound: function (e) {
        var grid = e.sender;

        grid.tbody.find("tr.k-master-row").click(function (e) {
          var target = $(e.target);
          if (target.hasClass("k-i-expand") || target.hasClass("k-i-collapse")) {
            return;
          }

          var row = target.closest("tr.k-master-row");
          var icon = row.find(".k-i-expand");

          if (icon.length) {
            grid.expandRow(row);
          } else {
            grid.collapseRow(row);
          }
        });
      },
    };

    $scope.mainGridRelationGroup = {
      filterable: {
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
      columnMenu: {
        componentType: "modern",
        columns: {
          groups: [
            { title: "Address", columns: ["name", "tezId", "ezId", "amgId", "sumId", "status", "amount", "payAmount", "paidAmount", "srtDt", "endDt", "objId", "measId", "capacity", "contractor"] },
          ],
        },
      },
      excel: {
        fileName: "Projects.xlsx",
        allPages: true,
        filterable: true,
      },
      sortable: true,
      resizable: true,
      reorderable: true,
      pageable: {
        pageSizes: [10, 50, 100, "All"],
        refresh: true,
        pageSize: 10,
        buttonCount: 5,
      },
      columns: [
        {
          field: "code",
          filterable: { cell: { operator: "contains", showOperators: false } },
          title: "Код",
          width: "60px",
        },
        {
          field: "name",
          filterable: { cell: { operator: "contains", showOperators: false } },
          title: "Бүлэг нэр",
        },
      ],
      dataBinding: function () {
        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
      },
      editable: false,
      height: function () {
        return $("#relDocs").height() / 2 - 30;
      },
      detailTemplate: kendo.template($("#templateRelation").html()),
      detailInit: detailInitRelation,
      dataBound: function (e) {
        var grid = e.sender;

        grid.tbody.find("tr.k-master-row").click(function (e) {
          var target = $(e.target);
          if (target.hasClass("k-i-expand") || target.hasClass("k-i-collapse")) {
            return;
          }

          var row = target.closest("tr.k-master-row");
          var icon = row.find(".k-i-expand");

          if (icon.length) {
            grid.expandRow(row);
          } else {
            grid.collapseRow(row);
          }
        });
      },
    };

    $scope.mainGridRelationGroup2 = {
      filterable: {
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
      columnMenu: {
        componentType: "modern",
        columns: {
          groups: [
            { title: "Address", columns: ["name", "tezId", "ezId", "amgId", "sumId", "status", "amount", "payAmount", "paidAmount", "srtDt", "endDt", "objId", "measId", "capacity", "contractor"] },
          ],
        },
      },
      excel: {
        fileName: "Projects.xlsx",
        allPages: true,
        filterable: true,
      },
      sortable: true,
      resizable: true,
      reorderable: true,
      pageable: {
        pageSizes: [10, 50, 100, "All"],
        refresh: true,
        pageSize: 10,
        buttonCount: 5,
      },
      columns: [
        {
          field: "code",
          filterable: { cell: { operator: "contains", showOperators: false } },
          title: "Код",
          width: "60px",
        },
        {
          field: "name",
          filterable: { cell: { operator: "contains", showOperators: false } },
          title: "Бүлэг нэр",
        },
      ],
      dataBinding: function () {
        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
      },
      editable: false,
      height: function () {
        return $("#relDocs").height() / 2 - 46;
      },
      detailTemplate: kendo.template($("#templateRelation").html()),
      detailInit: detailInitRelation,
      dataBound: function (e) {
        var grid = e.sender;

        grid.tbody.find("tr.k-master-row").click(function (e) {
          var target = $(e.target);
          if (target.hasClass("k-i-expand") || target.hasClass("k-i-collapse")) {
            return;
          }

          var row = target.closest("tr.k-master-row");
          var icon = row.find(".k-i-expand");

          if (icon.length) {
            grid.expandRow(row);
          } else {
            grid.collapseRow(row);
          }
        });
      },
    };

    function detailInit(e) {
      var parentId = e.data.id;
      var detailRow = e.detailRow;
      var nextStepId,
        nextStepName = "undefined";
      for (var i = 0; i < $scope.docStepSource.length; i++) {
        if ($scope.docStepSource[i].stepName.id > e.data.stepId) {
          nextStepId = $scope.docStepSource[i].stepName.id;
          nextStepName = $scope.docStepSource[i].stepName.shortCd;
          break;
        }
      }
      console.log("call e.data.stepName ::: " + e.data.stepName + "  , nextStepName ::: " + nextStepName);

      var url, query, headerTxt;
      if (e.data.stepName == "group" && nextStepName == "point") {
        url = "/api/policy/point/byNative?";
        query = "docId=" + $scope.app.docId + "&groupId=" + parentId;
        headerTxt = "Зорилго";
      }
      if (e.data.stepName == "group" && nextStepName == "target") {
        url = "/api/policy/target/byNative?";
        query = "docId=" + $scope.app.docId + "&groupId=" + parentId;
        headerTxt = "Зорилт";
      }
      if (e.data.stepName == "point" && nextStepName == "target") {
        url = "/api/policy/target/byNative?";
        query = "docId=" + $scope.app.docId + "&pointId=" + parentId;
        headerTxt = "Зорилт";
      }
      if (e.data.stepName == "target" && nextStepName == "result") {
        url = "/api/policy/result/byNative?";
        query = "docId=" + $scope.app.docId + "&targetId=" + parentId;
        headerTxt = "Үр дүн";
      }
      if (e.data.stepName == "target" && nextStepName == "operation") {
        url = "/api/policy/operation/byNative?";
        query = "docId=" + $scope.app.docId + "&targetId=" + parentId;
        headerTxt = "Үйл ажиллагаа";
      }
      if (e.data.stepName == "point" && nextStepName == "project") {
        url = "/api/policy/project/byNative?";
        query = "docId=" + $scope.app.docId + "&pointId=" + parentId;
        headerTxt = "Төсөл, арга хэмжээ";
      }
      if (nextStepName != "undefined") $scope.detailInitFunction(detailRow, url, query, headerTxt);
    }

    function detailInitRelation(e) {
      var parentId = e.data.id;
      var detailRow = e.detailRow;
      var nextStepId,
        nextStepName = "undefined";
      for (var i = 0; i < $scope.docStepRelationSource.length; i++) {
        if ($scope.docStepRelationSource[i].stepName.id > e.data.stepId) {
          nextStepId = $scope.docStepRelationSource[i].stepName.id;
          nextStepName = $scope.docStepRelationSource[i].stepName.shortCd;
          break;
        }
      }
      console.log("call e.data.stepName ::: " + e.data.stepName + "  , nextStepName ::: " + nextStepName);

      var url, query, headerTxt;
      if (e.data.stepName == "group" && nextStepName == "point") {
        url = "/api/policy/point/byNative?";
        query = "docId=" + $scope.app.relationDocId + "&groupId=" + parentId;
        headerTxt = "Зорилго";
      }
      if (e.data.stepName == "group" && nextStepName == "target") {
        url = "/api/policy/target/byNative?";
        query = "docId=" + $scope.app.relationDocId + "&groupId=" + parentId;
        headerTxt = "Зорилт";
      }
      if (e.data.stepName == "point" && nextStepName == "target") {
        url = "/api/policy/target/byNative?";
        query = "docId=" + $scope.app.relationDocId + "&pointId=" + parentId;
        headerTxt = "Зорилт";
      }
      if (e.data.stepName == "target" && nextStepName == "result") {
        url = "/api/policy/result/byNative?";
        query = "docId=" + $scope.app.relationDocId + "&targetId=" + parentId;
        headerTxt = "Үр дүн";
      }
      if (e.data.stepName == "target" && nextStepName == "operation") {
        url = "/api/policy/operation/byNative?";
        query = "docId=" + $scope.app.relationDocId + "&targetId=" + parentId;
        headerTxt = "Үйл ажиллагаа";
      }
      if (e.data.stepName == "point" && nextStepName == "project") {
        url = "/api/policy/project/byNative?";
        query = "docId=" + $scope.app.docId + "&pointId=" + parentId;
        headerTxt = "Төсөл, арга хэмжээ";
      }

      if (nextStepName != "undefined") $scope.detailInitRelationFunction(detailRow, url, query, headerTxt);
    }

    /*if (localStorage.getItem("buttonData").includes("read")) {
      $scope.mainGrid.toolbar = ["excel"];
    }
    if (localStorage.getItem("buttonData").includes("create")) {
      $scope.mainGrid.toolbar = [{ template: "<button class='md-btn custom-btn k-grid-add' ng-click='createApp()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>" }];
    }
    if (localStorage.getItem("buttonData").includes("edit")) {
      $scope.mainGrid.columns.push({
        /!*
                command: [
                  { template: "<button class=\"k-button k-button-icontext\"  ng-click='deleteData(dataItem)'><span class=\"k-icon k-i-delete\"></span></button>" },
                ], title: "&nbsp;", width: 50, sticky: true, attributes: { "style": "text-align: center;" },
*!/
        command: [
          {
            template: '<div class="flex gap-3"><button class="grid-btn k-grid-remove-command" ng-click=\'deleteData(dataItem)\'><div class="nimis-icon delete"></div></button></div>',
          },
        ],
        title: "&nbsp;",
        sticky: true,
        width: 100,
      });
    }*/

    $scope.deleteData = function (item) {
      if (confirm("Тухайн бүртгэлийг устгахдаа итгэлтэй байна уу?")) {
        mainService.withdata("delete", __env.apiUrl() + "/api/nms/policy/relation/" + item.id).then(function (data) {
          $rootScope.alert(true, "Устгах үйлдэл амжилттай боллоо.");
          $(".k-grid").data("kendoGrid").dataSource.read();
        });
      }
    };

    $scope.docChanged = function () {
      $scope.docStepHide = true;
      mainService.withdomain("get", __env.apiUrl() + "/api/policy/group/byNative?docId=" + $scope.app.docId).then(function (data) {
        $scope.docGroupDataSource = data;
      });

      mainService.withdomain("get", __env.apiUrl() + "/api/nms/policy/step/byNative?docId=" + $scope.app.docId).then(function (data) {
        $scope.docStepSource = data;
      });
    };

    $scope.relationDocChanged = function () {
      $scope.docRelationStepHide = true;
      mainService.withdomain("get", __env.apiUrl() + "/api/policy/group/byNative?docId=" + $scope.app.relationDocId).then(function (data) {
        $scope.docGroupRelationDataSource = data;
      });

      mainService.withdomain("get", __env.apiUrl() + "/api/nms/policy/step/byNative?docId=" + $scope.app.relationDocId).then(function (data) {
        $scope.docStepRelationSource = data;
      });
    };

    function onChange(arg) {
      var selectedRows = this.select();

      $scope.app.docIds = [];
      for (var i = 0; i < selectedRows.length; i++) {
        var dataItem = this.dataItem(selectedRows[i]);
        $scope.app.docIds.push(dataItem);
      }

      console.log("docIds ::: " + $scope.app.docIds.length);

      $scope.docRelationDataSource = null;
      if($scope.app.docIds.length > 0){
        mainService.withdomain("get", __env.apiUrl() + "/api/nms/policy/relation/getRelation?docId="+$scope.app.docId+"&docCode="+$scope.app.docIds[0].code).then(function (data) {
          $scope.docRelationDataSource = data;
        });
      }
    }

    function onChangeRelation(arg) {
      var selectedRows = this.select();
      $scope.app.relationDocIds = [];
      for (var i = 0; i < selectedRows.length; i++) {
        var dataItem = this.dataItem(selectedRows[i]);
        $scope.app.relationDocIds.push(dataItem);
      }
      console.log("relationDocIds ::: " + $scope.app.relationDocIds.length);
    }

    $scope.detailInitFunction = function (detailRow, url, query, headerTxt) {
      detailRow.find(".orders").kendoGrid({
        dataSource: {
          transport: {
            read: {
              url: function (e) {
                return __env.apiUrl() + url + query;
                /*if (JSON.parse(localStorage.getItem('menuData')).rRead === '1' && JSON.parse(localStorage.getItem('menuData')).link === $state.current.name) {
                            return __env.apiUrl() + url + query;
                        }
                        else {
                            localStorage.removeItem('currentUser');
                            localStorage.removeItem('menuList');
                            localStorage.removeItem('menuData');
                            $state.go('login');
                        }*/
              },
              contentType: "application/json; charset=UTF-8",
              type: "GET",
              beforeSend: function (req) {
                if (JSON.parse(localStorage.getItem("currentUser")) != null) {
                  req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
                } else {
                  $state.go("login");
                  $rootScope.$broadcast("LogoutSuccessful");
                }
              },
            },
          },
          serverPaging: true,
          serverSorting: true,
          serverFiltering: true,
          pageSize: 10,
          schema: {
            model: {
              id: "id",
              stepName: "stepName",
              fields: {
                id: { type: "number", nullable: true },
                stepName: { type: "string", nullable: true },
              },
            },
          },
        },
        scrollable: false,
        sortable: true,
        pageable: true,
        persistSelection: true,
        detailTemplate: kendo.template($("#template").html()),
        detailInit: detailInit,
        change: onChange,
        columns: [
          { selectable: true, width: "50px" },
          { field: "code", title: "Код", width: "60px", align: "center" },
          { field: "name", title: headerTxt + " нэр" },
        ],
      });
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

    $scope.backToList = function () {
      $state.go("restricted.nms.1012");
    };

    $scope.detailInitRelationFunction = function (detailRow, url, query, headerTxt) {
      detailRow.find(".ordersRelation").kendoGrid({
        dataSource: {
          transport: {
            read: {
              url: function (e) {
                return __env.apiUrl() + url + query;
                /*if (JSON.parse(localStorage.getItem('menuData')).rRead === '1' && JSON.parse(localStorage.getItem('menuData')).link === $state.current.name) {
                            return __env.apiUrl() + url + query;
                        }
                        else {
                            localStorage.removeItem('currentUser');
                            localStorage.removeItem('menuList');
                            localStorage.removeItem('menuData');
                            $state.go('login');
                        }*/
              },
              contentType: "application/json; charset=UTF-8",
              type: "GET",
              beforeSend: function (req) {
                if (JSON.parse(localStorage.getItem("currentUser")) != null) {
                  req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
                } else {
                  $state.go("login");
                  $rootScope.$broadcast("LogoutSuccessful");
                }
              },
            },
          },
          schema: {
            model: {
              id: "id",
              fields: {
                id: { type: "number", nullable: true },
              },
            },
          },
          serverPaging: true,
          serverSorting: true,
          serverFiltering: true,
          pageSize: 10,
        },
        scrollable: false,
        sortable: true,
        pageable: true,
        persistSelection: true,
        change: onChangeRelation,
        detailTemplate: kendo.template($("#templateRelation").html()),
        detailInit: detailInitRelation,
        columns: [
          { selectable: true, width: "50px" },
          { field: "code", title: "Код", width: "60px", align: "center" },
          { field: "name", title: headerTxt + " нэр" },
        ],
      });
    };
  },
]);
