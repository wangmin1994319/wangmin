app.controller('PrjUploadCtrl', ['$scope', 'project', '$localStorage',"toaster",'$state', function ($scope, project, $localStorage,toaster,$state) {
    //提示信息
    $scope.toaster = {
        type: 'success',
        title: 'Title',
        text: 'Message'
    };
    $scope.pop = function(type,title,text){
        toaster.pop(type,'',text);
    };
    $scope.projectId = project.id;
    if(project.id == '' || project.id == null || project.id == undefined){
        $state.go('app.project.org-manage');
    }
}]);