am4core.useTheme(am4themes_animated);

angular.module("chart", [])
    .directive("chart1", function () {
        return {
            restrict: "E",
            scope: {},
            template: "<div id='chartdiv1'></div>",
            replace: true,
            link: function ($scope) {
                var chart = am4core.create("chartdiv1", am4charts.XYChart3D);

                chart.paddingRight = 20;

                // Add data
                chart.data = [{
                    "year": "Ерөнхий сайд",
                    "income": 14231.2,
                    "color": chart.colors.next()
                }, {
                    "year": "Шадар сайд",
                    "income": 6363.60,
                    "color": chart.colors.next()
                }, {
                    "year": "ЗГХЭГ-ын сайд",
                    "income": 38713.98,
                    "color": chart.colors.next()
                }, {
                    "year": "БОАЖС",
                    "income": 13776.20,
                    "color": chart.colors.next()
                }, {
                    "year": "Гадаад харилцааны сайд",
                    "income": 2875.00,
                    "color": chart.colors.next()
                },
                    {
                        "year": "Сангийн сайд",
                        "income": 134386.31,
                        "color": chart.colors.next()
                    }, {
                        "year": "ХЗДХ-ийнсайд",
                        "income": 42883.35,
                        "color": chart.colors.next()
                    }, {
                        "year": "ХНХ-ийн сайд",
                        "income": 33895.40,
                        "color": chart.colors.next()
                    }, {
                        "year": "Батлан хамгаалахын сайд",
                        "income": 15499.70,
                        "color": chart.colors.next()
                    }, {
                        "year": "БХБ-ын сайд",
                        "income": 141350.13,
                        "color": chart.colors.next()
                    },
                    {
                        "year": "БСШУС-ын сайд",
                        "income": 616453.75,
                        "color": chart.colors.next()
                    }, {
                        "year": "ЗТХ-ийн сайд",
                        "income": 241781.92,
                        "color": chart.colors.next()
                    }, {
                        "year": "УУХҮ-ийн сайд",
                        "income": 2000.00,
                        "color": chart.colors.next()
                    }, {
                        "year": "ХХААХҮ-ийн сайд",
                        "income": 29533.00,
                        "color": chart.colors.next()
                    }, {
                        "year": "Эрчим хүчний сайд",
                        "income": 97150.32,
                        "color": chart.colors.next()
                    },
                    {
                        "year": "Эрүүл мэндийн сайд",
                        "income": 104237.91,
                        "color": chart.colors.next()
                    }
                ];

                // Create axes
                var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
                categoryAxis.dataFields.category = "year";
                categoryAxis.numberFormatter.numberFormat = "#";
                categoryAxis.renderer.inversed = true;

                var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());

                valueAxis.title.text = "2019 онд батлагдсан санхүүжилт /сая ₮/, салбараар";
                valueAxis.title.fontWeight = "bold";

                var series = chart.series.push(new am4charts.ColumnSeries3D());
                series.dataFields.valueX = "income";
                series.dataFields.categoryY = "year";
                series.name = "Income";
                series.columns.template.propertyFields.fill = "color";
                series.columns.template.tooltipText = "{valueX}";
                series.columns.template.column3D.stroke = am4core.color("#fff");
                series.columns.template.column3D.strokeOpacity = 0.2;

                var columnTemplate = series.columns.template;
                columnTemplate.strokeOpacity = 0;
                columnTemplate.propertyFields.fill = "color";

                var label = columnTemplate.createChild(am4core.Label);
                label.text = "{valueX.formatNumber('#,##')} сая(₮)";
                label.align = "right";
                label.valign = "middle";
            }
        };
    })
    .directive("chart2", function () {
        return {
            restrict: "E",
            scope: {},
            template: "<div id='chartdiv'></div>",
            replace: true,
            link: function ($scope) {
                var chart = am4core.create("chartdiv", am4charts.XYChart);
                chart.hiddenState.properties.opacity = 0;
                chart.data = [
                    {
                        country: "Архангай",
                        visits: 42008.29

                    },
                    {
                        country: "Баян-Өлгий\n",
                        visits: 33561.85

                    },
                    {
                        country: "Баянхонгор\n",
                        visits: 44186.65

                    },
                    {
                        country: "Булган\n",
                        visits: 18979.79

                    },
                    {
                        country: "Говь-Алтай\n",
                        visits: 34260.50

                    },
                    {
                        country: "Говьсүмбэр\n",
                        visits: 12300.00

                    },
                    {
                        country: "Дархан-Уул\n",
                        visits: 37664.40

                    },
                    {
                        country: "Дорноговь\n",
                        visits: 35962.40

                    },
                    {
                        country: "Дорнод\n",
                        visits: 28534.27

                    },
                    {
                        country: "Дундговь\n",
                        visits: 21992.00

                    },
                    {
                        country: "Завхан\n",
                        visits: 38898.38

                    },
                    {
                        country: "Орхон",
                        visits: 36028.70

                    },
                    {
                        country: "Өвөрхангай\n",
                        visits: 45450.00


                    },
                    {
                        country: "Өмнөговь\n",
                        visits: 27477.40


                    },
                    {
                        country: "Сүхбаатар\n",
                        visits: 27103.55


                    },
                    {
                        country: "Сэлэнгэ\n",
                        visits: 44997.80


                    },
                    {
                        country: "Төв\n",
                        visits: 34999.90


                    },
                    {
                        country: "Увс\n",
                        visits: 51464.80


                    },
                    {
                        country: "Улаанбаатар\n",
                        visits: 544597.42


                    },
                    {
                        country: "Улсын хэмжээнд\n",
                        visits: 227283.76


                    },
                    {
                        country: "Ховд\n",
                        visits: 57268.95


                    },
                    {
                        country: "Хөвсгөл\n",
                        visits: 49219.62


                    },
                    {
                        country: "Хэнтий\n",
                        visits: 50380.14
                    }
                ];


                var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
                categoryAxis.title.text = "2019 онд батлагдсан санхүүжилт /сая ₮/, аймгаар";
                categoryAxis.title.fontWeight = "bold";
                categoryAxis.title.valign = "top";
                categoryAxis.title.size = 50;
                categoryAxis.renderer.grid.template.location = 0;
                categoryAxis.dataFields.category = "country";
                categoryAxis.renderer.labels.template.rotation = 270;
                categoryAxis.renderer.labels.template.hideOversized = false;
                categoryAxis.renderer.minGridDistance = 20;
                categoryAxis.renderer.labels.template.horizontalCenter = "right";
                categoryAxis.renderer.labels.template.verticalCenter = "middle";
                categoryAxis.tooltip.label.rotation = 270;
                categoryAxis.tooltip.label.horizontalCenter = "right";
                categoryAxis.tooltip.label.verticalCenter = "middle";
                var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
                valueAxis.min = 0;
                valueAxis.max = 550000;
                valueAxis.strictMinMax = true;
                valueAxis.renderer.minGridDistance = 30;


                var axisBreak = valueAxis.axisBreaks.create();
                axisBreak.startValue = 30000;
                axisBreak.endValue = 400000;
                axisBreak.breakSize = 0.005;

                var hoverState = axisBreak.states.create("hover");
                hoverState.properties.breakSize = 1;
                hoverState.properties.opacity = 0.1;
                hoverState.transitionDuration = 1500;

                axisBreak.defaultState.transitionDuration = 1000;


                var series = chart.series.push(new am4charts.ColumnSeries());
                series.dataFields.categoryX = "country";
                series.dataFields.valueY = "visits";
                series.columns.template.tooltipText = "{valueY.value}";
                series.columns.template.tooltipY = 0;
                series.columns.template.strokeOpacity = 0;

                var columnTemplate = series.columns.template;
                columnTemplate.strokeOpacity = 0;
                columnTemplate.propertyFields.fill = "color";

                var label = columnTemplate.createChild(am4core.Label);
                label.text = "{valueY.formatNumber('#,##')}";
                label.align = "center";
                label.valign = "middle";

                series.columns.template.adapter.add("fill", function (fill, target) {
                    return chart.colors.getIndex(target.dataItem.index);
                })
            }
        };
    })
    .directive("chart3", function () {
        return {
            restrict: "E",
            scope: {},
            template: "<div id='chart3div'></div>",
            replace: true,
            link: function ($scope) {
                var chart = am4core.create("chart3div", am4charts.XYChart);
                chart.hiddenState.properties.opacity = 0;
                chart.exporting.menu = new am4core.ExportMenu();
                var data = [
                   /* {
                    "year": "2013",
                    "income": 1174.3
                    ,
                    "expenses": 789.1

                }, {
                    "year": "2014",
                    "income": 1179.5
                    ,
                    "expenses": 969.5

                }, {
                    "year": "2015",
                    "income": 357.9,
                    "expenses": 247

                },*/ {
                    "year": "2016",
                    "income": 1047.3,
                    "expenses": 976.1

                }, {
                    "year": "2017",
                    "income": 779.3,
                    "expenses": 715.4
                },
                    {
                        "year": "2018",
                        "income": 766.2,
                        "expenses": 659.4
                    },
                    {
                        "year": "2019",
                        "income": 1698.1,
                        "expenses": 1560.4
                    },
                    {
                        "year": "2020",
                        "income": 2152.4,
                        "strokeWidth": 1,
                        "columnDash": "5,5",
                        //"fillOpacity": 0.2,
                        "additional": "(projection)"
                    }];

                /* Create axes */
                var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
                categoryAxis.dataFields.category = "year";
              //  categoryAxis.renderer.minGridDistance = 30;
                categoryAxis.renderer.grid.template.location = 0;
                categoryAxis.title.text = "Улсын төсвийн хөрөнгө оруулалт /2013-2020 он, батлагдсан санхүүжилт, гүйцэтгэл, тэрбум төгрөг";
                categoryAxis.title.fontWeight = "bold";
                categoryAxis.title.valign = "top";
                categoryAxis.title.size = 50;

                /* Create value axis */
                var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
                valueAxis.renderer.inside = true;
                valueAxis.renderer.labels.template.disabled = true;
                valueAxis.min = 0;

                /* Create series */
                var columnSeries = chart.series.push(new am4charts.ColumnSeries());
                columnSeries.name = "Батлагдсан";
                columnSeries.dataFields.valueY = "income";
                columnSeries.dataFields.categoryX = "year";
                columnSeries.fillOpacity = 0.8;
                columnSeries.sequencedInterpolation = true;
                columnSeries.interpolationDuration = 1500;

                columnSeries.columns.template.tooltipText = "[#fff font-size: 15px]{name} in {categoryX}:\n[/][#fff font-size: 20px]{valueY}[/] [#fff]{additional}[/]"
                columnSeries.columns.template.propertyFields.fillOpacity = "fillOpacity";
                columnSeries.columns.template.propertyFields.stroke = "stroke";
                columnSeries.columns.template.propertyFields.strokeWidth = "strokeWidth";
                columnSeries.columns.template.propertyFields.strokeDasharray = "columnDash";
                columnSeries.tooltip.label.textAlign = "middle";

                var lineSeries = chart.series.push(new am4charts.LineSeries());
                lineSeries.name = "Гүйцэтгэл";
                lineSeries.dataFields.valueY = "expenses";
                lineSeries.dataFields.categoryX = "year";

                lineSeries.stroke = am4core.color("#fdd400");
                lineSeries.strokeWidth = 3;
                lineSeries.propertyFields.strokeDasharray = "lineDash";
                lineSeries.tooltip.label.textAlign = "middle";

                var columnTemplate = columnSeries.columns.template;
                columnTemplate.strokeOpacity = 0;
                columnTemplate.propertyFields.fill = "color";

                var label = columnTemplate.createChild(am4core.Label);
                label.text = "{valueY.formatNumber('#,##')} сая(₮)";
                label.align = "center";
                label.valign = "middle";

                var bullet = lineSeries.bullets.push(new am4charts.Bullet());
                bullet.fill = am4core.color("#fdd400"); // tooltips grab fill from parent by default
                bullet.tooltipText = "[#fff font-size: 15px]{name} in {categoryX}:\n[/][#fff font-size: 20px]{valueY}[/] [#fff]{additional}[/]"
                var circle = bullet.createChild(am4core.Circle);
                circle.radius = 4;
                circle.fill = am4core.color("#fff");
                circle.strokeWidth = 3;

                chart.data = data;

                chart.cursor = new am4charts.XYCursor();
                chart.cursor.behavior = "none";
            }
        };
    })
    .directive("chart4", function () {
        return {
            restrict: "E",
            scope: {},
            template: "<div id='chart4div'></div>",
            replace: true,
            link: function ($scope) {
                var chartData = {
                    "2020": [
                        { "sector": "I. Барилга байгууламж", "size": 1485277.7},
                        { "sector": "II. Их засвар", "size": 134018.7},
                        { "sector": "III. Тоног төхөөрөмж", "size": 205948.1 },
                        { "sector": "IV. ТЭЗҮ", "size": 3685.7}]
                };

                var chart = am4core.create("chart4div", am4charts.PieChart);

                chart.data = [
                    { "sector": "I. Барилга байгууламж", "size": 1485277.7},
                    { "sector": "II. Их засвар", "size": 134018.7},
                    { "sector": "III. Тоног төхөөрөмж", "size": 205948.1 },
                    { "sector": "IV. ТЭЗҮ", "size": 3685.7}
                ];

                chart.innerRadius = 100;
                var label = chart.seriesContainer.createChild(am4core.Label);
                label.text = "2020";
                label.horizontalCenter = "middle";
                label.verticalCenter = "middle";
                label.fontSize = 50;

       /*         var pieSeries = chart.series.push(new am4charts.PieSeries());
                pieSeries.dataFields.value = "size";
                pieSeries.dataFields.category = "sector";*/


                var pieSeries = chart.series.push(new am4charts.PieSeries());
                pieSeries.dataFields.value = "size";
                pieSeries.dataFields.category = "sector";

                pieSeries.ticks.template.disabled = true;
                pieSeries.alignLabels = false;
                pieSeries.labels.template.text = "{value.percent.formatNumber('#.0')}%";
                pieSeries.labels.template.radius = am4core.percent(-40);
                pieSeries.labels.template.fill = am4core.color("white");
                pieSeries.labels.template.relativeRotation = 90;

                pieSeries.labels.template.adapter.add("radius", function(radius, target) {
                    if (target.dataItem && (target.dataItem.values.value.percent < 10)) {
                        return 0;
                    }
                    return radius;
                });

                pieSeries.labels.template.adapter.add("fill", function(color, target) {
                    if (target.dataItem && (target.dataItem.values.value.percent < 10)) {
                        return am4core.color("#000");
                    }
                    return color;
                });

                chart.legend = new am4charts.Legend();

                var currentYear = 2019;
            }
        };
    })
    .directive("chart5", function () {
        return {
            restrict: "E",
            scope: {},
            template: "<div id='chart5div'></div>",
            replace: true,
            link: function ($scope) {
                var chart = am4core.create("chart5div", am4charts.XYChart);
                chart.scrollbarX = new am4core.Scrollbar();
                chart.data = [
                    {
                        country: "Дотуур байр",
                        visits: 43

                    },
                    {
                        country: "Инженерийн шугам сүлжээ",
                        visits: 3

                    },
                    {
                        country: "Соёл, спортын төв",
                        visits: 6

                    },
                    {
                        country: "Соёлын төв",
                        visits: 56

                    },
                    {
                        country: "Сургууль",
                        visits: 120

                    },
                    {
                        country: "Цэцэрлэг",
                        visits: 110

                    },
                    {
                        country: "Авто зам",
                        visits: 75

                    },
                    {
                        country: "Гүүрийн байгууламж",
                        visits: 25

                    },
                    {
                        country: "Дулааны станц",
                        visits: 2

                    },
                    {
                        country: "Дулааны шугам сүлжээ",
                        visits: 4

                    },
                    {
                        country: "Цахилгаан түгээх сүлжээ",
                        visits: 7

                    },
                    {
                        country: "Цахилгаан хангамж\n",
                        visits: 5

                    },
                    {
                        country: "ЦДАШ",
                        visits: 15


                    },
                    {
                        country: "Эмнэлэг",
                        visits: 71
                    }
                ];


                // Create axes
                var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
                categoryAxis.dataFields.category = "country";
                categoryAxis.renderer.grid.template.location = 0;
                categoryAxis.renderer.minGridDistance = 30;
                categoryAxis.renderer.labels.template.horizontalCenter = "right";
                categoryAxis.renderer.labels.template.verticalCenter = "middle";
                categoryAxis.renderer.labels.template.rotation = 270;
                categoryAxis.tooltip.disabled = true;
                categoryAxis.renderer.minHeight = 110;
                categoryAxis.title.text = "Улсын төсвийн хөрөнгө оруулалтаар 2020 онд хэрэгжих төслийн тоо";
                categoryAxis.title.fontWeight = "bold";
                categoryAxis.title.valign = "top";
                categoryAxis.title.size = 50;
                var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
                valueAxis.renderer.minWidth = 50;

// Create series
                var series = chart.series.push(new am4charts.ColumnSeries());
                series.sequencedInterpolation = true;
                series.dataFields.valueY = "visits";
                series.dataFields.categoryX = "country";
                series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
                series.columns.template.strokeWidth = 0;

                series.tooltip.pointerOrientation = "vertical";

                series.columns.template.column.cornerRadiusTopLeft = 10;
                series.columns.template.column.cornerRadiusTopRight = 10;
                series.columns.template.column.fillOpacity = 0.8;


                var columnTemplate = series.columns.template;
                columnTemplate.strokeOpacity = 0;
                columnTemplate.propertyFields.fill = "color";

                var label = columnTemplate.createChild(am4core.Label);
                label.text = "{valueY.formatNumber('#,##')} ";
                label.align = "center";
                label.valign = "middle";


// on hover, make corner radiuses bigger
                var hoverState = series.columns.template.column.states.create("hover");
                hoverState.properties.cornerRadiusTopLeft = 0;
                hoverState.properties.cornerRadiusTopRight = 0;
                hoverState.properties.fillOpacity = 1;

                series.columns.template.adapter.add("fill", function(fill, target) {
                    return chart.colors.getIndex(target.dataItem.index);
                });

// Cursor
                chart.cursor = new am4charts.XYCursor();
            }
        };
    })