package com.mram.model.view.cab;

import com.mram.base.entity.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Immutable
@Subselect("SELECT\n" +
        "\te.*,(\n" +
        "\tSELECT\n" +
        "\t\tgroup_concat( tr.NAME SEPARATOR ',' ) \n" +
        "\tFROM\n" +
        "\t\t(\n" +
        "\t\t\tv_user tr\n" +
        "\t\t\tLEFT JOIN tbl_team_users tur ON (((\n" +
        "\t\t\t\t\t\ttr.id = tur.user_id \n" +
        "\t\t\t\t\t\t) ))) \n" +
        "\tWHERE\n" +
        "\t\t( tur.team_id = e.id ) \n" +
        "\tGROUP BY\n" +
        "\t\ttur.team_id \n" +
        "\t\t) AS user_names,(\n" +
        "\tSELECT\n" +
        "\t\tgroup_concat( tur.user_id SEPARATOR ',' ) \n" +
        "\tFROM\n" +
        "\t\t( tbl_team_users tur ) \n" +
        "\tWHERE\n" +
        "\t\t( tur.team_id = e.id ) \n" +
        "\tGROUP BY\n" +
        "\t\ttur.team_id \n" +
        "\t) AS user_ids \n" +
        "FROM\n" +
        "\ttbl_team e")
public class CabTeamView extends BaseEntity {
    @Id
    private Long id;
    private Long orgId;
    private String title,userNames,userIds;

}