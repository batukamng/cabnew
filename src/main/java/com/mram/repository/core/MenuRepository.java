package com.mram.repository.core;
import com.mram.base.repository.GenericRepository;
import com.mram.model.core.Menu;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface MenuRepository extends GenericRepository<Menu> {

    @Query("select t from Menu t where t.parentId is null order by t.orderId ")
    List<Menu> getParents();

    @Query(value = "select * from t_menu m where m.id in (select t.menu_id from t_roles_privileges t,t_privilege p where t.role_id in (?1) and p.id=t.privilege_id and p.short_name='read' GROUP BY t.menu_id) and m.use_yn=1 order by m.order_id",nativeQuery = true)
    List<Menu> getRoleMenus(List<Long> roles);

    // @Query(value = "select m.* from t_menu m,t_roles_privileges r where m.use_yn=true and m.parent_id is null and r.menu_id=m.id and r.role_id in (select s.id from t_roles s,t_user_roles t,t_users p where t.role_id=s.id and p.id=t.user_id and p.username=(?1) GROUP BY s.id) GROUP BY m.id order by m.order_id",nativeQuery = true)
    /*@Query(value="SELECT \n" +
            " me.*\n" +
            "from t_menu me\n" +
            "where me.USE_YN = 1\n" +
            "  and me.ID in\n" +
            "(\n" +
            "select\n" +
            "        m.id \n" +
            "    from\n" +
            "        t_menu m,\n" +
            "        t_roles_privileges r \n" +
            "    where\n" +
            "        m.use_yn = 1 \n" +
            "        and m.parent_id is null \n" +
            "        and r.menu_id = m.id \n" +
            "        and r.role_id in (\n" +
            "            select\n" +
            "                s.id \n" +
            "            from\n" +
            "                t_roles s,\n" +
            "                t_user_roles t,\n" +
            "                t_users p \n" +
            "            where\n" +
            "                t.role_id=s.id \n" +
            "                and p.id=t.user_id \n" +
            "                and p.USERNAME  =?1 \n" +
            "            GROUP BY\n" +
            "                s.id\n" +
            "        ) \n" +
            "    GROUP BY\n" +
            "        m.id\n" +
            ") order by me.ORDER_ID", nativeQuery = true)
    List<LutMenu> getUserMenu(String name);*/

    @Query(value="SELECT \n" +
            "    ME.* \n" +
            "FROM t_menu ME \n" +
            "INNER JOIN \n" +
            "(\n" +
            "    SELECT \n" +
            "        M.ID \n" +
            "    FROM\n" +
            "        t_menu M,\n" +
            "        t_roles_privileges R, \n" +
            "        t_roles S,\n" +
            "        t_user_roles T,\n" +
            "        t_users P \n" +
            "    WHERE\n" +
            "        M.USE_YN = 1 \n" +
            "        AND R.MENU_ID = M.ID \n" +
            "        AND T.ROLE_ID=S.ID \n" +
            "        AND P.ID=T.USER_ID \n" +
            "        AND P.USERNAME = ?1 \n" +
            "        AND R.ROLE_ID = S.ID \n" +
            "    GROUP BY \n" +
            "        M.ID \n" +
            ") T on ME.ID = T.ID \n" +
            "WHERE ME.USE_YN = 1 and ME.id in ?2 \n" +
            "ORDER BY ME.ORDER_ID", nativeQuery = true)
    List<Menu> getUserMenu(String name, List<Long> ids);

    @Query("from Menu t where t.useYn=1 order by t.orderId asc")
    List<Menu> findByOrderOrderIdAsc();

    @Transactional
    @Modifying
    @Query("update Menu t set t.pageType=?1 where t.parentId=?2")
    void updateChild(Long pageType, Long id);

    @Query("from Menu t where t.useYn = 1 and t.url=?1 order by t.orderId asc")
    Optional<Menu> findByCurrent(String current);
}
