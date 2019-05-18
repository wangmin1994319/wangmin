app.controller('projectOrgBroweController', function($localStorage ,$scope,$http,$filter,$state) {

    $scope.orgBrowe = orgBrowe = {};
    $scope.projectOrgs = [];
    $scope.alerts = [];
    $scope.loadData = function() {
        $http.get('projects/structure/').success(function (data) {
            $scope.projectOrgStructure = data.data;
            for (var i in $scope.projectOrgStructure) {
                $scope.projectOrgStructure[i].firstProjectOrg = true;
                orgBrowe.add_root_branch($scope.projectOrgStructure[i]);
            }
            orgBrowe.expand_branch($scope.projectOrgStructure[0]);
        });
    }
    $scope.loadData();

    $scope.expanding_property = {
        field: "name",
        displayName: "姓名",
        filterable: true
    };
    $scope.col_defs = [
        {
            field: "orgRole",
            displayName: "职务"
        },
        {
            field: "sex",
            displayName: "性别",
            cellTemplate:"<div ng-show=\"row.branch[col.field] == 1\">男</div><div ng-show=\"row.branch[col.field] == 0\">女</div>"
        },
        {
            field: "conductssId",
            displayName: "工信号",
            filterable: true
        },
        {
            field: "phoneNum",
            displayName: "电话/手机"
        },
        {
            field: "firstProjectOrg",
            displayName: "主页",
            cellTemplate:
            "<button class='btn btn-info btn-sm m-l-xs m-t-n-xs' ng-click=\"cellTemplateScope.personalHomePage(row.branch)\" ng-show=\"row.branch['type'] == 2\">个人主页</button>",
            cellTemplateScope: {
                projectHomePage: function (branch) {
                    $localStorage.homepage = {conductssId: branch.conductssId};
                    $state.go("app.projectHomepage");
                },
                personalHomePage: function (branch) {
                    $localStorage.homepage = {conductssId: branch.conductssId};
                    $state.go("app.default.personalInfo");
                },
                companyHomePage: function (branch) {
                    $http.get('projectOrgs/'+branch.conductssId+'/getSocialOrgInfo').success(function(data){
                        if(data){
                            if(data.status == 'SUCCESS'){
                                $localStorage.homepage = {conductssId: data.data.conductssId};
                                $state.go("app.companyHomepage.companyProjectSuffer");
                            }
                        }
                    });

                }
            }
        }

    ];

    $scope.quitProjectOrg = function(){
        $scope.alerts = [];
        if(orgBrowe.get_selected_branch() == null){
            $scope.alerts.push({type:"danger",msg:"请选择要退出的项目部"});
            return;
        }
        if(orgBrowe.get_selected_branch() != orgBrowe.get_root_branch(orgBrowe.get_selected_branch())){
            $scope.alerts.push({type:"danger",msg:"请选择要退出的项目部"});
            return;
        }
        var topOrg = orgBrowe.get_selected_branch();
        var projectOrgs = $localStorage.userinfo.prjRoles;
        for(var i=0;i<projectOrgs.length;i++){
            if(topOrg.id == projectOrgs[i].orgId){
                $http.delete('/projectOrgs/'+projectOrgs[i].orgId+'/dismiss').success(function (result) {
                    if(result.status == "SUCCESS"){
                        $state.reload();
                    }else{
                        $scope.alerts.push({type:"danger",msg:result.error});
                    }
                });
                break;
            }
            findProjectOrg(topOrg.children, projectOrgs[i].orgId);
            if(projectOrgId != null){
                $http.delete('/projectOrgs/'+projectOrgId+'/dismiss').success(function (result) {
                    if(result.status == "SUCCESS"){
                        $state.reload();
                    }else{
                        $scope.alerts.push({type:"danger",msg:result.error});
                    }
                });
                break;
            }
        }
    };

    var projectOrgId;
    function findSelf(children, conductssId){
        for(var i=0;i<children.length;i++){
            var obj = children[i];
            if(obj.conductssId == conductssId){
                prjWorker = obj;
                return;
            }
            if(obj.children != null && obj.children.length != 0){
                findSelf(obj.children, conductssId);
            }
        }
    }
    function findProjectOrg(children, orgId){
        for(var i=0;i<children.length;i++){
            var obj = children[i];
            if(obj.id == orgId && obj.type == 0){
                projectOrgId = orgId;
                return;
            }
            if(obj.children != null && obj.children.length != 0){
                findProjectOrg(obj.children, orgId);
            }
        }
    }
    $scope.closeAlert = function (b) {
        $scope.alerts.splice(b, 1)
    };
});




