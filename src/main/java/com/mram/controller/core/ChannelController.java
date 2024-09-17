package com.mram.controller.core;
import com.mram.base.controller.GenericController;
import com.mram.dao.MainDao;
import com.mram.model.audit.DataSourceRequest;
import com.mram.model.audit.DataSourceResult;
import com.mram.model.notif.NotificationChannel;
import com.mram.repository.notif.ChannelRepository;
import org.json.JSONException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin/channel")
public class ChannelController extends GenericController<NotificationChannel> {
    public ChannelController(ChannelRepository repository, MainDao dao) {
        super(repository);
        this.dao = dao;
        this.repository = repository;
    }
    private final MainDao dao;
    private final ChannelRepository repository;

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> submit(@PathVariable Long id) {
        NotificationChannel channel=service.get(id);
        repository.delete(channel);
        return ResponseEntity.ok().build();
    }

    // -------------------List by page -------------------------------------------
    @PostMapping("/list")
    public @ResponseBody
    DataSourceResult getList(@RequestBody DataSourceRequest request) throws JSONException, ClassNotFoundException {
        return dao.getList("view.ChannelView",request);
    }
}
