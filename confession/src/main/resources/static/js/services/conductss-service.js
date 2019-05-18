var serviceModuel=angular.module('conductss.service', ['ngResource'])
    .factory('newworkerResource',['$resource',function($resource){

        return {
            "query":$resource('/newworkers/selfInfo').get,
            "update":$resource('newworkers/').put
        };


    }]).factory('socialOrgResource',['$resource',function($resource){

        return {
            "autoQuery":$resource('socialOrgs/query').get,
            "accurateQuery":$resource("socialOrgs/:socialOrgId",{socialOrgId:'@socialOrgId'}).get,
            "joinOrgForPerson":$resource("socialOrgs/join/:socialOrgId",{socialOrgId:"@socialOrgId"}).save,
            "joinOrgForOrg":$resource("socialOrgs/join/:socialOrgId/:applySocialOrgId",{socialOrgId:"@socialOrgId", applySocialOrgId:"@applySocialOrgId"}).save,
            "create":$resource("socialOrgs/").save,
            "update":$resource("socialOrgs/").put,
            "getSocialOrgName":$resource("socialOrgs/socialOrgName/:newworkerId",{newworkerId:'@newworkerId'}).get
        }

    }]).factory('orgApplayResource',['$resource',function($resource){

        return {
            "query":$resource('orgAppRecords/:socialOrgId',{socialOrgId:'@socialOrgId'}).get,
            "update":$resource('orgAppRecords/').put,
            "delete":$resource('orgAppRecords/delete').save,
            "create":$resource('orgAppRecords/').save
        }
    }]).factory('projectResource',['$resource',function($resource){
        return{
            "jionProjectForPerson":$resource('projects/joinToProjectOrg/:prjOrgId',{prjOrgId:'@prjOrgId'}).save,
            "jionProjectForOrg":$resource('projects/joinToProjectOrg/:socialOrgId/:prjOrgId/:pmId',{socialOrgId:'@socialOrgId',prjOrgId:'@prjOrgId',pmId:'@pmId'}).save,
            "jion":$resource('projects/:prjOrgId/join/',{prjOrgId:'@prjOrgId'}).save,
            "query":$resource('projectOrgs/:id',{id:"@id"}).get
        }
    }])