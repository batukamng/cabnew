angular
    .module('altairApp')
    .controller(
        'emailCtrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$timeout',
            '__env',
            'sweet',
            'mainService',
            'commonDataSource',
            function ($rootScope, $state, $scope, $timeout, __env, sweet, mainService, commonDataSource) {


                $scope.supplierDataSource = commonDataSource.urlDataSource("/api/org/list", JSON.stringify({ "custom": "where useYn=true and email is not null", sort: [{ field: "id", dir: "asc" }] }));

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
                        // "unlink",
                        // "insertImage",
                        // "insertFile",
                        // "subscript",
                        // "superscript",
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
                        "fontName",
                        "fontSize",
                        "formatting",
                        // "cleanFormatting",
                        // "copyFormat",
                        // "applyFormat",
                        "foreColor",
                        "backColor",

                    ],
                    imageBrowser: {
                        messages: {
                            dropFilesHere: "Drop files here"
                        },
                        transport: {
                            read: {
                                url: __env.apiUrl() + "/api/image/browser/read",
                                dataType: "json",
                                type: "POST"
                            },
                            destroy: {
                                url: "/api/image/browser/destroy",
                                type: "POST"
                            },
                            create: __env.apiUrl() + "/api/image/browser/create",
                            thumbnailUrl: __env.apiUrl() + "/api/image/browser/thumbnail",
                            uploadUrl: __env.apiUrl() + "/api/image/browser/upload",
                            imageUrl: __env.apiUrl() + "/api/image/browser/image?path={0}"
                        },
                        path: "/upload-dir/editor/"
                    },

                    fileBrowser: {
                        messages: {
                            dropFilesHere: "Drop files here"
                        },
                        transport: {
                            read: {
                                url: __env.apiUrl() + "/api/file/browser/read",
                                dataType: "json",
                                type: "POST"
                            },
                            destroy: {
                                url: __env.apiUrl() + "/api/file/browser/destroy",
                                type: "POST"
                            },
                            create: {
                                url: __env.apiUrl() + "/api/file/browser/create",
                                type: "POST"
                            },
                            uploadUrl: __env.apiUrl() + "/api/file/browser/upload",
                            fileUrl: __env.apiUrl() + "/api/image/browser/file?fileName={0}"
                        },
                        path: "/upload-dir/editor/"
                    }
                };



                $scope.createEmail = function () {
                    $scope.mail = {};
                    $scope.mail.body = '<div>Оройн мэнд</div><div style="justify-content: space-between;">аааа</div>';
                    $scope.mail.body = $scope.mail.body;// + ' ' + $scope.deliveryButton;
                    UIkit.modal('#modal_email', {
                        modal: false,
                        keyboard: false,
                        bgclose: false,
                        center: true
                    }).show();
                };
                // $scope.mail={};

                $scope.changeReceive = function () {
                    console.log($scope.mail.receiveAccept);
                    $scope.deliveryButton = '<div style="padding:30px 5px 10px 5px"><a style="background-color:#11256C;color:#fff;border:0;padding:10px;border-radius:5px;text-decoration: none;" onclick="">Хүлээн авсан</a></div>';
                    if ($scope.mail.receiveAccept)
                        $scope.mail.body = $scope.mail.body + $scope.deliveryButton;
                    else {
                        var aa = $scope.mail.body;
                        $scope.mail.body = aa.replaceAll($scope.deliveryButton, "");
                    }

                }

                $scope.submitEmail = function (event) {
                    event.preventDefault();
                    if ($scope.validatorProject.validate()) {
                        $scope.mail.useYn = true;
                        // $scope.mail.userType = 1;
                        var aa = $scope.mail.body;
                        $scope.mail.body = aa.replaceAll($scope.deliveryButton, "");
                        $scope.mail.attFiles = $scope.attFiles;
                        UIkit.modal('#modal_loader_email', {
                            modal: false,
                            keyboard: false,
                            bgclose: false,
                            center: true
                        }).show();
                        mainService.withdata('post', __env.apiUrl() + '/api/email/create', $scope.mail)
                            .then(function (data) {
                                UIkit.modal('#modal_loader_email').hide();
                                sweet.show('Мэдэгдэл!', 'Имэйл амжилттай илгээлээ!!!', 'success');
                                UIkit.modal('#modal_email').hide();
                                $("#appData").data("kendoGrid").dataSource.read();
                            }
                            );
                    }
                    else {
                        sweet.show('Анхаар!', 'Бүх талбараа бөглөнө үү!!!', 'error');
                    }
                }

                $scope.resend = function (item) {
                    UIkit.modal('#modal_loader_email', {
                        modal: false,
                        keyboard: false,
                        bgclose: false,
                        center: true
                    }).show();
                    mainService.withResponse('get', __env.apiUrl() + '/api/email/send/' + item.id)
                        .then(function (data) {
                            UIkit.modal('#modal_loader_email').hide();
                            sweet.show('Мэдэгдэл!', 'Имэйл амжилттай илгээлээ!!!', 'success');
                            UIkit.modal('#modal_email').hide();
                            $("#appData").data("kendoGrid").dataSource.read();
                        }
                        );
                }

                $scope.onRemove = function (e) {
                    console.log(e.files[0].name);
                    angular.forEach($scope.attFiles, function (value, key) {
                        console.log(value);
                        if (value.name == e.files[0].name) {
                            // value.id 
                            // item = $scope.attFiles[index]
                            mainService.withResponse('get', __env.apiUrl() + '/api/file/delete/' + value.id)
                                .then(function (data) {
                                    if (data.status === 200) {
                                        $scope.attFiles.splice(key, 1);
                                        sweet.show('Амжилттай!', 'Файл устгалаа!!!');
                                    }
                                    else {
                                        sweet.show('Анхаар!', 'Алдаа гарлаа', 'error');
                                    }
                                }
                                );
                        }
                    });


                }
                $scope.attFiles = [];
                $scope.onSelect = function (e) {
                    if (e.operation == "upload") {
                        console.log("upload");
                    } else {
                        console.log("delete");
                    }
                    $scope.createLink = e.response;
                    $scope.file = {};
                    $scope.file.fileId = $scope.createLink.id;
                    $scope.attFiles.push($scope.file);
                }
                $scope.onUpload = function (e) {
                    var xhr = e.XMLHttpRequest;
                    if (xhr) {
                        xhr.addEventListener("readystatechange", function (e) {
                            if (xhr.readyState == 1 /* OPENED */) {
                                xhr.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                            }
                        });
                    }
                }

                function create_UUID() {
                    var dt = new Date().getTime();
                    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = (dt + Math.random() * 16) % 16 | 0;
                        dt = Math.floor(dt / 16);
                        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                    });
                    return uuid;
                }

                $scope.fileAttachmentOptions = {
                    multiple: true,
                    autoUpload: false,
                    showFileList: true,
                    remove: $scope.onRemove,
                    validation: {
                        maxFileSize: 20000000, //20mb (in bytes)  allowedExtensions: ["doc", "txt", "docx", "pdf", "jpg", "jpeg", "png", "xlsx", "xls"],
                    }
                };

                var position = [{ "text": "Дээр", "value": true }, { "text": "Доор", "value": false }];
                $scope.mainGrid = {
                    dataSource: {
                        transport: {
                            read: {
                                url: __env.apiUrl() + "/api/email/list",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                data: { "sort": [{ field: 'id', dir: 'desc' }] },
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                }
                            },
                            create: {
                                url: __env.apiUrl() + "/api/email/create",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                },
                                complete: function (e) {
                                    $(".k-grid").data("kendoGrid").dataSource.read();
                                }
                            },
                            update: {
                                url: __env.apiUrl() + "/api/email/update",
                                contentType: "application/json; charset=UTF-8",
                                type: "PUT",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                },
                                complete: function (e) {
                                    $(".k-grid").data("kendoGrid").dataSource.read();
                                }
                            },
                            destroy: {
                                url: __env.apiUrl() + "/api/email/delete",
                                contentType: "application/json; charset=UTF-8",
                                type: "DELETE",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
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
                                    id: { editable: false, nullable: true },
                                    title: { type: "string" },
                                    body: { type: "string" },
                                    useYn: { type: "boolean" }
                                }
                            }
                        },
                        pageSize: 20,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    },
                    filterable: true,
                    sortable: true,
                    resizable: true,
                    pageable: {
                        pageSizes: ['All', 20, 50],
                        refresh: true,
                        buttonCount: 5,
                        message: {
                            empty: 'No Data',
                            allPages: 'All'
                        }
                    },
                    columns: [
                        {
                            title: '{{"Num" | translate}}',
                            headerAttributes: { "class": "columnHeader" },
                            template: "<span class='row-number'></span>",
                            width: "50px"
                        },
                        { field: "title", headerAttributes: { "class": "columnHeader" }, title: '{{"Гарчиг" | translate}}' },
                        // { field: "body", headerAttributes: { "class": "columnHeader" }, title: '{{"Url" | translate}}', width: "12%" },
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

                if (localStorage.getItem('buttonData').includes("R")) {
                    $scope.mainGrid.toolbar = ["excel", "search"];
                }
                if (localStorage.getItem('buttonData').includes("C")) {
                    $scope.mainGrid.toolbar = [{ template: "<button class=\"k-button k-button-icontext \" ng-click=\"createEmail()\"><span class=\"k-icon k-i-email\"></span>Имэйл үүсгэх</button>" }, "search"];
                }
                if (localStorage.getItem('buttonData').includes("U")) {
                    $scope.mainGrid.columns.push({
                        command: [
                            { template: "<button class=\"k-button k-button-icontext\"  ng-click='resend(dataItem)'><span class=\"k-icon k-i-refresh\"></span></button>" },
                            { name: "edit", text: { edit: " ", update: " ", cancel: " " } },
                            { name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn" }
                        ], title: "&nbsp;", width: 150
                    });
                }

            }
        ]
    );
