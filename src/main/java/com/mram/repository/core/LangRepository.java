package com.mram.repository.core;
import com.mram.model.core.Language;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LangRepository extends JpaRepository<Language, Long> {

    @Query("SELECT c from Language c where c.name=?1 order by id")
    List<Language> findAll(String path);

}
