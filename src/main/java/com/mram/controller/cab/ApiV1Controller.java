package com.mram.controller.cab;

import com.mram.dao.MainDao;
import com.mram.model.audit.DataSourceRequest;
import com.mram.model.audit.DataSourceResult;
import org.apache.commons.lang3.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin/v1")
public class ApiV1Controller {

    private final MainDao dao;

    public ApiV1Controller(MainDao dao) {
        this.dao = dao;
    }

    @PostMapping("/item/{type}")
    public ResponseEntity<?> getItemByPlanYrId(@PathVariable String type,@RequestBody String jsonStr) {

        JSONObject jsonObj=new JSONObject(jsonStr);
        String planYr=jsonObj.get("planYr").toString();
        int id=jsonObj.getInt("orgId");

        String className= StringUtils.substringAfterLast(defineClass(type), ".");


        if(type.equalsIgnoreCase("mof-pivot")){
            return ResponseEntity.ok().body(dao.getHQLResult("from "+className+" t where t.logYear='"+planYr+"'","list"));
        }

        if(type.equalsIgnoreCase("org-dashboard")){
            JSONObject obj=new JSONObject();
            obj.put("mainData",dao.getHQLResult("from DashboardView t where t.orgId="+id,"list"));

            return ResponseEntity.ok().body(obj.toString());
        }
        if(type.equalsIgnoreCase("admin-pivot")){
            JSONObject obj=new JSONObject();
            obj.put("mainData",dao.getHQLResult("from DashboardView t","list"));

            return ResponseEntity.ok().body(obj.toString());
        }
        if(type.equalsIgnoreCase("darga-dashboard")){
            JSONObject obj=new JSONObject();
            obj.put("mainData",dao.getHQLResult("from DashboardCabPlanReportView t","list"));

            return ResponseEntity.ok().body(obj.toString());
        }
        return ResponseEntity.ok().body(dao.getHQLResult("from "+className+" t where t.id="+id,"current"));
    }


    // -------------------List by page -------------------------------------------
    @PostMapping("/{type}/list")
    public @ResponseBody DataSourceResult getList(@PathVariable String type, @RequestBody DataSourceRequest request)
            throws JSONException, ClassNotFoundException {
        String className = defineClass(type);
        return dao.getList(className, request);
    }

    @GetMapping("/list/{type}/{id}")
    public ResponseEntity<?> getListById(@PathVariable String type, @PathVariable Long id) {
        String className = StringUtils.substringAfterLast(defineClass(type), ".");
        if (type.equalsIgnoreCase("top-section") || type.equalsIgnoreCase("data-items")) {
            return ResponseEntity.ok().body(dao.getHQLResult("from " + className + " t where t.orgId=" + id, "list"));
        }
        if (type.equalsIgnoreCase("cab-plan-user-drop")) {
            List<Integer> planList= (List<Integer>) dao.getHQLResult("select t.planYr from CabPlanUserView t where t.useYn=1 and t.orgId="+id+" group by t.planYr order by t.planYr", "list");
            JSONArray array = new JSONArray();
            for(Integer val:planList){
                JSONObject obj = new JSONObject();
                obj.put("text", val.toString());
                obj.put("value", val.toString());
                array.put(obj);
            }
            return ResponseEntity.ok().body(array.toString());
        }
        if (type.equalsIgnoreCase("cab-plan-year")) {
            List<Integer> planList= (List<Integer>) dao.getHQLResult("select t.planYr from CabPlanUserView t where t.userStatusNm='Баталсан' and t.useYn=1 and t.orgId="+id+" group by t.planYr order by t.planYr", "list");
            JSONArray array = new JSONArray();
            for(Integer val:planList){
                JSONObject obj = new JSONObject();
                obj.put("text", val.toString());
                obj.put("value", val.toString());
                array.put(obj);
            }
            return ResponseEntity.ok().body(array.toString());
        }
        if (type.equalsIgnoreCase("cab-plan-year-user")) {
            List<Integer> planList= (List<Integer>) dao.getHQLResult("select t.planYr from CabPlanUserView t where t.userStatusNm='Баталсан' and t.useYn=1 and t.userId="+id+" group by t.planYr order by t.planYr", "list");
            JSONArray array = new JSONArray();
            for(Integer val:planList){
                JSONObject obj = new JSONObject();
                obj.put("text", val.toString());
                obj.put("value", val.toString());
                array.put(obj);
            }
            return ResponseEntity.ok().body(array.toString());
        }
        if (type.equalsIgnoreCase("cab-plan-obj")) {
            return ResponseEntity.ok().body(dao.getHQLResult("from " + className + " t where t.planId=" + id, "list"));
        }
        if (type.equalsIgnoreCase("cab-plan-request")) {
            return ResponseEntity.ok().body(dao.getHQLResult("from " + className + " t where t.detId=" + id, "list"));
        }
        if (type.equalsIgnoreCase("cab-plan-request-app")) {
            return ResponseEntity.ok().body(dao.getHQLResult("from " + className + " t where t.planId=" + id, "list"));
        }
        if (type.equalsIgnoreCase("cab-report-user-criteria")) {
            return ResponseEntity.ok().body(dao.getHQLResult("from " + className + " t where t.reportId=" + id, "list"));
        }

        if (type.equalsIgnoreCase("cab-plan-detail-obj")) {
            return ResponseEntity.ok().body(dao.getHQLResult("from " + className + " t where t.planId=" + id+" order by t.id", "list"));
        }
        return ResponseEntity.ok().body(dao.getHQLResult("from " + className + " t where t.id=" + id, "current"));
    }

    @GetMapping("/multiple/{type}/{planId}/{userId}")
    public ResponseEntity<?> getMultipleById(@PathVariable String type, @PathVariable Long planId, @PathVariable Long userId) {
        String className = StringUtils.substringAfterLast(defineClass(type), ".");
        if (type.equalsIgnoreCase("cab-plan-user-detail") || type.equalsIgnoreCase("cab-eval-user-detail")) {
            return ResponseEntity.ok().body(dao.getHQLResult("from " + className + " t where t.planId=" + planId + " and t.userId="+userId, "list"));
        }
        if (type.equalsIgnoreCase("oda-unit-plan-expense")) {
            return ResponseEntity.ok().body(dao.getHQLResult("from " + className + " t where (t.planId=" + planId +" or t.planId is null) and (t.period=" + userId +" or t.period=5)", "list"));
        }
        if (type.equalsIgnoreCase("user-plan")) {
            //t.statusNm='Баталсан' and
            return ResponseEntity.ok().body(dao.getHQLResult("from CabPlanUserView t where t.planYr=" + planId + " and t.userId="+userId, "list"));
        }
        if (type.equalsIgnoreCase("cab-stat-report")) {
            //t.statusNm='Баталсан' and
            return ResponseEntity.ok().body(dao.getHQLResult("from CabStatReportView t where t.planYr=" + planId + " and t.orgId="+userId, "list"));
        }
        if (type.equalsIgnoreCase("cab-plan-meeting") || type.equalsIgnoreCase("cab-plan-report") || type.equalsIgnoreCase("cab-plan-score") || type.equalsIgnoreCase("cab-plan-complain")) {
            return ResponseEntity.ok().body(dao.getHQLResult("from " + className + " t where t.planId=" + planId + " and t.userId="+userId, "list"));
        }
        if (type.equalsIgnoreCase("cab-plan-user-objective")) {
            return ResponseEntity.ok().body(dao.getHQLResult("from " + className + " t where t.planId=" + planId + " and (t.userId is null or t.userId="+userId+")", "list"));
        }
        return ResponseEntity.ok().body(dao.getHQLResult("from " + className + " t where t.id=" + planId, "current"));
    }

    @GetMapping("/item/{type}/{id}")
    public ResponseEntity<?> getItemById(@PathVariable String type, @PathVariable Long id) {
        String className = StringUtils.substringAfterLast(defineClass(type), ".");
        if (type.equalsIgnoreCase("cab-plan-user")) {
            return ResponseEntity.ok().body(dao.getHQLResult("from " + className + " t where t.tezId=" + id, "list"));
        }
        return ResponseEntity.ok().body(dao.getHQLResult("from " + className + " t where t.id=" + id, "current"));
    }

    @GetMapping("/item/{type}/{id}/{userId}")
    public ResponseEntity<?> getItemByIdUserId(@PathVariable String type, @PathVariable Long id,
            @PathVariable Long userId) {
        String className = StringUtils.substringAfterLast(defineClass(type), ".");
        if (type.equalsIgnoreCase("cab-plan-user")) {
            return ResponseEntity.ok().body(dao
                    .getHQLResult("from " + className + " t where t.id=" + id + " and t.userId=" + userId, "current"));
        }
        if (type.equalsIgnoreCase("cab-plan-user-obj")) {
            return ResponseEntity.ok().body(dao
                    .getHQLResult("from " + className + " t where t.planId=" + id + " and t.userId=" + userId, "list"));
        }
        if (type.equalsIgnoreCase("cab-plan-user-criteria")) {
            return ResponseEntity.ok().body(dao
                    .getHQLResult("from " + className + " t where t.planId=" + id + " and t.userId=" + userId, "list"));
        }
        return ResponseEntity.ok().body(dao.getHQLResult("from " + className + " t where t.id=" + id, "current"));
    }

    private String defineClass(@PathVariable String type) {
        return switch (type) {
            case "cab-company" -> "view.CabCompany";
            case "cab-department" -> "view.CabDepartment";
            case "cab-employee" -> "view.CabEmployee";
            case "cab-position" -> "view.CabPosition";
            case "cab-si-country" -> "view.CabSiCountry";
            case "cab-si-division" -> "view.CabSiDivision";
            case "cab-si-section" -> "view.CabSiSection";
            case "cab-sm-company" -> "view.CabSmCompanyGov";
            case "cab-sm-gov-rel-council" -> "view.CabSmGovRelCouncil";
            case "cab-user" -> "view.CabUser";
            case "cab-plan" -> "view.cab.CabPlanView";
            case "cab-criteria" -> "cab.CabCriteria";
            case "cab-plan-obj" -> "view.cab.CabPlanObjView";
            case "cab-plan-criteria" -> "view.cab.CabPlanCriteriaView";
            case "cab-plan-user" -> "view.cab.CabPlanUserView";
            case "cab-report-user" -> "view.cab.CabReportView";
            case "cab-report-user-criteria" -> "cab.CabReportDetail";
            case "cab-plan-user-obj" -> "view.cab.CabPlanObjUserView";

            case "cab-plan-user-criteria" -> "view.cab.CabPlanObjUserCriteriaView";
            case "cab-plan-user-rate" -> "view.cab.CabPlanRateView";
            case "cab-plan-detail-obj" -> "view.cab.CabPlanObjDetailView";
            case "cab-plan-request" -> "view.cab.CabPlanRequestView";
            case "cab-plan-request-app" -> "view.cab.CabPlanRequestView";
            case "cab-plan-meeting" -> "view.cab.CabPlanMeetingView";
            case "cab-plan-boss-meeting" -> "view.cab.CabPlanMeetingBossView";
            case "cab-plan-boss-report" -> "view.cab.CabPlanReportBossView";
            case "cab-plan-report" -> "view.cab.CabPlanReportView";
            case "cab-plan-attitude" -> "view.cab.CabPlanAttitudeView";
            case "cab-attitude" -> "view.cab.CabAttitudeView";
            case "cab-plan-user-objective" -> "view.cab.CabPlanObjectiveUserView";
            case "cab-rate-user" -> "view.cab.CabRateView";
            case "cab-team" -> "view.cab.CabTeamView";
            case "cab-plan-score" -> "cab.CabPlanUserScore";
            case "cab-plan-complain" -> "view.cab.CabPlanComplainView";
            case "cab-stat-report" -> "view.cab.CabStatReportView";
            default -> "";
        };
    }
}
