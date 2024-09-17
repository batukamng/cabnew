angular.module("altairApp").controller("1003NmsCtrl", [
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
    $scope.user = JSON.parse(localStorage.getItem("currentUser"));

    // valuePrimitive: true,
    $scope.selectOptions = {
      placeholder: "Эрх сонгох...",
      dataTextField: "name",
      dataValueField: "id",
      valuePrimitive: true,
      autoBind: true,
      dataSource: {
        transport: {
          read: {
            url: __env.apiUrl() + "/api/role/list",
            contentType: "application/json; charset=UTF-8",
            type: "POST",
            data: { custom: "where auth in ('Tra0201','Nimis') or nimis is not null", sort: [{ field: "id", dir: "desc" }] },
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
        pageSize: 20,
        serverPaging: true,
        serverFiltering: true,
        serverSorting: true,
      },
    };
    $scope.mstDataSource = commonDataSource.urlDataSource(
      "/api/nms/general/governor/list",
      JSON.stringify({ filter: { logic: "and", filters: [{ field: "useYn", operator: "eq", value: true }] }, sort: [{ field: "ordNo", dir: "asc" }] })
    );
    $scope.amgDataSource = commonDataSource.urlDataSource(
      "/api/nms/as/code/list",
      JSON.stringify({
        filter: {
          logic: "and",
          filters: [
            { field: "parentId", operator: "isnull", value: true },
            { field: "useYn", operator: "eq", value: true },
          ],
        },
        sort: [{ field: "cdNm", dir: "asc" }],
      })
    );
    $scope.sumDataSource = commonDataSource.urlDataSource("/api/nms/as/code/list", JSON.stringify({ sort: [{ field: "cdNm", dir: "asc" }] }));
    $scope.orgDataSource = commonDataSource.urlDataSource("/api/nms/organization/list", JSON.stringify({ sort: [{ field: "name", dir: "asc" }] }));

    $scope.dataSource = new kendo.data.DataSource({
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
              filters: [{ field: "lvlCd", operator: "eq", value: "01" }],
            },
            sort: [{ field: "id", dir: "desc" }],
          },
          beforeSend: function (req) {
            req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
          },
        },
        update: {
          url: __env.apiUrl() + "/api/user/update",
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
          url: __env.apiUrl() + "/api/user/delete",
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
          url: __env.apiUrl() + "/api/user/create",
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
            lutRoles: [],
            roles: [],
            amgName: { type: "string", editable: false },
            sumName: { type: "string", editable: false },
            orgId: { type: "number", defaultValue: 0 },
            userType: { type: "number", defaultValue: 2 },
            useYn: { type: "boolean", defaultValue: true },
            organization: { nullable: true },
          },
        },
      },
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
        { field: "amgName", filterable: { cell: { operator: "contains", showOperators: false } }, title: "Аймаг", width: 200 },
        { field: "sumName", filterable: { cell: { operator: "contains", showOperators: false } }, title: "Сум", width: 200 },
        { field: "orgName", filterable: { cell: { operator: "eq", showOperators: false } }, title: "Байгууллага", width: 200 },
        { field: "lastName", filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: { class: "columnHeader" }, title: "Овог", width: 200 },
        { field: "firstName", filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: { class: "columnHeader" }, title: "Нэр", width: 200 },
        { field: "email", filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: { class: "columnHeader" }, title: "И-мэйл", width: 200 },
        { field: "username", filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: { class: "columnHeader" }, title: "Нэвтрэх нэр", width: 200 },
        {
          field: "password",
          filterable: { cell: { operator: "contains", showOperators: false } },
          headerAttributes: { class: "columnHeader" },
          title: "Нууц үг",
          template: "...",
          width: 200,
        },
        { field: "roleNameMn", filterable: { cell: { operator: "contains", showOperators: false } }, width: 200, headerAttributes: { class: "columnHeader" }, title: "Эрх" },
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
      $scope.main1Grid.toolbar = [{ template: '<button class="k-button k-button-icontext" ng-click=\'add(lvlCd)\'><span class="k-icon k-i-plus"></span>Нэмэх</button>' }];
    }
    if (localStorage.getItem("buttonData").includes("U")) {
      $scope.main1Grid.columns.push({
        command: [
          { template: '<button class="k-button k-button-icontext"  ng-click=\'update(dataItem)\'><span class="k-icon k-i-edit"></span></button>' },
          { name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn" },
        ],
        title: "&nbsp;",
        sticky: true,
        width: 100,
      });
    }

    var modalUser = UIkit.modal("#modal_user", {
      modal: false,
      keyboard: false,
      bgclose: false,
      center: true,
    });

    $scope.lvlCd = "01";
    $scope.userItem = {};
    $scope.add = function (type) {
      $scope.userItem = {};
      $scope.lvlCd = type;
      $scope.userItem.lvlCd = type;
      modalUser.show();
    };
    $scope.update = function (item) {
      $scope.userItem = item;
      $scope.userItem.roles = item.roleIds.split(",");
      $scope.lvlCd = item.lvlCd;
      modalUser.show();
    };

    $scope.userSubmit = function () {
      if ($scope.validator.validate()) {
        mainService.withdata("post", "/api/nms/user/create", $scope.userItem).then(function (data) {
          UIkit.notify("Амжилттай хадгаллаа.", { status: "success", pos: "bottom-center" });
          modalUser.hide();
          $(".k-grid").data("kendoGrid").dataSource.read();
        });
      }
    };

    $scope.tabStrip = {
      tabPosition: "top",
      animation: { open: { effects: "fadeIn" } },
      select: function (e) {
        if (e.item.id === "main_content-tab-1") {
          $scope.lvlCd = "01";
          $scope.dataSource.filter({
            logic: "and",
            filters: [
              { field: "lvlCd", operator: "eq", value: $scope.lvlCd },
              { field: "useYn", operator: "eq", value: true },
            ],
          });
        } else if (e.item.id === "main_content-tab-2") {
          $scope.lvlCd = "02";
          $scope.dataSource.filter({
            logic: "and",
            filters: [
              { field: "lvlCd", operator: "eq", value: $scope.lvlCd },
              { field: "useYn", operator: "eq", value: true },
            ],
          });
        } else if (e.item.id === "main_content-tab-3") {
          $scope.lvlCd = "03";
          $scope.dataSource.filter({
            logic: "and",
            filters: [
              { field: "lvlCd", operator: "eq", value: $scope.lvlCd },
              { field: "useYn", operator: "eq", value: true },
            ],
          });
        } else if (e.item.id === "main_content-tab-4") {
          $scope.lvlCd = "04";
          $scope.dataSource.filter({
            logic: "and",
            filters: [
              { field: "lvlCd", operator: "eq", value: $scope.lvlCd },
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
              { field: "amgName", filterable: { cell: { operator: "contains", showOperators: false } }, title: "Аймаг", width: 200 },
              { field: "sumName", filterable: { cell: { operator: "contains", showOperators: false } }, title: "Сум", width: 200 },
              { field: "orgName", filterable: { cell: { operator: "eq", showOperators: false } }, title: "Байгууллага", width: 200 },
              { field: "lastName", filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: { class: "columnHeader" }, title: "Овог", width: 200 },
              { field: "firstName", filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: { class: "columnHeader" }, title: "Нэр", width: 200 },
              { field: "email", filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: { class: "columnHeader" }, title: "И-мэйл", width: 200 },
              { field: "username", filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: { class: "columnHeader" }, title: "Нэвтрэх нэр", width: 200 },
              {
                field: "password",
                filterable: { cell: { operator: "contains", showOperators: false } },
                headerAttributes: { class: "columnHeader" },
                title: "Нууц үг",
                template: "...",
                width: 200,
              },
              { field: "roleNameMn", filterable: { cell: { operator: "contains", showOperators: false } }, width: 200, headerAttributes: { class: "columnHeader" }, title: "Эрх" },
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
            $scope.main2Grid.toolbar = [{ template: '<button class="k-button k-button-icontext k-grid-add"><span class="k-icon k-i-plus"></span>Нэмэх</button>' }];
          }
          if (localStorage.getItem("buttonData").includes("U")) {
            $scope.main2Grid.columns.push({
              command: [
                { template: '<button class="k-button k-button-icontext"  ng-click=\'update(dataItem)\'><span class="k-icon k-i-edit"></span></button>' },
                { name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn" },
              ],
              title: "&nbsp;",
              sticky: true,
              width: 100,
            });
          }
        } else if (e.item.id === "main_content-tab-5") {
          $scope.lvlCd = "05";
          $scope.dataSource.filter({
            logic: "and",
            filters: [
              { field: "lvlCd", operator: "eq", value: $scope.lvlCd },
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
              { field: "amgName", filterable: { cell: { operator: "contains", showOperators: false } }, title: "Аймаг", width: 200 },
              { field: "sumName", filterable: { cell: { operator: "contains", showOperators: false } }, title: "Сум", width: 200 },
              { field: "orgName", filterable: { cell: { operator: "eq", showOperators: false } }, title: "Байгууллага", width: 200 },
              { field: "lastName", filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: { class: "columnHeader" }, title: "Овог", width: 200 },
              { field: "firstName", filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: { class: "columnHeader" }, title: "Нэр", width: 200 },
              { field: "email", filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: { class: "columnHeader" }, title: "И-мэйл", width: 200 },
              { field: "username", filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: { class: "columnHeader" }, title: "Нэвтрэх нэр", width: 200 },
              {
                field: "password",
                filterable: { cell: { operator: "contains", showOperators: false } },
                headerAttributes: { class: "columnHeader" },
                title: "Нууц үг",
                template: "...",
                width: 200,
              },
              { field: "roleNameMn", filterable: { cell: { operator: "contains", showOperators: false } }, width: 200, headerAttributes: { class: "columnHeader" }, title: "Эрх" },
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
            $scope.main2Grid.toolbar = [{ template: '<button class="k-button k-button-icontext k-grid-add"><span class="k-icon k-i-plus"></span>Нэмэх</button>' }];
          }
          if (localStorage.getItem("buttonData").includes("U")) {
            $scope.main2Grid.columns.push({
              command: [
                { template: '<button class="k-button k-button-icontext"  ng-click=\'update(dataItem)\'><span class="k-icon k-i-edit"></span></button>' },
                { name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn" },
              ],
              title: "&nbsp;",
              sticky: true,
              width: 100,
            });
          }
        } else if (e.item.id === "main_content-tab-6") {
          $scope.lvlCd = "06";
          $scope.dataSource.filter({
            logic: "and",
            filters: [
              { field: "lvlCd", operator: "eq", value: $scope.lvlCd },
              { field: "useYn", operator: "eq", value: true },
            ],
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
                template: "#= ++record3 #",
                width: 50,
              },
              { field: "amgName", filterable: { cell: { operator: "contains", showOperators: false } }, title: "Аймаг", width: 200 },
              { field: "sumName", filterable: { cell: { operator: "contains", showOperators: false } }, title: "Сум", width: 200 },
              { field: "orgName", filterable: { cell: { operator: "eq", showOperators: false } }, title: "Байгууллага", width: 200 },
              { field: "lastName", filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: { class: "columnHeader" }, title: "Овог", width: 200 },
              { field: "firstName", filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: { class: "columnHeader" }, title: "Нэр", width: 200 },
              { field: "email", filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: { class: "columnHeader" }, title: "И-мэйл", width: 200 },
              { field: "username", filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: { class: "columnHeader" }, title: "Нэвтрэх нэр", width: 200 },
              {
                field: "password",
                filterable: { cell: { operator: "contains", showOperators: false } },
                headerAttributes: { class: "columnHeader" },
                title: "Нууц үг",
                template: "...",
                width: 200,
              },
              { field: "roleNameMn", filterable: { cell: { operator: "contains", showOperators: false } }, width: 200, headerAttributes: { class: "columnHeader" }, title: "Эрх" },
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
                { template: '<button class="k-button k-button-icontext"  ng-click=\'update(dataItem)\'><span class="k-icon k-i-edit"></span></button>' },
                { name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn" },
              ],
              title: "&nbsp;",
              sticky: true,
              width: 100,
            });
          }
        } else if (e.item.id === "main_content-tab-7") {
          $scope.lvlCd = "00";
          $scope.dataSource.filter({
            logic: "and",
            filters: [
              { field: "lvlCd", operator: "neq", value: $scope.lvlCd },
              { field: "useYn", operator: "eq", value: true },
            ],
          });
          $scope.main4Grid = {
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
                template: "#= ++record4 #",
                width: 50,
              },
              { field: "amgName", filterable: { cell: { operator: "contains", showOperators: false } }, title: "Аймаг", width: 200 },
              { field: "sumName", filterable: { cell: { operator: "contains", showOperators: false } }, title: "Сум", width: 200 },
              { field: "orgName", filterable: { cell: { operator: "eq", showOperators: false } }, title: "Байгууллага", width: 200 },
              { field: "lastName", filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: { class: "columnHeader" }, title: "Овог", width: 200 },
              { field: "firstName", filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: { class: "columnHeader" }, title: "Нэр", width: 200 },
              { field: "email", filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: { class: "columnHeader" }, title: "И-мэйл", width: 200 },
              { field: "username", filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: { class: "columnHeader" }, title: "Нэвтрэх нэр", width: 200 },
              {
                field: "password",
                filterable: { cell: { operator: "contains", showOperators: false } },
                headerAttributes: { class: "columnHeader" },
                title: "Нууц үг",
                template: "...",
                width: 200,
              },
              { field: "roleNameMn", filterable: { cell: { operator: "contains", showOperators: false } }, width: 200, headerAttributes: { class: "columnHeader" }, title: "Эрх" },
            ],
            dataBinding: function () {
              record4 = (this.dataSource.page() - 1) * this.dataSource.pageSize();
            },
            editable: "inline",
            scrollable: true,
            height: function () {
              return $(window).height() - 150;
            },
          };
          if (localStorage.getItem("buttonData").includes("R")) {
            $scope.main4Grid.toolbar = ["excel", "search"];
          }
          if (localStorage.getItem("buttonData").includes("C")) {
            $scope.main4Grid.toolbar = [{ template: '<button class="k-button k-button-icontext k-grid-add"><span class="k-icon k-i-plus"></span>Нэмэх</button>' }];
          }
          if (localStorage.getItem("buttonData").includes("U")) {
            $scope.main4Grid.columns.push({
              command: [
                { template: '<button class="k-button k-button-icontext"  ng-click=\'update(dataItem)\'><span class="k-icon k-i-edit"></span></button>' },
                { name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn" },
              ],
              title: "&nbsp;",
              sticky: true,
              width: 100,
            });
          }
        }
      },
    };
  },
]);
