app.controller("ProjectHomepageController", ['$scope', '$http', '$localStorage', '$state', function ($scope, $http, $localStorage, $state) {

    $scope.goEditSelf =function(){
        $state.go('app.project.updateproject',{projectOrgId:$localStorage.homepage.conductssId.substr(1)});
    }

    $http.get('data/bulidType.json').success(function (data) {
        $scope.bulidTypes = data;
        $http.get('data/structType.json').success(function (data) {
            $scope.structTypes = data;
            $http.get("/projectOrgs/" + $scope.conductssId)
                .success(function (result) {
                    if(result.status == "SUCCESS") {
                        $scope.bulidTypes.forEach(function(e){
                            for(var i=0;i<result.data.projectDto.bulidType.length;i++){
                                if(e.value == result.data.projectDto.bulidType[i]){
                                    result.data.projectDto.bulidType[i] = e.key;
                                    if(result.data.projectDto.buildTypeName == null){
                                        result.data.projectDto.buildTypeName = '';
                                    }

                                    result.data.projectDto.buildTypeName = result.data.projectDto.buildTypeName + e.key;
                                    if(i != result.data.projectDto.bulidType.length-1){
                                        result.data.projectDto.buildTypeName = result.data.projectDto.buildTypeName + ',';
                                    }
                                    break;
                                }
                            }
                        });
                        $scope.structTypes.forEach(function(e){
                            //if(e.value == result.data.projectDto.structType){
                            //    result.data.projectDto.structType= e.key;
                            //}
                            for(var i=0;i<result.data.projectDto.structType.length;i++){
                                if(e.value == result.data.projectDto.structType[i]){
                                    result.data.projectDto.structType[i] = e.key;
                                    if(result.data.projectDto.structTypeName == null){
                                        result.data.projectDto.structTypeName = '';
                                    }

                                    result.data.projectDto.structTypeName = result.data.projectDto.structTypeName + e.key;
                                    if(i != result.data.projectDto.structType.length-1){
                                        result.data.projectDto.structTypeName = result.data.projectDto.structTypeName + ',';
                                    }
                                    break;
                                }
                            }
                        });

                        $scope.data = result.data;
                        $scope.data.projectDto.startDate = new Date(result.data.projectDto.startDate).toLocaleDateString().replace(new RegExp("/", "g"), '-');
                    }
                });
        });
    });
    $scope.conductssId = $localStorage.homepage.conductssId;
    $scope.project_construct = false;
    $scope.project_setUp = false;
    $scope.project_fireControl =false;
    $http.get('/getFiles/' + $scope.conductssId + "/project_construct")
        .success(function(result){
            if(result.data.length > 0){
                $scope.project_construct = true;
            }
        })
    $http.get('/getFiles/' + $scope.conductssId + "/project_setUp")
        .success(function(result){
            if(result.data.length > 0){
                $scope.project_setUp = true;
            }
        })
    $http.get('/getFiles/' + $scope.conductssId + "/project_fireControl")
        .success(function(result){
            if(result.data.length > 0){
                $scope.project_fireControl = true;
            }
        })
}])