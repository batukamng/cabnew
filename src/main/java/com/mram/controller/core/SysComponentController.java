package com.mram.controller.core;

import com.mram.base.controller.GenericController;
import com.mram.dao.MainDao;
import com.mram.model.audit.DataSourceRequest;
import com.mram.model.audit.DataSourceResult;
import com.mram.model.core.Component;
import com.mram.repository.core.ComponentRepository;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/nms/component")
public class SysComponentController extends GenericController<Component> {
    public SysComponentController(ComponentRepository repository) {
        super(repository);
    }

    @Autowired
    private MainDao dao;

    @Autowired
    private ComponentRepository repository;

    @PostMapping("/submit")
    public Component submit(@RequestBody Component item) {
        return repository.save(item);
    }


    // -------------------List by page -------------------------------------------
    @PostMapping("/list")
    public @ResponseBody
    DataSourceResult getList(@RequestBody DataSourceRequest request) throws JSONException, ClassNotFoundException {
        return dao.getList("core.LutComponent",request);
    }
}
