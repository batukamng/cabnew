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
@Subselect("SELECT va.* FROM v_category va")
public class CategoryView extends BaseEntity implements GenericEntity<CategoryView> {
    @Id
    private Long id;
    private Long fileId;
    private String code,name,description,imageUrl,imageName,imageType;

    @Override
    public void update(CategoryView source) {
        this.code=source.code;
    }

    @Override
    public CategoryView createNewInstance() {
        CategoryView newInstance = new CategoryView();
        newInstance.update(this);
        return newInstance;
    }
}