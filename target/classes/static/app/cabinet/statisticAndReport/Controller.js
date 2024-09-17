angular.module("altairApp")
    .controller("statisticAndReportCtrl", [
        "$rootScope",
        "$state",
        "$scope",
        "$timeout",
        "mainService",
        "commonDataSource",
        "sweet",
        "mainItem",
        "reportItem",
        "__env",
        function ($rootScope, $state, $scope, $timeout, mainService, commonDataSource, sweet, mainItem, reportItem, __env) {
            $scope.user = JSON.parse(localStorage.getItem("currentUser")).user;
            $scope.menuData = JSON.parse(localStorage.getItem("menuData"));
            $rootScope.budgetTp =localStorage.getItem("budgetCode");
            $("#header_main").attr("style", "filter: none !important;padding: 8px 25px");
            $rootScope.planYr = JSON.parse(localStorage.getItem("planYr"));
            console.log(mainItem);
            $scope.dataItem = mainItem.mainData[0];
            $scope.repeat = [1,2,3,4];
            $scope.selectedTab='tab2';
            $scope.tezData=[];
            $scope.tezCons=[];
            $scope.tezAmgs=[];
            $scope.districtData=[];
            $scope.visorData=[];
            $scope.activeTab=function (){
                if($scope.tezData.length>0){
                    $scope.selectedTab='tab2';
                }
                else if($scope.tezData.length===0 && $scope.tezCons.length>0){
                    $scope.selectedTab='tab3';
                }
                else if($scope.tezData.length===0 && $scope.tezCons.length===0 && $scope.tezAmgs.length>0){
                    $scope.selectedTab='tab4';
                }
                else if($scope.tezData.length===0 && $scope.tezCons.length===0 && $scope.tezAmgs.length===0 && $scope.districtData.length>0){
                    $scope.selectedTab='tab5';
                }
                else if($scope.tezData.length===0 && $scope.tezCons.length===0 && $scope.tezAmgs.length===0 && $scope.districtData.length===0 && $scope.visorData.length>0){
                    $scope.selectedTab='tab6';
                }
            }
            $scope.initCarousel = function (id) {
                $('#'+id).owlCarousel({
                    loop:true,
                    margin:10,
                    responsive:{
                        0:{
                            items:1
                        },
                        600:{
                            items:2
                        },
                        1000:{
                            items:4
                        }
                    }
                });
            };
            $scope.fromData = JSON.parse(localStorage.getItem("fromData"));

            var orgId = JSON.parse(localStorage.getItem("currentUser")).user.orgId;
            var planYr = JSON.parse(localStorage.getItem("planYr"));

            $scope.loadData=function (orgId,planYr){
                mainService.withdata("get", __env.apiUrl() + "/api/admin/v1/multiple/cab-stat-report/"+planYr+'/'+orgId).then(function (data) {
                    $scope.userReports=data;
                    $timeout(function () {
                        $scope.initCarousel("inv-carousel");
                    });
                });
            }

            $scope.loadData(orgId,planYr);

            $scope.chartData = reportItem.mainData;
            $timeout(function (){
                if ($scope.chartData!=null) {
                    am4core.ready(function () {
                        if ($("#chartDivMonthly").length === 0) {
                            return;
                        }
                        am4core.unuseTheme();
                        function am4themes_myTheme(target) {
                            if (target instanceof am4core.ColorSet) {
                                target.list = [am4core.color("#303887"), am4core.color("#97979f")];
                            }
                        }

                        am4core.useTheme(am4themes_myTheme);
                        var chart = am4core.create("chartDivMonthly", am4charts.XYChart);
                        if (chart.logo) {
                            chart.logo.disabled = true;
                        }
                        chart.data = $scope.chartData;

                        /* Create axes */
                        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
                        categoryAxis.dataFields.category = "month";
                        categoryAxis.renderer.minGridDistance = 30;
                        // categoryAxis.renderer.label.fontSize = 15;

                        /* Create value axis */
                        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

                        /* Create series */
                        var columnSeries = chart.series.push(new am4charts.ColumnSeries());
                        columnSeries.name = "Нийт";
                        columnSeries.dataFields.valueY = "totalCnt";
                        columnSeries.dataFields.categoryX = "month";

                        columnSeries.columns.template.tooltipText = "[#fff font-size: 15px]{categoryX}\n[#fff font-size: 13px]{name}:\n[/][#fff font-size: 20px]{valueY}[/] [#fff]{additional}[/]"
                        columnSeries.tooltip.label.textAlign = "middle";
                        var gradient = new am4core.LinearGradient();
                        gradient.addColor(am4core.color("#2563eb"));
                        gradient.addColor(am4core.color("#1e3a8a"));
                        gradient.rotation = 270;
                        columnSeries.columns.template.width = 20;
                        columnSeries.columns.template.fill = gradient;
                        columnSeries.columns.template.column.cornerRadiusTopLeft = 25;
                        columnSeries.columns.template.column.cornerRadiusTopRight = 25;

                        var lineSeries = chart.series.push(new am4charts.LineSeries());
                        lineSeries.name = "Баталсан";
                        lineSeries.dataFields.valueY = "cnt";
                        lineSeries.dataFields.categoryX = "month";

                        lineSeries.stroke = am4core.color("#059669");
                        lineSeries.strokeWidth = 5;
                        lineSeries.propertyFields.strokeDasharray = "lineDash";
                        lineSeries.tooltip.label.textAlign = "middle";

                        let bullet = lineSeries.bullets.push(new am4charts.Bullet());
                        bullet.copyToLegendMarker = false;
                        let square = bullet.createChild(am4core.RoundedRectangle);
                        square.copyToLegendMarker = false;
                        square.width = 50;
                        square.height = 25;
                        square.cornerRadius(20, 20, 20, 20);
                        square.horizontalCenter = "middle";
                        square.verticalCenter = "middle";
                        square.fill = am4core.color("#D1FAE5");
                        var labelBullet = lineSeries.bullets.push(new am4charts.LabelBullet());
                        labelBullet.fill = am4core.color("#059669"); // tooltips grab fill from parent by default
                        labelBullet.tooltipText = "[#fff font-size: 13px]{categoryY}\n{name}:\n[/][#fff font-size: 20px]{valueY}[/] [#fff]{additional}[/]"
                        labelBullet.label.text = "{valueY}";

                        chart.legend = new am4charts.Legend();
                        chart.legend.position = "bottom";
                        chart.legend.width = 800;
                        chart.legend.markers.template.width = 20;
                        chart.legend.markers.template.height = 8;
                    });
                }
            },500);
        },
    ]);
