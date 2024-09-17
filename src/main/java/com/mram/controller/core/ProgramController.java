package com.mram.controller.core;

import com.mram.base.controller.GenericController;
import com.mram.dao.MainDao;
import com.mram.model.audit.DataSourceRequest;
import com.mram.model.audit.DataSourceResult;
import com.mram.model.core.Program;
import com.mram.repository.core.ProgramRepository;
import org.json.JSONException;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin/program")
public class ProgramController extends GenericController<Program> {
    public ProgramController(ProgramRepository repository, MainDao dao) {
        super(repository);
        this.dao = dao;
        this.repository = repository;
    }

    private final MainDao dao;
    private final ProgramRepository repository;

    @PostMapping("/submit")
    public Program submit(@RequestBody Program item) {
        return repository.save(item);
    }

    @PostMapping("/list")
    public @ResponseBody
    DataSourceResult getList(@RequestBody DataSourceRequest request) throws JSONException, ClassNotFoundException {
        return dao.getList("view.ProgramView",request);
    }
}
