package com.mram.model.dto;

import com.mram.model.core.Menu;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface MenuMapper {
    MenuMapper INSTANCE = Mappers.getMapper(MenuMapper.class);
    //@Mapping(target="employeeId", source="entity.id")
   // @Mapping(target="employeeName", source=
    //     AppMapper INSTANCE = Mappers.getMapper(AppMapper.class);
    //     "entity.name")
    LutMenuDto menuToMenuDTO(Menu entity);

   // LutMenuDto modelToDto(LutMenu item);

        @InheritInverseConfiguration
        Menu dtoToModel(LutMenuDto commerceDto);
}
