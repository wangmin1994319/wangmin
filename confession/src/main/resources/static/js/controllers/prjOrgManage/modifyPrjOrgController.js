/**
 * Created by lijian on 2015/11/19.
 */
app.controller('modifyPrjOrgController',['data', '$rootScope','$modal','$http','$scope','$modalInstance',function(data, $rootScope,$modal,$http,$scope,$modalInstance) {

    var prjStructureControl = $rootScope.prjStructureControl;
    $scope.currentOrg = data;
    $scope.parentOrg = prjStructureControl.get_parent_branch($scope.currentOrg);
    $scope.popOrgTree = function(){
        var rtn = $modal.open({
            templateUrl: 'tpl/app_dept_tree.html',
            controller: 'prjOrgTreeController',
            resolve:{
                prjDept:function(){return prjStructureControl.get_root_branch(data);},
                prjOrg:function(){return data;}
            }
        });
        rtn.result.then(function(parentOrg){
            $scope.parentOrg = parentOrg;
        });
    };

    $scope.modify = function(){
        $scope.alerts = [];
        var projectOrg = {};
        projectOrg.parent = {id:$scope.parentOrg.id};
        projectOrg.name = $scope.currentOrg.name;
        $http.put('/projectOrgs/'+$scope.currentOrg.id,projectOrg).success(function(result){
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
