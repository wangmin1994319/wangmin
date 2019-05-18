app.controller("PersonalInfoController", ['$scope', '$http', '$localStorage', function ($scope, $http, $localStorage) {

    var allWorkerTypes = [];
    var allNations = [];
    $scope.workerTypesAuthed = [];  //已认证
    $scope.workerTypesNoAuthed = [];  //未认证
    $scope.workerTypesNoNeedAuth = []; //不需要认证
    $scope.selfDefWorkerTypes = []; // 自定义工种
    $scope.cardHaveAuth = false;
    $scope.$emit('location', 0);
    $http.get('data/workType.json').success(function (workerTypes) {
        allWorkerTypes = workerTypes;
        $http.get('data/nations.json').success(function (nations) {
            allNations = nations;
            $http.get('/sysUsers/query?conductssId='+$localStorage.homepage.conductssId+'&param=realName, conductssId, sysUserInfo, cardChipId,phoneNum,cardId,limitType')
                .success(function (result) {
                    if (result.status="SUCCESS") {
                        if(result.data[0].cardChipId != null){
                            $scope.cardHaveAuth = true;
                        }
                        $scope.cardChipId = result.data[0].cardChipId;
                        $scope.conductssId = result.data[0].conductssId;
                        $scope.cardId = result.data[0].cardId;
                        $scope.realName = result.data[0].realName;
                        $scope.phoneNum = result.data[0].phoneNum;
                        if(result.data[0].limitType == 0){
                            $scope.phoneNum += '[个人可见]';
                        }else if(result.data[0].limitType == 1){
                            $scope.phoneNum += '[组织内可见]';
                        }else{
                            $scope.phoneNum += '[所有人可见]';
                        }
                        $scope.limitType = (result.data[0].sysUserInfo.sex == 0 ? "女" : "男");
                        allNations.forEach(function(t){
                            if(t.id == result.data[0].sysUserInfo.nation){
                                $scope.nation = t.name;
                            }
                        })

                        $scope.sysUserInfo = result.data[0].sysUserInfo;
                        if(result.data[0].sysUserInfo.birthday == null){
                            if(result.data[0].cardId.length == 18){
                                $scope.sysUserInfo.birthday = result.data[0].cardId.substring(6, 10) + "年"
                                    + (result.data[0].cardId.substring(10, 11) == 0 ? result.data[0].cardId.substring(11, 12) : result.data[0].cardId.substring(10, 12)) + "月"
                                    + (result.data[0].cardId.substring(12, 13) == 0 ? result.data[0].cardId.substring(13, 14) : result.data[0].cardId.substring(12, 14)) + "日";
                            }else{
                                $scope.sysUserInfo.birthday = "1970年1月1日";//1970年1月1日标准时间
                            }
                        }else{
                            var year = result.data[0].sysUserInfo.birthday.split("-")[0];
                            var month = result.data[0].sysUserInfo.birthday.split("-")[1];
                            var day = result.data[0].sysUserInfo.birthday.split("-")[2];
                            $scope.sysUserInfo.birthday = year + "年" + (month[0] == 0 ? month[1] : month) + "月" + (day[0] == 0 ? day[1] : day) + "日";
                        }
                        $scope.sysUserInfo.sex = (result.data[0].sysUserInfo.sex == 0 ? "女" : "男");
                        allNations.forEach(function(t){
                            if(t.id == result.data[0].sysUserInfo.nation){
                                $scope.nation = t.name;
                            }
                        });

                        $scope.sysUserInfo.emgPerson = result.data[0].sysUserInfo.emgPerson;
                        $scope.sysUserInfo.emgContact = result.data[0].sysUserInfo.emgContact;
                        $scope.sysUserInfo.registerAddr = result.data[0].sysUserInfo.registerAddr;
                        $scope.sysUserInfo.addr = result.data[0].sysUserInfo.addr;

                        var temp = [];
                        temp = angular.fromJson(result.data[0].sysUserInfo.workerType);
                        if(temp == null){
                            return;
                        }
                        temp.forEach(function(e) {
                            if(e.type == 1){
                                $scope.selfDefWorkerTypes.push(e.name);
                            }else{
                                allWorkerTypes.forEach(function(t){
                                    if(t.value == e.id){
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
                            }

                        })
                    }
                })
        });
    });
}])