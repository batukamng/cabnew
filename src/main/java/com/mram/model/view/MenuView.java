package com.mram.model.view;


import com.mram.base.entity.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

import jakarta.persistence.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Immutable
@Subselect("SELECT va.* FROM v_menu va")
public class MenuView extends BaseEntity{

    @Id
    private Long id;
    private static final long serialVersionUID = 1L;
    private String name;
    private Long parentId,allModule, guideFileId;
    private int pageType;
//    ,main,allModule=false
    private String url;
    @Column(name = "u_icon")
    private String icon;
    private String langKey;
    private int orderId,childCnt;
    private String moduleName,moduleIds,privilegeName,privilegeIds, videoUrl;

}