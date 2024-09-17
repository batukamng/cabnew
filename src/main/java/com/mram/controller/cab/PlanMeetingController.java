package com.mram.controller.cab;

import com.mram.base.controller.GenericController;
import com.mram.dao.MainDao;
import com.mram.model.audit.DataSourceRequest;
import com.mram.model.audit.DataSourceResult;
import com.mram.model.cab.*;
import com.mram.repository.cab.*;
import com.mram.service.core.Services;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/cab/plan/meeting")
public class PlanMeetingController extends GenericController<CabPlanMeeting> {
    public PlanMeetingController(CabPlanMeetingRepository repository, MainDao dao, Services services, CabPlanMeetingRepository repository1) {
        super(repository);
        this.dao = dao;
        this.services = services;
        this.repository = repository1;
    }

    private final MainDao dao;
    private final Services services;
    private final CabPlanMeetingRepository repository;

    @PostMapping("/submit")
    public ResponseEntity<?> submit(@RequestBody CabPlanMeeting item) {
        repository.save(item);
        if(item.getStatus().equalsIgnoreCase("sent")){
            services.createActivityLog(new JSONObject()
                    .put("code", "meeting")
                    .put("logId", item.getId())
                    .put("status", item.getStatus())
                    .put("name", "Ярилцлага бүртгэж илгээсэн"));
        }
        else{
            services.createActivityLog(new JSONObject()
                    .put("code", "meeting")
                    .put("logId", item.getId())
                    .put("status", item.getStatus())
                    .put("name", "Ярилцлага баталсан"));
        }
        return ResponseEntity.ok().body(item);
    }


    @PostMapping("/change-status")
    public ResponseEntity<?> changeStatus(@RequestBody String jsonStr) {
        JSONObject obj = new JSONObject(jsonStr);
        CabPlanMeeting item=repository.getReferenceById(obj.getLong("id"));
        services.createActivityLog(new JSONObject()
                .put("code", "meeting")
                .put("logId", item.getId())
                .put("description", obj.has("description") ? obj.getString("description") : null)
                .put("status", obj.getString("status"))
                .put("name", obj.getString("name")));
        return ResponseEntity.ok().body(item);
    }

    // -------------------List by page -------------------------------------------
    @PostMapping("/list")
    public @ResponseBody
    DataSourceResult getList(@RequestBody DataSourceRequest request) throws JSONException, ClassNotFoundException {
        return dao.getList("view.cab.CabPlanMeetingView", request);
    }

}
