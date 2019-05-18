app.directive('multiImageUpload', ["FileUploader",function (FileUploader) {
    return {
        restrict: 'EA',
        replace: true,
        required: 'targeturi',
        scope: {
            targeturi: "=",
            onChange: '&',
        },
        templateUrl: 'js/template/image-upload-directive.html',
        link: function (scope, elm, attrs) {
            scope.uploader = new FileUploader();
            scope.uploader.filters.push({
                name: 'customFilter',
                fn: function(item /*{File|FileLikeObject}*/, options) {
                    return this.queue.length < 1;
                }
            });
            scope.uploader.filters.push({
                name: 'extension',
                fn: function(item) {
                    return /\/(png|jpg|jpeg)$/.test(item.file.type);
                }
            });
            scope.uploader.onSuccessItem = function(item, response, status, headers) {
                //console.info(status, headers);
                if(response.status == 'ERROR'){
                    item.isSuccess = false;
                    item.isError = true;
                }
                console.log(response);
            };
            scope.uploader.onErrorItem = function(item, response, status, headers) {
                console.log(response);
            };
            scope.uploader.url=scope.targeturi;
            scope.$watch("targeturi",function(newVal,oldVal){
                if(newVal!=oldVal){
                    scope.uploader.url=newVal;
                }
            },true)
        }

    };
}]);