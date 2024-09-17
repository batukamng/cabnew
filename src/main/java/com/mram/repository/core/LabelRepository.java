package com.mram.repository.core;
import com.mram.model.core.Labels;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LabelRepository extends JpaRepository<Labels, Long> {
}
