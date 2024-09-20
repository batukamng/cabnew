package com.mram.controller.core;

import com.mram.base.controller.GenericController;
import com.mram.dao.MainDao;
import com.mram.model.audit.DataSourceRequest;
import com.mram.model.audit.DataSourceResult;
import com.mram.model.core.ActivityLog;
import com.mram.model.core.LutUser;
import com.mram.model.core.Menu;
import com.mram.repository.core.ActivityLogRepository;
import com.mram.repository.core.MenuRepository;
import com.mram.repository.core.UserRepository;
import com.mram.service.ActivityLogService;
import com.mram.utils.DurationCalculator;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/nms/activity-log")
public class ActivityLogController extends GenericController<ActivityLog> {

    private final UserRepository userRepository;
    private final MenuRepository menuRepository;
    private final ActivityLogRepository repository;
    private final ActivityLogService activityLogService;
    private final MainDao dao;

    public ActivityLogController(ActivityLogRepository repository, MainDao dao, UserRepository userRepository,
            MenuRepository menuRepository, ActivityLogService activityLogService) {
        super(repository);
        this.dao = dao;
        this.userRepository = userRepository;
        this.menuRepository = menuRepository;
        this.repository = repository;
        this.activityLogService = activityLogService;
    }

    @PostMapping("/event")
    public ResponseEntity<?> event(@RequestBody String jsonStr) {
        JSONObject obj = new JSONObject(jsonStr);
        Optional<Menu> menu = menuRepository.findByCurrent(obj.getString("current"));
        if (menu != null && menu.isPresent()) {
            ActivityLog log = activityLogService.create();
            if (log != null) {

                if (menu.get().getId() != null) {
                    log.setLogId(menu.get().getId());
                }

                log.setCode("event");
                if (menu.get().getName() != null) {
                    log.setDescription(menu.get().getName());
                }
                repository.save(log);
            }

        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/trace")
    public ResponseEntity<?> trace(@RequestBody String jsonStr) {
        JSONObject obj = new JSONObject(jsonStr);
        ActivityLog log = activityLogService.create();
        // log.setLogId(menu.get().getId());
        if (log != null) {
            log.setCode(obj.getString("event"));
            log.setDescription(obj.getString("description"));
            repository.save(log);
        }

        return ResponseEntity.ok().build();
    }

    @GetMapping("/{type}/{logId}")
    public String getList(@PathVariable String type, @PathVariable Long logId) {
        ActivityLogRepository repository = (ActivityLogRepository) service.getRepository();
        List<ActivityLog> logs = repository.findByCodeAndLogIdOrderByIdAsc(type, logId);
        SimpleDateFormat FORMATTER = new SimpleDateFormat("yyyy/MM/dd HH:mm");
        java.util.Date prevLoggedTime = null;
        JSONArray arr = new JSONArray();
        for (int i = 0; i < logs.size(); i++) {
            ActivityLog log = logs.get(i);
            java.util.Date loggedTime = Date.from(log.getCreatedAt());
            JSONObject put = new JSONObject()
                    .put("step", i + 1)
                    .put("name", log.getName())
                    .put("date", FORMATTER.format(loggedTime))
                    .put("status", log.getStatus());
            if (prevLoggedTime != null) {
                put.put("parsedDate", new DurationCalculator(prevLoggedTime, loggedTime).getParsed());
            }
            prevLoggedTime = loggedTime;
            if (log.getCreatedBy() != null) {
                Optional<LutUser> byId = userRepository.findById(log.getCreatedBy());
                if (byId != null) {
                    if(byId.isPresent()) {
                        if (byId.get().getOrganization() != null) {
                            put.put("consumer", byId.get().getOrganization().getName());
                        } else {
                            put.put("consumer", "-");
                        }
                        byId.ifPresent(user -> put.put("imp", user.getDetail().getFirstname()));
                        arr.put(put);
                    }
                }

            }
        }
        System.out.println(arr.toString());
        return arr.toString();
    }

    // -------------------List by page -------------------------------------------
    @PostMapping("/list")
    public @ResponseBody DataSourceResult getList(@RequestBody DataSourceRequest request, Authentication authentication)
            throws JSONException, ClassNotFoundException {
        return dao.getList("view.ActivityLogView", request);
    }
}
