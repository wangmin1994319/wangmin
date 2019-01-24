'use strict';
app.controller('changePwdController',['$http', '$scope','$localStorage','$state', function($http,$scope,$localStorage,$state) {
    $scope.alerts = [];
    $scope.save = function(){
        $http.put("/sysUsers/"+$localStorage.userinfo.sysUserId+"/password",{"oldPwd":$scope.oldPwd,"newPwd":$scope.newPwd}).success(function(data){
            if(data.status == "SUCCESS"){
                $scope.addAlert("success","修改密码成功");
            }
            if(data.status == "ERROR"){
                $scope.addAlert("danger","修改密码失败")
            }
        })
    }
    $scope.addAlert = function (type,msg) {
        $scope.closeAlert();
        $scope.alerts.push({
            type: type,
            msg: msg
        })
    };
    $scope.closeAlert = function (b) {
        $scope.alerts.splice(b, 1)
    };

}]);