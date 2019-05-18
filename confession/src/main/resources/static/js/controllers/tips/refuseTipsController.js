/**
 * Created by lijian on 2016/7/12.
 */
app.controller('refuseTipsController',['task', 'project', '$modalInstance', '$http','$scope',function(task, project, $modalInstance, $http, $scope) {

    $scope.approveData = {};
    $scope.save = function(){
        $http.put('projects/tasks/'+task.taskId+'/status/0/operators/'+project.workerId, $scope.approveData).success(function(data){
            if(data){
                if(data.status == 'SUCCESS'){
                    $scope.close('SUCCESS');
                }
            }
        });
    };
    $scope.close = function (status) {
        $modalInstance.close(status);
    };
}]);