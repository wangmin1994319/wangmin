/**
 * Created by pengchao on 2016/1/11.
 */
'use strict';
app.controller('prjWorkShiftSettingController',['toaster', 'moment', '$modal', '$http', '$scope', '$localStorage', function(toaster, moment,$modal,$http,$scope,$localStorage) {
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

    //列表属性配置
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
        data: 'workShift',
        enablePaging: true,
        showFooter: true,
        multiSelect: false,
        rowHeight: 41,
        headerRowHeight: 36,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        columnDefs: [
            { field: 'realName', displayName: '姓名' },
            { field: 'startDate', displayName: '开始时间' },
            { field: 'timeSegs', displayName: '考勤时间', cellFilter: 'jsobFilter'},
            { field: 'id',displayName: "操作", cellTemplate: '<button class="btn btn-info btn-sm m-t-xs m-l-xs" ng-click="modifyWorkShiftSetting(row.entity)"">编辑</button><button class="btn btn-danger btn-sm m-t-xs m-l-xs" ng-if="row.entity[\'timeSegs\']" ng-click="delete(row.entity)"">删除</button>',width:'15%' }
        ]
    };

    //初始化数据
    $http.get('/sysUsers/projects').success(function(data){
        if(data){
            if(data.status == 'SUCCESS'){
                if(data.data != null) {
                    $scope.socialOrgs = data.data;
                    $scope.socialOrg = $scope.socialOrgs[0];
                    $scope.myProjectOrgs = $scope.socialOrg.projects;
                    $scope.myProjectOrg = $scope.myProjectOrgs[0];
                    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
                }
            }
        }
    });

    $scope.changeProjects = function(){
        $scope.myProjectOrgs = $scope.socialOrg.projects;
        $scope.myProjectOrg = $scope.myProjectOrgs[0];
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    }

    //删除班次
    $scope.delete = function(entity) {
        var url = '/attds/projectOrgs/workShiftSettings/' + entity.id+'?workerId='+entity.workerId;
        $http.delete(url).success(function (data) {
            if(data.status == "SUCCESS"){
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
                $scope.pop('success','','删除班次成功');
            }else{
                $scope.addAlert("danger",data.error);
                $scope.pop('error','', data.error);
            }
        });
    };

    //获取班次列表
    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
        if($scope.myProjectOrg == null){
            return;
        }
        setTimeout(function () {
            var url = 'attds/workShiftSettings/'+$scope.myProjectOrg.conductssId+'?page='+page+'&size='+pageSize;
            $http.get(url).success(function (pagedata) {
                $scope.workShift = pagedata.data.content;
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

    //选择组织
    $scope.selectProjectOrg = function() {
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    };

    $scope.modifyWorkShiftSetting = function(workShiftSetting){
        var rtn = $modal.open({
            templateUrl: 'tpl/app_prj_attendance_modify_workShiftSetting.html',
            controller: 'prjModifyWorkShiftSettingController',
            resolve:{
                workShift:function(){return workShiftSetting}
            }
        });
        rtn.result.then(function (status) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
            if(status){
                $scope.pop('success','','编辑班次成功');
            }
        },function () {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        });
    };
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

    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
}]);
app.filter('jsobFilter',function() {
    return function(input) {
        var output = '';
        var jsonb = angular.fromJson(input);
        if(jsonb == null){
            output = '自由考勤';
        }
        angular.forEach(jsonb, function(value, key) {
            output += value.start
            if(value.type == 1){
                output += '- 次日'
            }else{
                output += '-';
            }
            output += value.end + ' ';
        });
        return output;
    };
});