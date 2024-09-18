angular.module("altairApp").controller("941NmsCtrl", [
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
    // $scope.sEcoDataSource = $scope.user.user.ecoList;
    mainService
      .withdata(
        "post",
        "/api/nms/common/list",
        JSON.stringify({
          filter: {
            logic: "and",
            filters: [
              { field: "grpCd", operator: "contains", value: "orgType" },
              { field: "parentId", operator: "isNull", value: "false" },
            ],
          },
          sort: [{ field: "orderId", dir: "asc" }],
          take: 60,
          skip: 0,
          page: 1,
          pageSize: 60,
        })
      )
      .then(function (data) {
        $scope.orgTypeDataSource = data.data;
      });
    mainService
      .withdata(
        "post",
        "/api/nms/role/list",
        JSON.stringify({ filter: { logic: "and", filters: [{ field: "useYn", operator: "eq", value: 1 }] }, sort: [{ field: "id", dir: "asc" }], take: 60, skip: 0, page: 1, pageSize: 60 })
      )
      .then(function (data) {
        $scope.roleDataSource = data.data;
      });

    if ($scope.user.user.ecoList == null || $scope.user.user.ecoList.length == 0) {
      var filters = [];
      filters.push({
        field: "grpCd",
        operator: "eq",
        value: "ecoType",
      });
      filters.push({
        field: "useYn",
        operator: "eq",
        value: 1,
      });
      filters.push({
        field: "parentId",
        operator: "eq",
        value: 410,
      });

      mainService
        .withdata("post", __env.apiUrl() + "/api/nms/common/list", {
          filter: {
            logic: "and",
            filters: filters,
          },
          page: 1,
          pageSize: 20,
          skip: 0,
          take: 20,
        })
        .then(function (resp) {
          if (resp.total > 0) $scope.ecoDataSource = resp.data;
        });
    } else {
      $scope.ecoDataSource = $scope.user.user.ecoList;
    }

    $scope.app = { useYn: 1, stepType: 2, ecoType: 430 };
    $scope.privileges = {};
    $scope.ecos = {};
    $scope.allPriv = "all";
    $scope.mainSystemDisable = true;
    $scope.subSystemDisable = false;

    $scope.ecoType = { id: 430 };
    $scope.yearSelectorOptions = {
      format: "MM.dd",
    };
    $scope.fromDateChanged = function () {
      $scope.minDate = new Date($scope.app.srtDt);
    };
    $scope.toDateChanged = function () {
      $scope.maxDate = new Date($scope.app.endDt);
    };
    $scope.maxDate = new Date();
    $scope.minDate = new Date(2000, 0, 1, 0, 0, 0);

    $scope.dataSource = new kendo.data.DataSource({
      transport: {
        read: {
          url: __env.apiUrl() + "/api/nms/funding/step/list",
          contentType: "application/json; charset=UTF-8",
          type: "POST",
          data: { filter : {
                  "logic": "and",
                  "filters" : [
                    { "field" : "useYn", "operator" : "eq", "value" : 1}
                  ]
                }, sort: [{ field: "id", dir: "desc" }] },
          beforeSend: function (req) {
            req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
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
            parentId: { type: "number", defaultValue: 0 },
            orderId: { type: "number" },
            url: { type: "string" },
            comCd: { type: "string" },
            uIcon: { type: "string" },
            langKey: { type: "string" },
            useYn: { type: "number", defaultValue: 1 },
          },
        },
      },
      pageSize: 20,
      serverPaging: true,
      serverFiltering: true,
      serverSorting: true,
    });
    $scope.mainGrid = {
      filterable: {
        mode: "row",
        extra: false,
        operators: {
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
          title: "№",
          headerAttributes: { class: "columnCenter" },
          attributes: { style: "text-align: center;" },
          template: "#= ++record #",
          sticky: true,
          width: 50,
        },
        {
          field: "name",
          filterable: { cell: { operator: "contains", showOperators: false } },
          headerAttributes: { class: "columnHeader" },
          title: "Үе шатны нэр",
          width: 350,
        },
        {
          field: "stepType",
          filterable: { cell: { operator: "contains", showOperators: false } },
          headerAttributes: { class: "columnHeader" },
          title: "Үе шатны төрөл",
          template: "#if(stepType===1){# <span class='columnCenter'>Санхүүжилт</span> #}else{#<span class='columnCenter'>Төлөвлөлт</span> #}#",
          width: 120,
        },
        {
          field: "ecoNames",
          filterable: { cell: { operator: "contains", showOperators: false } },
          headerAttributes: { class: "columnHeader" },
          title: "Эдийн засгийн ангилал",
          width: 200,
        },
        {
          field: "orderId",
          filterable: { cell: { operator: "contains", showOperators: false } },
          headerAttributes: { class: "columnHeader" },
          title: "Эрэмбэ",
          width: 80,
        },
        {
          field: "userTypeNames",
          filterable: { cell: { operator: "contains", showOperators: false } },
          headerAttributes: { class: "columnHeader" },
          title: "Хэрэглэгчийн түвшин",
        },
        {
          field: "statName",
          filterable: { cell: { operator: "contains", showOperators: false } },
          headerAttributes: { class: "columnHeader" },
          title: "Төлвийн нэр",
        },
        {
          field: "statDesc",
          filterable: { cell: { operator: "contains", showOperators: false } },
          headerAttributes: { class: "columnHeader" },
          title: "Тайлбар буюу санамж",
        },
        {
          field: "srtDt",
          filterable: { cell: { operator: "contains", showOperators: false } },
          headerAttributes: { class: "columnHeader" },
          title: "Эхлэх огноо",
        },
        {
          field: "endDt",
          filterable: { cell: { operator: "contains", showOperators: false } },
          headerAttributes: { class: "columnHeader" },
          title: "Дуусах огноо",
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

    if (sessionStorage.getItem("buttonData").includes("read")) {
      $scope.mainGrid.toolbar = ["excel", "search"];
    }
    if (sessionStorage.getItem("buttonData").includes("create")) {
      $scope.mainGrid.toolbar = [{ template: "<button class='md-btn custom-btn' ng-click='addLevel()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>" }];
    }

    if (sessionStorage.getItem("buttonData").includes("edit")) {
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
      $scope.privileges = {};
      $scope.ecos = {};

      if (item.userTypeIds) {
        item.userTypeIds.split(",").forEach((level) => ($scope.privileges[level] = true));
      }

      if (item.ecoIds) {
        item.ecoIds.split(",").forEach((level) => ($scope.ecos[level] = true));
      }

      if (item.stepType == 2) {
        $scope.mainSystemDisable = true;
        $scope.subSystemDisable = false;
      }

      if (item.stepType == 1) {
        $scope.mainSystemDisable = false;
        $scope.subSystemDisable = true;
      }

      UIkit.modal("#modal_funding", {
        modal: false,
        keyboard: false,
        bgclose: false,
        center: true,
      }).show();
    };

    $scope.deleteData = function (item) {
        mainService.withdata("post", __env.apiUrl() + "/api/nms/funding/step/setInactive", item).then(function (data) {
          $rootScope.alert(true, "Устгах үйлдэл амжилттай боллоо.");
          $(".k-grid").data("kendoGrid").dataSource.read();
        });
    };

    $scope.onChangeEco = function (item) {
      $scope.ecoType = item;
      $scope.app.ecoType = item.id;
    };

    var openFlag = true;

    $("#datepicker").kendoDatePicker({
      depth: "month",
      start: "year",
      animation: false,
      min: new Date(2017, 0, 1),
      max: new Date(2017, 11, 31),
      footer: "#: kendo.toString(data, 'm') #",
      format: "MM dd",
      value: new Date(),
      open: function (e) {
        var dp = e.sender;
        var calendar = dp.dateView.calendar;

        if (openFlag) {
          calendar.setOptions({
            animation: false,
          });
          openFlag = false;
          calendar.navigateUp();
        }

        if (calendar.view().name === "year") {
          calendar.element.find(".k-header").addClass("k-hidden");
        }
        calendar.bind("navigate", function (e) {
          var cal = e.sender;
          var view = cal.view();

          if (view.name === "year") {
            cal.element.find(".k-header").addClass("k-hidden");
          } else {
            var navFast = $(".k-nav-fast");

            var dsa = cal.element.find(".k-header").removeClass("k-hidden");
            navFast[0].innerText = navFast[0].innerText.slice(0, -5);
          }
        });
      },
      close: function (e) {
        var calendar = e.sender.dateView.calendar;

        calendar.unbind("navigate");
        calendar.element.find(".k-header").removeClass("k-hidden");
      },
    });

    $scope.changeSystemType = function (id) {
      $scope.app.stepType = id;
      if (id == 2) {
        $scope.mainSystemDisable = true;
        $scope.subSystemDisable = false;
      }

      if (id == 1) {
        $scope.mainSystemDisable = false;
        $scope.subSystemDisable = true;
      }
    };

    $scope.submitProject = function (event) {
      // if ($scope.validatorProject.validate()) {
      $scope.app.rolePrivileges = [];
      for (let menuKey in $scope.privileges) if($scope.privileges[menuKey])$scope.app.rolePrivileges.push(menuKey);

      $scope.app.ecos = [];
      for (let menuKey in $scope.ecos) if($scope.ecos[menuKey])$scope.app.ecos.push(menuKey);

      mainService.withResponse("post", __env.apiUrl() + "/api/nms/funding/step/submit", $scope.app).then(function (data) {
        if (data.status === 200) {
          $rootScope.alert(true, "Амжилттай хадгаллаа.");
          $scope.app = { useYn: 1, stepType: 2 };
          $scope.privileges = {};
          $scope.mainSystemDisable = true;
          $scope.subSystemDisable = false;
          UIkit.modal("#modal_funding").hide();
          $(".k-grid").data("kendoGrid").dataSource.read();
          // $scope.stat(2, false, data.id);
        } else {
          $rootScope.alert(false, "Алдаа гарлаа.");
        }
        UIkit.modal("#modal_loader").hide();
        $state.go("restricted.scr.1035");
      });
      // } else {
      //   $rootScope.alert(false, "Бүрэн бөглөнө үү.");
      // }
    };

    $scope.validate = function (event) {
      event.preventDefault();
      event.preventDefault();
      if ($scope.validator.validate()) {
        $scope.validationMessage = "Амжилттай!";
        $scope.validationClass = "valid";

        delete $scope.main["licType"];
        delete $scope.main["groupType"];

        formDataAttach.delete("data");
        formDataAttach.append("data", JSON.stringify($scope.main));
        fileUpload.uploadFileToUrl(__env.apiUrl() + "api/formNotes/create", formDataAttach).then(function (data) {
          $(".k-grid").data("kendoGrid").dataSource.read();
          UIkit.modal("#modalForm").hide();
        });
      } else {
        $scope.validationMessage = "Форм-г бүтэн бөглөнө үү...";
        $scope.validationClass = "invalid";
      }
    };

    $scope.handleCheckAll = function (checked, priId, childMenus) {
      if (childMenus) {
        childMenus.map((x) => {
          if (
            x.privileges.filter(function (i) {
              return i.id === priId;
            }).length > 0
          ) {
            if (!$scope.privileges[x.id]) $scope.privileges[x.id] = {};
            $scope.privileges[x.id][priId] = checked;
          }
        });
      }
    };
    $scope.backToList = function () {
      $state.go("restricted.nms.937");
    };
    $scope.selectAllPriv = function (checked, item) {
      if (checked) {
        if (!$scope.privileges[item.id]) $scope.privileges[item.id] = {};
        item.privileges.map((x) => {
          $scope.privileges[item.id][x.id] = true;
          $scope.handleCheckAll(checked, x.id, item.lutMenus);
        });
      } else {
        item.privileges.map((x) => {
          $scope.privileges[item.id][x.id] = false;
          $scope.handleCheckAll(checked, x.id, item.lutMenus);
        });
      }
    };
    $scope.selectAll = function (event) {
      var menus = $scope.allMenus.filter((item) => item.parentId == null);
      menus.map((x, i) => {
        $scope.selectAllPriv(event.target.checked, x);
        $("#" + x.id + "-" + i + "-allPriv").prop("checked", event.target.checked);
      });
    };

    $scope.addLevel = function () {
      UIkit.modal("#modal_funding", {
        modal: false,
        keyboard: false,
        bgclose: false,
        center: true,
      }).show();
      $scope.app = { useYn: 1, stepType: 2, ecoType: 430 };
      $scope.privileges = {};
      $scope.ecos = {};
      $scope.modalType = "add";
    };

/*    mainService
      .withdata(
        "post",
        "/api/nms/user/level/list",
        JSON.stringify({
          filter: { logic: "and", filters: [{ field: "useYn", operator: "eq", value: 1 }] },
          sort: [{ field: "name", dir: "asc" }],
          take: 60,
          skip: 0,
          page: 1,
          pageSize: 60,
        })
      )
      .then(function (data) {
        $scope.actionDataSource = data.data;
      });*/


    var filters = [];
    filters.push({
      field: "grpCd",
      operator: "eq",
      value: "userType",
    });
    filters.push({
      field: "useYn",
      operator: "eq",
      value: 1,
    });
    filters.push({
      field: "parentId",
      operator: "isnull",
      value: false,
    });

    mainService
        .withdata("post", __env.apiUrl() + "/api/nms/common/list", {
          filter: {
            logic: "and",
            filters: filters,
          },
          page: 1,
          pageSize: 20,
          skip: 0,
          take: 20,
        })
        .then(function (resp) {
          if (resp.total > 0) $scope.actionDataSource = resp.data;
        });


    $scope.changeColor = function () {
      var colorPicker = document.getElementById("colorPicker");
      colorPicker.style.backgroundColor = $scope.app.btnColor.toString() + "!important";
      console.log("change", $scope.app.btnColor);
    };
  },
]);
