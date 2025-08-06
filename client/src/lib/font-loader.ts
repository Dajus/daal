// Helper functions to load custom fonts into jsPDF

export const loadRobotoFont = async (): Promise<string | null> => {
  try {
    const response = await fetch('/fonts/roboto-regular.ttf');
    if (!response.ok) {
      throw new Error('Font file not found');
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Convert to base64
    let binary = '';
    const len = uint8Array.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    
    return btoa(binary);
  } catch (error) {
    console.error('Failed to load Roboto font:', error);
    return null;
  }
};

export const addRobotoToJSPDF = (pdf: any, fontBase64: string): boolean => {
  try {
    pdf.addFileToVFS('Roboto-Regular.ttf', fontBase64);
    pdf.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
    return true;
  } catch (error) {
    console.error('Failed to add Roboto font to jsPDF:', error);
    return false;
  }
};