package com.mram.controller.cab;

import com.mram.base.controller.GenericController;
import com.mram.dao.MainDao;
import com.mram.model.audit.DataSourceRequest;
import com.mram.model.audit.DataSourceResult;
import com.mram.model.cab.CabPlanObjective;
import com.mram.repository.cab.CabPlanObjectiveRepository;
import com.mram.repository.core.UserRepository;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/cab/plan/objective")
public class PlanObjectiveController extends GenericController<CabPlanObjective> {
    public PlanObjectiveController(CabPlanObjectiveRepository repository, MainDao dao, UserRepository userRepository) {
        super(repository);
        this.dao = dao;
        this.repository = repository;
    }

    private final MainDao dao;
    private final CabPlanObjectiveRepository repository;


    @PostMapping("/submit")
    public ResponseEntity<?> submit(@RequestBody String jsonStr) {
        JSONObject obj=new JSONObject(jsonStr);
        CabPlanObjective item;
        if(obj.has("id") && !obj.isNull("id")){
            item=repository.getReferenceById(obj.getLong("id"));
        }
        else{
            item=new CabPlanObjective();
        }
        item.setTitle(obj.getString("title"));
        item.setObjType(obj.getString("objType"));
        item.setPlanId(obj.getLong("planId"));
        item.setUserId(obj.has("userId")?obj.getLong("userId"):null);
      /*  List<LutUser> users=new ArrayList<>();
        for(int i=0;i<obj.getJSONArray("userArr").length();i++){
            System.out.println("ss"+obj.getJSONArray("userArr").getString(i));
            users.add(userRepository.getReferenceById(Long.parseLong(obj.getJSONArray("userArr").getString(i))));
        }
        item.setUsers(users);*/
        repository.save(item);
        return ResponseEntity.ok().body(item);
    }

    // -------------------List by page -------------------------------------------
    @PostMapping("/list")
    public @ResponseBody
    DataSourceResult getList(@RequestBody DataSourceRequest request) throws JSONException, ClassNotFoundException {
        return dao.getList("view.cab.CabPlanObjectiveView", request);
    }

}
