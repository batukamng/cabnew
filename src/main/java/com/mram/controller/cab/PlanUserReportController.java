package com.mram.controller.cab;

import com.mram.base.controller.GenericController;
import com.mram.dao.MainDao;
import com.mram.model.audit.DataSourceRequest;
import com.mram.model.audit.DataSourceResult;
import com.mram.model.cab.CabPlanUserReport;
import com.mram.repository.cab.CabPlanUserReportRepository;
import com.mram.service.core.Services;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/cab/plan/user/report")
public class PlanUserReportController extends GenericController<CabPlanUserReport> {
    public PlanUserReportController(CabPlanUserReportRepository repository, MainDao dao, Services services) {
        super(repository);
        this.dao = dao;
        this.repository = repository;
        this.services = services;
    }

    private final MainDao dao;
    private final CabPlanUserReportRepository repository;
    private final Services services;


    @PostMapping("/submit")
    public ResponseEntity<?> submit(@RequestBody CabPlanUserReport item) {
        repository.save(item);
        if(item.getStatus().equalsIgnoreCase("draft")){
            services.createActivityLog(new JSONObject()
                    .put("code", "report")
                    .put("logId", item.getId())
                    .put("status", item.getStatus())
                    .put("name", "Тайлан үүсгэсэн"));
        }
        else{
            services.createActivityLog(new JSONObject()
                    .put("code", "report")
                    .put("logId", item.getId())
                    .put("status", "draft")
                    .put("name", "Тайлан үүсгэсэн"));

            services.createActivityLog(new JSONObject()
                    .put("code", "report")
                    .put("logId", item.getId())
                    .put("status", "sent")
                    .put("name", "Тайлан илгээсэн"));
        }

        return ResponseEntity.ok().body(item);
    }

    @PostMapping("/change-status")
    public ResponseEntity<?> changePlanStatus(@RequestBody String jsonStr) {
        JSONObject obj=new JSONObject(jsonStr);
        CabPlanUserReport item=repository.getReferenceById(obj.getLong("id"));
        services.createActivityLog(new JSONObject()
                .put("code", "report")
                .put("logId", item.getId())
                .put("status", obj.getString("status"))
                .put("name", obj.isNull("name")?"Тайлан хувиарласан":obj.getString("name")));
        return ResponseEntity.ok().body(item);
    }


    // -------------------List by page -------------------------------------------
    @PostMapping("/list")
    public @ResponseBody
    DataSourceResult getList(@RequestBody DataSourceRequest request) throws JSONException, ClassNotFoundException {
        return dao.getList("view.cab.CabPlanReportView", request);
    }

}
