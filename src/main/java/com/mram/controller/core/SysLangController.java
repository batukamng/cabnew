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
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/lang")
public class SysLangController {

    @Autowired
    LangRepository langRepository;

    @Autowired
    LabelRepository labelRepository;

    @Autowired
    private MainDao dao;

    @PostMapping("/create")
    public Language create(@RequestBody Language item) {
        return langRepository.save(item);
    }

    @GetMapping("/item/{id}")
    public Language getById(@PathVariable(value = "id") Long id) {
        return langRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("LutLanguage", "id", id));
    }

    @GetMapping("/all")
    public List<Language> getList() {
        return langRepository.findAll();
    }

    @GetMapping("/copy/{id}/{langId}")
    public ResponseEntity<?> getById(@PathVariable(value = "langId") Long langId,@PathVariable(value = "id") Long id) {

        Language item=langRepository.getOne(langId);
        for(Labels label:item.getLutLabels()){
            Labels lbl=new Labels();
            lbl.setLabelEn(label.getLabelEn());
            lbl.setLabelMg(label.getLabelMg());
            lbl.setLabelId(label.getLabelId());
            lbl.setLangId(id);
            lbl.setUseYn(1);
            labelRepository.save(lbl);
        }
        return ResponseEntity.ok().build();
    }

    @PutMapping("/update")
    public Language update(@RequestBody Language noteDetails) {
        return langRepository.save(noteDetails);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> delete(@RequestBody Language noteDetails) {
        langRepository.delete(noteDetails);
        return ResponseEntity.ok().build();
    }


    @PostMapping("/list")
    public ResponseEntity<?> getList(@RequestBody String data) throws JSONException {
        return ResponseEntity
                .ok(new PaginatedResult()
                        .setData(this.dao.getListByPage(data, "LutLanguage"))
                        .setCurrentPage(0)
                        .setTotal(this.dao.getTotalPage(data, "LutLanguage")));
    }


    // -------------------List by page -------------------------------------------
    @PostMapping("/data/list")
    public @ResponseBody
    DataSourceResult getList(@RequestBody DataSourceRequest request) throws JSONException, ClassNotFoundException {
        return dao.getList("core.LutLanguage",request);
    }

}
