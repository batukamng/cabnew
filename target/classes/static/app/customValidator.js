angular
    .module('altairApp')
    .controller(
        'customValCtrl',
        [
            '$rootScope',
            '$scope',
            '__env',
            function ($rootScope, $scope, $translate, __env) {

                var $formValidate = $('#form_validation_user');
                $formValidate
                    .parsley({
                        'excluded': 'input[type=button], input[type=submit], input[type=reset], input[type=hidden], .selectize-input > input, .md-input.selectized'
                    })
                    .on('form:validated', function () {
                        $scope.$apply();
                    })
                    .on('field:validated', function (parsleyField) {
                        if ($(parsleyField.$element).hasClass('md-input') || $(parsleyField.$element).is('select')) {
                            $scope.$apply();
                        }
                    });

                var $formValidatePass = $('#form_validation_password');
                $formValidatePass
                    .parsley({
                        'excluded': 'input[type=button], input[type=submit], input[type=reset], input[type=hidden], .selectize-input > input, .md-input.selectized'
                    })
                    .on('form:validated', function () {
                        $scope.$apply();
                    })
                    .on('field:validated', function (parsleyField) {
                        if ($(parsleyField.$element).hasClass('md-input') || $(parsleyField.$element).is('select')) {
                            $scope.$apply();
                        }
                    });
            }
        ]
    );

