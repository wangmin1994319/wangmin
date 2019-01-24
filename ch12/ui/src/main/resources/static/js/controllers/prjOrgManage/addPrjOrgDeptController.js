/**
 * Created by lijian on 2015/11/18.
 */
app.controller('addPrjOrgDeptController',['data', 'operatorId', '$rootScope','$modal','$http','$scope','$modalInstance',function(data, operatorId, $rootScope,$modal,$http,$scope,$modalInstance) {

    var prjStructureControl = $rootScope.prjStructureControl;
    $scope.parentOrg = data;
    $scope.popOrgTree = function(){
        var rtn = $modal.open({
            templateUrl: 'tpl/app_dept_tree.html',
            controller: 'prjOrgTreeController',
            resolve:{
                prjOrg:function(){return prjStructureControl.get_root_branch(data);},
                prjDept:function(){return $scope.parentOrg;}
            }
        });
        rtn.result.then(function (socialOrgInfo) {
            $scope.parentOrg = socialOrgInfo;
        });
    };

    $scope.save = function(){
        $scope.alerts = [];
        var deptDto = {"department":$scope.dept, "newOrgId":$scope.parentOrg.id, "oldOrgId":$scope.parentOrg.id};

        $http.post('/projectOrgs/'+$scope.parentOrg.id+"/depts/operators/"+operatorId, deptDto).success(function(result){
            if(result){
                if(result.status == "SUCCESS"){
                    $scope.close('SUCCESS');
                }else{
                    $scope.alerts.push({type:"danger",msg:result.error});
                }
            }
        });
    };

    $scope.closeAlert = function (b) {
        $scope.alerts.splice(b, 1)
    };

    $scope.close = function(status){
        $modalInstance.close(status);
    };
}]);