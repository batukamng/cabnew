package com.mram.model.view;

import com.mram.base.entity.BaseEntity;
import com.mram.base.entity.GenericEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Immutable
@Subselect("SELECT va.* FROM v_splash va")
public class SplashView extends BaseEntity implements GenericEntity<SplashView> {
    @Id
    private Long id;
    private Long fileId;
    private boolean flag;
    private String code,bannerType,description,title,url,fileUrl,fileType;

    @Override
    public void update(SplashView source) {
        this.code=source.code;
    }

    @Override
    public SplashView createNewInstance() {
        SplashView newInstance = new SplashView();
        newInstance.update(this);
        return newInstance;
    }
}