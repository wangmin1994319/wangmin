app.controller('CreatePrjCtrl', ['$scope', '$http', '$localStorage', '$modal', '$state', 'project','toaster',
    function ($scope, $http, $localStorage, $modal, $state, project,toaster) {
        $scope.showProjectOrg=false;
        $scope.prj = {};
        $scope.pmName = $localStorage.userinfo.realName;
        $scope.alerts = [];

        //操作提醒
        $scope.addAlert = function (type,msg) {
            $scope.alerts.push({
                type: type,
                msg: msg
            })
        };

        //提示信息
        $scope.toaster = {
            type: 'success',
            title: 'Title',
            text: 'Message'
        };
        $scope.pop = function(type,title,text){
            toaster.pop(type,'',text);
        };

        $scope.createPrj = function () {
            $http.post('projects',$scope.prj).success(function (result) {
                    if(result.status == 'ERROR'){
                        $scope.pop('error','',result.error);
                        return;
                    }
                $scope.showProjectOrg=true;
                $scope.projectConductssId = result.data.projectConductssId;
                $scope.projectOrgConductssId = result.data.orgConductssId;
                })

        };

        $scope.viewMyProjectOrg= function () {
            $state.go("app.project.org-list");
        };

        $scope.closeAlert = function (b) {
            $scope.alerts.splice(b, 1)
        };
    }])
;
