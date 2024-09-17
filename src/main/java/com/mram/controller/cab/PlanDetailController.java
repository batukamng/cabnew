package com.mram.controller.cab;

import com.mram.base.controller.GenericController;
import com.mram.dao.MainDao;
import com.mram.model.audit.DataSourceRequest;
import com.mram.model.audit.DataSourceResult;
import com.mram.model.cab.*;
import com.mram.model.core.LutUser;
import com.mram.repository.cab.*;
import com.mram.repository.core.UserRepository;
import com.mram.repository.notif.ChannelRepository;
import com.mram.service.NotificationService;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/cab/plan/detail")
public class PlanDetailController extends GenericController<CabPlanDetail> {
    public PlanDetailController(CabPlanDetailRepository repository, MainDao dao, CabPlanCriteriaRepository criteriaRepository, CabPlanObjectiveRepository objectiveRepository, UserRepository userRepository, CabCriteriaRepository cabCriteriaRepository, CabPlanRequestRepository requestRepository, NotificationService notificationService, ChannelRepository channelRepository) {
        super(repository);
        this.dao = dao;
        this.repository = repository;
        this.criteriaRepository = criteriaRepository;
        this.objectiveRepository = objectiveRepository;
        this.userRepository = userRepository;
        this.cabCriteriaRepository = cabCriteriaRepository;
        this.requestRepository = requestRepository;
    }

    private final MainDao dao;
    private final CabPlanDetailRepository repository;
    private final CabPlanCriteriaRepository criteriaRepository;
    private final CabPlanObjectiveRepository objectiveRepository;
    private final UserRepository userRepository;
    private final CabCriteriaRepository cabCriteriaRepository;
    private final CabPlanRequestRepository requestRepository;

    @PostMapping("/submit")
    public ResponseEntity<?> submit(@RequestBody String jsonStr) {
        JSONObject obj=new JSONObject(jsonStr);
        CabPlanDetail item;
        if(obj.has("id")){
            item=repository.getReferenceById(obj.getLong("id"));
        }
        else{
            item=new CabPlanDetail();
        }
        item.setTitle(obj.getString("title"));
        if(obj.has("parentId") && !obj.isNull("parentId")){
            item.setParentId(obj.getLong("parentId"));
        }
        else{
            item.setParentId(null);
        }
        item.setObjId(obj.getLong("objId"));
        item.setObjType(obj.getString("objType"));
        item.setEventType(obj.getString("eventType"));
        item.setSrtDt(obj.getString("srtDt"));
        item.setEndDt(obj.getString("endDt"));
        if(obj.has("baseStr") && !obj.isNull("baseStr")) {
            item.setBaseStr(obj.getString("baseStr"));
        }
        if(obj.has("targetStr") && !obj.isNull("targetStr")) {
            item.setTargetStr(obj.getString("targetStr"));
        }
        if(obj.has("criteria") && !obj.isNull("criteria")) {
            item.setCriteria(obj.getString("criteria"));
        }

        if(obj.has("userType") && !obj.isNull("userType")) {
            item.setUserType(obj.getString("userType"));
        }
        else{
            item.setUserType("01");
        }

        List<LutUser> users=new ArrayList<>();
        if(obj.has("userType") && !obj.isNull("userType") && obj.getString("userType").equals("02")){
            users.add(userRepository.getReferenceById(obj.getLong("userId")));
        }
        else{
            for(int i=0;i<obj.getJSONArray("userArr").length();i++){
                users.add(userRepository.getReferenceById(Long.parseLong(obj.getJSONArray("userArr").getString(i))));
            }
        }

        item.setUsers(users);
      /*  if(!users.isEmpty()){
            CabPlanObjective objective=objectiveRepository.getReferenceById(obj.getLong("objId"));
            Optional<NotificationChannel> channel= channelRepository.getByCodeTopic("plan","plan-"+objective.getPlanId());
            if(channel.isPresent()){
                for(LutUser user:users){
                    notificationService.saveSubscription(channel.get().getId(), user.getId());
                }
            }
        }*/

        if(Objects.equals(item.getId(), item.getParentId())){
            item.setParentId(null);
        }


        if(obj.has("criteria") && !obj.isNull("criteria")) {
            item.setCriteria(obj.getString("criteria"));
            if(cabCriteriaRepository.existsItem(obj.getLong("orgId"),obj.getString("criteria")).isEmpty()){
                CabCriteria unitCriteria=new CabCriteria();
                unitCriteria.setOrgId(obj.getLong("orgId"));
                unitCriteria.setTitle(obj.getString("criteria"));
                cabCriteriaRepository.save(unitCriteria);
            }
        }

        repository.save(item);

      //  CabPlanObjective objective=objectiveRepository.getReferenceById(item.getObjId());

       /* JSONArray arr=obj.getJSONArray("criterias");
        for(int i=0;i< arr.length();i++){
            JSONObject criteria=arr.getJSONObject(i);
            CabPlanCriteria planCriteria=new CabPlanCriteria();
            planCriteria.setDetId(item.getId());
            if(obj.has("userId") && !obj.isNull("userId")){
                planCriteria.setUserId(obj.getLong("userId"));
            }
            planCriteria.setCriteria(criteria.getString("criteria"));
            planCriteria.setBaseline(criteria.getDouble("baseline"));
            planCriteria.setEndDt(criteria.getString("endDt"));
            planCriteria.setSrtDt(criteria.getString("srtDt"));
            planCriteria.setFirstHalf(criteria.getDouble("firstHalf"));
            planCriteria.setSecondHalf(criteria.getDouble("secondHalf"));
            criteriaRepository.save(planCriteria);
        }*/

        return ResponseEntity.ok().body(item);
    }

    @PostMapping("/user/submit")
    public ResponseEntity<?> userSubmit(@RequestBody String jsonStr) {
        JSONObject obj=new JSONObject(jsonStr);
        CabPlanDetail item;
        if(obj.has("id")){
            item=repository.getReferenceById(obj.getLong("id"));
        }
        else{
            item=new CabPlanDetail();
        }
        item.setTitle(obj.getString("title"));
        if(obj.has("parentId") && !obj.isNull("parentId")) {
            item.setParentId(obj.getLong("parentId"));
        }
   /*     if(obj.has("parentId") && !obj.isNull("parentId")){
            CabPlanDetail parent=repository.getReferenceById(obj.getLong("parentId"));
            item.setObjId(parent.getObjId());
        }
        else if(obj.has("objId") && !obj.isNull("objId")){
            item.setObjId(obj.getLong("objId"));
        }
        else{
            CabPlanObjective objective=new CabPlanObjective();
            objective.setObjType(obj.getString("objType"));
            objective.setTitle(obj.getString("purpose"));
            objective.setPlanId(obj.getLong("planId"));
            objectiveRepository.save(objective);
            item.setObjId(objective.getId());
        }*/

        item.setObjType(obj.getString("objType"));
        item.setCriteria(obj.has("criteria")?obj.getString("criteria"):"");
        item.setEventType(obj.has("eventType")?obj.getString("eventType"):"0");
        item.setUserType(obj.getString("userType"));
        item.setSrtDt(obj.has("criteria")?obj.getString("srtDt"):"");
        item.setEndDt(obj.has("criteria")?obj.getString("endDt"):"");
        item.setObjId(obj.getLong("objId"));
        item.setPlanId(obj.getLong("planId"));

        item.setBaseline(obj.has("baseline")?obj.getDouble("baseline"):0d);
        item.setFirstHalf(obj.has("firstHalf")?obj.getDouble("firstHalf"):0d);
        item.setSecondHalf(obj.has("secondHalf")?obj.getDouble("secondHalf"):0d);
        item.setFulfillment(obj.has("fulfillment")?obj.getDouble("fulfillment"):0d);
        item.setRate(obj.has("rate")?obj.getDouble("rate"):0d);

        List<LutUser> users=new ArrayList<>();
        if(obj.has("userType") && !obj.isNull("userType") && obj.getString("userType").equalsIgnoreCase("02")){
            users.add(userRepository.getReferenceById(obj.getLong("userId")));
        }
        item.setUsers(users);
        if(Objects.equals(item.getId(), item.getParentId())){
            item.setParentId(null);
        }
        repository.save(item);

        CabPlanObjective objective=objectiveRepository.getReferenceById(obj.getLong("objId"));


        JSONArray arr=obj.getJSONArray("criterias");
        for(int i=0;i< arr.length();i++){
            JSONObject criteria=arr.getJSONObject(i);
            CabPlanCriteria planCriteria;
            if(criteria.has("id")){
                planCriteria=criteriaRepository.getReferenceById(criteria.getLong("id"));
            }
            else{
                planCriteria=new CabPlanCriteria();
            }
            planCriteria.setDetId(item.getId());
            planCriteria.setUserId(obj.getLong("userId"));
            planCriteria.setCriteria(criteria.has("title")?criteria.getString("title"):"test");
            planCriteria.setEndDt(criteria.getString("endDt"));
            planCriteria.setSrtDt(criteria.getString("srtDt"));
            planCriteria.setBaseline(criteria.getDouble("baseline")>100?100:criteria.getDouble("baseline"));
            planCriteria.setFirstHalf(criteria.getDouble("firstHalf")>100?100:criteria.getDouble("firstHalf"));
            planCriteria.setSecondHalf(criteria.getDouble("secondHalf")>100?100:criteria.getDouble("secondHalf"));
            criteriaRepository.save(planCriteria);

            if(criteria.has("title") && !criteria.isNull("title")) {
                if(cabCriteriaRepository.existsItem(objective.getCabPlan().getOrgId(),criteria.getString("title")).isEmpty()){
                    CabCriteria unitCriteria=new CabCriteria();
                    unitCriteria.setOrgId(objective.getCabPlan().getOrgId());
                    unitCriteria.setTitle(criteria.getString("title"));
                    cabCriteriaRepository.save(unitCriteria);
                }
            }
        }

        return ResponseEntity.ok().body(item);
    }

    @PostMapping("/request/submit")
    public ResponseEntity<?> requestSubmit(@RequestBody String jsonStr) {
        JSONObject obj=new JSONObject(jsonStr);
        CabPlanRequest item;
        if(obj.has("id")){
            item=requestRepository.getReferenceById(obj.getLong("id"));
        }
        else{
            item=new CabPlanRequest();
        }
        item.setUserId(obj.getLong("userId"));
        item.setDetId(obj.getLong("detId"));
        item.setPlanId(obj.getLong("planId"));
        item.setTitle(obj.getString("title"));
        item.setAnswer(obj.isNull("answer")?null:obj.getString("answer"));
        item.setUseYn(obj.getInt("useYn"));
        item.setResponseType(obj.isNull("responseType")?null:obj.getString("responseType"));
        requestRepository.save(item);
        //&& !obj.getString("userType").equalsIgnoreCase("Мэргэжилтэн")
        if(obj.has("responseType") && obj.getString("responseType").equalsIgnoreCase("0")){
            CabPlanDetail detail=repository.getReferenceById(item.getDetId());
            List<LutUser> users=new ArrayList<>();
            for(LutUser user:detail.getUsers()){
                if(!user.getId().equals(item.getUserId())){
                    users.add(user);
                }
            }
            detail.setUsers(users);
            repository.save(detail);
        }

        return ResponseEntity.ok().body(item);
    }

    // -------------------List by page -------------------------------------------
    @PostMapping("/list")
    public @ResponseBody
    DataSourceResult getList(@RequestBody DataSourceRequest request) throws JSONException, ClassNotFoundException {
        return dao.getList("view.cab.CabPlanObjDetailView", request);
    }

}
