/**
 * Created by lijian on 2016/7/12.
 */
app.controller('noticeMsgController',['toaster', '$modal', '$state', '$localStorage', '$http','$scope',function(toaster, $modal, $state, $localStorage, $http, $scope) {

    $scope.$emit('location', 1);
    $scope.taskTypes = [{name:"个人消息", type:1}, {name:"项目消息", type:0}];
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
        var url;
        if($scope.taskType.type == 1){
            url = 'flows/joinProject/owners/'+$localStorage.userinfo.sysUserId+'/list?taskStatus=0&page='+page+'&size='+pageSize;
        }else{
            url = 'flows/joinProject/approvers/'+$scope.project.workerId+'/list?taskStatus=0&approveStatus=0&page='+page+'&size='+pageSize;
        }
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
            { field: 'createDate', displayName: '申请时间', cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><span ng-cell-text>{{row.entity.createDate | date:"yyyy-MM-dd HH:mm:ss"}}</span></div>'},
            { field: 'reply', displayName: '回复'},
            { field: 'handleStatus', displayName: '处理结果', cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><span ng-cell-text ng-if="row.entity.handleStatus == 1">同意</span><span ng-cell-text ng-if="row.entity.handleStatus == 0">拒绝</span></div>'},
            { field: 'handleDate', displayName: '处理时间',  cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><span ng-cell-text>{{row.entity.createDate | date:"yyyy-MM-dd HH:mm:ss"}}</span></div>'},
            { field: 'approverName', displayName: '审批人'}
        ]
    };

    $scope.reloadData = function(){
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    };

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
        $scope.reloadData();
    };
    getManageProject();
}]);