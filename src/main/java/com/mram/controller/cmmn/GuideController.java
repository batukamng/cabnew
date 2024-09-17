package com.mram.controller.cmmn;

import com.mram.base.controller.GenericController;
import com.mram.dao.MainDao;
import com.mram.model.audit.DataSourceRequest;
import com.mram.model.audit.DataSourceResult;
import com.mram.model.cmmn.Guide;
import com.mram.repository.cmmn.GuideRepository;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/nms/guide")
public class GuideController extends GenericController<Guide> {
    public GuideController(GuideRepository repository) {
        super(repository);
    }

    @Autowired
    private MainDao dao;

    @Autowired
    private GuideRepository repository;
/*
    @GetMapping("/plan/{planId}/{id}")
    public ResponseEntity getOne(@PathVariable Long id){
        Guide guide = service.get(id);
        FileInputStream fis = null;

/*
        File formfile = new File(appPath + guide.getFile().getFilePath());
            fis = new FileInputStream(formfile);
        return ResponseEntity.ok().build();
    }
*/
    @PostMapping("/submit")
    public Guide submit(@RequestBody Guide item) {
        return repository.save(item);
    }

    // -------------------List by page -------------------------------------------
    @PostMapping("/list")
    public @ResponseBody
    DataSourceResult getList(@RequestBody DataSourceRequest request) throws JSONException, ClassNotFoundException {
        return dao.getList("cmmn.Guide",request);
    }
}
