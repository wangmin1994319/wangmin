'use strict';
app.controller('forgotPwdController',['$modal', '$state', '$http', '$scope','$rootScope' ,function($modal, $state,$http,$scope,$rootScope) {
    $scope.alerts = [];
    $scope.sendState = "";
    $scope.startCountdown = false;
    $scope.phoneNumValidate = false;
    $scope.showmsg = '获取短信验证码';
    $scope.step = 1;
    $scope.next1 = function() {
        $http.get('/getPhoneNum?cardId=' +$scope.cardId).success(function (data) {
            if (data) {
                if (data.status == "SUCCESS") {
                    $scope.phoneNum = data.data.phoneNum;
                    var temp = $scope.phoneNum.substr(3,6);
                    $scope.showNum = $scope.phoneNum.replace(temp,"******");
                    $scope.step = 2;
                    $scope.alerts = [];
                }else{
                    $scope.addAlert("danger", data.error);
                }
            }
        })
    };

    $scope.sendCode = function(){
        if($scope.startCountdown == true){
            return;
        }
        $http.get('sendCode?phoneNum=' + $scope.phoneNum + '&type=forgotPwd').success(function(data){
            if(data.status != "SUCCESS"){
                $scope.sendState = data.error;
                return;
            }else{
                $scope.sendState = "发送成功";
                $scope.$broadcast('timer-start');//开始倒计时
                $scope.showmsg = "s 后重新获取";
                $scope.startCountdown = true;
            }
        });
    };

    $scope.verifyCode = function(){
        $http.get('verifyCode?phoneNum=' + $scope.phoneNum + '&msgValidate=' + $scope.code).success(function(data){
            if(data.status == "ERROR"){
                $scope.phoneNumValidate = false;
                $scope.addAlert("danger",data.error);
            }
            else{
                $scope.alerts = [];
                $scope.phoneNumValidate = true;
            }
        });
    };

    $scope.next2 = function(){
        if($scope.phoneNumValidate != true){
            $scope.addAlert("danger", "请填写正确的短信验证码！");
            return;
        }
        $scope.step = 3;
    };

    $scope.save = function(){
        $http.put('forgetPwd?phoneNum='+$scope.phoneNum+'&pwd='+$scope.newPassword+'&msgValidate='+$scope.code).success(function(data){
            if(data.status == "SUCCESS" ){
                $state.go('access.signin');
            }else{
                $scope.addAlert("danger", data.error);
            }
        })
    };

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

    $scope.open = function(){
        $modal.open({
            templateUrl: 'tpl/app_forgetpwd_alert.html',
            controller: 'forgetPwdAlertController',
            resolve: {
            }
        });
    };

    $scope.$on('timer-stopped', function (event, data){
        $scope.startCountdown = false;
        $scope.showmsg = "获取短信验证码";
        $scope.$digest();//通知视图模型的变化
    });
}]);