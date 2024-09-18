angular.module("altairApp").controller("1001GridCtrl", [
    "$rootScope",
    "$state",
    "$scope",
    "$timeout",
    "$http",
    "$window",
    "mainService",
    "commonDataSource",
    "__env",
    "sweet",
    function ($rootScope, $state, $scope, $timeout, $http, $window, mainService, commonDataSource, __env, sweet) {
        $scope.user = JSON.parse(sessionStorage.getItem("currentUser")).user;
        let token = JSON.parse(sessionStorage.getItem("currentUser")).token;
        $scope.selectedIds = [];
        $scope.filterByBatch = 1;
        $scope.filterKey = "";
        $scope.filterCustom = "";
        this.$onChanges = function (changes) {
            console.log(changes);
            $scope.filterKey = changes.key.currentValue;
            $scope.filterCustom = changes.custom.currentValue;
            // auto opens 'search & filter' sidebar if applicable
            console.log( $scope.filterKey);
            console.log( $scope.filterCustom);
            let filterData = JSON.parse(sessionStorage.getItem($scope.filterKey));
            if (filterData !== null && filterData.filter !== null && filterData.filter.filters !== null &&
                filterData.filter.filters.length > 2) {
                $scope.hidden = false;
            }

            $scope.initDs();
            $scope.init();
        };

        $scope.filters = [];

        $scope.getByFilterKey = function () {
            let filterRequest = JSON.parse(sessionStorage.getItem($scope.filterKey));
            if (!filterRequest) {
                filterRequest = {
                    filter: {
                        logic: "and",
                        filters: [],
                    },
                    sort: /*$scope.filterKey === "filterNegtgel"
            ? [{ field: "lawOrder", dir: "asc" }]
            :*/ $scope.filterKey === "filter1010"
                        ? [{field: "shiljihName", dir: "asc"}, {
                            field: "updatedAt",
                            dir: "desc"
                        }] : [{field: "updatedAt", dir: "desc"}],
                };

                /*        console.log('$scope.filterKey ::: ' + $scope.filterKey);
                        if ($scope.filterKey === "filter1011"){
                          console.log('is here filter');
                          filterRequest = {
                            filter: {
                              logic: "and",
                              filters: [],
                            },
                            sort: [{ field: "tezId", dir: "asc" }, { field: "createdUserOrgName", dir: "asc" }, { field: "ezId", dir: "asc" }, { field: "shiljihName", dir: "asc" }]
                          };
                        }*/

            }
            return filterRequest;
        };
        $scope.getFilterRequest = function () {
            let filterRequest = $scope.getByFilterKey();
            let filters = filterRequest.filter.filters;
            if (filters && Array.isArray(filters)) {
                let currentValues = filters.filter(function (i) {
                    return i.filters && i.filters[0].field === "name";
                });
                if (currentValues.length > 0) {
                    $scope.search.searchNameValue2 = currentValues[0].filters[0].value;
                }
            }
            filters = filters || [];
            if (filters.length === 0 && $scope.filterCustom) {
                filters.push({logic: "or", filters: $scope.filterCustom});
                // filters.push($scope.filterCustom);
            }
            filters = filters.filter(function (i) {
                return i.field !== "customParentIdHas";
            });
            if ($scope.filterByBatch !== 1) {
                filters.push({
                    field: "customParentIdHas",
                    operator: "eq",
                    value: $scope.filterByBatch
                });
            }
            if (sessionStorage.getItem("budgetCode") &&
                !(($scope.filterKey.startsWith('filter1007') || $scope.filterKey.startsWith('filter1001')) && $rootScope.isMof($scope.user))) {
                filters = filters.filter(function (i) {
                    return i.field !== "budgetCode";
                });
                filters.push({
                    field: "budgetCode",
                    operator: "eq",
                    value: sessionStorage.getItem("budgetCode")
                });
            }
            filterRequest.filter.filters = filters;
            return filterRequest;
        };
        $scope.init = function () {
            let filters = $scope.getFilterRequest();
            $scope.appData = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: function (e) {
                            return __env.apiUrl() + "/api/nms/es/app/filter/list";
                        },
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
                        data: filters || {
                            filter: {
                                logic: "and",
                                filters: [],
                            },
                            sort: [{field: "updatedAt", dir: "desc"}],
                        },
                        beforeSend: function (req) {
                            req.setRequestHeader("Authorization", "Bearer " + token);
                        },
                        complete: function (resp) {
                            if (resp.status === 500) {
                                $scope.init();
                                return;
                            }
                            let data = resp.responseJSON;
                            if (data === undefined) {
                                return;
                            }
                            // let data = JSON.parse(resp.responseText);
                            $scope.selectedIds = [];
                            $scope.total = {count: data.total, checked: false};
                            let savedFilters = $scope.getByFilterKey().filter.filters;
                            $scope.filters = [];
                            $timeout(function () {
                                if ($scope.filterKey == "filter1009-2") {
                                    $scope.addFilter("Сүүлд батлагдсан он", "planYr", data.aggregates, savedFilters);
                                }
                                $scope.addFilter("үе шат", "stepName", data.aggregates, savedFilters);
                                // $scope.addFilter("төсөл, арга хэмжээний төрөл", "typeName", data.aggregates, savedFilters);
                                $scope.addFilter("ТӨСВИЙН ЕРӨНХИЙЛӨН ЗАХИРАГЧ", "tezName", data.aggregates, savedFilters);
                                $scope.addFilter("Эдийн засгийн ангилал", "ezName", data.aggregates, savedFilters);
                                // if (["filter1006", "filter1009", "filterNegtgelUnselected", "filterNegtgel", "filter1011"].includes($scope.filterKey)) {
                                $scope.addFilter("Шинэ/Шилжих", "shiljihName", data.aggregates, savedFilters);
                                // }
                                $scope.addFilter("Үүсгэсэн хэрэглэгчийн төрөл", "createdUserTypeNm", data.aggregates, savedFilters);
                                $scope.addFilter("аймаг/нийслэл", "amgName", data.aggregates, savedFilters);
                                $scope.addFilter("сум/дүүрэг", "sumName", data.aggregates, savedFilters);
                                $scope.addFilter("баг/хороо", "bagName", data.aggregates, savedFilters);
                                $scope.addFilter("эхлэх он", "srtDt", data.aggregates, savedFilters);
                                $scope.addFilter("дуусах он", "endDt", data.aggregates, savedFilters);

                                $scope.addFilter("Хүчин чадалтай эсэх", "hasCapacity", data.aggregates, savedFilters);
                                $scope.addFilter("ТЭЗҮ-тэй эсэх", "hasTezu", data.aggregates, savedFilters);
                                $scope.addFilter("Зураг төсөвтэй эсэх", "hasZurag", data.aggregates, savedFilters);
                                $scope.addFilter("Шинжилгээтэй эсэх", "hasForm", data.aggregates, savedFilters);
                                $scope.addFilter("Аудитын дүгнэлттэй эсэх", "hasAudit", data.aggregates, savedFilters);
                                $scope.addFilter("ТЕЗ-с ирүүлсэн албан бичигт хавсаргасан эсэх", "hasTez", data.aggregates, savedFilters);
                                $scope.addFilter("УИХ-н гишүүний санал эсэх", "isParProposal", data.aggregates, savedFilters);
                                $scope.addFilter("ЗГХЭГ-н санал эсэх", "isHegProposal", data.aggregates, savedFilters);
                            });
                        },
                    },
                    destroy: {
                        url: __env.apiUrl() + "/api/nms/app/main",
                        contentType: "application/json; charset=UTF-8",
                        beforeSend: function (req) {
                            req.setRequestHeader("Authorization", "Bearer " + token);
                        },
                        complete: function () {
                            $(".k-grid").data("kendoGrid").dataSource.read();
                        },
                        type: "DELETE",
                    },
                    parameterMap: function (options) {
                        let jsonOptions = JSON.stringify(options);
                        sessionStorage.setItem($scope.filterKey, jsonOptions);
                        return jsonOptions;
                    },
                },
                schema: {
                    data: "data",
                    total: "total",
                    /*model: {
                      id: "id",
                      fields: {
                        id: { type: "number", nullable: true },
                        orgId: { type: "number" },
                        govId: { type: "number", editable: false },
                        useYn: { type: "boolean", defaultValue: true },
                      },
                    },*/
                },
                pageSize: 25,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
            });
            $scope.reordering = false;
        };
        $scope.initDs = function () {
            let columns = [
                {
                    title: "#",
                    headerAttributes: {"class": "columnHeader"},
                    attributes: {style: "text-align: center;"},
                    template: "#= ++record # <div class='hidden'>#=id #</div",
                    sticky: true,
                    width: 50,
                },
                {
                    field: "name",
                    filterable: {cell: {operator: "contains"}},
                    title: "Төслийн нэр",
                    headerAttributes: {"class": "columnHeader"},
                    template: ($scope.isMofOrSystem ? "#if(mofName) {# #= mofName # #} else {# #= name # #}#" : "#= name #") + "#if (parentId != null) { #<span class='text-red-300'>Б</span>#}#",
                    sticky: true,
                    width: 300,
                },
                {
                    field: "utCode",
                    filterable: {cell: {operator: "contains"}},
                    title: "Төслийн код",
                    headerAttributes: {"class": "columnHeader"},
                    sticky: true,
                    width: 120,
                },
            ];
            if (['filterNegtgel', 'filter1011', 'filter1012', 'filter1013'].includes($scope.filterKey)) {
                columns = columns.concat([
                    {
                        field: "lawNo",
                        width: 80,
                        title: "Хуулийн дугаар",
                        headerAttributes: {"class": "columnHeader"},
                        sticky: true,
                    },
                    /*{
                      field: "lawOrder",
                      width: 80,
                      title: "Хуулийн эрэмбэ",
                      headerAttributes: { "class": "columnHeader" },
                      template: "<div ng-if='reordering'>" +
                          "<input style='width:60px' kendo-numeric-text-box step='1' k-min='0' ng-model='dataItem.lawOrder' ng-change='lawOrderChanged(event, dataItem)'/>" +
                          "</div><span ng-if='!reordering'>#if(lawOrder){# #=lawOrder# #}#</span>",
                      sticky: true,
                    },*/
                ]);
            }
            if ($scope.filterKey == 'filter1009-2') {
                columns = columns.concat([
                    {
                        field: "planYr",
                        width: 60,
                        title: "Сүүлд батлагдсан он",
                        headerAttributes: {"class": "columnHeader"},
                    },
                ]);
            }
            columns = columns.concat([
                {
                    // field: "tez.comCdNm",
                    field: "tezName",
                    width: 250,
                    headerAttributes: {"class": "columnHeader"},
                    filterable: {
                        cell: {
                            operator: "contains",
                            suggestionOperator: "contains",
                        },
                    },
                    // template: "<span>#if(tez!=null){# #=tez.comCdNm# #}#</span>",
                    title: "ТЕЗ",
                },
                {
                    // field: "aimag.cdNm",
                    field: "amgName",
                    title: "Аймаг / Нийслэл",
                    headerAttributes: {"class": "columnHeader"},
                    // template: "<span>#if(aimag!=null){# #=aimag.cdNm# #}#</span>",
                    width: 150,
                },
                {
                    // field: "soum.cdNm",
                    field: "sumName",
                    title: "Сум / Дүүрэг",
                    headerAttributes: {"class": "columnHeader"},
                    // template: "<span>#if(soum!=null){# #=soum.cdNm# #}#</span>",
                    width: 150,
                },
                {
                    // field: "ez.comCdNm",
                    field: "ezName",
                    title: "ЭЗ ангилал",
                    headerAttributes: {"class": "columnHeader"},
                    filterable: {
                        cell: {
                            operator: "contains",
                            suggestionOperator: "contains",
                        },
                    },
                    // template: "<span>#if(ez!=null){# #=ez.comCdNm# #}#</span>",
                    width: 150,
                },
                {
                    field: "srtDt",
                    title: "Эхлэх",
                    headerAttributes: {"class": "columnHeader"},
                    width: 80,
                    attributes: {style: "text-align: center;"},
                },
                {
                    field: "endDt",
                    title: "Дуусах",
                    headerAttributes: {"class": "columnHeader"},
                    width: 80,
                    attributes: {style: "text-align: center;"},
                },
            ]);
            if ($scope.isMofOrSystem) {
                columns = columns.concat([
                    {
                        field: "mofAmount",
                        title: "СЯ Төсөвт өртөг /сая ₮/",
                        headerAttributes: {"class": "columnHeader", "style": "text-align: right;"},
                        attributes: {"style": "text-align: right;"},
                        format: "{0:#,##0.##}",
                        width: 140,
                    },
                    {
                        field: "mofNextYearAmount",
                        title: "СЯ Ирэх онд санхүүжих дүн /сая ₮/",
                        headerAttributes: {"class": "columnHeader", "style": "text-align: right;"},
                        attributes: {"style": "text-align: right;"},
                        format: "{0:#,##0.##}",
                        width: 140,
                    }
                ]);
            }
            columns = columns.concat([
                {
                    field: "amount",
                    title: ($scope.isMofOrSystem ? "ТЕЗ " : "") + "Төсөвт өртөг /сая ₮/",
                    headerAttributes: {"class": "columnHeader", "style": "text-align: right;"},
                    attributes: {"style": "text-align: right;"},
                    format: "{0:#,##0.##}",
                    width: 150,
                },
                {
                    field: "nextYearAmount",
                    title: ($scope.isMofOrSystem ? "ТЕЗ " : "") + "Ирэх онд санхүүжих дүн /сая ₮/",
                    headerAttributes: {"class": "columnHeader", "style": "text-align: right;"},
                    attributes: {"style": "text-align: right;"},
                    // template: "<span>{{dataItem.nextYearAmount | number :0}} сая ₮</span>",
                    format: "{0:#,##0.##}",
                    width: 140,
                }
            ]);
            if ($scope.filterKey == 'filterNegtgel' && $scope.isMofOrSystem) {
                columns = columns.concat([
                    {
                        field: "centralTezName",
                        width: 250,
                        headerAttributes: {"class": "columnHeader"},
                        filterable: {
                            cell: {
                                operator: "contains",
                                suggestionOperator: "contains",
                            },
                        },
                        title: "Төсвийн төвлөрүүлэн захирагч",
                    }
                ]);
            }
            if (["filter1010", "filter1005", "filter1007Sent", "filter1007NextStep", "filterNegtgelUnselected", "filterNegtgel", "filter1011"].includes($scope.filterKey)) {
                columns = columns.concat([
                    {
                        field: "shiljihName",
                        width: 100,
                        filterable: {
                            cell: {
                                operator: "contains",
                                suggestionOperator: "contains",
                            },
                        },
                        title: "Шинэ/Шилжих",
                        headerAttributes: {"class": "columnHeader"},
                    },
                ]);
            }
            columns = columns.concat([
                {
                    field: "createdUserName",
                    title: "Төсөл үүсгэсэн",
                    headerAttributes: {"class": "columnHeader"},
                    width: 150,
                },
                {
                    field: "createdUserOrgName",
                    title: "Байгууллага",
                    headerAttributes: {"class": "columnHeader"},
                    width: 150,
                },
                {
                    field: "stepName",
                    filterable: {cell: {operator: "contains"}},
                    title: "Үе шат",
                    headerAttributes: {"class": "columnHeader"},
                    template: ($scope.isMofOrSystem ? "#" :
                            "#if(isPrivate==1){#<span class='grid-lbl'>СЯ хянах 2-р шатны үнэлгээ</span>#}else ") +
                        "if(stepName){#<span class='grid-lbl'>#=stepName#</span>#}#",
                    width: 250,
                },
                {
                    field: "status",
                    filterable: {cell: {operator: "contains"}},
                    title: "Төлөв",
                    headerAttributes: {"class": "columnHeader"},
                    attributes: {style: "text-align: center;"},
                    template: ($scope.isMofOrSystem ? "#" :
                            "#if(isPrivate==1){#Илгээсэн#}else ") +
                        "if(fromOld==1){#Хуучин төсөл" +
                        "#}else if(status=='DRAFT'){#Хадгалсан" +
                        "#}else if(status=='SENT'){#Илгээсэн" +
                        "#}else if(status=='RETURNED'){#Буцсан" +
                        "#}else if(status=='EVALUATED'){#Үнэлсэн" +
                        "#}else if(status=='SELECTABLE'){#Сонгох боломжтой" +
                        "#}else if(status=='SUBMITTED'){#Өргөн барихад бэлэн" +
                        "#}else if(status=='TRANSFERRED'){#Шилжүүлсэн" +
                        "#}else if(status=='RESERVE-OUT'){#Нөөцөөс гарсан#}#",
                    width: 150,
                },
                {
                    field: "hasCapacity",
                    title: "Хүчин чадалтай эсэх",
                    headerAttributes: {"class": "columnHeader"},
                    template: "#if(hasCapacity==1){# Тийм #}else{# Үгүй #}#",
                    width: 80,
                    attributes: {style: "text-align: center;"},
                },
                {
                    field: "hasTezu",
                    title: "ТЭЗҮ-тэй эсэх",
                    headerAttributes: {"class": "columnHeader"},
                    template: "#if(hasTezu==1){# Тийм #}else{# Үгүй #}#",
                    width: 80,
                    attributes: {style: "text-align: center;"},
                },
                {
                    field: "hasZurag",
                    title: "Зураг төсөвтэй эсэх",
                    headerAttributes: {"class": "columnHeader"},
                    template: "#if(hasZurag==1){# Тийм #}else{# Үгүй #}#",
                    width: 80,
                    attributes: {style: "text-align: center;"},
                },
                {
                    field: "hasForm",
                    title: "Шинжилгээтэй эсэх",
                    headerAttributes: {"class": "columnHeader"},
                    template: "#if(hasForm==1){# Тийм #}else{# Үгүй #}#",
                    width: 80,
                    attributes: {style: "text-align: center;"},
                }
            ]);
            if ($rootScope.isMof($scope.user)) {
                columns = columns.concat([
                    {
                        field: "hasAudit",
                        title: "Аудитын дүгнэлттэй эсэх",
                        headerAttributes: {"class": "columnHeader"},
                        template: "#if(hasAudit==1){# Тийм #}else{# Үгүй #}#",
                        width: 80,
                        attributes: {style: "text-align: center;"},
                    },
                    {
                        field: "hasTezAttach",
                        title: "ТЕЗ-ээс ирүүлсэн албан бичигт хавсаргасан эсэх",
                        headerAttributes: {"class": "columnHeader"},
                        template: "#if(hasTezAttach==1){# Тийм #}else{# Үгүй #}#",
                        width: 80,
                        attributes: {style: "text-align: center;"},
                    },
                    {
                        field: "isParProposal",
                        title: "УИХ-ын гишүүний санал эсэх",
                        headerAttributes: {"class": "columnHeader"},
                        template: "#if(isParProposal==1){# Тийм #}else{# Үгүй #}#",
                        width: 80,
                        attributes: {style: "text-align: center;"},
                    },
                    {
                        field: "isHegProposal",
                        title: "ЗГХЭГ-ийн санал эсэх",
                        headerAttributes: {"class": "columnHeader"},
                        template: "#if(isHegProposal==1){# Тийм #}else{# Үгүй #}#",
                        width: 80,
                        attributes: {style: "text-align: center;"},
                    },
                    /*{
                      field: "measurementName",
                      title: "Хэмжих нэгж",
                      // template: "<span>#if(measurement!=null){# #=measurement.comCdNm# #}#</span>",
                      width: 150,
                      attributes: { style: "text-align: center;" },
                    },
                    {
                      field: "capacity",
                      title: "Хүчин чадал",
                      width: 150,
                      attributes: { style: "text-align: center;" },
                    },*/
                ]);
            }
            if ($scope.filterKey !== 'filter1001') {
                columns = columns.concat([
                    {
                        title: "1-р шат",
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                        columns: [
                            {
                                field: "amgTtl1",
                                title: "Аймаг оноо",
                                width: 120,
                                attributes: {style: "text-align: right;"},
                            },
                            {
                                field: "tezTtl1",
                                title: "ТЕЗ оноо",
                                width: 120,
                                attributes: {style: "text-align: right;"},
                            },
                            {
                                field: "mofTtl1",
                                title: "СЯ оноо",
                                width: 120,
                                attributes: {style: "text-align: right;"},
                            },
                            {
                                field: "eval1Ttl",
                                title: "Дундаж оноо",
                                width: 120,
                                format: "{0:##.##}",
                                attributes: {style: "text-align: right;"},
                            },
                        ],
                    },
                    {
                        title: "2-р шат",
                        headerAttributes: {style: "text-align: center;white-space: normal; vertical-align: middle; "},
                        columns: [
                            {
                                field: "tezTtl2",
                                title: "ТЕЗ оноо",
                                width: 120,
                                attributes: {style: "text-align: right;"},
                            },
                            {
                                field: "mofTtl2",
                                title: "СЯ оноо",
                                width: 120,
                                attributes: {style: "text-align: right;"},
                            },
                            {
                                field: "eval2Ttl",
                                title: "Дундаж оноо",
                                width: 120,
                                format: "{0:##.##}",
                                attributes: {style: "text-align: right;"},
                            },
                        ],
                    },
                ]);
            }
            if ($scope.filterKey === 'filter1008') {
                columns.push({
                    field: "commentDescription",
                    title: "Тайлбар",
                    headerAttributes: {"class": "columnHeader"},
                    width: 120,
                    attributes: {style: "text-align: center;"},
                    sticky: true
                });
            }
            if ($scope.filterKey === "filter1010" || $scope.canCreateBatch || $scope.filterKey === "filterNegtgelUnselected") {
                columns.unshift({selectable: true, width: "50px", sticky: true});
            }
            $scope.mainGrid = {
                filterable: false,
                // selectable: "multiple, row",
                selectable: false,
                sortable: true,
                resizable: true,
                pageable: {
                    refresh: true,
                    pageSize: 25,
                    pageSizes: true,
                    buttonCount: 5,
                },
                columns: columns,
                dataBinding: function () {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                    if (isNaN(record)) {
                        record = 0;
                    }
                },
                dataBound: function (e) {
                    // console.log($scope.filterKey);
                    // console.log(e);
                    let items = e.sender.items();
                    let data = $scope.appData.data();
                    items.each(function (index) {
                        let dataItem = data[index];
                        if (dataItem.status === "RETURNED") {
                            this.className += " returned";
                        }
                    });
                },
                change: function (args) {
                    let rows = $("[data-id=" + $scope.filterKey + "]").data("kendoGrid").select();
                    $scope.selectedIds = [];
                    $(rows).each(function () {
                        let found = $(this).find("td > div.hidden");
                        if (found && found.length > 0) {
                            $scope.selectedIds.push(found[0].innerText);
                        }
                    });
                },
                excelExport: exportGridWithTemplatesContent,
                editable: false,
                height: function () {
                    return $(window).height() - 150;
                },
            };

            let template = "<button class='md-btn custom-secondary-btn' type='button' ng-click='toggleSidebar()'>Хайлтыг {{hidden?'нээх':'нуух'}}</button>";
            if (sessionStorage.getItem("buttonData").includes("create") && sessionStorage.getItem("budgetCode") && sessionStorage.getItem("budgetCode") != "ОНТ") {
                template += "<button class='md-btn custom-btn' ng-click='createApp()'><i class='material-icons text-white mr-1'>add</i>Төсөл</button>";
            }
            if ($scope.canCreateBatch) {
                template += "<button class='md-btn custom-btn' ng-style=\"{'opacity': selectedIds.length ? '1' : '0.6'}\" ng-click='createBatchApp()' ng-disabled='selectedIds.length == 0'><i class='material-icons text-white mr-1'>add</i> Багц төсөл</button>";
            }
            if (sessionStorage.getItem("buttonData").includes("read") && ["filter1006NextStep", "filter1007NextStep"].includes($scope.filterKey)) {
                template += "<button class='md-btn custom-secondary-btn' type='button' ng-click='mayagt3(\"excel\")'>Маягт 3</button>";
                // template += "<a class=\"md-btn custom-secondary-btn\"  href=\"/api/nms/funding/milestone/report/form7/{{funding.id}}\" target=\"_blank\">Маягт7 </a>"
            }
            if (sessionStorage.getItem("buttonData").includes("read") && $rootScope.isMof($scope.user)) {
                template += "<button class='md-btn custom-secondary-btn' type='button' ng-click='mayagt3(\"excel2\")'>Маягт 3</button>";
                template += "<button class='md-btn custom-secondary-btn' type='button' ng-click='excelExport(\"excelNegtgelFilter\")'>Нэгтгэл эксел</button>";
            }
            if ($rootScope.isAdmin($scope.user)) {
                template += "<button class='md-btn custom-secondary-btn' type='button' ng-click='mayagt3(\"excel2\")'>Маягт 3</button>";
                // template += "<button class='md-btn custom-secondary-btn' type='button' ng-click='excelExport2(\"negtgel-excel2\")'>Нэгтгэл эксел</button>";
            }
            if ((sessionStorage.getItem("buttonData").includes("read") && ["filter1006Eval"].includes($scope.filterKey)) ||
                (sessionStorage.getItem("buttonData").includes("select") && ["filter1005"].includes($scope.filterKey)) ||
                (sessionStorage.getItem("buttonData").includes("select") && ["filterNegtgel"].includes($scope.filterKey))) {
                template += "<button class='md-btn custom-btn' type='button' ng-click='massSend()'><span class='uk-icon-paper-plane mr-1' style='color: white; font-size: 15px; line-height: 30px;'></span>Бүгдийг Илгээх</button>";
            }
            $scope.mainGrid.toolbar = [{template: template}];
            if ($scope.filterKey != "filter1007NextStep" && !$rootScope.isMof($scope.user)) {
                $scope.mainGrid.toolbar.push("excel");
            }
            if ($scope.filterKey == 'filter1009-2') {
                $scope.mainGrid.toolbar.push({template: "<span class='text-red-500 font-bold text-xl'>Олон жил хэрэгжиж буй төслийн хамгийн сүүлд батлагдсан оноор сонгож шилжүүлнэ үү.</span>"});
            }
            if ($scope.filterKey === "filter1005") {
                mainService.withdomain('get', '/api/nms/governor/limit/info').then(function (data) {
                    $scope.governorLimit = data.limitCalc;
                });
                if (sessionStorage.getItem("buttonData").includes("select")) {
                    $scope.mainGrid.toolbar.push({
                        template: '<div class="ml-auto">Төслийн санал авах хязгаар: <span class="text-red-500 ml-1">{{(amountSum || 0) | number:2}} / {{(governorLimit || 0) | number:2}} сая.төг ₮</span></div>'
                    });
                    $scope.mainGrid.toolbar.unshift({
                        template: '<button class="grid-btn" ng-click=\'toggle1010(1)\'><i class="material-icons">keyboard_double_arrow_right</i></button>'
                    });
                }
            }
            if ($scope.filterKey === 'filter1011') {
                if ($rootScope.isMof($scope.user)) {
                    $scope.mainGrid.toolbar.push({
                        template: '<div class="ml-auto">' +
                            '<button class="md-btn custom-secondary-btn" ng-click=\'getLawForm()\'>Хууль хэлбэрээр татах</button>' +
                            '<button class="md-btn custom-secondary-btn" ng-click=\'alterCentralTez()\'>Төвлөрүүлэн захирагч тохируулах</button>' +
                            '<button class="md-btn custom-btn" ng-click=\'regenerateLawNo()\'>Хуулийн дугаар дахин авах</button>' +
                            // '<button ng-if="!reordering" class="md-btn custom-btn" ng-click=\'reorder(1)\'>Эрэмбэ өөрчлөх</button>' +
                            // '<button ng-if="reordering" class="md-btn custom-btn" ng-click=\'reorder(2)\'>Эрэмбэ хадгалах</button>' +
                            // '<button ng-if="reordering" class="md-btn" ng-click=\'reorder(0)\'>Болих</button>' +
                            '</div>'
                    });
                }
            }
            if ($scope.filterKey === 'filterNegtgel') {
                if (sessionStorage.getItem("buttonData").includes("select")) {
                    $scope.mainGrid.toolbar.unshift({
                        template: '<button class="grid-btn" ng-click=\'toggleNegtgel(1)\'><i class="material-icons">keyboard_double_arrow_right</i></button>'
                    });
                }
            }
            if ($scope.canCreateBatch) {
                // $scope.mainGrid.toolbar.push({ template: '<div class="ml-auto text-xs"><label for="secretSwitch" class="inline-label" ng-bind="\'Багцаар харах\'" style="display: inline-block">Label</label>\n' +
                //       '                <input class="switchery switchery-small" type="checkbox" id="secretSwitch" ui-switch\n' +
                //       '                       ng-change="batchSearchChanged()" ng-model="filterByBatch" parse-int ng-true-value="1" ng-false-value="0" />\n' +
                //       '                <label for="secretSwitch" class="inline-label" ng-bind="\'Дэлгэрэнгүй харах\'" style="display: inline-block">Label</label></div>'});
                $scope.mainGrid.toolbar.push({
                    template: '<div class="ml-auto text-xs">' +
                        '<button ng-click="batchSearchChanged(3)" ng-class="filterByBatch == 3 ? \'bg-active text-white\' : \'bg-white\'" class="border-gray-200 cursor-pointer border-solid rounded-l-lg border-y border-l px-4 py-2" type="button">Багц биш</button>' +
                        '<button ng-click="batchSearchChanged(1)" ng-class="filterByBatch == 1 ? \'bg-active text-white\' : \'bg-white\'" class="border-gray-200 cursor-pointer border-solid border-y px-4 py-2 border-x-0" type="button">Бүгд</button>' +
                        '<button ng-click="batchSearchChanged(0)" ng-class="filterByBatch == 0 ? \'bg-active text-white\' : \'bg-white\'" class="border-gray-200 cursor-pointer border-solid border-y px-4 py-2" type="button">Багц</button>' +
                        '<button ng-click="batchSearchChanged(2)" ng-class="filterByBatch == 2 ? \'bg-active text-white\' : \'bg-white\'" class="border-gray-200 cursor-pointer border-solid rounded-r-lg border-y border-r border-l-0 px-4 py-2" type="button">Дэд</button>' +
                        '</div>'
                });
            }
            if ($scope.filterKey === "filter1010" && sessionStorage.getItem("buttonData").includes("select")) {
                $scope.mainGrid.toolbar.push({
                    template: '<button class="grid-btn ml-auto" ng-click=\'select("select", false)\'><i class="material-icons">keyboard_arrow_right</i>Сонгох</button>' +
                        '<button class="grid-btn" ng-click=\'toggle1010(-1)\'><i class="material-icons">keyboard_double_arrow_left</i></button>'
                });
            }
            if ($scope.filterKey === "filterNegtgelUnselected" && sessionStorage.getItem("buttonData").includes("select")) {
                $scope.mainGrid.toolbar.push({
                    template: '<button class="grid-btn ml-auto" ng-click=\'select("select-negtgel", false)\'><i class="material-icons">keyboard_arrow_right</i>Сонгох</button>' +
                        '<button class="grid-btn" ng-click=\'toggleNegtgel(-1)\'><i class="material-icons">keyboard_double_arrow_left</i></button>'
                });
            }
            $scope.mainGrid.excel = {allPages: true};
            if (sessionStorage.getItem("buttonData").includes("read")) {
                $scope.mainGrid.columns.push({
                    command: [
                        {
                            template: '<button class="grid-btn" ng-click=\'gotoDetail(dataItem)\'><div class="nimis-icon see "></div>Харах</button>',
                        },
                    ],
                    title: "&nbsp;",
                    sticky: true,
                    width: 80,
                });
            }
            if (sessionStorage.getItem("buttonData").includes("transfer") && $scope.filterKey.startsWith("filter1009")) {
                $scope.mainGrid.columns.push({
                    command: [
                        {
                            template: '<button class="grid-btn" ng-click=\'transfer(dataItem)\'>Шилжүүлэх</button>',
                        },
                    ],
                    title: "&nbsp;",
                    sticky: true,
                    width: 100,
                });
            }
            if (sessionStorage.getItem("buttonData").includes("select") &&
                ["filter1005", "filter1010"].includes($scope.filterKey)
            ) {
                $scope.mainGrid.columns.push({
                    command: [
                        {
                            template: $scope.filterKey === "filter1010" ?
                                '<button class="grid-btn" ng-click=\'select("select", dataItem)\'><i class="material-icons">keyboard_arrow_right</i>Сонгох</button>'
                                : '<button class="grid-btn" ng-if="stepIsTez(dataItem)" ng-click=\'select("de-select", dataItem)\'><i class="material-icons">keyboard_arrow_left</i>Хасах</button>',
                        },
                    ],
                    title: "&nbsp;",
                    sticky: true,
                    width: 100,
                });
            }
            if (sessionStorage.getItem("buttonData").includes("select") &&
                ["filterNegtgel", "filterNegtgelUnselected"].includes($scope.filterKey)
            ) {
                $scope.mainGrid.columns.push({
                    command: [
                        {
                            template: $scope.filterKey === "filterNegtgelUnselected" ?
                                '<button class="grid-btn" ng-click=\'select("select-negtgel", dataItem)\'><i class="material-icons">keyboard_arrow_right</i>Сонгох</button>'
                                : '<button class="grid-btn" ng-click=\'select("de-select-negtgel", dataItem)\'><i class="material-icons">keyboard_arrow_left</i>Хасах</button>',
                        },
                    ],
                    title: "&nbsp;",
                    sticky: true,
                    width: 100,
                });
            }
            if (["filter1011"].includes($scope.filterKey)) {
                $scope.mainGrid.columns.push({
                    command: [
                        {
                            template: '<button class="grid-btn" ng-click=\'revert(dataItem.id, 362)\'><i class="material-icons">keyboard_arrow_left</i>Хасах</button>',
                        },
                    ],
                    title: "&nbsp;",
                    sticky: true,
                    width: 100,
                });
            }
            let editDeleteTemplate = '<div class="flex gap-3" ng-if="showEditDelete(dataItem)">';
            if (sessionStorage.getItem("buttonData").includes("edit")) {
                editDeleteTemplate += '<a class="grid-btn k-grid-edit" ng-click=\'editItem(dataItem)\'><div class="nimis-icon edit"></div></a>';
            } else {
                editDeleteTemplate += '<span style="width: 24px"></span>';
            }
            if (sessionStorage.getItem("buttonData").includes("delete")) {
                editDeleteTemplate += '<a class="grid-btn k-grid-remove-command" ng-if="showDeleteButton(dataItem)" ng-click=\'deleteItem(dataItem)\'><div class="nimis-icon delete"></div></a>';
            }
            if (sessionStorage.getItem("buttonData").includes("edit") || sessionStorage.getItem("buttonData").includes("delete")) {
                $scope.mainGrid.columns.push({
                    command: [{template: editDeleteTemplate + "</div>"}],
                    title: "&nbsp;",
                    sticky: true,
                    width: 100,
                });
            }
        };
        $scope.showEditDelete = function (dataItem) {
            if ($scope.filterKey.startsWith('filter1009')) {
                return true;
            }
            if ((dataItem.stepId == null || dataItem.stepOrderId === 1) && (
                dataItem.createdBy == $scope.user.id ||
                $scope.user.userType?.comCd === 'sysAdmin' ||
                dataItem.fromOld)) {
                return true;
            }
            if (dataItem.stepCode == "aimag" && $rootScope.isAmg($scope.user)) {
                return true;
            }
            return false;
        };
        $scope.showDeleteButton = function (dataItem) {
            if (dataItem.fromOld) {
                return $scope.user.userType?.comCd === 'sysAdmin' || $rootScope.isAmg($scope.user);
            }
            return dataItem.status != "RETURNED";
        };

        $scope.addFilter = function (title, columnValue, aggregates, savedFilters = []) {
            if (!(columnValue in aggregates)) {
                return [];
            }
            var data = aggregates[columnValue].aggregations.asMap[columnValue].buckets;
            var filterValues = [];
            var currentFilters = [];
            if (savedFilters) {
                var currentValues = savedFilters.filter(function (i) {
                    return i.filters && i.filters[0].field === columnValue;
                });

                if (currentValues.length > 0) {
                    currentFilters = currentValues[0].filters;
                }
            }

            let totalChecked = true;
            let others = undefined;
            for (var i = 0; i < data.length; i++) {
                var checked =
                    currentFilters.filter(function (j) {
                        return j.value == data[i].key;
                    }).length > 0;
                if (checked) {
                    totalChecked = false;
                }
                var filterItem = {
                    name: columnValue,
                    title: data[i].key,
                    count: data[i].docCount,
                    checked: checked,
                };
                if (data[i].key !== "Бусад") {
                    filterValues.push(filterItem);
                } else {
                    others = filterItem;
                }
            }
            if (others !== undefined) {
                filterValues.push(others);
            }
            if (filterValues.length > 0) {
                $scope.filters.push({
                    title: title,
                    data: filterValues,
                    totalChecked: totalChecked,
                    showAll: false,
                    type: "select",
                    scroll: ["sumName", "bagName"].includes(columnValue)
                });
            }
        };
        $scope.isAll = false;
        $scope.showAll = function (index) {
            if ($scope.filters[index].showAll) {
                $("#scrollContainer").css({maxHeight: "200px"});
                $scope.filters[index].showAll = false;
            } else {
                $("#scrollContainer").css({maxHeight: "none"});
                $scope.filters[index].showAll = true;
            }
        };
        $scope.checkAll = function (index) {
            $scope.filters[index].data.map(function (i) {
                i.checked = false;
            });
            $timeout(function () {
                $scope.filters[index].totalChecked = true;
            });
            let filterRequest = $scope.getByFilterKey();
            let filterList = filterRequest?.filter.filters || [];
            if (filterList) {
                let fieldName = $scope.filters[index].data[0].name;
                filterList = filterList.filter(function (i) {
                    return i.filters && i.filters[0].field !== fieldName;
                });
                filterRequest.filter.filters = filterList;
                sessionStorage.setItem($scope.filterKey, JSON.stringify(filterRequest));
                $scope.init();
            }
        };
        $scope.uncheckAll = function (index) {
            $timeout(function () {
                $scope.filters[index].totalChecked = false;
            });
        };
        $scope.checkChange = function (item, index) {
            $scope.uncheckAll(index);
            let filterRequest = $scope.getByFilterKey();
            let filterList = filterRequest?.filter.filters || [];

            if (filterList) {
                let columnFilter = filterList.filter(function (i) {
                    return i.filters && i.filters[0].field === item.name;
                });
                columnFilter = columnFilter.length > 0 ? columnFilter[0].filters : [];
                if (columnFilter.length > 0) {
                    let updatedFilter = columnFilter;
                    if (item.checked) {
                        updatedFilter.push({
                            field: item.name,
                            value: item.title,
                            operator: "eq",
                        });
                    } else {
                        updatedFilter = updatedFilter.filter(function (i) {
                            return i.value !== item.title;
                        });
                    }
                    filterList = filterList.filter(function (i) {
                        return i.filters[0].field !== item.name;
                    });
                    if (updatedFilter.length > 0) {
                        filterList.push({filters: updatedFilter, logic: "or"});
                    } else {
                        filterList = filterList.filter(function (i) {
                            return i.filters !== columnFilter;
                        });
                    }
                } else {
                    if (item.checked) {
                        filterList.push({
                            filters: [
                                {
                                    field: item.name,
                                    value: item.title,
                                    operator: "eq",
                                },
                            ],
                            logic: "or",
                        });
                    }
                }
                filterRequest.filter.filters = filterList;
                sessionStorage.setItem($scope.filterKey, JSON.stringify(filterRequest));
            } else {
                if (item.checked) {
                    sessionStorage.setItem(
                        $scope.filterKey,
                        JSON.stringify([
                            {
                                logic: "or",
                                filters: [{field: item.name, value: item.title, operator: "eq"}],
                            },
                        ])
                    );
                }
            }
            $scope.init();
        };
        $scope.clearFilter = function () {
            sessionStorage.removeItem($scope.filterKey);
            $scope.search.searchNameValue2 = "";
            $scope.init();
        };

        $scope.deleteItem = function (item) {
            sweet.show(
                {
                    title: "Устгах",
                    text: "Та энэ төслийг устгахдаа итгэлтэй байна уу?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#475569",
                    confirmButtonText: "Тийм",
                    cancelButtonText: "Үгүй",
                    closeOnConfirm: true,
                    closeOnCancel: true,
                },
                function (inputvalue) {
                    if (inputvalue) {
                        mainService.withdata("delete", __env.apiUrl() + "/api/nms/app/main/" + item.id).then(function (data) {
                            $scope.init();
                        });
                    }
                }
            );
        };

        var isMassSending = false;
        $scope.massSend = function () {
            if (isMassSending) {
                return;
            }
            isMassSending = true;
            UIkit.modal("#modal_loader_mass_send").show();
            mainService.withResponse("post", __env.apiUrl() + "/api/nms/es/app/filter/mass-send", $scope.getFilterRequest() || {
                filter: {
                    logic: "and",
                    filters: [],
                },
                sort: [{field: "updatedAt", dir: "desc"}],
            }).then(function (resp) {
                isMassSending = false;
                $scope.init();
                UIkit.modal("#modal_loader_mass_send").hide();
                if (resp.status != 200) {
                    sweet.show('Анхаар!', resp.data.msg, 'error');
                } else {
                    sweet.show('Анхаар!', resp.data.msg, 'success');
                    // $rootScope.alert(true, "Амжилттай илгээлээ.");
                    // $rootScope.$broadcast("refreshNextStep");
                }
            });
        };
        $rootScope.$on("refreshNextStep", function (event, args) {
            console.log($scope.filterKey);
            if ($scope.filterKey.contains("NextStep")) {
                $scope.init();
            }
        });
        $rootScope.$on("refreshDataSource", function (event, args) {
            if ($scope.filterKey === args) {
                $scope.init();
            }
        });


    },
]);
