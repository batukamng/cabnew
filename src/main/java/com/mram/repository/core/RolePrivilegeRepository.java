package com.mram.repository.core;
import com.mram.base.repository.GenericRepository;
import com.mram.model.core.RolePrivilege;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public interface RolePrivilegeRepository extends GenericRepository<RolePrivilege> {
    @Modifying
    @Query("delete from RolePrivilege b where b.roleId=?1")
    void deleteByRoleId(Long id);
}