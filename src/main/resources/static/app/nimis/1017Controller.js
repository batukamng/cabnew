angular.module("altairApp").controller("1017NmsCtrl", [
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
    $scope.user = JSON.parse(sessionStorage.getItem("currentUser"));

    $scope.stepColumns = [
      {
        field: "groupNm",
        filterable: { cell: { operator: "contains", showOperators: false } },
        title: "Үндсэн бүлэг",
      },
      {
        field: "pointNm",
        filterable: { cell: { operator: "contains", showOperators: false } },
        title: "Зорилго",
      },
      {
        field: "targetNm",
        filterable: { cell: { operator: "contains", showOperators: false } },
        title: "Зорилт",
      },
      {
        field: "code",
        filterable: { cell: { operator: "contains", showOperators: false } },
        title: "Код",
      },
      {
        field: "name",
        filterable: { cell: { operator: "contains", showOperators: false } },
        title: "Нэр",
      },
    ];
    $scope.docHeaderName = 'Нэр';
    $scope.amgId = null;
    if ($scope.user.user.amgId != null) $scope.amgId = $scope.user.user.amgId;
    else if ($scope.user.user.organization.amgId != null) $scope.amgId = $scope.user.user.organization.amgId;

    $scope.relation = { useYn: 1 };

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
              xhr.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
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
      else {
        if ($scope.amgId != null) $scope.app.amgId = $scope.amgId;

        mainService.withdata("post", __env.apiUrl() + "/api/nms/policy/relation/submit", $scope.app).then(function (data) {
          $rootScope.alert(true, "Амжилттай хадгаллаа.");

          $scope.app.relationDocIds = [];
          $scope.app.docIds = [];

          $(".k-grid").data("kendoGrid").dataSource.read();
          var grid = $("#app2Data").data("kendoGrid");
          grid.clearSelection();
          $scope.stat(2, false, data.id);
        });
      }
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
            if (JSON.parse(sessionStorage.getItem("currentUser")) != null) {
              req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
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
            /*                                if (JSON.parse(sessionStorage.getItem('menuData')).rRead === '1' && JSON.parse(sessionStorage.getItem('menuData')).link === $state.current.name) {
                                                        return __env.apiUrl() + "/api/policy/group/byNative";
                                                    }
                                                    else {
                                                        sessionStorage.removeItem('currentUser');
                                                        sessionStorage.removeItem('menuList');
                                                        sessionStorage.removeItem('menuData');
                                                        $state.go('login');
                                                    }*/
          },
          contentType: "application/json; charset=UTF-8",
          type: "GET",
          data: { sort: [{ field: "id", dir: "asc" }] },
          beforeSend: function (req) {
            if (JSON.parse(sessionStorage.getItem("currentUser")) != null) {
              req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
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
            /*if (JSON.parse(sessionStorage.getItem('menuData')).rRead === '1' && JSON.parse(sessionStorage.getItem('menuData')).link === $state.current.name) {
                        return __env.apiUrl() + "/api/policy/group/byNative";
                    }
                    else {
                        sessionStorage.removeItem('currentUser');
                        sessionStorage.removeItem('menuList');
                        sessionStorage.removeItem('menuData');
                        $state.go('login');
                    }*/
          },
          contentType: "application/json; charset=UTF-8",
          type: "GET",
          data: { sort: [{ field: "id", dir: "asc" }] },
          beforeSend: function (req) {
            if (JSON.parse(sessionStorage.getItem("currentUser")) != null) {
              req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
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

    $scope.mainLeftGrid = {
      filterable: {
        mode: "row",
        extra: false,
        cell: {
          operator: "eq",
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
      columns: $scope.stepColumns,
      dataBinding: function () {
        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
      },
      editable: false,
      height: "500px",
    };

    $scope.mainGridRelationGroup = {
      filterable: {
        mode: "row",
        extra: false,
        cell: {
          operator: "eq",
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
      persistSelection: true,
      pageable: {
        pageSizes: [10, 50, 100, "All"],
        refresh: true,
        pageSize: 10,
        buttonCount: 5,
      },
      columns: [],
      dataBinding: function () {
        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
      },
      editable: false,
      height: "500px",
      change: checkDataItem,
    };

    $scope.mainGrid = {
      filterable: {
        mode: "row",
        extra: false,
        cell: {
          operator: "eq",
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
          field: "relationDocName",
          filterable: { cell: { operator: "contains", showOperators: false } },
          title: "Нэр",
          width: 200,
        },
        {
          field: "relationDocStepName",
          filterable: { cell: { operator: "contains", showOperators: false } },
          title: "Үе шат",
          width: 100,
        },
        {
          field: "relationDocCode",
          filterable: { cell: { operator: "contains", showOperators: false } },
          title: "Код",
          width: 80,
        },
        {
          field: "relationDocSourceName",
          filterable: { cell: { operator: "contains", showOperators: false } },
          title: "Үзүүлэлт",
        },
      ],
      dataBinding: function () {
        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
      },
      editable: false,
      height: "500px",
    };

    $scope.mainGrid.columns.push({
      command: [
        {
          template: '<div class="flex gap-3"><button class="grid-btn k-grid-remove-command" ng-click=\'deleteData(dataItem)\'><div class="nimis-icon delete"></div></button></div>',
        },
      ],
      title: "&nbsp;",
      sticky: true,
      width: 100,
    });

    $scope.deleteData = function (item) {
      if (confirm("Тухайн бүртгэлийг устгахдаа итгэлтэй байна уу?")) {
        mainService.withdata("delete", __env.apiUrl() + "/api/nms/policy/relation/" + item.id).then(function (data) {
          $rootScope.alert(true, "Устгах үйлдэл амжилттай боллоо.");
          // $(".k-grid").data("kendoGrid").dataSource.read();

          if($scope.itemCode != null){
            $scope.docRelationDataSource = null;
            mainService.withdomain("get", __env.apiUrl() + "/api/nms/policy/relation/getRelation?docId=" + $scope.app.docId + "&docCode=" + $scope.itemCode).then(function (data) {
              $scope.docRelationDataSource = data;
            });
          }
        });
      }
    };

    $scope.docChanged = function () {
      $scope.app.docIds = [];
      $scope.docStepHide = true;
      mainService.withdomain("get", __env.apiUrl() + "/api/policy/group/byNative?docId=" + $scope.app.docId).then(function (data) {
        $scope.docGroupDataSource = data;
      });

      mainService.withdomain("get", __env.apiUrl() + "/api/nms/policy/step/byNative?docId=" + $scope.app.docId).then(function (data) {
        $scope.docStepSource = data;

        $scope.docLastStepDataSource = null;
        var grid = $("#app1Data").data("kendoGrid");

        $scope.app.stepId = $scope.docStepSource[0].stepName.id;
        switch ($scope.docStepSource[0].stepName.shortCd) {
          case "target": {
            $scope.stepColumns = [
              {
                title: "#",
                headerAttributes: { class: "columnCenter" },
                attributes: { style: "text-align: center;" },
                template: '<input type="radio" name="selectedRow" class="k-radio" ng-click=\'clickDataItem(dataItem)\'><label class="k-radio-label"></label>',
                width: 50,
                locked: true,
                lockable: false,
              },
              {
                field: "code",
                filterable: { cell: { operator: "contains", showOperators: false } },
                title: "Код",
                width: 80,
                locked: true,
                lockable: false,
              },
              {
                field: "name",
                filterable: { cell: { operator: "contains", showOperators: false } },
                title: "Зорилт",
                width: 200,
              },
              {
                field: "groupNm",
                filterable: { cell: { operator: "contains", showOperators: false } },
                title: "Үндсэн бүлэг",
                width: 200,
              },
              {
                field: "pointNm",
                filterable: { cell: { operator: "contains", showOperators: false } },
                title: "Зорилго",
                width: 200,
              },
              {
                field: "targetNm",
                filterable: { cell: { operator: "contains", showOperators: false } },
                title: "Зорилт",
                width: 200,
              },
            ];
            $scope.docLastStepDataSource = commonDataSource.urlDataSource(
              "/api/policy/target/list",
              JSON.stringify({
                filter: {
                  logic: "and",
                  filters: [
                    { field: "useYn", operator: "eq", value: 1 },
                    { field: "docId", operator: "eq", value: $scope.app.docId },
                  ],
                },
                sort: [{ field: "code", dir: "asc" }],
              })
            );
            break;
          }
          case "result": {
            $scope.stepColumns = [
              {
                title: "#",
                headerAttributes: { class: "columnCenter" },
                attributes: { style: "text-align: center;" },
                template: '<input type="radio" name="selectedRow" class="k-radio" ng-click=\'clickDataItem(dataItem)\'><label class="k-radio-label"></label>',
                width: 50,
                locked: true,
                lockable: false,
              },
              {
                field: "code",
                filterable: { cell: { operator: "contains", showOperators: false } },
                title: "Код",
                width: 80,
                locked: true,
                lockable: false,
              },
              {
                field: "name",
                filterable: { cell: { operator: "contains", showOperators: false } },
                title: "Үр дүн",
                width: 200,
              },
              {
                field: "groupNm",
                filterable: { cell: { operator: "contains", showOperators: false } },
                title: "Үндсэн бүлэг",
                width: 200,
              },
              {
                field: "pointNm",
                filterable: { cell: { operator: "contains", showOperators: false } },
                title: "Зорилго",
                width: 200,
              },
              {
                field: "targetNm",
                filterable: { cell: { operator: "contains", showOperators: false } },
                title: "Зорилт",
                width: 200,
              },
            ];
            $scope.docLastStepDataSource = commonDataSource.urlDataSource(
              "/api/policy/result/list",
              JSON.stringify({
                filter: {
                  logic: "and",
                  filters: [
                    { field: "useYn", operator: "eq", value: 1 },
                    { field: "docId", operator: "eq", value: $scope.app.docId },
                  ],
                },
                sort: [{ field: "code", dir: "asc" }],
              })
            );
            break;
          }
          case "operation": {
            $scope.stepColumns = [
              {
                title: "#",
                headerAttributes: { class: "columnCenter" },
                attributes: { style: "text-align: center;" },
                template: '<input type="radio" name="selectedRow" class="k-radio" ng-click=\'clickDataItem(dataItem)\'><label class="k-radio-label"></label>',
                width: 50,
                locked: true,
                lockable: false,
              },
              {
                field: "code",
                filterable: { cell: { operator: "contains", showOperators: false } },
                title: "Код",
                width: 80,
                locked: true,
                lockable: false,
              },
              {
                field: "name",
                filterable: { cell: { operator: "contains", showOperators: false } },
                title: "Үйл ажиллагаа",
                width: 200,
              },
              {
                field: "pointNm",
                filterable: { cell: { operator: "contains", showOperators: false } },
                title: "Зорилго",
                width: 200,
              },
              {
                field: "targetNm",
                filterable: { cell: { operator: "contains", showOperators: false } },
                title: "Зорилт",
                width: 200,
              },
            ];
            $scope.docLastStepDataSource = commonDataSource.urlDataSource(
              "/api/policy/operation/list",
              JSON.stringify({
                filter: {
                  logic: "and",
                  filters: [
                    { field: "useYn", operator: "eq", value: 1 },
                    { field: "docId", operator: "eq", value: $scope.app.docId },
                  ],
                },
                sort: [{ field: "code", dir: "asc" }],
              })
            );
            break;
          }
          case "project": {
            $scope.stepColumns = [
              {
                title: "#",
                headerAttributes: { class: "columnCenter" },
                attributes: { style: "text-align: center;" },
                template: '<input type="radio" name="selectedRow" class="k-radio" ng-click=\'clickDataItem(dataItem)\'><label class="k-radio-label"></label>',
                width: 50,
                locked: true,
                lockable: false,
              },
              {
                field: "code",
                filterable: { cell: { operator: "contains", showOperators: false } },
                title: "Код",
                width: 80,
                locked: true,
                lockable: false,
              },
              {
                field: "name",
                filterable: { cell: { operator: "contains", showOperators: false } },
                title: "Төсөл, арга хэмжээ",
                width: 200,
              },
              {
                field: "groupNm",
                filterable: { cell: { operator: "contains", showOperators: false } },
                title: "Үндсэн бүлэг",
                width: 200,
              },
              {
                field: "pointNm",
                filterable: { cell: { operator: "contains", showOperators: false } },
                title: "Зорилго",
                width: 200,
              },
            ];
            $scope.docLastStepDataSource = commonDataSource.urlDataSource(
              "/api/policy/project/list",
              JSON.stringify({
                filter: {
                  logic: "and",
                  filters: [
                    { field: "useYn", operator: "eq", value: 1 },
                    { field: "docId", operator: "eq", value: $scope.app.docId },
                  ],
                },
                sort: [{ field: "code", dir: "asc" }],
              })
            );
            break;
          }
        }

        grid.setOptions({
          columns: $scope.stepColumns,
        });
      });
    };

    $scope.relationDocChanged = function () {
      $scope.app.relationDocIds = [];

      $scope.docRelationStepHide = true;
      mainService.withdomain("get", __env.apiUrl() + "/api/policy/group/byNative?docId=" + $scope.app.relationDocId).then(function (data) {
        $scope.docGroupRelationDataSource = data;
      });

      mainService.withdomain("get", __env.apiUrl() + "/api/nms/policy/step/byNative?docId=" + $scope.app.relationDocId).then(function (data) {
        $scope.docStepRelationSource = data;

        $scope.relationLastStepDataSource = null;
        var grid = $("#app2Data").data("kendoGrid");

        $scope.app.relationStepId = $scope.docStepRelationSource[0].stepName.id;
        var dataSourceUrl = "";
        switch ($scope.docStepRelationSource[0].stepName.shortCd) {
          case "target": {
            $scope.stepRelationColumns = [
              { selectable: true, width: "50px", locked: true, lockable: false },
              {
                field: "code",
                filterable: { cell: { operator: "contains", showOperators: false } },
                title: "Код",
                width: 80,
                locked: true,
                lockable: false,
              },
              {
                field: "name",
                filterable: { cell: { operator: "contains", showOperators: false } },
                title: "Зорилт",
                width: 200,
              },
              {
                field: "groupNm",
                filterable: { cell: { operator: "contains", showOperators: false } },
                title: "Үндсэн бүлэг",
                width: 200,
              },
              {
                field: "pointNm",
                filterable: { cell: { operator: "contains", showOperators: false } },
                title: "Зорилго",
                width: 200,
              },
              {
                field: "targetNm",
                filterable: { cell: { operator: "contains", showOperators: false } },
                title: "Зорилт",
                width: 200,
              },
            ];
            dataSourceUrl = "/api/policy/target/list";
            break;
          }
          case "result": {
            $scope.stepRelationColumns = [
              { selectable: true, width: "50px", locked: true, lockable: false },
              {
                field: "code",
                filterable: { cell: { operator: "contains", showOperators: false } },
                title: "Код",
                width: 80,
                locked: true,
                lockable: false,
              },
              {
                field: "name",
                filterable: { cell: { operator: "contains", showOperators: false } },
                title: "Үр дүн",
                width: 200,
              },
              {
                field: "groupNm",
                filterable: { cell: { operator: "contains", showOperators: false } },
                title: "Үндсэн бүлэг",
                width: 200,
              },
              {
                field: "pointNm",
                filterable: { cell: { operator: "contains", showOperators: false } },
                title: "Зорилго",
                width: 200,
              },
              {
                field: "targetNm",
                filterable: { cell: { operator: "contains", showOperators: false } },
                title: "Зорилт",
                width: 200,
              },
            ];
            dataSourceUrl = "/api/policy/result/list";

            break;
          }
          case "operation": {
            $scope.stepRelationColumns = [
              { selectable: true, width: "50px", locked: true, lockable: false },
              {
                field: "code",
                filterable: { cell: { operator: "contains", showOperators: false } },
                title: "Код",
                width: 80,
                locked: true,
                lockable: false,
              },
              {
                field: "name",
                filterable: { cell: { operator: "contains", showOperators: false } },
                title: "Үйл ажиллагаа",
                width: 200,
              },
              {
                field: "pointNm",
                filterable: { cell: { operator: "contains", showOperators: false } },
                title: "Зорилго",
                width: 200,
              },
              {
                field: "targetNm",
                filterable: { cell: { operator: "contains", showOperators: false } },
                title: "Зорилт",
                width: 200,
              },
            ];
            dataSourceUrl = "/api/policy/operation/list";
            break;
          }
          case "project": {
            $scope.stepRelationColumns = [
              { selectable: true, width: "50px", locked: true, lockable: false },
              {
                field: "code",
                filterable: { cell: { operator: "contains", showOperators: false } },
                title: "Код",
                width: 80,
                locked: true,
                lockable: false,
              },
              {
                field: "name",
                filterable: { cell: { operator: "contains", showOperators: false } },
                title: "Төсөл, арга хэмжээ",
                width: 200,
              },
              {
                field: "groupNm",
                filterable: { cell: { operator: "contains", showOperators: false } },
                title: "Үндсэн бүлэг",
                width: 200,
              },
              {
                field: "pointNm",
                filterable: { cell: { operator: "contains", showOperators: false } },
                title: "Зорилго",
                width: 200,
              },
            ];
            dataSourceUrl = "/api/policy/project/list";
            break;
          }
        }
        console.log(dataSourceUrl, "dataSourceUrl");
        $scope.relationLastStepDataSource = new kendo.data.DataSource({
          transport: {
            read: {
              url: function (e) {
                return __env.apiUrl() + dataSourceUrl;
              },
              contentType: "application/json; charset=UTF-8",
              type: "POST",
              data: { sort: [{ field: "id", dir: "asc" }] },
              beforeSend: function (req) {
                if (JSON.parse(sessionStorage.getItem("currentUser")) != null) {
                  req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
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
        $scope.relationLastStepDataSource.filter({
          logic: "and",
          sort: [{ field: "id", dir: "asc" }],
          filters: [
            { field: "useYn", operator: "eq", value: 1 },
            { field: "docId", operator: "eq", value: $scope.app.relationDocId },
          ],
        });

        grid.setOptions({
          columns: $scope.stepRelationColumns,
        });
      });
    };

    $scope.clickDataItem = function (dataItem) {
      $scope.app.docIds = [];
      $scope.app.docIds.push(dataItem);

      $scope.itemCode = dataItem.code;
      $scope.docRelationDataSource = null;
      mainService.withdomain("get", __env.apiUrl() + "/api/nms/policy/relation/getRelation?docId=" + $scope.app.docId + "&docCode=" + dataItem.code).then(function (data) {
        $scope.docRelationDataSource = data;
      });
    };

    function checkDataItem(arg) {
      var selectedRows = this.select();
      $scope.app.relationDocIds = [];
      for (var i = 0; i < selectedRows.length / 2; i++) {
        var dataItem = this.dataItem(selectedRows[i]);
        $scope.app.relationDocIds.push(dataItem);
      }
    }

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
  },
]);
