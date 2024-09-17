package com.mram.repository.core;

import com.mram.model.core.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityRepository extends JpaRepository<Activity,Long> {
  /*  Activity findFirstBy();
    Activity findFirstByUserOrderByIdDesc(LutUser user);
    Page<Activity> findByUser(LutUser user, Pageable pageable);
    @Query("SELECT u FROM Activity u WHERE u.id = ?1")
    Activity findOne(Long id);

    @Modifying
    @Transactional
    @Query("DELETE FROM Activity u WHERE u.id = ?1")
    void delete(Long id);*/
}
