'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImportResult {
  imported: number;
  duplicates: number;
  errors: string[];
  total: number;
}

export function CSVUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      if (selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setError(null);
        setResult(null);
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
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simuleer progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('/api/leads/import', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload mislukt');
      }

      setResult(data);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout');
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    // Kolommen zoals in de afbeelding
    const headers = ['Bedrijfsnaam', 'Niche', 'Provider', 'TelefoonNummer', 'Adres', 'Postcode', 'Gemeente', 'Provincie', 'Email', 'Niet bellen'];
    const example = ['Voorbeeld BV', 'Dakwerken', 'Orange', '48382829', 'Straat 1', '3870', 'Amsterdam', 'Noord-Holland', 'info@voorbeeld.nl', 'Nee'];
    
    const csv = [headers.join(','), example.join(',')].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lead_import_template.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${file ? 'bg-green-50 border-green-500' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center gap-3">
          {file ? (
            <>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-green-700">{file.name}</p>
                <p className="text-sm text-green-600">
                  {(file.size / 1024).toFixed(1)} KB • Klik om te wijzigen
                </p>
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* Template download */}
      <div className="flex justify-between items-center text-sm">
        <button 
          onClick={downloadTemplate}
          className="text-blue-600 hover:text-blue-700 underline"
        >
          Download CSV template
        </button>
        <span className="text-gray-500">
          Vereiste kolommen: Bedrijfsnaam, TelefoonNummer
        </span>
      </div>

      {/* Upload knop */}
      {file && !result && (
        <button 
          onClick={handleUpload} 
          disabled={uploading}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium flex items-center justify-center gap-2"
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
            {progress < 100 ? 'CSV verwerken...' : 'Opslaan in database...'}
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
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

          {result.imported > 0 && (
            <a 
              href="/leads"
              className="block w-full mt-4 py-2 px-4 border border-gray-300 rounded-lg text-center hover:bg-gray-100 transition-colors"
            >
              Bekijk geïmporteerde leads →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
