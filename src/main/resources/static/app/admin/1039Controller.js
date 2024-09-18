angular
    .module('altairApp')
    .controller(
        '1039Ctrl',
        [
            '$rootScope',
            '$state',
            '$scope',
            '$timeout',
            'mainService',
            '__env',
            function ($rootScope, $state, $scope, $timeout, mainService, __env) {
                $scope.user = JSON.parse(sessionStorage.getItem('currentUser'));

                $scope.schedulerOptions = {
                    date: new Date(),
                    startTime: new Date("2019/6/13 07:00 AM"),
                    height: function () {
                        return $(window).height() - 110;
                    },
                    views: [
                        "day",
                        { type: "workWeek", selected: true },
                        "week",
                        "month"
                    ],
                   // timezone: "Etc/UTC",
                    dataSource: {
                        batch: true,
                        transport: {
                            read: {
                                url: function (e) {
                                    if(sessionStorage.getItem("buttonData").includes("read") && JSON.parse(sessionStorage.getItem('menuData')).link===$state.current.name){
                                        return  __env.apiUrl() + "/api/schedule/all";
                                    }
                                    else{
                                        sessionStorage.removeItem('currentUser');
                                        sessionStorage.removeItem('menuList');
                                        sessionStorage.removeItem('menuData');
                                        $state.go('login');
                                    }
                                },
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                }
                            },
                            update: {
                                url: __env.apiUrl() + "/api/schedule/update",
                                contentType: "application/json; charset=UTF-8",
                                type: "PUT",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                }
                            },
                            create: {
                                url: __env.apiUrl() + "/api/schedule/create",
                                contentType: "application/json; charset=UTF-8",
                                type: "POST",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                }
                            },
                            destroy: {
                                url: __env.apiUrl() + "/api/schedule/delete",
                                contentType: "application/json; charset=UTF-8",
                                type: "DELETE",
                                beforeSend: function (req) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                                }
                            },
                            parameterMap: function(options, operation) {
                                if (operation === "read") {
                                    return JSON.stringify(options);
                                }
                                else{
                                    return JSON.stringify(options.models);
                                }
                            }
                        },
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    id: { from: "id", type: "number" },
                                    title: { from: "title", defaultValue: "No title", validation: { required: true } },
                                    start: { type: "date", from: "start" },
                                    end: { type: "date", from: "end" },
                                    startTimezone: { from: "startTimezone" },
                                    endTimezone: { from: "endTimezone" },
                                    description: { from: "description" },
                                    recurrenceId: {type: "number", from: "recurrenceId" },
                                    recurrenceRule: { from: "recurrenceRule" },
                                    recurrenceException: { from: "recurrenceException" },
                                    ownerId: { from: "ownerId", defaultValue: 1 },
                                    roomId: { from: "roomId", nullable: true},
                                //    attendees: { from: "attendees", nullable: true },
                                    isAllDay: { type: "boolean", from: "isAllDay" }
                                }
                            }
                        },
                        filter: {
                            logic: "or",
                            filters: [
                                { field: "ownerId", operator: "eq", value: 1 },
                                { field: "ownerId", operator: "eq", value: 2 }
                            ]
                        }
                    },
                    resources: [
                        {
                            field: "roomId",
                            dataSource: [
                                { text: "Meeting Room 101", value: 1, color: "#6eb3fa" },
                                { text: "Meeting Room 201", value: 2, color: "#f58a8a" }
                            ],
                            title: "Room"
                        },
                     /*   {
                            field: "attendees",
                            dataSource: [
                                { text: "Alex", value: 1, color: "#f8a398" },
                                { text: "Bob", value: 2, color: "#51a0ed" },
                                { text: "Charlie", value: 3, color: "#56ca85" }
                            ],
                            multiple: true,
                            title: "Attendees"
                        }*/
                    ]
                };
            }
        ]
    );
