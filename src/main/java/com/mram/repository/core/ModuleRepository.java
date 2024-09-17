package com.mram.repository.core;
import com.mram.base.repository.GenericRepository;
import com.mram.model.core.Module;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ModuleRepository extends GenericRepository<Module> {
/*
    @Query(value = "select * from t_module m where m.id in (select mo.module_id from t_menu_module mo where mo.menu_id in (select pr.menu_id from t_roles_privileges pr,t_privilege p, t_menu me where  me.all_module=0 and me.use_yn=1 and p.short_name='read' and p.id=pr.privilege_id and me.id=pr.menu_id and pr.role_id in (select r.id from t_roles r where r.id in(select ur.role_id from t_user_roles ur where ur.user_id=?1)) GROUP BY pr.menu_id) GROUP BY mo.module_id) order by m.name",nativeQuery = true)
    List<LutModule> getModules(Long id);
*/

   /* @Query(value = "SELECT\n" +
            "    MM.ID,\n" +
            "    MM.NAME,\n" +
            "    MM.CREATED_AT,\n" +
            "    MM.CREATED_BY,\n" +
            "    MM.UPDATED_AT,\n" +
            "    MM.UPDATED_BY,\n" +
            "    MM.USE_YN ,\n" +
            "    MM.FILE_ID \n" +
            "FROM\n" +
            "    T_MODULE MM,\n" +
            "    T_MENU_MODULE MOO,\n" +
            "    T_MODULE M,\n" +
            "    T_MENU_MODULE MO,\n" +
            "    T_ROLES_PRIVILEGES PR,\n" +
            "    T_PRIVILEGE P,\n" +
            "    T_MENU ME,\n" +
            "    T_ROLES R,\n" +
            "    T_USER_ROLES UR \n" +
            "WHERE\n" +
            "    MM.ID = MOO.MODULE_ID \n" +
            "    AND M.ID = MO.MODULE_ID \n" +
            "    AND MO.MENU_ID = PR.MENU_ID \n" +
            "    AND ME.ALL_MODULE = 0 \n" +
            "    AND ME.USE_YN = 1 \n" +
            "    AND P.SHORT_NAME = 'read' \n" +
            "    AND P.ID = PR.PRIVILEGE_ID \n" +
            "    AND ME.ID = PR.MENU_ID \n" +
            "    AND R.ID = UR.ROLE_ID \n" +
            "    AND UR.USER_ID = ?1 \n" +
            "    AND PR.ROLE_ID = R.ID \n" +
            "    AND MM.ID = M.ID\n" +
            "GROUP BY         \n" +
            "    MM.ID,\n" +
            "    MM.NAME,\n" +
            "    MM.CREATED_AT,\n" +
            "    MM.CREATED_BY,\n" +
            "    MM.UPDATED_AT,\n" +
            "    MM.UPDATED_BY,\n" +
            "    MM.USE_YN ,\n" +
            "    MM.FILE_ID \n" +
            "    ORDER BY MM.NAME",nativeQuery = true)*/

    @Query(value = "SELECT \n" +
            "    MD.ID, MD.CREATED_AT, MD.UPDATED_AT, MD.CREATED_BY, MD.UPDATED_BY, MD.USE_YN, MD.FILE_ID, MD.NAME, MD.order_id \n" +
            "FROM \n" +
            "    t_module MD, \n" +
            "    t_menu_module MOO, \n" +
            "    t_menu M, \n" +
            "    t_roles_privileges P, \n" +
            "    t_privilege E, \n" +
            "    t_user_roles R    \n" +
            "WHERE \n" +
            "    M.USE_YN=1 AND \n" +
            "    P.PRIVILEGE_ID=E.ID AND \n" +
            "    E.SHORT_NAME = 'read' AND \n" +
            "    R.ROLE_ID = P.ROLE_ID AND \n" +
            "    R.USER_ID = ?1 AND \n" +
            "    M.ID = P.MENU_ID AND \n" +
            "    M.PARENT_ID IS NULL AND \n" +
            "    MOO.MENU_ID = M.ID AND \n" +
            "    MD.ID = MOO.MODULE_ID    \n" +
            "GROUP BY \n" +
            "    MD.ID, MD.CREATED_AT, MD.UPDATED_AT, MD.CREATED_BY, MD.UPDATED_BY, MD.USE_YN, MD.FILE_ID, MD.NAME, MD.order_id \n" +
            "ORDER BY MD.NAME ",nativeQuery = true)
    List<Module> getModules(Long id);
}