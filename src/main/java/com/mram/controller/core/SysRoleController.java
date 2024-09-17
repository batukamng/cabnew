package com.mram.controller.core;

import com.mram.base.controller.GenericController;
import com.mram.dao.MainDao;
import com.mram.model.audit.DataSourceRequest;
import com.mram.model.audit.DataSourceResult;
import com.mram.model.core.Role;
import com.mram.model.core.RolePrivilege;
import com.mram.repository.core.*;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/nms/role")
public class SysRoleController extends GenericController<Role> {

    public SysRoleController(RoleRepository repository) {
        super(repository);
    }

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    MenuRepository menuRepository;

    @Autowired
    PrivilegeRepository privilegeRepository;

    @Autowired
    RolePrivilegeRepository rolePrivilegeRepository;

    @Autowired
    private MainDao dao;

    @PostMapping("/submit")
    public Role submit(@RequestBody String str) throws Exception {
        System.out.println("@@" + str);
        JSONObject obj = new JSONObject(str);
        Role item;
        if (obj.has("id")) {
            item = roleRepository.getReferenceById(obj.getLong("id"));
            rolePrivilegeRepository.deleteByRoleId(obj.getLong("id"));
        } else {
            item = new Role();
        }
        item.setAuth(obj.getString("auth"));
        item.setName(obj.getString("name"));
        item.setUseYn(obj.getInt("useYn"));
        roleRepository.save(item);

        List<RolePrivilege> privileges = new ArrayList<>();
        if(obj.has("rolePrivileges") && !obj.getJSONArray("rolePrivileges").isEmpty()){
            JSONArray arr=obj.getJSONArray("rolePrivileges");
            for(int i=0;i<arr.length();i++){
                JSONObject object= arr.getJSONObject(i);
                RolePrivilege privilege = new RolePrivilege();
                privilege.setMenuId(object.getLong("menuId"));
                privilege.setPrivilegeId(object.getLong("privilegeId"));
                privilege.setRoleId(item.getId());
                privilege.setUseYn(item.getUseYn());
                privileges.add(privilege);
                rolePrivilegeRepository.save(privilege);
            }
            item.setRolePrivileges(privileges);
        }
        return item;
    }

    @GetMapping("/item/{id}")
    public Optional<Role> getById(@PathVariable(value = "id") Long id) {
        return roleRepository.findById(id);
    }

    // -------------------List by page -------------------------------------------
    @PostMapping("/list")
    public @ResponseBody
    DataSourceResult getList(@RequestBody DataSourceRequest request) throws JSONException, ClassNotFoundException {
        return dao.getList("core.Role",request);
    }

}
