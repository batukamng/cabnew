angular.module("altairApp").controller("934NmsCtrl", [
  "$rootScope",
  "$state",
  "Upload",
  "$scope",
  "mainService",
  "$timeout",
  "commonDataSource",
  "__env",
  function ($rootScope, $state, Upload, $scope, mainService, $timeout, commonDataSource, __env) {
    $scope.menuEditor = function (container, options) {
      $scope.parentDataSource = commonDataSource.urlDataSource("/api/program/list", JSON.stringify({ custom: "where id!=" + options.model.id + " and parentId is null" }));
      var editor = $('<input kendo-drop-down-list  k-data-text-field="\'name\'" k-data-value-field="\'id\'" k-data-source="parentDataSource" data-bind="value:' + options.field + '"/>').appendTo(
        container
      );
    };
    $scope.filterDataSource = commonDataSource.urlDataSource("/api/program/list", JSON.stringify({ custom: "where parentId is null" }));
    $scope.mainGrid = {
      dataSource: {
        transport: {
          read: {
            url: __env.apiUrl() + "/api/nms/program/list",
            contentType: "application/json; charset=UTF-8",
            type: "POST",
            data: { custom: "where useYn=true", sort: [{ field: "id", dir: "desc" }] },
            beforeSend: function (req) {
              req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
            },
          },
          create: {
            url: __env.apiUrl() + "/api/nms/program",
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
            url: __env.apiUrl() + "/api/nms/program",
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
            url: __env.apiUrl() + "/api/nms/program",
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
              name: { type: "string", validation: { required: true } },
              url: { type: "string", validation: { required: true } },
              method: { type: "string", validation: { required: true } },
              useYn: { type: "boolean", defaultValue: true },
              menuUseAt: { type: "boolean", defaultValue: true },
              menuId: { type: "number", validation: { required: true } },
              menu: { defaultValue: null },
            },
          },
        },
        pageSize: 20,
        serverPaging: true,
        serverFiltering: true,
        serverSorting: true,
      },
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
          title: "#",
          headerAttributes: { class: "columnCenter" },
          attributes: { style: "text-align: center;" },
          template: "#= ++record #",
          width: 50,
        },
        { field: "name", title: "Нэр", filterable: { cell: { operator: "contains", showOperators: false } } },
        { field: "url", title: "Хаяг (URL)", filterable: { cell: { operator: "contains", showOperators: false } } },
        { field: "method", title: "Төрөл", filterable: { cell: { operator: "contains", showOperators: false } } },
        {
          field: "menuId",
          title: "Цэс",
          dataTextField: "name",
          dataValueField: "id",
          dataSource: $scope.menuDataSource,
          editor: $scope.menuEditor,
          template: "#if(menu!=null){# #=menu.name# #}#",
          headerAttributes: { style: "text-align: center; " },
        },
      ],
      dataBinding: function () {
        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
      },
      editable: "inline",
      height: function () {
        return $(window).height() - 110;
      },
    };

    if (localStorage.getItem("buttonData").includes("read")) {
      $scope.mainGrid.toolbar = ["excel", "search"];
    }
    if (localStorage.getItem("buttonData").includes("create")) {
      $scope.mainGrid.toolbar = [{ template: '<button class="k-button k-button-icontext k-grid-add"><span class="k-icon k-i-plus"></span>Нэмэх</button>' }];
    }
    if (localStorage.getItem("buttonData").includes("update") || localStorage.getItem("buttonData").includes("edit")) {
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
