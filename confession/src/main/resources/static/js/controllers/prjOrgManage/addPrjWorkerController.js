/**
 * Created by lijian on 2015/11/18.
 */
app.controller('addPrjWorkerController',['branch', '$state', '$rootScope','$modal','$http','$scope','$modalInstance',function(branch, $state, $rootScope,$modal,$http,$scope,$modalInstance){

    $scope.alerts = [];
    $scope.depts = [];
    $scope.dept = {};
    var prjStructureControl = $rootScope.prjStructureControl;

    $scope.close = function(result){
        $modalInstance.close(result);
    };

    $scope.getNewworkerInfo = function(){
        $scope.newworkerInfo = null;
        if(!$scope.account){
            return;
        }
        var url = "";
        if(isNaN($scope.account.slice(0,1))){
            //根据工信号查询
            url = "/sysUsers/query?conductssId="+$scope.account+"&param=id,realName";
        }else if($scope.account.length == 11){
            //根据手机号码查询
            url = "/sysUsers/query?phoneNum="+$scope.account+"&param=id,realName";
        }else if($scope.account.length == 15 || $scope.account.length == 18){
            //根据身份证号查询
            url = "/sysUsers/query?cardId="+$scope.account+"&param=id,realName";
        }else{
            return;
        }
        $http.get(url).success(function(result){
            $scope.alerts = [];
            if(result){
                if(result.status == "SUCCESS"){
                    if(result.data[0].id != null){
                        $scope.newworkerInfo = result.data[0];
                    }else{
                        $scope.alerts.push({type:"danger",msg:"未查询到任何记录！"});
                    }
                }else{
                    $scope.alerts.push({type:"danger",msg:"未查询到任何记录！"});
                }
            }
        });
    };

    $scope.save = function(){
        if($scope.newworkerInfo == null){
            return;
        }
        $scope.alerts = [];
        $http.post('/projectOrgs/'+branch.id+'/invite', null,
            {params:{"id":$scope.newworkerInfo.id,"type":0, "owner":branch.name,
                "assignee":$scope.newworkerInfo.realName, deptId:$scope.dept.id, roleId:$scope.role.id}}).success(function(result){
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

    $scope.init = function(){
        $http.get('/projectOrgs/'+branch.id+'/roles').success(function(data){
            if(data){
                if(data.status == 'SUCCESS'){
                    $scope.roles = data.data;
                    $scope.role = $scope.roles[0];
                }
            }
        });
        $scope.depts.push({id:null, name:''});
        for(var i=0;i<branch.children.length;i++){
            var child = branch.children[i];
            if(child.type == 1){
                $scope.depts.push(child);
            }
        }
        $scope.dept = $scope.depts[0];
    };

    $scope.init();

    $scope.gotoJurisdiction = function(){
        $modalInstance.close('app.project.org-jurisdiction');
    }
}]);