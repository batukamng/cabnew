package com.mram.model.view;

import com.mram.base.entity.BaseEntity;
import com.mram.base.entity.GenericEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;


@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Immutable
@Subselect("SELECT va.* FROM v_as_cd va")
public class AsCdView extends BaseEntity implements GenericEntity<AsCdView> {
    @Id
    private Long id;
    private String asCd;
    private String staCode;
    private String cdNm;
    private Long parentId;
    private String url;

    @Override
    public void update(AsCdView source) {
        this.asCd=source.asCd;
    }

    @Override
    public AsCdView createNewInstance() {
        AsCdView newInstance = new AsCdView();
        newInstance.update(this);
        return newInstance;
    }
}