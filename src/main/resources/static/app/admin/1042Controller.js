angular
    .module('altairApp')
    .controller('1042Ctrl', [
        '$rootScope',
        '$scope',
        '$timeout',
        '$interval',
        'ChatSocket',
        'chatService',
        'profileService',
        'sweet',
        'chat',
        'mainService',
        '__env',
        'Upload',
        function ($rootScope,$scope,$timeout,$interval,ChatSocket,chatService,profileService,sweet,chat,mainService,__env,Upload) {

            $scope.currentUser=JSON.parse(sessionStorage.getItem('currentUser'));

            $scope.profile=JSON.parse(sessionStorage.getItem('currentUser')).user;

            if($scope.currentUser.user.firstName===null){
                UIkit.modal('#changeProfile', {
                    modal: false,
                    keyboard: false,
                    bgclose: false,
                    center: false
                }).show();
            }

            var $formValidateProfile = $('#form_profile');
            $formValidateProfile
                .parsley({
                    'excluded': 'input[type=button], input[type=submit], input[type=reset], input[type=hidden], .selectize-input > input, .md-input.selectized'
                })
                .on('form:validated',function() {
                    $scope.$apply();
                })
                .on('field:validated',function(parsleyField) {
                    if($(parsleyField.$element).hasClass('md-input') || $(parsleyField.$element).is('select')) {
                        $scope.$apply();
                    }
                });

            $scope.file1234 = null;
            $scope.getUserAvatar = function($files){
                if ($files.length > 0){
                    $scope.file1234 = $files[0];
                }
            };
            $scope.submitUserInfoChange = function () {
                if($scope.file1234!=null){
                    $scope.uploadFile($scope.file1234, 1);
                }
            };
            $scope.uploadFile = function (file, y) {
                Upload.upload({
                    url: __env.apiUrl() + '/api/nms/user/changeUserInfo',
                    data: {file: file,jsonStr:JSON.stringify($scope.usr)}
                }).then(function (resp) {
                    if(resp.status===200){
                        sessionStorage.removeItem('currentUser');
                        mainService.user = resp.data;
                        $timeout(function() {
                            sessionStorage.setItem('currentUser', JSON.stringify({ username: resp.data.username,id: resp.data.id, user:resp.data,token: $scope.currentUser.token, expires:$scope.currentUser.expires}));
                        }, 0);
                    }
                    UIkit.modal('#changeProfile').hide();
                });
            };
            $scope.usr={
                'username': $scope.currentUser.user.username || '',
                'email': $scope.currentUser.user.email || ''
            };
            $rootScope.page_full_height = true;
            $rootScope.headerDoubleHeightActive = true;
            $scope.$on('$destroy', function() {
                $rootScope.page_full_height = false;
                $rootScope.headerDoubleHeightActive = false;
            });

            $scope.mainPanel=true;
            var initialized = false;

            $scope.selectOptions = {
                placeholder: "Search for people to add...",
                dataTextField: "name",
                dataValueField: "id",
                valuePrimitive: true,
                itemTemplate: $("#itemTemplate").html(),
                // tagTemplate: $("#tagTemplate").html(),
                autoBind: false,
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: __env.apiUrl() + "/api/profile/list",
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
                    }
                }
            };
            $scope.cancelGroup = function(){
                UIkit.modal('#modal_group').hide();
                UIkit.modal('#modal_group_update').hide();
                $scope.grp={};
            };

            $scope.friends = chatService.getFriends();
            $scope.activeSessions = chatService.getActiveSessions();


            $scope.activeSession = null;
            $scope.message = "";

            //update active sessions to reflect new friends' status
            $scope.$watch(function () {
                return chatService.getFriends();
            }, function (newFriendsArray) {
                $scope.friends = newFriendsArray;
            });

            $scope.$on("chatServiceMessageReceived", function (event, message) {
                var fromUsername = message.from;
                if ($scope.activeSessions[fromUsername] === $scope.activeSession) {
                    $scope.activeSessions[fromUsername].hasNewMessages = false;
                }
                $scope.$apply();
            });

             var $formValidate = $('#form_group');
            $formValidate
                .parsley({
                    'excluded': 'input[type=button], input[type=submit], input[type=reset], input[type=hidden], .selectize-input > input, .md-input.selectized'
                })
                .on('form:validated',function() {
                    $scope.$apply();
                })
                .on('field:validated',function(parsleyField) {
                    if($(parsleyField.$element).hasClass('md-input') || $(parsleyField.$element).is('select')) {
                        $scope.$apply();
                    }
                });

            $scope.createGroup = function () {
                UIkit.modal('#modal_group', {
                    modal: false,
                    keyboard: false,
                    bgclose: false,
                    center: false
                }).show();
            };
            $scope.updateGroup = function (item) {
                $scope.grp=item;
                angular.forEach(item.participantsList, function(value, key) {
                    $scope.grp.selectedIds.push(value.userId);
                });
                UIkit.modal('#modal_group_update', {
                    modal: false,
                    keyboard: false,
                    bgclose: false,
                    center: false
                }).show();
            };
            $scope.ddlDataSource = new kendo.data.HierarchicalDataSource({
                transport: {
                    read: {
                        url:  __env.apiUrl() + "/api/user/profile/list",
                        contentType: "application/json; charset=UTF-8",
                        type: "POST",
                        sort: [{field: "id", dir: "desc"}],
                        beforeSend: function (req) {
                            req.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).token);
                        }
                    },
                    parameterMap: function (options) {
                        return JSON.stringify(options);
                    }
                },
                pageSize: 20,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            });
            $scope.autoOption = {
                placeholder:"Search",
                dataSource: $scope.ddlDataSource,
                dataTextField: "name",
                dataValueField: "id",
                template: '<span class="k-state-default"><img style="width:100%;height: 100%;border-radius: 50px;" src="{{dataItem.profilePicture}}" /></span>' +
                    '<span class="k-state-default"><h3>{{dataItem.firstName}}</h3>' +
                    '<p>{{dataItem.lastName}}</p></span> <button class="k-button k-button-icontext" ng-click="addFriend(dataItem)" style="float: right;margin: 20px 10px 0 0;">Add Friend</button>',
            };
            $scope.addFriend = function(item){
                mainService.withResponse('post','api/profile/invite/'+item.id).then(function (data) {
                   console.log(data);
                });
            };
            $scope.excelFileSelectedEvent = function(file){
                $scope.excelFile = file;
            };

            $scope.createRoom= function () {
                if ($scope.excelFile !== null && $scope.excelFile !== undefined){
                    Upload.upload({
                        url: '/api/conversation/uploadFile',
                        data: {file: $scope.excelFile, item: JSON.stringify($scope.grp)}
                    }).then(function (resp) {
                        console.log(resp.data);
                        $scope.getRooms();
                        chatSocket.send("/app/group.new", {}, JSON.stringify(resp.data));
                        UIkit.modal("#modal_group").hide();
                    }, function (resp) {
                          sweet.show('Анхаар!', 'Файл хуулахад алдаа үүслээ!', 'error');
                    });
                }
                else{
                    mainService.withdata('post','api/conversation/create',$scope.grp).then(function (data) {
                        $scope.getRooms();
                        UIkit.modal("#modal_group").hide();
                    });
                }
            };
            $scope.createPrivateRoom = function(item){
                mainService.withResponse('post','api/conversation/private/'+item.id).then(function (data) {
                    console.log(data);
                    if(data.status===200){
                        $scope.joinToRoom(data.data);
                        $scope.getRooms();
                    }
                    else{

                    }
                });
            };
            $scope.updateRoom= function () {
                if ($scope.excelFile !== null && $scope.excelFile !== undefined){
                    Upload.upload({
                        url: '/api/conversation/upload/conversation',
                        data: {file: $scope.excelFile, item: JSON.stringify($scope.grp)}
                    }).then(function (resp) {
                        $scope.getRooms();
                        UIkit.modal("#modal_group_update").hide();
                    });
                }
                else{
                    mainService.withdata('put','api/conversation/update',$scope.grp).then(function (data) {
                        $scope.getRooms();
                        UIkit.modal("#modal_group_update").hide();
                    });
                }
            };
            $scope.deleteRoom= function (item) {
                $scope.mainPanel=true;
                mainService.withdomain('delete','api/conversation/delete/'+item.id).then(function (data) {
                    $scope.getRooms();
                });
            };
            $scope.getRooms= function () {
                mainService.withdomain('get','api/conversation/me/rooms').then(function (data) {
                    $scope.rooms = data;
                });
            };
            $scope.getContacts= function () {
                mainService.withdomain('get','api/conversation/me/contacts').then(function (data) {
                    $scope.contacts = data;
                });
            };
            $scope.getContacts();

            $scope.closePanel= function(){
                $scope.mainPanel=true;
            };

            chatService.initialize($scope.profile.id);
            var typing = undefined;

            $scope.username     = '';
            $scope.sendTo       = 'everyone';
            $scope.participants = [];
            $scope.newMessage   = '';
            $scope.messages = [];
            var receivedMessages = 0;

            var subArr=[];

            $scope.showSession = function (username) {
                $scope.activeSession = $scope.activeSessions.hasOwnProperty(username) ? $scope.activeSessions[username] : startChatSession(username);
                $scope.activeSession.hasNewMessages = false;
            };
            console.log($scope.activeSessions);

            var startChatSession = function (friendUsername) {
                return chatService.startChatSession(friendUsername);
            };

            $scope.joinToRoom=function(item){

                $scope.activeSession = $scope.activeSessions.hasOwnProperty(item.id) ? $scope.activeSessions[item.id] : startChatSession(item.id);
                $scope.activeSession.hasNewMessages = false;

                $scope.room = item;
                var us=item.id;
                $scope.sendTo = item.id;
                $scope.mainPanel=false;
                $scope.privateUsername=$scope.currentUser.username;
                $scope.partnerImg="";
                if(item.conType) {
                    angular.forEach(item.participantsList, function (value, key) {
                        if (value.lutUser.id !== $scope.profile.id) {
                            $scope.partnerImg = value.lutUser.profilePicture;
                        }
                    });
                }
                else{
                    $scope.partnerImg = item.proPicUrl;
                }

                $scope.messages = [];
                $scope.currentPage = 0;
                $scope.totalPages = 1;
                var receivedMessages = 0;
/*
               if(subArr.indexOf($scope.sendTo)===-1){
                    subArr.push($scope.sendTo);
                    chatSocket.subscribe("/topic/"+$scope.sendTo+"/exchange/amq.direct/chat.message", function(message) {
                        var parsed = JSON.parse(message.body);
                        parsed.priv = true;
                        console.log(parsed);
                       // $scope.messages.push(parsed);
                        if(parsed.conversationId===item.id){
                            $scope.messages.push(parsed);
                        }
                    });
                }*/

                $scope.loadMessages();
            };

            $scope.loadMessages = function () {
                mainService.withdomain('get','api/conversation/rooms/'+$scope.room.id+'/messages?offset='+receivedMessages+'&page='+$scope.currentPage+++'&size='+8).then(function (response) {
                    $scope.totalPages = response.totalPages;
                    $scope.messages = response.content.reverse().concat($scope.messages);
                });
            };

            $scope.getRooms();

            $scope.sendMessage = function() {

                if ($scope.activeSession.message == null || $scope.activeSession.message.length <= 0) {
                    return;
                }

              /*  if($scope.newMessage!==null && $scope.newMessage.length>0){
                    chatSocket.send(destination, {}, JSON.stringify({message: $scope.newMessage}));
                }*/
                $scope.activeSession.messages.push(
                    chatService.sendMessage($scope.activeSession.message, $scope.sendTo)
                );
                $scope.newMessage = '';
                $scope.activeSession.message = "";
            };

            $scope.hasNewMessages = function (username) {
                if ($scope.activeSessions.hasOwnProperty(username)) {
                    return $scope.activeSessions[username].hasNewMessages;
                }
            };

            $scope.startTyping = function() {
                // Don't send notification if we are still typing or we are typing a private message
                if (angular.isDefined(typing) || $scope.sendTo !== "everyone") return;

                typing = $interval(function() {
                    $scope.stopTyping();
                }, 500);

                chatSocket.send("/topic/chat.typing", {}, JSON.stringify({username: $scope.username, typing: true}));
            };
            $scope.stopTyping = function() {
                if (angular.isDefined(typing)) {
                    $interval.cancel(typing);
                    typing = undefined;
                    chatSocket.send("/topic/chat.typing", {}, JSON.stringify({username: $scope.username, typing: false}));
                }
            };
            $scope.privateSending = function(username) {
                $scope.sendTo = (username !== $scope.sendTo) ? username : 'everyone';
                $scope.privateUsername=username;
            };

            var initStompClient = function() {
                chatSocket.init('/ws');
                chatSocket.connect(function(frame) {
                    $scope.username = frame.headers['user-name'];

                    chatSocket.subscribe("/app/chat.participants", function(message) {
                        $scope.participants = JSON.parse(message.body);
                      //  parseParticipants(JSON.parse(message.body));
                    });

                    chatSocket.subscribe("/topic/chat.login", function(message) {
                        $scope.participants.unshift({username: JSON.parse(message.body).username, typing : false});
                    });

                    chatSocket.subscribe("/topic/chat.logout", function(message) {
                        var username = JSON.parse(message.body).username;
                        for(var index in $scope.participants) {
                            if($scope.participants[index].username === username) {
                                $scope.participants.splice(index, 1);
                            }
                        }
                    });

                    chatSocket.subscribe("/topic/chat.typing", function(message) {
                        var parsed = JSON.parse(message.body);
                        if(parsed.username === $scope.username) return;

                        for(var index in $scope.participants) {
                            var participant = $scope.participants[index];

                            if(participant.username === parsed.username) {
                                $scope.participants[index].typing = parsed.typing;
                            }
                        }
                    });

                    chatSocket.subscribe("/topic/chat.message", function(message) {
                        $scope.messages.unshift(JSON.parse(message.body));
                    });

                    chatSocket.subscribe("/user/exchange/amq.direct/chat.message", function(message) {
                        var parsed = JSON.parse(message.body);
                        parsed.priv = true;
                        $scope.messages.unshift(parsed);
                    });

                    chatSocket.subscribe("/user/exchange/amq.direct/errors", function(message) {
                        toaster.pop('error', "Error", message.body);
                    });

                    //GROUP

                    chatSocket.subscribe("/topic/group.receive", function(message) {
                        $scope.rooms.unshift(JSON.parse(message.body));
                    });

                }, function(error) {
                    toaster.pop('error', 'Error', 'Connection error ' + error);
                });

                initialized=true;
                if (!initialized) {
                    mainService.withdomain('get','/api/profile/friends').then(function (data) {
                        $scope.friends=data;
                    });
                }
            };

       //     initStompClient();

         /*   var client = chatSocket.getConnected();
            if (!client) {
                initStompClient();
                client = chatSocket.getConnected();
            }
            else {
                chatSocket.subscribe("/app/chat.participants", function(message) {
                    parseParticipants(JSON.parse(message.body));
                });
            }*/

          /*  var parseParticipants = function(participants) {
                for (var i=0; i<participants.length; i++) {
                    mainService.withdomain('get','/api/user/get/'+participants[i].username).then(function (data) {
                        $scope.participants.push(data);
                        $scope.apply();
                    });
                }
            };*/

            // colors
            $scope.chat_colors = 'chat_box_colors_a';
            $scope.changeColor = function($event,colors) {
                $event.preventDefault();
                $scope.chat_colors = colors;
                $($event.currentTarget)
                    .closest('li').addClass('uk-active')
                    .siblings('li').removeClass('uk-active');
            };
            $scope.$on('onLastRepeat', function (scope, element, attrs) {
                $timeout(function() {
                    var chatScroll = $(element).closest('.scrollbar-inner'),
                        totalHeight = 0;

                    chatScroll.children().each(function(){
                        totalHeight = totalHeight + $(this).outerHeight(true);
                    });

                    chatScroll.scrollTop(totalHeight);
                })
            });


        }
    ]);