import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToExcel = (data, fileName) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  saveAs(blob, `${fileName}.xlsx`);
};

export const exportToPDF = (options) => {
  const doc = new jsPDF();
  const { fileName, title, school, teacher, date, dataByLevel, studentName, logo, selectedSemester } = options;

  // Logo
  if (logo) {
    try {
      // Use auto-detection for format to avoid mismatch issues
      doc.addImage(logo, 14, 10, 25, 25);
    } catch (e) {
      console.error("PDF Logo Error:", e);
    }
  }

  // Header
  doc.setFontSize(18);
  doc.setTextColor(249, 115, 22); // Orange header
  doc.text(school.toUpperCase(), 105, 18, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setTextColor(100);
  doc.text('Student Progress Report', 105, 26, { align: 'center' });
  
  // Info Section
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text(`Student Name: ${studentName}`, 14, 45);
  doc.text(`Date: ${date}`, 105, 45);
  doc.text(`Level Adviser: ${teacher || 'N/A'}`, 14, 52);
  doc.text(`Semester/Year: ${selectedSemester || 'First Semester'}, 2026`, 105, 52);

  let currentY = 60;
  
  const levels = Object.keys(dataByLevel);
  if (levels.length > 0) {
    levels.forEach(level => {
      doc.setFontSize(11);
      doc.setTextColor(249, 115, 22);
      doc.text(level === 'CCMASS' ? 'CCMASS CURRICULUM' : `${level} LEVEL`, 14, currentY);
      
      autoTable(doc, {
        head: [['SUBJECT', 'SCORE', 'GRADE', 'REMARK']],
        body: dataByLevel[level],
        startY: currentY + 3,
        theme: 'grid',
        headStyles: { fillColor: [249, 115, 22] }
      });
      
      if (doc.lastAutoTable) {
        currentY = doc.lastAutoTable.finalY + 10;
      } else {
        currentY += 20;
      }
    });

    // Signature section
    if (doc.lastAutoTable) {
      currentY = doc.lastAutoTable.finalY + 20;
    } else {
      currentY += 20;
    }
    
    if (currentY > 250) { doc.addPage(); currentY = 50; }
    
    doc.setLineWidth(0.5);
    doc.line(75, currentY, 135, currentY);
    doc.text("Level Adviser's Signature", 105, currentY + 5, { align: 'center' });
  } else {
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("No academic records found for this period.", 105, 80, { align: 'center' });
  }

  doc.save(`${fileName}.pdf`);
};

export const readExcel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      resolve(jsonData);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};
