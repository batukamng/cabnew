package com.mram.controller.core;
import com.mram.dao.MainDao;
import com.mram.model.core.Menu;
import com.mram.model.core.Module;
import com.mram.model.core.Privilege;
import com.mram.model.audit.DataSourceRequest;
import com.mram.model.audit.DataSourceResult;
import com.mram.model.view.MenuView;
import com.mram.repository.core.MenuRepository;
import com.mram.repository.core.ModuleRepository;
import com.mram.repository.core.PrivilegeRepository;
import com.mram.service.core.PaginatedResult;
import com.mram.base.exception.ResourceNotFoundException;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/nms/menu")
public class SysMenuController {

    @Autowired
    MenuRepository menuRepository;

    @Autowired
    ModuleRepository moduleRepository;

    @Autowired
    PrivilegeRepository privilegeRepository;

    @Autowired
    private MainDao dao;

    @Autowired
    Services services;

    @PostMapping("/all/items")
    public List<Menu> retriveItems() {
        return menuRepository.findAll();
    }

    @GetMapping("/items")
    public List<Menu> getItems() {
        List<Menu> menus=menuRepository.findByOrderOrderIdAsc();
        List<Menu> reordered=new ArrayList<>();
        for(Menu menu:menus){
            if(menu.getParentId()==null){
                List<Menu> subs=new ArrayList<>();
                for(Menu sub:menus){
                    if(sub.getParentId()!=null && sub.getParentId().equals(menu.getId())){
                        subs.add(sub);
                    }
                }
                menu.setLutMenus(subs);
                reordered.add(menu);
            }
        }
        return reordered;
    }


    @PostMapping("/create")
    public Menu create(@RequestBody Menu item) {

        if(item.getParentId()!=null && item.getParentId() == 0){
            item.setParentId(null);
        }
       /* if(item.getParentId().equals(item.getId())){
            item.setParentId(null);
        }*/

        if(item.getParentId()!=null){
            Menu parent=menuRepository.getReferenceById(item.getParentId());
            parent.setUrl(null);
            menuRepository.save(parent);
         //   item.setPageType(parent.isPageType());
        }

        if(item.getModuleArr()!=null){
            List<Module> staffs=new ArrayList<>();
            for(int i=0;i<item.getModuleArr().size();i++){
                staffs.add(moduleRepository.getReferenceById(item.getModuleArr().get(i)));
            }
            item.setModules(staffs);
        }
        if(item.getPrivilegeArr()!=null){
            List<Privilege> staffs=new ArrayList<>();
            for(int i=0;i<item.getPrivilegeArr().size();i++){
                staffs.add(privilegeRepository.getReferenceById(item.getPrivilegeArr().get(i)));
            }
            item.setPrivileges(staffs);
        }
        if(item.getId()!=null){
            Menu mnu=menuRepository.getReferenceById(item.getId());
            if(mnu.getLutMenus()!=null){
                for(Menu child: mnu.getLutMenus()){
                    child.setPageType(item.getPageType());
                    menuRepository.save(child);
                }
            }
        }
        if(item.getParentId()==null){
            menuRepository.updateChild(item.getPageType(),item.getId());
        }
        return menuRepository.save(item);
    }

/*    @GetMapping(value = "/user")
    public List<LutMenuDto> user() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        List<LutMenu> items=services.getUserMenu(auth.getName());
        return items.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }*/

    @GetMapping("/item/{id}")
    public Menu getById(@PathVariable(value = "id") Long id) {
        return menuRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LutMenu", "id", id));
    }

    @PutMapping("/update")
    public Menu update(@RequestBody Menu noteDetails) {
       // LutMenu item =menuMapper.dtoToModel(noteDetails);
        noteDetails.setLutMenu(null);
        if(noteDetails.getParentId() != null && noteDetails.getParentId() == 0){
            noteDetails.setParentId(null);
        }
        return menuRepository.save(noteDetails);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> delete(@RequestBody Menu item) {
        menuRepository.delete(item);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/list")
    public ResponseEntity<?> getList(@RequestBody String jsonStr) throws JSONException {
        long totalCount=this.dao.getTotalPage(jsonStr, "Menu");
        List<Menu> newData = new ArrayList<>();
        List<Menu> data = (List<Menu>) this.dao.getListByPage(jsonStr, "Menu");
        if(data != null){
            for (Menu lutMenu : data) {
                if (lutMenu.getParentId() == null) {
                    lutMenu.setParentId((long) 0);
                }
                newData.add(lutMenu);
            }
        }
        return ResponseEntity.ok(new PaginatedResult().setData(newData).setCurrentPage(0).setTotal(totalCount));
    }

    @PostMapping("/data/list")
    public @ResponseBody
    DataSourceResult getList(@RequestBody DataSourceRequest request) throws JSONException, ClassNotFoundException {
        DataSourceResult dataSourceResult = dao.getList("view.MenuView",request);
        List<Menu> newData = new ArrayList<>();
        List<MenuView> data = (List<MenuView>) dataSourceResult.getData();
        if(data != null){
            for (int i=0; i<data.size(); i++) {
                MenuView lutMenu = data.get(i);
                if(lutMenu.getParentId() == null){
                    lutMenu.setParentId((long) 0);
                    data.set(i, lutMenu);
                }
            }
            dataSourceResult.setData(data);
        }
        return  dataSourceResult;
    }
}
