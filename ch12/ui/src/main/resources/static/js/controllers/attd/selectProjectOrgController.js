app.controller('selectProjectOrgController',['$scope','$modalInstance','ivhTreeviewMgr','projectworkerId', '$http', function($scope,$modalInstance,ivhTreeviewMgr,projectworkerId,$http) {
    $scope.returnJson={};
    $scope.returnJson.structure = [];
    $scope.orgBrowe = orgBrowe = {};
    $scope.project = [];
    $scope.returnJson.selectedPeople = "";
    $http.get('projectWorkers/'+projectworkerId+'/structure').success(function(data){
        if(data){
            if(data.status == 'SUCCESS'){
                if(data.data != null) {
                    $scope.project = data.data;
                }
            }
        }
    });


    function recursionOrg(org,parentId){
        if(org.selected != undefined){
            if(org.type == 2 && org.selected){
                $scope.returnJson.selectedPeople += org.id + ',';
                $scope.returnJson.structure.push({"id":org.id,"conductssId":org.conductssId,"name":org.name,"parentId":parentId,"attdDays":0,"attdHours":0.0,"children":[],"type":2})
            }else if(org.type != 2){
                $scope.returnJson.structure.push({"id":org.id,"conductssId":org.conductssId,"name":org.name,"parentId":parentId,"children":[],"type":1})
            }

        }
        if(null != org.children){
            for(var i in org.children){
                recursionOrg(org.children[i], org.id);
            }
        }
    }

    $scope.closeAlert = function (b) {
        $scope.alerts.splice(b, 1)
    };

    $scope.close = function(){
        recursionOrg($scope.project,0);
        if($scope.returnJson.selectedPeople.length > 0){
            $scope.returnJson.selectedPeople = $scope.returnJson.selectedPeople.substring(0,$scope.returnJson.selectedPeople.length-1);
        }
        $modalInstance.close($scope.returnJson);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}])