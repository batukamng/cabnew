angular.module("altairApp").controller("926NmsCtrl", [
  "$rootScope",
  "$state",
  "$scope",
  "$timeout",
  "$translate",
  "commonDataSource",
  "mainService",
  "__env",
  function ($rootScope, $state, $scope, $timeout, $translate, commonDataSource, mainService, __env) {
    $scope.user = JSON.parse(localStorage.getItem("currentUser"));
    $scope.app = { useYn: 1, amgId: $scope.user.user.amgId };

    $scope.budgetType = "";

    $scope.mainSystemDisable = true;
    $scope.subSystemDisable = false;
    $scope.isActive = false;

    if ($scope.user.user.amgId != null) {
      $scope.isActive = true;
      $scope.app.systemType = 0;
      $scope.mainSystemDisable = false;
      $scope.subSystemDisable = true;
    } else {
      $scope.app.systemType = 1;
    }

    $scope.mainSystemCode = "";
    $scope.tab = 1;
    $scope.privileges = {};

    $scope.stepTypeDataSource = mainService.withdata(
      "post",
      __env.apiUrl() + "/api/nms/funding/step/list",
      JSON.stringify({
        filter: {
          logic: "and",
          filters: [
            { field: "useYn", operator: "eq", value: 1 },
            { field: "stepType", operator: "eq", value: $scope.tab },
          ],
        },
        sort: [{ field: "orderId", dir: "asc" }],
      })
    );

    $scope.getStepTypeDataSource = function (tabId) {
      var filters = [];
      filters.push({
        field: "stepType",
        operator: "eq",
        value: tabId,
      });
      filters.push({
        field: "useYn",
        operator: "eq",
        value: 1,
      });

      mainService
        .withdata("post", __env.apiUrl() + "/api/nms/funding/step/list", {
          filter: {
            logic: "and",
            filters: filters,
          },
          sort: [{ field: "orderId", dir: "asc" }],
          page: 1,
          pageSize: 20,
          skip: 0,
          take: 20,
        })
        .then(function (resp) {
          if (resp.total > 0) $scope.stepTypeDataSource = resp.data;
        });
    };

    $scope.getStepTypeDataSource($scope.tab);

    $scope.measurementDataSource = commonDataSource.urlDataSource(
      "/api/nms/common/code/list",
      JSON.stringify({
        filter: {
          logic: "and",
          filters: [
            { field: "grpCd", operator: "contains", value: "measurement" },
            { field: "parentId", operator: "isNull", value: "false" },
          ],
        },
        sort: [{ field: "orderId", dir: "asc" }],
      })
    );

    $scope.sourceTypeChanged = function (type) {
      $scope.mainSystemCode = type;

      var filters = [];
      filters.push({
        field: "id",
        operator: "eq",
        value: $scope.app.sourceId,
      });

      filters.push({
        field: "useYn",
        operator: "eq",
        value: 1
      });

      mainService
        .withdata("post", __env.apiUrl() + "/api/nms/source/type/list", {
          filter: {
            logic: "and",
            filters: filters,
          }, sort: [{ field: "orderId", dir: "asc" }],
          page: 1,
          pageSize: 20,
          skip: 0,
          take: 20,
        })
        .then(function (resp) {
          if (resp.total > 0) $scope.budgetType = resp.data[0].code;
        });
    };

    $scope.changeTab = function (tab) {
      $scope.tab = tab;
      $scope.app.systemType = tab;
      $scope.getStepTypeDataSource(tab);
    };

    $scope.gridDataSource = {
      transport: {
        read: {
          url: function (e) {
            if (localStorage.getItem("buttonData").includes("read") && JSON.parse(localStorage.getItem("menuData")).url === $state.current.name) {
              return __env.apiUrl() + "/api/nms/source/type/list";
            } else {
              localStorage.removeItem("menuList");
              localStorage.removeItem("menuData");
              $state.go("login");
            }
          },
          contentType: "application/json; charset=UTF-8",
          type: "POST",
          data: { filter: {
                  logic: "and",
                  filters: [
                    { field: "useYn", operator: "eq", value: 1 }
                  ],
                }, sort: [{ field: "orderId", dir: "asc" }] },
          beforeSend: function (req) {
            req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
          },
        },
        update: {
          url: __env.apiUrl() + "/api/nms/source/type",
          contentType: "application/json; charset=UTF-8",
          type: "PUT",
          beforeSend: function (req) {
            req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
          },
          complete: function (e) {
            if (e.status === 200) {
              $rootScope.alert(true, "Амжилттай засагдлаа");
            } else if (e.status === 500) {
              $rootScope.alert(false, "Амжилтгүй");
            }
          },
        },
        destroy: {
          url: __env.apiUrl() + "/api/nms/source/type",
          contentType: "application/json; charset=UTF-8",
          type: "DELETE",
          beforeSend: function (req) {
            req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
          },
        },
        create: {
          url: __env.apiUrl() + "/api/nms/source/type",
          contentType: "application/json; charset=UTF-8",
          type: "POST",
          complete: function (e) {
            if (e.status === 200) {
              $rootScope.alert(true, "Амжилттай хадгаллаа");
            } else if (e.status === 409) {
              $rootScope.alert(false, "Код давхцаж байна");
            } else if (e.status === 500) {
              $rootScope.alert(false, "Амжилтгүй");
            }
            $("#parent").data("kendoGrid").dataSource.read();
          },
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
            id: { type: "number" },
            code: { type: "string", validation: { required: true } },
            name: { type: "string", validation: { required: true } },
            useYn: { type: "number", defaultValue: 1 },
          },
        },
      },
      pageSize: 20,
      serverPaging: true,
      serverFiltering: true,
      serverSorting: true,
      filter: {
        logic: "and",
        filters: [
          { field: "parentId", operator: "isnull", value: true },
          { field: "useYn", operator: "eq", value: 1 },
        ],
      },
    };
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
      sortable: true,
      resizable: true,
      excel: {
        fileName: "Organization Export.xlsx",
        proxyURL: "//demos.telerik.com/kendo-ui/service/export",
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
          sticky: true,
          width: 50,
        },
        {
          field: "code",
          title: "КОД",
          headerAttributes: { class: "columnHeader" },
          filterable: { cell: { operator: "contains", showOperators: false } },
          width: 150,
        },
        {
          field: "name",
          title: "ЭХ ҮҮСВЭРИЙН НЭР",
          headerAttributes: { class: "columnHeader" },
          filterable: { cell: { operator: "contains", showOperators: false } },
        },
        {
          field: "name",
          title: "АЛХМУУД",
          headerAttributes: { class: "columnHeader" },
          filterable: { cell: { operator: "contains", showOperators: false } },
        },
        {
          field: "orderId",
          title: "ЭРЭМБЭ",
          headerAttributes: { class: "columnHeader" },
          filterable: { cell: { operator: "contains", showOperators: false } },
        }
      ],
      editable: false,
      dataBinding: function () {
        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
      },
      height: function () {
        return $(window).height() - 110;
      },
    };

    if (localStorage.getItem("buttonData").includes("read")) {
      $scope.mainGrid.toolbar = ["excel", "search"];
    }
    if (localStorage.getItem("buttonData").includes("create")) {
      $scope.mainGrid.toolbar = [{ template: "<button class='md-btn custom-btn' ng-click='addLevel()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>" }, "search"];
    }
    if (localStorage.getItem("buttonData").includes("edit")) {
      $scope.mainGrid.columns.push({
        command: [
          {
            template:
              '<div class="flex gap-3"><button class="grid-btn k-grid-edit" ng-click=\'update(dataItem)\'><div class="nimis-icon edit"></div></button><button class="grid-btn k-grid-remove-command" ng-click=\'deleteData(dataItem)\'><div class="nimis-icon delete"></div></button></div>',
          },
        ],
        title: "&nbsp;",
        width: 120,
        sticky: true,
        attributes: { style: "text-align: center;" },
      });
    }

    $scope.update = function (item) {
      $scope.app = item;
      $scope.modalType = "edit";

      $scope.privileges = {};
      for (let i = 0; i < $scope.app.details.length; i++) {
        $scope.privileges[$scope.app.details[i].step.id] = true;
      }
      UIkit.modal("#modal_funding").show();
    };

    $scope.deleteData = function (item) {
      mainService.withdata("post", __env.apiUrl() + "/api/nms/source/type/setInactive", item).then(function (data) {
        $rootScope.alert(true, "Устгах үйлдэл амжилттай боллоо.");
        $(".k-grid").data("kendoGrid").dataSource.read();
      });
/*
      if (confirm("Тухайн бүртгэлийг устгахдаа итгэлтэй байна уу?")) {
        mainService.withdata("delete", __env.apiUrl() + "/api/nms/source/type/" + item.id).then(function (data) {
          $rootScope.alert(true, "Устгах үйлдэл амжилттай боллоо.");
          $(".k-grid").data("kendoGrid").dataSource.read();
        });
      }
*/
    };

    $scope.addLevel = function () {
      UIkit.modal("#modal_funding").show();

      var filters = [];
      filters.push({
        field: "parentId",
        operator: "isnull",
        value: true,
      });
      filters.push({
        field: "useYn",
        operator: "eq",
        value: 1,
      });

      if ($scope.user.user.amgId != null) {
        /*                filters.push({
                    "field": "amgId",
                    "operator": "eq",
                    "value": $scope.user.user.amgId
                });*/

        filters.push({
          field: "code",
          operator: "eq",
          value: "ОНТ",
        });
      }

      mainService
        .withdata("post", __env.apiUrl() + "/api/nms/source/type/list", {
          filter: {
            logic: "and",
            filters: filters,
          },sort: [{ field: "orderId", dir: "asc" }],
          page: 1,
          pageSize: 20,
          skip: 0,
          take: 20,
        })
        .then(function (resp) {
          if (resp.total > 0) {
            $scope.sourceTypeDataSource = resp.data;
            $scope.budgetType = $scope.sourceTypeDataSource.code;
          }
        });

      $scope.tab = 1;
      $scope.modalType = "add";
      $scope.app = { useYn: 1, amgId: $scope.user.user.amgId };

      if ($scope.user.user.amgId != null) {
        $scope.isActive = true;
        $scope.app.systemType = 0;
        $scope.mainSystemDisable = false;
        $scope.subSystemDisable = true;
      } else {
        $scope.app.systemType = 1;
      }
    };

    $scope.formSubmit = function (event) {
      // if ($scope.validatorProject.validate()) {
      UIkit.modal("#modal_funding").hide();
      UIkit.modal("#modal_loader").show();

      if($scope.app.systemType == 0){
        if ($scope.budgetType != null)
          $scope.app.code = $scope.budgetType + $scope.app.code;
      }

      console.log($scope.privileges);
      $scope.app.rolePrivileges = [];
      for (var menuKey in $scope.privileges) if ($scope.privileges[menuKey]) $scope.app.rolePrivileges.push(menuKey);
      console.log($scope.app.rolePrivileges);

      mainService.withResponse("post", __env.apiUrl() + "/api/nms/source/type/submit", $scope.app).then(function (data) {
        UIkit.modal("#modal_loader").hide();
        if (data.status === 200) {
          $(".k-grid").data("kendoGrid").dataSource.read();
          $rootScope.alert(true, "Амжилттай хадгаллаа.");
        } else {
          $rootScope.alert(false, "Алдаа гарлаа.");
        }
      });
      /*$scope.arr.rolePrivileges = [];
            for (var menuKey in $scope.privileges)
                $scope.arr.rolePrivileges.push(menuKey);


                UIkit.modal("#modal_loader").hide();
                $state.go("restricted.scr.1035");
            });*/
      // } else {
      //   $rootScope.alert(false, "Бүрэн бөглөнө үү.");
      // }
    };

    $scope.changeSystemType = function (id) {
      $scope.app.systemType = id;

      if ($scope.app.systemType == 1) {
        $scope.mainSystemDisable = true;
        $scope.subSystemDisable = false;
      }

      if ($scope.app.systemType == 0) {
        $scope.mainSystemDisable = false;
        $scope.subSystemDisable = true;

        var filters = [];
        filters.push({
          field: "parentId",
          operator: "isNull",
          value: true,
        });
        filters.push({
          field: "useYn",
          operator: "eq",
          value: 1,
        });

        if ($scope.user.user.amgId != null) {
          /*                    filters.push({
                        "field": "amgId",
                        "operator": "eq",
                        "value": $scope.user.user.amgId
                    });*/

          filters.push({
            field: "code",
            operator: "eq",
            value: "ОНТ",
          });
        }

        mainService
          .withdata("post", __env.apiUrl() + "/api/nms/source/type/list", {
            filter: {
              logic: "and",
              filters: filters,
            },sort: [{ field: "orderId", dir: "asc" }],
            page: 1,
            pageSize: 20,
            skip: 0,
            take: 20,
          })
          .then(function (resp) {
            if (resp.total > 0) {
              $scope.sourceTypeDataSource = resp.data;
              $scope.budgetType = $scope.sourceTypeDataSource[0].code;
            }
          });
      }
    };

    $scope.getSteps = function (id) {
      $scope.stepDataSource = commonDataSource.urlDataSource(
        "/api/nms/funding/step/list",
        JSON.stringify({
          filter: {
            logic: "and",
            filters: [
              { field: "stepType", operator: "eq", value: id },
              { field: "useYn", operator: "eq", value: 1 },
            ],
          },
          sort: [{ field: "id", dir: "asc" }],
        })
      );
    };

    $scope.detailGridOptions = function (dataItem) {
      return {
        dataSource: {
          transport: {
            read: {
              url: __env.apiUrl() + "/api/nms/source/type/listFilter",
              contentType: "application/json; charset=UTF-8",
              type: "POST",
              data: { filter: {
                      logic: "and",
                      filters: [
                        { field: "useYn", operator: "eq", value: 1 }
                      ],
                    }, sort: [{ field: "orderId", dir: "asc" }] },
              beforeSend: function (req) {
                req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
              },
            },
            update: {
              url: __env.apiUrl() + "/api/nms/source/type/" + dataItem.id,
              contentType: "application/json; charset=UTF-8",
              type: "PUT",
              beforeSend: function (req) {
                req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
              },
              complete: function (e) {
                if (e.status === 200) {
                  $rootScope.alert(true, "Амжилттай засагдлаа");
                } else if (e.status === 500) {
                  $rootScope.alert(false, "Амжилтгүй");
                }
                $("#detGrid").data("kendoGrid").dataSource.read();
              },
            },
            destroy: {
              url: __env.apiUrl() + "/api/nms/source/type",
              contentType: "application/json; charset=UTF-8",
              type: "DELETE",
              beforeSend: function (req) {
                req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
              },
            },
            create: {
              url: __env.apiUrl() + "/api/nms/source/type",
              contentType: "application/json; charset=UTF-8",
              type: "POST",
              complete: function (e) {
                if (e.status === 200) {
                  $rootScope.alert(true, "Амжилттай хадгаллаа");
                } else if (e.status === 409) {
                  $rootScope.alert(false, "Код давхцаж байна");
                } else if (e.status === 500) {
                  UIkit.notify("Амжилтгүй.", {
                    status: "danger",
                    pos: "bottom-center",
                  });
                  $rootScope.alert(false, "Амжилтгүй");
                }
                $("#detGrid").data("kendoGrid").dataSource.read();
              },
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
                id: { type: "number" },
                code: { type: "string", validation: { required: true } },
                name: { type: "string", validation: { required: true } },
                icon: { type: "string" },
                markerIcon: { type: "string" },
                parentId: { type: "number", defaultValue: dataItem.id },
                useYn: { type: "number", defaultValue: 1 },
                aimag: { defaultValue: null },
              },
            },
          },
          pageSize: 200,
          serverPaging: true,
          serverFiltering: true,
          serverSorting: true,
          filter: {
            logic: "and",
            filters: [
              { field: "parentId", operator: "eq", value: dataItem.id },
              { field: "useYn", operator: "eq", value: 1 }
            ],
          },
        },
        scrollable: false,
        sortable: true,
        pageable: false,
        columns: [
          {
            title: "№",
            headerAttributes: { class: "columnCenter" },
            attributes: { style: "text-align: center;" },
            template: "#= ++record1 #",
            sticky: true,
            width: 50,
          },
          {
            field: "code",
            title: "КОД",
            headerAttributes: { class: "columnHeader" },
            filterable: { cell: { operator: "contains", showOperators: false } },
            width: 150,
          },
          {
            field: "name",
            title: "НЭР",
            headerAttributes: { class: "columnHeader" },
            filterable: { cell: { operator: "contains", showOperators: false } },
          },
          {
            field: "code",
            title: "АЙМАГ",
            template: "#if(aimag!=null){# <span>#=aimag.cdNm#</span> #}#",
            headerAttributes: { class: "columnHeader" },
            filterable: { cell: { operator: "contains", showOperators: false } },
          },
          {
            field: "useYn",
            headerAttributes: { class: "columnHeader" },
            width: 130,
            template: "#if(useYn===1){# <span class='columnCenter'>Y</span> #}else{#<span class='columnCenter uk-text-danger'>N</span> #}#",
            title: "АШИГЛАХ ЭСЭХ",
          },
          {
            command: [
              // {name: "edit", text: {edit: " ", update: " ", cancel: " "}},
              { template: '<button class="k-button k-button-icontext"  ng-click=\'deleteData(dataItem)\'><span class="k-icon k-i-delete"></span></button>' },
            ],
            title: "&nbsp;",
            width: 100,
          },
        ],
        editable: false,
        dataBinding: function () {
          record1 = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        },
      };
    };
  },
]);
