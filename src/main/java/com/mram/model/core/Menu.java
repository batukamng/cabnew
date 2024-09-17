package com.mram.model.core;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mram.base.entity.BaseEntity;
import com.mram.base.entity.GenericEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.*;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "t_menu")
public class Menu extends BaseEntity implements GenericEntity<Menu> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", unique = true, nullable = false)
    private Long id;
    private static final long serialVersionUID = 1L;
    private String name;
    private Long parentId;
    private Long pageType,main,allModule;
    private String url;
    @Column(name = "u_icon")
    private String icon;
    private String langKey;
    private String videoUrl;
    private Long guideFileId;
    private int orderId;

    @ManyToOne(fetch = FetchType.LAZY)
    @OrderBy("orderId")
   // @JsonIgnoreProperties(value = {"lutMenus","modDtm","regDtm"})
    @JsonIgnore
    @JoinColumn(name = "parentId",referencedColumnName="id",nullable = false,insertable=false,updatable=false)
    private Menu lutMenu;


    @Transient
    private List<Menu> lutMenus;
/*    @OneToMany(mappedBy="lutMenu", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @OrderBy("orderId")
    @Where(clause = "use_yn=1")
    @JsonIgnoreProperties(value = {"lutMenu"})
    private List<LutMenu> lutMenus;*/


    @Transient
    private List<Long> privilegeArr;
    @Transient
    private List<Long> moduleArr;

    @ManyToMany
    @JoinTable(name = "t_menu_privilege", joinColumns = @JoinColumn(name = "menu_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "privilege_id", referencedColumnName = "id"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnoreProperties(value = "icon")
    private List<Privilege> privileges;

    @ManyToMany
    @JoinTable(name = "t_menu_module", joinColumns = @JoinColumn(name = "menu_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "module_id", referencedColumnName = "id"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnoreProperties(value = "icon")
    private List<Module> modules;

    @Override
    public void update(Menu source) {
        this.name=source.name;
        this.parentId=source.parentId;
        this.url=source.url;
        this.videoUrl=source.videoUrl;
        this.guideFileId=source.guideFileId;
        this.icon=source.icon;
        this.allModule=source.allModule;
        this.langKey=source.langKey;
        this.orderId=source.orderId;
        this.pageType=source.pageType;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public Menu createNewInstance() {
        Menu newInstance = new Menu();
        newInstance.update(this);
        return newInstance;
    }
}
