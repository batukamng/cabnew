package com.mram.controller.core;

import com.mram.base.exception.ResourceNotFoundException;
import com.mram.dao.MainDao;
import com.mram.model.core.Labels;
import com.mram.model.core.Language;
import com.mram.model.audit.DataSourceRequest;
import com.mram.model.audit.DataSourceResult;
import com.mram.repository.core.LabelRepository;
import com.mram.repository.core.LangRepository;
import com.mram.service.core.PaginatedResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/label")
public class SysLabelController {

    @Autowired
    LabelRepository labelRepository;

    @Autowired
    LangRepository langRepository;

    @Autowired
    private MainDao dao;

    @GetMapping("/all")
    public String getAll() {
        List<Labels> lbls= labelRepository.findAll();
        JSONArray arr=new JSONArray();
        for(Labels item:lbls){
            if(item.isUseYn() == 1 && item.getLutLanguage().getName().equalsIgnoreCase("mn")){
                JSONObject obj= new JSONObject();
                obj.put("text",item.getLabelMg());
                obj.put("value",item.getLabelId());
                arr.put(obj);
            }
        }
        return arr.toString();
    }

    @GetMapping("/lang/{path}")
    public String getAll(@PathVariable String path) {

        List<Language> lang= langRepository.findAll(path);

        JSONArray arr=new JSONArray();
        if(!lang.isEmpty()){
            for(Labels item:lang.get(0).getLutLabels()){
                if(item.isUseYn() == 1){
                    JSONObject obj= new JSONObject();
                    obj.put(item.getLabelId(),item.getLabelMg());
                    arr.put(obj);
                }
            }
        }

        return arr.toString();
    }

    @PostMapping("/create")
    public Labels create(@RequestBody Labels item) {
        return labelRepository.save(item);
    }

    @GetMapping("/item/{id}")
    public Labels getById(@PathVariable(value = "id") Long id) {
        return labelRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("LutLabels", "id", id));
    }

    @PutMapping("/update")
    public Labels update(@RequestBody Labels noteDetails) {
        return labelRepository.save(noteDetails);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> delete(@RequestBody Labels noteDetails) {
        labelRepository.delete(noteDetails);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/list")
    public ResponseEntity<?> getList(@RequestBody String data) throws JSONException {
        return ResponseEntity
                .ok(new PaginatedResult()
                        .setData(this.dao.getListByPage(data,"LutLabels"))
                        .setCurrentPage(0)
                        .setTotal(this.dao.getTotalPage(data,"LutLabels")));
    }

    // -------------------List by page -------------------------------------------
    @PostMapping("/data/list")
    public @ResponseBody
    DataSourceResult getList(@RequestBody DataSourceRequest request) throws JSONException, ClassNotFoundException {
        return dao.getList("LutLabels",request);
    }

}
