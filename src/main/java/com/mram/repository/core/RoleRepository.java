package com.mram.repository.core;

import java.util.Optional;

import com.mram.base.repository.GenericRepository;
import com.mram.model.core.Role;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;


@Repository
public interface RoleRepository extends GenericRepository<Role> {

    @Query("SELECT u FROM Role u WHERE u.auth = ?1")
    Optional<Role> findByName(String name);

    @Query("SELECT u FROM Role u WHERE u.id = ?1")
    Role findById(int roleId);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM t_roles_menus WHERE menu_id = :menuId and role_id = :roleId",nativeQuery = true)
    void deleteRoleMenu(@Param("menuId") long menuId, @Param("roleId") long roleId);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM t_roles_privileges WHERE privilege_id = :priId and role_id = :roleId",nativeQuery = true)
    void deleteRolePrivilege(@Param("priId") long priId, @Param("roleId") long roleId);

    Optional<Role> findByAuth(String planningSpecialist);
}
