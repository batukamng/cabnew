angular
    .module('altairApp')
    .controller(
        'featuredEditCtrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$timeout',
            'featured',
            'mainService',
            'fileUpload',
            'commonDataSource',
            '__env',
            function ($rootScope, $state, $scope, $timeout, featured, mainService, fileUpload,commonDataSource, __env) {
                $scope.user = JSON.parse(sessionStorage.getItem('currentUser'));
                $scope.featured = featured;
                if ($scope.featured.budgetAmount == null) {
                    if ($scope.featured.appId != null) {
                        $scope.featured.budgetAmount = $scope.featured.app.amount;
                    }
                    if ($scope.featured.apprId != null) {
                        $scope.featured.budgetAmount = $scope.featured.appr.amount;
                    }
                }
                $scope.success=false;
                $scope.show4=true;
                $scope.planYr=sessionStorage.getItem('planYr');
                $scope.statusDataSource = commonDataSource.urlDataSource("/api/comCd/list", JSON.stringify({ "custom": "where grpCd='featuredType' and useYn=true and parentId is not null", sort: [{ field: "orderId", dir: "asc" }] }));

                var imagenUrl = undefined;
                try {
                    imagenUrl = $scope.featured.thumbnail.uri;
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

                var drEvent = $('.dropify2').dropify({
                    messages: {
                        defaultFile: imagenUrl,
                        default: 'Зургаа сонгоно уу',
                        replace: 'Солих',
                        remove: 'Болих',
                        error: 'Алдаа үүслээ'
                    }
                });
                $scope.deleteImg = function (index, elementId) {
                    mainService.withdata('delete', __env.apiUrl() + '/api/cnt/featured/file/' + $scope.featured.id + '/delete/' + elementId)
                    .then(function (data) {
                        $scope.featured.gallery.splice(index, 1);
                    });
                }
                var formDataAttach2 = new FormData();
                $scope.getTheUFilesAttach2 = function ($files) {
                    formDataAttach2.delete("file");
                    angular.forEach($files, function (value, key) {
                        formDataAttach2.append("file", value);
                    });
                };
                drEvent.on('dropify.fileReady', function(event, element){
                    if (formDataAttach2.has("file")) {
                        fileUpload.uploadFileToUrl(__env.apiUrl() + '/api/file/uploadFile', formDataAttach2, {
                            headers: {'Content-Type': undefined}
                        }).then(function (resp) {
                            mainService.withdata('post', __env.apiUrl() + '/api/cnt/featured/file/' + $scope.featured.id + '/gallery/create',
                                JSON.stringify({"fileId": resp.id}), {headers: {'Content-Type': undefined}}).then(function (attFile) {
                                $timeout(function() {
                                    $("#galleryAttach .dropify-clear").trigger("click");
                                    $scope.featured.gallery.push(attFile);
                                });
                            });
                        });
                    }
                });

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

                $scope.areaOptions = {
                    maxLength: 3800,
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

                $scope.saveAppMain = function () {
                    var stepOneValidate = $("#stepOne").kendoValidator().data("kendoValidator");
                    if (stepOneValidate.validate()) {
                        if (formDataAttach.has("file")) {
                            fileUpload.uploadFileToUrl(__env.apiUrl() + '/api/file/uploadFile', formDataAttach, {
                                headers: {'Content-Type': undefined}
                            }).then(function (attFile) {
                                $scope.featured.thumbnailId = attFile.id;
                                $scope.postData();
                            });
                        } else {
                            $scope.postData();
                        }
                    }
                }
                $scope.postData = function () {
                    /*delete $scope.featured.advantages;
                    delete $scope.featured.app;
                    delete $scope.featured.news;
                    delete $scope.featured.organizations;
                    delete $scope.featured.parameters;
                    delete $scope.featured.quotes;
                    delete $scope.featured.gallery;
                    delete $scope.featured.documents;
                    delete $scope.featured.videos;*/
                    mainService.withdata('put', __env.apiUrl() + '/api/cnt/featured/update', $scope.featured).then(function (data) {
                        $scope.notf1.show({
                            type: "success",
                            message: "Амжилттай"
                        }, "ngTemplate");
                        $scope.back();
                    });
                }

                $scope.back = function() {
                    $state.go('restricted.front.1010');
                }

                var formDataAttach = new FormData();
                $scope.getTheUFilesAttach = function ($files) {
                    formDataAttach.delete("file");
                    angular.forEach($files, function (value, key) {
                        formDataAttach.append("file", value);
                    });
                };

                $scope.fileEditor = function (container, options) {
                    $('<input type="file" name="file">').appendTo(container).kendoUpload({
                        multiple: false,
                        autoUpload: false,
                        async: {
                            saveUrl: __env.apiUrl()+"/api/file/uploadFile",
                            removeUrl: __env.apiUrl()+"/api/file/delete",
                            autoUpload: true
                        },
                        validation: {
                         allowedExtensions: [".gif", ".jpg", ".png"]
                        },
                        showFileList:false,
                        cancel: function (e) {},
                        clear: function (e) {},
                        remove: function (e) {
                            if ($scope.createLink) {
                                $.ajax({
                                    url: __env.apiUrl()+"/api/file/delete",
                                    type: 'DELETE',
                                    success: function (response) {},
                                    data: JSON.stringify($scope.createLink),
                                    dataType: 'json',
                                    contentType: 'application/json; charset=utf-8'
                                });
                            }
                            $(".k-widget.k-upload").find("ul").remove();
                            $(".k-upload-status").remove();
                            $scope.createLink = null;
                            e.preventDefault();
                        },
                        complete: function (e) {},
                        error: function (e) {},
                        progress: function (e) {},
                        select: function (e) {},
                        success: function (e) {
                            $scope.createLink = e.response;
                            options.model.fileId=e.response.id;
                            options.model.dirty=true;
                        },
                        upload: function (e) {
                            var xhr = e.XMLHttpRequest;
                            if (xhr) {
                                xhr.addEventListener("readystatechange", function (e) {
                                    if (xhr.readyState == 1 /* OPENED */) {
                                        xhr.setRequestHeader('Authorization', 'Bearer ' + $scope.user.token);
                                    }
                                });
                            }
                        }
                    });
                };

                // Sections

                $scope.orgGrid = {
                    dataSource: {
                        transport: {
                            read: {
                                url: function (e) {
                                    return __env.apiUrl() + "/api/cnt/featured/" + $scope.featured.id + "/org/list";
                                },
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                data: {"sort": [{field: 'id', dir: 'desc'}]},
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + $scope.user.token);
                                }
                            },
                            create: {
                                url: __env.apiUrl() + "/api/cnt/featured/" + $scope.featured.id + "/org/create",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                complete: function (e) {
                                    if (e.status === 200) {
                                        $rootScope.alert(true,"Амжилттай хадгаллаа");
                                    } else {
                                        $rootScope.alert(false,"Амжилтгүй");
                                    }
                                    $("#orgData").data("kendoGrid").dataSource.read();
                                },
                                beforeSend: function(req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + $scope.user.token);
                                }
                            },
                            update: {
                                url: __env.apiUrl() + "/api/cnt/featured/org/update",
                                contentType: "application/json; charset=UTF-8",
                                type: "PUT",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + $scope.user.token);
                                },
                                complete: function (e) {
                                    if (e.status === 200) {
                                        $rootScope.alert(true, "Амжилттай засагдлаа");
                                    }
                                    else if (e.status === 500) {
                                        $rootScope.alert(false, "Амжилтгүй");
                                    }
                                }
                            },
                            destroy: {
                                url: __env.apiUrl() + "/api/cnt/featured/" + $scope.featured.id + "/org/delete",
                                contentType: "application/json; charset=UTF-8",
                                type: "DELETE",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + $scope.user.token);
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
                                    role: {type: "string", validation: {required: true}},
                                    register: {type: "string"},
                                }
                            }
                        },
                        pageSize: 20,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    },
                    filterable: true,
                    columnMenu: {
                        componentType: "modern",
                        columns: {
                            sort: "asc",
                            groups: [
                                { title: "title", columns: ["title"] },
                                { title: "role", columns: ["role"] },
                                { title: "register", columns: ["register"] }
                            ]
                        }
                    },
                    sortable: true,
                    resizable: true,
                    pageable: {
                        refresh: true,
                        pageSizes: true,
                        buttonCount: 5
                    },
                    search: {
                        fields: [
                            { name: "title", operator: "contains" },
                            { name: "role", operator: "contains" },
                            { name: "register", operator: "contains" },
                        ]
                    },
                    columns: [
                        {
                            title: "#",
                            headerAttributes: {"class": "columnCenter"},
                            attributes: {"style": "text-align: center;"},
                            template: "#= ++record #",
                            sticky: true,
                            width: 50
                        },
                        {
                            field: "role",
                            filterable: {
                                cell: {
                                    operator: "contains",
                                    showOperators: false,
                                    suggestionOperator: "contains"
                                }
                            },
                            title: "Үүрэг",
                            headerAttributes: {style: "text-align: left; font-weight: bold"}
                        },
                        {
                            field: "title",
                            filterable: {
                                cell: {
                                    operator: "contains",
                                    showOperators: false,
                                    suggestionOperator: "contains"
                                }
                            },
                            title: "Байгууллагын нэр",
                            headerAttributes: {style: "text-align: left; font-weight: bold"}
                        },
                        {
                            command: [
                                { name: "edit", text: { edit: " ", update: " ", cancel: " " } },
                                { name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn" }
                            ], title: "&nbsp;", width: 100
                        },
                    ],
                    dataBinding: function() {
                        record = (this.dataSource.page() -1) * this.dataSource.pageSize();
                    },
                    editable: { "mode": "inline", "createAt": "bottom" },
                };

                $scope.parameterGrid = {
                    dataSource: {
                        transport: {
                            read: {
                                url: function (e) {
                                    return __env.apiUrl() + "/api/cnt/featured/" + $scope.featured.id + "/parameter/list";
                                },
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                data: {"sort": [{field: 'id', dir: 'desc'}]},
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + $scope.user.token);
                                }
                            },
                            create: {
                                url: __env.apiUrl() + "/api/cnt/featured/" + $scope.featured.id + "/parameter/create",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                complete: function (e) {
                                    if (e.status === 200) {
                                        $rootScope.alert(true,"Амжилттай хадгаллаа");
                                    } else {
                                        $rootScope.alert(false,"Амжилтгүй");
                                    }
                                    $("#parameterData").data("kendoGrid").dataSource.read();
                                },
                                beforeSend: function(req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + $scope.user.token);
                                }
                            },
                            update: {
                                url: __env.apiUrl() + "/api/cnt/featured/parameter/update",
                                contentType: "application/json; charset=UTF-8",
                                type: "PUT",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + $scope.user.token);
                                },
                                complete: function (e) {
                                    if (e.status === 200) {
                                        $rootScope.alert(true, "Амжилттай засагдлаа");
                                    }
                                    else if (e.status === 500) {
                                        $rootScope.alert(false, "Амжилтгүй");
                                    }
                                }
                            },
                            destroy: {
                                url: __env.apiUrl() + "/api/cnt/featured/" + $scope.featured.id + "/parameter/delete",
                                contentType: "application/json; charset=UTF-8",
                                type: "DELETE",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + $scope.user.token);
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
                                    description: {type: "string", validation: {required: true}},
                                    amount: {type: "number", validation: {required: true}},
                                    unitOfMeasurement: {type: "string", validation: {required: true}},
                                }
                            }
                        },
                        pageSize: 20,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    },
                    filterable: true,
                    columnMenu: {
                        componentType: "modern",
                        columns: {
                            sort: "asc",
                            groups: [
                                { title: "description", columns: ["description"] },
                                { title: "amount", columns: ["amount"] },
                                { title: "unitOfMeasurement", columns: ["unitOfMeasurement"] }
                            ]
                        }
                    },
                    sortable: true,
                    resizable: true,
                    pageable: {
                        refresh: true,
                        pageSizes: true,
                        buttonCount: 5
                    },
                    search: {
                        fields: [
                            { name: "description", operator: "contains" },
                            { name: "amount", operator: "contains" },
                            { name: "unitOfMeasurement", operator: "contains" },
                        ]
                    },
                    columns: [
                        {
                            title: "#",
                            headerAttributes: {"class": "columnCenter"},
                            attributes: {"style": "text-align: center;"},
                            template: "#= ++record #",
                            sticky: true,
                            width: 50
                        },
                        {
                            field: "description",
                            filterable: {
                                cell: {
                                    operator: "contains",
                                    showOperators: false,
                                    suggestionOperator: "contains"
                                }
                            },
                            title: "Тайлбар",
                            headerAttributes: {style: "text-align: left; font-weight: bold"}
                        },
                        {
                            field: "amount",
                            filterable: {
                                cell: {
                                    operator: "contains",
                                    showOperators: false,
                                    suggestionOperator: "contains"
                                }
                            },
                            title: "Тоо хэмжээ",
                            headerAttributes: {style: "text-align: left; font-weight: bold"}
                        },
                        {
                            field: "unitOfMeasurement",
                            filterable: {
                                cell: {
                                    operator: "contains",
                                    showOperators: false,
                                    suggestionOperator: "contains"
                                }
                            },
                            title: "Хэмжих нэгж",
                            headerAttributes: {style: "text-align: left; font-weight: bold"}
                        },
                        {
                            command: [
                                { name: "edit", text: { edit: " ", update: " ", cancel: " " } },
                                { name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn" }
                            ], title: "&nbsp;", width: 100
                        },
                    ],
                    dataBinding: function() {
                        record = (this.dataSource.page() -1) * this.dataSource.pageSize();
                    },
                    editable: { "mode": "inline", "createAt": "bottom" },
                };

                $scope.newsGrid = {
                    dataSource: {
                        transport: {
                            read: {
                                url: function (e) {
                                    return __env.apiUrl() + "/api/cnt/featured/" + $scope.featured.id + "/news/list";
                                },
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                data: {"sort": [{field: 'id', dir: 'desc'}]},
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + $scope.user.token);
                                }
                            },
                            create: {
                                url: __env.apiUrl() + "/api/cnt/featured/" + $scope.featured.id + "/news/create",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                complete: function (e) {
                                    if (e.status === 200) {
                                        $rootScope.alert(true,"Амжилттай хадгаллаа");
                                    } else {
                                        $rootScope.alert(false,"Амжилтгүй");
                                    }
                                    $("#newsData").data("kendoGrid").dataSource.read();
                                },
                                beforeSend: function(req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + $scope.user.token);
                                }
                            },
                            update: {
                                url: __env.apiUrl() + "/api/cnt/featured/news/update",
                                contentType: "application/json; charset=UTF-8",
                                type: "PUT",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + $scope.user.token);
                                },
                                complete: function (e) {
                                    if (e.status === 200) {
                                        $rootScope.alert(true, "Амжилттай засагдлаа");
                                    }
                                    else if (e.status === 500) {
                                        $rootScope.alert(false, "Амжилтгүй");
                                    }
                                }
                            },
                            destroy: {
                                url: __env.apiUrl() + "/api/cnt/featured/" + $scope.featured.id + "/news/delete",
                                contentType: "application/json; charset=UTF-8",
                                type: "DELETE",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + $scope.user.token);
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
                                    role: {type: "string"},
                                    register: {type: "string"},
                                }
                            }
                        },
                        pageSize: 20,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    },
                    filterable: true,
                    columnMenu: {
                        componentType: "modern",
                        columns: {
                            sort: "asc",
                            groups: [
                                { title: "title", columns: ["title"] },
                                { title: "role", columns: ["role"] },
                                { title: "register", columns: ["register"] }
                            ]
                        }
                    },
                    sortable: true,
                    resizable: true,
                    pageable: {
                        refresh: true,
                        pageSizes: true,
                        buttonCount: 5
                    },
                    search: {
                        fields: [
                            { name: "title", operator: "contains" },
                            { name: "role", operator: "contains" },
                            { name: "register", operator: "contains" },
                        ]
                    },
                    columns: [
                        {
                            title: "#",
                            headerAttributes: {"class": "columnCenter"},
                            attributes: {"style": "text-align: center;"},
                            template: "#= ++record #",
                            sticky: true,
                            width: 50
                        },
                        {
                            field: "title",
                            filterable: {
                                cell: {
                                    operator: "contains",
                                    showOperators: false,
                                    suggestionOperator: "contains"
                                }
                            },
                            title: "Гарчиг",
                            headerAttributes: {style: "text-align: left; font-weight: bold"}
                        },
                        {
                            field: "shortText",
                            filterable: {
                                cell: {
                                    operator: "contains",
                                    showOperators: false,
                                    suggestionOperator: "contains"
                                }
                            },
                            title: "Товч тайлбар",
                            headerAttributes: {style: "text-align: left; font-weight: bold"}
                        },
                        {
                            command: [
                                { name: "edit", text: { edit: " ", update: " ", cancel: " " } },
                                { name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn" }
                            ], title: "&nbsp;", width: 100
                        },
                    ],
                    dataBinding: function() {
                        record = (this.dataSource.page() -1) * this.dataSource.pageSize();
                    },
                    editable: { "mode": "inline", "createAt": "bottom" },
                };

                $scope.newsGrid2 = {
                    dataSource: {
                        transport: {
                            read: {
                                url: function (e) {
                                    return __env.apiUrl() + "/api/cnt/content/list";
                                },
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                data: {"sort": [{field: 'id', dir: 'desc'}]},
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
                                    user: { editable: false },
                                    cntTermTaxonomies: {defaultValue:[]}
                                }
                            }
                        },
                        pageSize: 20,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    },
                    filterable: true,
                    columnMenu: {
                        componentType: "modern",
                        columns: {
                            sort: "asc",
                            groups: [
                                { title: "Нэр", columns: ["name"] },
                                { title: "Хаяг", columns: ["slug"] }
                            ]
                        }
                    },
                    sortable: true,
                    resizable: true,
                    pageable: {
                        refresh: true,
                        pageSizes: true,
                        buttonCount: 5
                    },
                    search: {
                        fields: [
                            { name: "name", operator: "contains" },
                            { name: "shortText", operator: "contains" },
                        ]
                    },
                    columns: [
                        {
                            title: "#",
                            headerAttributes: {"class": "columnCenter"},
                            attributes: {"style": "text-align: center;"},
//                            template: "#= ++record #",
                            field: "id",
                            sticky: true,
                            width: 50
                        },
                        {
                            field: "image",
                            title: "Зураг",
//                            template: '<img src="{{image.location}}"/>',
                            template: '#if(image !=null){# <img src="#=image.location#" height=""/> #}#',
                            headerAttributes: {style: "text-align: left; font-weight: bold"}
                        },
                        {
                            field: "title",
                            filterable: {
                                cell: {
                                    operator: "contains",
                                    showOperators: false,
                                    suggestionOperator: "contains"
                                }
                            },
                            title: "Гарчиг",
                            headerAttributes: {style: "text-align: left; font-weight: bold"}
                        },
                        {
                            field: "type",
                            filterable: {
                                cell: {
                                    operator: "contains",
                                    showOperators: false,
                                    suggestionOperator: "contains"
                                }
                            },
                            width: 100,
                            title: "Төрөл",
                            values:[{text:"Хуудас",value:"Page"},{text:"Мэдээ",value:"Content"}],
                            template: "#if(type=='Page'){# Хуудас #}else{# Мэдээ #}#",
                            headerAttributes: {style: "text-align: left; font-weight: bold"}
                        },
                        {
                            field: "status",
                            filterable: {
                                cell: {
                                    operator: "contains",
                                    showOperators: false,
                                    suggestionOperator: "contains"
                                }
                            },
                            width: 100,
                            title: "Төлөв",
                            headerAttributes: {style: "text-align: left; font-weight: bold"}
                        },
                        {
                            field: "visibility",
                            title: "Хүлээн авагч",
                            filterable: {
                                cell: {
                                    operator: "contains",
                                    showOperators: false,
                                    suggestionOperator: "contains"
                                }
                            },
                            width: 100,
                            headerAttributes: {style: "text-align: left; font-weight: bold"}
                        },
                        {
                            field: "regDtm",
                            title: "Огноо",
                            filterable: {
                                operators: {
                                    string: {
                                        eq: "Тэнцүү",
                                        gte: "Их буюу тэнцүү",
                                        lte: "Бага буюу тэнцүү"
                                    }
                                }
                            },
                            headerAttributes: {style: "text-align: left; font-weight: bold"}
                        },
                        {
                            field: "user",
                            title: "Ажилтан",
                            filterable: {
                                cell: {
                                    operator: "contains",
                                    showOperators: false,
                                    suggestionOperator: "contains"
                                }
                            },
                            template: "#=user.name#",
                            headerAttributes: {style: "text-align: left; font-weight: bold"}
                        },
                    ],
                    dataBinding: function() {
                        record = (this.dataSource.page() -1) * this.dataSource.pageSize();
                    },
                    height: function () {
                        return $(window).height() - 110;
                    },
                    toolbar: ["search"],
                    selectable: "multiple, row",
//                        persistSelection: true,
                    change: function (e) {
                        var rows = e.sender.select();
                        var selected = [];
                        $scope.tempNews = [];
                        rows.each(function(idx) {
                        console.log(rows[idx]);
                           $scope.tempNews.push(parseInt(rows[idx].childNodes[0].innerText));
                        });
                    }
                };
                $scope.tempNews = [];
                $scope.showNews = function () {
                    UIkit.modal('#modalForm3', {
                          modal: false,
                          keyboard: false,
                          bgclose: false,
                          center: false
                      }).show();
                }
                $scope.selectNews = function() {
                    for(var i=0; i<$scope.tempNews.length; i++) {
                        mainService.withdata('post', __env.apiUrl() + '/api/cnt/featured/' + $scope.featured.id + '/news/create', $scope.tempNews[i]).then(function (data) {
                            $("#newsData").data("kendoGrid").dataSource.read();
                        });
                    }
                }

                $scope.advantageGrid = {
                    dataSource: {
                        transport: {
                            read: {
                                url: function (e) {
                                    return __env.apiUrl() + "/api/cnt/featured/" + $scope.featured.id + "/advantage/list";
                                },
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                data: {"sort": [{field: 'id', dir: 'desc'}]},
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + $scope.user.token);
                                }
                            },
                            create: {
                                url: __env.apiUrl() + "/api/cnt/featured/" + $scope.featured.id + "/advantage/create",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                complete: function (e) {
                                    if (e.status === 200) {
                                        $rootScope.alert(true,"Амжилттай хадгаллаа");
                                    } else {
                                        $rootScope.alert(false,"Амжилтгүй");
                                    }
                                    $("#advantageData").data("kendoGrid").dataSource.read();
                                },
                                beforeSend: function(req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + $scope.user.token);
                                }
                            },
                            update: {
                                url: __env.apiUrl() + "/api/cnt/featured/advantage/update",
                                contentType: "application/json; charset=UTF-8",
                                type: "PUT",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + $scope.user.token);
                                },
                                complete: function (e) {
                                    if (e.status === 200) {
                                        $rootScope.alert(true, "Амжилттай засагдлаа");
                                    }
                                    else if (e.status === 500) {
                                        $rootScope.alert(false, "Амжилтгүй");
                                    }
                                }
                            },
                            destroy: {
                                url: __env.apiUrl() + "/api/cnt/featured/" + $scope.featured.id + "/advantage/delete",
                                contentType: "application/json; charset=UTF-8",
                                type: "DELETE",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + $scope.user.token);
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
                                    title: {type: "string", defaultValue: ""},
                                    description: {type: "string", validation: {required: true}},
                                }
                            }
                        },
                        pageSize: 20,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    },
                    filterable: true,
                    columnMenu: {
                        componentType: "modern",
                        columns: {
                            sort: "asc",
                            groups: [
//                                { title: "title", columns: ["title"] },
                                { title: "description", columns: ["description"] },
                            ]
                        }
                    },
                    sortable: true,
                    resizable: true,
                    pageable: {
                        refresh: true,
                        pageSizes: true,
                        buttonCount: 5
                    },
                    search: {
                        fields: [
//                            { name: "title", operator: "contains" },
                            { name: "description", operator: "contains" },
                        ]
                    },
                    columns: [
                        {
                            title: "#",
                            headerAttributes: {"class": "columnCenter"},
                            attributes: {"style": "text-align: center;"},
                            template: "#= ++record #",
                            sticky: true,
                            width: 50
                        },
                        /*{
                            field: "title",
                            filterable: {
                                cell: {
                                    operator: "contains",
                                    showOperators: false,
                                    suggestionOperator: "contains"
                                }
                            },
                            title: "Гарчиг",
                            headerAttributes: {style: "text-align: left; font-weight: bold"}
                        },*/
                        {
                            field: "description",
                            filterable: {
                                cell: {
                                    operator: "contains",
                                    showOperators: false,
                                    suggestionOperator: "contains"
                                }
                            },
                            title: "Тайлбар",
                            headerAttributes: {style: "text-align: left; font-weight: bold"}
                        },
                        {
                            command: [
                                { name: "edit", text: { edit: " ", update: " ", cancel: " " } },
                                { name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn" }
                            ], title: "&nbsp;", width: 100
                        },
                    ],
                    dataBinding: function() {
                        record = (this.dataSource.page() -1) * this.dataSource.pageSize();
                    },
                    editable: { "mode": "inline", "createAt": "bottom" },
                };

                $scope.quoteGrid = {
                    dataSource: {
                        transport: {
                            read: {
                                url: function (e) {
                                    return __env.apiUrl() + "/api/cnt/featured/" + $scope.featured.id + "/quote/list";
                                },
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                data: {"sort": [{field: 'id', dir: 'desc'}]},
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + $scope.user.token);
                                }
                            },
                            create: {
                                url: __env.apiUrl() + "/api/cnt/featured/" + $scope.featured.id + "/quote/create",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                complete: function (e) {
                                    console.log("got it");
                                    if (e.status === 200) {
                                        $rootScope.alert(true,"Амжилттай хадгаллаа");
                                    } else {
                                        $rootScope.alert(false,"Амжилтгүй");
                                    }
                                    $("#quoteData").data("kendoGrid").dataSource.read();
                                },
                                beforeSend: function(req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + $scope.user.token);
                                }
                            },
                            update: {
                                url: __env.apiUrl() + "/api/cnt/featured/quote/update",
                                contentType: "application/json; charset=UTF-8",
                                type: "PUT",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + $scope.user.token);
                                },
                                complete: function (e) {
                                    if (e.status === 200) {
                                        $rootScope.alert(true, "Амжилттай засагдлаа");
                                    }
                                    else if (e.status === 500) {
                                        $rootScope.alert(false, "Амжилтгүй");
                                    }
                                }
                            },
                            destroy: {
                                url: __env.apiUrl() + "/api/cnt/featured/" + $scope.featured.id + "/quote/delete",
                                contentType: "application/json; charset=UTF-8",
                                type: "DELETE",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + $scope.user.token);
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
                                    quote: {type: "string", validation: {required: true}},
                                    role: {type: "string", validation: {required: true}},
                                    speaker: {type: "string", validation: {required: true}},
                                    fileId: {type: "number", validation: {required: true}},
                                    file: {defaultValue:null, nullable:true},
                                }
                            }
                        },
                        pageSize: 20,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    },
                    filterable: true,
                    columnMenu: {
                        componentType: "modern",
                        columns: {
                            sort: "asc",
                            groups: [
                                { title: "speaker", columns: ["speaker"] },
                                { title: "role", columns: ["role"] },
                                { title: "quote", columns: ["quote"] }
                            ]
                        }
                    },
                    sortable: true,
                    resizable: true,
                    pageable: {
                        refresh: true,
                        pageSizes: true,
                        buttonCount: 5
                    },
                    search: {
                        fields: [
                            { name: "quote", operator: "contains" },
                            { name: "role", operator: "contains" },
                            { name: "speaker", operator: "contains" },
                        ]
                    },
                    columns: [
                        {
                            title: "#",
                            headerAttributes: {"class": "columnCenter"},
                            attributes: {"style": "text-align: center;"},
                            template: "#= ++record #",
                            sticky: true,
                            width: 50
                        },
                        {
                            field: "speaker",
                            filterable: {
                                cell: {
                                    operator: "contains",
                                    showOperators: false,
                                    suggestionOperator: "contains"
                                }
                            },
                            title: "Үг хэлсэн хүн",
                            headerAttributes: {style: "text-align: left; font-weight: bold"}
                        },
                        {
                            field: "role",
                            filterable: {
                                cell: {
                                    operator: "contains",
                                    showOperators: false,
                                    suggestionOperator: "contains"
                                }
                            },
                            title: "Албан тушаал",
                            headerAttributes: {style: "text-align: left; font-weight: bold"}
                        },
                        {
                            field: "quote",
                            filterable: {
                                cell: {
                                    operator: "contains",
                                    showOperators: false,
                                    suggestionOperator: "contains"
                                }
                            },
                            title: "Хэлсэн үг",
                            headerAttributes: {style: "text-align: left; font-weight: bold"}
                        },
                        {
                            field: "fileId",
                            title: "Хүний зураг",
                            template:"#if(fileId!=null && fileId!=0 && file!=null){# <a class='uk-text-primary' target='_blank' href='#=file.uri#'>Татах</a> #}#",
                            editor: $scope.fileEditor,
                            headerAttributes: {style: "text-align: left; font-weight: bold"}
                        },
                        {
                            command: [
                                { name: "edit", text: { edit: " ", update: " ", cancel: " " } },
                                { name: "destroy", text: " ", iconClass: "k-icon k-i-delete mn" }
                            ], title: "&nbsp;", width: 100
                        },
                    ],
                    dataBinding: function() {
                        record = (this.dataSource.page() -1) * this.dataSource.pageSize();
                    },
                    editable: { "mode": "inline", "createAt": "bottom" },
                };

                $scope.addRow = function(tableId) {
                    $("#" + tableId).data("kendoGrid").addRow();
                }

                $scope.fileId = undefined;
                $scope.document = {};
                $scope.video = {};
                $scope.fileOptions = {
                    multiple: false,
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
                                type: 'DELETE',
                                success: function (response) { },
                                data: JSON.stringify($scope.createLink),
                                dataType: 'json',
                                contentType: 'application/json; charset=utf-8'
                            });
                        }
                        $(".k-widget.k-upload").find("ul").remove();
                        $(".k-upload-status").remove();
                        $scope.createLink = null;
                        e.preventDefault();
                    },
                    success: function (e) {
                        $scope.fileId = e.response.id;
                        console.log($scope.fileId);
                    },
                    upload: function (e) {
                        var xhr = e.XMLHttpRequest;
                        if (xhr) {
                            xhr.addEventListener("readystatechange", function (e) {
                                if (xhr.readyState == 1 /* OPENED */) {
                                    xhr.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                }
                            });
                        }
                    }
                };
                $scope.saveFile = function (item, type) {
                    var name = "";
                    if (type == "video") {
                        name = $scope.video.name;
                    } else if (type == "document") {
                        name = $scope.document.name;
                    }
                    if ($scope.fileId != undefined) {
                        UIkit.modal('#modal_loader', {
                            modal: false,
                            keyboard: false,
                            bgclose: false,
                            center: true
                        }).show();
                        mainService.withdata('post', __env.apiUrl() + '/api/cnt/featured/file/' + $scope.featured.id + '/' + type + '/create',
                            JSON.stringify({"fileId": $scope.fileId, "name": name})).then(function (data) {
                            $("#uploader"+type).data("kendoUpload").clearFile(function(e) {});
                            UIkit.modal('#modal_loader').hide();
                            if (type == "video") {
                               $scope.featured.video.push(data);
                               $scope.video = {};
                            } else if (type == "document") {
                               $scope.featured.documents.push(data);
                               $scope.document = {};
                            }
                        }).catch(function(err) {
                            UIkit.modal('#modal_loader').hide();
                        });
                    } else {
                        $rootScope.alert(false, "Файл хуулагдаагүй байна.");
                    }
                };
                $scope.deleteFile = function (index, item, type) {
                    mainService.withdata('delete', __env.apiUrl() + '/api/cnt/featured/file/' + $scope.featured.id + '/delete/' + item.id).then(function (data) {
                        if (type == 'video') {
                            $scope.featured.video.splice(index, 1);
                        }
                        if (type == 'document') {
                            $scope.featured.documents.splice(index, 1);
                        }
                    });
                };
            }
        ]
    );
