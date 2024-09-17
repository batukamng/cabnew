package com.mram.repository.core;

import com.mram.base.repository.GenericRepository;
import com.mram.model.core.Organization;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrganizationRepository extends GenericRepository<Organization> {
    List<Organization> findByLpReg(String register);

    List<Organization> findByName(String name);

    @Query("SELECT comCd FROM Organization comCd WHERE comCd.id = ?1")
    Organization getById(Long id);

    @Query("SELECT comCd FROM Organization comCd WHERE comCd.id = ?1")
    List<Organization> getByIdList(Long id);

    @Query("SELECT t FROM Organization t WHERE t.lpReg = ?1 and t.useYn=1")
    Optional<Organization> findByRegNum(String lpReg);
}
