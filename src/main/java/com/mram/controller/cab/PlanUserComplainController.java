package com.mram.controller.cab;

import com.mram.base.controller.GenericController;
import com.mram.dao.MainDao;
import com.mram.model.audit.DataSourceRequest;
import com.mram.model.audit.DataSourceResult;
import com.mram.model.cab.CabPlanUserComplain;
import com.mram.repository.cab.CabPlanUserComplainRepository;
import com.mram.service.core.Services;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/cab/plan/user/complain")
public class PlanUserComplainController extends GenericController<CabPlanUserComplain> {
    public PlanUserComplainController(CabPlanUserComplainRepository repository, MainDao dao, Services services) {
        super(repository);
        this.dao = dao;
        this.repository = repository;
        this.services = services;
    }

    private final MainDao dao;
    private final CabPlanUserComplainRepository repository;
    private final Services services;

    @PostMapping("/submit")
    public ResponseEntity<?> submit(@RequestBody String jsonStr) {
        JSONObject obj = new JSONObject(jsonStr);
        CabPlanUserComplain item = new CabPlanUserComplain();
        if (repository.findByPlanIdUserId(obj.getLong("userId"), obj.getLong("planId"), obj.getLong("criteriaId"))
                .isEmpty()) {
            item = new CabPlanUserComplain();
        } else {
            item = repository
                    .findByPlanIdUserId(obj.getLong("userId"), obj.getLong("planId"), obj.getLong("criteriaId")).get();
        }

        if (item != null) {
            item.setComplain(obj.getString("complain"));
            item.setAnswer(obj.isNull("answer") ? null : obj.getString("answer"));
            item.setDetId(obj.getLong("detId"));
            item.setCriteriaId(obj.getLong("criteriaId"));
            item.setPlanId(obj.getLong("planId"));
            item.setUserId(obj.getLong("userId"));
            item.setPlanYr(obj.getInt("planYr"));
            item.setStatus(obj.getString("status"));
            repository.save(item);
            if (item.getStatus().equalsIgnoreCase("draft")) {
                services.createActivityLog(new JSONObject()
                        .put("code", "score-complain")
                        .put("logId", item.getId())
                        .put("status", item.getStatus())
                        .put("name", "Үнэлгээ хийсэн"));
            } else {
                services.createActivityLog(new JSONObject()
                        .put("code", "score-complain")
                        .put("logId", item.getId())
                        .put("status", "sent")
                        .put("name", "Гомдол гаргасан"));
            }

        } else {
            item = new CabPlanUserComplain();
        }
        return ResponseEntity.ok().body(item);
    }

    @PostMapping("/change-status")
    public ResponseEntity<?> changePlanStatus(@RequestBody String jsonStr) {
        JSONObject obj = new JSONObject(jsonStr);
        CabPlanUserComplain item = repository.getReferenceById(obj.getLong("id"));
        services.createActivityLog(new JSONObject()
                .put("code", "score-complain")
                .put("logId", item.getId())
                .put("status", obj.getString("status"))
                .put("name", obj.isNull("name") ? " Гомдол гаргасан" : obj.getString("name")));
        return ResponseEntity.ok().body(item);
    }

    // -------------------List by page -------------------------------------------
    @PostMapping("/list")
    public @ResponseBody DataSourceResult getList(@RequestBody DataSourceRequest request)
            throws JSONException, ClassNotFoundException {
        return dao.getList("cab.CabPlanUserComplain", request);
    }

}
