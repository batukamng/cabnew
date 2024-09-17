altairApp
    .filter('unique', function() {
        return function (arr, field) {
            var o = {}, i, l = arr.length, r = [];
            for(i=0; i<l;i+=1) {
              o[arr[i][field]] = arr[i];
            }
            for(i in o) {
              r.push(o[i]);
            }
            if (r.length > 0) {
//                r[0].selected = true;
            }
            return r;
        };
    })
    .filter('groupBy', function(){
        return function(list, group_by) {

            var filtered = [];
            var prev_item = null;
            var group_changed = false;
            // this is a new field which is added to each item where we append "_CHANGED"
            // to indicate a field change in the list
            var new_field = group_by + '_CHANGED';

            // loop through each item in the list
            angular.forEach(list, function(item) {

                group_changed = false;

                // if not the first item
                if (prev_item !== null) {

                    // check if the group by field changed
                    if (prev_item[group_by] !== item[group_by]) {
                        group_changed = true;
                    }

                    // otherwise we have the first item in the list which is new
                } else {
                    group_changed = true;
                }

                // if the group changed, then add a new field to the item
                // to indicate this
                if (group_changed) {
                    item[new_field] = true;
                } else {
                    item[new_field] = false;
                }

                filtered.push(item);
                prev_item = item;

            });

            return filtered;
        }
    })
    .filter('unsafe', function($sce) { return $sce.trustAsHtml; })
    .filter('num', function() {
        return function(input) {
            return parseInt(input, 10);
        }
    })
    .filter("dateParser", function(input){
        return function(input){
            var aux = input.planPublishDate.split(/[- :]/);
            return new Date(aux[0], aux[1]-1, aux[2], aux[3], aux[4], aux[5]);
        }
    })
    .filter('sumOfValue', function () {
        return function (data, key) {
            if (angular.isUndefined(data) || angular.isUndefined(key))
                return 0;
            var sum = 0;
            angular.forEach(data,function(value){
                sum = sum + parseFloat(value[key]);
            });
            return sum;
        }
    })
    .filter('sumOfAmount', function () {
        return function (data, key) {
            if (angular.isUndefined(data) || angular.isUndefined(key))
                return 0;
            var sum = 0;
            angular.forEach(data,function(value){
                if(value.useYn){
                    sum = sum + parseFloat(value[key]);
                }
            });
            return sum;
        }
    })
    .filter('totalSumPriceQty', function () {
        return function (data, key1, key2) {
            if (angular.isUndefined(data) || angular.isUndefined(key1)  || angular.isUndefined(key2))
                return 0;
            var sum = 0;
            angular.forEach(data,function(value){
                sum = sum + (parseInt(value[key1], 10) * parseInt(value[key2], 10));
            });
            return sum;
        }
    })
    .filter('multiSelectFilter', function () {
        return function (items, filterData) {
            if(filterData == undefined)
                return items;
            var keys = Object.keys(filterData);
            var filtered = [];
            var populate = true;

            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                populate = true;
                for(var j = 0; j < keys.length ; j++){
                    if(filterData[keys[j]] != undefined){
                        if(filterData[keys[j]].length == 0 || filterData[keys[j]].contains(item[keys[j]])){
                            populate = true;
                        } else {
                            populate = false;
                            break;
                        }
                    }
                }
                if(populate){
                    filtered.push(item);
                }
            }
            return filtered;
        };
    })
    .filter("jsonDate", function() {
        return function(x) {
            if(x) return new Date(x);
            else return null;
        };
    })
    .filter("momentDate", function() {
        return function(x,date_format_i,date_format_o) {
            if(x) {
                if(date_format_i) {
                    return moment(x, date_format_i).format(date_format_o)
                } else {
                    return moment(new Date(x)).format(date_format_o)
                }
            }
            else return null;
        };
    })
    .filter("initials", function() {
        return function(x) {
            if(x) {
                return x.split(' ').map(function (s) {
                    return s.charAt(0);
                }).join('');
            } else {
                return null;
            }
        };
    })
    .filter('reverseOrder', function() {
        return function(items) {
            return items.slice().reverse();
        };
    })
    .filter("trust", ['$sce', function($sce) {
        return function(htmlCode){
            return $sce.trustAsHtml(htmlCode);
        }
    }])
    .filter('words', function () {
        function isInteger(x) {
            return x % 1 === 0;
        }
        return function (value) {
            if (value){
                if (isInteger(value)){
                    return toWords(value, true) + " төгрөг";
                }
                else{
                    var buhel = parseInt(value), butarhai = Math.round(value%1*100);
                    return toWords(buhel, true) + " төгрөг " + ((butarhai > 0) ? (toWords(butarhai, true) + " мөнгө") : "");
                }
            }
            return value;
        }
    });

function toWords(n, b) {
    var a = '.нэг.хоёр.гурав.дөрөв.тав.зургаа.долоо.найм.ес.арав.хорь.гуч.дөч.тавь.жар.дал.ная.ер.нэгэн.хоёр.гурван.дөрвөн.таван.зургаан.долоон.найман.есөн.арван.хорин.гучин.дөчин.тавин.жаран.далан.наян.ерэн.зуу.зуун.мянга.сая.тэрбум.их наяд.тэг'.split('.'),
        k = -1, r = [], p = b ? 18 : 0, fn = function (r, i, j, b) {
            var w = [], h, t, n;
            if (i) {
                h = Math.floor(i / 100);
                t = Math.floor(i % 100 / 10);
                n = i % 10;
                if (h) {
                    //console.log(a[h + 18]);
                    //w.push(a[h == 1 ? parseInt(b) : h + 18]);
                    w.push(a[h == 1 ? 1 : h + 18]);
                    w.push(a[!t && !n && !j && !p ? 37 : 38])
                }
                if (t){
                    w.push(a[t + (!n && !j ? p + 9 : 27)]);
                    //console.log(a[t + (!n && !j ? p + 9 : 27)]);
                }
                if (n && ((!b && r && (n >= 1 || (n == 1 && (h || t)))) || b || !r)){

                    /*console.log(a[(j ? 0 : p) + 1]);
                    console.log(a[j ? n + 18 : p + n]);
                    console.log(w);*/
                    //console.log(a[p + n]);
                    //w.push(a[n == 1 && !h && !t ? (j ? 0 : p) + 1 : (j ? n + 18 : p + n)]);
                    //alert(j);
                    w.push(a[n == 1 && !h && !t ? (j ? 0 : p) + 1 : (j ? n + 18 : p + n)]);
                }
                if (j){
                    //console.log(a[j + 38] + (!r && p && j == 1 ? 'н' : ''));
                    w.push(a[j + 38] + (!r && p && j == 1 ? 'н' : ''));
                }
            }
            return w.concat(r)
        };
    if (!n) return a.pop();
    do {
        r = fn(r, n % 1000, ++k, n >= 1000);
    } while (n = Math.floor(n / 1000));
    return r.join(' ')
}

window.toWords = toWords;

