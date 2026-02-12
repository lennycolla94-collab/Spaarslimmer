'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImportResult {
  imported: number;
  duplicates: number;
  errors: string[];
  totalRows: number;
}

export function CSVUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{headers: string[], rows: any[]} | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('Files dropped:', acceptedFiles);
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      if (selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setError(null);
        setResult(null);
        setPreview(null);
        
        // Preview the CSV
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          const lines = text.split('\n').filter(l => l.trim());
          if (lines.length > 0) {
            const delimiter = (lines[0].match(/;/g) || []).length > (lines[0].match(/,/g) || []).length ? ';' : ',';
            const headers = lines[0].split(delimiter).map(h => h.trim());
            const rows = lines.slice(1, 4).map(line => {
              const values = line.split(delimiter);
              const row: any = {};
              headers.forEach((h, i) => {
                row[h] = values[i]?.trim();
              });
              return row;
            });
            setPreview({ headers, rows });
          }
        };
        reader.readAsText(selectedFile);
      } else {
        setError('Alleen .csv bestanden toegestaan');
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1,
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('Starting upload for file:', file.name, 'Size:', file.size);
    setUploading(true);
    setProgress(0);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simuleer progress (sneller voor kleine bestanden)
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + (prev < 50 ? 5 : 2);
        });
      }, 100);

      console.log('Sending fetch request...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 min timeout

      const response = await fetch('/api/leads/import', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      clearInterval(progressInterval);
      
      console.log('Response received:', response.status);
      setProgress(100);

      let data;
      try {
        data = await response.json();
        console.log('Response data:', data);
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error('Ongeldige response van server');
      }

      if (!response.ok) {
        throw new Error(data.error || data.details || `Upload mislukt (${response.status})`);
      }

      setResult(data);

    } catch (err: any) {
      console.error('Upload error:', err);
      if (err.name === 'AbortError') {
        setError('Upload duurde te lang. Probeer een kleiner bestand of probeer het later opnieuw.');
      } else {
        setError(err instanceof Error ? err.message : 'Onbekende fout');
      }
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    // CSV Template met alle ondersteunde kolommen
    const headers = [
      'Bedrijfsnaam',      // Vereist - Naam van het bedrijf
      'TelefoonNummer',    // Vereist - Tel nr (bijv: 0467055788)
      'Contactpersoon',    // Optioneel - Naam contactpersoon
      'Niche',             // Optioneel - Branche/Sector
      'Adres',             // Optioneel - Straat + huisnummer
      'Postcode',          // Optioneel - Postcode
      'Gemeente',          // Optioneel - Stad/Gemeente
      'Provincie',         // Optioneel - Provincie
      'Email',             // Optioneel - E-mailadres
      'HuidigeProvider',   // Optioneel - Provider (Orange, Telenet, etc.)
    ];
    
    // Voorbeeld data
    const example1 = [
      'Bakkerij De Gouden Korst',
      '0467055788',
      'Jan Janssen',
      'Horeca',
      'Marktstraat 12',
      '3500',
      'Hasselt',
      'Limburg',
      'info@degoudenkorst.be',
      'Orange'
    ];
    
    const example2 = [
      'IT Solutions BV',
      '0493212121',
      'Pieter Peeters',
      'Technologie',
      'Stationslaan 45',
      '3000',
      'Leuven',
      'Vlaams-Brabant',
      'contact@itsolutions.be',
      'Telenet'
    ];
    
    // Maak CSV met BOM voor Excel compatibiliteit
    const BOM = '\uFEFF';
    const csv = [
      headers.join(';'),
      example1.join(';'),
      example2.join(';')
    ].join('\n');
    
    const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lead_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setProgress(0);
    setUploading(false);
    setPreview(null);
  };

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      {!file && (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
            ${isDragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
            }
          `}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-gray-100 rounded-full">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-700">
                {isDragActive ? 'Drop het CSV bestand hier' : 'Sleep CSV bestand hier of klik om te selecteren'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Ondersteunt: .csv (max 10MB)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Selected File */}
      {file && !result && (
        <div className="border-2 border-green-500 bg-green-50 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-green-700">{file.name}</p>
              <p className="text-sm text-green-600">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            {!uploading && (
              <button 
                onClick={reset}
                className="text-green-700 hover:text-green-800 underline text-sm"
              >
                Wijzigen
              </button>
            )}
          </div>
          
          {/* CSV Preview */}
          {preview && (
            <div className="mt-4 pt-4 border-t border-green-200">
              <p className="text-sm font-medium text-green-800 mb-2">Gevonden kolommen:</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {preview.headers.map((h, i) => (
                  <span key={i} className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded">
                    {h}
                  </span>
                ))}
              </div>
              <p className="text-xs text-green-700">
                {preview.rows.length} van {file.size > 1024 ? 'veel' : ''} rijen preview
              </p>
            </div>
          )}
        </div>
      )}

      {/* Template download */}
      <div className="flex justify-between items-center text-sm">
        <button 
          onClick={downloadTemplate}
          className="text-blue-600 hover:text-blue-700 underline"
        >
          Download CSV template
        </button>
        <span className="text-gray-500">
          CSV met ; scheidingsteken (Excel)
        </span>
      </div>

      {/* Upload knop */}
      {file && !result && (
        <button 
          onClick={handleUpload} 
          disabled={uploading}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
        >
          {uploading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Bezig met importeren...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Importeer {file.name}
            </>
          )}
        </button>
      )}

      {/* Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-sm text-gray-600">
            {progress < 100 ? 'CSV verwerken...' : 'Bijna klaar...'}
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-medium">Import mislukt</p>
              <p className="text-sm">{error}</p>
              <button 
                onClick={reset}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Probeer opnieuw
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resultaten */}
      {result && (
        <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h3 className="font-semibold text-gray-900">
              Import voltooid
            </h3>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <p className="text-2xl font-bold text-green-600">{result.imported}</p>
              <p className="text-xs text-gray-600">Geïmporteerd</p>
            </div>
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <p className="text-2xl font-bold text-yellow-600">{result.duplicates}</p>
              <p className="text-xs text-gray-600">Duplicaten</p>
            </div>
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <p className="text-2xl font-bold text-red-600">{result.errors?.length || 0}</p>
              <p className="text-xs text-gray-600">Fouten</p>
            </div>
          </div>

          {result.errors && result.errors.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-red-600 mb-2">
                Fouten gevonden:
              </p>
              <ul className="text-sm text-red-600 max-h-32 overflow-y-auto space-y-1">
                {result.errors.slice(0, 5).map((err, idx) => (
                  <li key={idx} className="text-xs">• {err}</li>
                ))}
                {result.errors.length > 5 && (
                  <li className="text-xs italic">... en {result.errors.length - 5} meer</li>
                )}
              </ul>
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <a 
              href="/leads"
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700 transition-colors"
            >
              Bekijk leads →
            </a>
            <button 
              onClick={reset}
              className="py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Nieuwe import
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
