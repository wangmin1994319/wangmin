'use strict';

app.controller('SigninFormController', ["toaster",'$rootScope', '$scope', '$http', '$state', '$localStorage','$cookieStore', function (toaster,$rootScope, $scope, $http, $state,$localStorage,$cookieStore) {

    $scope.user = {};
    $scope.alerts = [];
    //提示信息
    $scope.toaster = {
        type: 'success',
        title: 'Title',
        text: 'Message'
    };
    $scope.pop = function(type,title,text){
        toaster.pop(type,'',text);
    };
    var authenticate = function (headers) {
        $scope.alerts = [];
        //$scope.user.password = '';
        $http.get('sysUsers/user', {headers: headers})
            .success(function (result) {
                $localStorage.socialOrgStructure = '';
                $localStorage.projectOrgStructure = '';
                if (result.data) {
                    console.log(result.data);
                    if(result.status == "SUCCESS") {
                        $localStorage.userinfo = result.data;
                        $localStorage.homepage = {conductssId:result.data.conductssId};
                        //$cookieStore.put('user',headers);
                        $state.go('app.default.personalInfo');
                    }else{
                        $scope.addAlert("danger",result.info);
                    }
                } else {
                    $scope.addAlert("danger","登录失败");
                }
            }).error(function () {
                $scope.addAlert("danger","用户名或密码错误！");
            });
    };
    $scope.login = function (valid) {
        if(valid) {
            var headers = {};
            //if ('' === $scope.user.password) {
            //    $scope.addAlert("danger","请填写密码");
            //    return;
            //} else if( undefined === $scope.user.password){
            //    headers = $cookieStore.get('user');
            //}else {
                headers = {authorization: "Basic " + btoa($scope.user.username + ":" + $scope.user.password)};
            //}
            authenticate(headers);
        }
    };
    $scope.addAlert = function (type,msg) {
        $scope.alerts.push({
            type: type,
            msg: msg
        })
    };
    if($rootScope.conductssId){
        $scope.addAlert("success",'注册成功！您的工信号为：'+$rootScope.conductssId);
    }
    if($rootScope.forgetPwd){
        $scope.addAlert("success",$rootScope.forgetPwd);
    }
    $scope.closeAlert = function (b) {
        $scope.alerts.splice(b, 1)
    }
    $scope.typeState='password';
    $scope.iconState='fa-eye';
    $scope.hidePassword= function () {
        if($scope.typeState=='password'){
            $scope.typeState='text';
            $scope.iconState='fa-eye-slash';

        }else{
            $scope.typeState='password';
            $scope.iconState='fa-eye';
        }
    }
}])
;