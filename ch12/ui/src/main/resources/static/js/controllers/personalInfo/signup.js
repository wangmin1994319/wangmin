'use strict';

// signup controller
app.controller('SignupFormController', ['$rootScope','$scope', '$http', '$state', function($rootScope, $scope, $http, $state) {

    $scope.user = {};
    $scope.authError = null;
    $scope.showmsg = "获取短信验证码";
    $scope.isSending = false;
    $scope.sendState = "";
    $scope.alerts = [];
    $scope.startCountdown = false;
    var phoneNumExist = true;
    $scope.phoneNumValidate = false;
    $scope.signup = function() {

        /*if(phoneNumExist){
            $scope.alerts = [];
            $scope.addAlert("danger", "手机号码已经被注册！");
            return;
        }
        if($scope.phoneNumValidate == false){
            $scope.alerts = [];
            $scope.addAlert("danger", "验证码输入错误");
            return;
        }*/
        /*if($scope.msgValidate == null || $scope.user.phoneNum == null)
            return;*/
        //$http.get('verifyCode',{params:{phoneNum:$scope.user.phoneNum,msgValidate:$scope.msgValidate}}).success(function(data){

            /*if(data.status == "ERROR"){
                $scope.phoneNumValidate = false;
                $scope.addAlert("danger",data.error);
            }
            else{*/
                $scope.alerts = [];
                $scope.phoneNumValidate = true;
                $http.post('sysUsers/register', $scope.user)
                    .success(function(data) {
                        if(data.status != "SUCCESS"){
                            $scope.addAlert("danger",data.error);
                        }else{
                            //var sysUserInfo = {};
                            //sysUserInfo.conductssId = data.data.conductssId;
                            //sysUserInfo.realName = data.data.realName;
                            //sysUserInfo.phoneNum = data.data.phoneNum;
                            //sysUserInfo.cardId = data.data.cardId;
                            //sysUserInfo.sysUserId = data.data.sysUserId;
                            $state.go('access.signin');
                        }
                    }).error(function(data, status, headers, config) {
                        $scope.addAlert("danger","系统错误");
                    });
            //}
       // });
    };

    $scope.sendCode = function(){//sendCode

        if(phoneNumExist){
            return;
        }
        if($scope.startCountdown == true){
            return;
        }
        var phoneNum = $scope.user.phoneNum;
        var telReg = !!phoneNum.match(/^(13|15|17|18)\d{9}$/);
        if(telReg==true){
            $http.get('sendCode',{params:{phoneNum:phoneNum, type:'register'}}).success(function(data){

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
        }
    };

    $scope.verifyCode = function(){
        //if(phoneNumExist){
        //    return;
        //}
        var msgValidate = $scope.msgValidate;
        if(msgValidate == null || $scope.user.phoneNum == null)
            return;
        $http.get('verifyCode',{params:{phoneNum:$scope.user.phoneNum,msgValidate:msgValidate}}).success(function(data){

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

    $scope.$on('timer-stopped', function (event, data){
        $scope.startCountdown = false;
        $scope.showmsg = "获取短信验证码";
        $scope.$digest();//通知视图模型的变化
    });

    $scope.verifyPhoneNum = function(e){
        if(!((48<= e.keyCode <= 57) || (96<= e.keyCode <= 105))){
            return;
        }
        if(!$scope.user.phoneNum || $scope.user.phoneNum.length<11){
            return;
        }
        $http.get('sysUsers/verifyPhoneNum?phoneNum='+$scope.user.phoneNum).success(function(data){
            if(data){
                if(data.status == "SUCCESS"){
                    phoneNumExist = false;
                }else{
                    phoneNumExist = true;
                    $scope.addAlert("danger", data.error);
                }
            }
        });
    };

    $scope.get = function () {
        $http.get("sysUsers/conductssId/random")
            .success(function (result) {
                $scope.user.conductssId = result.data.conductssId;
            })
    };

    $scope.addAlert = function (type,msg) {
        for(var i=0;i<$scope.alerts.length;i++){
            if($scope.alerts[i].msg == msg){
                return;
            }
        }
        $scope.alerts.push({
            type: type,
            msg: msg
        })
    };
    $scope.closeAlert = function (b) {
        $scope.alerts.splice(b, 1)
    };
}])
;