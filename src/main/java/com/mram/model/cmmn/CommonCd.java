package com.mram.model.cmmn;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mram.base.entity.BaseEntity;
import com.mram.base.entity.GenericEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "t_cmn_com_cd")
public class CommonCd extends BaseEntity implements GenericEntity<CommonCd> {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name="id", unique = true, nullable = false)
  private Long id;
  private String grpCd;
  private String comCd;
  private String shortCd;
  private String comCdNm;
  private String comCdEn;
  private Long parentId;
  private int orderId;

  @ManyToOne(fetch = FetchType.LAZY)
  @OrderBy("orderId")
  @JsonIgnore
  @JoinColumn(name = "parentId", referencedColumnName = "id", nullable = false, insertable = false, updatable = false)
  private CommonCd lutComCd;

/*  @OneToMany(mappedBy = "lutComCd", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
  @OrderBy("orderId")
  @JsonIgnore
  private List<CommonCd> lutComCds;*/

/*  @ManyToMany
  @JoinTable(name = "NMS_COM_CD_RELATED", joinColumns = @JoinColumn(name = "com_id", referencedColumnName = "id"), inverseJoinColumns = @JoinColumn(name = "rel_id", referencedColumnName = "id"))
  @OrderBy(value = "orderId ASC")
  @OnDelete(action = OnDeleteAction.CASCADE)
  private Collection<CommonCd> related;*/

  @Override
  public void update(CommonCd source) {
    this.grpCd=source.grpCd;
    this.comCd=source.comCd;
    this.shortCd=source.shortCd;
    this.comCdNm=source.comCdNm;
    this.comCdEn=source.comCdEn;
    this.parentId=source.parentId;
    this.orderId=source.orderId;
   // this.related=source.related;
    this.setUseYn(source.getUseYn());
  }

  @Override
  public CommonCd createNewInstance() {
    CommonCd newInstance = new CommonCd();
    newInstance.update(this);
    return newInstance;
  }

}
