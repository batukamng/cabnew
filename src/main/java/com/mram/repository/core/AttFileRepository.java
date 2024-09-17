package com.mram.repository.core;

import com.mram.model.core.AttFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttFileRepository extends JpaRepository<AttFile, Long> {

}
