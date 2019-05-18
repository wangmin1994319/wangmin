/**
 * Created by lijian on 2015/11/18.
 */
app.controller('modifyPrjWorkerController',['data','$rootScope','$modal','$http','$scope','$modalInstance',function(data,$rootScope,$modal,$http,$scope,$modalInstance) {

    var prjStructureControl = $rootScope.prjStructureControl;

    $scope.init = function(){
        $scope.head = prjStructureControl.get_parent_branch(data);
        $scope.dept = $scope.head;
        if($scope.head.type != 0){
            $scope.head = prjStructureControl.get_parent_branch($scope.head);
        }
        $scope.depts = [];
        $scope.depts.push($scope.head);
        for(var i=0;i<$scope.head.children.length;i++){
            if($scope.head.children[i].type == 1){
                $scope.depts.push($scope.head.children[i]);
            }
        }

        if($scope.head.type == 0){
            $scope.orgData = $scope.head;
        }else{
            $scope.orgData = prjStructureControl.get_parent_branch($scope.head);
        }
        $scope.data = data;
        //获取权限
        $http.get('/projectOrgs/'+$scope.orgData.id+"/roles").success(function(result){
            if(result){
                if(result.status == "SUCCESS"){
                    $scope.roles = result.data;
                    //设置默认职务
                    if(result.data){
                        for(var i=0;i<result.data.length;i++){
                            if(result.data[i].name == data.orgRole.trim()){
                                $scope.selected = result.data[i].id;
                            }
                        }
                    }

                }
            }
        });
    };

    $scope.save = function(){
        $scope.alerts = [];
        if($scope.dept == null){
            $scope.alerts.push({type:"danger",msg:"请分配职务/所属部门"});
            return;
        }
        $scope.projectWorker = {
            projectOrg:{
                id:$scope.head.id
            }
        };
        if($scope.selected != null){
            $scope.projectWorker.orgRoles = [{id:$scope.selected}]
        }
        if($scope.dept.type == 1){
            $scope.projectWorker.deptId = $scope.dept.id;
        }
        $http.put('/projectOrgs/'+$scope.head.id+'/projectWorkers/'+$scope.data.id,$scope.projectWorker).success(function(result){
            if(result){
                if(result.status == "SUCCESS"){
                    $scope.close('SUCCESS');
                }else{
                    $scope.alerts.push({type:"danger",msg:result.error});
                }
            }
        });
    };

    $scope.init();

    $scope.close = function(status){
        $modalInstance.close(status);
    };

    $scope.closeAlert = function (b) {
        $scope.alerts.splice(b, 1)
    };
}]);