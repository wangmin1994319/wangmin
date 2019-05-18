/**
 * Created by lijian on 2015/11/18.
 */
app.controller('prjOrgTreeController',['prjOrg','prjDept','$rootScope','$modalInstance','$http','$localStorage','$scope',function (prjOrg,prjDept,$rootScope,$modalInstance,$http,$localStorage,$scope) {

    $scope.init = function(){
        $scope.structureControl02 = structureControl02 = {};
        $scope.socialOrgs = [];
        $scope.expanding_property = {
            field: "name",
            displayName: "组织名"
        };

        $scope.recursiveExcept = function(topOrg, currentOrg){
            var orgStructure = {id:topOrg.id,name:topOrg.name,children:[]};
            if(topOrg.children != null){
                for(var i = 0; i < topOrg.children.length; i++){
                    var child = topOrg.children[i];
                    if(child.id != currentOrg.id && child.type == 0){
                        orgStructure.children.push($scope.recursiveExcept(child, currentOrg));
                    }
                }
            }
            return orgStructure;
        };

        $http.get('/projectOrgs/'+prjDept.id+'/orgStructure/').success(function(data){
            if(data){
                if(data.status == "SUCCESS"){
                    var topSocialOrg = data.data;
                    var orgStructure = $scope.recursiveExcept(topSocialOrg, prjOrg);
                    structureControl02.add_root_branch(orgStructure);
                }
            }
        });
    };

    $scope.init();

    $scope.close=function(){
        var head = structureControl02.get_selected_branch();
        if(head == null){
            return;
        }
        $modalInstance.close(head);
    };
}]);