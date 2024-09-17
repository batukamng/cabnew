angular.module("altairApp").controller("1013NmsCtrl", [
  "$rootScope",
  "$state",
  "$scope",
  "$timeout",
  "$translate",
  "commonDataSource",
  "mainService",
  "__env",
  function ($rootScope, $state, $scope, $timeout, $translate, commonDataSource, mainService, __env) {
    $scope.user = JSON.parse(localStorage.getItem("currentUser")).user;
    $scope.dataItem = {
      orgType: 0,
    };

    $scope.noFilterDataSource = commonDataSource.urlDataSource(
      "/api/nms/organization/listNoFilter",
      JSON.stringify({ filter: { logic: "and", filters: [{ field: "useYn", operator: "eq", value: 1 }] }, sort: [{ field: "id", dir: "asc" }] })
    );
    $scope.createApp = function () {
      $timeout(function () {
        $(".k-pager-info").css("display", "flex");
        UIkit.modal("#modal_application", {
          modal: false,
          keyboard: false,
          bgclose: false,
          center: true,
        }).show();

        $scope.noFilterDataSource.filter({
          logic: "and",
          filters: [{ field: "useYn", operator: "eq", value: 1 }],
        });

        $scope.rightTabDataSource.filter({
          logic: "and",
          filters: [
            { field: "useYn", operator: "eq", value: 1 },
            { field: "headerOrgId", operator: "eq", value: $scope.user.orgId },
          ],
        });
      }, 100);
    };
    $scope.orgFetchDisable = true;
    $scope.filterOrg = function () {
      if ($scope.searchValue !== "" && $scope.searchValue.length === 7) $scope.orgFetchDisable = false;
      else $scope.orgFetchDisable = true;
    };
    $scope.orgFetch = function () {
      mainService.withdata("get", __env.apiUrl() + "/api/nms/organization/fetch/" + $scope.searchValue).then(function (data) {
        $scope.orgData = data;
        $scope.app.lpReg = data.lpReg;
        $scope.app.orgId = data.id;
        $rootScope.alert(true, "Татах үйлдэл амжилттай.");
      });
    };

    $scope.dataSource = new kendo.data.DataSource({
      transport: {
        read: {
          url: __env.apiUrl() + "/api/nms/organization/list",
          contentType: "application/json; charset=UTF-8",
          type: "POST",
          data: { sort: [{ field: "id", dir: "desc" }] },
          beforeSend: function (req) {
            if (JSON.parse(localStorage.getItem("currentUser")) != null) {
              req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
            } else {
              $state.go("login");
              $rootScope.$broadcast("LogoutSuccessful");
            }
          },
        },
        destroy: {
          url: __env.apiUrl() + "/api/nms/organization",
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
            id: { type: "number", nullable: true },
            groupId: { type: "string", validation: { required: true, min: 1 } },
            amgId: { type: "number", validation: { required: true, min: 1 } },
            sumId: { type: "number", validation: { required: true, min: 1 } },
            group: { defaultValue: null },
            aimag: { defaultValue: null },
            soum: { defaultValue: null },
            typeSp: { type: "number", validation: { required: true } },
            typeCh: { type: "number", validation: { required: true } },
            typePr: { type: "number", validation: { required: true } },
            typePb: { type: "number", validation: { required: true } },
            typeMf: { type: "number", validation: { required: true } },
            title: { type: "string", validation: { required: true } },
            titleDesc: { type: "string", validation: { required: true } },
            helber: { type: "string" },
            sample: { type: "string", validation: { required: true } },
            guidance: { type: "string", validation: { required: true } },
            useYn: { type: "number", defaultValue: 1 },
          },
        },
      },
      // filter:{logic: "and", filters: [{field: "useYn", operator: "eq", value: 1},{field: "tezId", operator: "eq", value: $scope.user.tezId}]},
      filter: { logic: "and", filters: [{ field: "useYn", operator: "eq", value: 1 }] },
      pageSize: 20,
      serverPaging: true,
      serverSorting: true,
      serverFiltering: true,
    });
    $scope.mainGrid = {
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
      excel: {
        fileName: "Projects.xlsx",
        allPages: true,
        filterable: true,
      },
      sortable: true,
      resizable: true,
      reorderable: true,
      pageable: {
        pageSizes: [20, 50, 100],
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
        { field: "name", filterable: { cell: { operator: "contains", suggestionOperator: "contains", showOperators: false } }, headerAttributes: { class: "columnHeader" }, width: 250, title: "Нэр" },
        { field: "lpReg", filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: { class: "columnHeader" }, width: 150, title: "Регистр" },
        {
          field: "tezId",
          template: "#=tezNm#",
          editor: $scope.tezEditor,
          filterable: { cell: { operator: "contains", showOperators: false } },
          headerAttributes: { class: "columnHeader" },
          title: "ТЕЗ",
        },
        {
          field: "amgId",
          template: "#=amgNm#",
          editor: $scope.amgEditor,
          headerAttributes: { class: "columnHeader" },
          width: 150,
          filterable: { cell: { operator: "contains", suggestionOperator: "contains", showOperators: false } },
          title: "Аймаг",
        },
        {
          field: "sumId",
          template: "#=sumNm#",
          editor: $scope.sumEditor,
          headerAttributes: { class: "columnHeader" },
          width: 150,
          filterable: { cell: { operator: "contains", suggestionOperator: "contains", showOperators: false } },
          title: "Сум",
        },
        { field: "usrCnt", filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: { class: "columnHeader" }, width: 150, title: "Хэрэглэгч" },
      ],
      dataBinding: function () {
        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
      },
      editable: "inline",
      height: function () {
        return $(window).height() - 150;
      },
    };

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
      pageable: {
        pageSizes: [20, 50, 100],
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
          width: 50,
        },
        { field: "name", filterable: { cell: { operator: "contains", suggestionOperator: "contains", showOperators: false } }, headerAttributes: { class: "columnHeader" }, title: "Нэр" },
        { field: "lpReg", width: 150, filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: { class: "columnHeader" }, title: "Регистр" },
      ],
      dataBinding: function () {
        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
      },
      editable: "inline",
      height: function () {
        return $(window).height() - 150;
      },
    };

    if (localStorage.getItem("buttonData").includes("update") || localStorage.getItem("buttonData").includes("edit")) {
      $scope.mainGrid.columns.push({
        command: [{ name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn" }],
        title: "&nbsp;",
        sticky: true,
        width: 60,
      });
      $scope.main2Grid.columns.push({
        command: [{ name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn" }],
        title: "&nbsp;",
        sticky: true,
        width: 60,
      });
    }
    $scope.tabStrip = {
      tabPosition: "top",
      animation: { open: { effects: "fadeIn" } },
      select: function (e) {
        if (e.item.id === "main_content-tab-1") {
          $scope.dataSource.filter({ logic: "and", filters: [{ field: "useYn", operator: "eq", value: 1 }] });
        } else if (e.item.id === "main_content-tab-2") {
          $scope.dataSource.filter({
            logic: "and",
            filters: [
              { field: "useYn", operator: "eq", value: 1 },
              { field: "typeCh", operator: "eq", value: 1 },
            ],
          });
          $scope.rightGridDataSource.filter({
            logic: "and",
            filters: [
              { field: "useYn", operator: "eq", value: 1 },
              { field: "orgType", operator: "eq", value: 1 },
            ],
          });
        } else if (e.item.id === "main_content-tab-3") {
          $scope.dataSource.filter({
            logic: "and",
            filters: [
              { field: "useYn", operator: "eq", value: 1 },
              { field: "typeSp", operator: "eq", value: 1 },
            ],
          });
          $scope.rightGridDataSource.filter({
            logic: "and",
            filters: [
              { field: "useYn", operator: "eq", value: 1 },
              { field: "orgType", operator: "eq", value: 2 },
            ],
          });
        }
      },
    };

    $scope.addToRelative = function (item) {
      if (item.headerOrgId != null) {
        mainService.withdata("get", __env.apiUrl() + "/api/nms/organization/item/" + item.headerOrgId).then(function (data) {
          $rootScope.alert(
            false,
            "Энэхүү байгууллага нь " + data.name + "-д харьяалагдаж байна. Хэрэв та өөрийн харьяа байгууллагаар тохируулах бол " + data.name + " руу холбогдож харьяа байгууллагаас хасуулна уу."
          );
        });
      } else {
        $scope.region = { targetOrgId: item.id, sourceOrgId: $scope.user.orgId, type: 1 };
        mainService.withdata("post", __env.apiUrl() + "/api/nms/organization/setRegion", $scope.region).then(function (data) {
          $("#rightTabData").data("kendoGrid").dataSource.read();

          $scope.noFilterDataSource = commonDataSource.urlDataSource(
            "/api/nms/organization/listNoFilter",
            JSON.stringify({ filter: { logic: "and", filters: [{ field: "useYn", operator: "eq", value: 1 }] }, sort: [{ field: "id", dir: "asc" }] })
          );
          $scope.rightDataSource = commonDataSource.urlDataSource(
            "/api/nms/organization/list",
            JSON.stringify({
              filter: {
                logic: "and",
                filters: [
                  { field: "useYn", operator: "eq", value: 1 },
                  { field: "headerOrgId", operator: "eq", value: $scope.user.orgId },
                ],
              },
              sort: [{ field: "id", dir: "asc" }],
            })
          );
          /*
                    $scope.noFilterDataSource.filter(
                        {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1},{field: "tezId", operator: "neq", value: $scope.user.tezId}]}
                    );
                    $scope.dataSource.filter(
                        {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1},{field: "tezId", operator: "eq", value: $scope.user.tezId}]}
                    );*/
        });
      }

      /*if($scope.dataItem.orgType===0){
                item.tezId=$scope.user.tezId;
                mainService.withdata("put", __env.apiUrl() + "/api/nms/organization",item).then(function (data) {
                    $("#rightTabData").data("kendoGrid").dataSource.read();
                    $scope.noFilterDataSource.filter(
                        {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1},{field: "tezId", operator: "neq", value: $scope.user.tezId}]}
                    );
                    $scope.dataSource.filter(
                        {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1},{field: "tezId", operator: "eq", value: $scope.user.tezId}]}
                    );
                });
            }
            if($scope.dataItem.orgType===1 || $scope.dataItem.orgType===2){
                let obj = {tezId: $scope.user.tezId, orgType: $scope.dataItem.orgType, orgId: item.id};
                mainService.withdata("post", __env.apiUrl() + "/api/nms/tez/org/submit",obj).then(function (data) {
                    // $rootScope.alert(true, "Амжилттай хадгаллаа.");
                    $scope.rightDataSource.filter(
                        {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1},{field: "orgType", operator: "eq", value: $scope.dataItem.orgType}]}
                    );
                    $scope.rightGridDataSource.filter(
                        {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1},{field: "orgType", operator: "eq", value: $scope.dataItem.orgType}]}
                    );
                });
            }
            if($scope.dataItem.orgType===4){

            }*/
    };

    $scope.removeToRelative = function (item, type) {
      console.log("removeToRelative");
      /*if(type===0){
                item.tezId=null;
                mainService.withdata("put", __env.apiUrl() + "/api/nms/organization",item).then(function (data) {
                    $("#rightTabData").data("kendoGrid").dataSource.read();
                    $scope.noFilterDataSource.filter(
                        {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1},{field: "tezId", operator: "neq", value: $scope.user.tezId}]}
                    );
                    $scope.dataSource.filter(
                        {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1},{field: "tezId", operator: "eq", value: $scope.user.tezId}]}
                    );
                });
            }
            if(type===1 || type===2){
                let obj = {tezId: $scope.user.tezId, orgType: $scope.dataItem.orgType, orgId: item.id};
                mainService.withdomain("delete", __env.apiUrl() + "/api/nms/tez/org/"+item.id).then(function (data) {
                    // $rootScope.alert(true, "Амжилттай хадгаллаа.");
                    $scope.rightDataSource.filter(
                        {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1},{field: "orgType", operator: "eq", value: $scope.dataItem.orgType}]}
                    );
                    $scope.rightGridDataSource.filter(
                        {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1},{field: "orgType", operator: "eq", value: $scope.dataItem.orgType}]}
                    );
                });
            }*/
    };

    $scope.removeToTab = function (item, type) {
      console.log("removeToTab");
      $scope.region = { targetOrgId: item.id, type: 0 };
      mainService.withdata("post", __env.apiUrl() + "/api/nms/organization/setRegion", $scope.region).then(function (data) {
        $("#rightTabData").data("kendoGrid").dataSource.read();

        $scope.noFilterDataSource = commonDataSource.urlDataSource(
          "/api/nms/organization/listNoFilter",
          JSON.stringify({ filter: { logic: "and", filters: [{ field: "useYn", operator: "eq", value: 1 }] }, sort: [{ field: "id", dir: "asc" }] })
        );
        $scope.rightDataSource = commonDataSource.urlDataSource(
          "/api/nms/organization/list",
          JSON.stringify({
            filter: {
              logic: "and",
              filters: [
                { field: "useYn", operator: "eq", value: 1 },
                { field: "headerOrgId", operator: "eq", value: $scope.user.orgId },
              ],
            },
            sort: [{ field: "id", dir: "asc" }],
          })
        );
        $scope.rightTabDataSource = commonDataSource.urlDataSource(
          "/api/nms/organization/list",
          JSON.stringify({
            filter: {
              logic: "and",
              filters: [
                { field: "useYn", operator: "eq", value: 1 },
                { field: "headerOrgId", operator: "eq", value: $scope.user.orgId },
              ],
            },
            sort: [{ field: "id", dir: "asc" }],
          })
        );
      });

      /*if(type===0){
                item.tezId=null;
                mainService.withdata("post", __env.apiUrl() + "/api/nms/organization/submit",item).then(function (data) {
                    $("#rightTabData").data("kendoGrid").dataSource.read();
                    $scope.noFilterDataSource.filter(
                        {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1},{field: "tezId", operator: "neq", value: $scope.user.tezId}]}
                    );
                    $scope.dataSource.filter(
                        {logic: "and", filters: [{field: "useYn", operator: "eq", value: 1},{field: "tezId", operator: "eq", value: $scope.user.tezId}]}
                    );
                });
            }*/
    };

    $scope.leftDataSource = new kendo.data.DataSource({
      transport: {
        read: {
          url: __env.apiUrl() + "/api/nms/organization/list",
          contentType: "application/json; charset=UTF-8",
          type: "POST",
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
        destroy: {
          url: __env.apiUrl() + "/api/nms/tezOrg/",
          contentType: "application/json; charset=UTF-8",
          type: "DELETE",
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
          },
        },
      },
      filter: {
        logic: "and",
        filters: [
          { field: "useYn", operator: "eq", value: 1 },
          { field: "tezId", operator: "neq", value: $scope.user.tezId },
        ],
      },
      pageSize: 20,
      serverPaging: true,
      serverSorting: true,
      serverFiltering: true,
    });
    $scope.leftGrid = {
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
      height: 550,
      sortable: true,
      scrollable: {
        endless: true,
      },
      pageable: {
        numeric: false,
        previousNext: false,
        messages: {
          display: "Нийт : {2}",
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
        { field: "name", filterable: { cell: { operator: "contains", suggestionOperator: "contains", showOperators: false } }, headerAttributes: { class: "columnHeader" }, title: "Нэр" },
        { field: "lpReg", width: 150, filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: { class: "columnHeader" }, title: "Регистр" },
        {
          template:
            " <i style='color: rgb(0 32 96)' class=\"material-icons text-3xl cursor-pointer\"\n" +
            '                                   ng-click="addToRelative(dataItem)">arrow_circle_right_rounded</i>',
          width: 50,
        },
      ],
      dataBinding: function () {
        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
      },
      editable: false,
    };

    $scope.rightDataSource = new kendo.data.DataSource({
      transport: {
        read: {
          url: __env.apiUrl() + "/api/nms/tez/org/list",
          contentType: "application/json; charset=UTF-8",
          type: "POST",
          data: { sort: [{ field: "id", dir: "desc" }] },
          beforeSend: function (req) {
            if (JSON.parse(localStorage.getItem("currentUser")) != null) {
              req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
            } else {
              $state.go("login");
              $rootScope.$broadcast("LogoutSuccessful");
            }
          },
        },
        destroy: {
          url: __env.apiUrl() + "/api/nms/tez/org",
          contentType: "application/json; charset=UTF-8",
          type: "DELETE",
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
          },
        },
      },
      pageSize: 20,
      serverPaging: true,
      serverSorting: true,
      serverFiltering: true,
    });

    $scope.rightTabDataSource = new kendo.data.DataSource({
      transport: {
        read: {
          url: __env.apiUrl() + "/api/nms/organization/list",
          contentType: "application/json; charset=UTF-8",
          type: "POST",
          data: { sort: [{ field: "updatedAt", dir: "desc" }] },
          beforeSend: function (req) {
            if (JSON.parse(localStorage.getItem("currentUser")) != null) {
              req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
            } else {
              $state.go("login");
              $rootScope.$broadcast("LogoutSuccessful");
            }
          },
        },
        destroy: {
          url: __env.apiUrl() + "/api/nms/tezOrg/",
          contentType: "application/json; charset=UTF-8",
          type: "DELETE",
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
          },
        },
      },
      pageSize: 20,
      serverPaging: true,
      serverSorting: true,
      serverFiltering: true,
    });
    $scope.rightGrid = {
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
      height: 550,
      sortable: true,
      scrollable: {
        endless: true,
      },
      pageable: {
        numeric: false,
        previousNext: false,
        messages: {
          display: "Нийт : {2}",
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
        { field: "name", filterable: { cell: { operator: "contains", suggestionOperator: "contains", showOperators: false } }, headerAttributes: { class: "columnHeader" }, title: "Нэр" },
        { field: "lpReg", width: 150, filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: { class: "columnHeader" }, title: "Регистр" },
        {
          template:
            " <i style='color: rgb(0 32 96)' class=\"material-icons text-3xl cursor-pointer\"\n" +
            '                                   ng-click="removeToRelative(dataItem,1)">remove_circle_rounded</i>',
          width: 50,
        },
      ],
      dataBinding: function () {
        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
      },
      editable: false,
    };

    $scope.rightGridDataSource = new kendo.data.DataSource({
      transport: {
        read: {
          url: __env.apiUrl() + "/api/nms/tez/org/list",
          contentType: "application/json; charset=UTF-8",
          type: "POST",
          data: { sort: [{ field: "id", dir: "desc" }] },
          beforeSend: function (req) {
            if (JSON.parse(localStorage.getItem("currentUser")) != null) {
              req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
            } else {
              $state.go("login");
              $rootScope.$broadcast("LogoutSuccessful");
            }
          },
        },
        destroy: {
          url: __env.apiUrl() + "/api/nms/tez/org",
          contentType: "application/json; charset=UTF-8",
          type: "DELETE",
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
          },
        },
      },
      pageSize: 20,
      serverPaging: true,
      serverSorting: true,
      serverFiltering: true,
    });
    $scope.rightTabGrid = {
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
      height: 550,
      sortable: true,
      scrollable: {
        endless: true,
      },
      pageable: {
        numeric: false,
        previousNext: false,
        messages: {
          display: "Нийт : {2}",
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
        { field: "name", filterable: { cell: { operator: "contains", suggestionOperator: "contains", showOperators: false } }, headerAttributes: { class: "columnHeader" }, title: "Нэр" },
        { field: "lpReg", width: 150, filterable: { cell: { operator: "contains", showOperators: false } }, headerAttributes: { class: "columnHeader" }, title: "Регистр" },
        {
          template:
            " <i style='color: rgb(0 32 96)' class=\"material-icons text-3xl cursor-pointer\"\n" + '                                   ng-click="removeToTab(dataItem,0)">remove_circle_rounded</i>',
          width: 50,
        },
      ],
      dataBinding: function () {
        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
      },
      editable: false,
    };
    $scope.changeType = function (type) {
      $scope.dataItem.orgType = type;
      if (type === 0) {
        $scope.noFilterDataSource.filter({ logic: "and", filters: [{ field: "useYn", operator: "eq", value: 1 }] });
        $scope.rightTabDataSource.filter({ logic: "and", filters: [{ field: "useYn", operator: "eq", value: 1 }] });
      } else if (type === 1) {
        $scope.noFilterDataSource.filter({
          logic: "and",
          filters: [
            { field: "useYn", operator: "eq", value: 1 },
            {
              logic: "or",
              filters: [
                { field: "tezId", operator: "eq", value: $scope.user.tezId },
                { field: "typeCh", operator: "eq", value: 1 },
              ],
            },
          ],
        });
        $scope.rightDataSource.filter({
          logic: "and",
          filters: [
            { field: "useYn", operator: "eq", value: 1 },
            { field: "orgType", operator: "eq", value: type },
          ],
        });
      } else if (type === 2) {
        $scope.noFilterDataSource.filter({ logic: "and", filters: [{ field: "useYn", operator: "eq", value: 1 }] });
        $scope.rightDataSource.filter({
          logic: "and",
          filters: [
            { field: "useYn", operator: "eq", value: 1 },
            { field: "orgType", operator: "eq", value: type },
          ],
        });
      } else if (type === 4) {
        $scope.noFilterDataSource.filter({ logic: "and", filters: [{ field: "useYn", operator: "eq", value: 1 }] });
        $scope.rightDataSource.filter({
          logic: "and",
          filters: [
            { field: "useYn", operator: "eq", value: 1 },
            { field: "headerOrgId", operator: "eq", value: 1003886 },
          ],
        });
      }
    };
  },
]);
angular.module("altairApp").directive("directiveWhenScrolled", function () {
  return function (scope, elm, attr) {
    var raw = elm[0];

    elm.bind("scroll", function () {
      if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
        scope.$apply(attr.directiveWhenScrolled);
      }
    });
  };
});
