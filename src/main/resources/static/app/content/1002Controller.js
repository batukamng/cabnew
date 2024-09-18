angular
    .module('altairApp')
    .controller(
        '1002CntCtrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$timeout',
            'mainService',
            'sweet',
            'Upload',
            '__env',
            function ($rootScope, $state, $scope, $timeout, mainService,sweet, Upload,__env) {
                $scope.user = JSON.parse(sessionStorage.getItem('currentUser'));

                $scope.typeOptions = {
                    optionLabel: "Select type..."
                };
                $scope.statusOptions = {
                    optionLabel: "Select status..."
                };
                $scope.visibilityOptions = {
                    optionLabel: "Select visibility..."
                };

                $scope.selectPriOptions = {
                    dataTextField: "taxonomy",
                    dataValueField: "id",
                    placeholder: "Select tag...",
                    valuePrimitive: true,
                    autoBind: true,
                    dataSource: {
                        transport: {
                            read: {
                                url: __env.apiUrl() + "/api/cnt/term/taxonomy/data/list",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                }
                            },
                            parameterMap: function (options) {
                                return JSON.stringify(options);
                            }
                        },
                        schema: {
                            data: "data",
                            total: "total"
                        },
                        pageSize: 20,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    }
                };
                $scope.tagEditor = function(container, options) {
                    var editor = $('<select  kendo-multi-select k-options="selectPriOptions" k-data-text-field="\'taxonomy\'" k-data-value-field="\'id\'" data-bind="value:' + options.field + '"></select>')
                        .appendTo(container);
                };

                $scope.ddlDataSource = new kendo.data.HierarchicalDataSource({
                    transport: {
                        read: {
                            url: __env.apiUrl() + "/api/comCd/list",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            data: {
                                "custom":"where grpCd='contentType' and parentId is not null"
                            },
                            sort: [{field: "id", dir: "desc"}],
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            }
                        },
                        parameterMap: function (options) {
                            return JSON.stringify(options);
                        }
                    },
                    schema: {
                        data: "data",
                        total: "total"
                    },
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true
                });
                $scope.typeEditor = function (container, options) {
                    var editor = $('<input kendo-drop-down-list  k-data-text-field="\'comCdNm\'" k-data-value-field="\'shortCd\'" k-data-source="ddlDataSource" data-bind="value:' + options.field + '"/>')
                        .appendTo(container);
                };

                $scope.statusDataSource = new kendo.data.HierarchicalDataSource({
                    transport: {
                        read: {
                            url: __env.apiUrl() + "/api/comCd/list",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            data: {
                                "custom":"where grpCd='contentStatus' and parentId is not null"
                            },
                            sort: [{field: "id", dir: "desc"}],
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            }
                        },
                        parameterMap: function (options) {
                            return JSON.stringify(options);
                        }
                    },
                    schema: {
                        data: "data",
                        total: "total"
                    },
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true
                });
                $scope.statusEditor = function (container, options) {
                    var editor = $('<input kendo-drop-down-list  k-data-text-field="\'comCdNm\'" k-data-value-field="\'shortCd\'" k-data-source="statusDataSource" data-bind="value:' + options.field + '"/>')
                        .appendTo(container);
                };

                $scope.contentVisibilityDataSource = new kendo.data.HierarchicalDataSource({
                    transport: {
                        read: {
                            url: __env.apiUrl() + "/api/comCd/list",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            data: {
                                "custom":"where grpCd='contentVisibility' and parentId is not null"
                            },
                            sort: [{field: "id", dir: "desc"}],
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                            }
                        },
                        parameterMap: function (options) {
                            return JSON.stringify(options);
                        }
                    },
                    schema: {
                        data: "data",
                        total: "total"
                    },
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true
                });
                $scope.visibilityEditor = function (container, options) {
                    var editor = $('<input kendo-drop-down-list  k-data-text-field="\'comCdNm\'" k-data-value-field="\'shortCd\'" k-data-source="contentVisibilityDataSource" data-bind="value:' + options.field + '"/>')
                        .appendTo(container);
                };

                $scope.sendBtn = false;
                $scope.up = true;
                $scope.updateContent=function(item){
                    UIkit.modal("#modal_file", {modal: false, keyboard: false, bgclose: false, center: false}).show();
                    $scope.sendBtn = true;
                    $scope.up = false;
                    $scope.cnt = item;
                };
                $scope.fileUpload = function(){
                    UIkit.modal("#modal_file", {modal: false, keyboard: false, bgclose: false, center: false}).show();
                    $scope.sendBtn = true;
                    $scope.up = true;
                    $scope.cnt = {};
                };

                $scope.submitUploadFormFile = function (event) {
                    event.preventDefault();
                    if ($scope.validator.validate()) {
                        if ($scope.formFile.afl.$valid && $scope.afl && $scope.formFile.thumb.$valid && $scope.thumb) {
                            Upload.upload({
                                url: '/api/cnt/content/file',
                                data: {"files": $scope.afl,"thumb": $scope.thumb,"data":JSON.stringify($scope.cnt),"metas":JSON.stringify($scope.form_dynamic_model)}
                            }).then(function (resp) {
                                sweet.show('Анхаар!', 'Амжилттай хадгаллаа.', 'success');
                                UIkit.modal("#modal_file").hide();
                                $(".k-grid").data("kendoGrid").dataSource.read();
                            });
                        }
                    }
                };

                $scope.editorOptions = {
                    tools: [
                        "bold",
                        "italic",
                        "underline",
                        "strikethrough",
                        "justifyLeft",
                        "justifyCenter",
                        "justifyRight",
                        "justifyFull",
                        "insertUnorderedList",
                        "insertOrderedList",
                        "indent",
                        "outdent",
                        "createLink",
                        "unlink",
                        "insertImage",
                        "insertFile",
                        "subscript",
                        "superscript",
                        "tableWizard",
                        "createTable",
                        "addRowAbove",
                        "addRowBelow",
                        "addColumnLeft",
                        "addColumnRight",
                        "deleteRow",
                        "deleteColumn",
                        "mergeCellsHorizontally",
                        "mergeCellsVertically",
                        "splitCellHorizontally",
                        "splitCellVertically",
                        "viewHtml",
                        "formatting",
                        "cleanFormatting",
                        "copyFormat",
                        "applyFormat",
                        "fontName",
                        "fontSize",
                        "foreColor",
                        "backColor",
                        "print"
                    ],
                    imageBrowser: {
                        messages: {
                            dropFilesHere: "Drop files here"
                        },
                        transport: {
                            read: {
                                url:__env.apiUrl() + "/api/image/browser/read",
                                dataType: "json",
                                type: "POST"
                            },
                            destroy: {
                                url:  "/api/image/browser/destroy",
                                type: "POST"
                            },
                            create:  __env.apiUrl() + "/api/image/browser/create",
                            thumbnailUrl: __env.apiUrl() + "/api/image/browser/thumbnail",
                            uploadUrl: __env.apiUrl() + "/api/image/browser/upload",
                            imageUrl: __env.apiUrl() + "/api/image/browser/image?path={0}"
                        },
                        path:"/upload-dir/editor/"
                    },

                    fileBrowser: {
                        messages: {
                            dropFilesHere: "Drop files here"
                        },
                        transport: {
                            read: {
                                url:__env.apiUrl() + "/api/file/browser/read",
                                dataType: "json",
                                type: "POST"
                            },
                            destroy: {
                                url:  __env.apiUrl() + "/api/file/browser/destroy",
                                type: "POST"
                            },
                            create: {
                                url:  __env.apiUrl() + "/api/file/browser/create",
                                type: "POST"
                            },
                            uploadUrl:  __env.apiUrl() + "/api/file/browser/upload",
                            fileUrl:  __env.apiUrl() + "/api/image/browser/file?fileName={0}"
                        },
                        path:"/upload-dir/editor/"
                    }
                };

                $scope.form_template = [
                    [
                        {
                            'type': 'text',
                            'name': 'key',
                            'value': 'a',
                            'label': 'Meta key'
                        },
                        {
                            'type': 'text',
                            'name': 'value',
                            'label': 'Value'
                        }
                    ]
                ];

                $scope.form_dynamic = [];
                $scope.form_dynamic.push($scope.form_template);

                $scope.form_dynamic_model = [];

                $scope.cloneSection = function($event,$index) {
                    $event.preventDefault();
                    $scope.form_dynamic.push($scope.form_template);
                };
                // delete section
                $scope.deleteSection = function($event,$index) {
                    $event.preventDefault();
                    $scope.form_dynamic_model.splice($index,1);
                    $scope.form_dynamic.splice($index,1);
                };

                $scope.mainGrid = {
                    dataSource: {
                        transport: {
                            read: {
                                url: function (e) {
                                    if (sessionStorage.getItem("buttonData").includes("read") && JSON.parse(sessionStorage.getItem('menuData')).url === $state.current.name) {
                                        return __env.apiUrl() + "/api/cnt/content/list";
                                    } else {
                                        sessionStorage.removeItem('currentUser');
                                        sessionStorage.removeItem('menuList');
                                        sessionStorage.removeItem('menuData');
                                        $state.go('login');
                                    }
                                },
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                data: {"sort": [{field: 'id', dir: 'desc'}]},
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                }
                            },
                            create: {
                                url: __env.apiUrl() + "/api/cnt/content/create",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                },
                                complete: function (e) {
                                    $(".k-grid").data("kendoGrid").dataSource.read();
                                }
                            },
                            update: {
                                url: __env.apiUrl() + "/api/cnt/content/update",
                                contentType: "application/json; charset=UTF-8",
                                type: "PUT",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                },
                                complete: function (e) {
                                    $(".k-grid").data("kendoGrid").dataSource.read();
                                }
                            },
                            destroy: {
                                url: __env.apiUrl() + "/api/cnt/content/delete",
                                contentType: "application/json; charset=UTF-8",
                                type: "DELETE",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                }
                            },
                            parameterMap: function (options) {
                                return JSON.stringify(options);
                            }
                        },
                        schema: {
                            data: "data",
                            total: "total",
                            model: {
                                id: "id",
                                fields: {
                                    id: {editable: false, nullable: true},
                                    title: {type: "string", validation: {required: true}},
                                    type: {type: "string"},
                                    status: {type: "string"},
                                    visibility: {type: "string"},
                                    slug: {type: "string"},
                                    regId: {type: "number"},
                                    useYn: {type: "boolean"},
                                    cntTermTaxonomies: {defaultValue:[]}
                                }
                            }
                        },
                        pageSize: 20,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    },
                    excel: {
                        allPages: true
                    },
                    sortable: true,
                    resizable: true,
                    pageable: {
                        refresh: true,
                        pageSizes: true,
                        buttonCount: 5
                    },
                    columns: [
                        {
                            title: "Д/д",
                            headerAttributes: {"class": "columnHeader"},
                            template: "<span class='row-number'></span>",
                            width: 50
                        },
                        {
                            field: "title",
                            filterable: {
                                operators: {
                                    string: {
                                        eq: "Тэнцүү",
                                        gte: "Их буюу тэнцүү",
                                        lte: "Бага буюу тэнцүү"
                                    }
                                }
                            },
                            title: "Title",
                            headerAttributes: {style: "text-align: center; font-weight: bold"}
                        },
                        {
                            field: "slug",
                            filterable: {
                                operators: {
                                    string: {
                                        eq: "Тэнцүү",
                                        gte: "Их буюу тэнцүү",
                                        lte: "Бага буюу тэнцүү"
                                    }
                                }
                            },
                            title: "Slug",
                            headerAttributes: {style: "text-align: center; font-weight: bold"}
                        },
                        {
                            field: "type",
                            editor:$scope.typeEditor,
                            filterable: {
                                operators: {
                                    string: {
                                        eq: "Тэнцүү",
                                        gte: "Их буюу тэнцүү",
                                        lte: "Бага буюу тэнцүү"
                                    }
                                }
                            },
                            title: "Type",
                            headerAttributes: {style: "text-align: center; font-weight: bold"}
                        },
                        {
                            field: "status",
                            editor:$scope.statusEditor,
                            filterable: {cell: {operator: "contains"}},
                            title: "Status",
                            headerAttributes: {style: "text-align: center; font-weight: bold"}
                        },
                        {
                            field: "visibility",
                            editor:$scope.visibilityEditor,
                            title: "Visibility",
                            filterable: {
                                cell: {
                                    operator: "contains",
                                    suggestionOperator: "contains"
                                }
                            },
                            headerAttributes: {style: "text-align: center; font-weight: bold"}
                        },
                        /*{field: "cntTermTaxonomies", width:200, editor:$scope.tagEditor,  filterable:false,  template:"#for (var i=0,len=cntTermTaxonomies.length; i<len; i++){#<span>${ cntTermTaxonomies[i].taxonomy } #if(i!=cntTermTaxonomies.length-1){#<span>,</span>#}# </span> # } #", title: "Tag"},*/
                    ],
                    dataBound: function () {
                        var rows = this.items();
                        $(rows).each(function () {
                            var index = $(this).index() + 1
                                + ($(".k-grid").data("kendoGrid").dataSource.pageSize() * ($(".k-grid").data("kendoGrid").dataSource.page() - 1));
                            var rowLabel = $(this).find(".row-number");
                            $(rowLabel).html(index);
                        });
                    },
                    editable: "inline",
                    height: function () {
                        return $(window).height() - 110;
                    }
                };

                if (JSON.parse(sessionStorage.getItem('privilege')) != null) {
                    var privileges = JSON.parse(sessionStorage.getItem('privilege'));
                    angular.forEach(privileges, function (value, key) {
                        if (value.name === 'READ') {
                            $scope.mainGrid.toolbar = [{template: $("#Radd").html()},"search"];
                        }
                        if (value.name === 'UPDATE') {
                            $scope.mainGrid.columns.push({
                                command: [
                                    {
                                        template: "<span class='k-button' ng-click='updateContent(dataItem)'><span class=\"k-icon k-i-edit\"></span></span>"
                                    },
                                    {name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn"}
                                ], title: "&nbsp;", width: 100
                            });
                        }
                    });
                }

                if(sessionStorage.getItem('buttonData').includes("R")){
                    $scope.mainGrid.toolbar = ["excel","search"];
                }
                if(sessionStorage.getItem('buttonData').includes("C")){
                    $scope.mainGrid.toolbar = [{template:"<button class=\"k-button k-button-icontext k-grid-add\"><span class=\"k-icon k-i-plus\"></span>Нэмэх</button>"},"search"];
                }
                if(sessionStorage.getItem('buttonData').includes("U")){
                    $scope.mainGrid.columns.push({
                        command: [
                            {name: "edit", text: {edit: " ", update: " ", cancel: " "}},
                            {name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn"}
                        ], title: "&nbsp;", width: 100
                    });
                }
            }
        ]
    );
