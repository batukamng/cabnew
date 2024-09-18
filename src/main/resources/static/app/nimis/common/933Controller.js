angular.module("altairApp").controller("933NmsCtrl", [
  "$rootScope",
  "$state",
  "$scope",
  "$timeout",
  "$translate",
  "commonDataSource",
  "mainService",
  "__env",
  function ($rootScope, $state, $scope, $timeout, $translate, commonDataSource, mainService, __env) {
    $scope.dataSource = new kendo.data.DataSource({
      transport: {
        read: {
          url: __env.apiUrl() + "/api/onhs/list",
          contentType: "application/json; charset=UTF-8",
          type: "POST",
          data: {sort: [{field: "id", dir: "asc"}]},
          beforeSend: function (req) {
            if (JSON.parse(sessionStorage.getItem("currentUser")) != null) {
              req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
            } else {
              $state.go("login");
              $rootScope.$broadcast("LogoutSuccessful");
            }
          },
        },
        destroy: {
          url: __env.apiUrl() + "/api/nms/policy/",
          contentType: "application/json; charset=UTF-8",
          type: "DELETE",
          beforeSend: function (req) {
            req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
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
        total: "total"
      },
      pageSize: 10,
      serverPaging: true,
      serverSorting: true,
      serverFiltering: true,
    });

    $scope.dataSource.filter({
      logic: "and",
      sort: [{field: "id", dir: "asc"}],
      filters: [{field: "useYn", operator: "eq", value: 1}],
    });

    $scope.mainGrid = {
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
      pageable: {
        pageSizes: [10, 50, 100],
        refresh: true,
        pageSize: 10,
        buttonCount: 5,
      },
      columns: [
        {
          title: "#",
          headerAttributes: {class: "columnCenter"},
          attributes: {style: "text-align: center;"},
          template: "#= ++record #",
          locked: true,
          lockable: false,
          width: 50,
        },
        {
          field: "invConfirmedCode",
          title: "Код",
          filterable: {cell: {operator: "contains", showOperators: false}},
          width: 100,
          locked: true,
          lockable: false
        },
        {
          field: "invConfirmedName",
          title: "Нэр",
          filterable: {cell: {operator: "contains", showOperators: false}},
          width: 200,
          locked: true,
          lockable: false
        },
        {
          field: "amgName",
          filterable: { cell: { operator: "contains", showOperators: false } },
          title: "Аймаг / Нийслэл",
          width: 150,
        },
        {
          field: "sumName",
          filterable: {cell: {operator: "contains", showOperators: false}},
          title: "Сум / Дүүрэг",
          width: 150
        },
        {
          field: "fYear",
          title: "Он",
          filterable: {cell: {operator: "contains", showOperators: false}},
          width: 150
        },
        {
          field: "beginYear",
          title: "Эхлэх огноо",
          filterable: {cell: {operator: "contains", showOperators: false}},
          width: 150
        },
        {
          field: "endYear",
          title: "Дуусах огноо",
          filterable: {cell: {operator: "contains", showOperators: false}},
          width: 150
        },
        {
          field: "isImplement",
          title: "Хэрэгжсэн эсэх",
          filterable: {cell: {operator: "contains", showOperators: false}},
          width: 150
        },
        {
          field: "votedCitizenCount",
          title: "Санал тоо",
          filterable: {cell: {operator: "contains", showOperators: false}},
          width: 150
        },
        {
          field: "capacity",
          title: "Хүчин чадал",
          filterable: {cell: {operator: "contains", showOperators: false}},
          width: 150
        },
        {
          field: "totalBudget",
          title: "Нийт дүн",
          template: "<span>{{dataItem.totalBudget | number :0}} ₮</span>",
          format: "{0:#,##0.##}",
          filterable: {cell: {operator: "contains", showOperators: false}},
          width: 150
        },
        {
          field: "yearBudget",
          title: "Тухайн жилийн дүн",
          template: "<span>{{dataItem.yearBudget | number :0}} ₮</span>",
          format: "{0:#,##0.##}",
          filterable: {cell: {operator: "contains", showOperators: false}},
          width: 150
        },
        {
          field: "invSectorName",
          title: "Салбар",
          filterable: {cell: {operator: "contains", showOperators: false}},
          width: 200
        },
        {
          title: "Тендер",
          headerAttributes: { style: "text-align: center;white-space: normal; vertical-align: middle; " },
          columns: [
            {
              field: "vendorRegister",
              title: "Регистр",
              filterable: {cell: {operator: "contains", showOperators: false}},
              width: 150
            },
            {
              field: "vendorName",
              title: "Нэр",
              filterable: {cell: {operator: "contains", showOperators: false}},
              width: 150
            },
            {
              field: "tenderTypeName",
              title: "Төрөл",
              filterable: {cell: {operator: "contains", showOperators: false}},
              width: 150
            },
            {
              field: "contractAmount",
              title: "Гэрээний дүн",
              template: "<span>{{dataItem.contractAmount | number :0}} ₮</span>",
              format: "{0:#,##0.##}",
              filterable: {cell: {operator: "contains", showOperators: false}},
              width: 150
            }
          ],
        },
        {
          title: "Төлбөр",
          headerAttributes: { style: "text-align: center;white-space: normal; vertical-align: middle; " },
          columns: [
            {
              field: "paymentDate",
              title: "Төлбөрийн огноо",
              template: "<div style='text-align: left;width:100%;'>#=(paymentDate == null)? '' : kendo.toString(kendo.parseDate(paymentDate, 'yyyy-MM-dd'), 'yyyy.MM.dd') #</div>",
              filterable: {cell: {operator: "contains", showOperators: false}},
              width: 150
            },
            {
              field: "paymentAmount",
              title: "Төлбөрийн дүн",
              template: "<span>{{dataItem.paymentAmount | number :0}} ₮</span>",
              format: "{0:#,##0.##}",
              filterable: {cell: {operator: "contains", showOperators: false}},
              width: 150
            },
            {
              field: "description",
              title: "Тайлбар",
              filterable: {cell: {operator: "contains", showOperators: false}},
              width: 200
            }
          ]
        }
      ],
      dataBinding: function () {
        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
      },
      editable: false,
      height: function () {
        return $(window).height() - 160;
      },
    };

/*
    if (sessionStorage.getItem("buttonData").includes("create")) {
      $scope.mainGrid.toolbar = [{template: "<button class='md-btn custom-btn' ng-click='createApp()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>"}];
    }

    if (sessionStorage.getItem("buttonData").includes("read")) {
      $scope.mainGrid.columns.push({
        command: [
          {
            template:
                '<div class="flex gap-3"><button class="grid-btn" ng-click=\'gotoDocDetail(dataItem)\'><div class="nimis-icon see"></div>Харах</button><button class="grid-btn k-grid-edit" ng-click=\'gotoDetail(dataItem)\'><div class="nimis-icon edit"></div></button><button class="grid-btn k-grid-remove-command" ng-click=\'deleteData(dataItem)\'><div class="nimis-icon delete"></div></button></div>',
          },
        ],
        title: "&nbsp;",
        sticky: true,
        width: 160,
      });
    }
*/
  },
]);
