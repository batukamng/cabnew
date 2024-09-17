package com.mram.controller.cab;

import com.mram.base.controller.GenericController;
import com.mram.dao.MainDao;
import com.mram.model.audit.DataSourceRequest;
import com.mram.model.audit.DataSourceResult;
import com.mram.model.cab.CabPlanUserScore;
import com.mram.repository.cab.CabPlanUserScoreRepository;
import com.mram.service.core.Services;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/cab/plan/user/score")
public class PlanUserScoreController extends GenericController<CabPlanUserScore> {
    public PlanUserScoreController(CabPlanUserScoreRepository repository, MainDao dao, Services services) {
        super(repository);
        this.dao = dao;
        this.repository = repository;
        this.services = services;
    }

    private final MainDao dao;
    private final CabPlanUserScoreRepository repository;
    private final Services services;


    @PostMapping("/submit")
    public ResponseEntity<?> submit(@RequestBody String jsonStr) {
        JSONObject obj=new JSONObject(jsonStr);
        CabPlanUserScore item;
        if(repository.findByPlanIdUserId(obj.getLong("userId"),obj.getLong("planId"),obj.getLong("criteriaId")).isEmpty()){
            item = new CabPlanUserScore();
        }
        else{
            item=repository.findByPlanIdUserId(obj.getLong("userId"),obj.getLong("planId"),obj.getLong("criteriaId")).get();
        }
        item.setApr(obj.getDouble("apr"));
        item.setEval(obj.getDouble("eval"));
        item.setDetId(obj.getLong("detId"));
        item.setCriteriaId(obj.getLong("criteriaId"));
        item.setPlanId(obj.getLong("planId"));
        item.setUserId(obj.getLong("userId"));
        item.setPlanYr(obj.getInt("planYr"));
        repository.save(item);
        /*if(item.getStatus().equalsIgnoreCase("draft")){
            services.createActivityLog(new JSONObject()
                    .put("code", "score")
                    .put("logId", item.getId())
                    .put("status", item.getStatus())
                    .put("name", "Үнэлгээ хийсэн"));
        }
        else{
            services.createActivityLog(new JSONObject()
                    .put("code", "score")
                    .put("logId", item.getId())
                    .put("status", "sent")
                    .put("name", "Үнэлгээ хийж илгээсэн"));
        }*/

        return ResponseEntity.ok().body(item);
    }

    @PostMapping("/change-status")
    public ResponseEntity<?> changePlanStatus(@RequestBody String jsonStr) {
        JSONObject obj=new JSONObject(jsonStr);
        CabPlanUserScore item=repository.getReferenceById(obj.getLong("id"));
        services.createActivityLog(new JSONObject()
                .put("code", "score")
                .put("logId", item.getId())
                .put("status", obj.getString("status"))
                .put("name", obj.isNull("name")?" Үнэлгээ хийсэн":obj.getString("name")));
        return ResponseEntity.ok().body(item);
    }


    // -------------------List by page -------------------------------------------
    @PostMapping("/list")
    public @ResponseBody
    DataSourceResult getList(@RequestBody DataSourceRequest request) throws JSONException, ClassNotFoundException {
        return dao.getList("cab.CabPlanUserScore", request);
    }

}
