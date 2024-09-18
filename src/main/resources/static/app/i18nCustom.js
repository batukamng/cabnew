angular
    .module('app.i18n', ['pascalprecht.translate'])
    .config(['$translateProvider', function ($translateProvider) {
        $translateProvider
            .useLoader('asyncLoader')
            .preferredLanguage('mn')
            .useSanitizeValueStrategy('escape');
    }])
    .controller(
        'LangCtrl',
        [
            '$rootScope',
            '$scope',
            '$translate',
            '__env',
            function ($rootScope, $scope, $translate, __env) {
                $scope.changeLanguage = function (langKey) {
                    $translate.use(langKey);
                };
                // language switcher
                var storeLang = sessionStorage.getItem('lang');
              //  $scope.langSwitcherModel = storeLang != null ? storeLang : 'mn';

                $scope.langSwitcherOptions = JSON.parse(sessionStorage.getItem('lang'));
                var langData = [];
                angular.forEach($scope.langSwitcherOptions, function(value, key) {
                    langData.push(value);
                });

                if(langData.length>0 && langData[0].name!==undefined){
                    $scope.langSwitcherModel=langData[0].name;
                }

                $scope.langSwitcherConfig = {
                    maxItems: 1,
                    render: {
                        option: function (langData, escape) {
                            return '<div class="option">' +
                                '<i class="item-icon flag-' + escape(langData.icon).toUpperCase() + '"></i>' +
                               /* '<span>' + escape(langData.abbr) + '</span>' +*/
                                '</div>';
                        },
                        item: function (langData, escape) {
                            return '<div class="item"><i class="item-icon flag-' + escape(langData.icon).toUpperCase() + '"></i></div>';
                        }
                    },
                    valueField: 'name',
                    labelField: 'name',
                    searchField: 'name',
                    create: false,
                    onInitialize: function (selectize) {
                        $('#lang_switcher').next().children('.selectize-input').find('input').attr('readonly', true);
                    },
                    onChange: function (value) {
                        console.log(value);
                        switch (value) {
                            case 'en':
                                $translate.use('en');
                                break;
                            case 'mn':
                                $translate.use('mn');
                                break;
                            case 'kr':
                                $translate.use('kr');
                                break;
                        }
                    }
                };
            }
        ]
    );

