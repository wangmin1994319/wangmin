/**
 * Created by lijian on 2015/11/18.
 */
app.controller('addPrjOrgController',['data', '$rootScope','$modal','$http','$scope','$modalInstance',function(data, $rootScope,$modal,$http,$scope,$modalInstance) {

    $scope.alerts = [];
    $scope.projectOrg = data;
    $scope.getOrgInfo = function(){

        $scope.alerts = [];
        $http.get('/socialOrgs/query?conductssId='+$scope.conductssId+"&param=id,name").success(function(result){
            if(result){
                if(result.status == "SUCCESS"){
                    $scope.socialOrg = result.data[0];
                }else{
                    $scope.alerts.push({type:"danger",msg:"未查询到任何结果!"});
                }
            }
        })
    };

    $scope.save = function(){
        $scope.alerts = [];
        if($scope.socialOrg == null){
            return;
        }
        $http.post('/projectOrgs/'+$scope.projectOrg.id+'/invite', null, {params:{"id":$scope.socialOrg.id,"type":1, "owner":$scope.projectOrg.name, "assignee":$scope.socialOrg.name}}).success(function(result){
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