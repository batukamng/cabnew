package com.mram.controller.core;

import com.google.firebase.messaging.FirebaseMessagingException;
import com.mram.dao.MainDao;
import com.mram.model.audit.DataSourceRequest;
import com.mram.model.audit.DataSourceResult;
import com.mram.model.dto.SeenDto;
import com.mram.model.notif.NotificationMessage;
import com.mram.model.view.NotificationView;
import com.mram.service.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@CrossOrigin(origins = "*")
@RequestMapping("/api/notification")
public class NotificationController {

    private final NotificationService notificationService;
    private final MainDao dao;

    public NotificationController(NotificationService notificationService, MainDao dao) {
        this.notificationService = notificationService;
        this.dao = dao;
    }

    @GetMapping("/token/{fcm}")
    public ResponseEntity<?> getViewItem(@PathVariable String fcm) {
        notificationService.saveToken(fcm);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/read")
    public ResponseEntity<?> seen(@RequestBody SeenDto seen) {
        notificationService.saveSeen(seen.getNtfId(),seen.getUserId());
        return ResponseEntity.ok().body(dao.getHQLResult("from NotificationView t where t.id="+seen.getNtfId()+" and t.userId="+seen.getUserId()+"","current"));
    }

    @PostMapping("/read/all/{userId}")
    public ResponseEntity<?> readAll(@PathVariable Long userId) {
        notificationService.saveSeenAll(userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submit(@RequestBody NotificationMessage item) throws FirebaseMessagingException {
        notificationService.saveItem(item);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/item/{id}")
    public NotificationView getById(@PathVariable(value = "id") Long id) {
        return  notificationService.getItem(id);
    }

    @GetMapping("/count/{userId}")
    public ResponseEntity<?> getViewItem(@PathVariable Long userId) {
        Long count= (Long) dao.getHQLResult("select sum(v.seen) from NotificationView v where v.userId="+userId+" and v.seen=1","count");
        if(count==null){
            return ResponseEntity.ok().body(0);
        }
        return ResponseEntity.ok().body(count);
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> submit(@PathVariable Long id) {
       // NotificationView channel=notificationService.getItem(id);
        notificationService.deleteNotification(id);
        return ResponseEntity.ok().build();
    }

    // -------------------List by page -------------------------------------------
    @PostMapping("/list")
    public @ResponseBody
    DataSourceResult getList(@RequestBody DataSourceRequest request) throws JSONException, ClassNotFoundException {
        return dao.getList("view.NotificationView",request);
    }


    // -------------------List by page -------------------------------------------
    @PostMapping("/main/list")
    public @ResponseBody
    DataSourceResult getMainList(@RequestBody DataSourceRequest request) throws JSONException, ClassNotFoundException {
        return dao.getList("view.NotificationMainView",request);
    }
}
