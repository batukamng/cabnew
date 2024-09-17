package com.mram.base.controller;
import com.mram.base.entity.GenericEntity;
import com.mram.base.repository.GenericRepository;
import com.mram.base.service.GenericService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

public abstract class GenericController<T extends GenericEntity<T>> {

    protected final GenericService<T> service;

    public GenericController(GenericRepository<T> repository) {
        this.service = new GenericService<T>(repository) {};
    }

    public GenericController(GenericService<T> service) {
        this.service = service;
    }

    @GetMapping("")
    public ResponseEntity<Page<T>> getPage(Pageable pageable){
        return ResponseEntity.ok(service.getPage(pageable));
    }

    @GetMapping("/list/all")
    public ResponseEntity<List<T>> getList(){
        return ResponseEntity.ok(service.getList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<T> getOne(@PathVariable Long id){
        return ResponseEntity.ok(service.get(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<T> update(@PathVariable Long id, @RequestBody T updated){
        return ResponseEntity.ok(service.update(updated));
    }

    @PutMapping
    public ResponseEntity<T> updateEntity(@RequestBody T updated){
        return ResponseEntity.ok(service.update(updated));
    }

    @PostMapping
    public ResponseEntity<T> create(@RequestBody T created){
        if(created.getId()!=null){
            return ResponseEntity.ok(service.update(created));
        }
        else{
            return ResponseEntity.ok(service.create(created));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id){
        service.delete(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<?> deleteByItem(@RequestBody T deleted){
        service.delete(deleted.getId());
        return ResponseEntity.ok().build();
    }
}
