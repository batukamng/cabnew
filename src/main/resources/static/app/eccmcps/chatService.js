altairApp
    .factory('chatService', ['$http', '$rootScope', 'authProvider', 'ChatSocket','profileService', '$q',
        function ($http, $rootScope, authProvider, chatSocket,profileService, $q) {
            var service = {};
            var activeSessions = {};
            var friends = null;

            var listener = $q.defer();

            var RECONNECT_TIMEOUT = 30000;
            var RECEIVE_TOPIC_PREFIX = "/topic/users/";
            var SEND_TOPIC = "/chatalot/send";

            var initialized = false;

            service.initialize = function (id) {
                if (!initialized) {
                    chatSocket.init('/ws');
                    chatSocket.connect(function(frame) {
                        $rootScope.username = frame.headers['user-name'];

                        chatSocket.subscribe("/app/chat.participants", function(message) {
                            $rootScope.participants = JSON.parse(message.body);
                        });

                        chatSocket.subscribe("/topic/chat.login", function(message) {
                            $rootScope.participants.unshift({username: JSON.parse(message.body).username, typing : false});
                        });

                        chatSocket.subscribe("/topic/chat.logout", function(message) {
                            var username = JSON.parse(message.body).id;
                            for(var index in $rootScope.participants) {
                                if($rootScope.participants[index].id === username) {
                                    $rootScope.participants.splice(index, 1);
                                }
                            }
                        });

                        chatSocket.subscribe("/topic/chat.typing", function(message) {
                            var parsed = JSON.parse(message.body);
                            if(parsed.username === $rootScope.username) return;

                            for(var index in $rootScope.participants) {
                                var participant = $rootScope.participants[index];

                                if(participant.username === parsed.username) {
                                    $rootScope.participants[index].typing = parsed.typing;
                                }
                            }
                        });

                        chatSocket.subscribe("/user/exchange/amq.direct/errors", function(message) {
                            toaster.pop('error', "Error", message.body);
                        });

                        startMessageListener(id);
                        //GROUP

                        chatSocket.subscribe("/topic/group.receive", function(message) {
                            $rootScope.rooms.unshift(JSON.parse(message.body));
                        });

                    }, function(error) {
                       // toaster.pop('error', 'Error', 'Connection error ' + error);
                    });
                    activeSessions = {};
                    friends = profileService.getFriends();
                    initialized = true;
                }
            };


            service.getActiveSessions = function () {
                return activeSessions;
            };

            service.getFriends = function () {
                return friends;
            };

            /**
             * start a new chat session.
             * @param username of user to start chat with
             */
            service.startChatSession = function (username) {
                return startChatSession(username);
            };

            service.logout = function () {
                if (chatSocket.client != null) {
                    chatSocket.unsubscribe();
                    chatSocket.client.close();
                    chatSocket = {};
                    friends = null;
                    activeSessions = {};
                    initialized = false;
                }
            };

            service.sendMessage = function (message, to) {
                var messageObj = {
                    message: message,
                    date: new Date(),
                    to: to
                };

                chatSocket.send("/app/chat.private."+to, {priority: 9}, JSON.stringify(messageObj));

                return messageObj;
            };

            var startChatSession = function (username) {

                return activeSessions[username] = {
                    user: findFriendProfile(username),
                    messages: [],
                    message: "",
                    hasNewMessages: false
                };
            };

            var reconnect = function () {
                $timeout(function () {
                    initialize();
                }, RECONNECT_TIMEOUT);
            };

            var getMessage = function (data) {
                var message = JSON.parse(data);
                console.log(message.type);
alert();
                if (message.type === "control-message") {
                    processControl(message)
                } else if (message.type === "chat-message") {
                    processChat(message);
                }
            };

            var processControl = function (message) {
                if (message.message === "refresh-friends") {
                    profileService.getFriendsAsync().then(function (newFriends) {
                        friends = newFriends;
                        for (var index in activeSessions) {
                            if (activeSessions.hasOwnProperty(index)) {
                                console.log(activeSessions[index].user);
                                activeSessions[index].user = findFriendProfile(activeSessions[index].user.id);
                            }
                        }
                    }, function (error) {
                        console.error("Failed to process control message: " + message.message);
                        console.error(error);
                    });
                }
            };

            /**
             * Find a friend from the friends list which is populated when the controller
             * is initiated.
             * @param username
             * @returns {*}
             */
            var findFriendProfile = function (username) {
                for (var index in friends) {
                    if (friends.hasOwnProperty(index)) {
                        if (friends[index].id === username) {
                            console.log(friends[index]);
                            return friends[index];
                        }
                    }
                }
            };

            var processChat = function (message) {
                var fromUsername = message.from;

                //When a message arrives and there is no corresponding session, start one.
                if (!activeSessions.hasOwnProperty(fromUsername)) {
                    if (startChatSession(fromUsername) == null) {
                        console.log("Error starting a chat session");
                        return;
                    }
                }

                activeSessions[fromUsername].messages.push(message);
                activeSessions[fromUsername].hasNewMessages = true;

                $rootScope.$broadcast("chatServiceMessageReceived", message);
            };

            var startMessageListener = function (id) {
                chatSocket.subscription = chatSocket.subscribe("/topic/"+id+"/exchange/amq.direct/chat.message", function (data) {
                    console.log("end");
                    console.log(data.body);
                    listener.notify(getMessage(data.body));
                });
            };

            return service;
        }
    ]);