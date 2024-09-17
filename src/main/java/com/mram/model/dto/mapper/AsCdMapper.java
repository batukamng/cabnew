package com.mram.model.dto.mapper;

import com.mram.model.cmmn.AsCd;
import com.mram.model.dto.AsCdDto;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AsCdMapper {

    AsCdMapper INSTANCE = Mappers.getMapper(AsCdMapper.class);

    @Mapping(target="id", source="item.id")
    @Mapping(target="name", source="item.cdNm")
    @Mapping(target="asCd", source="item.asCd")
    AsCdDto modelToDto(AsCd item);

    List<AsCdDto> modelsToDtos(List<AsCd> items);

    @InheritInverseConfiguration
    AsCd dtoToModel(AsCdDto dto);
}
