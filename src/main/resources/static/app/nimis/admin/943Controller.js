angular.module("altairApp").controller("943NmsCtrl", [
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
    $scope.user = JSON.parse(sessionStorage.getItem('currentUser'));
    $scope.pol = { useYn: 1, amgId : null };

    if($scope.user.user.amgId != null)
      $scope.pol.amgId = $scope.user.user.amgId;

    $scope.chooseFile = true;
    $scope.documents = [];
    $scope.yearSelectorOptions = { format: "yyyy.MM.dd" };

    $scope.tezDataSource = commonDataSource.urlDataSource(
      "/api/nms/general/governor/list",
      JSON.stringify({
        filter: {
          logic: "and",
          filters: [{ field: "useYn", operator: "eq", value: "1" }],
        },
        sort: [{ field: "ordNo", dir: "asc" }],
      })
    );
    $scope.lawTypeDataSource = commonDataSource.urlPageDataSource(
      "/api/nms/common/list",
      JSON.stringify({
        filter: {
          logic: "and",
          filters: [
            { field: "grpCd", operator: "eq", value: "lawType" },
            { field: "useYn", operator: "eq", value: 1 },
          ],
        },
        sort: [{ field: "id", dir: "asc" }],
      }),
      60
    );
    $scope.fileDtl = null;
    $scope.onSelect = function (e) {
      $scope.fileDtl = null;
    };
    $scope.fileOptions = {
      multiple: true,
      autoUpload: true,
      showFileList: false,
      async: {
        // saveUrl: __env.apiUrl() + "/api/nms/app/main/upload/" + $scope.app.id + "/detail",
        saveUrl: __env.apiUrl() + "/api/nms/app/main/upload/725/detail",
        removeUrl: __env.apiUrl() + "/api/file/delete",
        autoUpload: true,
      },
      success: function (e) {
        if (e.operation == "upload") {
          $scope.pol.fileId = e.response.id;
        }
        $scope.fileDtl = e.response;
      },
      upload: function (e) {
        var xhr = e.XMLHttpRequest;
        if (xhr) {
          xhr.addEventListener("readystatechange", function (e) {
            if (xhr.readyState == 1 /* OPENED */) {
              xhr.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
            }
          });
        }
      },
      validation: {
        maxFileSize: 20000000, //20mb (in bytes)  allowedExtensions: ["doc", "txt", "docx", "pdf", "jpg", "jpeg", "png", "xlsx", "xls"],
      },
    };

    $scope.dataSource = new kendo.data.DataSource({
      transport: {
        read: {
          url: __env.apiUrl() + "/api/nms/law/list",
          contentType: "application/json; charset=UTF-8",
          type: "POST",
          data: { sort: [{ field: "id", dir: "desc" }] },
          beforeSend: function (req) {
            req.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("currentUser")).token);
          },
        },
        destroy: {
          url: __env.apiUrl() + "/api/nms/law",
          contentType: "application/json; charset=UTF-8",
          type: "DELETE",
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
          },
        },
      },
      pageSize: 20,
      serverPaging: true,
      serverFiltering: true,
      serverSorting: true,
    });
    $scope.dataSource.filter({
      logic: "and",
      filters: [{ field: "useYn", operator: "eq", value: 1 }],
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
          sticky: true,
          width: 50,
        },
        {
          field: "code",
          filterable: { cell: { operator: "contains", showOperators: false } },
          headerAttributes: { class: "columnHeader" },
          title: "Дугаар",
          width: 100,
        },
        {
          field: "name",
          filterable: { cell: { operator: "contains", showOperators: false } },
          headerAttributes: { class: "columnHeader" },
          template: "#if(fileId!=null){#<a class='uk-text-primary' target='_blank' href='#=fileUrl#'>#=name#</a>#}else{# #=name# #}# ",
          title: "Нэр",
          width: 400,
        },
        {
          field: "confirmDate",
          filterable: { cell: { operator: "contains", showOperators: false } },
          headerAttributes: { class: "columnHeader" },
          title: "Он сар өдөр",
          width: 120,
        },
        {
          field: "tezName",
          filterable: { cell: { operator: "contains", showOperators: false } },
          headerAttributes: { class: "columnHeader" },
          title: "Байгууллага",
        },
        {
          field: "typeName",
          filterable: { cell: { operator: "contains", showOperators: false } },
          headerAttributes: { class: "columnHeader" },
          title: "Төрөл",
        },

        /*{
                        field: "roles",
                        headerAttributes: {class: "columnHeader"},
                        filterable: false,
                        template: "#for (var i=0,len=roles.length; i<len; i++){#<span>${ roles[i].name } #if(i!=roles.length-1){#<span>,</span>#}# </span> # } #",
                        title: "Эрх",
                    },*/
        /*   {
                           field: "roles",
                           headerAttributes: {class: "columnHeader"},
                           filterable: false,
                           template: "#for (var i=0,len=levels.length; i<len; i++){#<span>${ levels[i].name } #if(i!=levels.length-1){#<span>,</span>#}# </span> # } #",
                           title: "Холбоотой түвшин",
                       },*/
      ],
      dataBinding: function () {
        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
      },
      editable: "inline",
      height: function () {
        return $(window).height() - 160;
      },
    };

    if (sessionStorage.getItem("buttonData").includes("create")) {
      $scope.mainGrid.toolbar = [{ template: "<button class='md-btn custom-btn bg-indigo-900' ng-click='addLevel()'><i class=\"material-icons text-white mr-1\">add</i>Нэмэх</button>" }];
    }

    $scope.addLevel = function () {
      UIkit.modal("#modal_law", {
        modal: false,
        keyboard: false,
        bgclose: false,
        center: true,
      }).show();
      $scope.pol = { useYn: 1 };
      if($scope.user.user.amgId != null)
        $scope.pol.amgId = $scope.user.user.amgId;

      $scope.modalType = "add";
    };

    if (sessionStorage.getItem("buttonData").includes("edit")) {
      $scope.mainGrid.columns.push({
        command: [
          {
            template:
              '<div class="flex gap-3"><button class="grid-btn k-grid-edit" ng-click=\'update(dataItem)\'><div class="nimis-icon edit"></div></button>' +
              '<button class="grid-btn k-grid-remove-command" ng-click=\'deleteLevel(dataItem)\'><div class="nimis-icon delete"></div></button></div>',
          },
        ],
        title: "&nbsp;",
        width: 120,
        sticky: true,
        attributes: { style: "text-align: center;" },
      });
    }

    $scope.deleteLevel = function (item) {
      mainService.withdata("post", __env.apiUrl() + "/api/nms/law/setInactive", item).then(function (data) {
        $rootScope.alert(true, "Устгах үйлдэл амжилттай боллоо.");
        $(".k-grid").data("kendoGrid").dataSource.read();
      });
    };

    $scope.update = function (item) {
      $scope.pol = item;
      UIkit.modal("#modal_law", {
        modal: false,
        keyboard: false,
        bgclose: false,
        center: true,
      }).show();
    };
    $scope.addLaw = function () {
      if ($scope.validatorProject.validate()) {
        var method = "";
        if ($scope.pol.id != null) {
          method = "put";
        } else {
          method = "post";
        }
        mainService.withdata(method, __env.apiUrl() + "/api/nms/law", $scope.pol).then(function (data) {
          $rootScope.alert(true, "Амжилттай хадгаллаа.");
          UIkit.modal("#modal_law").hide();
          $(".k-grid").data("kendoGrid").dataSource.read();
        });
      } else {
        $rootScope.alert(false, "Мэдээллийг бүрэн бөглөнө үү.");
      }
    };
  },
]);
