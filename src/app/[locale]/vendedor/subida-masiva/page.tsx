'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Upload, FileSpreadsheet, Download, CheckCircle2, AlertCircle,
  ArrowLeft, Loader2, Package, Tag, Layers, X, Eye,
} from 'lucide-react';

interface ProductResult {
  name: string;
  description?: string;
  category?: string;
  sku?: string;
  basePrice: number;
  compareAtPrice?: number;
  stock: number;
  variantCount: number;
  variants: Array<{ name: string; sku: string; price: number; stockQuantity: number }>;
  status: string;
}

interface UploadResponse {
  success: boolean;
  message?: string;
  error?: string;
  summary?: {
    totalRows: number;
    productsFound: number;
    totalVariants: number;
    validationErrors: number;
    categories: string[];
    priceRange: { min: number; max: number } | null;
  };
  products?: ProductResult[];
  errors?: string[];
}

export default function SubidaMasivaPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || 'es';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResponse | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<ProductResult | null>(null);

  const loadSheetJS = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      if ((window as any).XLSX) { resolve(); return; }
      const script = document.createElement('script');
      script.src = 'https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('No se pudo cargar la librería de Excel'));
      document.head.appendChild(script);
    });
  }, []);

  const parseExcelFile = useCallback(async (file: File): Promise<Record<string, any>[]> => {
    await loadSheetJS();
    const XLSX = (window as any).XLSX;
    if (!XLSX) throw new Error('Librería XLSX no disponible');

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          // range: 2 skips the title row and subtitle row, uses row 3 as headers
          const json = XLSX.utils.sheet_to_json(firstSheet, { defval: '', range: 2 });
          resolve(json);
        } catch (err) { reject(err); }
      };
      reader.onerror = () => reject(new Error('Error leyendo el archivo'));
      reader.readAsArrayBuffer(file);
    });
  }, [loadSheetJS]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.name.match(/\.(xlsx|xls|csv)$/i)) {
        alert('Solo se aceptan archivos .xlsx, .xls o .csv');
        return;
      }
      setFile(selected);
      setResult(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.name.match(/\.(xlsx|xls|csv)$/i)) {
      setFile(dropped);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setResult(null);

    try {
      const rows = await parseExcelFile(file);

      if (!rows || rows.length === 0) {
        setResult({ success: false, error: 'No se encontraron datos en el archivo. Verifica que la pestaña "Productos" contiene datos.' });
        setUploading(false);
        return;
      }

      // Filter out empty rows
      const validRows = rows.filter((row: Record<string, any>) => {
        const name = row['nombre *'] || row['nombre'] || row['name'] || row['nombre_producto'] || '';
        return name.toString().trim() !== '';
      });

      // Rename "nombre *" to "nombre" for the API
      const cleanRows = validRows.map((row: Record<string, any>) => {
        const clean: Record<string, any> = {};
        for (const [key, value] of Object.entries(row)) {
          const cleanKey = key.replace(' *', '').trim();
          clean[cleanKey] = value;
        }
        return clean;
      });

      const response = await fetch('/api/v1/products/bulk-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: cleanRows }),
      });

      const data: UploadResponse = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({ success: false, error: error.message || 'Error procesando el archivo' });
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.push(`/${locale}/vendedor/dashboard`)} className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#4A4A4A] hover:text-black transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-black">Subida Masiva de Productos</h1>
            <p className="text-[#4A4A4A] text-sm mt-1">Sube un archivo Excel con todos tus productos de una vez</p>
          </div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { step: 1, title: 'Descarga la plantilla', desc: 'Usa nuestra plantilla Excel con el formato correcto', icon: Download, color: 'from-blue-500 to-blue-600' },
            { step: 2, title: 'Rellena tus productos', desc: 'Añade nombre, precio, stock, categoría y variantes', icon: FileSpreadsheet, color: 'from-orange-500 to-red-600' },
            { step: 3, title: 'Sube el archivo', desc: 'Arrastra o selecciona tu Excel para importar todo', icon: Upload, color: 'from-green-500 to-emerald-600' },
          ].map(({ step, title, desc, icon: Icon, color }) => (
            <div key={step} className="bg-gray-50 rounded-2xl rounded-2xl p-5 relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${color}`} />
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5 text-black" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Paso {step}</span>
                  <h3 className="text-black font-semibold text-sm">{title}</h3>
                  <p className="text-[#4A4A4A] text-xs mt-1">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Download template */}
        <div className="bg-gray-50 rounded-2xl rounded-2xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-black font-semibold">Plantilla NexoMarket</h3>
                <p className="text-[#4A4A4A] text-xs">Excel con 10 productos de ejemplo, variantes y categorías</p>
              </div>
            </div>
            <a
              href="/plantilla-productos.xlsx"
              download
              className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-black font-semibold text-sm rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Descargar Plantilla
            </a>
          </div>
        </div>

        {/* Upload zone */}
        <div
          className={`bg-gray-50 border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
            dragOver ? 'border-blue-400 bg-blue-100' : 'border-gray-200 hover:border-gray-300'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {!file ? (
            <>
              <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-black font-semibold text-lg mb-2">
                {dragOver ? 'Suelta el archivo aquí' : 'Arrastra tu archivo Excel aquí'}
              </h3>
              <p className="text-[#4A4A4A] text-sm mb-4">o haz clic para seleccionar</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2.5 bg-gradient-to-r from-[#5B2FE8] to-[#7C5CF0] text-black font-semibold text-sm rounded-xl hover:opacity-90 transition-opacity"
              >
                Seleccionar archivo
              </button>
              <p className="text-gray-500 text-xs mt-3">Formatos aceptados: .xlsx, .xls, .csv (máx. 500 productos)</p>
            </>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <FileSpreadsheet className="w-10 h-10 text-blue-400" />
              <div className="text-left">
                <p className="text-black font-semibold">{file.name}</p>
                <p className="text-[#4A4A4A] text-xs">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button onClick={handleReset} className="p-2 rounded-lg hover:bg-gray-200 text-[#4A4A4A] hover:text-black">
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="px-6 py-2.5 bg-gradient-to-r from-[#FF6B35] to-[#FF8B5E] text-black font-semibold text-sm rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
              >
                {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Procesando...</> : <><Upload className="w-4 h-4" /> Subir Productos</>}
              </button>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFileSelect} className="hidden" />
        </div>

        {/* Results */}
        {result && (
          <div className="mt-6 space-y-4">
            {/* Summary card */}
            <div className={`rounded-2xl p-6 border ${result.success ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
              <div className="flex items-center gap-3 mb-4">
                {result.success ? <CheckCircle2 className="w-6 h-6 text-emerald-400" /> : <AlertCircle className="w-6 h-6 text-red-400" />}
                <h3 className={`font-bold text-lg ${result.success ? 'text-emerald-400' : 'text-red-400'}`}>
                  {result.success ? result.message : result.error}
                </h3>
              </div>

              {result.summary && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Filas procesadas', value: result.summary.totalRows, icon: Layers },
                    { label: 'Productos', value: result.summary.productsFound, icon: Package },
                    { label: 'Variantes', value: result.summary.totalVariants, icon: Tag },
                    { label: 'Errores', value: result.summary.validationErrors, icon: AlertCircle },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                      <Icon className="w-5 h-5 text-[#4A4A4A]" />
                      <div>
                        <p className="text-black font-bold text-lg">{value}</p>
                        <p className="text-[#4A4A4A] text-xs">{label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {result.summary?.priceRange && (
                <p className="text-[#4A4A4A] text-sm mt-3">
                  Rango de precios: <span className="text-black font-semibold">{result.summary.priceRange.min.toFixed(2)}€</span> — <span className="text-black font-semibold">{result.summary.priceRange.max.toFixed(2)}€</span>
                  {result.summary.categories.length > 0 && (
                    <> · Categorías: <span className="text-[#0066FF]">{result.summary.categories.join(', ')}</span></>
                  )}
                </p>
              )}
            </div>

            {/* Errors */}
            {result.errors && result.errors.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
                <h4 className="text-red-400 font-semibold mb-2">Errores de validación:</h4>
                <ul className="space-y-1">
                  {result.errors.map((err, i) => (
                    <li key={i} className="text-red-300 text-sm flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      {err}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Product table */}
            {result.products && result.products.length > 0 && (
              <div className="bg-gray-50 rounded-2xl rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h4 className="text-black font-semibold">Productos procesados</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        {['Producto', 'Categoría', 'Precio', 'Stock', 'Variantes', 'Estado', ''].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#4A4A4A] uppercase">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.products.map((p, i) => (
                        <tr key={i} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <p className="text-black font-medium text-sm">{p.name}</p>
                            {p.sku && <p className="text-gray-500 text-xs">SKU: {p.sku}</p>}
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-blue-100 text-[#0066FF] rounded-lg text-xs">{p.category || 'Sin categoría'}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-black font-semibold text-sm">{p.basePrice.toFixed(2)}€</span>
                            {p.compareAtPrice && <span className="text-gray-500 text-xs line-through ml-1">{p.compareAtPrice.toFixed(2)}€</span>}
                          </td>
                          <td className="px-4 py-3 text-[#4A4A4A] text-sm">{p.stock}</td>
                          <td className="px-4 py-3">
                            <span className="text-orange-300 text-sm font-medium">{p.variantCount}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                              p.status === 'activo' ? 'bg-green-100 text-green-600' :
                              p.status === 'pausado' ? 'bg-yellow-500/20 text-yellow-300' :
                              'bg-gray-500/20 text-[#4A4A4A]'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {p.variantCount > 0 && (
                              <button onClick={() => setPreviewProduct(previewProduct?.name === p.name ? null : p)} className="p-1.5 rounded-lg hover:bg-gray-200 text-[#4A4A4A] hover:text-black">
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Variant preview */}
            {previewProduct && previewProduct.variants.length > 0 && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4">
                <h4 className="text-[#0066FF] font-semibold mb-3">Variantes de {previewProduct.name}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {previewProduct.variants.map((v, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-black font-medium text-sm">{v.name}</p>
                      <p className="text-[#4A4A4A] text-xs">SKU: {v.sku}</p>
                      <div className="flex justify-between mt-1">
                        <span className="text-orange-300 text-sm font-semibold">{v.price.toFixed(2)}€</span>
                        <span className="text-[#4A4A4A] text-xs">Stock: {v.stockQuantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
