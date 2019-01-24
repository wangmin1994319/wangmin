app.controller("PersonalProjectSufferController", ['$scope', '$localStorage', '$http', function ($scope, $localStorage, $http) {

    $scope.datas = [];
    var count = 3;
    var b ="";
    $scope.$emit('location', 1);
    $scope.getSuffers = function(){
        $http.get('/sysUsers/projectSuffers/' + $localStorage.homepage.conductssId + '/?count=' + count)
            .success(function (result) {
                if(result.data == null || result.data.length == 0) {
                    $scope.showGetMore=false;
                    return;
                }
                $scope.datas = result.data;
                sortDataByType();
                var i = 0;
                $scope.datas.forEach(function (e) {
                    $scope.datas[i].jobName = "";
                    e.orgRoles.forEach(function (t) {
                        $scope.datas[i].jobName += t.name;
                        $scope.datas[i].jobName += " ";
                    })
                    $scope.datas[i].buildType = "";
                    for(var j = 0; j < e.bulidType.length; j++){
                        b = e.bulidType[j];
                        if(0 == b){
                            b = "住宅 ";
                        }else if(1 == b){
                            b = "商用 ";
                        }else {
                            b = "写字楼 ";
                        }
                        $scope.datas[i].buildType += b;
                    }
                    $scope.datas[i].joinTime = new Date(e.joinTime).toLocaleDateString().replace(new RegExp("/","g"), '-');
                    i++;
                })
                if(count > $scope.datas.length){
                    $scope.showGetMore=false;
                }
            })
    }
    $scope.getSuffers();

    $scope.showGetMore=true;
    $scope.getMore = function(){
        count += count;
        $scope.getSuffers();
    }

    var sortDataByType = function () {//1:时间降序 冒泡
        var temp;
        for (var i = 0; i < $scope.datas.length; i++) {
            for (var j = 0; j < $scope.datas.length - i - 1; j++) {
                if ($scope.datas[j].joinTime == null || $scope.datas[j + 1].joinTime == null) {
                    continue;
                }
                if ($scope.datas[j].joinTime <= $scope.datas[j + 1].joinTime) {
                    temp = $scope.datas[j + 1];
                    $scope.datas[j + 1] = $scope.datas[j];
                    $scope.datas[j] = temp;
                }
            }
        }
    }
}]);