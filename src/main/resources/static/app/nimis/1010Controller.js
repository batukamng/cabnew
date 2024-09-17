angular.module("altairApp").controller("1010NmsCtrl", [
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
    $scope.user = JSON.parse(localStorage.getItem("currentUser")).user;
    $scope.governorDataSource = commonDataSource.urlPageDataSource(
      "/api/nms/general/governor/list",
      JSON.stringify({ filter: { field: "useYn", operator: "eq", value: true }, sort: [{ field: "name", dir: "asc" }] }),
      200
    );

    //$scope.orgDataSource = commonDataSource.urlPageDataSource("/api/nms/organization/list", JSON.stringify({ filter: {logic: "and", filters: [{field: "useYn", operator: "eq", value: true},{field: "amgId", operator: "eq", value: $scope.user.amgId}]}, sort: [{ field: "name", dir: "asc" }] }), 30);
    $scope.orgDataSource = commonDataSource.urlPageDataSource(
      "/api/nms/organization/list",
      JSON.stringify({
        custom: "where useYn=true and amgId=" + $scope.user.amgId + " and helber in ('ТБАГ','ТБАГУТҮГ','ТӨХК','УТҮГ','Орон нутгийн өмчит ААТҮГ','ГҮТББ','НҮТББ')",
        sort: [{ field: "id", dir: "asc" }],
      }),
      30
    );

    $scope.tezOrgDataSource = commonDataSource.urlPageDataSource(
      "/api/nms/organization/list",
      JSON.stringify({
        filter: {
          logic: "and",
          filters: [
            { field: "useYn", operator: "eq", value: true },
            { field: "tezId", operator: "eq", value: $scope.user.nmsTezId },
          ],
        },
        sort: [{ field: "name", dir: "asc" }],
      }),
      30
    );

    $scope.govOrg = {};
    $scope.addNew = function (i) {
      $scope.govOrg.typeId = i;
      $scope.govOrg.govId = $scope.user.nmsTezId;
      UIkit.modal("#modal_application", {
        modal: false,
        keyboard: false,
        bgclose: false,
        center: true,
      }).show();
    };
    $scope.submitProject = function (event) {
      event.preventDefault();
      if ($scope.validatorProject.validate()) {
        mainService.withdata("post", __env.apiUrl() + "/api/nms/gov/org", $scope.govOrg).then(function (data) {
          $rootScope.alert(true, "Амжилттай хадгаллаа.");
          UIkit.modal("#modal_application").hide();
          $scope.dataSource.filter({
            logic: "and",
            filters: [
              { field: "typeId", operator: "eq", value: $scope.govOrg.typeId },
              { field: "useYn", operator: "eq", value: true },
            ],
          });
        });
      } else {
        //$rootScope.alert(false,"Бүрэн бөглөнө үү.");
      }
    };

    $scope.orgEditor = function (container, options) {
      var arr = [];
      if (options.model.orgId != null && options.model.orgId != 0) {
        arr.push({ field: "id", operator: "eq", value: options.model.orgId });
      }
      $scope.orgEditDataSource = new kendo.data.DataSource({
        transport: {
          read: {
            url: __env.apiUrl() + "/api/nms/organization/list",
            contentType: "application/json; charset=UTF-8",
            data: { filter: { logic: "or", filters: arr } },
            type: "POST",
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
        pageSize: 10,
        serverPaging: true,
        serverFiltering: true,
        serverSorting: true,
      });
      /* $scope.orgDataSource.filter(
                        {
                            field: "id",
                            operator: "eq" ,
                            value: options.model.orgId
                        });*/

      var editor = $(
        '<select kendo-drop-down-list  k-filter="\'startswith\'" required k-data-text-field="\'name\'" k-data-value-field="\'id\'" k-data-source="orgEditDataSource" data-bind="value:' +
          options.field +
          '"></select>'
      ).appendTo(container);
    };
    $scope.userDataSource = new kendo.data.DataSource({
      transport: {
        read: {
          url: function (e) {
            return __env.apiUrl() + "/api/nms/user/list";
          },
          contentType: "application/json; charset=UTF-8",
          type: "POST",
          data: {
            filter: {
              logic: "and",
              filters: [{ field: "userType", operator: "eq", value: 2 }],
            },
            sort: [{ field: "id", dir: "desc" }],
          },
          beforeSend: function (req) {
            req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
          },
        },
        update: {
          url: __env.apiUrl() + "/api/nms/user/update",
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
          url: __env.apiUrl() + "/api/nms/user",
          contentType: "application/json; charset=UTF-8",
          beforeSend: function (req) {
            req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
          },
          complete: function (e) {
            $(".k-grid").data("kendoGrid").dataSource.read();
          },
          type: "DELETE",
        },
        create: {
          url: __env.apiUrl() + "/api/nms/user/create",
          contentType: "application/json; charset=UTF-8",
          type: "POST",
          beforeSend: function (req) {
            req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
          },
          complete: function (e) {
            $(".k-grid").data("kendoGrid").dataSource.read();
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
            nmsOrgId: { type: "number", validation: { required: true } },
            nmsTezId: { type: "number", defaultValue: $scope.user.nmsTezId },
            lvlCd: { type: "string", defaultValue: "00" },
            organization: { defaultValue: {} },
            useYn: { type: "boolean", defaultValue: true },
          },
        },
      },
      pageSize: 10,
      serverPaging: true,
      serverFiltering: true,
      serverSorting: true,
    });
    $scope.dataSource = new kendo.data.DataSource({
      transport: {
        read: {
          url: __env.apiUrl() + "/api/nms/gov/org/list",
          contentType: "application/json; charset=UTF-8",
          type: "POST",
          data: { sort: [{ field: "id", dir: "desc" }] },
          beforeSend: function (req) {
            req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
          },
        },
        update: {
          url: __env.apiUrl() + "/api/nms/gov/org",
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
          url: __env.apiUrl() + "/api/nms/gov/org",
          contentType: "application/json; charset=UTF-8",
          beforeSend: function (req) {
            req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
          },
          complete: function (e) {
            $(".k-grid").data("kendoGrid").dataSource.read();
          },
          type: "DELETE",
        },
        create: {
          url: __env.apiUrl() + "/api/nms/gov/org",
          contentType: "application/json; charset=UTF-8",
          type: "POST",
          beforeSend: function (req) {
            req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
          },
          complete: function (e) {
            $(".k-grid").data("kendoGrid").dataSource.read();
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
            orgId: { type: "number" },
            govId: { type: "number", editable: false },
            useYn: { type: "boolean", defaultValue: true },
          },
        },
      },
      filter: { field: "typeId", operator: "eq", value: 0 },
      pageSize: 10,
      serverPaging: true,
      serverFiltering: true,
      serverSorting: true,
    });
    $scope.main1Grid = {
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
      excel: {
        fileName: "user.xlsx",
        filterable: true,
        allPages: true,
      },
      pageable: {
        refresh: true,
        pageSizes: true,
        buttonCount: 5,
      },
      columns: [
        {
          title: "#",
          headerAttributes: { class: "columnCenter" },
          attributes: { style: "text-align: center;" },
          template: "#= ++record #",
          width: 50,
        },
        {
          field: "govId",
          filterable: { cell: { operator: "eq", showOperators: false } },
          dataTextField: "name",
          dataValueField: "id",
          dataSource: $scope.governorDataSource,
          headerAttributes: { class: "columnHeader" },
          template: "#if(governor!=null){# <span>#=governor.name#</span> #}#",
          title: "Ерөнхийлөн захирагч",
        },
        {
          field: "orgId",
          editor: $scope.orgEditor,
          filterable: { cell: { operator: "eq", showOperators: false } },
          dataTextField: "name",
          dataValueField: "id",
          dataSource: $scope.orgDataSource,
          headerAttributes: { class: "columnHeader" },
          template: "#if(organization!=null){# <span>#=organization.name#</span> #}#",
          title: "Агентлаг",
        },
      ],
      dataBinding: function () {
        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
      },
      editable: "inline",
      scrollable: true,
      height: function () {
        return $(window).height() - 150;
      },
    };
    if (localStorage.getItem("buttonData").includes("R")) {
      $scope.main1Grid.toolbar = ["excel", "search"];
    }
    if (localStorage.getItem("buttonData").includes("C")) {
      $scope.main1Grid.toolbar = [{ template: '<button class="k-button k-button-icontext" ng-click=\'addNew(0)\'><span class="k-icon k-i-plus"></span>Нэмэх</button>' }];
    }
    if (localStorage.getItem("buttonData").includes("U")) {
      $scope.main1Grid.columns.push({
        command: [
          { name: "edit", text: { edit: " ", update: " ", cancel: " " } },
          { name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn" },
        ],
        title: "&nbsp;",
        sticky: true,
        width: 100,
      });
    }
    $scope.tabStrip = {
      tabPosition: "top",
      animation: { open: { effects: "fadeIn" } },
      select: function (e) {
        if (e.item.id === "main_content-tab-1") {
          $scope.orgDataSource = commonDataSource.urlPageDataSource(
            "/api/nms/organization/list",
            JSON.stringify({
              filter: {
                logic: "and",
                filters: [
                  { field: "useYn", operator: "eq", value: true },
                  { field: "amgId", operator: "eq", value: $scope.user.amgId },
                ],
              },
              sort: [{ field: "name", dir: "asc" }],
            }),
            30
          );
          $scope.dataSource.filter({
            logic: "and",
            filters: [
              { field: "typeId", operator: "eq", value: 0 },
              { field: "useYn", operator: "eq", value: true },
            ],
          });
        } else if (e.item.id === "main_content-tab-2") {
          $scope.orgDataSource = commonDataSource.urlPageDataSource(
            "/api/nms/organization/list",
            JSON.stringify({
              filter: {
                logic: "and",
                filters: [
                  { field: "useYn", operator: "eq", value: true },
                  { field: "typeCh", operator: "eq", value: 1 },
                ],
              },
              sort: [{ field: "name", dir: "asc" }],
            }),
            30
          );
          $scope.dataSource.filter({
            logic: "and",
            filters: [
              { field: "typeId", operator: "eq", value: 1 },
              { field: "useYn", operator: "eq", value: true },
            ],
          });
          $scope.main2Grid = {
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
            excel: {
              fileName: "user.xlsx",
              filterable: true,
              allPages: true,
            },
            pageable: {
              refresh: true,
              pageSizes: true,
              buttonCount: 5,
            },
            columns: [
              {
                title: "#",
                headerAttributes: { class: "columnCenter" },
                attributes: { style: "text-align: center;" },
                template: "#= ++record2 #",
                width: 50,
              },
              {
                field: "govId",
                filterable: { cell: { operator: "contains", showOperators: false } },
                dataTextField: "name",
                dataValueField: "id",
                dataSource: $scope.governorDataSource,
                headerAttributes: { class: "columnHeader" },
                template: "#if(governor!=null){# <span>#=governor.name#</span> #}#",
                title: "Ерөнхийлөн захирагч",
              },
              {
                field: "orgId",
                editor: $scope.orgEditor,
                filterable: { cell: { operator: "contains", showOperators: false } },
                dataTextField: "name",
                dataValueField: "id",
                dataSource: $scope.orgDataSource,
                headerAttributes: { class: "columnHeader" },
                template: "#if(organization!=null){# <span>#=organization.name#</span> #}#",
                title: "Агентлаг",
              },
            ],
            dataBinding: function () {
              record2 = (this.dataSource.page() - 1) * this.dataSource.pageSize();
            },
            editable: "inline",
            scrollable: true,
            height: function () {
              return $(window).height() - 150;
            },
          };
          if (localStorage.getItem("buttonData").includes("R")) {
            $scope.main2Grid.toolbar = ["excel", "search"];
          }
          if (localStorage.getItem("buttonData").includes("C")) {
            $scope.main2Grid.toolbar = [{ template: '<button class="k-button k-button-icontext" ng-click=\'addNew(1)\'><span class="k-icon k-i-plus"></span>Нэмэх</button>' }];
          }
          if (localStorage.getItem("buttonData").includes("U")) {
            $scope.main2Grid.columns.push({
              command: [
                { name: "edit", text: { edit: " ", update: " ", cancel: " " } },
                { name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn" },
              ],
              title: "&nbsp;",
              width: 100,
            });
          }
        } else if (e.item.id === "main_content-tab-3") {
          $scope.userDataSource.filter({
            logic: "and",
            filters: [{ field: "nmsTezId", operator: "eq", value: $scope.user.nmsTezId }],
          });
          $scope.main3Grid = {
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
            columns: [
              {
                title: "#",
                headerAttributes: { class: "columnCenter" },
                attributes: { style: "text-align: center;" },
                template: "#= ++record3 #",
                width: 50,
              },
              {
                field: "nmsOrgId",
                filterable: { cell: { operator: "contains", showOperators: false } },
                dataTextField: "cdNm",
                dataValueField: "id",
                dataSource: $scope.orgDataSource,
                headerAttributes: { class: "columnHeader" },
                width: 200,
                template: "#if(organization!=null){# <span>#=organization.name#</span> #}#",
                editor: $scope.orgEditor,
                title: "Байгууллага",
              },
              {
                field: "lvlCd",
                values: [
                  { text: "Сум мэргэжилтэн", value: "10" },
                  { text: "Агентлаг мэргэжилтэн", value: "11" },
                  { text: "Аймаг төлөвлөлт", value: "20" },
                  { text: "Аймаг хэрэгжилт", value: "21" },
                  { text: "Аймаг дарга", value: "22" },
                ],
                filterable: { cell: { operator: "contains", showOperators: false } },
                headerAttributes: { class: "columnHeader" },
                title: "Төрөл",
                width: 200,
              },
              { field: "lastName", filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: { class: "columnHeader" }, title: "Овог", width: 200 },
              { field: "firstName", filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: { class: "columnHeader" }, title: "Нэр", width: 200 },
              { field: "email", filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: { class: "columnHeader" }, title: "И-мэйл", width: 200 },
              { field: "username", filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: { class: "columnHeader" }, title: "Нэвтрэх нэр", width: 200 },
              {
                field: "password",
                filterable: { cell: { operator: "contains", showOperators: false } },
                headerAttributes: { class: "columnHeader" },
                editor: function (container, options) {
                  $(
                    '<input data-text-field="' +
                      options.field +
                      '" ' +
                      'class="k-input k-textbox" ' +
                      'type="password" ' +
                      'data-value-field="' +
                      options.field +
                      '" ' +
                      'data-bind="value:' +
                      options.field +
                      '"/>'
                  ).appendTo(container);
                },
                title: "Нууц үг",
                template: "...",
                width: 200,
              },
            ],
            dataBinding: function () {
              record3 = (this.dataSource.page() - 1) * this.dataSource.pageSize();
            },
            editable: "inline",
            scrollable: true,
            height: function () {
              return $(window).height() - 150;
            },
          };
          if (localStorage.getItem("buttonData").includes("R")) {
            $scope.main3Grid.toolbar = ["excel", "search"];
          }
          if (localStorage.getItem("buttonData").includes("C")) {
            $scope.main3Grid.toolbar = [{ template: '<button class="k-button k-button-icontext k-grid-add"><span class="k-icon k-i-plus"></span>Нэмэх</button>' }];
          }
          if (localStorage.getItem("buttonData").includes("U")) {
            $scope.main3Grid.columns.push({
              command: [
                { name: "edit", text: { edit: " ", update: " ", cancel: " " } },
                { name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn" },
              ],
              title: "&nbsp;",
              width: 100,
            });
          }
        }
      },
    };
  },
]);
