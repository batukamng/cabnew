package com.mram.utils;

import java.util.List;

import com.mram.dao.MainDao;

import com.mram.model.cmmn.CommonCd;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class IpCheckUtils {

    @Autowired
    private MainDao dao;

    public boolean checkIp(String requestIp) {

        List<CommonCd> ips = (List<CommonCd>) dao.getHQLResult("from CommonCd t where t.grpCd='ip'", "list");

        if (ips != null && !ips.isEmpty()) {
            for (CommonCd ip : ips) {
                if (requestIp.startsWith(ip.getComCdNm())) {
                    return true;
                }
            }
        }
        return false;
    }
}
