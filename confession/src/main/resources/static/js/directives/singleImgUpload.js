app.directive('imageUpload', ["FileUploader","$http",function (FileUploader,$http) {
    return {
        restrict: 'EA',
        replace: true,
        required: 'targeturi',
        scope: {
            targeturi: "=",
            onChange: '&',

        },
        templateUrl: 'js/template/single-image-upload-directive.html',
        link: function (scope, elm, attrs) {
            //先查询图片信息
            scope.imgBool = true;
            scope.headerImg = true;
            function initImage() {
                if(scope.targeturi == undefined){
                    return;
                }
                var url = scope.targeturi;
                url = url.split('upload')[1];
                url = 'getFiles' + url;
                $http.get(url).success(function (data) {
                    if (data.data == null) {
                        scope.headerImg = true;
                        return;
                    }
                    if (data.data.length == 0) {
                        scope.headerImg = true;
                        return;
                    } else {
                        scope.headerImg = false;
                        scope.headerImgUrl = data.data[0] + '?' + new Date().getTime();
                    }
                }).error(function (data) {
                    scope.headerImg = true;
                })
            }
            initImage();
            scope.uploader = new FileUploader();

            //图片上传方法
            scope.imgUpload = function(){
                var img = dataURItoBlob(scope.image1.compressed.dataURL);
                scope.uploader.clearQueue();
                scope.uploader.addToQueue(img);
                scope.uploader.uploadAll();
                //var temp = scope.uploader.queue.length - 1;
                //if(scope.uploader.queue[temp].file.size/1024/1024 > 2){
                //    scope.onChange({type:'error',title:'',text:'上传图片应小于2M'});
                //    return;
                //}
                //scope.uploader.queue[temp].upload();
            }

            var dataURItoBlob = function(dataURI) {
                var binary = atob(dataURI.split(',')[1]);
                var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
                var array = [];
                for(var i = 0; i < binary.length; i++) {
                    array.push(binary.charCodeAt(i));
                }
                return new Blob([new Uint8Array(array)], {type: mimeString});
            };
            scope.uploader.onSuccessItem = function(item, response, status, headers) {
                if(response.status == 'ERROR'){
                    item.isSuccess = false;
                    item.isError = true;
                }
                if(item.isError){
                    scope.onChange({type:'error',title:'',text:response.error});
                    scope.imgBool=false;
                }else{
                    scope.onChange({type:'success',title:'',text:'上传成功'});
                    scope.imgBool=true;
                }
            };
            scope.uploader.onErrorItem = function(item, response, status, headers) {
            };
            scope.uploader.url=scope.targeturi;
            scope.$watch("targeturi",function(newVal,oldVal){
                if(newVal!=oldVal){
                    scope.uploader.url=newVal;
                    initImage();
                }
            },true)
        }

    };
}]);