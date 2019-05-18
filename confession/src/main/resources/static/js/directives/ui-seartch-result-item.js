app.directive('searchResultsItem', function () {
    return {
        restrict: 'AC',
        replace: true,
        required: 'birthday',
        scope: {
            birthday: "="
        },
        templateUrl: 'js/template/searchResultItem.html',
        link: function (scope, elm, attrs) {

            scope.$watch('birthday',function(newVal,oldVal){  if(newVal!=oldVal){
                scope.birthday=newVal;
                scope.birthdayChange();
            }  },true);

        }

    };
});