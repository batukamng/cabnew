angular.module("altairApp").controller("1032Ctrl", [
  "$rootScope",
  "$state",
  "$scope",
  "$timeout",
  "__env",
  "fileUpload",
  "$translate",
  function ($rootScope, $state, $scope, $timeout, __env, fileUpload, $translate) {
    $scope.parentEditor = function (container, options) {
      $scope.ddlDataSource = new kendo.data.HierarchicalDataSource({
        transport: {
          read: {
            url: __env.apiUrl() + "/api/org/all",
            contentType: "application/json; charset=UTF-8",
            type: "POST",
            data: {
              custom: "where id!=" + options.model.id + "",
            },
            sort: [{ field: "id", dir: "desc" }],
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
        },
        serverPaging: true,
        serverFiltering: true,
        serverSorting: true,
      });

      var editor = $('<input kendo-drop-down-list  k-data-text-field="\'text\'" k-data-value-field="\'value\'" k-data-source="ddlDataSource" data-bind="value:' + options.field + '"/>').appendTo(
        container
      );
    };

    $scope.modalUpload = function (i) {
      UIkit.modal("#modal_upload", {
        modal: false,
        keyboard: false,
        bgclose: false,
        center: false,
      }).show();
    };

    $scope.fileSelected = false;
    $scope.selectFile = function () {
      $scope.fileSelected = true;
    };

    $scope.submitUploadDifference = function (i) {
      if ($scope.formFile.act.$valid && $scope.act) {
        $scope.uploadExcel($scope.act);
      }
    };

    $scope.uploadExcel = function (file) {
      UIkit.modal("#modal_loader", {
        modal: false,
        keyboard: false,
        bgclose: false,
        center: true,
      }).show();

      var formDataAttach = new FormData();
      formDataAttach.append("file", file);
      UIkit.modal("#modal_upload").hide();

      fileUpload.uploadFileToUrl("/api/org/import", formDataAttach).then(function (resp) {
        $(".k-grid").data("kendoGrid").dataSource.read();
        UIkit.modal("#modal_loader").hide();
      });
    };

    $scope.mainGrid = {
      dataSource: {
        transport: {
          read: {
            url: function (e) {
              if (localStorage.getItem("buttonData").includes("read") && JSON.parse(localStorage.getItem("menuData")).link === $state.current.name) {
                return __env.apiUrl() + "/api/org/list";
              } else {
                localStorage.removeItem("currentUser");
                localStorage.removeItem("menuList");
                localStorage.removeItem("menuData");
                $state.go("login");
              }
            },
            data: { custom: "where mfa=true", sort: [{ field: "id", dir: "desc" }] },
            contentType: "application/json; charset=UTF-8",
            type: "POST",
            beforeSend: function (req) {
              req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
            },
          },
          create: {
            url: __env.apiUrl() + "/api/org/create",
            contentType: "application/json; charset=UTF-8",
            type: "POST",
            beforeSend: function (req) {
              req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
            },
            complete: function (e) {
              $(".k-grid").data("kendoGrid").dataSource.read();
            },
          },
          update: {
            url: __env.apiUrl() + "/api/org/update",
            contentType: "application/json; charset=UTF-8",
            type: "PUT",
            beforeSend: function (req) {
              req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
            },
            complete: function (e) {
              $(".k-grid").data("kendoGrid").dataSource.read();
            },
          },
          destroy: {
            url: __env.apiUrl() + "/api/org/delete",
            contentType: "application/json; charset=UTF-8",
            type: "DELETE",
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
              id: { editable: false, nullable: true },
              parentId: { type: "number" },
              name: { type: "string", validation: { required: true } },
              address: { type: "string", validation: { required: true } },
              phone: { type: "string" },
              web: { type: "string", validation: { required: true } },
              email: { type: "string", validation: { required: true } },
              regNum: { type: "string", validation: { required: true } },
              orgType: { type: "number" },
              typeId: { type: "number", defaultValue: 0 },
              auditOrganization: { defaultValue: {} },
              useYn: { type: "boolean", defaultValue: true },
              mfa: { type: "boolean", defaultValue: true },
            },
          },
        },
        pageSize: 20,
        serverPaging: true,
        serverFiltering: true,
        serverSorting: true,
      },
      filterable: true,
      sortable: true,
      resizable: true,
      pageable: {
        pageSizes: ["All", 20, 50],
        refresh: true,
        buttonCount: 5,
        message: {
          empty: "No Data",
          allPages: "All",
        },
      },
      columns: [
        {
          title: '{{"Num" | translate}}',
          headerAttributes: { class: "columnHeader" },
          template: "<span class='row-number'></span>",
          width: "50px",
        },
        { field: "name", headerAttributes: { class: "columnHeader" }, title: '{{"Org name" | translate}}' },
        { field: "lpReg", headerAttributes: { class: "columnHeader" }, title: '{{"Regnum" | translate}}' },
        { field: "phone", headerAttributes: { class: "columnHeader" }, title: '{{"Phone" | translate}}' },
        { field: "web", headerAttributes: { class: "columnHeader" }, title: '{{"Web" | translate}}' },
        { field: "email", headerAttributes: { class: "columnHeader" }, title: '{{"Email" | translate}}' },
        {
          field: "useYn",
          headerAttributes: { class: "columnHeader" },
          template: "#if(useYn){# <span class='columnCenter'>Y</span> #}else{#<span class='columnCenter uk-text-danger'>N</span> #}#",
          title: '{{"Use" | translate}}',
          width: 130,
        },
      ],
      dataBound: function () {
        var rows = this.items();
        $(rows).each(function () {
          var index = $(this).index() + 1 + $(".k-grid").data("kendoGrid").dataSource.pageSize() * ($(".k-grid").data("kendoGrid").dataSource.page() - 1);
          var rowLabel = $(this).find(".row-number");
          $(rowLabel).html(index);
        });
      },
      editable: "inline",
      height: function () {
        return $(window).height() - 110;
      },
    };
    if (localStorage.getItem("buttonData").includes("R")) {
      $scope.mainGrid.toolbar = ["excel", "search"];
    }
    if (localStorage.getItem("buttonData").includes("C")) {
      $scope.mainGrid.toolbar = [{ template: '<button class="k-button k-button-icontext k-grid-add"><span class="k-icon k-i-plus"></span>Нэмэх</button>' }, "search"];
    }
    if (localStorage.getItem("buttonData").includes("U")) {
      $scope.mainGrid.columns.push({
        command: [
          { name: "edit", text: { edit: " ", update: " ", cancel: " " } },
          { name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn" },
        ],
        title: "&nbsp;",
        width: 100,
      });
    }

    if (JSON.parse(localStorage.getItem("privilege")) != null) {
      var privileges = JSON.parse(localStorage.getItem("privilege"));
      angular.forEach(privileges, function (value, key) {
        if (value.name === "READ") {
          $scope.mainGrid.toolbar = ["excel", "search"];
        }
        if (value.name === "WRITE") {
          $scope.mainGrid.toolbar = [{ template: '<button class="k-button k-button-icontext k-grid-add"><span class="k-icon k-i-plus"></span>Нэмэх</button>' }, "search"];
        }
        if (value.name === "UPDATE") {
          $scope.mainGrid.columns.push({
            command: [
              { name: "edit", text: { edit: " ", update: " ", cancel: " " } },
              { name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn" },
            ],
            title: "&nbsp;",
            width: 100,
          });
        }
      });
    }
  },
]);
