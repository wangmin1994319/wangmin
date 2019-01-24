/**
 * Created by cc on 2016/4/20.
 */
app.controller('forgetPwdAlertController',['$modalInstance', '$state', '$http', '$scope','$rootScope' ,function($modalInstance, $state,$http,$scope,$rootScope) {
    $scope.cancel = function(){
        $modalInstance.close();
    }
}]);