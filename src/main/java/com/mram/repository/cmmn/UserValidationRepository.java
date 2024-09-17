package com.mram.repository.cmmn;


import com.mram.model.core.UserValidation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface UserValidationRepository extends JpaRepository<UserValidation, Long> {

    List<UserValidation> findByUserId(Long userId);

    @Modifying
    @Transactional
    void deleteByUserId(long userId);

    List<UserValidation> findByUserIdAndCode(long userId, String code);

}