app.controller('NavController', ['$scope', '$localStorage', '$state', function($scope, $localStorage, $state) {
    $scope.myHomepage = function(){
        var conductssId = $localStorage.userinfo.conductssId;
        $localStorage.homepage = {conductssId:conductssId};
        //$state.reload();
        $state.go("app.default.personalInfo", {}, { reload: true });
    }
}]);
