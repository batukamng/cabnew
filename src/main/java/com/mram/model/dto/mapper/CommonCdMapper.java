package com.mram.model.dto.mapper;

import com.mram.model.cmmn.CommonCd;
import com.mram.model.dto.CommonCdDto;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CommonCdMapper {

    CommonCdMapper INSTANCE = Mappers.getMapper(CommonCdMapper.class);

    @Mapping(target="id", source="item.id")
    @Mapping(target="name", source="item.comCdNm")
    CommonCdDto modelToDto(CommonCd item);

    List<CommonCdDto> modelsToDtos(List<CommonCd> items);

    @InheritInverseConfiguration
    CommonCd dtoToModel(CommonCdDto dto);
}
