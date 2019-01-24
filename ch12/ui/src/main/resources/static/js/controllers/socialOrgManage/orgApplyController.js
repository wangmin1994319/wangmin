app.controller("orgApplyController",['$state', "$localStorage","$scope",'$modal', '$http', function($state, $localStorage,$scope,$modal, $http){
    //项目编号搜索方法
    $scope.search=function(){
        $scope.resultsItems = [];
        if(!angular.isString($scope.conductssNumber)) return;
        var check_type=$scope.conductssNumber.slice(0,1);
        if(check_type == 'P') {
            $http.get('projects/' + $scope.conductssNumber)
                .success(function (data) {
                    var searchFaile = "SUCCESS" != data.status || data.data == null;
                    $scope.resultsItems = [];
                    if (searchFaile) {
                        $scope.addAlert("danger", "没有找到该项目记录");
                    } else {
                        $scope.alerts = [];
                        $scope.resultsItems = [data.data];
                        angular.forEach($scope.resultsItems, function (data, index, array) {
                            data.title = '项目部主页';
                            data.fName = data.name ? data.name.slice(0, 1) : "空";
                            $scope.apply = true;
                            $scope.invite = false;
                        })
                    }
                })
        }else{
            $scope.addAlert('danger','请输入符合要求的项目编号')
        }
    }

    //申请加入方法
    $scope.join=function(item){
        if($scope.conductssNumber.indexOf("P") > -1) {
            item.conductssId=$scope.conductssNumber;
            var dlg = $modal.open({
                templateUrl: 'js/template/app_prj_joinProject.html',
                controller: 'joinProjectModalCtrl',
                resolve: {
                    "item": function () {
                        return angular.copy(item);
                    }
                }
            });
            dlg.result.then(function (result) {
                var url = 'projects/' + $scope.conductssNumber + '/join';
                var joinProject = {};
                joinProject.prjOrgConductssId = result.prjOrgConductssId;
                joinProject.sysUserId = result.sysUserId;
                joinProject.remarks = result.remarks;
                $http.post(url, joinProject).success(function (result) {
                    if (result.status != "SUCCESS") {
                        $scope.addAlert("danger", result.error);
                        return;
                    }
                    $scope.addAlert("success", "已成功发出申请，请耐心等待审批");
                });

            });
        }
    };

    $scope.addAlert = function (type,msg) {
        $scope.alerts=[{ type: type, msg: msg}];
    };

    $scope.closeAlert = function (b) {
        $scope.alerts.splice(b, 1)
    };

    $scope.gotoHomePage = function(item){
        $localStorage.homepage = {conductssId: item.conductssId};
        if(item.conductssId.indexOf("U") > -1){
            $state.go("app.default.personalInfo");
        }else if($scope.conductssNumber.indexOf("S") > -1){
            $state.go("app.companyHomepage.companyInfo");
        }else if($scope.conductssNumber.indexOf("G") > -1){
            $localStorage.homepage = {conductssId: item.socialOrgConductssId};
            $state.go("app.companyHomepage.companyInfo");
        }else if($scope.conductssNumber.indexOf("P") > -1){
            $state.go("app.projectHomepage");
        }
    }
}]);

/*
app.controller('joinOrgModalCtr', ['$scope', '$http', '$localStorage', '$modalInstance',"item",
    function ($scope, $http, $localStorage, $modalInstance,item) {
    $scope.totalStatus=[{"key":"个人","value":0}];
    $scope.status = $scope.totalStatus[0];
    $scope.projectName=item.name;
    var orgName;
        if($localStorage.userinfo.socialRoles.length > 0 ){
            for(var i in $localStorage.userinfo.socialRoles){
                $scope.totalStatus.push({"key":$localStorage.userinfo.socialRoles[i].orgName,"value":1,"orgId":$localStorage.userinfo.socialRoles[i].orgId})
            }
        }
    //$http.get('newworkers/'+$localStorage.userinfo.workerId+"/socialOrgs").success(function(data){
    //    if("SUCCESS"==data.status && data.data!=null){
    //        orgName = data.data.name;
    //        $scope.totalStatus[1]={"key":data.data.name,"value":1};
    //    }
    //});

    $scope.ok = function(){
        var result={"status": $scope.status.value,"reason":$scope.reason, "orgName":$scope.status.key, "orgId":$scope.status.orgId};
        $modalInstance.close(result);
    }

    $scope.cancel = function(){
        $modalInstance.dismiss();
    }
}]);
*/

//申请加入到项目弹出窗方法
app.controller('joinProjectModalCtrl', ['$scope', '$http', '$localStorage', '$modalInstance',"item", function ($scope, $http, $localStorage, $modalInstance,item) {
        $scope.orgBrowe = orgBrowe = {};
        $scope.socialOrgs = [];

        //遍历组织
        /*if($localStorage.userinfo.socialRoles.length > 0){
            for(var i in $localStorage.userinfo.socialRoles) {
                $scope.totalStatus.push({"key":$localStorage.userinfo.socialRoles[i].orgName,"value":1,"orgId":$localStorage.userinfo.socialRoles[i].orgId});
            }
        }*/

       /* $scope.selectIdentity = function(){
            if($scope.status.value == 1){
                $scope.socialOrgs = [];
                $scope.socialOrgs.push({name:$scope.status.key,type:0,id:$scope.status.orgId});
            }
        }
*/

        $scope.expanding_property = {
            field: "name",
            displayName: "名称"
        };
        $http.get('projects/'+item.conductssId+'/structure?includeDeptAndWorker=false').success(function (data) {
            if(data.status=='SUCCESS'){
                $scope.projectOrgStructure = data.data;
                for (var i in $scope.projectOrgStructure) {
                    $scope.projectOrgStructure[i].firstProjectOrg = true;
                    orgBrowe.add_root_branch($scope.projectOrgStructure[i]);
                }
                orgBrowe.expand_branch($scope.projectOrgStructure[0]);
            }
        })
        /*$scope.addNewworker = function(branch){

            if(2==branch.type){
                $scope.pm=branch;
                return;
            }
            for(var b in branch.children){
                if(branch.children[b].type == 2){
                    return;
                }
            }
            if(branch.type == 0){
                $http.get('/socialOrgs/'+branch.id+'/newworkers').success(function(data){
                    orgBrowe.add_branch_list(branch,data.data);
                })
            }else if(branch.type == 1){
                var parentNode = orgBrowe.select_parent_branch(branch);
                $http.get('/socialOrgs/'+parentNode.id + '/'+branch.id+'/newworkers').success(function(data){
                    orgBrowe.add_branch_list(branch,data.data);
                })
            }
        }*/

        $scope.ok = function(){
            $scope.alerts = [];
            if(orgBrowe.get_selected_branch() == null){
                $scope.addAlert('danger','请选中入驻组织')
                return;
            }
            $scope.selectedPrjOrg=orgBrowe.get_selected_branch();
            var result={"prjOrgConductssId": $scope.selectedPrjOrg.conductssId,"sysUserId":$localStorage.userinfo.sysUserId,"remarks":$scope.reason};
            $modalInstance.close(result);
        }

        $scope.cancel = function(){
            $modalInstance.dismiss();
        }

        $scope.addAlert = function (type,msg) {
            $scope.alerts=[{ type: type, msg: msg}];
        };

        $scope.closeAlert = function (b) {
            $scope.alerts.splice(b, 1)
        };

    }]);

