class PDFGenerator {
    static async generate(element, filename = 'CV.pdf') {
        const opt = {
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2, 
                letterRendering: true, 
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            },
            jsPDF: { 
                unit: 'in', 
                format: 'a4', 
                orientation: 'portrait' 
            }
        };
        
        return html2pdf().set(opt).from(element).save();
    }
}