app.directive('nationAreaPickerB', ['$http',function ($http) {
    return {
        restrict: 'EA',
        replace: true,
        required: 'region',
        scope: {
            region: "="
        },
        templateUrl: 'js/template/nationAreaPicker-directive-b.html',
        link: function (scope, elm, attrs) {

            $http.get('data/province.json').success(function(data){
                scope.totalProvinces=data;
                checkJsonLoaded();
            });
            $http.get('data/city.json').success(function(data){
                scope.totalCitys=data;
                checkJsonLoaded();
            });
            $http.get('data/area.json').success(function(data){
                scope.totalDistrs=data;
                checkJsonLoaded();
            });

            var checkJsonLoaded=function(){
                if(scope.totalProvinces && scope.totalCitys && scope.totalDistrs){

                    scope.province=1;
                    if(angular.isArray(scope.region) && scope.region.length==3){
                        scope.province=scope.region[0];
                        scope.city=scope.region[1];
                        scope.distr=scope.region[2];
                    }
                    scope.addressChange();
                }
            }

            scope.citys=[];
            scope.distrs=[];
            scope.addressChange= function (){

                var prov= scope.totalProvinces[scope.province-1];
                var pid=prov.ProID;
                var tempArray=[];
                var city;
                for( var i=0;i<scope.totalCitys.length;i++){
                    var obj=scope.totalCitys[i];
                    if(obj.ProID==pid){
                        if(obj.CityID==scope.city) city=obj;
                        tempArray.push(obj);
                    }
                }
                scope.citys=tempArray;
                if(!city) city=tempArray[0];
                scope.city=city.CityID;

                tempArray=[];
                var distr
                for(i=0;i<scope.totalDistrs.length;i++) {

                    obj = scope.totalDistrs[i];
                    if (obj.CityID == city.CityID) {
                        if(obj.Id==scope.distr) distr=obj;
                        tempArray.push(obj);
                    }
                }
                scope.distrs=tempArray;
                if(!distr) distr=tempArray[0];
                scope.distr=distr.Id;
                scope.region=[scope.province,scope.city,scope.distr];
            }

        }

    };
}]);