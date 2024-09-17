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
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collection;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/nms/level/config")
public class SysLevelConfigController extends GenericController<LevelConfig> {
    public SysLevelConfigController(LevelConfigRepository repository) {
        super(repository);
    }

    @Autowired
    private MainDao dao;

    @Autowired
    private LevelConfigRepository repository;

    @Autowired
    private CommonCdRepository commonCdRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserLevelRepository levelRepository;

    @PostMapping("/submit")
    public LevelConfig submit(@RequestBody String jsonStr) throws JsonProcessingException {
        JSONObject obj=new JSONObject(jsonStr);
  /*      JSONArray typesArr=obj.getJSONArray("typesArr");
        JSONArray controlsArr=obj.getJSONArray("controlsArr");
        JSONArray levelsArr=obj.getJSONArray("levelsArr");
        obj.remove("typesArr");
        obj.remove("controlsArr");
        obj.remove("levelsArr");*/
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        LevelConfig item= objectMapper.readValue(obj.toString(), LevelConfig.class);

        Collection<CommonCd> types = new ArrayList<>();
        if(item.getTypesArr()!=null && !item.getTypesArr().isEmpty()){
            for (int i = 0; i < item.getTypesArr().size(); i++) {
                CommonCd adminRole = commonCdRepository.findById(item.getTypesArr().get(i)).orElseThrow(() -> new RuntimeException("Fail! -> Cause: CommonCd not find."));
                if(!types.contains(adminRole)){
                    types.add(adminRole);
                }
            }
            item.setTypes(types);
        }
        Collection<UserLevel> levels = new ArrayList<>();
        if(item.getLevelsArr()!=null && !item.getLevelsArr().isEmpty()){
            for (int i = 0; i < item.getLevelsArr().size(); i++) {
                UserLevel lvl = levelRepository.findById(item.getLevelsArr().get(i)).orElseThrow(() -> new RuntimeException("Fail! -> Cause: LutUserLevel not find."));
                if(!levels.contains(lvl)){
                    levels.add(lvl);
                }
            }
            item.setLevels(levels);
        }

        Collection<CommonCd> controls = new ArrayList<>();
        if(item.getControlsArr()!=null && !item.getControlsArr().isEmpty()){
            for (int i = 0; i < item.getControlsArr().size(); i++) {
                CommonCd adminRole = commonCdRepository.findById(item.getControlsArr().get(i)).orElseThrow(() -> new RuntimeException("Fail! -> Cause: CommonCd not find."));
                if(!controls.contains(adminRole)){
                    controls.add(adminRole);
                }
            }
            item.setControls(controls);
        }

        Collection<Role> roles = new ArrayList<>();
        if(item.getRolesArr()!=null && !item.getRolesArr().isEmpty()){
            for (int i = 0; i < item.getRolesArr().size(); i++) {
                Role adminRole = roleRepository.findById(item.getRolesArr().get(i)).orElseThrow(() -> new RuntimeException("Fail! -> Cause: CommonCd not find."));
                if(!roles.contains(adminRole)){
                    roles.add(adminRole);
                }
            }
            item.setRoles(roles);
        }

        repository.save(item);

/*        levelTypeRepository.deleteByLevelId(item.getId());
        requireRepository.deleteByLevelId(item.getId());
        subRepository.deleteByLevelId(item.getId());

        List<LutUserLevelType> levelTypes=new ArrayList<>();
        for(int i=0;i<arr.length();i++){
            JSONObject arrObj=arr.getJSONObject(i);
            JSONArray arrRoles=arrObj.getJSONArray("roleId");
            List<LutRole> roleArrayList=new ArrayList<>();
            LutUserLevelType level=new LutUserLevelType();
            level.setLevId(item.getId());
            level.setPosId(arrObj.getLong("posId"));
            for(int y=0;y<arrRoles.length();y++){
                roleArrayList.add(roleRepository.getReferenceById(Long.parseLong(arrRoles.get(y).toString())));
            }
            level.setRoles(roleArrayList);
            levelTypes.add(level);
        }
        levelTypeRepository.saveAll(levelTypes);

        List<LutUserLevelRequire> levelRequires=new ArrayList<>();
        for(int i=0;i<reqArr.length();i++){
            JSONObject arrObj=reqArr.getJSONObject(i);
            JSONArray arrRoles=arrObj.getJSONArray("reqId");
            List<CommonCd> roleArrayList=new ArrayList<>();
            LutUserLevelRequire level=new LutUserLevelRequire();
            level.setLevId(item.getId());
            level.setPosId(arrObj.getLong("posId"));
            for(int y=0;y<arrRoles.length();y++){
                roleArrayList.add(commonCdRepository.getReferenceById(Long.parseLong(arrRoles.get(y).toString())));
            }
            level.setRequires(roleArrayList);
            levelRequires.add(level);
        }
        requireRepository.saveAll(levelRequires);

        List<LutUserLevelSub> levelSubs=new ArrayList<>();
        for(int i=0;i<levelsArr.length();i++){
            JSONObject arrObj=levelsArr.getJSONObject(i);
            JSONArray arrRoles=arrObj.getJSONArray("lvlId");
            List<LutUserLevel> roleArrayList=new ArrayList<>();
            LutUserLevelSub level=new LutUserLevelSub();
            level.setLevId(item.getId());
            level.setPosId(arrObj.getLong("posId"));
            for(int y=0;y<arrRoles.length();y++){
                roleArrayList.add(repository.getReferenceById(Long.parseLong(arrRoles.get(y).toString())));
            }
            level.setLevels(roleArrayList);
            levelSubs.add(level);
        }
        subRepository.saveAll(levelSubs);*/

        return item;
    }

    // -------------------List by page -------------------------------------------
    @PostMapping("/list")
    public @ResponseBody
    DataSourceResult getList(@RequestBody DataSourceRequest request) throws JSONException, ClassNotFoundException {
        return dao.getList("view.LevelConfigView",request);
    }

}
