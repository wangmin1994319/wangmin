/**
 * Created by lijian on 2015/11/18.
 */
app.controller('modifyPrjOrgDeptController',['data', 'operatorId', '$rootScope','$modal','$http','$scope','$modalInstance',function(data, operatorId, $rootScope,$modal,$http,$scope,$modalInstance) {

    var prjStructureControl = $rootScope.prjStructureControl;

    $scope.currentDept = data;
    $scope.parentOrg = prjStructureControl.get_parent_branch($scope.currentDept);
    $scope.showOrgName = $scope.parentOrg.name;
    $scope.name = $scope.currentDept.name;
    $scope.description = $scope.currentDept.description;
    $scope.delete = function () {
        $scope.alerts = [];
        $http.delete('/projectOrgs/'+$scope.parentOrg.id+"/depts/"+$scope.currentDept.id+'/operators/'+operatorId).success(function (result) {
            if(result){
                if(result.status == "SUCCESS"){
                    $scope.close('删除部门成功');
                }else{
                    $scope.alerts.push({type:"danger",msg:result.error});
                }
            }
        });
    };

    $scope.modify = function () {
        $scope.alerts = [];
        $scope.currentDept.name = $scope.name;
        $scope.currentDept.description = $scope.description;
        var deptId = $scope.currentDept.id;
        var deptDto;
        if($scope.newSocialOrg == null){
            deptDto = {"department":$scope.currentDept, "newOrgId":$scope.parentOrg.id, "oldOrgId":$scope.parentOrg.id};
        }else{
            deptDto = {"department":$scope.currentDept, "newOrgId":$scope.newSocialOrg.id, "oldOrgId":$scope.parentOrg.id};
        }
        $http.put('/projectOrgs/'+$scope.parentOrg.id+'/depts/'+deptId+'/operators/'+operatorId, deptDto).success(function(result){
            if(result){
                if(result.status == "SUCCESS"){
                    $scope.close('编辑部门成功');
                }else{
                    $scope.alerts.push({type:"danger",msg:result.error});
                }
            }
        });
    };

    $scope.popOrgTree = function(){
        var rtn = $modal.open({
            templateUrl: 'tpl/app_dept_tree.html',
            controller: 'prjOrgTreeController',
            resolve:{
                prjOrg:function(){return prjStructureControl.get_root_branch(data);},
                prjDept:function(){return $scope.parentOrg;}
            }
        });
        rtn.result.then(function (socialOrg) {
            $scope.newSocialOrg = socialOrg;
            $scope.showOrgName = $scope.newSocialOrg.name;
        });
    };

    $scope.close=function(status){
        $modalInstance.close(status);
    };

    $scope.closeAlert = function (b) {
        $scope.alerts.splice(b, 1)
    };
}]);