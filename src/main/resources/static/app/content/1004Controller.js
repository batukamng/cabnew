angular.module("altairApp").controller("1004CntCtrl", [
  "$rootScope",
  "$state",
  "$scope",
  "$timeout",
  "mainService",
  "Upload",
  "sweet",
  "__env",
  function (
    $rootScope,
    $state,
    $scope,
    $timeout,
    mainService,
    Upload,
    sweet,
    __env
  ) {
    $scope.user = JSON.parse(localStorage.getItem("currentUser"));

    $scope.termEditor = function (container, options) {
      $scope.ddlDataSource = new kendo.data.HierarchicalDataSource({
        transport: {
          read: {
            url: __env.apiUrl() + "/api/cnt/term/list",
            contentType: "application/json; charset=UTF-8",
            type: "POST",
            /* data: {
                                    "custom":"where id!="+options.model.id+""
                                },*/
            sort: [{ field: "id", dir: "desc" }],
            beforeSend: function (req) {
              req.setRequestHeader(
                "Authorization",
                "Bearer " +
                  JSON.parse(localStorage.getItem("currentUser")).token
              );
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
        pageSize: 20,
        serverPaging: true,
        serverFiltering: true,
        serverSorting: true,
      });

      $scope.filterOption = {
        dataSource: $scope.ddlDataSource,
        dataTextField: "name",
        dataValueField: "id",
        filter: "startswith",
      };

      var editor = $(
        '<input kendo-drop-down-list  k-options="filterOption" data-bind="value:' +
          options.field +
          '"/>'
      ).appendTo(container);
    };

    $scope.sendBtn = false;

    $scope.fileUpload = function () {
      $scope.ddlDataSource = new kendo.data.HierarchicalDataSource({
        transport: {
          read: {
            url: __env.apiUrl() + "/api/cnt/term/list",
            contentType: "application/json; charset=UTF-8",
            type: "POST",
            /* data: {
                                     "custom":"where id!="+options.model.id+""
                                 },*/
            sort: [{ field: "id", dir: "desc" }],
            beforeSend: function (req) {
              req.setRequestHeader(
                "Authorization",
                "Bearer " +
                  JSON.parse(localStorage.getItem("currentUser")).token
              );
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
        pageSize: 20,
        serverPaging: true,
        serverFiltering: true,
        serverSorting: true,
      });

      $scope.customOptions = {
        dataSource: $scope.ddlDataSource,
        dataTextField: "name",
        dataValueField: "id",
        optionLabel: "Select term...",
        filter: "startswith",
      };
      UIkit.modal("#modal_file", {
        modal: false,
        keyboard: false,
        bgclose: false,
        center: false,
      }).show();
      $scope.sendBtn = true;
    };
    $scope.onSelect = function (e) {
      var message = $.map(e.files, function (file) {
        return file.name;
      }).join(", ");
      console.log("event :: select (" + message + ")");
    };

    $scope.submitUploadFormFile = function (event) {
      event.preventDefault();
      if ($scope.validator.validate()) {
        if ($scope.formFile.afl.$valid && $scope.afl) {
          Upload.upload({
            url: "/api/cnt/term/metas/file/" + $scope.termId,
            data: { files: $scope.afl },
          }).then(function (resp) {
            sweet.show("Анхаар!", "Амжилттай хадгаллаа.", "success");
            UIkit.modal("#modal_file").hide();
            $(".k-grid").data("kendoGrid").dataSource.read();
          });
        }
      }
    };

    $scope.mainGrid = {
      dataSource: {
        transport: {
          read: {
            url: function (e) {
              if (
                JSON.parse(localStorage.getItem("menuData")).rRead === "1" &&
                JSON.parse(localStorage.getItem("menuData")).link ===
                  $state.current.name
              ) {
                return __env.apiUrl() + "/api/cnt/term/metas/list";
              } else {
                localStorage.removeItem("currentUser");
                localStorage.removeItem("menuList");
                localStorage.removeItem("menuData");
                $state.go("login");
              }
            },
            contentType: "application/json; charset=UTF-8",
            type: "POST",
            data: { sort: [{ field: "id", dir: "desc" }] },
            beforeSend: function (req) {
              req.setRequestHeader(
                "Authorization",
                "Bearer " +
                  JSON.parse(localStorage.getItem("currentUser")).token
              );
            },
          },
          create: {
            url: __env.apiUrl() + "/api/cnt/term/metas/create",
            contentType: "application/json; charset=UTF-8",
            type: "POST",
            beforeSend: function (req) {
              req.setRequestHeader(
                "Authorization",
                "Bearer " +
                  JSON.parse(localStorage.getItem("currentUser")).token
              );
            },
            complete: function (e) {
              $(".k-grid").data("kendoGrid").dataSource.read();
            },
          },
          update: {
            url: __env.apiUrl() + "/api/cnt/term/metas/update",
            contentType: "application/json; charset=UTF-8",
            type: "PUT",
            beforeSend: function (req) {
              req.setRequestHeader(
                "Authorization",
                "Bearer " +
                  JSON.parse(localStorage.getItem("currentUser")).token
              );
            },
            complete: function (e) {
              $(".k-grid").data("kendoGrid").dataSource.read();
            },
          },
          destroy: {
            url: __env.apiUrl() + "/api/cnt/term/metas/delete",
            contentType: "application/json; charset=UTF-8",
            type: "DELETE",
            beforeSend: function (req) {
              req.setRequestHeader(
                "Authorization",
                "Bearer " +
                  JSON.parse(localStorage.getItem("currentUser")).token
              );
            },
          },
          parameterMap: function (options) {
            //  options.cntTerm= null;
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
              key: { type: "string", validation: { required: true } },
              value: { type: "string", validation: { required: true } },
              termId: { type: "number", validation: { required: true } },
              cntTerm: { defaultValue: {} },
            },
          },
        },
        pageSize: 20,
        serverPaging: true,
        serverFiltering: true,
        serverSorting: true,
      },
      excel: {
        allPages: true,
      },
      filterable: {
        mode: "row",
        extra: false,
        cell: {
          operator: "eq",
        },
      },
      sortable: true,
      resizable: true,
      pageable: {
        refresh: true,
        pageSizes: true,
        buttonCount: 5,
      },
      columns: [
        {
          title: "Д/д",
          headerAttributes: { class: "columnHeader" },
          template: "<span class='row-number'></span>",
          width: 50,
        },
        {
          field: "termId",
          // values:items,
          editor: $scope.termEditor,
          filterable: { cell: { operator: "contains" } },
          title: "Term",
          headerAttributes: { style: "text-align: center; font-weight: bold" },
        },
        {
          field: "key",
          filterable: { cell: { operator: "contains", showOperators: false } },
          title: "Key",
          headerAttributes: { style: "text-align: center; font-weight: bold" },
        },
        {
          field: "value",
          filterable: { cell: { operator: "contains", showOperators: false } },
          title: "Value",
          headerAttributes: { style: "text-align: center; font-weight: bold" },
        },
      ],
      dataBound: function () {
        var rows = this.items();
        $(rows).each(function () {
          var index =
            $(this).index() +
            1 +
            $(".k-grid").data("kendoGrid").dataSource.pageSize() *
              ($(".k-grid").data("kendoGrid").dataSource.page() - 1);
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
      $scope.mainGrid.toolbar = [
        {
          template:
            '<button class="k-button k-button-icontext k-grid-add"><span class="k-icon k-i-plus"></span>Нэмэх</button>',
        },
        { template: $("#Radd").html() },
        "search",
      ];
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
  },
]);
