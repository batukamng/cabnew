angular.module("altairApp").controller("1011NmsCtrl", [
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

    $scope.app = { useYn: true };

    //Тушаал, шийдвэрийн төрөл
    $scope.taskTypeDataSource = commonDataSource.urlDataSource(
      "/api/nms/common/code/list",
      JSON.stringify({
        filter: {
          logic: "and",
          filters: [
            { field: "grpCd", operator: "contains", value: "taskType" },
            { field: "parentId", operator: "isNull", value: "false" },
          ],
        },
        sort: [{ field: "orderId", dir: "asc" }],
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
      console.log("click add button");
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
        mainService.withdata("post", __env.apiUrl() + "/api/task/submit", $scope.app).then(function (data) {
          $rootScope.alert(true, "Амжилттай хадгаллаа.");
          $scope.stat(2, false, data.id);
          UIkit.modal("#modal_application").hide();
        });
      } else {
        $rootScope.alert(false, "Мэдээллийг бүрэн оруулна уу!!!");
      }
    };

    $scope.gotoDetail = function (item) {
      $scope.stat(1, false, item.id, item.ez.shortCd);
    };

    /*                $scope.gotoDocDetail = function (item) {
                    $state.go('restricted.policy.view', { id: item.id })
                };*/

    $scope.dataSource = new kendo.data.DataSource({
      transport: {
        read: {
          url: __env.apiUrl() + "/api/task/list",
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
          field: "decisionName",
          filterable: { cell: { operator: "contains", showOperators: false } },
          title: "Туш.шийдвэрийн нэр",
        },
        {
          field: "decisionNo",
          filterable: { cell: { operator: "contains", showOperators: false } },
          title: "Туш.шийдвэрийн дугаар",
        },
        {
          field: "decisionDate",
          filterable: { cell: { operator: "contains", showOperators: false } },
          title: "Туш.шийдвэрийн огноо",
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

    if (sessionStorage.getItem("buttonData").includes("R")) {
      $scope.mainGrid.toolbar = ["excel", "search"];
    }
    if (sessionStorage.getItem("buttonData").includes("C")) {
      $scope.mainGrid.toolbar = [{ template: "<button class='k-button k-button-icontext' ng-click='createApp()'><span class=\"k-icon k-i-plus\"></span>Нэмэх</button>" }, "search"];
    }
    if (sessionStorage.getItem("buttonData").includes("U")) {
      $scope.mainGrid.columns.push({
        command: [
          { template: '<button class="k-button k-button-icontext"  ng-click=\'gotoDetail(dataItem)\'><span class="k-icon k-i-edit"></span></button>' },
          // { template: "<button class=\"k-button k-button-icontext\"  ng-click='gotoDocDetail(dataItem)'><span class=\"k-icon k-i-eye\"></span></button>" },

          { name: "destroy", text: " ", iconClass: "k-icon k-i-delete" },
        ],
        title: "&nbsp;",
        width: 180,
        sticky: true,
        attributes: { style: "text-align: center;" },
      });
    }
  },
]);
