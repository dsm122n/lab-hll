// import * as pdfjsLib from 'pdfjs-dist';
// import 'pdfjs-dist/build/pdf.worker';

class diaExamen {
    constructor(fecha, hora){
        this.fecha = fecha;
        this.hora = hora;
        this.hemograma = {
            Hb: null,
            Hto: null,
            VCM: null,
            CHCM: null,
            Leucocitos: null,
            Segmentados: null,
            Linfocitos: null,
            RAN: null,
            Plaquetas: null
        };
        this.gases = {
            
            pH: null,
            pCO2: null,
            pO2: null,
            HCO3: null,
            EB: null,
            SatO2: null
        };
        this.electrolitos = {
            Na: null,
            K: null,
            Cl: null,
            Ca: null,
            P: null,
            Mg: null
        };

        this.funcionHepatica = {
            GOT: null,
            GPT: null,
            GGT: null,
            FA: null,
            BiliT: null,
            BiliD: null,
            Proteinas: null,
            Albumina: null
        };
        this.coagulacion = {
            TTP: null,
            TP: null,
            INR: null
        };
        this.funcionRenal = {
            //Urea: null,
            BUN: null,
            Crea: null,
            AcUrico: null
        };
        this.otros = {
            LDH: null,
            PCR: null
        }


    }

}
const nombresExamenes = ["HEMOGLOBINA", "HEMATOCRITO", "V.C.M", "C.H.C.M", "PLAQUETAS", "LEUCOCITOS", "RAN", "SEGMENTADOS", "LINFOCITOS", 
    "pH", "pCO2", "pO2", "EXCESO DE BASE", "HCO3", "HCO3 st", "SODIO", "POTASIO", "CLORO", "CALCIO IONICO", 
    "FOSFORO", "MAGNESIO", "CREATININA", "NITROGENO UREICO", "LDH", 
    "PROTEINA C REACTIVA",
    "TIEMPO DE TROMBOPLASTINA", "TIEMPO DE PROTROMBINA %", "INR", 
    "BILIRRUBINA TOTAL", "BILIRRUBINA DIRECTA", "PROTEINAS TOTALES", "ALBUMINA", "GGT", "FOSFATASA ALCALINA", "GPT/ALT", "GOT/AST"
];



function extractTextFromPDF() {


    
    // Asynchronously load the PDF file
    const pdfUrl = document.getElementById("pdfUrl").value;
    console.log(typeof(pdfUrl));
    console.log(pdfUrl);

    // const loadingTask = pdfjsLib.getDocument(pdfUrl);
    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    
    loadingTask.promise.then(function (pdf) {
      // Initialize an array to hold the text from each page
        let textArray = [];
  
        // Iterate through each page of the PDF
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            pdf.getPage(pageNum).then(function (page) {
            // Extract text content from the page
                page.getTextContent().then(function (textContent) {
                    const pageText = [];

                    // Iterate through the text content items
                    for (const item of textContent.items) {
                        pageText.push(item.str);
                    }
                    textArray.push(pageText);
                    
                    // Join the text content from this page into a single string
                    // const pageTextString = pageText.join(" ");
                    console.log("el array de textos es: \n");
                    console.log(textArray);
                    // Add the text from this page to the array
                    //textArray.push(pageTextString);
                    
                    // If this is the last page, display the extracted text
                    /*
                    if (pageNum === pdf.numPages) {
                        //const extractedText = textArray.join("\n");

                        // Now that you have textArray, you can use it to find the index
                        // const index = textArray.indexOf("Fecha/Hora Ingreso");
                        let labDia = new diaExamen(textArray[0][5].substring(0, 10),textArray[0][5].substring(11, 16));
                        
                        console.log("FECHAAAA " + labDia.fecha);
                        console.log("horaaaaa " + labDia.hora);
                        let dateString = labDia.fecha;
                        let [day, month, year] = dateString.split('/');

                        // Ensure the components are in the correct order (DD/MM/YYYY)
                        let dateObject = new Date(`${month}/${day}/${year}`);
                        console.log(dateObject);
                        let timeString = labDia.hora;
                        let [hours, minutes] = timeString.split(':');

                        // Set the time components to the Date object
                        dateObject.setHours(parseInt(hours, 10), parseInt(minutes, 10));
                        labDia.fecha = dateObject;

                        console.log("largo de:" + textArray[0][1].length);

                        for (let i = 0; i < textArray.length; i++) {

                            for (let k = 0; k < textArray[i].length; k++) {
                                for (let j = 0; j < nombresExamenes.length; j++) {
                                    console.log(textArray[1][k]);
                                    // console.log("i es " + i + ", k es " + k + " y j es " + j);
                                    ////////////// aquí añadir el /\s asterisco antes del /
                                    /////////////////////////////
                                    /////////////////////////////
                                    /////////////////////////////
                                    /////////////////////////////
                                    const elementWithoutSpaces = textArray[i][k].replace(/\s/, '');
                        
                        
                                    if (elementWithoutSpaces == nombresExamenes[j]) {
                                        // Check if the element matches the exam name
                                        let valueIndex = k + 1;
                                        if (valueIndex < textArray[i].length) {
                                            console.log("Para el examen " + nombresExamenes[j] + " en la posición " + k + " el valor post es " + textArray[i][valueIndex]);
                                            switch (nombresExamenes[j]) {
                                                case "HEMOGLOBINA":
                                                    labDia.hemograma.Hb = textArray[i][valueIndex];
                                                    break;
                                                case "HEMATOCRITO":
                                                    labDia.hemograma.Hto = textArray[i][valueIndex];
                                                    break;
                                                case "V.C.M":
                                                    labDia.hemograma.VCM = textArray[i][valueIndex];
                                                    break;
                                                case "C.H.C.M":
                                                    labDia.hemograma.CHCM = textArray[i][valueIndex];
                                                    break;
                                                case "PLAQUETAS":
                                                    labDia.hemograma.Plaquetas = textArray[i][valueIndex];
                                                    break;
                                                case "LEUCOCITOS":
                                                    labDia.hemograma.Leucocitos = textArray[i][valueIndex];
                                                    break;
                                                case "RAN":
                                                    labDia.hemograma.RAN = textArray[i][valueIndex];
                                                    break;
                                                case "SEGMENTADOS":
                                                    labDia.hemograma.Segmentados = textArray[i][valueIndex];
                                                    break;
                                                case "LINFOCITOS":
                                                    labDia.hemograma.Linfocitos = textArray[i][valueIndex];
                                                    break;
                                                case "pH":
                                                    labDia.gases.pH = textArray[i][valueIndex];
                                                    break; 
                                                case "pCO2":
                                                    labDia.gases.pCO2 = textArray[i][valueIndex];
                                                    break;
                                                case "pO2":
                                                    labDia.gases.pO2 = textArray[i][valueIndex];
                                                    break;
                                                case "EXCESO DE BASE":
                                                    labDia.gases.EB = textArray[i][valueIndex];
                                                    break;
                                                case "HCO3":
                                                    labDia.gases.HCO3 = textArray[i][valueIndex];
                                                    break;
                                                // case "HCO3 st":
                                                //     labDia.gases.HCO3 = textArray[i][valueIndex];
                                                //     break;
                                                case "SODIO":
                                                    labDia.electrolitos.Na = textArray[i][valueIndex];
                                                    break;
                                                case "POTASIO":
                                                    labDia.electrolitos.K = textArray[i][valueIndex];
                                                    break;
                                                case "CLORO":
                                                    labDia.electrolitos.Cl = textArray[i][valueIndex];
                                                    break;
                                                case "CALCIO IONICO":
                                                    labDia.electrolitos.Ca = textArray[i][valueIndex];
                                                    break;
                                                case "FOSFORO":
                                                    labDia.electrolitos.P = textArray[i][valueIndex];
                                                    break;
                                                case "MAGNESIO":
                                                    labDia.electrolitos.Mg = textArray[i][valueIndex];
                                                    break;
                                                case "CREATININA":
                                                    labDia.funcionRenal.Crea = textArray[i][valueIndex];
                                                    break;
                                                case "NITROGENO UREICO":
                                                    labDia.funcionRenal.BUN = textArray[i][valueIndex];
                                                    break;
                                                case "LDH":
                                                    labDia.otros.LDH = textArray[i][valueIndex];
                                                    break;
                                                case "PROTEINA C REACTIVA":
                                                    labDia.otros.PCR = textArray[i][valueIndex];
                                                    break;
                                                case "TIEMPO DE TROMBOPLASTINA":
                                                    labDia.coagulacion.TTP = textArray[i][valueIndex];
                                                    break;
                                                case "TIEMPO DE PROTROMBINA %":
                                                    labDia.coagulacion.TP = textArray[i][valueIndex];
                                                    break;
                                                case "INR":
                                                    labDia.coagulacion.INR = textArray[i][valueIndex];
                                                    break;
                                                case "BILIRRUBINA TOTAL":
                                                    labDia.funcionHepatica.BiliT = textArray[i][valueIndex];
                                                    break;
                                                case "BILIRRUBINA DIRECTA":
                                                    labDia.funcionHepatica.BiliD = textArray[i][valueIndex];
                                                    break;
                                                case "PROTEINAS TOTALES":
                                                    labDia.funcionHepatica.Proteinas = textArray[i][valueIndex];
                                                    break;
                                                case "ALBUMINA":
                                                    labDia.funcionHepatica.Albumina = textArray[i][valueIndex];
                                                    break;
                                                case "GGT":
                                                    labDia.funcionHepatica.GGT = textArray[i][valueIndex];
                                                    break;
                                                case "FOSFATASA ALCALINA":
                                                    labDia.funcionHepatica.FA = textArray[i][valueIndex];
                                                    break;
                                                case "GPT/ALT":
                                                    labDia.funcionHepatica.GPT = textArray[i][valueIndex];
                                                    break;
                                                case "GOT/AST":
                                                    labDia.funcionHepatica.GOT = textArray[i][valueIndex];
                                                    break;
                                                default:
                                                    break;
                                            }
                                        } else {
                                            console.log("No se encontró el valor posterior para el examen " + nombresExamenes[j] + " en la posición " + k);
                                        }
                                        // break;  // Exit the loop once the element is found
                                    }
                                }
                            }
                            
                            console.log(labDia);
                        }
                        console.log(labDia);
                        // creat div with the results inside div id primera
                        // let div = document.createElement('div');
                        // div.id = 'resultados';
                        // div.innerHTML = ´>${labDia.fecha.getDay()}/}
                        // document.getElementById('primera').appendChild(div);
                        function formatDate(date) {
                            return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
                        }
                            
                        function formatTime(time) {
                            return time;
                        }
                            
                            // function formatSection(title, data) {
                            //   // if data === null, return empty string
                            //   
                            //   const items = Object.entries(data).map(([key, value]) => `${key} ${value}`).join(', ');
                            //   return `- ${title} ${items}`;
                            // }
                        function formatSection(title, data) {
                            // If data is null or an empty object, return empty string
                            if (data === null || Object.keys(data).length === 0) {
                                return '';
                            }
                            
                            // Filter out entries with null values
                            const filteredEntries = Object.entries(data).filter(([key, value]) => value !== null);
                            
                            // Convert filtered entries to an array of strings
                            const items = filteredEntries.map(([key, value]) => `${key} ${value}`).join(', ');
                            
                            // Return the formatted section
                            return `- ${title}: ${items}`;
                        }
                        const formattedDate = formatDate(new Date(labDia.fecha));
                        const formattedTime = formatTime(labDia.hora);
                        let examenesStringsArray = [];
                        examenesStringsArray.push(formatSection('Hemograma', labDia.hemograma));
                        examenesStringsArray.push(formatSection('Gases', labDia.gases));
                        examenesStringsArray.push(formatSection('Funcion Renal', labDia.funcionRenal));
                        examenesStringsArray.push(formatSection('Electrolitos', labDia.electrolitos));
                        examenesStringsArray.push(formatSection('Funcion Hepatica', labDia.funcionHepatica));
                        examenesStringsArray.push(formatSection('Coagulacion', labDia.coagulacion));
                        examenesStringsArray.push(formatSection('Otros', labDia.otros));
                        
                        let finalString = `>${formattedDate} ${formattedTime}:`;
                        //\n  ${hemogramaStr}\n  ${gasesStr}\n  ${funcionRenalStr}\n  ${electrolitosStr}`;
                        for (let i = 0; i < examenesStringsArray.length; i++) {
                            const element = examenesStringsArray[i];
                            finalString += `\n ${element}`;
                        }
                        document.getElementById('outputDiv').textContent = finalString;
                        // select text from text outputDiv and copy to clipboard
                        document.getElementById('outputDiv').select();
                        document.execCommand('copy');


                    }
                    */
                    return textArray;
                })
                .then(function (textArray) {
                        console.log("el array de textos en el siguiente .then() es: \n");
                        console.log(textArray);
                        let labDia = new diaExamen(textArray[0][5].substring(0, 10),textArray[0][5].substring(11, 16));
                        
                        console.log("FECHAAAA " + labDia.fecha);
                        console.log("horaaaaa " + labDia.hora);
                        let dateString = labDia.fecha;
                        let [day, month, year] = dateString.split('/');

                        // Ensure the components are in the correct order (DD/MM/YYYY)
                        let dateObject = new Date(`${month}/${day}/${year}`);
                        console.log(dateObject);
                        let timeString = labDia.hora;
                        let [hours, minutes] = timeString.split(':');

                        // Set the time components to the Date object
                        dateObject.setHours(parseInt(hours, 10), parseInt(minutes, 10));
                        labDia.fecha = dateObject;

                        console.log("largo de:" + textArray[0][1].length);

                        for (let i = 0; i < textArray.length; i++) {

                            for (let k = 0; k < textArray[i].length; k++) {
                                for (let j = 0; j < nombresExamenes.length; j++) {
                                    console.log(textArray[1][k]);
                                    // console.log("i es " + i + ", k es " + k + " y j es " + j);
                                    ////////////// aquí añadir el /\s asterisco antes del /
                                    const elementWithoutSpaces = textArray[i][k].replace(/\s*/, '');
                        
                        
                                    if (elementWithoutSpaces == nombresExamenes[j]) {
                                        // Check if the element matches the exam name
                                        let valueIndex = k + 1;
                                        if (valueIndex < textArray[i].length) {
                                            console.log("Para el examen " + nombresExamenes[j] + " en la posición " + k + " el valor post es " + textArray[i][valueIndex]);
                                            switch (nombresExamenes[j]) {
                                                case "HEMOGLOBINA":
                                                    labDia.hemograma.Hb = textArray[i][valueIndex];
                                                    break;
                                                case "HEMATOCRITO":
                                                    labDia.hemograma.Hto = textArray[i][valueIndex];
                                                    break;
                                                case "V.C.M":
                                                    labDia.hemograma.VCM = textArray[i][valueIndex];
                                                    break;
                                                case "C.H.C.M":
                                                    labDia.hemograma.CHCM = textArray[i][valueIndex];
                                                    break;
                                                case "PLAQUETAS":
                                                    labDia.hemograma.Plaquetas = textArray[i][valueIndex];
                                                    break;
                                                case "LEUCOCITOS":
                                                    labDia.hemograma.Leucocitos = textArray[i][valueIndex];
                                                    break;
                                                case "RAN":
                                                    labDia.hemograma.RAN = textArray[i][valueIndex];
                                                    break;
                                                case "SEGMENTADOS":
                                                    labDia.hemograma.Segmentados = textArray[i][valueIndex];
                                                    break;
                                                case "LINFOCITOS":
                                                    labDia.hemograma.Linfocitos = textArray[i][valueIndex];
                                                    break;
                                                case "pH":
                                                    labDia.gases.pH = textArray[i][valueIndex];
                                                    break; 
                                                case "pCO2":
                                                    labDia.gases.pCO2 = textArray[i][valueIndex];
                                                    break;
                                                case "pO2":
                                                    labDia.gases.pO2 = textArray[i][valueIndex];
                                                    break;
                                                case "EXCESO DE BASE":
                                                    labDia.gases.EB = textArray[i][valueIndex];
                                                    break;
                                                case "HCO3":
                                                    labDia.gases.HCO3 = textArray[i][valueIndex];
                                                    break;
                                                // case "HCO3 st":
                                                //     labDia.gases.HCO3 = textArray[i][valueIndex];
                                                //     break;
                                                case "SODIO":
                                                    labDia.electrolitos.Na = textArray[i][valueIndex];
                                                    break;
                                                case "POTASIO":
                                                    labDia.electrolitos.K = textArray[i][valueIndex];
                                                    break;
                                                case "CLORO":
                                                    labDia.electrolitos.Cl = textArray[i][valueIndex];
                                                    break;
                                                case "CALCIO IONICO":
                                                    labDia.electrolitos.Ca = textArray[i][valueIndex];
                                                    break;
                                                case "FOSFORO":
                                                    labDia.electrolitos.P = textArray[i][valueIndex];
                                                    break;
                                                case "MAGNESIO":
                                                    labDia.electrolitos.Mg = textArray[i][valueIndex];
                                                    break;
                                                case "CREATININA":
                                                    labDia.funcionRenal.Crea = textArray[i][valueIndex];
                                                    break;
                                                case "NITROGENO UREICO":
                                                    labDia.funcionRenal.BUN = textArray[i][valueIndex];
                                                    break;
                                                case "LDH":
                                                    labDia.otros.LDH = textArray[i][valueIndex];
                                                    break;
                                                case "PROTEINA C REACTIVA":
                                                    labDia.otros.PCR = textArray[i][valueIndex];
                                                    break;
                                                case "TIEMPO DE TROMBOPLASTINA":
                                                    labDia.coagulacion.TTP = textArray[i][valueIndex];
                                                    break;
                                                case "TIEMPO DE PROTROMBINA %":
                                                    labDia.coagulacion.TP = textArray[i][valueIndex];
                                                    break;
                                                case "INR":
                                                    labDia.coagulacion.INR = textArray[i][valueIndex];
                                                    break;
                                                case "BILIRRUBINA TOTAL":
                                                    labDia.funcionHepatica.BiliT = textArray[i][valueIndex];
                                                    break;
                                                case "BILIRRUBINA DIRECTA":
                                                    labDia.funcionHepatica.BiliD = textArray[i][valueIndex];
                                                    break;
                                                case "PROTEINAS TOTALES":
                                                    labDia.funcionHepatica.Proteinas = textArray[i][valueIndex];
                                                    break;
                                                case "ALBUMINA":
                                                    labDia.funcionHepatica.Albumina = textArray[i][valueIndex];
                                                    break;
                                                case "GGT":
                                                    labDia.funcionHepatica.GGT = textArray[i][valueIndex];
                                                    break;
                                                case "FOSFATASA ALCALINA":
                                                    labDia.funcionHepatica.FA = textArray[i][valueIndex];
                                                    break;
                                                case "GPT/ALT":
                                                    labDia.funcionHepatica.GPT = textArray[i][valueIndex];
                                                    break;
                                                case "GOT/AST":
                                                    labDia.funcionHepatica.GOT = textArray[i][valueIndex];
                                                    break;
                                                default:
                                                    break;
                                            }
                                        } else {
                                            console.log("No se encontró el valor posterior para el examen " + nombresExamenes[j] + " en la posición " + k);
                                        }
                                        // break;  // Exit the loop once the element is found
                                    }
                                }
                            }

                            
                            console.log(labDia);
                        }
                        console.log(labDia);
                        // creat div with the results inside div id primera
                        // let div = document.createElement('div');
                        // div.id = 'resultados';
                        // div.innerHTML = ´>${labDia.fecha.getDay()}/}
                        // document.getElementById('primera').appendChild(div);
                        function formatDate(date) {
                            return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
                        }
                            
                        function formatTime(time) {
                            return time;
                        }
                            
                            // function formatSection(title, data) {
                            //   // if data === null, return empty string
                            //   
                            //   const items = Object.entries(data).map(([key, value]) => `${key} ${value}`).join(', ');
                            //   return `- ${title} ${items}`;
                            // }
                        function formatSection(title, data) {
                            // If data is null or an empty object, return empty string
                            if (data === null || Object.keys(data).length === 0) {
                                return '';
                            }
                            
                            // Filter out entries with null values
                            const filteredEntries = Object.entries(data).filter(([key, value]) => value !== null);
                            
                            // Convert filtered entries to an array of strings
                            
                            const items = filteredEntries.map(([key, value]) => `${key} ${value}`).join(', ');
                            
                            // Return the formatted section
                            return `- ${title}: ${items}`;
                        }
                        const formattedDate = formatDate(new Date(labDia.fecha));
                        const formattedTime = formatTime(labDia.hora);
                        let examenesStringsArray = [];
                        examenesStringsArray.push(formatSection('Hemograma', labDia.hemograma));
                        examenesStringsArray.push(formatSection('Gases', labDia.gases));
                        examenesStringsArray.push(formatSection('Función Renal', labDia.funcionRenal));
                        examenesStringsArray.push(formatSection('Electrolitos', labDia.electrolitos));
                        examenesStringsArray.push(formatSection('Función Hepática', labDia.funcionHepatica));
                        examenesStringsArray.push(formatSection('Coagulación', labDia.coagulacion));
                        examenesStringsArray.push(formatSection('Otros', labDia.otros));
                        
                        let finalString = `>${formattedDate} ${formattedTime}:`;
                        //\n  ${hemogramaStr}\n  ${gasesStr}\n  ${funcionRenalStr}\n  ${electrolitosStr}`;
                        for (let i = 0; i < examenesStringsArray.length; i++) {
                            const element = examenesStringsArray[i];
                            finalString += `\n ${element}`;
                        }
                        
                        
                        document.getElementById('outputDiv').textContent = finalString + "\n" ;
                        // select text from text outputDiv and copy to clipboard
                        document.getElementById('outputDiv').select();
                    
                });
            });
        }
        
    });
};
  
