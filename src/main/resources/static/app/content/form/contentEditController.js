angular
    .module('altairApp')
    .controller(
        'contentEditCtrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$timeout',
            'mainService',
            'fileUpload',
            'commonDataSource',
            '__env',
            function ($rootScope, $state, $scope, $timeout,mainService,fileUpload,commonDataSource, __env) {
                $scope.user = JSON.parse(sessionStorage.getItem('currentUser'));
                $scope.success=false;
                $scope.show4=true;
                $scope.planYr=sessionStorage.getItem('planYr');
                $scope.$on("editContent", function (event, step,data) {
                    UIkit.modal('#modal_loader').hide();
                    UIkit.modal('#modal_loader_edit').hide();
                    $("#modal_loader").hide();
                    $("#modal_loader_edit").hide();
                    $scope.cnt = data;
                    $timeout(function (){
                        $(".lightgallery").each(function () {
                            $(this).lightGallery({
                                selector: '.item'
                            });
                        });
                    },100);
                    var imagenUrl = undefined;
                    try {
                        imagenUrl = $scope.cnt.image.location;
                    } catch (exce) {}
                    if (imagenUrl == undefined) {
                        $('.dropify').dropify({
                            messages: {
                                default: 'Зургаа сонгоно уу',
                                replace: 'Солих',
                                remove: 'Болих',
                                error: 'Алдаа үүслээ'
                            }
                        });
                    } else {
                        var drEvent = $('.dropify').dropify({
                            messages: {
                                defaultFile: imagenUrl,
                                default: 'Зургаа сонгоно уу',
                                replace: 'Солих',
                                remove: 'Болих',
                                error: 'Алдаа үүслээ'
                            }
                        });
                        drEvent = drEvent.data('dropify');
                        drEvent.resetPreview();
                        drEvent.clearElement();
                        drEvent.settings.defaultFile = imagenUrl;
                        drEvent.destroy();
                        drEvent.init();
                    }
                });
                $scope.stat = function(step, back) {
                    if (back) {
                        $(".stat-screen").hide();
                        $("#main_content").show();
                    } else {
                        $("#main_content").hide();
                        $("#form"+step).show();
                    }
                    $rootScope.$broadcast("loadBack", 1);
                }

                $scope.notf1Options = {
                    position: {
                        pinned: true,
                        bottom: 25,
                        right: 25
                    },
                    //autoHideAfter: 10,
                    stacking: "up",
                    templates: [{
                        type: "ngTemplate",
                        template: $("#notificationTemplate").html()
                    }]
                };

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
                    dataTextField: "name",
                    dataValueField: "id",
                    placeholder: "Сонгох...",
                    tagMode: "single",
                    valuePrimitive: true,
                    fixedGroupTemplate: "<strong>#:data#</strong>", //`data` is the title of the group
                    autoBind: true
                };

                var filters = [];
                filters.push({
                    field: "grpCd",
                    operator: "eq",
                    value: 'newsType'
                });
                filters.push({
                    field: "parentId",
                    operator: "isNull",
                    value: false
                });

                mainService.withdata("post", __env.apiUrl() + "/api/nms/common/list", {
                    "filter": {
                        "logic": "and",
                        "filters": filters
                    },
                    sort: [{ field: "id", dir: "asc" }],
                    page:1,
                    pageSize:20,
                    skip:0,
                    take:20
                }).then(function(resp) {
                    if(resp.total > 0)
                        $scope.tagDataSource = resp.data;
                });

/*
                $scope.tagDataSource = new kendo.data.HierarchicalDataSource({
                    transport: {
                        read: {
                            url: __env.apiUrl() + "/api/cnt/term/list",
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
//                    group: { field: "termId" },
                    schema: {
                        data: "data",
                        total: "total"
                    },
                    pageSize: 20,
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true
                });
*/

                var filters = [];
                filters.push({
                    field: "grpCd",
                    operator: "eq",
                    value: 'contentType'
                });
                filters.push({
                    field: "parentId",
                    operator: "isNull",
                    value: false
                });

                mainService.withdata("post", __env.apiUrl() + "/api/nms/common/list", {
                    "filter": {
                        "logic": "and",
                        "filters": filters
                    },
                    sort: [{ field: "id", dir: "asc" }],
                    page:1,
                    pageSize:20,
                    skip:0,
                    take:20
                }).then(function(resp) {
                    if(resp.total > 0)
                        $scope.typeDataSource = resp.data;
                });
                // $scope.typeDataSource = commonDataSource.urlDataSource("/api/nms/common/list", JSON.stringify({ "custom": "where grpCd='contentType' and parentId is not null", sort: [{ field: "id", dir: "asc" }] }));

                var filters = [];
                filters.push({
                    field: "grpCd",
                    operator: "eq",
                    value: 'contentStatus'
                });
                filters.push({
                    field: "parentId",
                    operator: "isNull",
                    value: false
                });

                mainService.withdata("post", __env.apiUrl() + "/api/nms/common/list", {
                    "filter": {
                        "logic": "and",
                        "filters": filters
                    },
                    sort: [{ field: "id", dir: "asc" }],
                    page:1,
                    pageSize:20,
                    skip:0,
                    take:20
                }).then(function(resp) {
                    if(resp.total > 0)
                        $scope.statusDataSource = resp.data;
                });

/*
                $scope.statusDataSource = new kendo.data.HierarchicalDataSource({
                    transport: {
                        read: {
                            url: __env.apiUrl() + "/api/nms/common/list",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            data: {
                                filter: {
                                    logic: "and",
                                    filters: [
                                        {field: "parentId", operator: "isNull", value: false},
                                        {field: "grpCd", operator: "eq", value: 'contentStatus'}
                                    ]
                                }
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
*/
                $scope.statusEditor = function (container, options) {
                    var editor = $('<input kendo-drop-down-list  k-data-text-field="\'comCdNm\'" k-data-value-field="\'shortCd\'" k-data-source="statusDataSource" data-bind="value:' + options.field + '"/>')
                        .appendTo(container);
                };


                var filters = [];
                filters.push({
                    field: "grpCd",
                    operator: "eq",
                    value: 'contentVisibility'
                });
                filters.push({
                    field: "parentId",
                    operator: "isNull",
                    value: false
                });

                mainService.withdata("post", __env.apiUrl() + "/api/nms/common/list", {
                    "filter": {
                        "logic": "and",
                        "filters": filters
                    },
                    sort: [{ field: "id", dir: "asc" }],
                    page:1,
                    pageSize:20,
                    skip:0,
                    take:20
                }).then(function(resp) {
                    if(resp.total > 0)
                        $scope.contentVisibilityDataSource = resp.data;
                });

/*
                $scope.contentVisibilityDataSource = new kendo.data.HierarchicalDataSource({
                    transport: {
                        read: {
                            url: __env.apiUrl() + "/api/nms/common/list",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            data: {
                                filter: {
                                    logic: "and",
                                    filters: [
                                        {field: "parentId", operator: "isNull", value: false},
                                        {field: "grpCd", operator: "eq", value: 'contentVisibility'}
                                    ]
                                }
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
*/
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

                $scope.submit = function (event) {
                    var validator = $("#contentForm").kendoValidator().data("kendoValidator");
                    console.log(validator.errors());
                    var recipients = [];
                    if ($scope.cnt.recipients) {
                        for (var i=0; i<$scope.cnt.recipients.length; i++) {
                            recipients.push($scope.cnt.recipients[i].value);
                        }
                    }
                    $scope.cnt.recipient = JSON.stringify(recipients);
                    if (validator.validate()) {
                        event.preventDefault();
                        UIkit.modal('#modal_loader_edit', {
                            modal: false,
                            keyboard: false,
                            bgclose: false,
                            center: true
                        }).show();
                        $scope.cnt.useYn=1;
                        var moreText = $scope.cnt.moreText;
                        /*$scope.cnt.moreText = moreText.replaceAll(/(?<!<a .+>)<img [^/>]+[\/]? src="([^"]+)" [^/>]+[\/]?>/g, '<a class="item" href="$1">$&</a>');
                        if (formDataAttach.has("file")) {
                            fileUpload.uploadFileToUrl(__env.apiUrl() + '/api/image/browser/upload', formDataAttach, {
                                headers: {'Content-Type': undefined}
                            }).then(function (attFile) {
                                $scope.cnt.image = attFile;
                                $scope.postData();
                            });
                        } else {
                            $scope.postData();
                        }*/
                        $scope.postData();
                    } else {
                        console.log("could not validate");
                    }
                };
                $scope.postData = function() {
                    mainService.withdata('post', __env.apiUrl() + '/api/cnt/content/create',$scope.cnt)
                        .then(function (data) {
                            $(".k-grid").data("kendoGrid").dataSource.read();
                            $rootScope.alert(true,"Амжилттай.");
                            $scope.stat(2, true);
//                            UIkit.modal('#modal_loader_edit').hide();
                        }
                    );
                }

                $scope.tinymce_options = {
                    selector: 'textarea',
                    content_css: ["/front/style.min.css", "/front/tiny-mce.css"],
                    height:  $(window).height()*0.4,
                    plugins: [
                        "advlist autolink lists link image charmap print preview anchor",
                        "searchreplace visualblocks code",
                        "insertdatetime media table paste","media","code","textcolor"
                    ],
                    mode: "exact",
                    toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | media | code forecolor backcolor",
                    relative_urls: false,
                    video_template_callback: function(data) {
                        return '<video width="' + data.width + '" height="' + data.height + '"' + (data.poster ? ' poster="' + data.poster + '"' : '') + ' controls="controls">\n' + '<source src="' + data.source + '"' + (data.sourcemime ? ' type="' + data.sourcemime + '"' : '') + ' />\n' + (data.altsource ? '<source src="' + data.altsource + '"' + (data.altsourcemime ? ' type="' + data.altsourcemime + '"' : '') + ' />\n' : '') + '</video>';
                    },
                    file_picker_types: 'image',
                    image_title: true,
                    image_class_list: [
                        {title: 'Энгийн', value: ''},
                        {title: '100% өргөнтэй', value: 'tiny-img'}
                    ],
                    images_upload_url: __env.apiUrl() + "/api/image/browser/upload",
                    menubar:false,
                    statusbar:false,
                    remove_script_host: false
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

                var formDataAttach = new FormData();
                $scope.getTheUFilesAttach = function ($files) {
                    formDataAttach.delete("file");
                    angular.forEach($files, function (value, key) {
                        formDataAttach.append("file", value);
                    });
                };

                var pdfViewer = $("#pdfViewer").kendoPDFViewer({ width: "100%", height: "100%" }).data("kendoPDFViewer");
                $scope.viewFile = function (item){
                    $scope.viewItem = item;
                    if(item.type =='pdf'){
                        pdfViewer.fromFile(item.uri);
                        UIkit.modal("#modal_pdf", {
                            modal: false,
                            keyboard: false,
                            bgclose: false,
                            center: false
                        }).show();
                    }
                };
            }
        ]
    );
