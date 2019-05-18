app.controller('prjupdateController', ['toaster', '$scope', '$http', '$localStorage', '$modal', '$state', 'project','$stateParams',
    function (toaster, $scope, $http, $localStorage, $modal, $state, project,$stateParams) {
        $http.get('data/bulidType.json').success(function (data) {
            $scope.bulidTypes = data;
        });
        $http.get('data/structType.json').success(function (data) {
            $scope.structTypes = data;
        });
        $scope.prj = {};
        $scope.userInfo = $localStorage.userinfo;
        $scope.pmName = $scope.userInfo.realName;
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

        function init(){
            $http.get("/projectOrgs/G" +$stateParams.projectOrgId)
                .success(function (result) {
                    if(result.status == "SUCCESS") {
                        $scope.prj = result.data.projectDto;
                        $scope.contractCom = $scope.prj.contractCom;
                    }
                });
        }

        init();

        $scope.save = function(){
            $scope.prj.contractCom = null;
            $scope.prj.prjDpt = null;
            $http.put('/projectOrgs/'+$stateParams.projectOrgId+'/projects/'+$scope.prj.id, $scope.prj).success(function(result){
                if(result.status == "SUCCESS"){
                    $scope.pop('success','','修改项目部信息成功');
                }else{
                    $scope.pop('error','', result.error);
                }
            })
        };

        $scope.open = function (size) {
            var dlg = $modal.open({
                templateUrl: 'js/template/app_pro_select_pm.html',
                controller: 'selectPMController',
                size: size,
                resolve: {}
            });
            dlg.result.then(function (pm) {
                $scope.pmName = pm.name;
                $scope.userInfo.workerId = pm.id;
            });
        };

        $scope.closeAlert = function (b) {
            $scope.alerts.splice(b, 1)
        };
    }])
;

app.controller('selectPMController', ['$scope', '$http', '$localStorage', '$modalInstance',
    function ($scope, $http, $localStorage, $modalInstance) {

        $scope.socialOrgId = $localStorage.userinfo.socialRole.orgId;
        $scope.orgBrowe = orgBrowe = {};
        $scope.socialOrgs = [];

        $http.get('projects/socialOrgStructure/' + $scope.socialOrgId).success(function (data) {
            orgBrowe.add_root_branch(data.data);
        });

        $scope.expanding_property = {
            field: "name",
            displayName: "姓名"
        };

        $scope.addNewworker = function (branch) {
            for (var b in branch.children) {
                if (branch.children[b].type == 2) {
                    return;
                }
            }
            if (branch.type == 0) {
                $http.get('/socialOrgs/' + branch.id + '/newworkers')
                    .success(function (data) {
                        orgBrowe.add_branch_list(branch, data.data);
                    })
            } else if (branch.type == 1) {
                var parentNode = orgBrowe.select_parent_branch(branch);
                $http.get('/socialOrgs/' + parentNode.id + '/' + branch.id + '/newworkers')
                    .success(function (data) {
                        orgBrowe.add_branch_list(branch, data.data);
                    })
            }
        }

        $scope.ok = function () {
            var t = orgBrowe.get_selected_branch();
            if (t.type == 2)
                $modalInstance.close(t);
        }

        $scope.cancel = function () {
            $modalInstance.dismiss();
        }

    }]);