package com.mram.repository.cmmn;

import com.mram.base.repository.GenericRepository;
import com.mram.model.cmmn.CommonCd;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommonCdRepository extends GenericRepository<CommonCd> {

    @Query("SELECT comCd FROM CommonCd comCd WHERE comCd.grpCd='projectStatus' and length(comCd.comCd)=2")
    List<CommonCd> findProjectSteps();

    @Query("SELECT comCd FROM CommonCd comCd WHERE comCd.grpCd=?1 and comCd.parentId is not null order by comCd.orderId")
    List<CommonCd> findByGrpCd(String ecoType);

    @Query("SELECT comCd FROM CommonCd comCd WHERE comCd.grpCd=?1 and comCd.comCd=?2 order by comCd.orderId")
    List<CommonCd> findByGrpCdAndShortCd(String projectType, String s);

    @Query("SELECT comCd FROM CommonCd comCd WHERE comCd.grpCd=?1 and comCd.parentId is not null and comCd.id = ?2 order by comCd.orderId")
    List<CommonCd> getOneByList(String ecoType, Long id);

    @Query("SELECT comCd FROM CommonCd comCd WHERE comCd.grpCd=?1 and comCd.parentId is not null order by comCd.orderId")
    List<CommonCd> getByGrpCd(String grpCd);

    @Query("SELECT comCd FROM CommonCd comCd WHERE comCd.useYn = 1 and comCd.id = ?1")
    List<CommonCd> getOneByList(Long id);

    List<CommonCd> findByParentId(long l);
}
