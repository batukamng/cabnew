package com.mram.controller.core;

import com.mram.base.exception.ResourceNotFoundException;
import com.mram.dao.MainDao;
import com.mram.model.core.Activity;
import com.mram.model.audit.DataSourceRequest;
import com.mram.model.audit.DataSourceResult;
import com.mram.repository.core.ActivityRepository;
import com.mram.service.core.PaginatedResult;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/activity")
public class SysActivityController {

    @Autowired
    ActivityRepository activityRepository;

    @Autowired
    private MainDao dao;


    @PostMapping("/create")
    public Activity create(@RequestBody Activity item) {
        return activityRepository.save(item);
    }

    @GetMapping("/item/{id}")
    public Activity getById(@PathVariable(value = "id") Long id) {
        return activityRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Activity", "id", id));
    }

    @PutMapping("/update")
    public Activity update(@RequestBody Activity noteDetails) {
        return activityRepository.save(noteDetails);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> delete(@RequestBody Activity noteDetails) {
        activityRepository.delete(noteDetails);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/list")
    public ResponseEntity<?> getList(@RequestBody String data) throws JSONException {
        return ResponseEntity
                .ok(new PaginatedResult()
                        .setData(this.dao.getListByPage(data,"Activity"))
                        .setCurrentPage(0)
                        .setTotal(this.dao.getTotalPage(data,"Activity")));
    }

    // -------------------List by page -------------------------------------------
    @PostMapping("/data/list")
    public @ResponseBody
    DataSourceResult getList(@RequestBody DataSourceRequest request) throws JSONException, ClassNotFoundException {
        return dao.getList("Activity",request);
    }

}
