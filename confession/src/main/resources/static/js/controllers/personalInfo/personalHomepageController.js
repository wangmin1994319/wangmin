app.controller("PersonalHomepageController", ['$scope', '$http', '$localStorage', '$state', function ($scope, $http, $localStorage, $state) {

    $scope.editSelf = false;
    $scope.male = true;
    if($localStorage.homepage.conductssId == $localStorage.userinfo.conductssId){
        $scope.editSelf = true;
    }
    $scope.goEditSelf =function(){
        $state.go("app.perinfo");
    }

    $scope.clickIndex = 0;
    $scope.setClickIndex = function(index){
        $scope.clickIndex = index;
    }

    $scope.headerImg = false;
    $scope.headerImgUrl = null;
    var getHeadImg = function(){
        $http.get('/getFiles/' + $scope.conductssId + '/head')
            .success(function (data) {
                if (data.data == null || data.data.length == 0) {
                    $scope.headerImg = true;
                    return;
                }
                $scope.headerImgUrl = data.data[0]+"?"+new Date().getTime();
            }).error(function (data) {
                $scope.headerImg = true;
            })
    }

    var allWorkerTypes = [];
    $scope.workerTypesAuthed = [];  //已认证
    $scope.workerTypesNoAuthed = [];  //未认证
    $scope.workerTypesNoNeedAuth = []; //不需要认证
    $scope.cardHaveAuth = false;
    $http.get('data/workType.json').success(function (workerTypes) {
        allWorkerTypes = workerTypes;
        $http.get('/sysUsers/query?conductssId='+$localStorage.homepage.conductssId+'&param=realName,conductssId,sysUserInfo,cardChipId,phoneNum, cardId')
            .success(function (result) {
                if (result.status="SUCCESS") {
                    if(result.data == null || result.data.length == 0) {
                        $scope.showGetMore=false;
                        return;
                    }
                    if(result.data[0].cardChipId != null){
                        $scope.cardHaveAuth = true;
                    }
                    $scope.cardChipId = result.data[0].cardChipId;
                    $scope.realName = result.data[0].realName;
                    $scope.conductssId = result.data[0].conductssId;
                    getHeadImg();

                    var temp = [];
                    if(result.data[0].sysUserInfo.sex == '1'){
                        $scope.male=true;
                    }else{
                        $scope.male=false;
                    }
                    temp = angular.fromJson(result.data[0].sysUserInfo.workerType);
                    if(temp == null){
                        return;
                    }

                    temp.forEach(function(e) {
                        allWorkerTypes.forEach(function(t){
                            if(t.value == e){
                                if(t.value <= 13) {
                                    $http.get('/getFiles/' + $scope.conductssId + "/wokerType_" + t.en_name)
                                        .success(function(result){
                                            if(result.data.length > 0){
                                                $scope.workerTypesAuthed.push(t.key);
                                            }else{
                                                $scope.workerTypesNoAuthed.push(t.key);
                                            }
                                        })
                                }
                                else{
                                    $scope.workerTypesNoNeedAuth.push(t.key);
                                }
                            }
                        })
                    })
                }
            })
    });

    $scope.gotoPage = function(page){
        $state.go(page);
    };

    $scope.$on('location', function(event, data){
        $scope.setClickIndex(data);
    })
}]);