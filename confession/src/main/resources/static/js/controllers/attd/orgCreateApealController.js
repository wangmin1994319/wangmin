/**
 * Created by lijian on 2016/1/12.
 */
app.controller('orgCreateApealController',['attdData', '$localStorage', '$modalInstance', '$scope', function( attdData, $localStorage, $modalInstance, $scope) {

    $scope.attdData = attdData;

    $scope.close = function(status){
        $modalInstance.close(status);
    };

    $scope.closeAlert = function (b) {
        $scope.alerts.splice(b, 1)
    };
}]);