package com.mram.controller.core;

import com.mram.base.controller.GenericController;
import com.mram.dao.MainDao;
import com.mram.model.core.Privilege;
import com.mram.model.audit.DataSourceRequest;
import com.mram.model.audit.DataSourceResult;
import com.mram.repository.core.PrivilegeRepository;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/nms/privilege")
public class SysPrivilegeController  extends GenericController<Privilege> {
    public SysPrivilegeController(PrivilegeRepository repository) {
        super(repository);
    }

    @Autowired
    private MainDao dao;

    @Autowired
    private PrivilegeRepository repository;

    @GetMapping("/all")
    public List<Privilege> all() {
        return repository.findAll();
    }


    @PostMapping("/submit")
    public Privilege submit(@RequestBody Privilege item) {
        return repository.save(item);
    }


    // -------------------List by page -------------------------------------------
    @PostMapping("/list")
    public @ResponseBody
    DataSourceResult getList(@RequestBody DataSourceRequest request) throws JSONException, ClassNotFoundException {
        return dao.getList("core.Privilege",request);
    }
}
