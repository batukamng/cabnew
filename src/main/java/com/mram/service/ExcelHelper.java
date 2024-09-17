package com.mram.service;

import org.springframework.web.multipart.MultipartFile;

public class ExcelHelper {
    public static String TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    public static boolean hasExcelFormat(MultipartFile file) {

        if (!TYPE.equals(file.getContentType())) {
            return false;
        }

        return true;
    }

    /*public static List<Organization> excelToOrganization(InputStream is, List<Governor> generalBudgets, List<CentralGovernor> centralBudgets) {
        String[] HEADERs = { "TEZ_ID", "TEZ_NAME", "TEZ_REG_NO", "TTZ_REG_NO", "TTZ_NAME", "ENT_NAME", "ORG_REG_NO" };
        String SHEET = "Sheet1";
        try {
            Workbook workbook = new XSSFWorkbook(is);
            FormulaEvaluator evaluator = workbook.getCreationHelper().createFormulaEvaluator();
            Sheet sheet = workbook.getSheet(SHEET);
            Iterator<Row> rows = sheet.iterator();

            List<Organization> tutorials = new ArrayList<>();

            int rowNumber = 0;
            while (rows.hasNext()) {
                Row currentRow = rows.next();

                // skip header
                if (rowNumber == 0) {
                    rowNumber++;
                    continue;
                }

                Iterator<Cell> cellsInRow = currentRow.iterator();
                DataFormatter formatter = new DataFormatter();
                Organization tutorial = new Organization();


                int cellIdx = 0;
                while (cellsInRow.hasNext()) {
                    Cell currentCell = cellsInRow.next();
                    String strValue = formatter.formatCellValue(currentCell, evaluator);

                    switch (cellIdx) {
                        case 0:
                            tutorial.setId(Long.parseLong(strValue));
                            break;
                        case 1:
                            for(Governor budget:generalBudgets){
                                if(budget.getName().toLowerCase().trim().equalsIgnoreCase(strValue.toLowerCase().trim())){
                                    tutorial.setTezId(budget.getId());
                                }
                            }
                            break;
                        case 4:
                            for(CentralGovernor budget:centralBudgets){
                                if(budget.getName().toLowerCase().trim().equalsIgnoreCase(strValue.toLowerCase().trim())){
                                    tutorial.setTtzId(budget.getId());
                                }
                            }
                            break;
                        case 5:
                            tutorial.setName(strValue);
                            break;

                        case 6:
                            tutorial.setLpReg(strValue);
                            break;

                        default:
                            break;
                    }
                    cellIdx++;
                }
                tutorials.add(tutorial);
            }

            workbook.close();

            return tutorials;
        } catch (IOException e) {
            throw new RuntimeException("fail to parse Excel file: " + e.getMessage());
        }
    }

    public static List<Governor> excelToGovernor(InputStream inputStream, List<Governor> generalBudgets, List<CentralGovernor> centralBudgets) {
        String[] HEADERs = { "TEZ_ID", "TEZ_NAME", "TEZ_REG_NO", "TTZ_REG_NO", "TTZ_NAME", "ENT_NAME", "ORG_REG_NO" };
        String SHEET = "Sheet1";
        try {
            Workbook workbook = new XSSFWorkbook(inputStream);
            FormulaEvaluator evaluator = workbook.getCreationHelper().createFormulaEvaluator();
            Sheet sheet = workbook.getSheet(SHEET);
            Iterator<Row> rows = sheet.iterator();

            List<Governor> tutorials = new ArrayList<>();

            int rowNumber = 0;
            while (rows.hasNext()) {
                Row currentRow = rows.next();

                // skip header
                if (rowNumber == 0) {
                    rowNumber++;
                    continue;
                }

                Iterator<Cell> cellsInRow = currentRow.iterator();
                DataFormatter formatter = new DataFormatter();
                Governor tutorial=new Governor();


                int cellIdx = 0;
                while (cellsInRow.hasNext()) {
                    Cell currentCell = cellsInRow.next();
                    String strValue = formatter.formatCellValue(currentCell, evaluator);

                    switch (cellIdx) {
                 *//*       case 1:
                            for(Governor budget:generalBudgets){
                                if(budget.getName().toLowerCase().trim().equalsIgnoreCase(strValue.toLowerCase().trim())){
                                    tutorial=budget;
                                }
                            }
                            break;*//*
                        case 0:
                            for(Governor budget:generalBudgets){
                                if(budget.getName().toLowerCase().trim().equalsIgnoreCase(strValue.toLowerCase().trim())){
                                    tutorial=budget;
                                    String regValue = formatter.formatCellValue(currentRow.getCell(cellIdx+1), evaluator);
                                    tutorial.setLpReg(regValue);
                                }
                            }
                            break;
                        default:
                            break;
                    }
                    cellIdx++;
                }
                if(!tutorials.contains(tutorial)){
                    tutorials.add(tutorial);
                }

            }

            workbook.close();

            return tutorials;
        } catch (IOException e) {
            throw new RuntimeException("fail to parse Excel file: " + e.getMessage());
        }
    }*/

}
