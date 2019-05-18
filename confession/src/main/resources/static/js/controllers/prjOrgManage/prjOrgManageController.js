/**
 * Created by lijian on 2015/11/17.
 */
app.controller('prjOrgManageController', function(toaster, project,$rootScope,$modal,$state,$localStorage ,$scope, $timeout,$http) {

    $scope.alerts = [];
    //提示信息
    $scope.toaster = {
        type: 'success',
        title: 'Title',
        text: 'Message'
    };
    $scope.pop = function(type,title,text){
        toaster.pop(type,'',text);
    };
    $scope.init = function(){
        $scope.prjStructureControl = prjStructureControl = {};
        $scope.prjOrgs = [];
        $http.get('projectOrgs/structure').success(function (data) {
            if(data.data == null || data.data.length == 0){
                return;
            }
            $localStorage.projectOrgStructure = data.data;
            for(var i in $localStorage.projectOrgStructure) {
                prjStructureControl.add_root_branch($localStorage.projectOrgStructure[i]);
            }
            prjStructureControl.expand_branch($localStorage.projectOrgStructure[0]);
            $rootScope.prjStructureControl = prjStructureControl;
        });
        $scope.expanding_property = {
            field: "name",
            displayName: "姓名"
        };
        $scope.col_defs = [
            {
                field: "orgRole",
                displayName: "职务"
            },
            {
                field: "type",
                displayName: "操作",
                width: 430,
                height: 42,
                cellTemplate:
                "<button class='btn btn-info btn-sm m-l-xs m-t-n-xs'  ng-click='cellTemplateScope.modifyNewworker(row.branch)' ng-show=\"row.branch[col.field] == 2 && row.branch.mouseEnter\"><a ng-click='open()'>编辑</a></button>"
                +"<button class='btn btn-danger btn-sm m-l-xs m-t-n-xs' mwl-confirm message='你确定删除此员工吗?' confirm-text='是的' cancel-text='取消' on-confirm='cellTemplateScope.deleteNewworker(row.branch)' confirm-button-type='danger' ng-show=\"row.branch[col.field] == 2 && row.branch.mouseEnter\">删除</button>"
                +"<button class='btn btn-info btn-sm m-l-xs m-t-n-xs' ng-click='cellTemplateScope.addSocialOrg(row.branch)' ng-show=\"row.branch[col.field] == 0 && row.branch.mouseEnter\">添加组织</button>"
                +"<button class='btn btn-info btn-sm m-l-xs m-t-n-xs' ng-click='cellTemplateScope.modifySocialOrg(row.branch)' ng-show=\"row.branch[col.field] == 0 && row.branch.mouseEnter\">架构调整</button>"
                +"<button class='btn btn-info btn-sm m-l-xs m-t-n-xs' ng-click='cellTemplateScope.addDept(row.branch)' ng-show=\"row.branch[col.field] == 0 && row.branch.mouseEnter\">添加部门</button>"
                +"<button class='btn btn-info btn-sm m-l-xs m-t-n-xs' ng-click='cellTemplateScope.modifyDept(row.branch)' ng-show=\"row.branch[col.field] == 1 && row.branch.mouseEnter\">编辑部门</button>"
                +"<button class='btn btn-info btn-sm m-l-xs m-t-n-xs' ng-click='cellTemplateScope.addProjectWorker(row.branch)' ng-show=\"row.branch[col.field] == 0 && row.branch.mouseEnter\">添加员工</button>"
                +"<button class='btn btn-info btn-sm m-l-xs m-t-n-xs' ng-click='cellTemplateScope.eval(row.branch)' ng-show=\"(row.branch[col.field] == 2 || row.branch[col.field] == 0) && row.branch.mouseEnter && false\">评价</button>",
                cellTemplateScope:{
                    modifyNewworker:function(data){
                        var rtn = $modal.open({
                            templateUrl: 'tpl/app_prj_modify_employee.html',
                            controller: 'modifyPrjWorkerController',
                            resolve:{
                                data:function(){return data;}
                            }
                        });
                        rtn.result.then(function (status) {
                            if(status == 'SUCCESS'){
                                reloadTreeData();
                                $scope.pop('success','','编辑员工成功');
                            }
                        },function () {
                        });
                    },
                    deleteNewworker:function(data){
                        var head = prjStructureControl.get_parent_branch(data);
                        if(head.type != 0){
                            head = prjStructureControl.get_parent_branch(head);
                        }
                        $http.delete('/projectOrgs/'+head.id+'/projectWorkers/'+data.id).success(function (result) {
                            if(result){
                                if(result.status == "SUCCESS"){
                                    reloadTreeData();
                                    $scope.pop('success','','删除员工成功');
                                }else{
                                    $scope.pop('error','', result.error);
                                }
                            }
                        })
                    },
                    addSocialOrg:function(data){
                        $scope.popAddOrg(data);
                    },
                    modifySocialOrg:function(data){
                        $scope.popModifyOrg(data);
                    },
                    addDept:function(data){
                        $scope.popAddDept(data);
                    },
                    modifyDept:function(data){
                        $scope.popModifyDept(data);
                    },
                    eval:function(branch){
                        var target = branch;
                        var projectOrg = prjStructureControl.get_root_branch(target);
                        $scope.eval(target.id, target.type, projectOrg.id);
                    },
                    addProjectWorker:function(branch){
                        $scope.popAddEmp(branch);
                    }
                }
            }
        ];
    };

    $scope.init();

    $scope.eval = function(targetId, branchType, projectOrgId){
        var rtn = $modal.open({
            templateUrl: 'js/template/app_prj_eval.html',
            controller: 'EvalController',
            resolve:{
                targetId:function() { return angular.copy(targetId); },
                branchType:function() { return angular.copy(branchType); },
                projectOrgId:function() { return angular.copy(projectOrgId); }
            }
        });
    };
    // 弹出框方法
    $scope.popAddEmp = function(branch){
        var rtn = $modal.open({
            templateUrl: 'tpl/app_prj_add_employee.html',
            controller: 'addPrjWorkerController',
            resolve:{
                branch:function(){return branch;}
            }
        });
        rtn.result.then(function (status) {
            if(status != null){
                if(status == 'SUCCESS'){
                    $scope.pop('success','','邀请发送成功，请耐心等待对方回应');
                }else{
                    $state.go(status);
                }
            }
        },function(){
        });
    };

    $scope.popAddDept = function(data){
        $scope.alerts = [];
        var operatorId = findOperatorId();
        var rtn = $modal.open({
            templateUrl: 'tpl/app_prj_add_dept.html',
            controller: 'addPrjOrgDeptController',
            resolve:{
                operatorId:function(){return operatorId;},
                data:function(){return data;}
            }
        });
        rtn.result.then(function (status) {
            if(status == 'SUCCESS'){
                reloadTreeData();
                $scope.pop('success','','新建部门成功');
            }
        },function(){
        });
    };

    $scope.popModifyDept = function(data){
        $scope.alerts = [];
        var operatorId = findOperatorId();
        var rtn = $modal.open({
            templateUrl: 'tpl/app_prj_modify_dept.html',
            controller: 'modifyPrjOrgDeptController',
            resolve:{
                operatorId:function(){return operatorId;},
                data:function(){return data;}
            }
        });
        rtn.result.then(function (message) {
            if(message != null){
                reloadTreeData();
                $scope.pop('success','', message);
            }
        },function(){
        });
    };

    $scope.popAddOrg = function(data){
        $scope.alerts = [];
        var rtn = $modal.open({
            templateUrl: 'tpl/app_prj_add_org.html',
            controller: 'addPrjOrgController',
            resolve:{
                data:function(){return data;}
            }
        });
        rtn.result.then(function (status) {
            if(status == 'SUCCESS'){
                $scope.pop('success','','邀请发送成功，请耐心等待对方回应');
            }
        },function(){
        });
    };

    $scope.popModifyOrg = function(data){
        $scope.alerts = [];
        if(data.id == prjStructureControl.get_root_branch(data).id){
            $scope.pop('error','','顶级组织不可修改');
            return;
        }
        var rtn = $modal.open({
            templateUrl: 'tpl/app_prj_modify_org.html',
            controller: 'modifyPrjOrgController',
            resolve:{
                data:function(){return data;}
            }
        });
        rtn.result.then(function (status) {
            if(status == 'SUCCESS'){
                reloadTreeData();
                $scope.pop('success','','修改组织架构成功');
            }
        },function(){
        });
    };

    $scope.closeAlert = function (b) {
        $scope.alerts.splice(b, 1)
    };

    $scope.popUploadCertificate = function(){
        $scope.alerts = [];
        if(prjStructureControl.get_selected_branch() == null || prjStructureControl.get_selected_branch() != prjStructureControl.get_root_branch(prjStructureControl.get_selected_branch())){
            $scope.pop('error','','请选中要上传证书的项目部');
            return;
        }
        project.id = prjStructureControl.get_selected_branch().id;
        $state.go('app.organization.project-upload');
    };

    $scope.popUpdateProject = function(){
        $scope.alerts = [];
        if(prjStructureControl.get_selected_branch() == null || prjStructureControl.get_selected_branch().type != 0){
            $scope.pop('error','','请选中要编辑的项目部');
            return;
        }
        $state.go('app.project.updateproject',{projectOrgId:prjStructureControl.get_selected_branch().id});

    };

    $scope.deleteProjectOrg = function(){
        $scope.alerts = [];
        var parentOrg = $localStorage.userinfo.prjRoles;
        var childOrg = prjStructureControl.get_selected_branch();
        if(childOrg == null || childOrg.type != 0){
            $scope.pop('error','','请选中要删除的组织');
            return;
        }
        if(prjStructureControl.get_parent_branch(childOrg) == null){
            $scope.pop('error','','请选中要删除的直属子组织');
            return;
        }
        for(var i=0;i<parentOrg.length;i++){
            if(prjStructureControl.get_parent_branch(childOrg).id == parentOrg[i].orgId){
                $http.delete('/projectOrgs/'+parentOrg[i].orgId+'/childrenRemoveBinding/'+childOrg.id).success(function(data){
                    if(data){
                        if(data.status == 'SUCCESS'){
                            reloadTreeData();
                            $scope.pop('success','','删除成功');
                        }else{
                            $scope.pop('error','', data.error);
                        }
                    }
                });
            }else if(i == parentOrg.length-1){
                $scope.pop('error','','请选中要删除的直属子组织');
            }
        }

    };

    function findOperatorId(){
        var currentNode = prjStructureControl.get_selected_branch();
        var operatorId;
        var myPrjRoles = $localStorage.userinfo.prjRoles;
        if(currentNode.type == 0){
            //添加部门
        }else{
            //编辑部门
            currentNode = prjStructureControl.get_parent_branch(currentNode);
        }
        //优先查找当前组织的workerId
        for(var i=0; i < myPrjRoles.length; i++){
            if(currentNode.id == myPrjRoles[i].orgId){
                operatorId = myPrjRoles[i].workerId;
                return operatorId;
            }
        }
        var topOrg = prjStructureControl.get_root_branch(currentNode);
        for(var i=0; i < myPrjRoles.length; i++){
            if(topOrg.id == myPrjRoles[i].topOrgId){
                operatorId = myPrjRoles[i].workerId;
                return operatorId;
            }
        }
    }

    function reloadTreeData(){
        $http.get('projectOrgs/structure').success(function (data) {
            if(data.data == null || data.data.length == 0){
                return;
            }
            $scope.prjOrgs = [];

            $localStorage.projectOrgStructure = data.data;
            for(var i in $localStorage.projectOrgStructure) {
                $scope.prjOrgs.push($localStorage.projectOrgStructure[i]);
            }
            prjStructureControl.expand_branch($localStorage.projectOrgStructure[0]);
            $rootScope.prjStructureControl = prjStructureControl;
        });
    }
});

