angular
    .module('altairApp')
    .controller(
        '1040Ctrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$timeout',
            'mainService',
            '__env',
            function ($rootScope, $state, $scope, $timeout, mainService, __env) {
                $scope.user = JSON.parse(localStorage.getItem('currentUser'));

                var tasksDataSource = new kendo.data.GanttDataSource({
                    batch: false,
                    transport: {
                        read: {
                            url: function (e) {
                                if(localStorage.getItem("buttonData").includes("read") && JSON.parse(localStorage.getItem('menuData')).link===$state.current.name){
                                    return  __env.apiUrl() + "/api/gantt/all";
                                }
                                else{
                                    localStorage.removeItem('currentUser');
                                    localStorage.removeItem('menuList');
                                    localStorage.removeItem('menuData');
                                    $state.go('login');
                                }
                            },
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                            }
                        },
                        update: {
                            url: __env.apiUrl() + "/api/gantt/update",
                            contentType: "application/json; charset=UTF-8",
                            type: "PUT",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                            }
                        },
                        create: {
                            url: __env.apiUrl() + "/api/gantt/create",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                            }
                        },
                        destroy: {
                            url: __env.apiUrl() + "/api/gantt/delete",
                            contentType: "application/json; charset=UTF-8",
                            type: "DELETE",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                            }
                        },
                        parameterMap: function(options, operation) {
                            if (operation === "read") {
                                return JSON.stringify(options);
                            }
                            else{
                                return JSON.stringify(options.models || [options]);
                            }
                        }
                    },
                    schema: {
                        model: {
                            id: "id",
                            fields: {
                                id: { from: "id", type: "number" },
                                orderId: { from: "orderId", type: "number", validation: { required: true } },
                                parentId: { from: "parentId", type: "number", defaultValue: null, validation: { required: true } },
                                start: { from: "start", type: "date" },
                                end: { from: "end", type: "date" },
                                title: { from: "title", defaultValue: "", type: "string" },
                                percentComplete: { from: "percentComplete", type: "number" },
                                summary: { from: "summary", type: "boolean" },
                                expanded: { from: "expanded", type: "boolean", defaultValue: true }
                            }
                        }
                    }
                });

                var dependenciesDataSource = new kendo.data.GanttDependencyDataSource({
                    transport: {
                        read: {
                            url: __env.apiUrl() + "/api/gantt/dependencies/read",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                            }
                        },
                        update: {
                            url: __env.apiUrl() + "/api/gantt/dependencies/update",
                            contentType: "application/json; charset=UTF-8",
                            type: "PUT",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                            }
                        },
                        create: {
                            url: __env.apiUrl() + "/api/gantt/dependencies/create",
                            contentType: "application/json; charset=UTF-8",
                            type: "POST",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                            }
                        },
                        destroy: {
                            url: __env.apiUrl() + "/api/gantt/dependencies/delete",
                            contentType: "application/json; charset=UTF-8",
                            type: "DELETE",
                            beforeSend: function (req) {
                                req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                            }
                        },
                        parameterMap: function(options, operation) {
                            if (operation === "read") {
                                return JSON.stringify(options);
                            }
                            else{
                                return JSON.stringify(options.models || [options]);
                            }
                        }
                    },
                    schema: {
                        model: {
                            id: "id",
                            fields: {
                                id: { from: "id", type: "number" },
                                predecessorId: { from: "predecessorId", type: "number" },
                                successorId: { from: "successorId", type: "number" },
                                type: { from: "type", type: "number" }
                            }
                        }
                    }
                });

                $scope.ganttOptions = {
                    dataSource: tasksDataSource,
                    dependencies: dependenciesDataSource,
                    views: [
                        "day",
                        { type: "week", selected: true },
                        "month"
                    ],
                    toolbar: ["append", "pdf"],
                    pdf: {
                        fileName: "Gantt Export.pdf"
                    },
                    resources: {
                        field: "resources",
                        dataColorField: "color",
                        dataTextField: "name",
                        dataSource: {
                            transport: {
                                read: {
                                    url: __env.apiUrl() + "/api/resource/all",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "POST",
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                    }
                                }
                            },
                            schema: {
                                model: {
                                    id: "id",
                                    fields: {
                                        id: { from: "id", type: "number" }
                                    }
                                }
                            }
                        }
                    },
                    assignments: {
                        dataTaskIdField: "taskId",
                        dataResourceIdField: "resourceId",
                        dataValueField: "units",
                        dataSource: {
                            transport: {
                                read: {
                                    url: __env.apiUrl() + "/api/gantt/assignments/read",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "POST",
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                    }
                                },
                                update: {
                                    url: __env.apiUrl() + "/api/gantt/assignments/update",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "PUT",
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                    }
                                },
                                create: {
                                    url: __env.apiUrl() + "/api/gantt/assignments/create",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "POST",
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                    }
                                },
                                destroy: {
                                    url: __env.apiUrl() + "/api/gantt/assignments/delete",
                                    contentType: "application/json; charset=UTF-8",
                                    type: "DELETE",
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token);
                                    }
                                },
                                parameterMap: function(options, operation) {
                                    if (operation === "read") {
                                        return JSON.stringify(options);
                                    }
                                    else{
                                        return JSON.stringify(options.models || [options]);
                                    }
                                }
                            },
                            schema: {
                                model: {
                                    id: "id",
                                    fields: {
                                        id: { type: "number" },
                                        resourceId: { type: "number" },
                                        units: { type: "number" },
                                        taskId: { type: "number" }
                                    }
                                }
                            }
                        }
                    },
                    columns: [
                        { field: "id", title: "ID", width: 60 },
                        { field: "title", title: "Title", editable: true },
                        { field: "resources", title: "Assigned Resources", editable: true },
                        { field: "start", title: "Start Time", format: "{0:MM/dd/yyyy}", width: 80 },
                        { field: "end", title: "End Time", format: "{0:MM/dd/yyyy}", width: 80 }
                    ],
                    height: function () {
                        return $(window).height() - 110;
                    },
              //      resizable: true,
                    snap: false,
                    showWorkHours: false,
                    showWorkDays: false
                };
            }
        ]
    );
