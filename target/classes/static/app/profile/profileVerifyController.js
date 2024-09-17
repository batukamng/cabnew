angular.module("altairApp").controller("profileVerifyCtrl", [
    "$rootScope",
    "$state",
    "$scope",
    "$timeout",
    "__env",
    "commonDataSource",
    "mainService",
    "Upload",
    "step1",
    function ($rootScope, $state, $scope, $timeout, __env, commonDataSource, mainService, Upload, step1) {
        console.log("step", step1);
        $scope.user = JSON.parse(localStorage.getItem("currentUser"));
        $scope.token = JSON.parse(localStorage.getItem("currentUser")).token;
        $scope.currentModule = localStorage.getItem("module");
        $scope.notifList = [1, 2, 3, 4, 5, 6];
        $scope.selectedItem = step1 || "info";
        $scope.showPassword = false;
        $scope.showVerifyPassword = false;
        $scope.passRegx = [/[0-9]/, /[a-z]/, /[A-Z]/, /[^A-Z-0-9]/i];
        $scope.passChecker = {};
        $scope.codeLoader = false;
        $scope.regenerateLoader = false;
        $scope.codeRepeatLoader = false;
        $scope.imgLoading = false;
        $scope.isTimeout = true;

        const formCode = $("#formCode");
        const KEYBOARDS = {
            backspace: 8,
            arrowLeft: 37,
            arrowRight: 39,
        };

        function handleBackspace(e) {
            const input = e.target;
            if (input.value) {
                input.value = "";
                return;
            }

            input.previousElementSibling.focus();
        }
        function handleArrowLeft(e) {
            const previousInput = e.target.previousElementSibling;
            if (!previousInput) return;
            previousInput.focus();
        }
        function handleArrowRight(e) {
            const nextInput = e.target.nextElementSibling;
            if (!nextInput) return;
            nextInput.focus();
        }

        $scope.numberKeydown = function (e) {
            switch (e.keyCode) {
                case KEYBOARDS.backspace:
                    handleBackspace(e);
                    break;
                case KEYBOARDS.arrowLeft:
                    handleArrowLeft(e);
                    break;
                case KEYBOARDS.arrowRight:
                    handleArrowRight(e);
                    break;
                default:
            }
        };
        $scope.init = function () {
            const inputs = $("#numberContainer > input.number-input");
            if (inputs.length > 0) {
                function handleInput(e) {
                    const input = e.target;
                    const nextInput = input.nextElementSibling;
                    if (nextInput && input.value) {
                        nextInput.focus();
                        if (nextInput.value) {
                            nextInput.select();
                        }
                    }
                }

                function handlePaste(e) {
                    e.preventDefault();
                    const paste = e.originalEvent.clipboardData.getData("text");
                    inputs.each(function (i, input) {
                        input.value = paste[i] || "";
                    });
                }

                $firstInput = $("#numberContainer .number-input.first");
                $firstInput.on("paste", handlePaste);
                formCode.bind("input.number-input", handleInput);

                inputs.each(function (i, input) {
                    if (i == 0) {
                        inputs.bind("paste", handlePaste);
                    }
                    input.focus(function (e) {
                        setTimeout(() => {
                            e.target.select();
                        }, 0);
                    });
                });
            }
        };
        $scope.init();

        function redirectToMain() {
            $rootScope.$broadcast("loadModule", $scope.currentModule);
            const menuList = JSON.parse(localStorage.getItem("menuList"));
            if (menuList == null || menuList == undefined) return;
            var menuByModule = menuList.filter((i) => i.modules.filter((j) => j.id == $scope.currentModule).length > 0);

            if (menuByModule.length > 0) {
                var menuData = menuByModule[0];
                localStorage.setItem("buttonData", "");
                localStorage.setItem("menuData", JSON.stringify({}));
                $rootScope.$broadcast("loadModule", $scope.currentModule);
            }
        }

        $scope.credentials = {
            firstname: $scope.user.user.firstname,
            lastname: $scope.user.user.lastname,
            phone: $scope.user.user.phone,
            email: $scope.user.user.email,
        };
        $scope.file1234 = null;
        $scope.intervalId = null;

        $scope.tabChange = function (tabType) {
            $scope.selectedItem = tabType;
            if (tabType == "email") {
                var $formValidate = $("#formEmail");
            }
            if (tabType == "info") {
                var $formValidate = $("#formInfo");
            }
            if (tabType == "password") {
                var $formValidate = $("#formPassword");
            }
            $formValidate.parsley().on("form:validated", function () {
                $scope.$apply();
            });
        };
        $scope.submitEmail = function (type = "") {
            if (type == "regenerate") $scope.regenerateLoader = true;
            else $scope.codeLoader = true;
            if ($scope.credentials.email) {
                mainService
                    .withResponse("post", "/api/user/change-contact", {
                        email: $scope.credentials.email,
                    })
                    .then(function (data) {
                        clearInterval($scope.intervalId);
                        if (type == "regenerate") $scope.regenerateLoader = false;
                        else $scope.codeLoader = false;
                        if (data.status === 200) {
                            $scope.isTimeout = false;
                            $rootScope.alert(true, "Таны имэйл хаяг руу баталгаажуулах код илгээгдлээ.");
                            var startTime = Date.now();
                            var duration = 60;
                            var startTime;
                            $scope.intervalId = setInterval(() => {
                                var second = Math.ceil(duration - (Date.now() - startTime) / 1000);
                                var minut = Math.floor(second / 60);
                                $(".timer").text(
                                    Math.max(0, minut) +
                                    ":" +
                                    Math.max(0, second % 60).toLocaleString("en-US", {
                                        minimumIntegerDigits: 2,
                                        useGrouping: false,
                                    })
                                );
                            }, 1000);
                            setTimeout(() => {
                                $scope.isTimeout = true;
                            }, 6000);
                        } else {
                            $rootScope.alert(false, "Бүртгэлтэй мэйл хаяг.");
                        }
                    });
            }
        };
        $scope.submitProfile = function () {
            if (
                ($scope.credentials.verifyPassword === $scope.credentials.newPassword &&
                    $scope.selectedItem == "password" &&
                    $scope.passChecker.lower &&
                    $scope.passChecker.upper &&
                    $scope.passChecker.symbol &&
                    $scope.passChecker.length &&
                    $scope.passChecker.number) ||
                ($scope.credentials.lastname.length > 0 && $scope.credentials.firstname.length > 0 && $scope.credentials.phone.length > 0 && $scope.selectedItem == "info")
            ) {
                if ($scope.selectedItem == "info" && $scope.file1234) {
                    $scope.uploadFile($scope.file1234, 1);
                }
                mainService.withResponse("put", "/api/user/change-info", $scope.credentials).then(function (data) {
                    if (data.status == 200) {
                        $scope.user.user.imgId = data.data.imgId;
                        $scope.user.user.firstname = data.data.firstname;
                        $scope.user.user.lastname = data.data.lastname;
                        localStorage.setItem("currentUser", JSON.stringify($scope.user));
                        $rootScope.alert(true, "Хэрэглэгчийн мэдээлэл амжилттай солигдлоо.");
                        redirectToMain();
                    } else {
                        $rootScope.alert(false, "Хэрэглэгчийн мэдээлэл баталгаажихад алдаа гарлаа.");
                    }
                });
            }
        };

        $scope.validatePassword = function () {
            if ($scope.credentials.newPassword) {
                $scope.passChecker.upper = /([A-Z])/.test($scope.credentials.newPassword);
                $scope.passChecker.lower = /([a-z])/.test($scope.credentials.newPassword);
                $scope.passChecker.symbol = /([!@#$%^&*()\\-_`.+,?/\"])/.test($scope.credentials.newPassword);
                $scope.passChecker.number = /[0-9]/.test($scope.credentials.newPassword);
                $scope.passChecker.length = /(.{8,})$/.test($scope.credentials.newPassword);
                return $scope.passChecker;
            } else {
                $scope.passChecker = {};
            }
        };
        $scope.validateCode = function () {
            var verifycode = "";
            $("#numberContainer > input").map(function (i, input) {
                verifycode += $(input).val().toString();
            });
            mainService.withResponse("post", "/api/user/validate-code", {code: verifycode}).then(function (data) {
                if (data.status == 200) {
                    $rootScope.alert(true, "Хэрэглэгчийн мэдээлэл амжилттай солигдлоо.");
                    $scope.user.user.emailVerified = data.data.emailVerified;
                    $scope.user.user.email = data.data.email;
                    localStorage.setItem("currentUser", JSON.stringify($scope.user));
                    redirectToMain();
                } else if (data.status === 418) {
                    $rootScope.alert(true, "Энэ баталгаажуулах кодын хүчинтэй хугаа /10 минут/ дууссан тул дахин код авна уу");
                } else {
                    $rootScope.alert(false, "Баталгаажуулах код буруу байна");
                }
            });
        };

        $scope.getUserAvatar = function ($files) {
            if ($files.length > 0) {
                if (!$scope.file1234) {
                    $scope.imgLoading = true;
                    setTimeout(() => {
                        $scope.imgLoading = false;
                        $scope.file1234 = $files[0];
                        $scope.uploadFile($scope.file1234, 1);
                        $("#previewAvatar").attr("src", URL.createObjectURL($files[0]));
                    }, 500);
                } else {
                    $scope.file1234 = $files[0];
                    $scope.uploadFile($scope.file1234, 1);
                    $("#previewAvatar").attr("src", URL.createObjectURL($files[0]));
                }
            }
        };
        $scope.uploadFile = function (file, y) {
            Upload.upload({
                url: "/api/file/uploadFile",
                data: {file: file},
            }).then(function (resp) {
                $scope.credentials.imgId = resp.data.id;
                $scope.user.user.imgId = resp.data.id;
                $scope.user.user.avatar = {uri: resp.data.uri};
                /*localStorage.removeItem("currentUser");
                $scope.user = resp.data;
                $timeout(function () {
                  localStorage.setItem(
                    "currentUser",
                    JSON.stringify({
                      username: resp.data.username,
                      id: resp.data.id,
                      user: resp.data,
                      token: $scope.token,
                      expires: $scope.expires,
                    })
                  );
                }, 0);
                $rootScope.alert(false, "Хэрэглэгчийн мэдээлэл амжилттай баталгаажлаа");
                $scope.selectedItem = "password";*/
            });
        };
    },
]);
