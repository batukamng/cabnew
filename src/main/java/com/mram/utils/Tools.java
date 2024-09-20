package com.mram.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mram.model.audit.DataSourceRequest;
import com.mram.service.core.Services;
import jakarta.validation.constraints.NotNull;
import org.json.JSONObject;

import java.io.*;
import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.Charset;
import java.sql.Timestamp;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

import static java.time.temporal.ChronoUnit.DAYS;

public class Tools {
    public static final String EXCEPTION_KEY = "_EX:";
    public static final String EXCEPTION_KEY_NOT_SHOW = "_EX_NOT_SHOW:";

    public static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
    public static final SimpleDateFormat dateFormatInv = new SimpleDateFormat("yyyyMMdd");
    public static final SimpleDateFormat dateFormatTxn = new SimpleDateFormat("yyyy-MM-dd");

    public static boolean isNullOrZero(Long value) {
        return value == null || value.equals(0L);
    }

    public static boolean isNullOrEmptyList(List<?> listAny) {
        return listAny == null || listAny.isEmpty();
    }

    public static boolean isNullOrEmpty(Object value) {
        return value == null || convertToStringLower(value) == "" || convertToStringLower(value).equals("null");
    }

    public static boolean compareValue(Object value_first, Object value_second) {
        return convertToStringLower(value_first).equals(convertToStringLower(value_second));
    }

    public static boolean compareValueNoSpace(Object value_first, Object value_second) {
        return convertToStringLower(value_first).trim().equals(convertToStringLower(value_second).trim());
    }

    public static boolean compareNumber(Long value_first, Long value_second) {
        return convertToLong(value_first).equals(convertToLong(value_second));
    }

    public static boolean compareDecimal(BigDecimal value_first, BigDecimal value_second) {
        return convertToDecimal(value_first).compareTo(convertToDecimal(value_second)) == 0;
    }

    public static boolean containsValue(Object value_first, Object value_second) {
        return convertToStringLower(value_first).toLowerCase()
                .contains(convertToStringLower(value_second).toLowerCase());
    }

    public static boolean containsValueNoSpace(Object value_first, Object value_second) {
        return convertToStringLower(value_first).toLowerCase().replace(" ", "")
                .contains(convertToStringLower(value_second).toLowerCase().replace(" ", ""));
    }

    public static int indexOfValue(String source, String target) {
        return convertToStringLower(source).indexOf(convertToStringLower(target));
    }

    public static boolean startsWith(String source, String target) {
        return convertToStringLower(source).startsWith(convertToStringLower(target));
    }

    public static boolean endsWith(String source, String target) {
        return convertToStringLower(source).endsWith(convertToStringLower(target));
    }

    public static String convertToStringLower(Object value) {
        return convertToString(value).toLowerCase();
    }

    public static String convertToStringUpper(Object value) {
        return convertToString(value).toUpperCase();
    }

    public static String convertToString(Object value) {
        return value == null ? "" : value.toString();
    }

    public static String convertToNullString(Object value) {
        return isNullOrEmpty(value) ? "null" : value.toString();
    }

    public static Long convertToLong(Object value) {
        return Tools.isNullOrEmpty(value) ? 0L : Long.parseLong(convertToString(value));
    }

    public static Integer convertToInteger(Object value) {
        return value == null ? 0 : Integer.parseInt(convertToString(value));
    }

    public static boolean containsValue(Field[] fields, String columnName) {
        return Arrays.stream(fields).filter(it -> Tools.compareValue(it.getName(), columnName)).count() > 0;
    }

    public static boolean isNullOrZero(Object object) {
        return convertToDecimal(object).compareTo(BigDecimal.ZERO) == 0;
    }

    public static BigDecimal convertToDecimal(Object value) {
        return convertToDecimal(value, false);
    }

    public static BigDecimal convertToDecimal(Object value, boolean isFullRound) {

        if (isNullOrEmpty(value)) {
            return BigDecimal.ZERO;
        }
        BigDecimal val = BigDecimal.ZERO;

        try {
            val = (new BigDecimal(value.toString())).setScale(isFullRound ? 0 : 2, RoundingMode.HALF_UP);
        } catch (Exception ex) {
            return val;
        }
        return val;
    }

    public static Double convertToDouble(Object value) {
        return value == null ? 0 : Double.parseDouble(convertToString(value));
    }

    public static boolean checkRange(Object value, Object start_range, Object end_range) {
        return convertToDecimal(value).compareTo(convertToDecimal(start_range)) > 0
                && convertToDecimal(value).compareTo(convertToDecimal(end_range)) <= 0;
    }

    public static byte[] readFileToByteArray(File file) {
        FileInputStream fis = null;
        byte[] bArray = new byte[(int) file.length()];
        try {
            fis = new FileInputStream(file);
            fis.read(bArray);

        } catch (IOException ioExp) {
            return bArray;
        } finally {
            try {
                fis.close();
            } catch (IOException e) {
                return bArray;
            }
        }
        return bArray;
    }

    public static void WriteToFile(String fileContent, String fileName) throws IOException {
        String projectPath = System.getProperty("user.dir");
        String tempFile = projectPath + File.separator + fileName;
        File file = new File(tempFile);
        // if file does exists, then delete and create a new file
        if (file.exists()) {
            try {
                File newFileName = new File(projectPath + File.separator + "backup_" + fileName);
                file.renameTo(newFileName);
                file.createNewFile();
            } catch (IOException e) {
                tempFile = "";
            }
        }
        // write to file with OutputStreamWriter
        OutputStream outputStream = new FileOutputStream(file.getAbsoluteFile());

        Writer writer = new OutputStreamWriter(outputStream, "UTF-8");
        writer.write(fileContent);
        writer.close();
        outputStream.close();
    }

    public static String convertToDateFormat(Date date, SimpleDateFormat dateFormat) {
        String dateStr = "";
        try {
            dateStr = dateFormat.format(date);
        } catch (Exception ex) {
            return dateStr;
        }
        return dateStr;
    }

    public static Date convertToDate(String dateStr) {
        Date convertedDate = null;
        try {
            convertedDate = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss").parse(dateStr);
        } catch (Exception ex) {
            return convertedDate;
        }
        return convertedDate;
    }

    public static Date convertToDate(String dateStr, SimpleDateFormat dateFormat) {
        Date convertedDate = null;
        try {
            convertedDate = dateFormat.parse(dateStr);
        } catch (Exception ex) {
            return convertedDate;
        }
        return convertedDate;
    }

    public static Date convertToDateNoTime(String dateStr) {
        Date convertedDate = null;
        try {
            convertedDate = new SimpleDateFormat("yyyy-MM-dd").parse(dateStr);
        } catch (Exception ex) {
            return convertedDate;
        }
        return convertedDate;
    }

    public static String convertToJson(Object object) {
        ObjectMapper mapper = new ObjectMapper();
        String json = null;
        try {
            json = mapper.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            return json;
        }
        return json;
    }

    // FULLNAME
    public static String getFullName(String firstName, String lastName) {
        String fullName = "";
        if (!getFirstLetter(lastName).isEmpty()) {
            fullName += getFirstLetter(lastName) + ".";
        }
        return fullName + getFirstLetter(firstName) + getSubstring(firstName);
    }

    public static String getFirstLetter(String value) {
        return value == null || value.isEmpty() ? "" : value.substring(0, 1).toUpperCase();
    }

    public static String getSubstring(String value) {
        return value == null || value.isEmpty() ? "" : value.substring(1).toLowerCase();
    }

    public static String getBigName(String name) {
        return getFirstLetter(name) + getSubstring(name);
    }

    public static String convertToNumberString(Object value) {
        DecimalFormat formatter = new DecimalFormat("#,###.00");
        return formatter.format(Tools.convertToDecimal(value));
    }

    public static String getMonthStr(Long month) {
        if (month < 10L) {
            return "0" + Tools.convertToString(month);
        }
        return Tools.convertToString(month);
    }

    public static String getMinDots(String object) {
        return object == null || object.isEmpty() ? "......" : object;
    }

    public static String joinString(String delimeter, Object... elems) {
        String joinedStr = "";
        for (int i = 0; i < elems.length; ++i) {
            if (elems[i] == null)
                continue;
            boolean isLastElement = (elems.length - 1) == i;
            if (elems[i] instanceof String) {
                joinedStr += Tools.convertToString(elems[i]) + (isLastElement ? "" : delimeter);
            }
        }

        return joinedStr;
    }

    public static BigDecimal add(Object... elems) {
        BigDecimal sumVal = BigDecimal.ZERO;
        for (int i = 0; i < elems.length; ++i) {
            if (elems[i] == null)
                continue;
            if (elems[i] instanceof BigDecimal) {
                sumVal.add(Tools.convertToDecimal(elems[i]));
            }
        }
        return sumVal;
    }

    public static int getCharLength(String value) {
        Charset UTF8_CHARSET = Charset.forName("UTF-8");
        byte[] abc = Tools.convertToString(value).getBytes(UTF8_CHARSET);
        return abc.length;
    }

    public static boolean isNumeric(String strNum) {
        if (strNum == null) {
            return false;
        }
        try {
            double d = Double.parseDouble(strNum);
        } catch (NumberFormatException nfe) {

            return false;
        }
        return true;
    }

    public static Date getCalcDate(Long year, Long month) {
        Calendar calcDate = Calendar.getInstance();
        calcDate.set(Calendar.YEAR, year.intValue());
        calcDate.set(Calendar.MONTH, month.intValue() + 1);
        return calcDate.getTime();
    }

    public static Date setZeroTimeDate(Date date) {
        Calendar calcDate = Calendar.getInstance();
        calcDate.setTime(date);
        calcDate.set(Calendar.HOUR, 0);
        calcDate.set(Calendar.MINUTE, 0);
        calcDate.set(Calendar.SECOND, 0);
        return calcDate.getTime();
    }

    public static Date parseToDate(String dateStr) {
        Date convertedDate = null;
        try {
            convertedDate = new SimpleDateFormat("yyyy-MM-dd").parse(dateStr);
        } catch (Exception ex) {
            return convertedDate;
        }
        return convertedDate;
    }

    public static String fillByLeadingZeros(String number, int length) {
        String str = "" + number;
        while (str.length() < length) {
            str = '0' + str;
        }
        return str;
    }

    public static Long convertModule(Long value) {
        return value >= 0 ? value : value + (value * 2);
    }

    public static String randomStringBylength(int length) {
        int leftLimit = 48; // numeral '0'
        int rightLimit = 122; // letter 'z'
        int targetStringLength = length;
        Random random = new Random();

        String generatedString = random.ints(leftLimit, rightLimit + 1)
                .filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97))
                .limit(targetStringLength)
                .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                .toString();

        return generatedString;
    }

    public static String fillByLeadingZeros(Long sequenceNumber, int digit) {
        return String.format("%0" + digit + "d", sequenceNumber);
    }

    public static String convertToStringNoSpace(String value) {
        return convertToString(value).replace(" ", "");
    }

    // @NotNull
    // public static String[] getIgnoreProperties() {
    // return new String[]{"id", "updatedDate", "createdDate", "updatedBy",
    // "createdBy", "status"};
    // }

    public static long negateLong(Long value) {
        return value * (-1);
    }

    public static long getBetweenDays(Date dateAfter, Date dateBefore) {
        LocalDate lDateAfter = convertToLocalDateViaInstant(dateAfter);
        LocalDate lDateBefore = convertToLocalDateViaInstant(dateBefore);
        long daysBetween = DAYS.between(lDateBefore, lDateAfter);
        return daysBetween;
    }

    public static Date addDays(Date date, int days) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.DATE, days); // minus number would decrement the days
        return cal.getTime();
    }


    public static int getYear(Timestamp date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        return calendar.get(1);
    }

    public static int getMonth(Timestamp date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        return calendar.get(2) + 1;
    }

    public static int getDay(Timestamp date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        return calendar.get(5);
    }

    @NotNull
    public static String[] getIgnoreProperties() {
        return new String[] { "id", "updatedDate", "createdDate", "updatedBy", "createdBy", "useYn" };
    }

    public static DataSourceRequest.FilterDescriptor getFilter(DataSourceRequest request, Services services) {
        DataSourceRequest.FilterDescriptor filter = new DataSourceRequest.FilterDescriptor();

        if (request.getCustom().getFilters() != null) {
            for (int i = 0; i < request.getCustom().getFilters().size(); i++)
                services.addFilter(filter, request.getCustom().getFilters().get(i).getField(),
                        request.getCustom().getFilters().get(i).getOperator(),
                        request.getCustom().getFilters().get(i).getValue(), 1L);
        }

        if (request.getFilter().getFilters() != null) {
            for (int i = 0; i < request.getFilter().getFilters().size(); i++)
                services.addFilter(filter, request.getFilter().getFilters().get(i).getField(),
                        request.getFilter().getFilters().get(i).getOperator(),
                        request.getFilter().getFilters().get(i).getValue(), 1L);
        }

        return filter;
    }

    public static boolean jsonHasType(JSONObject obj, String key) {
        return obj.has(key) && obj.get(key) != null;
    }
}