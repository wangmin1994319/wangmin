app.controller('PerinfoController', ['$modal', 'moment','$localStorage', '$scope', '$http', '$state', '$filter', 'newworkerResource', 'FileUploader',"toaster","$rootScope", function ($modal, moment, $localStorage, $scope, $http, $state, $filter, newworkerResource,FileUploader,toaster,$rootScope) {

    $scope.workerTypeArray = [];
    $scope.selfDefWorkerType = [];
    //提示信息
    $scope.toaster = {
        type: 'success',
        title: 'Title',
        text: 'Message'
    };
    $scope.pop = function(type,title,text){
        toaster.pop(type,'',text);
    };
    //获取头像照片
    var url = '/getFiles/'+$localStorage.userinfo.conductssId+'/head?'+new Date().getTime();
    $scope.headerImg = false;

    function getHeadImg(){
        $http.get(url).success(function(data){
            if(data.data == null){
                $scope.headerImg = true;
                return;
            }
            if(data.data.length == 0){
                $scope.headerImg = true;
                return;
            }else{
                $scope.headerImgUrl = data.data[0]+'?'+new Date().getTime();
            }
        }).error(function(data){
            $scope.headerImg = true;
        });
    }

    $scope.$on('headImg', function(event, data){
        $scope.headerImgUrl = data;
    });

    getHeadImg();

    //头像文件上传
    $scope.uploader = new FileUploader();
    $scope.uploader.url='upload/'+$localStorage.userinfo.conductssId+'/head';
    $scope.uploader.filters.push({
        name: 'imageFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });


    $scope.$watch('$viewContentLoaded', function () {
        $scope.loadData();
    });

    //获取用户信息
    $scope.userInfo = $localStorage.userinfo;


    var response = function (data) {
        if ("SUCCESS" == data.status) {
            $scope.addAlert("success", "保存资料成功");
        } else {
            $scope.addAlert("danger", "保存资料失败");
        }
    };

    $scope.initWorkerTypes = function () {
        $http.get('data/workType.json').success(function (workerTypes) {
            $scope.workerTypes = workerTypes;
        });
    };

    function handleWorkerTypes(){
        $scope.sysUser.workerTypes = [];
        for(var i=0;i<$scope.workerTypeArray.length;i++){
            var index = $scope.workerTypeArray[i];
            var workerType = {id:$scope.workerTypes[index].value, enName:$scope.workerTypes[index].en_name,
                name:$scope.workerTypes[index].key, type:0};
            $scope.sysUser.workerTypes.push(workerType);
        }
        // 自定义工种
        for(var i=0;i<$scope.selfDefWorkerType.length;i++){
            if($scope.selfDefWorkerType[i].name != null && $scope.selfDefWorkerType[i].name != ''){
                $scope.sysUser.workerTypes.push($scope.selfDefWorkerType[i]);
            }
        }
    }

    $scope.saveData = function () { //save
        $scope.userName = $localStorage.userinfo.userName;
        $scope.phoneNum = $localStorage.userinfo.phoneNum;
        $scope.sysUserId = $localStorage.userinfo.id;

        $scope.sysUserMessage.userName = $scope.userName;
        $scope.sysUserMessage.phoneNum = $scope.phoneNum;
        $scope.sysUserMessage.sysUserId = $scope.sysUserId;
        console.log($scope.sysUserMessage);
        $http.post('/personInfo/save', $scope.sysUserMessage).success(function(data){
            if(data){
                if ("SUCCESS" == data.status) {
                    $scope.pop('success','','保存资料成功');
                } else {
                    $scope.pop('danger','','保存资料失败');
                }
            }
        });
    };

    //获取个人信息
    $scope.loadData = function () {
        $http.get('/personInfo/query/'+$localStorage.userinfo.userName).success(function(data){
            if(data){
                if(data.status == "SUCCESS"){
                    $scope.sysUserMessage = data.data;
                    console.log(data.data);

                    $scope.sysUserMessage.addr = (data.data.locations)[0].place;


                    if ($scope.sysUserMessage.sex == null) {
                        $scope.sysUserMessage.sex = 1;
                    }
                    $scope.sysUserMessage.nation = parseInt(data.data.nation)

                    if($scope.sysUserMessage.birthday == null){
                        var birthDate;
                        if($scope.sysUserMessage.cardId.length == 18){
                            birthDate = new Date($scope.userInfo.cardId.substring(6, 10) + "-" + $scope.userInfo.cardId.substring(10, 12) + "-" + $scope.userInfo.cardId.substring(12, 14));
                        }else{
                            birthDate = new Date(null);//19700101标准时间
                        }
                        $scope.sysUserMessage.birthday = birthDate;
                    }else{
                        $scope.sysUserMessage.birthday = moment(new Date($scope.sysUserMessage.birthday)).format("YYYY-MM-DD");
                    }
                }
            }
        });
    };

    $scope.addAlert = function (type, msg) {
        $scope.alerts = [{type: type, msg: msg}];
    };

    $scope.closeAlert = function (b) {
        $scope.alerts.splice(b, 1)
    };

    $scope.popUploadHeadImg = function(size){
        var rtn = $modal.open({
            templateUrl: 'tpl/app_upload_head_img.html',
            controller: 'uploadHeadImgController',
            size: size,
            resolve:{}
        });
        rtn.result.then(function () {
        }, function(){
        });
    };

    $scope.addInput = function(){
        $http.get('/getRandomSeq').success(function(result){
            if(result){
                if(result.status == 'SUCCESS'){
                    $scope.selfDefWorkerType.push({id:result.data.randomSeq, name:'', type:'1'});
                }
            }
        });

    };

    $scope.deleteWorkType = function(self){
        var tempArray = [];
        for(var i=0;i<$scope.selfDefWorkerType.length;i++){
            var data = $scope.selfDefWorkerType[i];
            if(data.id != self.id){
                tempArray.push(data);
            }
        }
        $scope.selfDefWorkerType = tempArray;
    }
}]);

app.controller('RevisePhoneNumCtrl', ['$scope', '$modalInstance', '$localStorage', '$http', '$q', function ($scope, $modalInstance, $localStorage, $http, $q) {

    $scope.oldPhoneNum = $localStorage.userinfo.phoneNum;
    $scope.newPhoneNum = {};
    $scope.msgCode = '';
    $scope.status = 0;//当前操作阶段状态值 0为第一步验证当前手机，1为第二步通过当前手机验证 并输入新的手机号 再次验证,2:为修改手机号码成功 3.修改手机号码失败
    var httpProxy = function (uri, data) {
        var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
        $http.get(uri, data).
            success(function (data, status, headers, config) {
                deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
            }).
            error(function (data, status, headers, config) {
                deferred.reject(data);   // 声明执行失败，即服务器返回错误
            });
        return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
    };

    var changeCdStatu = function (show) {
        show ? $scope.$broadcast('timer-start') : $scope.$digest();
        $scope.startCountdown = show;
        $scope.showmsg = show ? "s 后重新获取" : "获取短信验证码";
    };

    $scope.showmsg = "获取短信验证码";

    $scope.getOldPnoneNumCode = function () {
        httpProxy('sendCode', {params: {phoneNum: $scope.oldPhoneNum}}).then(function (data) {
            if ("SUCCESS" == data.status) {
                changeCdStatu(true);
            }
        });
    };

    $scope.validateOldCode = function () {
        if ($scope.msgCode) {
            httpProxy('verifyCode', {
                params: {
                    phoneNum: $scope.oldPhoneNum,
                    msgValidate: $scope.msgCode
                }
            }).then(function (data) {
                if ("SUCCESS" == data.status) {
                    $scope.msgCod = '';
                    $scope.status = 1;
                }
            });
        }

    };

    $scope.getNewPhoneNumCode = function () {
        if ($scope.newPhoneNum) {
            httpProxy('sendCode', {params: {phoneNum: $scope.newPhoneNum}}).then(function (data) {
                if ("SUCCESS" == data.status) {
                    changeCdStatu(true);
                }
            });
        }
    };

    $scope.validateNewCode = function () {
        if ($scope.newPhoneNum && $scope.msgCode) {
            httpProxy('verifyCode', {
                params: {
                    phoneNum: $scope.newPhoneNum,
                    msgValidate: $scope.msgCode
                }
            }).then(function (data) {
                if ("SUCCESS" == data.status) {
                    $scope.msgCod = '';
                    $scope.status = 2;
                }
            });
        }
    };

    $scope.closeModal = function () {
        $modalInstance.close($scope.newPhoneNum);
    };

    $scope.$on('timer-stopped', function (event, data) {
        $scope.startCountdown = false;
        $scope.showmsg = "获取短信验证码";
        $scope.$digest();//通知视图模型的变化
    });

    //取消修改
    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
}]);

app.controller("uploadHeadImgController", ['$modalInstance', 'toaster', 'FileUploader', '$modal', '$scope', '$http', '$localStorage', '$rootScope',function ($modalInstance, toaster, FileUploader, $modal, $scope, $http, $localStorage, $rootScope) {
    $scope.myImage='';
    $scope.myCroppedImage='';
    $scope.myCroppedFormat='image/jpeg';
    var imgSelected = false;
    var handleFileSelect=function(evt) {
        var file=evt.currentTarget.files[0];
        imgSelected = true;
        var reader = new FileReader();
        reader.onload = function (evt) {
            $scope.$apply(function($scope){
                $scope.myImage=evt.target.result;
            });
        };
        reader.readAsDataURL(file);
    };

    $scope.selectFile = function(){
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = '.jpg,.png,.jpeg,.gif,.bmp,.xgd';
        input.addEventListener('change', handleFileSelect);
        input.click();
    };

    //头像文件上传
    $scope.uploader = new FileUploader();
    $scope.uploader.url='upload/'+$localStorage.userinfo.conductssId+'/head';
    $scope.uploader.filters.push({
        name: 'imageFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

    $scope.uploader.onSuccessItem = function(item, response, status, headers) {
        if(response.status == 'ERROR'){
            item.isSuccess = false;
            item.isError = true;
        }
        if(item.isError){
            $scope.pop('error','', response.error);
        }else{
            $rootScope.$broadcast('headImg', response.data+"?"+new Date().getTime());
            $scope.pop('success','','图片上传成功');
            $scope.close();
        }
    };

    $scope.headImgUpload = function(file){
        if(!imgSelected){
            return;
        }
        $scope.uploader.clearQueue();
        blobFile = dataURItoBlob(file);
        $scope.uploader.addToQueue(blobFile);
        $scope.uploader.uploadAll();
    };

    var dataURItoBlob = function(dataURI) {
        var binary = atob(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var array = [];
        for(var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {type: mimeString});
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

    $scope.close = function(){
        $modalInstance.close();
    };
}]);
