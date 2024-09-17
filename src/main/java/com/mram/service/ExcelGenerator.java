/*
package com.mram.service;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.lang.reflect.Field;
import java.util.Calendar;
import java.util.List;
import java.util.Map;

@Service
public class ExcelGenerator {


    public ByteArrayInputStream appsToNegtgelExcel(List<?> apps) throws IOException {
        Calendar cal = Calendar.getInstance();
        int year = cal.get(Calendar.YEAR);

        ByteArrayOutputStream out;
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            out = new ByteArrayOutputStream();
            CreationHelper createHelper = workbook.getCreationHelper();

            Sheet sheet = workbook.createSheet("Apps");

            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.BLACK.getIndex());
            CellStyle headerCellStyle = workbook.createCellStyle();
            headerCellStyle.setFont(headerFont);
            headerCellStyle.setLocked(true);
            headerCellStyle.setWrapText(true);
            headerCellStyle.setAlignment(HorizontalAlignment.CENTER);
            headerCellStyle.setVerticalAlignment(VerticalAlignment.DISTRIBUTED);
            headerCellStyle.setBorderBottom(BorderStyle.THIN);
            headerCellStyle.setBorderTop(BorderStyle.THIN);
            headerCellStyle.setBorderRight(BorderStyle.THIN);
            headerCellStyle.setBorderLeft(BorderStyle.THIN);

            Font mergeFont = workbook.createFont();
            mergeFont.setBold(true);
            mergeFont.setColor(IndexedColors.PLUM.getIndex());

            CellStyle mergeCellStyle = workbook.createCellStyle();
            mergeCellStyle.setFont(mergeFont);
            mergeCellStyle.setLocked(true);
            mergeCellStyle.setAlignment(HorizontalAlignment.CENTER);
            mergeCellStyle.setVerticalAlignment(VerticalAlignment.DISTRIBUTED);

            Class<?> objClass = apps.get(0).getClass();
            Field[] fields = objClass.getDeclaredFields();
            for (Field field : fields) {
                field.setAccessible(true);
            }
            String[] columns = {
                "Дугаар", "Аймаг, нийслэл", "Сум, Дүүрэг", "Баг, хороо",
                    "Төслийн нэр", "Төсвийн Ерөнхийлөн захирагч",
                    "Аймаг / нийслэл оноо", "ТЕЗ оноо", "СЯ оноо",
                    "Эдийн засгийн ангилал", "Салбар", "Дэд салбар", "ХО төрөл", "Хүчин чадал", "Хэмжих нэгж",
                    "Эхлэх он", "Дуусах он",
                    "Нийт төсөвт өртөг", "2024 онд санхүүжих дүн /Байгууллагын санал/", "Хуулинд тусгах төсөвт өртөг /СЯ/",
                    "2023 онд санхүүжих дүн /СЯ/", "2025 онд санхүүжих дүн", "2026 онд санхүүжих дүн",
                    "Санхүү, эдийн засгийн шинжилгээ хийгдсэн эсэх", "Бодлогын баримт бичигт тусгагдсан эсэх", "Бодлогын баримт бичигт тусгагдсан заалт", "Батлагдсан зураг төсөв", "ТЭЗҮ холбосон эсэх", "Газрын зөвшөөрөл", "Бодлогын баримт бичигтэй холбогдсон эсэх", "Шинжилгээ бүрэн эсэх", "Хураангуй мэдээлэл бөглөсөн эсэх",
                    "Төсөл үүсгэсэн", "Код", "Үе шат"
            };

            Row mergeRow = sheet.createRow(0);
            Cell mergeCell = mergeRow.createCell((short) 0);
            mergeCell.setCellValue("");
            mergeCell.setCellStyle(mergeCellStyle);
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 34));

            // Row for Header
            Row headerRow = sheet.createRow(1);
            headerRow.setHeight((short) 800);
            // Header
            for (int col = 0; col < columns.length; col++) {
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(columns[col]);
                cell.setCellStyle(headerCellStyle);
            }

            CellStyle ageCellStyle = workbook.createCellStyle();
            ageCellStyle.setDataFormat(createHelper.createDataFormat().getFormat("#"));
            CellStyle cellStyle = null;
            cellStyle = workbook.createCellStyle();
            cellStyle.setBorderBottom(BorderStyle.THIN);
            cellStyle.setBorderTop(BorderStyle.THIN);
            cellStyle.setBorderRight(BorderStyle.THIN);
            cellStyle.setBorderLeft(BorderStyle.THIN);

            int rowIdx = 2;
            for (Object item : apps) {
                Row row = sheet.createRow(rowIdx++);

                for (int i = 0; i < fields.length; i++) {
                    Cell column = row.createCell(i);
                    try {
                        String value = String.valueOf(fields[i].get(item));
                        if (value.equals("null")) {
                            value = "";
                        }
                        column.setCellValue(value);
                    } catch (IllegalAccessException e) {
                        throw new RuntimeException(e);
                    }
                    column.setCellStyle(cellStyle);
                }
                row.setHeight((short) -1);
            }

            for (int i = 0; i < fields.length; i++) {
                sheet.autoSizeColumn(i);
            }
//            sheet.createFreezePane(1, 1);
            workbook.write(out);
        }
        return new ByteArrayInputStream(out.toByteArray());
    }

    private double toDouble(Double val) {
        return val == null ? 0 : val;
    }

    public ByteArrayInputStream questionsToExcel(List<Map<String, Object>> apps) throws IOException {
        ByteArrayOutputStream out;
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            out = new ByteArrayOutputStream();
            CreationHelper createHelper = workbook.getCreationHelper();

            XSSFSheet sheet = workbook.createSheet("Асуултууд");
            sheet.setColumnWidth(1, 15000);
            sheet.setColumnWidth(2, 15000);
            sheet.setColumnWidth(0, 0);
            sheet.setColumnHidden(0, true);
            sheet.protectSheet("Zs9$27%IbN#^");

            CellStyle unlockedCellStyle = workbook.createCellStyle();
            unlockedCellStyle.setLocked(false);

            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            CellStyle headerCellStyle = workbook.createCellStyle();
            headerCellStyle.setFont(headerFont);
            headerCellStyle.setLocked(true);
            headerCellStyle.setAlignment(HorizontalAlignment.CENTER);
            headerCellStyle.setVerticalAlignment(VerticalAlignment.DISTRIBUTED);
            headerCellStyle.setBorderBottom(BorderStyle.THIN);
            headerCellStyle.setBorderTop(BorderStyle.THIN);
            headerCellStyle.setBorderRight(BorderStyle.THIN);
            headerCellStyle.setBorderLeft(BorderStyle.THIN);

            String[] COLUMNs = {"№", "Асуулт", "Хариулт"};

            // Row for Header
            Row headerRow = sheet.createRow(0);
            headerRow.setHeight((short) 400);
            // Header
            for (int col = 0; col < COLUMNs.length; col++) {
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(COLUMNs[col]);
                cell.setCellStyle(headerCellStyle);
            }

            CellStyle ageCellStyle = workbook.createCellStyle();
            ageCellStyle.setDataFormat(createHelper.createDataFormat().getFormat("#"));
            CellStyle cellStyle = null;
            cellStyle = workbook.createCellStyle();
            cellStyle.setBorderBottom(BorderStyle.THIN);
            cellStyle.setBorderTop(BorderStyle.THIN);
            cellStyle.setBorderRight(BorderStyle.THIN);
            cellStyle.setBorderLeft(BorderStyle.THIN);
            cellStyle.setWrapText(true);

            int rowIdx = 1;
            for (Map<String, Object> item : apps) {
                Row row = sheet.createRow(rowIdx++);
                Cell col0 = row.createCell(0);
                col0.setCellValue(item.get("id").toString());
                col0.setCellStyle(cellStyle);

                Cell col3 = row.createCell(1);
                col3.setCellValue(item.get("question").toString());
                col3.setCellStyle(cellStyle);
                Cell col2 = row.createCell(2);
                col2.setCellValue(item.get("answer").toString());
                col2.setCellStyle(unlockedCellStyle);
            }
            sheet.createFreezePane(1, 1);
            workbook.write(out);
        }
        return new ByteArrayInputStream(out.toByteArray());
    }
}
*/
