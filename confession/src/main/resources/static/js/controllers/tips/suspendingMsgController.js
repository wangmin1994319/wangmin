/**
 * Created by lijian on 2016/7/11.
 */
app.controller('suspendingMsgController',['toaster', '$modal', '$state', '$localStorage', '$http','$scope',function(toaster, $modal, $state, $localStorage, $http, $scope) {

    $scope.$emit('location', 0);
    var taskNum = [];
    $scope.taskTypes = [{name:"未处理", type:1}, {name:"已处理", type:0}];
    $scope.taskType = $scope.taskTypes[0];
    $scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    };
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [250, 500, 1000],
        pageSize: 250,
        currentPage: 1
    };

    $scope.toaster = {
        type: 'success',
        title: 'Title',
        text: 'Message'
    };
    $scope.pop = function(type,title,text){
        toaster.pop(type,'',text);
    };

    $scope.setPagingData = function(data, page, pageSize){
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.socialOrgData = pagedData;
        $scope.totalServerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
        var url = 'flows/joinProject/approvers/'+$scope.project.workerId+'/list?taskStatus='+$scope.taskType.type+'&page='+page+'&size='+pageSize;
        $http.get(url).success(function (pagedata) {
            if(pagedata){
                if(pagedata.status == 'SUCCESS'){
                    $scope.socialOrgData = pagedata.data.content;
                    $scope.totalServerItems = pagedata.data.totalElements;
                }else {
                    $scope.pop('error', '', pagedata.error);
                    $scope.socialOrgData = null;
                    $scope.totalServerItems = 0;
                }
            }

        });
    };

    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);

    $scope.gridOptions = {
        data: 'socialOrgData',
        enablePaging: true,
        showFooter: true,
        multiSelect: false,
        showSelectionCheckbox: false,
        rowHeight: 41,
        headerRowHeight: 36,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        columnDefs: [
            { field: 'title', displayName: '主题'},
            { field: 'ownerConductssId', displayName: '工信号'},
            { field: 'remarks', displayName: '阐述理由'},
            { field: 'createDate', displayName: '时间', cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><span ng-cell-text>{{row.entity.createDate | date:"yyyy-MM-dd HH:mm:ss"}}</span></div>'},
            { field: 'handleStatus', displayName:'状态', cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><span ng-cell-text ng-show="taskType.type == 1">待处理</span>' +
            '<span ng-cell-text ng-show="taskType.type == 0 && row.entity.handleStatus == 0">已拒绝</span><span ng-cell-text ng-show="taskType.type == 0 && row.entity.handleStatus == 1">已同意</span></div>'},
            { field: '操作', cellTemplate: '<div ng-show="taskType.type == 1"><button class="btn btn-info btn-sm m-t-xs m-l-xs" ng-click="handle(row.entity)">同意并处理</button>' +
            '<button class="btn btn-danger btn-sm m-t-xs m-l-xs" ng-click="refuse(row.entity)">拒绝</button></div>'}
        ]
    };

    function getMyProjects(){
        $http.get('/flows/getTaskNum').success(function(data){
            if(data){
                if(data.status == 'SUCCESS'){
                    taskNum = data.data;
                    reloadCombobox();
                }
            }
        });
    }

    function reloadCombobox(){
        for(var i in $scope.projects){
            var projectTaskNum = 0;
            for(var j in taskNum){
                if(taskNum[j].projectWorkerId == $scope.projects[i].workerId){
                    projectTaskNum += taskNum[j].taskNum;
                    break;
                }
            }
            if(projectTaskNum != 0){
                $scope.projects[i].showName = $scope.projects[i].projectName + '【' + projectTaskNum + '】';
            }else{
                $scope.projects[i].showName = $scope.projects[i].projectName;
            }
        }
        if($scope.projects.length != 0){
            $scope.project = $scope.projects[0];
        }
        $scope.reloadData();
    }

    function getManageProject(){
        var allProjects = $localStorage.userinfo.prjRoles;
        $scope.projects = [];
        for(var i in allProjects){
            var hasPermission = false;
            for(var k in allProjects[i].roles){
                var role = allProjects[i].roles[k];
                for(var m in role.permissions){
                    if(role.permissions[m].name == 'projectOrg_join_approve'){
                        hasPermission = true;
                        break;
                    }
                }
                if(hasPermission){
                    break;
                }
            }
            if(hasPermission){
                $scope.projects.push(allProjects[i]);
            }
        }
        if($scope.projects.length != 0){
            $scope.project = $scope.projects[0];
        }
        reloadCombobox();
    };

    $scope.reloadData = function(){
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    };

    $scope.handle = function(task){
        var rtn = $modal.open({
            templateUrl: 'tpl/app_tips_approve.html',
            controller: 'approveTipsController',
            resolve: {
                task: function(){return task;},
                project: function(){return $scope.project}
            }
        });
        rtn.result.then(function (status) {
            if(status == 'SUCCESS'){
                $scope.pop('success','','审批成功');
                refresh();
            }
        },function(){

        });
    };

    $scope.refuse = function(task){
        var rtn = $modal.open({
            templateUrl: 'tpl/app_tips_refuse.html',
            controller: 'refuseTipsController',
            resolve: {
                task: function(){return task;},
                project: function(){return $scope.project}
            }
        });
        rtn.result.then(function (status) {
            if(status == 'SUCCESS'){
                $scope.pop('success','','审批成功');
                refresh();
            }
        },function(){

        });
    };

    function refresh(){
        $localStorage.randomNum = new Date().getTime();
        for(var i in taskNum){
            if(taskNum[i].projectWorkerId == $scope.project.workerId){
                if(taskNum[i].taskNum > 0){
                    taskNum[i].taskNum --;
                }
            }
        }
        reloadCombobox();
    }
    getManageProject();
    getMyProjects();
}]);