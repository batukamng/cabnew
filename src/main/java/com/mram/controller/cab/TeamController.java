package com.mram.controller.cab;

import com.mram.base.controller.GenericController;
import com.mram.dao.MainDao;
import com.mram.model.audit.DataSourceRequest;
import com.mram.model.audit.DataSourceResult;
import com.mram.model.cab.CabTeam;
import com.mram.model.core.LutUser;
import com.mram.repository.cab.CabTeamRepository;
import com.mram.repository.core.UserRepository;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/cab/team")
public class TeamController extends GenericController<CabTeam> {
    public TeamController(CabTeamRepository repository, MainDao dao, UserRepository userRepository) {
        super(repository);
        this.dao = dao;
        this.repository = repository;
        this.userRepository = userRepository;
    }

    private final MainDao dao;
    private final CabTeamRepository repository;
    private final UserRepository userRepository;

    @PostMapping("/submit")
    public ResponseEntity<?> submit(@RequestBody String jsonStr) {
        JSONObject obj=new JSONObject(jsonStr);
        CabTeam item;
        if(obj.has("id") && !obj.isNull("id")){
            item=repository.getReferenceById(obj.getLong("id"));
        }
        else{
            item=new CabTeam();
        }
        item.setTitle(obj.getString("title"));
        item.setOrgId(obj.getLong("orgId"));
        List<LutUser> users=new ArrayList<>();
        for(int i=0;i<obj.getJSONArray("userArr").length();i++){
            users.add(userRepository.getReferenceById(Long.parseLong(obj.getJSONArray("userArr").getString(i))));
        }
        item.setUsers(users);
        repository.save(item);
        return ResponseEntity.ok().body(item);
    }

    // -------------------List by page -------------------------------------------
    @PostMapping("/list")
    public @ResponseBody
    DataSourceResult getList(@RequestBody DataSourceRequest request) throws JSONException, ClassNotFoundException {
        return dao.getList("view.cab.CabTeamView", request);
    }

}
