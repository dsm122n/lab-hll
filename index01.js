class diaExamen {
    constructor(fecha, hora){
        this.fecha = fecha;
        this.hora = hora;
        this.hemograma = {
            Hb: null, Hto: null, VCM: null, CHCM: null,
            Leucocitos: null, Segmentados: null, RAN: null,
            Linfocitos: null, RAL: null, Plaquetas: null
        };
        this.electrolitos = {
            Na: null, K: null, Cl: null, Ca: null, P: null, Mg: null
        };
        this.funcionHepatica = {
            GOT: null, GPT: null, GGT: null, FA: null,
            BiliT: null, BiliD: null, Proteinas: null, Albumina: null
        };
        this.coagulacion = {
            TTPK: null, TP: null, INR: null
        };
        this.funcionRenal = {
            BUN: null, Crea: null, AcUrico: null
        };
        this.otros = {
            LDH: null, PCR: null, Glucosa: null, TSH: null, T4L: null
        };
    }
}

const nombresExamenes = ["HEMOGLOBINA", "HEMATOCRITO", "V.C.M", "C.H.C.M", "RCTO. DE PLAQUETAS", "LEUCOCITOS", "RAN", "SEGMENTADO", "LINFOCITOS ", 
    "SODIO", "POTASIO", "CLORO", "CALCIO IONICO", "FOSFORO", "MAGNESIO", "CREATININA, sangre", "NITROGENO UREICO", "LDH", 
    "PROTEINA C REACTIVA", "% ACTIV. DE PROTROMBINA", "INR", "TTPK", "BILIRRUBINA TOTAL", "BILIRRUBINA DIRECTA",
    "PROTEINAS TOTALES", "ALBUMINA", "GGT", "FOSFATASA ALCALINA", "GPT", "GOT",
    "HORMONA TIROESTIMULANTE (TSH)", "TIROXINA LIBRE: T4L"
];

// Process PDF and extract lab values
function processPDF(pdf) {
    let textArray = [];
    
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
        textArray = pages;
        
        // Create and populate lab results object
        let labDia = new diaExamen(
            textArray[0][13].substring(0, 10),
            textArray[0][13].substring(11, 16)
        );
        
        // Parse date and time
        const [day, month, year] = labDia.fecha.split('/');
        const dateObject = new Date(`${month}/${day}/${year}`);
        const [hours, minutes] = labDia.hora.split(':');
        dateObject.setHours(parseInt(hours), parseInt(minutes));
        labDia.fecha = dateObject;
        
        // Extract lab values from text
        textArray.forEach(page => {
            page.forEach((text, k) => {
                nombresExamenes.forEach(examName => {
                    const elementWithoutSpaces = text.replace(/\s*/, '');
                    if (elementWithoutSpaces !== examName) return;
                    
                    const valueIndex = k - 3;
                    const valueIndex2 = k - 2;
                    const valueIndexSegmentados = k + 21;
                    const valueIndexLinfocitos = k + 20;
                    
                    if (valueIndex < 0 || page[valueIndex] === "Valor Referencia" || page[valueIndex] === "null") return;
                    
                    const value = page[valueIndex];
                    console.log(`Para el examen ${examName} en la posición ${k} el valor es ${value}`);
                    
                    // Map exam name to object property
                    switch (examName) {
                        case "HEMOGLOBINA": labDia.hemograma.Hb = value; break;
                        case "HEMATOCRITO": labDia.hemograma.Hto = value; break;
                        case "V.C.M": labDia.hemograma.VCM = value; break;
                        case "C.H.C.M": labDia.hemograma.CHCM = value; break;
                        case "RCTO. DE PLAQUETAS": labDia.hemograma.Plaquetas = value; break;
                        case "LEUCOCITOS": labDia.hemograma.Leucocitos = value; break;
                        case "RAN": labDia.hemograma.RAN = value; break;
                        case "SEGMENTADO": labDia.hemograma.Segmentados = page[valueIndexSegmentados]; break;
                        case "LINFOCITOS ": labDia.hemograma.Linfocitos = page[valueIndexLinfocitos]; break;
                        case "SODIO": labDia.electrolitos.Na = value; break;
                        case "POTASIO": labDia.electrolitos.K = value; break;
                        case "CLORO": labDia.electrolitos.Cl = value; break;
                        case "CALCIO IONICO": labDia.electrolitos.Ca = value; break;
                        case "FOSFORO": labDia.electrolitos.P = value; break;
                        case "MAGNESIO": labDia.electrolitos.Mg = value; break;
                        case "CREATININA, sangre": labDia.funcionRenal.Crea = value; break;
                        case "NITROGENO UREICO": labDia.funcionRenal.BUN = value; break;
                        case "LDH": labDia.otros.LDH = value; break;
                        case "PROTEINA C REACTIVA": labDia.otros.PCR = value; break;
                        case "TTPK": labDia.coagulacion.TTPK = value; break;
                        case "% ACTIV. DE PROTROMBINA": labDia.coagulacion.TP = value; break;
                        case "INR": labDia.coagulacion.INR = page[valueIndex2]; break;
                        case "BILIRRUBINA TOTAL": labDia.funcionHepatica.BiliT = value; break;
                        case "BILIRRUBINA DIRECTA": labDia.funcionHepatica.BiliD = value; break;
                        case "PROTEINAS TOTALES": labDia.funcionHepatica.Proteinas = value; break;
                        case "ALBUMINA": labDia.funcionHepatica.Albumina = value; break;
                        case "GGT": labDia.funcionHepatica.GGT = value; break;
                        case "FOSFATASA ALCALINA": labDia.funcionHepatica.FA = value; break;
                        case "GPT": labDia.funcionHepatica.GPT = value; break;
                        case "GOT": labDia.funcionHepatica.GOT = value; break;
                        case "HORMONA TIROESTIMULANTE (TSH)": labDia.otros.TSH = value; break;
                        case "TIROXINA LIBRE: T4L": labDia.otros.T4L = value; break;
                    }
                });
            });
        });
        
        return formatResults(labDia);
    });
}

// Format lab results for display
function formatResults(labDia) {
    // Format values with appropriate units
    if (labDia.hemograma.Leucocitos) labDia.hemograma.Leucocitos += "0";
    if (labDia.hemograma.Plaquetas) labDia.hemograma.Plaquetas += ".000";
    if (labDia.hemograma.Hto) labDia.hemograma.Hto += "%";
    
    if (labDia.hemograma.Segmentados) {
        const segmentados = labDia.hemograma.Segmentados.replace("*", "");
        labDia.hemograma.RAN = (labDia.hemograma.Leucocitos * segmentados / 100).toFixed(3);
        labDia.hemograma.Segmentados += "%";
        
        const linfocitos = labDia.hemograma.Linfocitos.replace("*", "");
        labDia.hemograma.RAL = (labDia.hemograma.Leucocitos * linfocitos / 100).toFixed(3);
        labDia.hemograma.Linfocitos += "%";
    }
    
    if (labDia.coagulacion.TP) labDia.coagulacion.TP += "%";
    if (labDia.coagulacion.TTPK) labDia.coagulacion.TTPK += " s";
    
    // Format date and create output sections
    const formattedDate = labDia.fecha.toLocaleDateString('en-GB', { 
        day: '2-digit', month: '2-digit', year: 'numeric' 
    });
    
    // Create formatted section strings
    const formatSection = (title, data) => {
        const items = Object.entries(data)
            .filter(([_, value]) => value !== null)
            .map(([key, value]) => `${key} ${value}`)
            .join(', ');
        return `- ${title}: ${items}`;
    };
    
    // Assemble final output string
    const sections = [
        formatSection('Hemograma', labDia.hemograma),
        formatSection('Función Renal', labDia.funcionRenal),
        formatSection('Electrolitos', labDia.electrolitos),
        formatSection('Función Hepática', labDia.funcionHepatica),
        formatSection('Coagulación', labDia.coagulacion),
        formatSection('Otros', labDia.otros)
    ];
    
    return `>${formattedDate} ${labDia.hora}:\n ${sections.join('\n ')}`;
}

// Extract text from PDF URL
function extractTextFromPDF() {
    const pdfUrl = document.getElementById("pdfUrl").value;
    pdfjsLib.getDocument(pdfUrl).promise
        .then(processPDF)
        .then(displayResults)
        .catch(error => console.error("Error processing PDF:", error));
}

// Process uploaded PDF file
function uploadPDF() {
    const pdfFile = document.getElementById("pdfFile").files[0];
    if (!pdfFile) return;
    
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const typedArray = new Uint8Array(event.target.result);
        pdfjsLib.getDocument(typedArray).promise
            .then(processPDF)
            .then(displayResults)
            .catch(error => console.error("Error processing PDF:", error));
    };
    fileReader.readAsArrayBuffer(pdfFile);
}

// Display results in output div
function displayResults(formattedText) {
    document.getElementById('outputDiv').textContent = formattedText;
}

// Set up drag and drop handlers
document.addEventListener('dragover', function(e) {
    e.preventDefault();
    document.getElementById('dropOverlay').classList.add('active');
});

document.addEventListener('dragleave', function(e) {
    if (e.target === document.body || e.clientY < 1) {
        document.getElementById('dropOverlay').classList.remove('active');
    }
});

document.addEventListener('drop', function(e) {
    e.preventDefault();
    document.getElementById('dropOverlay').classList.remove('active');
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === "application/pdf") {
        document.getElementById('pdfFile').files = files;
        uploadPDF();
    }
});
