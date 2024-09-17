package com.mram.controller.cab;

import com.mram.base.controller.GenericController;
import com.mram.dao.MainDao;
import com.mram.model.audit.DataSourceRequest;
import com.mram.model.audit.DataSourceResult;
import com.mram.model.cab.CabPlan;
import com.mram.model.cab.CabPlanUser;
import com.mram.repository.cab.CabPlanRepository;
import com.mram.repository.cab.CabPlanUserRepository;
import com.mram.service.NotificationService;
import com.mram.service.core.Services;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/cab/plan")
public class PlanController extends GenericController<CabPlan> {
    public PlanController(CabPlanRepository repository, MainDao dao, CabPlanUserRepository planUserRepository, Services services, NotificationService notificationService) {
        super(repository);
        this.dao = dao;
        this.repository = repository;
        this.planUserRepository = planUserRepository;
        this.services = services;
        this.notificationService = notificationService;
    }

    private final MainDao dao;
    private final CabPlanRepository repository;
    private final CabPlanUserRepository planUserRepository;
    private final Services services;
    private final NotificationService notificationService;


    @PostMapping("/user/change-status")
    public ResponseEntity<?> changeStatus(@RequestBody String jsonStr) {
        JSONObject obj = new JSONObject(jsonStr);
        CabPlanUser item;
        if (planUserRepository.existsUserPlan(obj.getLong("userId"), obj.getLong("planId")).isPresent()) {
            item = planUserRepository.getByPlanUser(obj.getLong("userId"), obj.getLong("planId"));
        } else {
            item = new CabPlanUser();
        }
        item.setPlanId(obj.getLong("planId"));
        item.setUserId(obj.getLong("userId"));
        planUserRepository.save(item);
        services.createActivityLog(new JSONObject()
                .put("code", "plan_user")
                .put("logId", item.getId())
                .put("description", obj.has("description") ? obj.getString("description") : null)
                .put("status", obj.getString("status"))
                .put("name", obj.getString("name")));
        return ResponseEntity.ok().body(item);
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitPlan(@RequestBody CabPlan item) {
        if (repository.existsYear(item.getPlanYr(), item.getOrgId()).isEmpty()) {
            repository.save(item);
            services.createActivityLog(new JSONObject()
                    .put("code", "plan")
                    .put("logId", item.getId())
                    .put("status", item.getStatus())
                    .put("name", "Төлөвлөгөө үүсгэсэн"));
            Long channelId = notificationService.saveChannel("plan", "plan-" + item.getId());
           // notificationService.saveSubscription(channelId, item.getUserId());
            return ResponseEntity.ok().body(item);
        }
        return ResponseEntity.status(409).build();
    }

    @PostMapping("/change-status")
    public ResponseEntity<?> changePlanStatus(@RequestBody String jsonStr) {
        JSONObject obj = new JSONObject(jsonStr);
        CabPlan item = repository.getReferenceById(obj.getLong("planId"));
        services.createActivityLog(new JSONObject()
                .put("code", "plan")
                .put("logId", item.getId())
                .put("status", obj.getString("status"))
                .put("name", obj.getString("name")));

        JSONObject webData = new JSONObject();
        webData.put("topic", "plan-" + item.getId());
        webData.put("title", obj.getString("name"));
        webData.put("body", item.getFullDesc());
        webData.put("url", "https://cabinet.e-nation.mn");
        notificationService.postToTopicJson(webData);

        return ResponseEntity.ok().body(item);
    }


    // -------------------List by page -------------------------------------------
    @PostMapping("/list")
    public @ResponseBody
    DataSourceResult getList(@RequestBody DataSourceRequest request) throws JSONException, ClassNotFoundException {
        return dao.getList("view.cab.CabPlanView", request);
    }

}
