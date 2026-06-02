'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, Search, Plus, Edit2, Trash2, ChevronDown, ChevronUp, 
  Eye, Save, X, DollarSign, MapPin, Layers, Layout, Key, Loader2 
} from 'lucide-react';

interface Unit {
  id: string;
  propertyId: string;
  name: string;
  price: number;
  size: string;
  bedrooms: number;
  bathrooms: number;
  status: string;
  description: string;
  floorPlanImage: string;
}

interface Property {
  id: string;
  name: string;
  slug: string;
  location: string;
  description: string;
  fullDescription: string;
  startingPrice: number;
  currency: string;
  status: string;
  type: string;
  bedrooms: string;
  bathrooms: string;
  sizeRange: string;
  mainImage: string;
  mapUrl: string;
  youtubeUrl: string;
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  units: Unit[];
}

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Collapsed sections
  const [expandedPropId, setExpandedPropId] = useState<string | null>(null);
  
  // Forms & Modal states
  const [activeTab, setActiveTab] = useState<'list' | 'property_form' | 'unit_form'>('list');
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [targetPropertyIdForUnit, setTargetPropertyIdForUnit] = useState<string>('');
  
  // Property Form State
  const [propId, setPropId] = useState('');
  const [propName, setPropName] = useState('');
  const [propSlug, setPropSlug] = useState('');
  const [propLocation, setPropLocation] = useState('');
  const [propDesc, setPropDesc] = useState('');
  const [propFullDesc, setPropFullDesc] = useState('');
  const [propPrice, setPropPrice] = useState(0);
  const [propCurrency, setPropCurrency] = useState('USD');
  const [propStatus, setPropStatus] = useState('Available');
  const [propType, setPropType] = useState('Apartment');
  const [propBedrooms, setPropBedrooms] = useState('1BHK, 2BHK, 3BHK');
  const [propBathrooms, setPropBathrooms] = useState('1-3');
  const [propSizeRange, setPropSizeRange] = useState('600–1,700 sq.ft');
  const [propMainImage, setPropMainImage] = useState('/assets/images/horizon.png');
  const [propMapUrl, setPropMapUrl] = useState('');
  const [propYoutubeUrl, setPropYoutubeUrl] = useState('');
  const [propFeatured, setPropFeatured] = useState(false);
  const [propSeoTitle, setPropSeoTitle] = useState('');
  const [propSeoDesc, setPropSeoDesc] = useState('');
  const [submittingProp, setSubmittingProp] = useState(false);

  // Unit Form State
  const [unitName, setUnitName] = useState('');
  const [unitPrice, setUnitPrice] = useState(0);
  const [unitSize, setUnitSize] = useState('');
  const [unitBedrooms, setUnitBedrooms] = useState(1);
  const [unitBathrooms, setUnitBathrooms] = useState(1);
  const [unitStatus, setUnitStatus] = useState('Available');
  const [unitDesc, setUnitDesc] = useState('');
  const [unitFloorPlan, setUnitFloorPlan] = useState('/assets/images/1.webp');
  const [submittingUnit, setSubmittingUnit] = useState(false);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/properties');
      if (!res.ok) throw new Error('Failed to load properties');
      const json = await res.json();
      if (json.success) {
        setProperties(json.data);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedPropId(expandedPropId === id ? null : id);
  };

  const handleOpenPropertyForm = (prop: Property | null = null) => {
    setEditingProperty(prop);
    if (prop) {
      setPropId(prop.id);
      setPropName(prop.name);
      setPropSlug(prop.slug);
      setPropLocation(prop.location);
      setPropDesc(prop.description);
      setPropFullDesc(prop.fullDescription);
      setPropPrice(prop.startingPrice);
      setPropCurrency(prop.currency);
      setPropStatus(prop.status);
      setPropType(prop.type);
      setPropBedrooms(prop.bedrooms);
      setPropBathrooms(prop.bathrooms);
      setPropSizeRange(prop.sizeRange);
      setPropMainImage(prop.mainImage);
      setPropMapUrl(prop.mapUrl || '');
      setPropYoutubeUrl(prop.youtubeUrl || '');
      setPropFeatured(prop.featured);
      setPropSeoTitle(prop.seoTitle || '');
      setPropSeoDesc(prop.seoDescription || '');
    } else {
      setPropId('');
      setPropName('');
      setPropSlug('');
      setPropLocation('');
      setPropDesc('');
      setPropFullDesc('');
      setPropPrice(0);
      setPropCurrency('USD');
      setPropStatus('Available');
      setPropType('Apartment');
      setPropBedrooms('1BHK, 2BHK, 3BHK');
      setPropBathrooms('1-3');
      setPropSizeRange('600–1,700 sq.ft');
      setPropMainImage('/assets/images/horizon.png');
      setPropMapUrl('');
      setPropYoutubeUrl('');
      setPropFeatured(false);
      setPropSeoTitle('');
      setPropSeoDesc('');
    }
    setActiveTab('property_form');
  };

  const handlePropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingProp(true);

    const payload = {
      id: propId,
      name: propName,
      slug: propSlug || propName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      location: propLocation,
      description: propDesc,
      fullDescription: propFullDesc,
      startingPrice: Number(propPrice),
      currency: propCurrency,
      status: propStatus,
      type: propType,
      bedrooms: propBedrooms,
      bathrooms: propBathrooms,
      sizeRange: propSizeRange,
      mainImage: propMainImage,
      mapUrl: propMapUrl,
      youtubeUrl: propYoutubeUrl,
      featured: propFeatured,
      seoTitle: propSeoTitle || `${propName} | Edifice Properties`,
      seoDescription: propSeoDesc || propDesc,
    };

    try {
      let res;
      if (editingProperty) {
        // Edit property
        res = await fetch(`/api/properties/${editingProperty.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // Create new property
        res = await fetch('/api/properties', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to save property');
      }

      await fetchProperties();
      setActiveTab('list');
    } catch (err: any) {
      alert(err.message || 'Error saving property');
    } finally {
      setSubmittingProp(false);
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property and all of its associated units?')) {
      return;
    }

    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete property');
      
      setProperties(properties.filter(p => p.id !== id));
      if (expandedPropId === id) setExpandedPropId(null);
    } catch (err: any) {
      alert(err.message || 'Error deleting property');
    }
  };

  const handleOpenUnitForm = (propertyId: string, unit: Unit | null = null) => {
    setTargetPropertyIdForUnit(propertyId);
    setEditingUnit(unit);
    if (unit) {
      setUnitName(unit.name);
      setUnitPrice(unit.price);
      setUnitSize(unit.size);
      setUnitBedrooms(unit.bedrooms);
      setUnitBathrooms(unit.bathrooms);
      setUnitStatus(unit.status);
      setUnitDesc(unit.description);
      setUnitFloorPlan(unit.floorPlanImage);
    } else {
      setUnitName('');
      setUnitPrice(0);
      setUnitSize('');
      setUnitBedrooms(1);
      setUnitBathrooms(1);
      setUnitStatus('Available');
      setUnitDesc('');
      setUnitFloorPlan('/assets/images/1.webp');
    }
    setActiveTab('unit_form');
  };

  const handleUnitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingUnit(true);

    const payload = {
      propertyId: targetPropertyIdForUnit,
      name: unitName,
      price: Number(unitPrice),
      size: unitSize,
      bedrooms: Number(unitBedrooms),
      bathrooms: Number(unitBathrooms),
      status: unitStatus,
      description: unitDesc,
      floorPlanImage: unitFloorPlan,
    };

    try {
      let res;
      if (editingUnit) {
        res = await fetch(`/api/units/${editingUnit.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/units', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to save unit');
      }

      await fetchProperties();
      setActiveTab('list');
      setExpandedPropId(targetPropertyIdForUnit);
    } catch (err: any) {
      alert(err.message || 'Error saving unit');
    } finally {
      setSubmittingUnit(false);
    }
  };

  const handleDeleteUnit = async (id: string, propertyId: string) => {
    if (!confirm('Are you sure you want to delete this unit?')) {
      return;
    }

    try {
      const res = await fetch(`/api/units/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete unit');
      
      await fetchProperties();
      setExpandedPropId(propertyId);
    } catch (err: any) {
      alert(err.message || 'Error deleting unit');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-500/10 text-green-400 border border-green-500/20';
      case 'Limited': return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      case 'Sold out': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'Under construction': return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
      default: return 'bg-zinc-800 text-zinc-400 border border-zinc-700';
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Tab controls */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
              activeTab === 'list' 
                ? 'bg-[#dfc28c] text-[#020c1b]' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Developments List
          </button>
        </div>
        
        {activeTab === 'list' && (
          <button
            onClick={() => handleOpenPropertyForm()}
            className="px-4 py-2 bg-[#dfc28c] hover:bg-[#d4af37] text-[#020c1b] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
          >
            <Plus size={14} />
            <span>New Property</span>
          </button>
        )}
      </div>

      {error && <div className="p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl text-xs font-semibold">{error}</div>}

      {/* VIEW: Property/Unit Lists */}
      {activeTab === 'list' && (
        <div className="flex flex-col gap-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Loader2 className="animate-spin text-[#dfc28c]" size={36} />
              <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Loading developments...</span>
            </div>
          ) : properties.length === 0 ? (
            <div className="bg-zinc-900 border border-white/5 p-16 text-center text-xs text-zinc-500 uppercase tracking-widest font-bold rounded-3xl">
              No developments registered yet.
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {properties.map((property) => {
                const isExpanded = expandedPropId === property.id;
                return (
                  <div key={property.id} className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden shadow-md">
                    {/* Property header block */}
                    <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#dfc28c] shrink-0">
                          <Building2 size={22} />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <h3 className="font-heading font-bold text-base text-white truncate">{property.name}</h3>
                          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                            <MapPin size={10} className="text-[#dfc28c]" />
                            {property.location}
                          </span>
                        </div>
                        
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${getStatusColor(property.status)}`}>
                          {property.status}
                        </span>

                        {property.featured && (
                          <span className="px-2 py-0.5 rounded bg-[#dfc28c]/10 border border-[#dfc28c]/20 text-[#dfc28c] text-[8px] font-bold uppercase tracking-wider">
                            Featured
                          </span>
                        )}
                      </div>

                      {/* Main control actions */}
                      <div className="flex items-center gap-3 self-end md:self-auto">
                        <button
                          onClick={() => handleOpenPropertyForm(property)}
                          className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors border border-white/5"
                        >
                          <Edit2 size={12} className="text-[#dfc28c]" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(property.id)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg transition-colors"
                          title="Delete Property"
                        >
                          <Trash2 size={13} />
                        </button>
                        
                        <div className="h-6 w-px bg-white/10 mx-1" />

                        <button
                          onClick={() => toggleExpand(property.id)}
                          className="p-2 bg-white/5 hover:bg-white/10 text-[#dfc28c] rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
                        >
                          <span>{property.units.length} Units</span>
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </div>
                    </div>

                    {/* Collapsible units section */}
                    {isExpanded && (
                      <div className="bg-black/30 border-t border-white/5 p-6 flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                          <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-zinc-400">Unit Layout Matrix</h4>
                          <button
                            onClick={() => handleOpenUnitForm(property.id)}
                            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-[#dfc28c] text-[10px] font-bold uppercase tracking-wider rounded-lg border border-white/5 flex items-center gap-1 transition-all"
                          >
                            <Plus size={12} />
                            <span>Add Unit Layout</span>
                          </button>
                        </div>

                        {property.units.length === 0 ? (
                          <div className="text-center py-8 text-xs text-zinc-500 uppercase tracking-widest font-bold">
                            No unit configurations created for this development.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {property.units.map((unit) => (
                              <div key={unit.id} className="bg-zinc-900 border border-white/5 rounded-2xl p-5 flex flex-col justify-between shadow-sm relative group">
                                <div className="flex flex-col gap-3">
                                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                    <h5 className="font-heading font-bold text-sm text-white">{unit.name}</h5>
                                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${getStatusColor(unit.status)}`}>
                                      {unit.status}
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] uppercase font-bold text-zinc-500">
                                    <div>Price: <span className="text-[#dfc28c]">${unit.price.toLocaleString()}</span></div>
                                    <div>Size: <span className="text-zinc-300">{unit.size}</span></div>
                                    <div>Bedrooms: <span className="text-zinc-300">{unit.bedrooms}</span></div>
                                    <div>Bathrooms: <span className="text-zinc-300">{unit.bathrooms}</span></div>
                                  </div>

                                  <p className="text-xs text-zinc-500 leading-relaxed italic line-clamp-2">
                                    &ldquo;{unit.description}&rdquo;
                                  </p>
                                </div>

                                <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-white/5">
                                  <button
                                    onClick={() => handleOpenUnitForm(property.id, unit)}
                                    className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded"
                                    title="Edit Unit"
                                  >
                                    <Edit2 size={12} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteUnit(unit.id, property.id)}
                                    className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded"
                                    title="Delete Unit"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* FORM: Property Create/Edit */}
      {activeTab === 'property_form' && (
        <form onSubmit={handlePropertySubmit} className="bg-zinc-900 border border-white/5 p-8 rounded-3xl shadow-md max-w-4xl flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="font-heading font-bold text-base text-white">
              {editingProperty ? `Edit Property: ${editingProperty.name}` : 'Create New Development'}
            </h3>
            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className="text-zinc-500 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Unique ID (e.g. horizon-residency)</label>
              <input
                type="text"
                required
                disabled={!!editingProperty}
                value={propId}
                onChange={(e) => setPropId(e.target.value)}
                placeholder="horizon-residency"
                className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c] disabled:opacity-50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Name of Development</label>
              <input
                type="text"
                required
                value={propName}
                onChange={(e) => {
                  setPropName(e.target.value);
                  if(!editingProperty) {
                    setPropSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                  }
                }}
                placeholder="Horizon Residency"
                className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Slug (URL path)</label>
              <input
                type="text"
                required
                value={propSlug}
                onChange={(e) => setPropSlug(e.target.value)}
                placeholder="horizon-residency"
                className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Suburbs Location</label>
              <input
                type="text"
                required
                value={propLocation}
                onChange={(e) => setPropLocation(e.target.value)}
                placeholder="Luthuli Avenue, Bugolobi"
                className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Starting Price</label>
              <input
                type="number"
                required
                value={propPrice}
                onChange={(e) => setPropPrice(Number(e.target.value))}
                placeholder="92000"
                className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Currency</label>
              <select
                value={propCurrency}
                onChange={(e) => setPropCurrency(e.target.value)}
                className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
              >
                <option value="USD">USD ($)</option>
                <option value="UGX">UGX (Shs)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Sale Status</label>
              <select
                value={propStatus}
                onChange={(e) => setPropStatus(e.target.value)}
                className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
              >
                <option value="Available">Available</option>
                <option value="Limited">Limited Inventory</option>
                <option value="Sold out">Sold out</option>
                <option value="Under construction">Under construction</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Property Type</label>
              <input
                type="text"
                required
                value={propType}
                onChange={(e) => setPropType(e.target.value)}
                placeholder="Apartment / Penthouse"
                className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Bedrooms available (comma-separated)</label>
              <input
                type="text"
                required
                value={propBedrooms}
                onChange={(e) => setPropBedrooms(e.target.value)}
                placeholder="1BHK, 2BHK, 3BHK"
                className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Bathrooms available range</label>
              <input
                type="text"
                required
                value={propBathrooms}
                onChange={(e) => setPropBathrooms(e.target.value)}
                placeholder="1-3"
                className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Size Range</label>
              <input
                type="text"
                required
                value={propSizeRange}
                onChange={(e) => setPropSizeRange(e.target.value)}
                placeholder="600–1,700 sq.ft or 90–128 sqm"
                className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Main Cover Image Path</label>
              <input
                type="text"
                required
                value={propMainImage}
                onChange={(e) => setPropMainImage(e.target.value)}
                placeholder="/assets/images/horizon.png"
                className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Google Map Embed URL</label>
              <input
                type="text"
                value={propMapUrl}
                onChange={(e) => setPropMapUrl(e.target.value)}
                placeholder="https://www.google.com/maps/embed?..."
                className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">YouTube Walkthrough Video URL</label>
              <input
                type="text"
                value={propYoutubeUrl}
                onChange={(e) => setPropYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
              />
            </div>

            <div className="flex items-center gap-3 md:col-span-2 py-2">
              <input
                type="checkbox"
                id="propFeatured"
                checked={propFeatured}
                onChange={(e) => setPropFeatured(e.target.checked)}
                className="w-4 h-4 accent-[#dfc28c] rounded cursor-pointer"
              />
              <label htmlFor="propFeatured" className="text-xs font-bold uppercase tracking-wider text-zinc-300 cursor-pointer">
                Display on homepage exclusive portfolio slider
              </label>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2 border-t border-white/5 pt-4">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#dfc28c]">SEO Configuration</h4>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">SEO Header Title</label>
              <input
                type="text"
                value={propSeoTitle}
                onChange={(e) => setPropSeoTitle(e.target.value)}
                placeholder="Horizon Residency Bugolobi | Luxury Apartments Kampala"
                className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
              />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">SEO Meta Description</label>
              <textarea
                value={propSeoDesc}
                onChange={(e) => setPropSeoDesc(e.target.value)}
                placeholder="Short outline summarizing layout sizes, pricing, suburb amenities..."
                rows={3}
                className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c] resize-none"
              />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2 border-t border-white/5 pt-4">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Excerpts Description (Shown on grids)</label>
              <textarea
                required
                value={propDesc}
                onChange={(e) => setPropDesc(e.target.value)}
                placeholder="Horizon Residency is a premium apartment development located on Luthuli Avenue..."
                rows={2}
                className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c] resize-none"
              />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Full Copy Description (Shown on property detail page)</label>
              <textarea
                required
                value={propFullDesc}
                onChange={(e) => setPropFullDesc(e.target.value)}
                placeholder="Horizon Residency represents the pinnacle of urban sophistication in Bugolobi. Located opposite Dolphin suites..."
                rows={5}
                className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c] resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingProp}
              className="px-5 py-2.5 bg-[#dfc28c] hover:bg-[#d4af37] disabled:opacity-50 text-[#020c1b] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-lg"
            >
              {submittingProp ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
              <span>Save Property</span>
            </button>
          </div>
        </form>
      )}

      {/* FORM: Unit Create/Edit */}
      {activeTab === 'unit_form' && (
        <form onSubmit={handleUnitSubmit} className="bg-zinc-900 border border-white/5 p-8 rounded-3xl shadow-md max-w-2xl flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="font-heading font-bold text-base text-white">
              {editingUnit ? `Edit Unit Layout: ${editingUnit.name}` : 'Add New Unit Configuration'}
            </h3>
            <button
              type="button"
              onClick={() => {
                setActiveTab('list');
                setExpandedPropId(targetPropertyIdForUnit);
              }}
              className="text-zinc-500 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Unit Layout Name</label>
              <input
                type="text"
                required
                value={unitName}
                onChange={(e) => setUnitName(e.target.value)}
                placeholder="Horizon 2BHK Premium Suite"
                className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Price ($)</label>
              <input
                type="number"
                required
                value={unitPrice}
                onChange={(e) => setUnitPrice(Number(e.target.value))}
                placeholder="124000"
                className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Total Square Footage / Metrage</label>
              <input
                type="text"
                required
                value={unitSize}
                onChange={(e) => setUnitSize(e.target.value)}
                placeholder="1,200 sq.ft or 110 sqm"
                className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Bedrooms Count</label>
              <input
                type="number"
                required
                min={0}
                value={unitBedrooms}
                onChange={(e) => setUnitBedrooms(Number(e.target.value))}
                placeholder="2"
                className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Bathrooms Count</label>
              <input
                type="number"
                required
                min={0}
                value={unitBathrooms}
                onChange={(e) => setUnitBathrooms(Number(e.target.value))}
                placeholder="2"
                className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Status</label>
              <select
                value={unitStatus}
                onChange={(e) => setUnitStatus(e.target.value)}
                className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
              >
                <option value="Available">Available</option>
                <option value="Limited">Limited</option>
                <option value="Sold out">Sold out</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Floor Plan Image Path</label>
              <input
                type="text"
                required
                value={unitFloorPlan}
                onChange={(e) => setUnitFloorPlan(e.target.value)}
                placeholder="/assets/images/1.webp"
                className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
              />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Layout Specifications Description</label>
              <textarea
                required
                value={unitDesc}
                onChange={(e) => setUnitDesc(e.target.value)}
                placeholder="Large living and dining area with private balcony, fitted modern kitchen..."
                rows={3}
                className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c] resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => {
                setActiveTab('list');
                setExpandedPropId(targetPropertyIdForUnit);
              }}
              className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingUnit}
              className="px-5 py-2.5 bg-[#dfc28c] hover:bg-[#d4af37] disabled:opacity-50 text-[#020c1b] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-lg"
            >
              {submittingUnit ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
              <span>Save Unit</span>
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
