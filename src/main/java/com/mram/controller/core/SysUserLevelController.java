package com.mram.controller.core;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.mram.base.controller.GenericController;
import com.mram.dao.MainDao;
import com.mram.model.audit.DataSourceRequest;
import com.mram.model.audit.DataSourceResult;
import com.mram.model.cmmn.CommonCd;
import com.mram.model.core.*;
import com.mram.repository.cmmn.CommonCdRepository;
import com.mram.repository.core.*;
import com.mram.service.core.AuthService;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/nms/user/level")
public class SysUserLevelController extends GenericController<UserLevel> {
    public SysUserLevelController(UserLevelRepository repository) {
        super(repository);
    }

    @Autowired
    private MainDao dao;

    @Autowired
    private UserLevelRepository repository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private CommonCdRepository commonCdRepository;

    @Autowired
    private UserLevelRequireRepository requireRepository;

    @Autowired
    private UserLevelSubRepository subRepository;

    @Autowired
    private UserLevelTypeRepository levelTypeRepository;

    @Autowired
    private AuthService authService;

    @GetMapping("/related/{id}/{posId}")
    public ResponseEntity<?>  getRelated(@PathVariable Long id,@PathVariable Long posId){
        UserLevel userLevel= repository.getReferenceById(authService.getCurrentUser().getLvlId());
     //   Optional<UserLevel> item= repository.findById(id);
        JSONObject obj=new JSONObject();
        JSONArray requires=new JSONArray();

        for(UserLevelRequire sub:userLevel.getLevelRequires()){
            if(sub.getPosId().equals(posId)){
                for(CommonCd commonCd:sub.getRequires()){
                    JSONObject rObj=new JSONObject();
                    rObj.put("id",commonCd.getId());
                    rObj.put("comCdNm",commonCd.getComCdNm());
                    rObj.put("comCd",commonCd.getComCd());
                    rObj.put("shortCd",commonCd.getShortCd());
                    rObj.put("grpCd",commonCd.getGrpCd());
                    requires.put(rObj);
                }
            }
        }
        JSONArray roles=new JSONArray();
        for(UserLevelType sub:userLevel.getLevelTypes()){
            if(sub.getPosId().equals(posId)){
                for(Role role:sub.getRoles()){
                    JSONObject rObj=new JSONObject();
                    rObj.put("id",role.getId());
                    rObj.put("name",role.getName());
                    roles.put(rObj);
                }
            }
        }
        obj.put("requires",requires);
        obj.put("roles",roles);

        return ResponseEntity.ok().body(obj.toString());
    }

    @GetMapping("/sub/{id}")
    public Collection<UserLevel> getSubItems(@PathVariable Long id) {
        Optional<UserLevel> item= repository.findById(id);
        if(item.isPresent()){
            StringBuilder ids= new StringBuilder();
            for(UserLevelSub sub:item.get().getLevelSubs()){
                for(UserLevel child:sub.getLevels()){
                    ids.append(",").append(child.getId());
                }
            }
            if(!ids.isEmpty()){
                return (Collection<UserLevel>) dao.getHQLResult("from UserLevelView t where t.id in ("+ids.substring(1)+") ","list");
            }
            else{
                return new ArrayList<>();
            }
        } else{
            return new ArrayList<>();
        }
    }

    @GetMapping("/pos/{id}")
    public ResponseEntity<?> getPosition(@PathVariable Long id) {
       // UserLevel userLevel= repository.getReferenceById(id);
        JSONArray requires=new JSONArray();
        UserLevel userLevel= authService.getCurrentUser().getLevel();

        for(UserLevelSub sub:userLevel.getLevelSubs()){
            for(UserLevel level:sub.getLevels()){
                if(level.getId().equals(id)){
                    JSONObject rObj=new JSONObject();
                    rObj.put("id",sub.getPosition().getId());
                    rObj.put("comCdNm",sub.getPosition().getComCdNm());
                    rObj.put("comCd",sub.getPosition().getComCd());
                    rObj.put("shortCd",sub.getPosition().getShortCd());
                    rObj.put("grpCd",sub.getPosition().getGrpCd());
                    requires.put(rObj);
                }
            }
        }
        return ResponseEntity.ok().body(requires.toString());
    }

    @PostMapping("/submit")
    public UserLevel submit(@RequestBody String jsonStr) throws JsonProcessingException {
        JSONObject obj=new JSONObject(jsonStr);
        JSONArray arr=obj.getJSONArray("rolesArr");
        JSONArray reqArr=obj.getJSONArray("reqArr");
        JSONArray levelsArr=obj.getJSONArray("levelsArr");
        obj.remove("rolesArr");
        obj.remove("reqArr");
        obj.remove("levelsArr");
        obj.remove("level");
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        UserLevel item= objectMapper.readValue(obj.toString(), UserLevel.class);

        List<Role> roles = new ArrayList<>();
        if(item.getRolesArr()!=null && !item.getRolesArr().isEmpty()){
            for (int i = 0; i < item.getRolesArr().size(); i++) {
                Role adminRole = roleRepository.findById(item.getRolesArr().get(i)).orElseThrow(() -> new RuntimeException("Fail! -> Cause: LutRole not find."));
                if(!roles.contains(adminRole)){
                    roles.add(adminRole);
                }
            }
            item.setRoles(roles);
        }
       /* Collection<UserLevel> levels = new ArrayList<>();
        if(item.getLevelsArr()!=null && item.getLevelsArr().size()>0){
            for (int i = 0; i < item.getLevelsArr().size(); i++) {
                UserLevel lvl = repository.findById(item.getLevelsArr().get(i)).orElseThrow(() -> new RuntimeException("Fail! -> Cause: LutUserLevel not find."));
                if(!levels.contains(lvl)){
                    levels.add(lvl);
                }
            }
            item.setLevels(levels);
        }*/
        repository.save(item);

        levelTypeRepository.deleteByLevelId(item.getId());
        requireRepository.deleteByLevelId(item.getId());
        subRepository.deleteByLevelId(item.getId());

        List<UserLevelType> levelTypes=new ArrayList<>();
        for(int i=0;i<arr.length();i++){
            JSONObject arrObj=arr.getJSONObject(i);
            JSONArray arrRoles=arrObj.getJSONArray("roleId");
            List<Role> roleArrayList=new ArrayList<>();
            UserLevelType level=new UserLevelType();
            level.setLevId(item.getId());
            level.setPosId(arrObj.getLong("posId"));
            for(int y=0;y<arrRoles.length();y++){
                roleArrayList.add(roleRepository.getReferenceById(Long.parseLong(arrRoles.get(y).toString())));
            }
            level.setRoles(roleArrayList);
            levelTypes.add(level);
        }
        levelTypeRepository.saveAll(levelTypes);

        List<UserLevelRequire> levelRequires=new ArrayList<>();
        for(int i=0;i<reqArr.length();i++){
            JSONObject arrObj=reqArr.getJSONObject(i);
            JSONArray arrRoles=arrObj.getJSONArray("reqId");
            List<CommonCd> roleArrayList=new ArrayList<>();
            UserLevelRequire level=new UserLevelRequire();
            level.setLevId(item.getId());
            level.setPosId(arrObj.getLong("posId"));
            for(int y=0;y<arrRoles.length();y++){
                roleArrayList.add(commonCdRepository.getReferenceById(Long.parseLong(arrRoles.get(y).toString())));
            }
            level.setRequires(roleArrayList);
            levelRequires.add(level);
        }
        requireRepository.saveAll(levelRequires);

        List<UserLevelSub> levelSubs=new ArrayList<>();
        for(int i=0;i<levelsArr.length();i++){
            JSONObject arrObj=levelsArr.getJSONObject(i);
            JSONArray arrRoles=arrObj.getJSONArray("lvlId");
            List<UserLevel> roleArrayList=new ArrayList<>();
            UserLevelSub level=new UserLevelSub();
            level.setLevId(item.getId());
            level.setPosId(arrObj.getLong("posId"));
            for(int y=0;y<arrRoles.length();y++){
                roleArrayList.add(repository.getReferenceById(Long.parseLong(arrRoles.get(y).toString())));
            }
            level.setLevels(roleArrayList);
            levelSubs.add(level);
        }
        subRepository.saveAll(levelSubs);

        return item;
    }

    // -------------------List by page -------------------------------------------
    @PostMapping("/list")
    public @ResponseBody
    DataSourceResult getList(@RequestBody DataSourceRequest request) throws JSONException, ClassNotFoundException {
        return dao.getList("core.UserLevel",request);
    }

    @PostMapping("/setInactive")
    public UserLevel setInactive(@RequestBody UserLevel lutUserLevel) throws JsonProcessingException {
        lutUserLevel.setUseYn(0);
        service.update(lutUserLevel);
        return null;
    }
}
