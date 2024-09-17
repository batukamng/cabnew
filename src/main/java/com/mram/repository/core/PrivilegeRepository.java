package com.mram.repository.core;
import com.mram.base.repository.GenericRepository;
import com.mram.model.core.Privilege;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface PrivilegeRepository extends GenericRepository<Privilege> {

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM t_user_privileges WHERE user_id = :userId and privilege_id = :privilegeId",nativeQuery = true)
    void deleteRoles(@Param("userId") long userId, @Param("privilegeId") long privilegeId);


    @Query(value="SELECT \n" +
            "    V.* \n" +
            "FROM \n" +
            "(\n" +
            "    SELECT \n" +
            "        T.MENU_ID AS MENU_ID, \n" +
            "        group_concat(T.NM, ',') AS ACTION_NAME, \n" +
            "        (SELECT M.URL from t_menu M WHERE M.ID=T.MENU_ID) AS URL \n" +
            "    FROM \n" +
            "    (\n" +
            "        SELECT \n" +
            "            PR.MENU_ID,\n" +
            "            E.SHORT_NAME AS NM \n" +
            "        FROM t_roles_privileges PR \n" +
            "        INNER JOIN t_privilege E ON E.ID = PR.PRIVILEGE_ID, \n" +
            "            t_roles R, \n" +
            "            t_user_roles UR        \n" +
            "        WHERE PR.ROLE_ID = R.ID AND R.ID = UR.ROLE_ID AND UR.USER_ID = ?1 \n" +
            "    ) T GROUP BY T.MENU_ID \n" +
            ") V WHERE V.ACTION_NAME LIKE '%read%'",nativeQuery = true)
    String[][] getPrivileges(Long id);

    @Query(value="SELECT \n" +
            "    COUNT(V.MENU_ID) \n" +
            "FROM \n" +
            "(\n" +
            "    SELECT \n" +
            "        T.MENU_ID AS MENU_ID, \n" +
            "        LISTAGG(DISTINCT T.NM, ',') WITHIN GROUP (ORDER BY T.NM) AS ACTION_NAME, \n" +
            "        (SELECT M.URL from T_MENU M WHERE M.ID=T.MENU_ID) AS URL \n" +
            "    FROM \n" +
            "    (\n" +
            "        SELECT \n" +
            "            PR.MENU_ID,\n" +
            "            E.SHORT_NAME AS NM \n" +
            "        FROM T_ROLES_PRIVILEGES PR \n" +
            "        INNER JOIN T_PRIVILEGE E ON E.ID = PR.PRIVILEGE_ID, \n" +
            "            T_ROLES R, \n" +
            "            T_USER_ROLES UR        \n" +
            "        WHERE PR.ROLE_ID = R.ID AND R.ID = UR.ROLE_ID AND UR.USER_ID = ?1 \n" +
            "    ) T GROUP BY T.MENU_ID \n" +
            ") V WHERE V.ACTION_NAME LIKE '%'||?2||'%'",nativeQuery = true)
    Integer hasPrivilege(Long id, String action);
}
