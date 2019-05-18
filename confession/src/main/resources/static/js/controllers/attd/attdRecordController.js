app.controller('attdRecordController',['toaster', '$uibModal', '$modal', '$scope','$localStorage','$http','moment','calendarHelper', function(toaster, $uibModal, $modal, $scope, $localStorage,$http,moment,calendarHelper) {
    var vm = this;
    //These variables MUST be set as a minimum for the calendar to work
    vm.calendarDay = new Date();
    vm.calendarView = 'month';

    //提示信息
    $scope.toaster = {
        type: 'success',
        title: 'Title',
        text: 'Message'
    };
    $scope.pop = function(type,title,text){
        toaster.pop(type,'',text);
    };

    $scope.years = [
        2011,2012,2013,2014,2015,2016,2017,2018,2019,2020];
    $scope.months = [1,2,3,4,5,6,7,8,9,10,11,12];
    $scope.year = parseFloat(moment(vm.calendarDay).format("YYYY"));
    $scope.month = parseFloat(moment(vm.calendarDay).format("MM"));

    //初始化数据
    function getMyProjects(){
        $http.get('/sysUsers/projects').success(function(data){
            if(data){
                if(data.status == 'SUCCESS'){
                    if(data.data != null) {
                        $scope.socialOrgs = data.data;
                        $scope.socialOrg = $scope.socialOrgs[0];
                        $scope.myProjects = data.data[0].projects;
                        $scope.myProject = $scope.myProjects[0];
                        $scope.getAttdRecords();
                    }
                }
            }
        });

    }

    $scope.changeProjects = function(){
        $scope.myProjects = $scope.socialOrg.projects;
        $scope.myProject = $scope.myProjects[0];
        $scope.getAttdRecords();
    }


    $scope.getAttdRecords= function(){
        $scope.attdSta={attdDays:0,attdHours:0.0}
        if($scope.myProjects.length == 0){
            return;
        }
        $scope.year = parseFloat(moment(vm.calendarDay).format("YYYY"));
        $scope.month = parseFloat(moment(vm.calendarDay).format("MM"));
        if($scope.myProject == null){
            return;
        }
        var url = '/attds/attendances/'+$scope.myProject.projectWorkerId+'/records?startDate=' + getStartDate() + '&' + 'endDate=' + getEndDate();
        $http.get(url).success(function(data){
            vm.tips = angular.fromJson(data.data);
        });
        var url = '/attds/attendances/'+$scope.myProject.projectWorkerId+'/statistic?startDate=' + getStartDate() + '&' + 'endDate=' + getEndDate();
        $http.get(url).success(function(data){
            if(data){
                if(data.status == "SUCCESS"){
                        $scope.attdSta = data.data;
                }
            }
        });
    };
    getMyProjects();



    vm.modifyCell = function(cell){
        var cc  =new CalendarConverter;
        var lunar = cc.solar2lunar(cell.date.toDate());
        var key = moment(cell.date).format('YYYY-MM-DD');
        if(lunar.lunarDay == '初一'){
            cell.label = cell.label +' '+ lunar.lunarMonth+"月";
        }else{
            cell.label = cell.label +' '+ lunar.lunarDay;
        }
        cell.workingHours = '';

        if(vm.tips != undefined && vm.tips[key] != undefined) {
            cell.workingHours = vm.tips[key].workingHours;
        }
    }

    vm.cellClicked = function(date){
        if($scope.myProject == null){
            $scope.pop('error','','您还没有参加任何项目，请先加入到项目中！');
            return;
        }
        var record = vm.tips[moment(date).format('YYYY-MM-DD')];
        if(record == null){
            record = {attd_date:moment(date).format('YYYY-MM-DD')};
            record.working_hours = 0;
        }
        var rtn = $modal.open({
            templateUrl: 'tpl/app_org_attendance_create_apeal.html',
            controller: 'orgCreateApealController',
            resolve:{
                attdData:function(){return (typeof record) == 'string' ? angular.fromJson(record) : record;},
            }
        });

        rtn.result.then(function (status) {
            if(status == 'SUCCESS'){
                $scope.pop('success','','申诉成功，请耐心等待审批');
            }
        },function(){
        });
    };

    function getStartDate(){
        return moment(vm.calendarDay).startOf('month').startOf('week').format('YYYY-MM-DD');
    }

    function getEndDate(){
        return moment(vm.calendarDay).endOf('month').endOf('week').format('YYYY-MM-DD');
    }

    $scope.changeDate = function(){
        var date = new Date();
        date.setFullYear($scope.year);
        date.setMonth($scope.month-1);
        date.setDate(1);
        vm.calendarDay = date;
        $scope.getAttdRecords();
    };

    vm.eventEdited = function(event) {
        $modal.open({
            templateUrl: 'tpl/app_pro_attendance_create_apeal.html',
            controller: 'createApealController',
            resolve:{
                projectOrg:function(){return $scope.myProjectOrg;},
                apealData:function(){return event;}
            }
        });
    };
}]);