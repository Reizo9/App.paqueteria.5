/* app.js final: +Foto Guardia +Comentarios +Opcion Notificar +Historial Cards +COMPRESION + TOAST + RESPALDO + ZXING / BarcodeDetector + QR (Modo "Scan-All") + FIX LOGIN HASH + FIX BUGS */
(async function(){
  
  // --- INICIO SETUP DE jspdf ---
  let jsPDF;
  if(window.jspdf) {
    jsPDF = window.jspdf.jsPDF;
  }
  // --- FIN SETUP ---

  await openDB();

  async function hashText(text){
    const enc = new TextEncoder();
    const data = enc.encode(text);
    // --- CORRECCIÓN DE LOGIN (SHA-256) ---
    const hash = await crypto.subtle.digest('SHA-256', data); 
    const hex = [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,'0')).join('');
    return hex;
  }
  
  async function fileToDataURL(file){
    if(!file) return null;
    return new Promise((res,rej)=>{
      const r = new FileReader();
      r.onload = ()=>res(r.result);
      r.onerror = rej;
      r.readAsDataURL(file);
    });
  }

  // --- FUNCIÓN DE COMPRESIÓN (sin cambios) ---
  async function compressImage(file, quality = 0.7, maxWidth = 1280) {
    if (!file) return null;
    const imageBi
