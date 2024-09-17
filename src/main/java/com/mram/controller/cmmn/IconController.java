package com.mram.controller.cmmn;

import com.mram.base.controller.GenericController;
import com.mram.dao.MainDao;
import com.mram.model.audit.DataSourceRequest;
import com.mram.model.audit.DataSourceResult;
import com.mram.model.core.Icon;
import com.mram.repository.core.IconRepository;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/nms/icon")
public class IconController extends GenericController<Icon> {
    public IconController(IconRepository repository) {
        super(repository);
    }

    @Autowired
    private MainDao dao;

    @Autowired
    private IconRepository repository;

    @PostMapping("/submit")
    public Icon submit(@RequestBody Icon item) {
        return repository.save(item);
    }


    // -------------------List by page -------------------------------------------
    @PostMapping("/list")
    public @ResponseBody
    DataSourceResult getList(@RequestBody DataSourceRequest request) throws JSONException, ClassNotFoundException {
        return dao.getList("core.Icon",request);
    }
}
