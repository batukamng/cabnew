angular.module("altairApp").controller("911NmsCtrl", [
  "$rootScope",
  "$state",
  "$scope",
  "$timeout",
  "mainService",
  "commonDataSource",
  "crudDataSource",
  "Upload",
  "$http",
  "__env",
  function ($rootScope, $state, $scope, $timeout, mainService, commonDataSource, crudDataSource, Upload, $http, __env) {
    $scope.user = JSON.parse(localStorage.getItem("currentUser")).user;
    $scope.dataItem = { objIds: "", subObjIds: "", name: "", priority: "", type: "", objArray: [1, 2] };

    $scope.iconFileDtl = null;
    $scope.ezObj = {};
    $scope.iconOnSelect = function (e) {
      $scope.iconFileDtl = null;
    };
    $scope.iconFileOptions = {
      multiple: true,
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
        if (e.operation == "upload") {
          $scope.dataItem.iconId = e.response.id;
        }
        $scope.iconFileDtl = e.response;
      },
      upload: function (e) {
        var xhr = e.XMLHttpRequest;
        if (xhr) {
          xhr.addEventListener("readystatechange", function (e) {
            if (xhr.readyState == 1 /* OPENED */) {
              xhr.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
            }
          });
        }
      },
      dropZone: ".dropZoneElement",
    };
    $scope.markerFileDtl = null;
    $scope.markerOnSelect = function (e) {
      $scope.markerFileDtl = null;
    };
    $scope.markerFileOptions = {
      multiple: true,
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
        if (e.operation == "upload") {
          $scope.dataItem.markerId = e.response.id;
        }
        $scope.markerFileDtl = e.response;
      },
      upload: function (e) {
        var xhr = e.XMLHttpRequest;
        if (xhr) {
          xhr.addEventListener("readystatechange", function (e) {
            if (xhr.readyState == 1 /* OPENED */) {
              xhr.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
            }
          });
        }
      },
      dropZone: ".dropZoneElement",
    };
    $scope.fileDtl = null;
    $scope.onSelect = function (e) {
      $scope.fileDtl = null;
    };
    $scope.fileOptions = {
      multiple: true,
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
        if (e.operation == "upload") {
          $scope.dataItem.imageId = e.response.id;
        }
        $scope.fileDtl = e.response;
      },
      upload: function (e) {
        var xhr = e.XMLHttpRequest;
        if (xhr) {
          xhr.addEventListener("readystatechange", function (e) {
            if (xhr.readyState == 1 /* OPENED */) {
              xhr.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
            }
          });
        }
      },
      dropZone: ".dropZoneElement",
    };

    var filter = {
      filter: {
        logic: "and",
        filters: [
          {
            logic: "and",
            filters: [
              { field: "grpCd", operator: "contains", value: "ecoType" },
              { field: "parentId", operator: "isNull", value: "false" },
            ],
          },
          {
            logic: "or",
            filters: [
              { field: "comCd", operator: "eq", value: "01" },
              { field: "comCd", operator: "eq", value: "02" },
              { field: "comCd", operator: "eq", value: "03" },
              { field: "comCd", operator: "eq", value: "04" },
            ],
          },
        ],
      },
      page: 1,
      pageSize: 10,
      skip: 0,
      take: 10,
    };
    mainService.withdata("POST", __env.apiUrl() + "/api/nms/common/list", filter).then(function (data) {
      console.log("data", data);
      $scope.ecoDataSource = data.data;
    });
    $scope.ecoEditor = function (container, options) {
      var editor = $('<select  kendo-multi-select k-options="selectOptions" k-data-text-field="\'comCdNm\'" k-data-value-field="\'id\'" data-bind="value:' + options.field + '"></select>').appendTo(
        container
      );
    };

    $scope.selectOptions = {
      placeholder: "ЭЗ ангилал нэмэх...",
      dataTextField: "comCdNm",
      dataValueField: "id",
      valuePrimitive: true,
      autoBind: false,
      dataSource: {
        transport: {
          read: {
            url: __env.apiUrl() + "/api/nms/common/list",
            contentType: "application/json; charset=UTF-8",
            type: "POST",
            data: {
              filter: {
                logic: "and",
                filters: [
                  { field: "grpCd", operator: "eq", value: "ecoType" },
                  { field: "shortCd", operator: "isnull", value: false },
                  { field: "parentId", operator: "isnull", value: false },
                ],
              },
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
        },
        pageSize: 20,
        serverPaging: true,
        serverFiltering: true,
        serverSorting: true,
      },
    };

    $scope.measOptions = {
      placeholder: "Хэмжих нэгж нэмэх...",
      dataTextField: "comCdNm",
      dataValueField: "id",
      valuePrimitive: true,
      autoBind: false,
      dataSource: {
        transport: {
          read: {
            url: __env.apiUrl() + "/api/nms/common/list",
            contentType: "application/json; charset=UTF-8",
            type: "POST",
            data:           {
              filter: {
                logic: "and",
                filters: [
                  { field: "grpCd", operator: "contains", value: "measurement" },
                  { field: "parentId", operator: "isNull", value: "false" },
                ],
              },
              sort: [{ field: "orderId", dir: "asc" }],
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
        },
        pageSize: 20,
        serverPaging: true,
        serverFiltering: true,
        serverSorting: true,
      },
    };

    $scope.data2Source = {
      transport: {
        read: {
          url: function (e) {
            if (localStorage.getItem("buttonData").includes("read") && JSON.parse(localStorage.getItem("menuData")).url === $state.current.name) {
              return __env.apiUrl() + "/api/nms/investment/category/list";
            } else {
              localStorage.removeItem("menuList");
              localStorage.removeItem("menuData");
              $state.go("login");
            }
          },
          contentType: "application/json; charset=UTF-8",
          type: "POST",
          data: { sort: [{ field: "priority", dir: "asc" }] },
          beforeSend: function (req) {
            req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
          },
        },
        update: {
          url: __env.apiUrl() + "/api/nms/investment/category",
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
          url: __env.apiUrl() + "/api/nms/investment/category",
          contentType: "application/json; charset=UTF-8",
          type: "DELETE",
          beforeSend: function (req) {
            req.setRequestHeader("Authorization", "Bearer " + JSON.parse(localStorage.getItem("currentUser")).token);
          },
        },
        create: {
          url: __env.apiUrl() + "/api/nms/investment/category",
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
        errors: "errors",
        model: {
          id: "id",
          fields: {
            id: { type: "number", nullable: true },
            name: { type: "string", validation: { required: true } },
            objName: { type: "string", validation: { required: true } },
            priority: { type: "number", validation: { required: true } },
            ecoList: [],
            useYn: { type: "number", defaultValue: 1 },
          },
        },
      },
      group: [
        {
          field: "objName",
          dir: "asc",
        },
      ],
      total: 0,
      pageSize: 200,
      serverPaging: true,
      serverSorting: true,
      serverFiltering: true,
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
        {
          field: "name",
          filterable: { cell: { operator: "contains", showOperators: false } },
          headerAttributes: { class: "columnHeader" },
          title: "Нэр",
        },

        /* {field: "parentId", dataTextField: "name", dataValueField: "id", dataSource: $scope.categoryDataSource,editor:$scope.catEditor,template:"#if(category!=null){# <span class='uk-badge' style='border-radius: 50px;background: rgba(218,244,235,255); color:rgba(78,203,157,255);font-weight: bold;'>#=category.name#</span> #}#",filterable: { cell: { operator: "eq", showOperators: false } },headerAttributes: {"class": "columnHeader"}, title: 'Төрөл'},*/
        {
          field: "objName",
          sortable: false,
          headerAttributes: { class: "columnHeader" },
          filterable: { cell: { operator: "contains", showOperators: false } },
          title: "Салбар",
        },
        {
          field: "subObjName",
          sortable: false,
          headerAttributes: { class: "columnHeader" },
          filterable: { cell: { operator: "contains", showOperators: false } },
          title: "Дэд салбар",
        },
        {
          field: "iconName",
          template: "#if(iconUrl!=null){# <div class='avatar-photo' style='background-image: url(#=iconUrl#);'></div> #=iconName# #}#",
          filterable: { cell: { operator: "contains", showOperators: false } },
          headerAttributes: { class: "columnHeader" },
          title: "Икон",
        },
        {
          field: "markerName",
          template: "#if(markerUrl!=null){# <div class='avatar-photo' style='background-image: url(#:markerUrl#);'></div> #=markerName# #}#",
          filterable: { cell: { operator: "contains", showOperators: false } },
          headerAttributes: { class: "columnHeader" },
          title: "Маркер икон",
        },
        {
          field: "imageName",
          template: "#if(imageUrl!=null){# <div class='avatar-photo' style='background-image: url(#:imageUrl#);'></div> #=imageName# #}#",
          filterable: { cell: { operator: "contains", showOperators: false } },
          headerAttributes: { class: "columnHeader" },
          title: "Зураг",
        },
        {
          field: "priority",
          width: 100,
          filterable: { cell: { operator: "eq", showOperators: false } },
          headerAttributes: { class: "columnHeader" },
          title: "Эрэмбэ",
        },
      ],
      dataBinding: function () {
        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
      },
      editable: "inline",
      height: function () {
        return $(window).height() - 115;
      },
    };

    if (localStorage.getItem("buttonData").includes("read")) {
      $scope.main2Grid.toolbar = ["excel", "search"];
    }
    if (localStorage.getItem("buttonData").includes("create")) {
      $scope.main2Grid.toolbar = [{ template: "<button class='md-btn custom-btn' ng-click='add()'><i class='material-icons text-white mr-1'>add</i>Нэмэх</button>" }, "search"];
    }
    if (localStorage.getItem("buttonData").includes("update") || localStorage.getItem("buttonData").includes("edit")) {
      $scope.main2Grid.columns.push({
        command: [
          {
            template:
              '<div class="flex gap-3"><button class="grid-btn k-grid-edit" ng-click=\'update(dataItem)\'><div class="nimis-icon edit"></div></button><button class="grid-btn k-grid-remove-command" ng-click=\'deleteData(dataItem)\'><div class="nimis-icon delete"></div></button></div>',
          },
        ],
        title: "&nbsp;",
        width: 100,
      });
    }

    var modalForm = UIkit.modal("#modal_form", {
      modal: false,
      keyboard: false,
      bgclose: false,
      center: true,
    });

    function onExpand(e) {}

    function onCheck(e) {
      let treeView = $("#treeview").data("kendoTreeView");
      let nodes = treeView.dataSource.view();
      let checkedIds = [];
      let checkedSubIds = [];
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].checked) {
          checkedIds.push(nodes[i].id);
        }
      }
      // дэд салбартай үед
      nodes = nodes.filter((i) => i.items.length > 0);
      for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < nodes[i].items.length; j++) {
          if (nodes[i].items[j].checked) {
            nodes[i].checked = true;
            checkedSubIds.push(nodes[i].items[j].id);
            if (!checkedIds.includes(nodes[i].id)) checkedIds.push(nodes[i].id);
          }
        }
      }
      $scope.sObjDataSource = nodes;
      $scope.dataItem.objArray = checkedIds;
      $scope.dataItem.subObjArray = checkedSubIds;
    }

    function onCheck2(e) {
      let treeView = $("#sourceTypeTreeview").data("kendoTreeView");
      let nodes = treeView.dataSource.view();
      let checkedIds = [];
      let checkedSubIds = [];
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].checked) {
          checkedIds.push(nodes[i].id);
        }
      }
      // дэд салбартай үед
      nodes = nodes.filter((i) => i.items.length > 0);
      for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < nodes[i].items.length; j++) {
          if (nodes[i].items[j].checked) {
            nodes[i].checked = true;
            checkedSubIds.push(nodes[i].items[j].id);
            if (!checkedIds.includes(nodes[i].id)) checkedIds.push(nodes[i].id);
          }
        }
      }
      console.log(nodes);
      console.log(checkedIds);
      $scope.sSourceTypeDataSource = nodes;
      $scope.dataItem.sourceTypeArray = checkedIds.concat(checkedSubIds);
    }

    $scope.fetchChildren = function (api) {
      return mainService
        .withdata("post", __env.apiUrl() + "/api/nms/" + api + "/list", {
          filter: {
            logic: "and",
            filters: [{ field: "parentId", operator: "isNull", value: false }],
          },
          sort: [{ field: "name", dir: "asc" }],
          page: 1,
          take: 100,
          skip: 0,
          pageSize: 100,
        })
        .then(function (data) {
          if (data.total > 0) {
            return data.data;
          } else return [];
        });
    };
    mainService
      .withdata("post", __env.apiUrl() + "/api/nms/sector/list", {
        filter: {
          logic: "and",
          filters: [
            { field: "parentId", operator: "isNull", value: true },
            { field: "useYn", operator: "eq", value: 1 },
          ],
        },
        sort: [{ field: "name", dir: "asc" }],
        page: 1,
        take: 100,
        skip: 0,
        pageSize: 100,
      })
      .then(function (data) {
        if (data.data.length > 0) {
          let parents = data.data;
          $scope.fetchChildren("sector").then((children) => {
            parents.forEach((i) => {
              var tmpChild = children.filter((child) => child.parentId == i.id);
              i.items = tmpChild;
            });
            $scope.sObjDataSource = parents;
            $timeout(
              () =>
                $("#treeview").kendoTreeView({
                  dataTextField: "name",
                  expand: onExpand,
                  check: onCheck,
                  loadOnDemand: true,
                  checkboxes: {
                    checkChildren: true,
                  },
                  checkedKeys: $scope.dataItem.objArray,
                  dataSource: $scope.sObjDataSource,
                }),
              500
            );
          });
        }
      });
    mainService
      .withdata("post", __env.apiUrl() + "/api/nms/source/type/list", {
        filter: {
          logic: "and",
          filters: [
            { field: "parentId", operator: "isNull", value: true },
            { field: "useYn", operator: "eq", value: 1 },
          ],
        },
        sort: [{ field: "orderId", dir: "asc" }],
        page: 1,
        take: 100,
        skip: 0,
        pageSize: 100,
      })
      .then(function (data) {
        if (data.data.length > 0) {
          let parents = data.data;
          $scope.fetchChildren("source/type").then((children) => {
            parents.forEach((i) => {
              var tmpChild = children.filter((child) => child.parentId == i.id);
              i.items = tmpChild;
            });
            $scope.sSourceTypeDataSource = parents;
            $("#sourceTypeTreeview").kendoTreeView({
              dataTextField: "name",
              expand: onExpand,
              check: onCheck2,
              loadOnDemand: true,
              checkboxes: {
                checkChildren: true,
              },
              checkedKeys: $scope.dataItem.sourceTypeArray,
              dataSource: $scope.sSourceTypeDataSource,
            });
          });
        }
      });

    $scope.add = function () {
      $scope.dataItem = { objIds: "", subObjIds: "", name: "", priority: "", type: "", measId: "" };
      $scope.dataItem.objArray = [176, 54];
      $scope.dataItem.subObjArray = [];
      $scope.ezObj = {};
      modalForm.show();
    };
    $scope.update = function (item) {
      $scope.roles = {};
      $scope.levels = {};
      $scope.ezObj = {};
      $scope.dataItem = item;
      $scope.dataItem.measArray = item.measIds ? item.measIds.split(",") : (item.measId ? [item.measId] : []);
      $scope.dataItem.ezArray = item.ezIds ? item.ezIds.split(",") : [];
      $scope.dataItem.ezArray.map((i) => ($scope.ezObj[i] = true));

      $scope.dataItem.objArray = item.objIds ? item.objIds.split(",") : [];
      $scope.dataItem.subObjArray = item.subObjIds ? item.subObjIds.split(",") : [];
      $scope.dataItem.sourceTypeArray = item.sourceTypeIds ? item.sourceTypeIds.split(",") : [];

      $scope.sSourceTypeDataSource.forEach((i) => {
        i.checked = $scope.dataItem.sourceTypeArray.includes(i.id.toString());
        i.items.forEach((j) => {
          j.checked = $scope.dataItem.sourceTypeArray.includes(j.id.toString());
        });
      });
      $("#sourceTypeTreeview").data("kendoTreeView").setDataSource($scope.sSourceTypeDataSource);
      $scope.sObjDataSource.forEach((i) => {
        i.checked = $scope.dataItem.objArray.includes(i.id.toString());
        i.items.forEach((j) => {
          j.checked = $scope.dataItem.subObjArray.includes(j.id.toString());
        });
      });
      $("#treeview").data("kendoTreeView").setDataSource($scope.sObjDataSource);
      /*$("#treeview").kendoTreeView({
                dataTextField: "name",
                expand: onExpand,
                check: onCheck,
                loadOnDemand: true,
                checkboxes: {
                  checkChildren: true,
                },
                checkedKeys: $scope.dataItem.objArray,
                dataSource: $scope.sObjDataSource,
              });*/
      modalForm.show();
    };

    $scope.formSubmit = function () {
      var validator = $("#modal_form").kendoValidator().data("kendoValidator");
      $scope.dataItem.objIds = $scope.dataItem.objArray.join(",");
      $scope.dataItem.subObjIds = $scope.dataItem.subObjArray.join(",");
      $scope.dataItem.ezArray = [];
      for (var ezObj in $scope.ezObj) {
        var ez = $scope.ezObj[ezObj];
        if (ez) $scope.dataItem.ezArray.push(ezObj);
      }
      if (validator.validate()) {
        $scope.dataItem.measObjIds = $scope.dataItem.measArray.join(",");
        $scope.dataItem.measId = $scope.dataItem.measArray[0];
        mainService.withResponse("post", "/api/nms/investment/category/submit", $scope.dataItem).then(function (response) {
          if (response.status == 200) {
            $rootScope.alert(true, "Амжилттай");
            $(".k-grid").data("kendoGrid").dataSource.read();
            modalForm.hide();
          } else $rootScope.alert(false, "Алдаа гарлаа");
        });
      }
    };
  },
]);
