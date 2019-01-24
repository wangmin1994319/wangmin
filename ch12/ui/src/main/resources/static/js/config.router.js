 'use strict';

/**
 * Config for the router
 */
angular.module('app')
  .run(
    [          '$rootScope', '$state', '$stateParams',
      function ($rootScope,   $state,   $stateParams) {
          $rootScope.$state = $state;
          $rootScope.$stateParams = $stateParams;        
      }
    ]
  )
  .config(
    [          '$stateProvider', '$urlRouterProvider', 'JQ_CONFIG', 'MODULE_CONFIG', 
      function ($stateProvider,   $urlRouterProvider, JQ_CONFIG, MODULE_CONFIG) {


          $urlRouterProvider.otherwise("/access/signin");
          $stateProvider.state("app", {
              "abstract": !0,
              url: "/app",
              templateUrl:  "tpl/app.html",
              resolve: load(["js/controllers/nav.js"])
          }).state("home", {
              url: "/home",
              templateUrl: "tpl/page_home.html"
          }).state("app.default", {
              url: "/default",
              templateUrl: "tpl/personalHomepage.html",
              resolve: load(["js/controllers/personalInfo/personalHomepageController.js"])
          }).state("access.forgotpwd", {
              url: "/forgotpwd",
              templateUrl: "tpl/page_forgotpwd.html",
              resolve: load(["js/controllers/personalInfo/forgotPwdController.js", "js/controllers/personalInfo/forgetPwdAlertController.js"])
          }).state("app.default.personalProjectSuffer", {
              url: "/personalProjectSuffer",
              templateUrl: "tpl/personalProjectSuffer.html",
              resolve: load(["js/controllers/personalInfo/personalProjectSufferController.js"])
          }).state("app.default.personalInfo", {
              url: "/personalInfo",
              templateUrl: "tpl/personalInfo.html",
              resolve: load(["js/controllers/personalInfo/personalInfoController.js"])
          }).state("app.changepwd", {
              url: "/changepwd",
              templateUrl: "tpl/page_changepwd.html",
              resolve: load(["js/controllers/personalInfo/changePwdController.js"])
          }).state("app.default.personalEventEval", {
              url: "/personalEventEval",
              templateUrl: "tpl/personalEventEval.html",
              resolve: load(["js/controllers/eval/personalEventEvalController.js"])
          }).state("app.default.personalCommentEval", {
              url: "/personalCommentEval",
              templateUrl: "tpl/personalCommentEval.html",
              resolve: load(["js/controllers/eval/personalCommentEvalController.js"])
          }).state("app.companyHomepage", {
              url: "/companyHomepage",
              templateUrl: "tpl/companyHomepage.html",
              resolve: load(["js/controllers/socialOrgInfo/companyHomepageController.js"])
          }).state("app.companyHomepage.companyProjectSuffer", {
              url: "/companyProjectSuffer",
              templateUrl: "tpl/companyProjectSuffer.html",
              resolve: load(["js/controllers/socialOrgInfo/companyProjectSufferController.js"])
          }).state("app.companyHomepage.companyInfo", {
              url: "/companyInfo",
              templateUrl: "tpl/companyInfo.html",
              resolve: load(["js/controllers/socialOrgInfo/companyInfoController.js"])
          }).state("app.companyHomepage.companyEventEval", {
              url: "/companyEventEval",
              templateUrl: "tpl/personalEventEval.html",
              resolve: load(["js/controllers/eval/personalEventEvalController.js"])
          }).state("app.companyHomepage.companyCommentEval", {
              url: "/companyCommentEval",
              templateUrl: "tpl/personalCommentEval.html",
              resolve: load(["js/controllers/eval/personalCommentEvalController.js"])
          }).state("app.projectHomepage", {
              url: "/projectHomepage",
              templateUrl: "tpl/projectHomepage.html",
              resolve: load(["js/controllers/project/projectHomepageController.js"])
          }).state("app.perinfo", {
              url: "/perinfo",
              templateUrl: "tpl/newworker.html",
              resolve: load(["toaster","angularFileUpload","ngImgCrop","js/controllers/personalInfo/newworkerController.js","js/directives/ui-birthday-date-picker.js","js/directives/ui-nation-picker.js"])
          }).state("app.create-org", {
              url: "/create-org",
              templateUrl: "tpl/app_org_orgInfo.html",
              resolve: load(["toaster","angularFileUpload","js/controllers/socialOrgManage/orgCreateController.js",
                  "js/directives/ui-nation-area-picker.js", "js/controllers/socialOrgManage/mapController.js"])
          }).state("app.organization.update-org", {
              url: "/update-org/:socialOrgId",
              templateUrl: "tpl/app_org_updateOrgInfo.html",
              resolve: load(["toaster", "angularFileUpload", "js/controllers/socialOrgManage/orgUpdateController.js", "js/controllers/socialOrgManage/mapController.js","js/directives/ui-nation-area-picker.js"])
          }).state("app.recruitment", {
              url: "/recruitment",
              template: '<div ui-view class="fade-in-up"></div>'
          }).state("app.recruitment.rec-in", {
              url: "/recin",
              templateUrl: "tpl/job_invite.html",
              resolve: load(["toaster","js/directives/ui-nation-area-picker.js", "js/controllers/job/jobInviteController.js"])
          }).state("app.recruitment.rec-out", {
              url: "/recout",
              templateUrl: "tpl/job_apply.html",
              resolve: load(["toaster","js/directives/ui-nation-area-picker.js", "js/controllers/job/jobApplyController.js"])
          }).state("app.recruitment.rec-see-in", {
              url: "/recseein",
              templateUrl: "tpl/job_see_invite.html",
              resolve: load(["js/controllers/job/jobSeeInviteController.js"])
          }).state("app.recruitment.rec-see-out", {
              url: "/recseeout",
              templateUrl: "tpl/job_see_apply.html",
              resolve: load(["js/controllers/job/jobSeeApplyController.js"])
          }).state("app.recruitment.job_apply_history", { //申请历史纪录
              url: "/jobApplyHistory",
              templateUrl: "tpl/job_apply_history.html",
              resolve: load(["ngGrid", "js/controllers/grid.js","../libs/jquery/flot/jquery.flot.resize.js", "js/controllers/job/jobApplyHistoryController.js"])
          }).state("app.recruitment.job_invite_history", { //招工历史纪录
              url: "/jobInviteHistory",
              templateUrl: "tpl/job_invite_history.html",
              resolve: load(["ngGrid", "js/controllers/grid.js","../libs/jquery/flot/jquery.flot.resize.js", "js/controllers/job/jobInviteHistoryController.js"])
          }).state("app.organization", {
              url: "/organization",
              template: '<div ui-view class="fade-in-up"></div>'
          }).state("app.organization.workShiftSetting", {
              url: "/app_pro_workShiftSetting",
              templateUrl: "tpl/app_org_attd_workShiftSetting.html",
              resolve: load(['toaster', 'ngGrid','js/controllers/workShiftSetting/orgWorkShiftSettingController.js', "js/controllers/workShiftSetting/orgModifyWorkShiftSettingController.js"])
          }).state("app.organization.attd_myworkshiftplan", {
              url: "/orgMyWorkShiftPlan",
              templateUrl: "tpl/app_org_attd_myWorkShiftPlan.html",
              resolve: load(["js/controllers/attd/org/orgMyWorkShiftPlanController.js"])
          }).state("app.organization.attd_myrecords", {
              url: "/myRecords",
              templateUrl: "tpl/app_org_attd_myRecords.html",
              resolve: load(["toaster", "js/controllers/attd/org/orgAttdRecordController.js", "js/controllers/attd/orgCreateApealController.js"])
          }).state("app.organization.attedce-complain", {
              url: "/attedce-complain",
              templateUrl: "tpl/app_org_attedce_complain.html"
          }).state("app.organization.attedce-count", {
              url: "/attedce-count",
              templateUrl: "tpl/app_org_attedce_count.html",
              resolve: load(["ngGrid", "js/controllers/attd/org/orgAttdStatisticsController.js"])
          }).state("app.organization.attendance-workShift", {
              url: "/orgWorkShift",
              templateUrl: "tpl/app_org_attd_workShift.html",
              resolve: load(["ngGrid", "js/controllers/attd/org/orgWorkShiftController.js", "js/controllers/attd/org/orgAddWorkShiftController.js",
                "js/controllers/attd/org/orgModifyWorkShiftController.js"])
          }).state("app.organization.attendance-workShiftPlan", {
              url: "/orgWorkShiftPlan",
              templateUrl: "tpl/app_org_attd_workShiftPlan.html",
              resolve: load(["ngGrid", "js/controllers/attd/org/orgWorkShiftPlanController.js", "js/controllers/attd/org/orgAddWorkShiftPlanController.js",
                  "js/controllers/attd/org/orgModifyWorkShiftPlanController.js", "js/controllers/attd/org/selectSocialOrgController.js"])
          }).state("app.organization.attedce-time-setting", {
              url: "/attedce-time-setting",
              templateUrl: "tpl/app_org_attedce_time_setting.html",
          }).state("app.organization.org-upload", {
              url: "/upload/:socialOrgId",
              templateUrl: "tpl/app_org_org_upload.html",
              resolve: load(["toaster","js/controllers/socialOrgManage/socialOrgUploadController.js","angularFileUpload", "js/directives/ui-nation-picker.js", "js/directives/ui-image-upload.js"])
          }).state("app.organization.org-list", {
              url: "/list",
              templateUrl: "tpl/app_org_org_list.html",
              resolve: load(["toaster", "ngGrid","js/controllers/socialOrgManage/socialOrgBrowseController.js"])
          }).state("app.organization.org-manage", {
              url: "/manage",
              templateUrl: "tpl/app_org_org_manage.html",
              resolve: load(["toaster",
                  "angularBootstrapNavTree","ngGrid","js/controllers/socialOrgManage/socialOrgManageController.js",
                  "js/controllers/socialOrgManage/employeeController.js","js/controllers/socialOrgManage/addDeptController.js",
                  "js/controllers/socialOrgManage/modifyDeptController.js","js/controllers/socialOrgManage/modifyEmployeeController.js",
                  "js/controllers/socialOrgManage/orgChildrenTreeController.js","js/controllers/socialOrgManage/treeController.js",
                  "js/controllers/socialOrgManage/modifySocialOrgController.js","js/controllers/socialOrgManage/modifySocialOrgTreeController.js",
                  "js/controllers/socialOrgManage/addSocialOrgController.js"])
          }).state("app.organization.org-jurisdiction", {
              url: "/jurisdiction",
              templateUrl: "tpl/app_org_org_jurisdiction.html",
              resolve: load(["../libs/jquery/flot/jquery.flot.resize.js","ngGrid","toaster", "js/controllers/socialOrgManage/orgJurisdiction.js"])
          }).state("app.organization.org-apply", {
              url: "/apply",
              templateUrl: "tpl/app_org_org_apply.html",
              resolve: load(["js/controllers/socialOrgManage/orgApplyController.js"])
          }).state("app.organization.org-record", {
              url: "/record",
              templateUrl: "tpl/app_org_org_record.html",
              resolve: load(['js/controllers/app_org_org_record.js','ngGrid'])
          }).state("app.organization.org-apply-records", {
              url: "/org-apply-records",
              templateUrl: "tpl/app_org_org_applyRecords.html",
              resolve: load(["js/controllers/socialOrgManage/orgApplyRecordsController.js","ngGrid"])
          }).state("app.project", {
              url: "/project",
              template: '<div ui-view class="fade-in-up"></div>'
          }).state("app.project.attedce-myworkshiftplan", {
              url: "/myWorkShiftPlan",
              templateUrl: "tpl/app_pro_myWorkShiftPlan.html",
              resolve: load(['js/controllers/attd/myWorkShiftPlanController.js'])
          }).state("app.project.attedce-record", {
              url: "/attdRecord",
              templateUrl: "tpl/app_pro_attdRecord.html",
              resolve: load(["toaster", "js/controllers/attd/attdRecordController.js", "js/controllers/attd/orgCreateApealController.js"])
          }).state("app.project.attendance-my-complain", {
              url: "/attendance-my-complain",
              templateUrl: "tpl/app_pro_attendance_my_complain.html",
              resolve: load(["ngGrid","js/controllers/attd/apeal/myApealController.js","js/controllers/attd/apeal/myApealDetailsController.js"])
          }).state("app.project.attedce-complain", {
              url: "/attedce-complain",
              templateUrl: "tpl/app_pro_attedce_complain.html",
              resolve: load(["ngGrid","js/controllers/attd/apeal/apealManageController.js", "js/controllers/attd/apeal/apealDetailsController.js",
                "js/controllers/attd/apeal/handleApealController.js"])
          }).state("app.project.attedce-count", {
              url: "/attedce-count",
              templateUrl: "tpl/app_pro_attendance_attdStatistics.html",
              resolve: load(["ngGrid","js/controllers/attd/attdStatisticsController.js", "js/controllers/attd/selectProjectOrgController.js"])
          }).state("app.project.attedce-workShift", {
              url: "/workShift",
              templateUrl: "tpl/app_pro_attedce_work_shift.html",
              resolve: load(["ngGrid", "js/controllers/attd/workShiftController.js", "js/controllers/attd/addWorkShiftController.js",
                "js/controllers/attd/modifyWorkShiftController.js"])
          }).state("app.project.workShiftSetting", {
              url: "/app_pro_workShiftSetting",
              templateUrl: "tpl/app_prj_attd_workShiftSetting.html",
              resolve: load(['toaster', 'ngGrid','js/controllers/workShiftSetting/prjWorkShiftSettingController.js', "js/controllers/workShiftSetting/prjModifyWorkShiftSettingController.js"])
          }).state("app.project.attedce-workShiftPlan", {
              url: "/workShiftPlan",
              templateUrl: "tpl/app_pro_attedce_work_shift_plan.html",
              resolve: load(["ngGrid", "js/controllers/attd/workShiftPlanController.js", "js/controllers/attd/addWorkShiftPlanController.js", "js/controllers/attd/selectProjectOrgController.js",
                  "js/controllers/attd/modifyWorkShiftPlanController.js"])
          }).state("app.project.org-list", {
              url: "/list",
              templateUrl: "tpl/app_pro_org_list.html",
              resolve: load(["ngGrid","js/controllers/prjOrgManage/projectOrgBrowseController.js"])
          }).state("app.project.updateproject", {
              url: "/updateproject/:projectOrgId",
              templateUrl: "tpl/app_prj_update.html",
              resolve: load(["toaster", "js/controllers/project/prjUpdateController.js","js/directives/ui-nation-area-picker.js","js/directives/ui-birthday-date-picker.js"])
          }).state("app.project.org-manage", {
              url: "/manage",
              templateUrl: "tpl/app_pro_org_manage.html",
              resolve: load(["angularBootstrapNavTree","ngGrid","js/controllers/prjOrgManage/prjOrgManageController.js","js/controllers/prjOrgManage/addPrjOrgDeptController.js",
                  "js/controllers/prjOrgManage/addPrjOrgController.js","js/controllers/prjOrgManage/addPrjWorkerController.js",
                  "js/controllers/prjOrgManage/modifyPrjOrgDeptController.js","js/controllers/prjOrgManage/modifyPrjWorkerController.js",
                  "js/controllers/prjOrgManage/prjOrgTreeController.js","js/controllers/prjOrgManage/modifyPrjOrgController.js","js/controllers/eval/evalController.js",
                  "js/directives/ui-nation-area-picker-b.js","toaster","angularFileUpload","js/directives/ui-image-upload.js"])
          }).state("app.project.org-jurisdiction", {
              url: "/jurisdiction",
              templateUrl: "tpl/app_pro_org_jurisdiction.html",
              resolve: load(["../libs/jquery/flot/jquery.flot.resize.js","ngGrid","js/controllers/prjOrgManage/projectOrgJurisdictionController.js"])
          }).state("app.attedce", {
              url: "/attedce",
              template: '<div ui-view class="fade-in-up"></div>'
          }).state("app.attedce.info", {
              url: "/info",
              templateUrl: "tpl/app_attedce_info.html"
          }).state("app.evaluation", {
              url: "/evaluation",
              template: '<div ui-view class="fade-in-up"></div>'
          }).state("app.evaluation.info", {
              url: "/info",
              templateUrl: "tpl/app_evaluation_info.html"
          }).state("access", {
              url: "/access",
              template: '<div ui-view class="fade-in-right-big smooth"></div>'
          }).state("access.signin", {
              url: "/signin",
              templateUrl: "tpl/page_signin.html",
              resolve: load(["toaster","js/controllers/personalInfo/signin.js"])
          }).state("access.signup", {
              url: "/signup",
              templateUrl: "tpl/page_signup.html",
              resolve: load(["toaster","js/controllers/personalInfo/signup.js"])
          }).state("app.organization.prj-create", {
              url: "/create-prj",
              templateUrl: "tpl/app_pro_create.html",
              resolve: load(["toaster","js/directives/ui-birthday-date-picker.js", "js/directives/ui-nation-area-picker.js", "js/controllers/project/createProjectController.js"])
          }).state("app.organization.project-upload", {
              url: "/upload-prj",
              templateUrl: "tpl/app_pro_project_upload.html",
              resolve: load(["toaster","angularFileUpload", "js/controllers/project/projectUploadController.js", "js/directives/ui-nation-picker.js", "js/directives/ui-image-upload.js"])
          }).state("app.organization.prj-create-success", {
              url: "/prj-create-success",
              templateUrl: "tpl/app_pro_project_success.html",
              resolve: load(["js/controllers/project/createProjectSuccessController.js"])
          }).state("app.project.org-apply", {
              url: "/apply",
              templateUrl: "tpl/app_pro_org_apply.html",
              resolve: load(["js/controllers/prjOrgManage/projectApplyController.js"])

              //app.project.org-appl
          }).state("app.project.org-record", {
              url: "/record",
              templateUrl: "tpl/app_prj_org_record.html",
              resolve: load(['js/controllers/app_prj_org_record.js','ngGrid'])

              //app.project.org-appl
          }).state("app.project.worker-recrods", {
              url: "/worker-recrods/:workerId/:startDate/:endDate/:operator",
              templateUrl: "tpl/app_project_worker_records.html",
              resolve: load(["toaster", "js/controllers/attd/attdWorkerRecordController.js", "js/controllers/attd/orgCreateApealController.js"])
          }).state("app.tips", {
              url: "/tips",
              templateUrl: "tpl/app_tips.html",
              resolve: load([ "../libs/jquery/flot/jquery.flot.resize.js", "js/controllers/tips/messageController.js"])
          }).state("app.tips.suspendingMsg", {
              url: "/suspendingMsg",
              templateUrl: "tpl/app_tips_suspendingMsg.html",
              resolve: load(["toaster","ngGrid","js/controllers/tips/suspendingMsgController.js","js/controllers/tips/approveTipsController.js",
                "js/controllers/tips/refuseTipsController.js"])
          }).state("app.tips.noticeMsg", {
              url: "/noticeMsg",
              templateUrl: "tpl/app_tips_noticeMsg.html",
              resolve: load(["toaster","ngGrid","js/controllers/tips/noticeMsgController.js"])
          });
          function load(srcs, callback) {
            return {
                deps: ['$ocLazyLoad', '$q',
                  function( $ocLazyLoad, $q ){
                    var deferred = $q.defer();
                    var promise  = false;
                    srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
                    if(!promise){
                      promise = deferred.promise;
                    }
                    angular.forEach(srcs, function(src) {
                      promise = promise.then( function(){
                        if(JQ_CONFIG[src]){
                          return $ocLazyLoad.load(JQ_CONFIG[src]);
                        }
                        angular.forEach(MODULE_CONFIG, function(module) {
                          if( module.name == src){
                            name = module.name;
                          }else{
                            name = src;
                          }
                        });
                        return $ocLazyLoad.load(name);
                      });
                    });
                    deferred.resolve();
                    return callback ? promise.then(function(){ return callback(); }) : promise;
                }]
            }
          }
      }
    ]
  )
    .config(['$httpProvider', function($httpProvider) {
        //Handle 401 Error
        $httpProvider.interceptors.push(function($q, $injector) {
            return {
                response: function(response){
                    return response || $q.when(response);
                },
                responseError: function(rejection){
                    if(rejection.status === 401){
                        var state = $injector.get('$state');
                        state.go("access.signin");
                    }
                    return $q.reject(rejection);
                }
            };
        });
    }]);
