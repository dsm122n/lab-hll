/**
 * Laboratory Results Extractor
 * This script extracts laboratory test values from PDF files and formats them for easy reading and copying.
 */

// Define mapping between exam names and their properties in our data structure
const EXAM_MAPPINGS = {
  // Format: "EXAM_NAME_IN_PDF": { category: "categoryName", property: "propertyName", unit: "unit", specialProcessing: function }
  "HEMOGLOBINA": { category: "hemograma", property: "Hb", unit: "" },
  "HEMATOCRITO": { category: "hemograma", property: "Hto", unit: "%" },
  "V.C.M": { category: "hemograma", property: "VCM", unit: "" },
  "C.H.C.M": { category: "hemograma", property: "CHCM", unit: "" },
  "RCTO. DE PLAQUETAS": { category: "hemograma", property: "Plaquetas", unit: ".000" },
  "LEUCOCITOS": { category: "hemograma", property: "Leucocitos", unit: "0" },
  "RAN": { category: "hemograma", property: "RAN", unit: "" },
  "SEGMENTADO": { 
    category: "hemograma", 
    property: "Segmentados", 
    unit: "%", 
    valueIndex: 21 // Offset from exam name
  },
  "LINFOCITOS ": { 
    category: "hemograma", 
    property: "Linfocitos", 
    unit: "%", 
    valueIndex: 20 // Offset from exam name
  },
  "SODIO": { category: "electrolitos", property: "Na", unit: "" },
  "POTASIO": { category: "electrolitos", property: "K", unit: "" },
  "CLORO": { category: "electrolitos", property: "Cl", unit: "" },
  "CALCIO IONICO": { category: "electrolitos", property: "Ca", unit: "" },
  "FOSFORO": { category: "electrolitos", property: "P", unit: "" },
  "MAGNESIO": { category: "electrolitos", property: "Mg", unit: "" },
  "CREATININA, sangre": { category: "funcionRenal", property: "Crea", unit: "" },
  "NITROGENO UREICO": { category: "funcionRenal", property: "BUN", unit: "" },
  "LDH": { category: "otros", property: "LDH", unit: "" },
  "PROTEINA C REACTIVA": { category: "otros", property: "PCR", unit: "" },
  "TTPK": { category: "coagulacion", property: "TTPK", unit: " s" },
  "% ACTIV. DE PROTROMBINA": { category: "coagulacion", property: "TP", unit: "%" },
  "INR": { 
    category: "coagulacion", 
    property: "INR", 
    unit: "", 
    valueIndex: -2 // Special offset for INR
  },
  "BILIRRUBINA TOTAL": { category: "funcionHepatica", property: "BiliT", unit: "" },
  "BILIRRUBINA DIRECTA": { category: "funcionHepatica", property: "BiliD", unit: "" },
  "PROTEINAS TOTALES": { category: "funcionHepatica", property: "Proteinas", unit: "" },
  "ALBUMINA": { category: "funcionHepatica", property: "Albumina", unit: "" },
  "GGT": { category: "funcionHepatica", property: "GGT", unit: "" },
  "FOSFATASA ALCALINA": { category: "funcionHepatica", property: "FA", unit: "" },
  "GPT": { category: "funcionHepatica", property: "GPT", unit: "" },
  "GOT": { category: "funcionHepatica", property: "GOT", unit: "" },
  "HORMONA TIROESTIMULANTE (TSH)": { category: "otros", property: "TSH", unit: "" },
  "TIROXINA LIBRE: T4L": { category: "otros", property: "T4L", unit: "" }
};

// Categories for organizing lab results
const CATEGORIES = {
  hemograma: "Hemograma",
  electrolitos: "Electrolitos",
  funcionHepatica: "Función Hepática",
  coagulacion: "Coagulación",
  funcionRenal: "Función Renal",
  otros: "Otros"
};

/**
 * Represents a laboratory exam result with date, time and all test categories
 */
class LabResults {
  constructor(date, time) {
    this.date = date;
    this.time = time;
    
    // Initialize all categories with empty objects
    Object.keys(CATEGORIES).forEach(category => {
      this[category] = {};
    });
  }

  /**
   * Sets a value for a specific test
   * @param {string} category - The category of the test
   * @param {string} property - The test property name
   * @param {string} value - The test value
   * @param {string} unit - Optional unit to append to the value
   */
  setValue(category, property, value, unit = '') {
    if (value) {
      this[category][property] = value + unit;
    }
  }

  /**
   * Calculates derived values like RAN and RAL from leucocites and percentages
   * Values should be in thousands (K/μL)
   */
  calculateDerivedValues() {
    // Remove units for calculation
    const leucocitosStr = this.hemograma.Leucocitos?.replace(/[^0-9.]/g, '');
    const leucocitos = parseFloat(leucocitosStr);
    
    // Calculate RAN if we have the necessary values
    if (this.hemograma.Segmentados && leucocitos) {
      const segmentadosStr = this.hemograma.Segmentados.replace(/[^0-9.]/g, '');
      const segmentados = parseFloat(segmentadosStr);
      if (!isNaN(segmentados)) {
        // Multiply by 1000 and then divide by 100 (for percentage) = multiply by 10
        const ran = (leucocitos * segmentados / 100).toFixed(3);
        this.hemograma.RAN = ran;
      }
    }
    
    // Calculate RAL if we have the necessary values
    if (this.hemograma.Linfocitos && leucocitos) {
      const linfocitosStr = this.hemograma.Linfocitos.replace(/[^0-9.]/g, '');
      const linfocitos = parseFloat(linfocitosStr);
      if (!isNaN(linfocitos)) {
        // Multiply by 1000 and then divide by 100 (for percentage) = multiply by 10
        const ral = (leucocitos * linfocitos / 100).toFixed(3);
        this.hemograma.RAL = ral;
      }
    }
  }

  /**
   * Format the lab results as a string for display
   * @returns {string} Formatted lab results
   */
  formatResults() {
    // Format date for display
    const formattedDate = this.date.toLocaleDateString('en-GB', { 
      day: '2-digit', month: '2-digit', year: 'numeric' 
    });
    
    // Build formatted sections for each category
    const sections = Object.keys(CATEGORIES).map(category => {
      const data = this[category];
      const items = Object.entries(data)
        .filter(([_, value]) => value !== null && value !== undefined)
        .map(([key, value]) => `${key} ${value}`)
        .join(', ');
      
      return items ? `- ${CATEGORIES[category]}: ${items}` : null;
    }).filter(Boolean);
    
    return `>${formattedDate} ${this.time}:\n ${sections.join('\n ')}`;
  }
}

/**
 * Processes a PDF document to extract laboratory values
 * @param {PDFDocumentProxy} pdf - The PDF.js document object
 * @returns {Promise<string>} - Formatted lab results text
 */
function processPDF(pdf) {
  // Create array of promises for all pages
  const pagePromises = Array.from({ length: pdf.numPages }, (_, i) => {
    return pdf.getPage(i + 1).then(page => 
      page.getTextContent().then(content => 
        content.items.map(item => item.str)
      )
    );
  });
  
  // Process all pages at once
  return Promise.all(pagePromises).then(pages => {
    // Parse date and time from the first page
    const dateTimeStr = pages[0][13] || '';
    const date = dateTimeStr.substring(0, 10);
    const time = dateTimeStr.substring(11, 16);
    
    // Create lab results object
    const labResults = new LabResults(parseDate(date), time);
    
    // Extract lab values from all pages
    extractLabValues(pages, labResults);
    
    // Calculate derived values
    labResults.calculateDerivedValues();
    
    // Return formatted results
    return labResults.formatResults();
  });
}

/**
 * Parses a date string in format DD/MM/YYYY
 * @param {string} dateStr - Date string
 * @returns {Date} - JavaScript Date object
 */
function parseDate(dateStr) {
  if (!dateStr) return new Date();
  
  const [day, month, year] = dateStr.split('/');
  return new Date(`${month}/${day}/${year}`);
}

/**
 * Extracts lab values from the PDF text content
 * @param {Array<Array<string>>} pages - PDF text content by pages
 * @param {LabResults} labResults - Lab results object to populate
 */
function extractLabValues(pages, labResults) {
  // Process each page and look for known exam names
  pages.forEach(page => {
    page.forEach((text, index) => {
      const normalizedText = text.replace(/\s*/, '');
      
      // Check if this text matches any known exam name
      const mapping = EXAM_MAPPINGS[normalizedText];
      if (!mapping) return;
      
      // Determine where to find the value
      let valueIndex = mapping.valueIndex !== undefined ? 
        index + mapping.valueIndex : 
        index - 3;
      
      if (valueIndex < 0 || valueIndex >= page.length || 
          page[valueIndex] === "Valor Referencia" || 
          page[valueIndex] === "null") return;
      
      // Get the value and clean it if needed
      let value = page[valueIndex];
      if (value && value.includes('*')) {
        value = value.replace('*', '');
      }
      
      // Set the value with appropriate unit
      if (value) {
        labResults.setValue(mapping.category, mapping.property, value, mapping.unit);
      }
    });
  });
}

/**
 * Extracts text from PDF URL
 */
function extractTextFromPDF() {
  const pdfUrl = document.getElementById("pdfUrl").value;
  if (!pdfUrl) {
    alert("Por favor ingresa una URL válida");
    return;
  }
  
  showLoadingIndicator();
  
  pdfjsLib.getDocument(pdfUrl).promise
    .then(processPDF)
    .then(displayResults)
    .catch(handleError)
    .finally(hideLoadingIndicator);
}

/**
 * Processes an uploaded PDF file
 */
function uploadPDF() {
  const pdfFile = document.getElementById("pdfFile").files[0];
  if (!pdfFile) {
    alert("Por favor selecciona un archivo PDF");
    return;
  }
  
  showLoadingIndicator();
  
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const typedArray = new Uint8Array(event.target.result);
    pdfjsLib.getDocument(typedArray).promise
      .then(processPDF)
      .then(displayResults)
      .catch(handleError)
      .finally(hideLoadingIndicator);
  };
  fileReader.readAsArrayBuffer(pdfFile);
}

/**
 * Shows loading indicator
 */
function showLoadingIndicator() {
  document.getElementById('outputDiv').textContent = "Procesando PDF...";
  document.getElementById('boton').disabled = true;
}

/**
 * Hides loading indicator
 */
function hideLoadingIndicator() {
  document.getElementById('boton').disabled = false;
}

/**
 * Handles errors during PDF processing
 * @param {Error} error - The error object
 */
function handleError(error) {
  console.error("Error processing PDF:", error);
  document.getElementById('outputDiv').textContent = "Error al procesar el PDF: " + error.message;
}

/**
 * Displays results in output div
 * @param {string} formattedText - Formatted lab results text
 */
function displayResults(formattedText) {
  document.getElementById('outputDiv').textContent = formattedText;
}

// Set up event listeners once the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Set up drag and drop handlers
  setupDragAndDrop();
  
  // Add keyboard shortcut for URL input
  document.getElementById('pdfUrl').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      extractTextFromPDF();
    }
  });
});

/**
 * Sets up drag and drop functionality
 */
function setupDragAndDrop() {
  const dropOverlay = document.getElementById('dropOverlay');
  
  document.addEventListener('dragover', function(e) {
    e.preventDefault();
    dropOverlay.classList.add('active');
  });

  document.addEventListener('dragleave', function(e) {
    if (e.target === document.body || e.clientY < 1) {
      dropOverlay.classList.remove('active');
    }
  });

  document.addEventListener('drop', function(e) {
    e.preventDefault();
    dropOverlay.classList.remove('active');
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === "application/pdf") {
      // Switch to file tab
      switchTab('fileTab');
      
      // Set the file and process it
      document.getElementById('pdfFile').files = files;
      uploadPDF();
    } else {
      alert("Por favor, arrastra un archivo PDF válido");
    }
  });
}