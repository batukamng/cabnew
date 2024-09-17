package com.mram.controller.cmmn;

import com.mram.base.controller.GenericController;
import com.mram.dao.MainDao;
import com.mram.model.audit.DataSourceRequest;
import com.mram.model.audit.DataSourceResult;
import com.mram.model.cmmn.Feedback;
import com.mram.model.core.AttFile;
import com.mram.model.view.FeedbackView;
import com.mram.repository.cmmn.FeedbackRepository;
import com.mram.repository.core.AttFileRepository;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin/feedback")
public class FeedbackController extends GenericController<Feedback> {
    public FeedbackController(FeedbackRepository repository, MainDao dao, AttFileRepository fileRepository) {
        super(repository);
        this.dao = dao;
        this.repository = repository;
        this.fileRepository = fileRepository;
    }

    private final MainDao dao;
    private final FeedbackRepository repository;
    private final AttFileRepository fileRepository;

    @PostMapping("/submit")
    public Feedback submit(@RequestBody Feedback item){
        List<AttFile> fileList=new ArrayList<>();
        if(item.getFilesArr()!=null && !item.getFilesArr().isEmpty()){
            for(Long id:item.getFilesArr()){
                fileList.add(fileRepository.getReferenceById(id));
            }
            item.setFileList(fileList);
        }
        return service.update(item);
    }


    @PostMapping("/reply")
    public Feedback reply(@RequestBody String jsonStr){
        JSONObject obj=new JSONObject(jsonStr);
        Feedback item=repository.getById(obj.getLong("id"));
        item.setReplyData(obj.getString("replyData"));
        item.setStatus(obj.getLong("status"));
        return service.update(item);
    }

    @GetMapping("/item/{id}")
    public List<FeedbackView> getById(@PathVariable(value = "id") Long id) {
        return (List<FeedbackView>) dao.getHQLResult("from FeedbackView t where t.createdBy="+id,"list");
        //return repository.getListBySender(id);
    }

    // -------------------List by page -------------------------------------------
    @PostMapping("/list")
    public @ResponseBody
    DataSourceResult getList(@RequestBody DataSourceRequest request) throws JSONException, ClassNotFoundException {
        return dao.getList("view.FeedbackView",request);
    }

}
