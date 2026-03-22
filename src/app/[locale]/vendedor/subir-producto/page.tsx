'use client';

import { useState, useRef } from 'react';
import { Plus, X, Upload, AlertCircle, Check, Loader, ImageIcon, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const CATEGORIES = [
  'Electrónica',
  'Ropa y Accesorios',
  'Hogar y Jardín',
  'Deportes',
  'Libros',
  'Juguetes',
  'Belleza',
  'Alimentos',
];

const SELLING_UNITS = [
  { value: 'unidad', label: 'Unidad' },
  { value: 'metro', label: 'Metro' },
  { value: 'kilogramo', label: 'Kilogramo (kg)' },
  { value: 'litro', label: 'Litro (L)' },
  { value: 'm2', label: 'Metro cuadrado (m²)' },
  { value: 'pack', label: 'Pack' },
];

const VARIANT_PRESETS = {
  talla: {
    name: 'Talla',
    key: 'talla',
    values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  color: {
    name: 'Color',
    key: 'color',
    values: ['Negro', 'Blanco', 'Rojo', 'Azul', 'Verde'],
  },
  material: {
    name: 'Material',
    key: 'material',
    values: ['Algodón', 'Poliéster', 'Lino', 'Seda'],
  },
  almacenamiento: {
    name: 'Almacenamiento',
    key: 'almacenamiento',
    values: ['64GB', '128GB', '256GB', '512GB', '1TB'],
  },
};

interface VariantType {
  id: string;
  name: string;
  key: string;
  values: string[];
}

interface Variant {
  id: string;
  options: Record<string, string>;
  sku: string;
  price: string;
  stock: string;
}

export default function SubirProductoPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    comparePrice: '',
    stock: '',
    sku: '',
    weight: '',
    tags: [] as string[],
    variants: [] as Variant[],
    images: [] as string[],
    sellingUnit: 'unidad',
    minQuantity: '1',
    quantityStep: '1',
  });
  const [variantTypes, setVariantTypes] = useState<VariantType[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [newVariantType, setNewVariantType] = useState({ name: '', values: '' });
  const [isPublished, setIsPublished] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateVariantCombinations = (types: VariantType[]): Variant[] => {
    if (types.length === 0) return [];

    let combinations: Array<Record<string, string>> = [{}];

    for (const type of types) {
      const newCombinations: Array<Record<string, string>> = [];
      for (const combo of combinations) {
        for (const value of type.values) {
          newCombinations.push({ ...combo, [type.key]: value });
        }
      }
      combinations = newCombinations;
    }

    return combinations.map((combo, idx) => ({
      id: `variant-${idx}`,
      options: combo,
      sku: formData.sku ? `${formData.sku}-${idx}` : `VAR-${idx}`,
      price: formData.price,
      stock: '0',
    }));
  };

  const addVariantType = (preset?: keyof typeof VARIANT_PRESETS) => {
    if (preset) {
      const presetData = VARIANT_PRESETS[preset];
      const newType: VariantType = {
        id: `type-${Date.now()}`,
        name: presetData.name,
        key: presetData.key,
        values: presetData.values,
      };
      setVariantTypes(prev => [...prev, newType]);
    } else if (newVariantType.name && newVariantType.values) {
      const values = newVariantType.values
        .split(',')
        .map(v => v.trim())
        .filter(v => v.length > 0);

      if (values.length > 0) {
        const newType: VariantType = {
          id: `type-${Date.now()}`,
          name: newVariantType.name,
          key: newVariantType.name.toLowerCase().replace(/\s+/g, '_'),
          values,
        };
        setVariantTypes(prev => [...prev, newType]);
        setNewVariantType({ name: '', values: '' });
      }
    }
  };

  const removeVariantType = (id: string) => {
    setVariantTypes(prev => prev.filter(t => t.id !== id));
  };

  const removeVariantValue = (typeId: string, value: string) => {
    setVariantTypes(prev =>
      prev.map(t =>
        t.id === typeId
          ? { ...t, values: t.values.filter(v => v !== value) }
          : t
      )
    );
  };

  const updateVariantData = (variantId: string, field: 'price' | 'stock' | 'sku', value: string) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map(v =>
        v.id === variantId ? { ...v, [field]: value } : v
      ),
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remaining = 10 - imagePreviews.length;
    const filesToAdd = files.slice(0, remaining);

    filesToAdd.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      if (file.size > 10 * 1024 * 1024) return; // 10MB max

      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreviews((prev) => [...prev, ev.target?.result as string]);
        setImageFiles((prev) => [...prev, file]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input so the same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const fakeEvent = { target: { files } } as unknown as React.ChangeEvent<HTMLInputElement>;
    handleImageSelect(fakeEvent);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const addTag = () => {
    if (currentTag.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // Create the product via API
      const productRes = await fetch('/api/v1/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          basePrice: parseFloat(formData.price),
          compareAtPrice: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined,
          stock: parseInt(formData.stock),
          sku: formData.sku || undefined,
          weight: formData.weight ? parseFloat(formData.weight) : undefined,
          tags: formData.tags,
          sellingUnit: formData.sellingUnit,
          minQuantity: formData.sellingUnit !== 'unidad' ? parseFloat(formData.minQuantity) : undefined,
          quantityStep: formData.sellingUnit !== 'unidad' ? parseFloat(formData.quantityStep) : undefined,
          variantTypes: variantTypes.length > 0 ? variantTypes : undefined,
          variants: formData.variants.length > 0 ? formData.variants.map(v => ({
            name: Object.entries(v.options).map(([_, val]) => val).join(' / '),
            sku: v.sku,
            price: parseFloat(v.price),
            stock: parseInt(v.stock),
            attributes: v.options,
          })) : undefined,
        }),
      });

      if (!productRes.ok) {
        const err = await productRes.json();
        throw new Error(err.error || 'Error al crear producto');
      }

      const product = await productRes.json();

      // Upload images if any
      if (imagePreviews.length > 0) {
        for (let i = 0; i < imagePreviews.length; i++) {
          await fetch(`/api/v1/products/${product.id}/images`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              base64: imagePreviews[i],
              altText: `${formData.name} - imagen ${i + 1}`,
              isPrimary: i === 0,
            }),
          });
        }
      }

      setIsPublished(true);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 4000);
    } catch (error) {
      console.error('Error publishing product:', error);
      alert(error instanceof Error ? error.message : 'Error al publicar producto');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUploadAnother = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      price: '',
      comparePrice: '',
      stock: '',
      sku: '',
      weight: '',
      tags: [],
      variants: [],
      images: [],
      sellingUnit: 'unidad',
      minQuantity: '1',
      quantityStep: '1',
    });
    setImagePreviews([]);
    setImageFiles([]);
    setVariantTypes([]);
    setNewVariantType({ name: '', values: '' });
    setIsPublished(false);
    setShowSuccessMessage(false);
    setStep(1);
  };

  const handleViewProduct = () => {
    // In a real app, this would navigate to the product page
    console.log('Viewing product:', formData.name);
  };

  const isStep1Valid = formData.name && formData.description && formData.category && formData.price && formData.stock;

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r text-black ">
          Subir Producto
        </h1>
        <p className="text-[#4A4A4A] text-lg">Añade un nuevo producto a tu tienda</p>
      </div>

      {/* Progress Steps */}
      <div className="flex gap-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-3">
            <button
              onClick={() => s <= step && setStep(s)}
              className={`h-12 w-12 rounded-full flex items-center justify-center font-bold transition-all ${
                s <= step
                  ? 'bg-gradient-to-r from-blue-600 to-blue-600 text-black'
                  : 'bg-gray-100 text-[#4A4A4A]'
              }`}
            >
              {s < step ? <Check className="h-6 w-6" /> : s}
            </button>
            {s < 3 && (
              <div className={`h-1 w-16 rounded-full ${s < step ? 'bg-gradient-to-r from-blue-600 to-blue-600' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Basic Information */}
      {step === 1 && (
        <Card className="p-8 border-0 shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-black">Información Básica</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Nombre del Producto</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ej: MacBook Pro 14 pulgadas"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-2">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe los detalles, características y beneficios del producto..."
                rows={5}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Categoría</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecciona una categoría</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">SKU</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  placeholder="Código único de identificación"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Precio €</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">Precio Comparación €</label>
                <input
                  type="number"
                  value={formData.comparePrice}
                  onChange={(e) => handleInputChange('comparePrice', e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">Stock</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => handleInputChange('stock', e.target.value)}
                  placeholder="0"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-2">Peso de Envío (kg)</label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                placeholder="0.00"
                step="0.01"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => setStep(2)}
              disabled={!isStep1Valid}
              className="gap-2 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-800 text-black disabled:opacity-50"
            >
              Siguiente Paso →
            </Button>
          </div>
        </Card>
      )}

      {/* Step 2: Images & Variants */}
      {step === 2 && (
        <Card className="p-8 border-0 shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-black">Imágenes y Variantes</h2>

          {/* Images Upload */}
          <div>
            <label className="block text-sm font-semibold text-black mb-4">
              Imágenes del Producto ({imagePreviews.length}/10)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />

            {/* Image previews grid */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                {imagePreviews.map((src, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border-2 border-gray-300 aspect-square">
                    <img
                      src={src}
                      alt={`Producto ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {idx === 0 && (
                      <div className="absolute top-2 left-2 bg-blue-600 text-black text-xs font-bold px-2 py-1 rounded-md">
                        Principal
                      </div>
                    )}
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-black rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Drop zone */}
            {imagePreviews.length < 10 && (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center bg-gradient-to-br from-blue-500/10 to-transparent hover:border-blue-400 transition-colors cursor-pointer"
              >
                <Upload className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                <p className="font-semibold text-black">Arrastra imágenes aquí o haz clic para seleccionar</p>
                <p className="text-sm text-[#4A4A4A] mt-1">PNG, JPG, WebP hasta 10MB. Máximo 10 imágenes</p>
              </div>
            )}
          </div>

          {/* Selling Unit Section */}
          <div>
            <label className="block text-sm font-semibold text-black mb-4">Unidad de Venta</label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <select
                  value={formData.sellingUnit}
                  onChange={(e) => {
                    handleInputChange('sellingUnit', e.target.value);
                    if (e.target.value === 'unidad') {
                      handleInputChange('minQuantity', '1');
                      handleInputChange('quantityStep', '1');
                    }
                  }}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {SELLING_UNITS.map(unit => (
                    <option key={unit.value} value={unit.value}>{unit.label}</option>
                  ))}
                </select>
              </div>

              {formData.sellingUnit !== 'unidad' && (
                <>
                  <div>
                    <input
                      type="number"
                      value={formData.minQuantity}
                      onChange={(e) => handleInputChange('minQuantity', e.target.value)}
                      placeholder="Cantidad mínima"
                      step="0.01"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-[#4A4A4A] mt-1">Mín. permitida</p>
                  </div>

                  <div>
                    <input
                      type="number"
                      value={formData.quantityStep}
                      onChange={(e) => handleInputChange('quantityStep', e.target.value)}
                      placeholder="Incremento"
                      step="0.01"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-[#4A4A4A] mt-1">Incremento</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Variant Types Section */}
          <div>
            <label className="block text-sm font-semibold text-black mb-4">Tipos de Variante</label>

            {/* Preset Buttons */}
            <div className="mb-4 flex flex-wrap gap-2">
              <p className="text-xs text-[#4A4A4A] w-full mb-2">Presets rápidos:</p>
              {Object.entries(VARIANT_PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => addVariantType(key as keyof typeof VARIANT_PRESETS)}
                  disabled={variantTypes.some(t => t.key === preset.key)}
                  className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  + {preset.name}
                </button>
              ))}
            </div>

            {/* Custom Variant Type Input */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-4">
              <div>
                <input
                  type="text"
                  value={newVariantType.name}
                  onChange={(e) => setNewVariantType(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nombre (ej: Talla, Color)"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <input
                  type="text"
                  value={newVariantType.values}
                  onChange={(e) => setNewVariantType(prev => ({ ...prev, values: e.target.value }))}
                  placeholder="Valores separados por coma (ej: S, M, L)"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-[#4A4A4A] mt-1">Separa con comas</p>
              </div>

              <Button
                onClick={() => addVariantType()}
                disabled={!newVariantType.name || !newVariantType.values}
                className="gap-2 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-800 text-black disabled:opacity-50 h-fit"
              >
                <Plus className="h-4 w-4" />
                Añadir Tipo
              </Button>
            </div>

            {/* Added Variant Types */}
            {variantTypes.length > 0 && (
              <div className="space-y-3 mb-6">
                {variantTypes.map((type) => (
                  <div key={type.id} className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-black">{type.name}</h4>
                      <button
                        onClick={() => removeVariantType(type.id)}
                        className="text-red-600 hover:bg-red-100 rounded-lg p-2 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {type.values.map((value) => (
                        <span
                          key={value}
                          className="inline-flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm font-medium text-black"
                        >
                          {value}
                          <button
                            onClick={() => removeVariantValue(type.id, value)}
                            className="text-gray-500 hover:text-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Variant Matrix */}
            {variantTypes.length > 0 && (
              <div>
                <button
                  onClick={() => setFormData(prev => ({ ...prev, variants: generateVariantCombinations(variantTypes) }))}
                  className="mb-4 px-4 py-2 bg-blue-100 border border-blue-300 rounded-lg text-sm font-medium text-blue-700 hover:bg-blue-200 transition-colors"
                >
                  Generar Combinaciones ({generateVariantCombinations(variantTypes).length} variantes)
                </button>

                {formData.variants.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-black mb-3">Matriz de Variantes</h4>
                    <div className="overflow-x-auto rounded-xl border border-gray-300">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-100 border-b border-gray-300">
                            <th className="px-4 py-3 text-left font-semibold text-black">SKU</th>
                            {variantTypes.map(type => (
                              <th key={type.id} className="px-4 py-3 text-left font-semibold text-black">{type.name}</th>
                            ))}
                            <th className="px-4 py-3 text-left font-semibold text-black">Precio €</th>
                            <th className="px-4 py-3 text-left font-semibold text-black">Stock</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.variants.map((variant) => (
                            <tr key={variant.id} className={parseInt(variant.stock) === 0 ? 'bg-gray-50 opacity-60' : 'hover:bg-blue-50'}>
                              <td className="px-4 py-3 text-black font-medium">
                                <input
                                  type="text"
                                  value={variant.sku}
                                  onChange={(e) => updateVariantData(variant.id, 'sku', e.target.value)}
                                  className="w-full px-2 py-1 bg-white border border-gray-300 rounded text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </td>
                              {variantTypes.map(type => (
                                <td key={type.id} className="px-4 py-3 text-black font-medium">
                                  {variant.options[type.key]}
                                </td>
                              ))}
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  value={variant.price}
                                  onChange={(e) => updateVariantData(variant.id, 'price', e.target.value)}
                                  step="0.01"
                                  className="w-full px-2 py-1 bg-white border border-gray-300 rounded text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  value={variant.stock}
                                  onChange={(e) => updateVariantData(variant.id, 'stock', e.target.value)}
                                  className="w-full px-2 py-1 bg-white border border-gray-300 rounded text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <Button
              onClick={() => setStep(1)}
              variant="outline"
              className="border-gray-300 hover:bg-gray-100"
            >
              ← Atrás
            </Button>
            <Button
              onClick={() => setStep(3)}
              className="gap-2 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-800 text-black"
            >
              Siguiente Paso →
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3: Tags & Publish */}
      {step === 3 && (
        <Card className="p-8 border-0 shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-black">Etiquetas y Publicación</h2>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-black mb-4">Etiquetas</label>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                placeholder="Escribe una etiqueta y presiona Enter"
                className="flex-1 rounded-xl border border-gray-300 px-4 py-3 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button
                onClick={addTag}
                disabled={!currentTag.trim()}
                className="gap-2 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-800 text-black disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, idx) => (
                  <span key={idx} className="bg-gradient-to-r from-blue-50 to-blue-50 border border-blue-200 text-blue-400 px-4 py-2 rounded-full flex items-center gap-2 font-medium">
                    {tag}
                    <button
                      onClick={() => removeTag(idx)}
                      className="hover:text-blue-900"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-700/50 rounded-xl p-6">
            <h3 className="font-bold text-black mb-4">Resumen del Producto</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide">Nombre</p>
                <p className="font-semibold text-black">{formData.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide">Categoría</p>
                <p className="font-semibold text-black">{formData.category}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide">Precio</p>
                <p className="font-semibold text-black">{formData.price}€</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide">Stock</p>
                <p className="font-semibold text-black">{formData.stock} unidades</p>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {showSuccessMessage && (
            <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-500/50 rounded-xl p-4 flex items-start gap-4">
              <div className="rounded-full bg-emerald-500/30 p-2 flex-shrink-0">
                <Check className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-emerald-300">¡Producto publicado correctamente!</p>
                <p className="text-sm text-emerald-200 mt-1">{formData.name} está ahora visible en tu tienda</p>
              </div>
            </div>
          )}

          {/* Publish Actions */}
          {!showSuccessMessage ? (
            <div className="flex gap-4">
              <Button
                onClick={() => {
                  setFormData({
                    name: '',
                    description: '',
                    category: '',
                    price: '',
                    comparePrice: '',
                    stock: '',
                    sku: '',
                    weight: '',
                    tags: [],
                    variants: [],
                    images: [],
                    sellingUnit: 'unidad',
                    minQuantity: '1',
                    quantityStep: '1',
                  });
                  setIsPublished(false);
                  setStep(1);
                }}
                variant="outline"
                className="flex-1 border-gray-300 hover:bg-gray-100 text-black"
              >
                Guardar como Borrador
              </Button>
              <Button
                onClick={handlePublish}
                disabled={isPublishing}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-800 text-black disabled:opacity-70 disabled:cursor-not-allowed gap-2"
              >
                {isPublishing ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Publicando...
                  </>
                ) : (
                  'Publicar Producto'
                )}
              </Button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Button
                onClick={handleViewProduct}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-black"
              >
                Ver Producto
              </Button>
              <Button
                onClick={handleUploadAnother}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-black"
              >
                Subir Otro
              </Button>
            </div>
          )}

          <div className="flex justify-start">
            <Button
              onClick={() => setStep(2)}
              variant="outline"
              className="border-gray-300 hover:bg-gray-100"
            >
              ← Atrás
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
