/**
 * Created by wangweifeng on 2015/11/9 0009.
 */


app.controller("prjApplyController",["$localStorage","$scope","socialOrgResource",'$modal','$http', 'projectResource',
    function($localStorage, $scope, socialOrgResource, $modal, $http, projectResource ){

    $scope.search=function(){
        if(!angular.isString($scope.conductssNumber))
            return;
        var check_p=$scope.conductssNumber.slice(0,1);
        if(check_p!="G"){
            $scope.addAlert("danger","不合法的工信号");
            return;
        }
        $http.get('projectOrgs/' + $scope.conductssNumber)
            .success(function (data) {
                var searchFaile = "SUCCESS" != data.status || data.data == null;
                $scope.resultsItems = [];
                if (searchFaile) {
                    $scope.addAlert("danger", "没有找到该工信号记录");
                } else {
                    $scope.alerts = [];
                    $scope.resultsItems = [data.data];
                    angular.forEach($scope.resultsItems, function (data, index, array) {
                        data.title = '公司主页';
                        data.join = '加入项目';
                        data.fName = data.name ? data.name.slice(0, 1) : "空";
                    })
                }
            })
    }

    $scope.joinOrg=function(item){
        var dlg = $modal.open({
            templateUrl: 'js/template/app_prj_joinProjectModal.html',
            controller: 'joinProjectModalCtr',
            resolve:{
                "item":function (){return angular.copy(item);}
            }
        });

        dlg.result.then(function (result) {

            var dealResult = function(result){
                if(result.status != "SUCCESS"){
                    $scope.addAlert("danger",result.error);
                    return;
                }
                $scope.addAlert("success","已成功发出申请，请耐心等待审批");
                $http.get('user')
                    .success(function (result) {
                        $localStorage.socialOrgStructure = '';
                        $localStorage.projectOrgStructure = '';
                        if (result.data) {
                            if(result.status == "SUCCESS") {
                                $localStorage.userinfo = result.data;
                            }
                        }
                    })
            };

            var data = {"prjOrgId":item.id, "name":item.name};
            if(result.status == 0){
                $http.get('/projectOrgs/'+data.prjOrgId+'/validateJoin?id='+$localStorage.userinfo.sysUserId+'&type=0').success(function(d){
                    if(d){
                        if(d.status == 'SUCCESS'){
                            data.id = $localStorage.userinfo.sysUserId;
                            var url = 'projectOrgs/'+data.prjOrgId + '/join';
                            var config = {params: {id: data.id, type: 0, owner:$localStorage.userinfo.realName, assignee:data.name}};
                            $http.post(url, null, config)
                                .success(function (result) {
                                    dealResult(result);
                                })
                        }else{
                            $scope.addAlert("danger",d.error);
                        }
                    }
                });
            }else{
                data.socialOrgId = $localStorage.userinfo.socialRole.orgId;
                if(result.pm == null){
                    $scope.alerts=[];
                    $scope.resultsItems=[];
                    $scope.addAlert("danger","没有指定管理员");
                    return;
                }
                $http.get('/projectOrgs/'+data.prjOrgId+'/validateJoin?id='+result.pm.id+'&promoterId='+$localStorage.userinfo.sysUserId+'&type=1').success(function(d){
                    if(d){
                        if(d.status == 'SUCCESS'){
                            data.pmId = result.pm.id;
                            var url = 'projectOrgs/'+data.prjOrgId + '/join';
                            var config = {params: {id: data.pmId, type: 1, promoterId:$localStorage.userinfo.sysUserId, owner:result.orgName, assignee:data.name}};
                            $http.post(url, null, config)
                                .success(function (result) {
                                    dealResult(result);
                                })
                        }else{
                            $scope.addAlert("danger",d.error);
                        }
                    }
                });
            }
        });
    };

    $scope.addAlert = function (type,msg) {
        $scope.alerts=[{ type: type, msg: msg}];
    };

    $scope.closeAlert = function (b) {
        $scope.alerts.splice(b, 1)
    }
}]);

app.controller('joinProjectModalCtr', ['$scope', '$http', '$localStorage', '$modalInstance',"item","socialOrgResource",
    function ($scope, $http, $localStorage, $modalInstance,item,socialOrgResource) {

    $scope.socialOrgId = $localStorage.userinfo.socialRole.orgId;
    $scope.orgBrowe = orgBrowe = {};
    $scope.socialOrgs = [];
    $scope.totalStatus=[{"key":"个人","value":0}];
    $scope.status=0;
    $scope.projectName=item.name;
    var orgName;
    $http.get('newworkers/'+$localStorage.userinfo.workerId+"/socialOrgs").success(function(data){
        if("SUCCESS"==data.status && data.data!=null){
            orgName = data.data.name;
            $scope.totalStatus[1]={"key":data.data.name,"value":1};
            var rootNode = {name:data.data.name,type:0,id:data.data.id};
            orgBrowe.add_root_branch(rootNode);
        }
    });

    $scope.expanding_property = {
        field: "name",
        displayName: "姓名"
    };

    $scope.addNewworker = function(branch){
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
    }

    $scope.ok = function(){
            var reault={"status": $scope.status,"reason":$scope.reason,"pm":$scope.pm, "orgName":orgName};
            $modalInstance.close(reault);
    }

    $scope.cancel = function(){
        $modalInstance.dismiss();
    }
}]);

