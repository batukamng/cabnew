package com.mram.controller;

import com.mram.utils.MQProducer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/organization")
public class MiddleServiceController {

    @Autowired
    MQProducer mqProducer;

    @Autowired
    Environment env;

    @GetMapping("/import")
    public ResponseEntity<?> importData() {
        mqProducer.importData("request_sync", env.getProperty("spring.invest.routing.key"));
        return ResponseEntity.ok().build();
    }

}
