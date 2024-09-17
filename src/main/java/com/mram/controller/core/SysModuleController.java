package com.mram.controller.core;

import com.mram.base.controller.GenericController;
import com.mram.dao.MainDao;
import com.mram.model.audit.DataSourceRequest;
import com.mram.model.audit.DataSourceResult;
import com.mram.model.core.Module;
import com.mram.repository.core.ModuleRepository;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/nms/module")
public class SysModuleController extends GenericController<Module> {
    public SysModuleController(ModuleRepository repository) {
        super(repository);
    }

    @Autowired
    private MainDao dao;

    @Autowired
    private ModuleRepository repository;

    @PostMapping("/submit")
    public Module submit(@RequestBody Module item) {
        return repository.save(item);
    }


    // -------------------List by page -------------------------------------------
    @PostMapping("/list")
    public @ResponseBody
    DataSourceResult getList(@RequestBody DataSourceRequest request) throws JSONException, ClassNotFoundException {
        return dao.getList("core.Module",request);
    }
}
