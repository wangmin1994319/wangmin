/**
 * Created by lijian on 2015/12/29.
 */
app.controller('attdStatisticsController',['$scope','$localStorage','$http','moment', '$modal','$filter', '$state',function($scope, $localStorage,$http,moment,$modal,$filter,$state) {
    $scope.structure = [];

    $scope.startDate = moment(new Date()).add(-30,'d').format('YYYY-MM-DD');
    $scope.endDate  = moment(new Date()).format('YYYY-MM-DD');
    $scope.openStart = function($event) {
        $scope.startOpened = true;
    };
    $scope.openEnd = function($event) {
        $scope.endOpened = true;
    };
    $scope.dateOptions = {
        showWeeks:'false',
        dateFormat:'yyyy-MM-dd'

    };

    $scope.expanding_property = {
        field: "name",
        displayName: "姓名",
        filterable: true
    };

    $scope.col_defs = [
        {
            field: "attdHours",
            displayName: "总工时"
        },
        {
            field: "attdDays",
            displayName: "出勤日"
        },
        {
            field: "type",
            displayName: "考勤详情",
            cellTemplate:
                "<button class='btn btn-info btn-sm m-l-xs m-t-n-xs' ng-click=\"cellTemplateScope.personalAttdInfo(row.branch)\" ng-show=\"row.branch['type'] == 2\">详情</button>",
            cellTemplateScope: {
                personalAttdInfo: function (branch) {
                    $state.go("app.project.worker-recrods",{workerId:branch.id,startDate:$scope.startDate,endDate:$scope.endDate,operator:$scope.myProject.projectWorkerId});
                }
            }
        }
        ]

    function getMyProjects(){
        $http.get('/sysUsers/projects').success(function(data){
            if(data){
                if(data.status == 'SUCCESS'){
                    if(data.data != null) {
                        $scope.socialOrgs = data.data;
                        $scope.socialOrg = $scope.socialOrgs[0];
                        $scope.myProjects = data.data[0].projects;
                        $scope.myProject = $scope.myProjects[0];
                    }
                }
            }
        });
    }
    getMyProjects();

    $scope.changeProjects = function(){
        $scope.myProjects = $scope.socialOrg.projects;
        $scope.myProject = $scope.myProjects[0];
    }
    function init(){
        var thisYear = moment(new Date()).format("YYYY");
        var thisMonth = moment(new Date()).format("MM");
        $scope.years = [];
        $scope.months = [];
        for(var i=0;i<5;i++){
            $scope.years.push((thisYear-i));
        }
        for(var i=1;i<=12;i++){
            $scope.months.push(i);
        }
        $scope.year = parseInt(thisYear);
        $scope.month = parseInt(thisMonth);
    }

    init();

    $scope.selectPeople = function(){
        var rtn = $modal.open({
            templateUrl: 'tpl/app_project_tree.html',
            controller: 'selectProjectOrgController',
            resolve:{
                projectworkerId:function(){return $scope.myProject.projectWorkerId;}
            }
        });
        rtn.result.then(function(returnJson){
            $scope.selectProjectWorker = returnJson.selectedPeople;
            $scope.structure = returnJson.structure;
            statistics();
        });
    }

    $scope.attdStatic = {totalNum:0,attdDays:0,attdHours:0};
    function statistics(){
        var startTempDate = moment($scope.startDate).format('YYYY-MM-DD');
        var endTempDate = moment($scope.endDate).format('YYYY-MM-DD');
        $scope.attdStatic.totalNum = $scope.selectProjectWorker.split(",").length;
        $http.get('/attds/attendances/statistic/'+$scope.myProject.projectWorkerId+'?projectWorkerIds='+$scope.selectProjectWorker+'&startDate='+startTempDate+'&endDate='+endTempDate).success(function(data){
            var statistics = data.data;
            for(var i in statistics){
                $scope.staticPerson = $filter('filter')($scope.structure, function (data) {
                    return data.id === statistics[i].id
                })[0];
                $scope.attdStatic.attdDays += statistics[i].attdDays;
                $scope.attdStatic.attdHours += statistics[i].attdHours;
                $scope.staticPerson.attdDays = statistics[i].attdDays;
                $scope.staticPerson.attdHours = statistics[i].attdHours;
            }
            $scope.structure = convertData($scope.structure);
        })
    }

    function convertData(nodes){
        var map = {}, node, roots = [];
        for (var i = 0; i < nodes.length; i += 1) {
            node = nodes[i];
            node.children = [];
            map[node.id] = i; // use map to look-up the parents
            if (node.parentId != 0) {
                if(map[node.parentId] == undefined){
                    roots.push(node);
                    continue;
                }
                nodes[map[node.parentId]].children.push(node);
            } else {
                roots.push(node);
            }
        }
        return roots;
    }


    $scope.nextMonth = function(){
        for(var i=0;i<$scope.months.length;i++){
            if($scope.months[i]==$scope.month){
                if(i==$scope.months.length-1){
                    $scope.month = $scope.months[0];
                }else{
                    $scope.month = $scope.months[i+1];
                }
                break;
            }
        }
    };

    $scope.prevMonth = function(){
        for(var i=0;i<$scope.months.length;i++){
            if($scope.months[i]==$scope.month){
                if(i==0){
                    $scope.month = $scope.months[$scope.months.length-1];
                }else{
                    $scope.month = $scope.months[i-1];
                }
                break;
            }
        }
    };


}]);