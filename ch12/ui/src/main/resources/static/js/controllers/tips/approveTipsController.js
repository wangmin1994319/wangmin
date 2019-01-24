/**
 * Created by lijian on 2016/7/11.
 */
app.controller('approveTipsController',['task', 'project', '$modalInstance', '$http','$scope',function(task, project, $modalInstance, $http, $scope) {
    function init(){
        $http.get('projectOrgs/'+project.orgId+'/roles').success(function(data){
            if(data){
                if(data.status == 'SUCCESS'){
                    $scope.roles = data.data;
                    for(var i in $scope.roles){
                        if($scope.roles[i].name == '员工'){
                            $scope.role = $scope.roles[i];
                            break;
                        }
                    }
                    if($scope.role == null){
                        $scope.role = $scope.roles[0];
                    }
                }
            }
        });
    }

    init();

    $scope.projectOrg = {projectOrgId:project.orgId, projectOrgName:project.orgName};

    $scope.createNewOrg = function(){
        if($scope.newOrgName == '' || $scope.newOrgName == null){
            return;
        }
        $scope.projectOrg = {projectOrgName:$scope.newOrgName, projectId:project.projectId};
    };

    $scope.selectDefaultOrg = function(){
        $scope.newOrg = false;
        $scope.projectOrg = {projectOrgId:project.orgId, projectOrgName:project.orgName};
    };

    $scope.save = function(){
        if($scope.newOrg && ($scope.newOrgName == null || $scope.newOrgName == '')){
            return;
        }
        if(!$scope.newOrg && $scope.role == null){
            return;
        }
        if($scope.newOrg){
            if(project.orgType == 0){
                $scope.projectOrg.parentId = project.orgId;
            }
        }else{
            $scope.projectOrg.roleId = $scope.role.id;
            $scope.projectOrg.roleName = $scope.role.name;
        }
        $http.put('projects/tasks/'+task.taskId+'/status/1/operators/'+project.workerId, $scope.projectOrg).success(function(data){
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