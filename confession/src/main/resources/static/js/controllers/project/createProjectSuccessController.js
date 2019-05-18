app.controller('CreatePrjSuccessCtrl', ['$scope', '$http', '$localStorage', '$state', 'project',
    function ($scope, $http, $localStorage,$state, project) {

        $scope.projectConductssId = $localStorage.userinfo.prjRoles[0].conductssId;
        $scope.projectOrgConductssId = $localStorage.userinfo.socialRoles[0].conductssId;

        $scope.viewMyProjectOrg= function () {
            $state.go("app.project.org-list");
        }

    }])
;