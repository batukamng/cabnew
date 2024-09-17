package com.mram.repository.cmmn;

import com.mram.base.repository.GenericRepository;
import com.mram.model.cmmn.Feedback;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends GenericRepository<Feedback> {
    @Query("SELECT comCd FROM Feedback comCd WHERE comCd.useYn = 1 and comCd.createdBy = ?1 order by comCd.id asc")
    List<Feedback> getListBySender(Long senderId);

    @Query("SELECT comCd FROM Feedback comCd WHERE comCd.id = ?1")
    Feedback getById(Long id);
}
