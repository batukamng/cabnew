angular.module("altairApp").controller("1014NmsCtrl", [
  "$rootScope",
  "$state",
  "$scope",
  "$timeout",
  "mainService",
  "commonDataSource",
  "Upload",
  "$http",
  "__env",
  function ($rootScope, $state, $scope, $timeout, mainService, commonDataSource, Upload, $http, __env) {
    $scope.user = JSON.parse(sessionStorage.getItem("currentUser"));

    $scope.app = { useYn: 1 };
    if($scope.user.user.amgId != null)
      $scope.app.amgId = $scope.user.user.amgId;

    $scope.steps;

    //Бодлогын баримт бичиг
    $scope.policyDocDataSource = commonDataSource.urlDataSource(
      "/api/nms/policy/list",
      JSON.stringify({
        filter: {
          logic: "and",
          filters: [
            { field: "useYn", operator: "eq", value: 1 },
            { field: "amgId", operator: "eq", value: $scope.user.user.amgId },
          ],
        },
        sort: [{ field: "id", dir: "asc" }],
      })
    );

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
      event.preventDefault();
      if ($scope.validatorProject.validate()) {
        mainService.withdata("post", __env.apiUrl() + "/api/policy/doc/submit", $scope.app).then(function (data) {
          $rootScope.alert(true, "Амжилттай хадгаллаа.");
          UIkit.modal("#modal_application").hide();
          $(".k-grid").data("kendoGrid").dataSource.read();
          $scope.stat(2, false, data.id);
        });
      } else {
        $rootScope.alert(false, "Мэдээллийг бүрэн оруулна уу!!!");
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

    $scope.gotoDocDetail = function (item) {
      $state.go("restricted.docRelation.view", { id: item.id });
    };

    $scope.gotoDocRelationDetail = function (item) {
      $state.go("restricted.policyDocRelation.view", { id: item.id });
    };

    $scope.dataSource = new kendo.data.DataSource({
      transport: {
        read: {
          url: function (e) {
            /*if (JSON.parse(sessionStorage.getItem('menuData')).rRead === 'read' && JSON.parse(sessionStorage.getItem('menuData')).link === $state.current.name) {
                      return __env.apiUrl() + "/api/policy/doc/list";
                    }
                    else {
                      sessionStorage.removeItem('currentUser');
                      sessionStorage.removeItem('menuList');
                      sessionStorage.removeItem('menuData');
                      $state.go('login');
                    }*/
            return __env.apiUrl() + "/api/policy/doc/list";
          },
          contentType: "application/json; charset=UTF-8",
          type: "POST",
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

    if ($scope.user.user.amgId != null) {
      $scope.dataSource.filter({
        logic: "and",
        sort: [
          { field: "typeId", dir: "asc" },
          { field: "refDocType", dir: "asc" },
        ],
        filters: [
          { field: "useYn", operator: "eq", value: 1 },
          { field: "amgId", operator: "eq", value: $scope.user.user.amgId },
        ],
      });
    } else {
      $scope.dataSource.filter({
        logic: "and",
        sort: [
          { field: "typeId", dir: "asc" },
          { field: "refDocType", dir: "asc" },
        ],
        filters: [{ field: "useYn", operator: "eq", value: 1 }],
      });
    }

    $scope.docChanged = function () {
      mainService.withdomain("get", __env.apiUrl() + "/api/nms/policy/mapping/" + $scope.app.docId).then(function (data) {
        $scope.policyDocMappingDataSource = data;
      });
    };

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
        {
          title: "#",
          headerAttributes: { class: "columnCenter" },
          attributes: { style: "text-align: center;" },
          template: "#= ++record #",
          sticky: true,
          width: 50,
        },
        {
          field: "docName",
          filterable: { cell: { operator: "contains", showOperators: false } },
          title: "Холболт хийсэн бодлогын баримт бичиг",
        },
        {
          field: "relationDocName",
          filterable: { cell: { operator: "contains", showOperators: false } },
          title: "Холбогдсон бодлогын баримт бичиг",
        },
      ],
      dataBinding: function () {
        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
      },
      editable: false,
      height: function () {
        return $(window).height() - 115;
      },
    };

    $scope.mainGrid.toolbar = ["excel"];
    if (sessionStorage.getItem("buttonData").includes("create")) {
      $scope.mainGrid.toolbar = [{ template: "<button class='md-btn custom-btn k-grid-add' ng-click='createApp()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>" }, "search"];
    }
    if (sessionStorage.getItem("buttonData").includes("edit")) {
      $scope.mainGrid.columns.push({
        command: [
          {
            /*
                    template:
                        '<button class="grid-btn k-grid-edit" ng-click=\'gotoDocDetail(dataItem)\'><div class="nimis-icon edit"></div></button>' +
                        '<button class="grid-btn k-grid-remove-command" ng-click=\'deleteData(dataItem)\'><div class="nimis-icon delete"></div></button></div>',
*/
            template:
              '<div class="flex gap-3"><button class="grid-btn k-grid-edit" ng-click=\'gotoDocDetail(dataItem)\'><div class="nimis-icon edit"></div></button><button class="grid-btn k-grid-remove-command" ng-click=\'deleteData(dataItem)\'><div class="nimis-icon delete"></div></button></div>',
          },
        ],
        title: "&nbsp;",
        sticky: true,
        width: 100,
      });
    }

    $scope.deleteData = function (item) {
      if (confirm("Тухайн бүртгэлийг устгахдаа итгэлтэй байна уу?")) {
        mainService.withdata("delete", __env.apiUrl() + "/api/policy/doc/" + item.id).then(function (data) {
          $rootScope.alert(true, "Устгах үйлдэл амжилттай боллоо.");
          $(".k-grid").data("kendoGrid").dataSource.read();
        });
      }
    };
  },
]);
