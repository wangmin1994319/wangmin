/**
 * Created by lijian on 2016/1/11.
 */
'use strict';
app.controller('prjModifyWorkShiftSettingController',['$modalInstance', 'moment', '$modal', '$http', '$scope', '$localStorage', 'workShift', function($modalInstance, moment,$modal,$http,$scope,$localStorage,workShift) {
    $scope.tomorrow = moment(new Date()).add('days', 1).format("YYYY-MM-DD");
    $scope.workShiftSetting = {};
    $scope.submit = function(){
        $scope.alerts = [];
        if($scope.flags[0].startTime >= $scope.flags[0].endTime  && $scope.seg1.value == 0){
            $scope.alerts.push({type:"danger",msg:"时间设置不正确！"});
            return;
        }
        var startTime = moment($scope.flags[0].startTime).format("HH:mm");
        var endTime = moment($scope.flags[0].endTime).format("HH:mm");
        var timeSegs = '{"seg1":{"start":"'+startTime+'","end":"'+endTime+'","type":"'+$scope.seg1.value+'"}';
        var record = 1;
        for(var i=1;i < $scope.flags.length;i++){
            var type;
            if(i == 1){
                type = $scope.seg2.value;
            }else if(i == 2){
                type = $scope.seg3.value;
            }else if(i == 3){
                type = $scope.seg4.value;
            }
            if($scope.flags[i].show){
                if($scope.flags[i].startTime >= $scope.flags[i].endTime && type == 0){
                    $scope.alerts.push({type:"danger",msg:"时间设置不正确！"});
                    return;
                }
                record++;
                var startTime = moment($scope.flags[i].startTime).format("HH:mm");
                var endTime = moment($scope.flags[i].endTime).format("HH:mm");
                timeSegs += ',"seg'+record+'":{"start":"'+startTime+'","end":"'+endTime+'","type":"'+type+'"}';
            }
        }
        timeSegs += '}';
        $scope.workShiftSetting.timeSegs = timeSegs;
        $scope.workShiftSetting.alive = 1;
        $scope.workShiftSetting.startDate = moment($scope.tomorrow).format("YYYY-MM-DD");

        $http.put('/attds/projectOrgs/workShiftSettings/'+$scope.workShiftSetting.id, $scope.workShiftSetting).success(function(data){
            if(data){
                if(data.status == "SUCCESS"){
                    $scope.close('SUCCESS');
                }else{
                    $scope.alerts.push({type:"danger",msg:data.error});
                }
            }
        });
    };
    $scope.timeTypes = [{name:'当日',value:0},{name:'次日',value:1}]
    $scope.seg1 = $scope.timeTypes[0];
    $scope.seg2 = $scope.timeTypes[0];
    $scope.seg3 = $scope.timeTypes[0];
    $scope.seg4 = $scope.timeTypes[0];
    function init(){
        $scope.alerts = [];
        $scope.flags = [];
        $scope.hstep = 1;
        $scope.mstep = 10;
        $scope.options = {
            hstep: [1, 2, 3],
            mstep: [1, 5, 10, 15, 25, 30]
        };
        $scope.ismeridian = true;
        $scope.workShiftSetting = workShift;
        var jsonb = angular.fromJson($scope.workShiftSetting.timeSegs);
        var i = 0;
        angular.forEach(jsonb, function(value, key) {
            var timeSeg = {show:true, startTime:new Date('2015-12-25 '+value.start), endTime:new Date('2015-12-25 '+value.end)};
            if(i == 0 && value.type == 1){
                $scope.seg1 = $scope.timeTypes[1];
            }else if(i == 1 && value.type == 1){
                $scope.seg2 = $scope.timeTypes[1];
            }else if(i == 2 && value.type == 1){
                $scope.seg3 = $scope.timeTypes[1];
            }else{
                $scope.seg4 = $scope.timeTypes[1];
            }
            i++;
            $scope.flags.push(timeSeg);
        });
        if($scope.flags.length < 4){
            var length = $scope.flags.length;
            for(var i= 0;i<4-length;i++){
                var timeSeg = {show:false, startTime:new Date(), endTime:new Date()};
                $scope.flags.push(timeSeg);
            }
        }

        var freeFlag = false;
        for(var i=0;i<$scope.flags.length;i++){
            if($scope.flags[i].show){
                freeFlag = true;
            }
        }
        if(!freeFlag){
            $scope.flags[0].show = true;
        }
    }

    init();

    $scope.addTimeSeg = function(){
        for(var i=0;i<$scope.flags.length;i++){
            if(!$scope.flags[i].show){
                $scope.flags[i].show = true;
                break;
            }
        }
    };

    $scope.$watch('seg1',function (newVal, oldVal){
        if(newVal.value == 1){
            $scope.seg2 = $scope.timeTypes[0];
            $scope.seg3 = $scope.timeTypes[0];
            $scope.seg4 = $scope.timeTypes[0];
        }
    })

    $scope.$watch('seg2',function (newVal, oldVal){
        if(newVal.value == 1 && $scope.flags[0].show){
            $scope.seg1 = $scope.timeTypes[0];
            $scope.seg3 = $scope.timeTypes[0];
            $scope.seg4 = $scope.timeTypes[0];
        }
    })


    $scope.$watch('seg3',function (newVal, oldVal){
        if(newVal.value == 1 && $scope.flags[1].show){
            $scope.seg1 = $scope.timeTypes[0];
            $scope.seg2 = $scope.timeTypes[0];
            $scope.seg4 = $scope.timeTypes[0];
        }
    })


    $scope.$watch('seg4',function (newVal, oldVal){
        if(newVal.value == 1 && $scope.flags[2].show){
            $scope.seg1 = $scope.timeTypes[0];
            $scope.seg2 = $scope.timeTypes[0];
            $scope.seg3 = $scope.timeTypes[0];
        }
    })


    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.openStart = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.startOpened = true;
    };

    $scope.openEnd = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.endOpened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        class: 'datepicker',
    };

    $scope.initDate = new Date('2016-15-20');
    $scope.formats = ['yyyy-MM-dd', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    $scope.toggleMode = function() {
        $scope.ismeridian = ! $scope.ismeridian;
    };

    $scope.closeAlert = function (b) {
        $scope.alerts.splice(b, 1)
    };

    $scope.close = function(status){
        $modalInstance.close(status);
    };
}]);