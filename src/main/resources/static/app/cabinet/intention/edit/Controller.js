angular.module("altairApp")
    .controller("intentionComponentCtrl", [
        "$rootScope",
        "$state",
        "$scope",
        "$timeout",
        "mainService",
        "commonDataSource",
        "sweet",
        "Upload",
        "__env",
        function ($rootScope, $state, $scope, $timeout, mainService, commonDataSource, sweet, Upload, __env) {
            $scope.user = JSON.parse(sessionStorage.getItem("currentUser")).user;
            $("#header_main").attr("style", "filter: none !important;padding: 8px 25px");
            $scope.menuData = JSON.parse(sessionStorage.getItem("menuData"));

            $("#datepicker").kendoDatePicker({
                // Add some basic configuration.
                //value: new Date(2022, 0, 3),
                format: "yyyy-MM-dd",
                rounded: "large",
                size: "large"
            });

            $scope.main= {
                zoriltList:[
                    {zorilt:"zorilt", negj:1,
                        argaKhemjeeList:[
                            {argaKhemjee:"arga khemjee",parendId:null,
                                tuvshinList:[
                                    {firstHalf:"", secondHalf:"", startDt:'', endDt:'', shalguurUzuulelt:'', suuriUzuulelt:''}
                                ],
                            },
                        ],
                    },
                ],
                medlegList:[
                    {argaKhemjee:"arga khemjee",parendId:null,
                        tuvshinList:[
                            {firstHalf:"", secondHalf:"", startDt:'', endDt:'', shalguurUzuulelt:'', suuriUzuulelt:''}
                        ],
                    },
                ]
            };

            // main list add and remove
            $scope.add1=function (){
                console.log("maaaiii");
                $scope.main.zoriltList.push(
                    {zorilt:"zorilt", negj:1,
                    argaKhemjeeList:[
                        {argaKhemjee:"arga khemjee",parentId:null,
                            tuvshinList:[
                                {firstHalf:"", secondHalf:"", startDt:'', endDt:'', shalguurUzuulelt:'', suuriUzuulelt:''}
                                ],
                            },
                        ],
                    }
                );
            };

            // main list remove
            $scope.remove1=function (index){
                console.log(index);
                $scope.main.zoriltList.splice(index, 1);
            };


            // second list add and remove
            $scope.add2=function (parIndex,index){
                console.log(parIndex," ssssss ", index);
                $scope.main.zoriltList[parIndex].argaKhemjeeList.push(
                    {argaKhemjee:"arga khemjee",parentId:null,
                        tuvshinList:[
                            {firstHalf:"", secondHalf:"", startDt:'', endDt:'', shalguurUzuulelt:'', suuriUzuulelt:''}
                        ],
                    },
                );
            };

            $scope.remove2=function (parIndex, index){
                console.log(parIndex,"   ggg   ",index);
                //console.log($scope.main.zoriltList[parIndex]);
                $scope.main.zoriltList[parIndex].argaKhemjeeList.splice(index, 1);
            };

            // second list sub add and remove
            $scope.addSub=function (parIndex){
                console.log(parIndex," ssssss ");
                $scope.main.zoriltList[parIndex].argaKhemjeeList.push(
                    {argaKhemjee:"arga khemjee",parentId:0,
                        tuvshinList:[
                            {firstHalf:"", secondHalf:"", startDt:'', endDt:'', shalguurUzuulelt:'', suuriUzuulelt:''}
                        ],
                    },
                );
            };

            $scope.removeSub=function (parIndex, index){
                console.log(parIndex,"   ggg   ",index);
                //console.log($scope.main.zoriltList[parIndex]);
                $scope.main.zoriltList[parIndex].argaKhemjeeList.splice(index, 1);
            };

            // third list add and remove
            $scope.add3=function (parParIndex,parIndex){
                $scope.main.zoriltList[parParIndex].argaKhemjeeList[parIndex].tuvshinList.push(
                    {firstHalf:"", secondHalf:"", startDt:'', endDt:'', shalguurUzuulelt:'', suuriUzuulelt:''}
                );
            };

            $scope.remove3=function (parParIndex,parIndex, index){
                $scope.main.zoriltList[parParIndex].argaKhemjeeList[parIndex].tuvshinList.splice(index, 1);
            };

            // fourth list add and remove
            $scope.add4=function (index){
                $scope.main.medlegList.push(
                    {argaKhemjee:"arga khemjee",parentId:null,
                        tuvshinList:[
                            {firstHalf:"", secondHalf:"", startDt:'', endDt:'', shalguurUzuulelt:'', suuriUzuulelt:''}
                        ],
                    },
                );
            };

            $scope.remove4=function (index){
                $scope.main.medlegList.splice(index, 1);
            };

            // fourth list sub add and remove
            $scope.add4Sub=function (index){
                $scope.main.medlegList.push(
                    {argaKhemjee:"arga khemjee",parentId:0,
                        tuvshinList:[
                            {firstHalf:"", secondHalf:"", startDt:'', endDt:'', shalguurUzuulelt:'', suuriUzuulelt:''}
                        ],
                    },
                );
            };

            $scope.remove4Sub=function (index){
                $scope.main.medlegList.splice(index, 1);
            };

            // fifth list add and remove
            $scope.add5=function (parIndex,index){
                $scope.main.medlegList[parIndex].tuvshinList.push(
                    {firstHalf:"", secondHalf:"", startDt:'', endDt:'', shalguurUzuulelt:'', suuriUzuulelt:''}
                );
            };

            $scope.remove5=function (parIndex, index){
                $scope.main.medlegList[parIndex].tuvshinList.splice(index, 1);
            };
        },
    ]);
