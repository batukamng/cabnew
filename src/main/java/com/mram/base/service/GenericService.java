package com.mram.base.service;

import com.mram.base.entity.GenericEntity;
import com.mram.base.exception.ResourceNotFoundException;
import com.mram.base.repository.GenericRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


public abstract class GenericService<T extends GenericEntity<T>> {

    private final GenericRepository<T> repository;

    public GenericService(GenericRepository<T> repository) {
        this.repository = repository;
    }

    public Page<T> getPage(Pageable pageable){
        return repository.findAll(pageable);
    }

    public T get(Long id){
        return repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Object", "id", id)
        );
    }

    @Transactional
    public T update(T updated){
        T dbDomain;
        if(updated.getId()!=null){
            dbDomain = get(updated.getId());
        }
        else{
            dbDomain = updated.createNewInstance();
        }
        dbDomain.update(updated);

        return repository.save(dbDomain);
    }

    @Transactional
    public T create(T newDomain){
        T dbDomain = newDomain.createNewInstance();
        return repository.save(dbDomain);
    }

    @Transactional
    public void delete(Long id){
        //check if object with this id exists
        get(id);
        repository.deleteById(id);
    }

    public GenericRepository<T> getRepository() {
        return repository;
    }

    public List<T> getList() {
        return repository.findAll();
    }
}
