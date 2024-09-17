package com.mram.model.dto;

import com.mram.model.core.Module;
import lombok.Data;

import java.util.List;

@Data
public class LutMenuDto {

    private Long id;
    private String name;
    private Long parentId;
    private Long pageType,main,allModule;
    private String url;
    private String icon;
    private String langKey;
    private int orderId;

  //  private LutMenu lutMenu;
    private List<LutMenuDto> lutMenus;
   // private List<LutPrivilege> privileges;
    private List<Module> modules;

}
