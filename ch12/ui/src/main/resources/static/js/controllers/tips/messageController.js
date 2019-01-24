app.controller("messageController", ['$scope','$state', '$http', '$localStorage', function ($scope,$state,$http,$localStorage) {
    $scope.clickIndex = 0;
    $scope.hasTasks = false;
    $scope.setClickIndex = function(index){
        $scope.clickIndex = index;
    };

    function getTaskNum(){
        $http.get('/flows/getTaskNum/').success(function(data){
            if(data.data.length != 0){
                $scope.hasTasks = true;
            }
        });
    }

    getTaskNum();

    $scope.gotoPage = function(page){
        $state.go(page);
    };

    $scope.$on('location', function(event, data){
        $scope.setClickIndex(data);
    });
}]);