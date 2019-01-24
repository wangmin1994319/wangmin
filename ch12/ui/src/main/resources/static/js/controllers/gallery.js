/**
 * Created by fuwt on 2015/12/28.
 */

app.controller('Ctrl', ['$scope',function($scope) {
    var self = this;

    $scope.images = [
        {thumb: 'img/a0.jpg', img: 'img/a0.jpg', description: '图片1'},
        {thumb: 'img/c1.jpg', img: 'img/c1.jpg', description: '图片2'},
        {thumb: 'img/c2.jpg', img: 'img/c2.jpg', description: '图片3'},
        {thumb: 'img/c3.jpg', img: 'img/c3.jpg', description: '图片4'}
    ];
}]);

