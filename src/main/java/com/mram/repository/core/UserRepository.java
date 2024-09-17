package com.mram.repository.core;
import java.util.List;
import java.util.Optional;

import com.mram.base.repository.GenericRepository;
import com.mram.model.core.LutUser;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface UserRepository extends GenericRepository<LutUser> {

    @Query("SELECT c from LutUser c where lower(c.username) =lower(?1) and c.useYn=1")
    Optional<LutUser> findByUsername(String username);

    Boolean existsByUsernameAndUseYn(String username, Integer useYn);
    Boolean existsByEmail(String email);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM t_user_roles WHERE user_id = :userId and role_id = :roleId",nativeQuery = true)
    void deleteRoles(@Param("userId") long userId, @Param("roleId") long roleId);



    @Query("SELECT c from LutUser c where lower(c.email) =lower(?1) and c.useYn=1")
    List<LutUser> findByEmail(String email);

    List<LutUser> findByIdIn(List<Long> creatorIds);

    @Query("SELECT c from LutUser c where c.id in ?1")
    List<LutUser> getUsers(List<Long> members);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM t_user_roles WHERE user_id = :userId ",nativeQuery = true)
    void deleteRoleByUser(Long userId);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM t_user_province WHERE user_id = :userId ",nativeQuery = true)
    void deleteProvinceByUser(Long userId);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM t_user_governor WHERE user_id = :userId ",nativeQuery = true)
    void deleteGovernorByUser(Long userId);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM t_user_sector WHERE user_id = :userId",nativeQuery = true)
    void deleteSectorByUser(Long userId);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM t_user_eco WHERE user_id = :userId ",nativeQuery = true)
    void deleteEcoListByUser(Long userId);

    @Modifying
    @Transactional
    @Query(value = "UPDATE Profile u SET u.fcmToken=null WHERE u.fcmToken=?1")
    void updateByFcmToken(String fcmToken);

    List<LutUser> findByOrgId(Long orgId);

    @Query("SELECT user FROM LutUser user " +
            "WHERE (SELECT role FROM Role role WHERE role.auth = ?1) MEMBER OF user.roles " +
            "AND user.lvlId IN ?2")
    List<LutUser> findWithRoleAndLevels(String roleAuth, List<Long> levels);
}
