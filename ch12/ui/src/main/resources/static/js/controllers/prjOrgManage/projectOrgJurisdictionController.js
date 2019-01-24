app.controller('prjJurisdictionController',function($localStorage ,$scope, $timeout,$http,$filter,$parse) {
    $scope.role = [];
    $scope.project = [];
    $scope.permissions = [];
    var newworkerId = $localStorage.userinfo.workerId;
    $scope.isModify = false;
    $scope.isCreate = false;
    $scope.alerts = [];
    $scope.orgPermissions = [];
    $scope.queryOrgPermissions = [];
    $scope.selected = 0;
    $scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    };
    $scope.pagingOptions = {
        pageSizes: [10, 15, 20],
        pageSize: 10,
        currentPage: 1
    };
    $scope.gridOptions = {
        data: 'projectWokers',
        enablePaging: true,
        showFooter: true,
        multiSelect: false,
        rowHeight: 41,
        headerRowHeight: 36,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        columnDefs: [
            { field: 'name', displayName: '姓名' },
            { field: 'projectOrg', displayName: '所属部门' }
        ]
    };

    //获取职务列表


    var tagLable = 'permissions';
    $scope.queryRolePermissions = function(){
        var tagLable = 'permissions';
        $http.get('projectOrgs/roles').success(function (data) {
            if(data.data.length == 0){
                return;
            }
            $scope.projects = data.data;
            $scope.project = data.data[0];

            if(data.data[0].roles.length != 0) {
                $scope.role = data.data[0].roles[$scope.selected];
                $scope.queryOrgPermissions = $scope.groupBy(data.data[0].roles[$scope.selected].permissions, 'category');
            }else{
                $scope.role = '';
                $scope.queryOrgPermissions = '';
            }

        })
    }
    $scope.queryRolePermissions();

    $scope.queryRoleNewworkers = function(){
        tagLable = 'newworkers';
        if($scope.role != '') {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        }
    }


    //获取人员列表
    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
        setTimeout(function () {
            var url = 'projectOrgs/'+$scope.project.id+'/roles/'+$scope.role.id+'/projectWorkers?page='+page+'&size='+pageSize;
            $http.get(url).success(function (pagedata) {
                $scope.projectWokers = pagedata.data.content;
                $scope.totalServerItems = pagedata.data.totalElements;
            });
        }, 100);
    };

    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal || newVal.currentPage !== oldVal.currentPage || newVal.pageSize !== oldVal.pageSize) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);

    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);


    //选择项目
    $scope.selectProject = function(id){
        if($scope.project.id == id) {
            $scope.project = $filter('filter')($scope.projects, function (data) {
                return data.id === id
            })[0];
        }else{
            $scope.project = $filter('filter')($scope.projects, function (data) {
                return data.id === id
            })[0];
            $scope.selected = 0;
            $scope.selectRole($scope.project.roles[0].id , 0)
        }
    }

    //选择项目角色
    $scope.selectRole = function(id, index){
        $scope.selected = index;
        $scope.role = $filter('filter')($scope.project.roles, function(data){return data.id === id})[0];
        if($scope.isModify){
            $scope.goModify(id);
        }else{
            $scope.queryOrgPermissions = $scope.groupBy($scope.role.permissions, 'category');
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        }
    }

    //获取项目组织所有权限
    $scope.getAllPermissions = function(){
        if($scope.project.id == null){
            return;
        }
        $http.get('/projectOrgs/'+$scope.project.id+'/roles/permissions').success(function(data){
            if(null != data.data) {
                $scope.permissions = $scope.groupBy(data.data, 'category');
            }else{
                $scope.permissions = [];
            }
        });
    };

    //编辑职务
    $scope.goModify = function(roleId){
        if('' == roleId || null == roleId){
            $scope.addAlert("danger","请选择职务");
            return;
        }
        $scope.getAllPermissions();
        if(roleId == undefined){
            return;
        }
        $scope.isModify = true;
        $http.get('/projectOrgs/'+$scope.project.id+'/roles/'+roleId+'/permissions').success(function(data){
            $scope.orgPermissions = data.data;
        });
    }

    function getPrjWorkerId(prjOrgId){
        var prjOrgs = $localStorage.userinfo.prjRoles;
        for(var i=0; i<prjOrgs.length; i++){
            if(prjOrgId == prjOrgs[i].orgId){
                return prjOrgs[i].workerId;
            }
        }
    }

    $scope.modify = function(){
        $scope.role.permissions= $scope.orgPermissions;
        var prjWorkerId = getPrjWorkerId($scope.project.id);
        if(prjWorkerId == null){
            $scope.addAlert("danger", "编辑职务失败");
            return;
        }
        $http.put('projectOrgs/'+$scope.project.id+'/roles/'+$scope.role.id + "?operatorId="+prjWorkerId, $scope.role).success(function(data){
            if(data.status == "SUCCESS"){
                $scope.addAlert("success",'修改职务成功');
                $scope.back();
            }else{
                $scope.addAlert("danger",data.error);
            }
        })
    }

    //新增职务
    $scope.createRole='';
    $scope.goCreate = function(){
        $scope.getAllPermissions();
        $scope.createRole='';
        $scope.isCreate = true;
        $scope.orgPermissions = [];
    }

    $scope.create = function(){
        $scope.createRole.permissions=$scope.orgPermissions;
        var prjWorkerId = getPrjWorkerId($scope.project.id);
        if(prjWorkerId == null){
            $scope.addAlert("danger", "新增职务失败");
            return;
        }
        $http.post('projectOrgs/'+$scope.project.id+'/roles?operatorId='+prjWorkerId,$scope.createRole).success(function(data){
            $scope.createRole='';
            $scope.queryRolePermissions();
            if(data.status == "SUCCESS"){
                $scope.addAlert("success",'新增职务成功');
                $scope.back();
            }else{
                $scope.addAlert("danger",data.error);
            }
            $scope.selected = 0;

        })
    }

    //删除职务
    $scope.delete = function(){
        if('' == $scope.role.id || undefined == $scope.role.id){
            $scope.addAlert("danger","请选择职务");
            return;
        }
        var prjWorkerId = getPrjWorkerId($scope.project.id);
        if(prjWorkerId == null){
            $scope.addAlert("danger", "删除职务失败");
            return;
        }
        $http.delete('projectOrgs/'+$scope.project.id+'/roles/'+$scope.role.id + "?operatorId="+prjWorkerId).success(function(data){
            if(data.status == "SUCCESS"){
                $scope.queryRolePermissions();
                $scope.selected = 0;
                $scope.addAlert("success",'删除职务成功');
            }else{
                $scope.addAlert("danger",data.error);
            }
        })
    }

    //将input数组通过权限的prop分组
    $scope.groupBy = function(input, prop){
        var grouped  = {};
        input.forEach(function(item) {
            var key = $parse(prop)(item);
            grouped[key] = grouped[key] || [];
            grouped[key].push(item);
        });

        return grouped;
    }

    //取消或返回操作
    $scope.back = function(){
        $scope.isModify = false;
        $scope.isCreate = false;
        if(tagLable == 'permissions') {
            $scope.queryRolePermissions();
        }else {
            $scope.queryRoleNewworkers();
        }
    }

    //操作提醒
    $scope.addAlert = function (type,msg) {
        $scope.closeAlert();
        $scope.alerts.push({
            type: type,
            msg: msg
        })
    };
    //提醒窗口关闭
    $scope.closeAlert = function (b) {
        $scope.alerts.splice(b, 1)
    };
});