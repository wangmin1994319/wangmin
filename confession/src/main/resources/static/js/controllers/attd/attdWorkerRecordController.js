app.controller('attdWorkerRecordController',['toaster', '$uibModal', '$modal', '$scope','$http','moment','calendarHelper','$stateParams', function(toaster, $uibModal, $modal, $scope,$http,moment,calendarHelper,$stateParams) {
    var vm = this;
    //These variables MUST be set as a minimum for the calendar to work

    var projectworkerId = $stateParams.workerId;
    var startTempDate = moment($stateParams.startDate).format('YYYY-MM-DD');
    var endTempDate = moment($stateParams.endDate).format('YYYY-MM-DD');
    var operator = $stateParams.operator;


    var date = new Date();
    date.setFullYear(startTempDate.split("-")[0]);
    date.setMonth(startTempDate.split("-")[1]-1);
    date.setDate(startTempDate.split("-")[2]);

    vm.calendarDay = date;
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

    $scope.year = parseFloat(moment(vm.calendarDay).format("YYYY"));
    $scope.month = parseFloat(moment(vm.calendarDay).format("MM"));

    $scope.getAttdRecords= function(){
        $scope.attdSta={attdDays:0,attdHours:0.0}
        var url = '/attds/attendances/'+projectworkerId+'/records?startDate=' + startTempDate + '&' + 'endDate=' + endTempDate + '&operator='+operator;
        $http.get(url).success(function(data){
            vm.tips = angular.fromJson(data.data);
        });
        var url = '/attds/attendances/'+projectworkerId+'/statistic?startDate=' + startTempDate + '&' + 'endDate=' + endTempDate + '&operator='+operator;
        $http.get(url).success(function(data){
            if(data){
                if(data.status == "SUCCESS"){
                        $scope.attdSta = data.data;
                }
            }
        });
    };

    $scope.getAttdRecords();

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

    $scope.changeDate = function(){
        var date = new Date();
        date.setFullYear($scope.year);
        date.setMonth($scope.month-1);
        date.setDate(1);
        vm.calendarDay = date;
        $scope.getAttdRecords();
    };
}]);