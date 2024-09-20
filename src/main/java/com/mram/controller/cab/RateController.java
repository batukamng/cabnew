package com.mram.controller.cab;

import com.mram.base.controller.GenericController;
import com.mram.dao.MainDao;
import com.mram.model.audit.DataSourceRequest;
import com.mram.model.audit.DataSourceResult;
import com.mram.model.cab.CabRate;
import com.mram.model.view.cab.CabPlanUserView;
import com.mram.repository.cab.CabRateRepository;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/cab/rate")
public class RateController extends GenericController<CabRate> {
    public RateController(CabRateRepository repository, MainDao dao, Services services) {
        super(repository);
        this.dao = dao;
        this.repository = repository;
        this.services = services;
    }

    private final MainDao dao;
    private final CabRateRepository repository;
    private final Services services;


    @PostMapping("/submit")
    public ResponseEntity<?> submit(@RequestBody String jsonStr) {
        JSONObject obj = new JSONObject(jsonStr);
        List<Long> userIds = new ArrayList<>();
        List<CabPlanUserView> users= (List<CabPlanUserView>) dao.getHQLResult("from CabPlanUserView t where t.id="+obj.getLong("planId"),"list");
        if (users!=null && users.size()>0) {
            if(!users.isEmpty()){
                for(CabPlanUserView user:users){
                    if(repository.existsItem(obj.getLong("planId"),user.getUserId(),obj.getString("typeStr")).isEmpty()){
                        CabRate rate=new CabRate();
                        rate.setPlanId(obj.getLong("planId"));
                        rate.setUserId(user.getUserId());
                        rate.setTypeStr(obj.getString("typeStr"));
                        repository.save(rate);
                        userIds.add(user.getUserId());
                        services.createActivityLog(new JSONObject()
                                .put("code", "rate")
                                .put("logId", rate.getId())
                                .put("status", obj.getString("status"))
                                .put("name", "Тайлан үүсгэсэн"));
                    }
                }
            }
        }
        if(!userIds.isEmpty()){
            return ResponseEntity.status(200).build();
        }
        return ResponseEntity.status(409).build();
    }

    @PostMapping("/change-status")
    public ResponseEntity<?> changePlanStatus(@RequestBody String jsonStr) {
        JSONObject obj=new JSONObject(jsonStr);
        CabRate item=repository.getReferenceById(obj.getLong("id"));
        services.createActivityLog(new JSONObject()
                .put("code", "rate")
                .put("logId", item.getId())
                .put("status", obj.getString("status"))
                .put("name", "Үнэлгээ хувиарласан"));
        return ResponseEntity.ok().body(item);
    }


    // -------------------List by page -------------------------------------------
    @PostMapping("/list")
    public @ResponseBody
    DataSourceResult getList(@RequestBody DataSourceRequest request) throws JSONException, ClassNotFoundException {
        return dao.getList("view.cab.CabRateView", request);
    }

}
