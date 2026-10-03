'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight,
  ChevronLeft,
  Search,
  LayoutGrid,
  Menu,
  Tag,
  Box,
  ShieldCheck,
  Filter,
  Truck,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  ArrowRight,
  X,
  Grid3X3,
  ShoppingCart
} from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { Product, Category } from '@prisma/client';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

type CategoryWithSubs = Category & { subcategories: CategoryWithSubs[] };

const FilterSection = ({ id, title, children, expandedFilters, toggleFilter }: { id: string, title: string, children: React.ReactNode, expandedFilters: string[], toggleFilter: (id: string) => void }) => (
  <div className="flex flex-col bg-white border rounded-sm border-gray-200 mb-2">
    <button
      onClick={() => toggleFilter(id)}
      className="p-3 flex items-center cursor-pointer gap-2.5 w-full border-b border-gray-200 text-left"
    >
      {expandedFilters.includes(id) ? <ChevronUp size={16} className="text-gray-900 shrink-0" /> : <ChevronDown size={16} className="text-gray-900 shrink-0" />}
      <span className="text-sm font-semibold uppercase text-gray-900 tracking-wide">{title}</span>
    </button>
    {expandedFilters.includes(id) && (
      <div className="p-4 space-y-3">
        {children}
      </div>
    )}
  </div>
);

const Checkbox = ({ label, count, checked, onChange }: { label: string, count?: number, checked: boolean, onChange: () => void }) => (
  <label className="flex items-center gap-3 group cursor-pointer" onClick={onChange}>
    <div className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-colors ${checked ? 'border-primary bg-primary' : 'border-gray-300 group-hover:border-primary'}`}>
      {checked && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
    </div>
    <span className={`text-[13px] font-semibold transition-colors ${checked ? 'text-primary' : 'text-gray-600 group-hover:text-primary'}`}>
      {label} {count !== undefined && <span className="text-gray-400 font-normal ml-1">({count})</span>}
    </span>
  </label>
);

const initialSizes = [
  { name: '24.5(D) x 28.25(W) x 20.75(H)', defaultCount: 6 },
  { name: '38.5(D) x 28.25(W) x 20.75(H)', defaultCount: 18 },
  { name: '38.5(D) x 30.25(W) x 27.25(H)', defaultCount: 5 },
  { name: '42.4(D) x 30.25(W) x 29.75(H)', defaultCount: 2 },
  { name: '46.4 (D) x 38.1 (W) x 38 (H)', defaultCount: 2 },
  { name: '58.2(D) x 38.1(W) x 39.25(H)', defaultCount: 2 },
];

const initialProductTypes = [
  { name: 'Condensing Unit', defaultCount: 35 }
];

const initialWidths = [
  { name: '28.5 Inches', defaultCount: 9 },
  { name: '28.25 Inches', defaultCount: 15 },
  { name: '30.25 Inches', defaultCount: 7 },
  { name: '38.1 Inches', defaultCount: 4 },
];

const initialVoltages = [
  { name: '208-230V/1Ph/60Hz', defaultCount: 13 },
  { name: '208-230V/3Ph/60Hz', defaultCount: 22 },
];

const initialCondenserTypes = [
  { name: 'Compressor', defaultCount: 35 }
];

const initialHeights = [
  { name: '20.75 inches', defaultCount: 26 },
  { name: '27.25 inches', defaultCount: 5 },
  { name: '29.75 inches', defaultCount: 2 },
  { name: '39.25 inches', defaultCount: 2 },
];

function extractProductInfo(text: string | null | undefined) {
  if (!text) return null;
  const hpMatch = text.match(/(\d+(?:\.\d+)?)\s*HP/i);
  const tempMatch = text.match(/(Medium|Low)(?:\s+Temperature)?/i);
  if (hpMatch) {
    const hp = hpMatch[1];
    const temp = tempMatch ? `${tempMatch[1]} Temp` : 'Medium Temp';
    return `${hp} HP, ${temp}`;
  }
  const btuMatch = text.match(/([\d,]+)\s*BTU/i);
  if (btuMatch) {
    const btu = btuMatch[1].replace(/,/g, '');
    const formattedBtu = btu.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${formattedBtu} BTU`;
  }
  return null;
}

function generateOptimizedTitle(product: any) {
  const brand = product.brand || 'Turbo Air';

  let model = product.title || '';
  if (model.match(/HP|Temp|BTU/i)) {
    const parts = model.split(/\s+/);
    model = parts[parts.length - 1];
  }

  const textToSearch = `${product.title || ''} ${product.keyFeatures || ''} ${product.description || ''}`;
  let capacity = '';
  const hpMatch = textToSearch.match(/(\d+(?:\.\d+)?)\s*HP/i);
  if (hpMatch) {
    capacity = `${hpMatch[1]} HP`;
  } else {
    const btuMatch = textToSearch.match(/([\d,]+)\s*BTU/i);
    if (btuMatch) {
      const btu = btuMatch[1].replace(/,/g, '');
      const formattedBtu = btu.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      capacity = `${formattedBtu} BTU`;
    }
  }

  let temp = '';
  const tempMatch = textToSearch.match(/(Extended\s+Medium|Medium|Low)(?:\s+Temperature|\s+Temp)?/i);
  if (tempMatch) {
    temp = `${tempMatch[1]} Temp`;
  }

  let context = 'Unit';
  if (product.category) {
    const slug = product.category.slug || '';
    if (slug.includes('condensing') || slug.includes('scroll') || slug.includes('hermetic')) {
      if (textToSearch.toLowerCase().includes('outdoor')) context = 'Outdoor Condensing Unit';
      else if (textToSearch.toLowerCase().includes('indoor')) context = 'Indoor Condensing Unit';
      else context = 'Condensing Unit';
    } else if (slug.includes('evaporator') || slug.includes('profile')) {
      if (slug.includes('low-profile')) context = 'Low Profile Evaporator';
      else if (slug.includes('medium-profile')) context = 'Medium Profile Evaporator';
      else if (slug.includes('center-mount')) context = 'Center Mount Evaporator';
      else if (slug.includes('thin-profile')) context = 'Thin Profile Evaporator';
      else context = 'Evaporator';
    } else if (slug.includes('combo') || slug.includes('package')) {
      if (slug.includes('outdoor')) context = 'Outdoor Package Unit';
      else if (slug.includes('indoor')) context = 'Indoor Package Unit';
      else context = 'Package Unit';
    }
  }

  return [brand, model, capacity, temp, context].filter(Boolean).join(' ');
}

const skuToSpecs: Record<string, { size: string, width: string, height: string, voltage: string }> = {
  // Size 1: 24.5(D) x 28.25(W) x 20.75(H) (6 products)
  'TS006MR404A2': { size: '24.5(D) x 28.25(W) x 20.75(H)', width: '28.5 Inches', height: '20.75 inches', voltage: '208-230V/1Ph/60Hz' },
  'TS008MR404A2': { size: '24.5(D) x 28.25(W) x 20.75(H)', width: '28.5 Inches', height: '20.75 inches', voltage: '208-230V/1Ph/60Hz' },
  'TS010MR404A2': { size: '24.5(D) x 28.25(W) x 20.75(H)', width: '28.5 Inches', height: '20.75 inches', voltage: '208-230V/1Ph/60Hz' },
  'TS015XR404A2': { size: '24.5(D) x 28.25(W) x 20.75(H)', width: '28.25 Inches', height: '20.75 inches', voltage: '208-230V/1Ph/60Hz' },
  'TS015XR404A3': { size: '24.5(D) x 28.25(W) x 20.75(H)', width: '28.25 Inches', height: '20.75 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS010XR404A2': { size: '24.5(D) x 28.25(W) x 20.75(H)', width: '28.25 Inches', height: '20.75 inches', voltage: '208-230V/1Ph/60Hz' },
  'TS010XR404A2A': { size: '24.5(D) x 28.25(W) x 20.75(H)', width: '28.25 Inches', height: '20.75 inches', voltage: '208-230V/1Ph/60Hz' },
  'TS006XR404A2': { size: '24.5(D) x 28.25(W) x 20.75(H)', width: '28.25 Inches', height: '20.75 inches', voltage: '208-230V/1Ph/60Hz' },
  'TS008XR404A2': { size: '24.5(D) x 28.25(W) x 20.75(H)', width: '28.25 Inches', height: '20.75 inches', voltage: '208-230V/1Ph/60Hz' },
  'TS006MR404A3': { size: '24.5(D) x 28.25(W) x 20.75(H)', width: '28.5 Inches', height: '20.75 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS008MR404A3': { size: '24.5(D) x 28.25(W) x 20.75(H)', width: '28.5 Inches', height: '20.75 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS010MR404A3': { size: '24.5(D) x 28.25(W) x 20.75(H)', width: '28.5 Inches', height: '20.75 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS010XR404A3': { size: '24.5(D) x 28.25(W) x 20.75(H)', width: '28.25 Inches', height: '20.75 inches', voltage: '208-230V/3Ph/60Hz' },

  // Size 2: 38.5(D) x 28.25(W) x 20.75(H) (18 products)
  'TS020MR404A2A': { size: '38.5(D) x 28.25(W) x 20.75(H)', width: '28.5 Inches', height: '20.75 inches', voltage: '208-230V/1Ph/60Hz' },
  'TS015MR404A3A': { size: '38.5(D) x 28.25(W) x 20.75(H)', width: '28.5 Inches', height: '20.75 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS030XR404A3A': { size: '38.5(D) x 28.25(W) x 20.75(H)', width: '28.25 Inches', height: '20.75 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS020XR404A2A': { size: '38.5(D) x 28.25(W) x 20.75(H)', width: '28.25 Inches', height: '20.75 inches', voltage: '208-230V/1Ph/60Hz' },
  'TS015MR404A2A': { size: '38.5(D) x 28.25(W) x 20.75(H)', width: '28.5 Inches', height: '20.75 inches', voltage: '208-230V/1Ph/60Hz' },
  'TS030XR404A2A': { size: '38.5(D) x 28.25(W) x 20.75(H)', width: '28.25 Inches', height: '20.75 inches', voltage: '208-230V/1Ph/60Hz' },
  'TS025XR404A3A': { size: '38.5(D) x 28.25(W) x 20.75(H)', width: '28.25 Inches', height: '20.75 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS060XR404A3A': { size: '38.5(D) x 28.25(W) x 20.75(H)', width: '28.25 Inches', height: '20.75 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS025MR404A3A': { size: '38.5(D) x 28.25(W) x 20.75(H)', width: '28.5 Inches', height: '20.75 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS020MR404A3': { size: '38.5(D) x 28.25(W) x 20.75(H)', width: '28.5 Inches', height: '20.75 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS020MR404A3A': { size: '38.5(D) x 28.25(W) x 20.75(H)', width: '28.5 Inches', height: '20.75 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS025MR404A2A': { size: '38.5(D) x 28.25(W) x 20.75(H)', width: '28.5 Inches', height: '20.75 inches', voltage: '208-230V/1Ph/60Hz' },
  'TS020XR404A3A': { size: '38.5(D) x 28.25(W) x 20.75(H)', width: '28.25 Inches', height: '20.75 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS035XR404A2A': { size: '38.5(D) x 28.25(W) x 20.75(H)', width: '28.25 Inches', height: '20.75 inches', voltage: '208-230V/1Ph/60Hz' },
  'TS035XR404A3A': { size: '38.5(D) x 28.25(W) x 20.75(H)', width: '28.25 Inches', height: '20.75 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS045XR404A2A': { size: '38.5(D) x 28.25(W) x 20.75(H)', width: '28.25 Inches', height: '20.75 inches', voltage: '208-230V/1Ph/60Hz' },
  'TS045XR404A3A': { size: '38.5(D) x 28.25(W) x 20.75(H)', width: '28.25 Inches', height: '20.75 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS055XR404A2A': { size: '38.5(D) x 28.25(W) x 20.75(H)', width: '28.25 Inches', height: '20.75 inches', voltage: '208-230V/1Ph/60Hz' },
  'TS055XR404A3A': { size: '38.5(D) x 28.25(W) x 20.75(H)', width: '28.25 Inches', height: '20.75 inches', voltage: '208-230V/3Ph/60Hz' },

  // Size 3: 38.5(D) x 30.25(W) x 27.25(H) (5 products)
  'TS040MR404A2': { size: '38.5(D) x 30.25(W) x 27.25(H)', width: '30.25 Inches', height: '27.25 inches', voltage: '208-230V/1Ph/60Hz' },
  'TS030MR404A2': { size: '38.5(D) x 30.25(W) x 27.25(H)', width: '30.25 Inches', height: '27.25 inches', voltage: '208-230V/1Ph/60Hz' },
  'TS030MR404A3': { size: '38.5(D) x 30.25(W) x 27.25(H)', width: '30.25 Inches', height: '27.25 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS040MR404A3': { size: '38.5(D) x 30.25(W) x 27.25(H)', width: '30.25 Inches', height: '27.25 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS060MR404A3A': { size: '38.5(D) x 30.25(W) x 27.25(H)', width: '30.25 Inches', height: '27.25 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS060MR404A3': { size: '38.5(D) x 30.25(W) x 27.25(H)', width: '30.25 Inches', height: '27.25 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS040XR404A3A': { size: '38.5(D) x 30.25(W) x 27.25(H)', width: '30.25 Inches', height: '27.25 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS050XR404A3A': { size: '38.5(D) x 30.25(W) x 27.25(H)', width: '30.25 Inches', height: '27.25 inches', voltage: '208-230V/3Ph/60Hz' },

  // Size 4: 42.4(D) x 30.25(W) x 29.75(H) (2 products)
  'TS050MR404A2A': { size: '42.4(D) x 30.25(W) x 29.75(H)', width: '30.25 Inches', height: '29.75 inches', voltage: '208-230V/1Ph/60Hz' },
  'TS050MR404A3A': { size: '42.4(D) x 30.25(W) x 29.75(H)', width: '30.25 Inches', height: '29.75 inches', voltage: '208-230V/3Ph/60Hz' },

  // Size 5: 46.4 (D) x 38.1 (W) x 38 (H) (2 products)
  'TS075XR404A3A': { size: '46.4 (D) x 38.1 (W) x 38 (H)', width: '38.1 Inches', height: '20.75 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS100XR404A3': { size: '46.4 (D) x 38.1 (W) x 38 (H)', width: '38.1 Inches', height: '20.75 inches', voltage: '208-230V/3Ph/60Hz' },

  // Size 6: 58.2(D) x 38.1(W) x 39.25(H) (2 products)
  'TS075MR404A3A': { size: '58.2(D) x 38.1(W) x 39.25(H)', width: '38.1 Inches', height: '39.25 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS100MR404A3A': { size: '58.2(D) x 38.1(W) x 39.25(H)', width: '38.1 Inches', height: '39.25 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS075MR404A3': { size: '58.2(D) x 38.1(W) x 39.25(H)', width: '38.1 Inches', height: '39.25 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS100MR404A3': { size: '58.2(D) x 38.1(W) x 39.25(H)', width: '38.1 Inches', height: '39.25 inches', voltage: '208-230V/3Ph/60Hz' },

  // STI Top Mount Combo Units Mappings
  'STI110MP2': { size: '28.05 (D) x 53.5 (W) x 25.6 (H)', width: '53.5 Inches', height: '25.6 Inches', voltage: '208-230V/1Ph/60Hz' },
  'STI038LP2': { size: '28.05 (D) x 53.5 (W) x 25.6 (H)', width: '53.5 Inches', height: '25.6 Inches', voltage: '208-230V/1Ph/60Hz' },
  'STI155MP2': { size: '28.05 (D) x 53.5 (W) x 25.6 (H)', width: '53.5 Inches', height: '25.6 Inches', voltage: '208-230V/1Ph/60Hz' },
  'STI078MP2': { size: '28.05 (D) x 53.5 (W) x 25.6 (H)', width: '53.5 Inches', height: '25.6 Inches', voltage: '208-230V/1Ph/60Hz' },
  'STI075LP2': { size: '38.06 (D) x 53.5 (W) x 21 (H)', width: '53.5 Inches', height: '21 Inches', voltage: '208-230V/1Ph/60Hz' },
  'STI050LP2': { size: '38.06 (D) x 53.5 (W) x 21 (H)', width: '53.5 Inches', height: '21 Inches', voltage: '208-230V/1Ph/60Hz' },
  'STI055MP2': { size: '28 (D) x 52 (W) x 18 (H)', width: '52 Inches', height: '18 Inches', voltage: '208-230V/1Ph/60Hz' },
  'STI025LP2': { size: '28 (D) x 53 (W) x 21 (H)', width: '53 Inches', height: '21 Inches', voltage: '208-230V/1Ph/60Hz' }
};

function getProductSpecs(product: any) {
  let sku = (product.sku || '').toUpperCase();
  if (!sku) {
    const match = (product.title || '').match(/TS\d+[MX]R404A\w*/i);
    if (match) sku = match[0].toUpperCase();
  }

  const mapped = sku ? skuToSpecs[sku] : null;

  const rawSpecs = product.specs;
  let specsObj: Record<string, any> = {};
  if (rawSpecs && typeof rawSpecs === 'object' && !Array.isArray(rawSpecs)) {
    specsObj = rawSpecs;
  } else if (Array.isArray(rawSpecs)) {
    rawSpecs.forEach((s: any) => {
      if (s && s.label && s.value) {
        specsObj[s.label.toLowerCase()] = s.value;
      }
    });
  }

  const size = mapped?.size || specsObj.size || (product.keyFeatures?.match(/Size:\s*([^•]+)/i)?.[1]?.trim());
  const width = mapped?.width || specsObj.width || (product.keyFeatures?.match(/Width:\s*([^•]+)/i)?.[1]?.trim());
  const height = mapped?.height || specsObj.height || (product.keyFeatures?.match(/Height:\s*([^•]+)/i)?.[1]?.trim());
  const voltage = mapped?.voltage || specsObj.voltage || (product.keyFeatures?.match(/Voltage:\s*([^•]+)/i)?.[1]?.trim()) || (sku?.endsWith('2') || sku?.endsWith('2A') ? '208-230V/1Ph/60Hz' : sku?.endsWith('3') || sku?.endsWith('3A') ? '208-230V/3Ph/60Hz' : null);
  const condenserType = mapped ? 'Compressor' : (specsObj.condenserType || 'Compressor');
  const productType = mapped ? 'Condensing Unit' : (product.type || 'Condensing Unit');

  return {
    sku,
    size: size || '',
    width: width || '',
    height: height || '',
    voltage: voltage || '',
    condenserType,
    productType
  };
}

export default function RefrigerationEquipmentClient({
  products,
  categories,
  slug,
  title
}: {
  products: (Product & { category: Category | null })[],
  categories: CategoryWithSubs[],
  slug: string,
  title: string
}) {
  const { addToCart } = useCart();
  const router = useRouter();
  const isEvaporationPage = slug === 'evaporation-units' || slug.includes('evaporat');
  const isComboPage = slug === 'combo-units-package-units' || slug.includes('combo') || slug.includes('package');

  const [expandedItems, setExpandedItems] = useState<string[]>([
    'evaporation-units',
    'condensing-units',
    'combo-units-package-units',
    'low-profile-evaporator',
    'thin-profile-evaporator-reach-in',
    'medium-profile',
    'center-mount-evaporator-low-velocity',
    'indoor-pemmvl',
    'outdoor-bueip'
  ]);
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOption, setSortOption] = useState<string>('default');
  const [expandedFilters, setExpandedFilters] = useState<string[]>([
    'brand',
    'size',
    'product-type',
    'power-type',
    'btu',
    'width',
    'voltage',
    'depth',
    'condenser-type',
    'height'
  ]);

  // Filter states
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>([]);
  const [selectedPowerTypes, setSelectedPowerTypes] = useState<string[]>([]);
  const [selectedBtus, setSelectedBtus] = useState<string[]>([]);
  const [selectedWidths, setSelectedWidths] = useState<string[]>([]);
  const [selectedVoltages, setSelectedVoltages] = useState<string[]>([]);
  const [selectedDepths, setSelectedDepths] = useState<string[]>([]);
  const [selectedCondenserTypes, setSelectedCondenserTypes] = useState<string[]>([]);
  const [selectedHeights, setSelectedHeights] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate filter counts from products
  const filterCounts = useMemo(() => {
    const counts = {
      brands: {} as Record<string, number>,
      sizes: {} as Record<string, number>,
      productTypes: {} as Record<string, number>,
      widths: {} as Record<string, number>,
      voltages: {} as Record<string, number>,
      condenserTypes: {} as Record<string, number>,
      heights: {} as Record<string, number>,
    };

    products.forEach(product => {
      // Brand
      const brand = product.brand || product.title.split(' ')[0];
      if (brand) {
        counts.brands[brand] = (counts.brands[brand] || 0) + 1;
      }

      const specs = getProductSpecs(product);
      const textToSearch = `${product.title || ''} ${product.keyFeatures || ''} ${product.description || ''} ${JSON.stringify(product.specs || '')} ${product.brand || ''}`.toLowerCase();

      // Sizes
      initialSizes.forEach(item => {
        if (specs.size && specs.size.toLowerCase() === item.name.toLowerCase()) {
          counts.sizes[item.name] = (counts.sizes[item.name] || 0) + 1;
        } else {
          const numbers = item.name.match(/[\d.]+/g);
          if (numbers && numbers.length >= 2) {
            if (numbers.every(n => textToSearch.includes(n.toLowerCase()))) {
              counts.sizes[item.name] = (counts.sizes[item.name] || 0) + 1;
            }
          }
        }
      });

      // Product Types
      initialProductTypes.forEach(item => {
        if (specs.productType?.toLowerCase().includes(item.name.toLowerCase()) || textToSearch.includes(item.name.toLowerCase()) || (product.type && product.type.toLowerCase().includes(item.name.toLowerCase()))) {
          counts.productTypes[item.name] = (counts.productTypes[item.name] || 0) + 1;
        }
      });

      // Widths
      initialWidths.forEach(item => {
        const cleanWidthName = item.name.toLowerCase().replace(' inches', '').trim();
        if (specs.width?.toLowerCase().includes(cleanWidthName)) {
          counts.widths[item.name] = (counts.widths[item.name] || 0) + 1;
        } else {
          const num = item.name.match(/[\d.]+/)?.[0];
          if (num && textToSearch.includes(num)) {
            counts.widths[item.name] = (counts.widths[item.name] || 0) + 1;
          }
        }
      });

      // Voltages
      initialVoltages.forEach(item => {
        if (specs.voltage && specs.voltage.toLowerCase().includes(item.name.toLowerCase())) {
          counts.voltages[item.name] = (counts.voltages[item.name] || 0) + 1;
        } else if (item.name.includes('1Ph') && (specs.sku?.endsWith('2') || specs.sku?.endsWith('2A') || textToSearch.includes('1ph') || textToSearch.includes('1 ph') || textToSearch.includes('208-230v/1ph'))) {
          counts.voltages[item.name] = (counts.voltages[item.name] || 0) + 1;
        } else if (item.name.includes('3Ph') && (specs.sku?.endsWith('3') || specs.sku?.endsWith('3A') || textToSearch.includes('3ph') || textToSearch.includes('3 ph') || textToSearch.includes('208-230v/3ph'))) {
          counts.voltages[item.name] = (counts.voltages[item.name] || 0) + 1;
        }
      });

      // Condenser Types
      initialCondenserTypes.forEach(item => {
        counts.condenserTypes[item.name] = (counts.condenserTypes[item.name] || 0) + 1;
      });

      // Heights
      initialHeights.forEach(item => {
        const cleanHeightName = item.name.toLowerCase().replace(' inches', '').trim();
        if (specs.height?.toLowerCase().includes(cleanHeightName)) {
          counts.heights[item.name] = (counts.heights[item.name] || 0) + 1;
        } else {
          const num = item.name.match(/[\d.]+/)?.[0];
          if (num && textToSearch.includes(num)) {
            counts.heights[item.name] = (counts.heights[item.name] || 0) + 1;
          }
        }
      });
    });

    return counts;
  }, [products]);

  // Derive brands list, sorting "Icemanz" to the top
  const brands = useMemo(() => {
    if (isEvaporationPage) {
      return [{ name: 'Turbo Air', count: 23 }];
    }

    const existingBrands = { ...filterCounts.brands };
    if (isComboPage) {
      existingBrands['Turbo Air'] = filterCounts.brands['Turbo Air'] || (products.length || 8);
    }
    if (!Object.keys(existingBrands).some(k => k.toLowerCase() === 'icemanz')) {
      existingBrands['Icemanz'] = 0;
    }

    const brandList = Object.entries(existingBrands).map(([name, count]) => ({ name, count }));
    return brandList.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      if (aName === 'icemanz') return -1;
      if (bName === 'icemanz') return 1;
      return aName.localeCompare(bName);
    });
  }, [filterCounts.brands, isEvaporationPage, isComboPage, products.length]);

  const sizesList = useMemo(() => {
    if (isComboPage) {
      return [
        { name: '28 (D) x 52 (W) x 18 (H)', count: 1 },
        { name: '28 (D) x 53 (W) x 21 (H)', count: 1 },
        { name: '28.05 (D) x 53.5 (W) x 25.6 (H)', count: 4 },
        { name: '38.06 (D) x 53.5 (W) x 21 (H)', count: 2 }
      ];
    }
    return initialSizes.map(item => ({
      name: item.name,
      count: item.defaultCount
    }));
  }, [isComboPage]);

  const productTypesList = useMemo(() => {
    if (isEvaporationPage) {
      return [{ name: 'Evaporator Coil', count: 23 }];
    }
    if (isComboPage) {
      return [
        { name: 'Indoor Package Unit', count: 7 },
        { name: 'Self-Contained Package Unit', count: 1 }
      ];
    }
    return initialProductTypes.map(item => ({
      name: item.name,
      count: item.defaultCount
    }));
  }, [isEvaporationPage, isComboPage]);

  const powerTypesList = useMemo(() => {
    if (isEvaporationPage) {
      return [{ name: 'Evaporator Coil', count: 23 }];
    }
    return [];
  }, [isEvaporationPage]);

  const btusList = useMemo(() => {
    if (isComboPage) {
      const countsMap: Record<string, number> = {};
      products.forEach(p => {
        const text = `${p.title || ''} ${p.keyFeatures || ''} ${JSON.stringify(p.specs || '')}`;
        const match = text.match(/([\d,]+)\s*BTU/i);
        if (match) {
          const formatted = `${match[1]} BTU`;
          countsMap[formatted] = (countsMap[formatted] || 0) + 1;
        }
      });
      const entries = Object.entries(countsMap).map(([name, count]) => ({ name, count }));
      if (entries.length > 0) {
        return entries.sort((a, b) => parseInt(a.name.replace(/[^0-9]/g, '')) - parseInt(b.name.replace(/[^0-9]/g, '')));
      }
      return [
        { name: '2,200 BTU', count: 1 },
        { name: '2,500 BTU', count: 1 },
        { name: '3,800 BTU', count: 1 },
        { name: '5,000 BTU', count: 1 },
        { name: '5,500 BTU', count: 1 },
        { name: '7,500 BTU', count: 1 },
        { name: '7,800 BTU', count: 1 },
        { name: '15,500 BTU', count: 1 }
      ];
    }
    return [];
  }, [isComboPage, products]);

  const widthsList = useMemo(() => {
    if (isComboPage) {
      return [
        { name: '52 Inches', count: 1 },
        { name: '53 Inches', count: 1 },
        { name: '53.5 Inches', count: 6 }
      ];
    }
    return initialWidths.map(item => ({
      name: item.name,
      count: item.defaultCount
    }));
  }, [isComboPage]);

  const voltagesList = useMemo(() => {
    if (isEvaporationPage) {
      return [
        { name: '115V/1Ph/60Hz', count: 11 },
        { name: '208-230V/1Ph/60Hz', count: 12 }
      ];
    }
    if (isComboPage) {
      return [{ name: '208-230V/1Ph/60Hz', count: 8 }];
    }
    return initialVoltages.map(item => ({
      name: item.name,
      count: item.defaultCount
    }));
  }, [isEvaporationPage, isComboPage]);

  const depthsList = useMemo(() => {
    if (isComboPage) {
      return [
        { name: '28 Inches', count: 2 },
        { name: '28.05 Inches', count: 4 },
        { name: '38.06 Inches', count: 2 }
      ];
    }
    return [];
  }, [isComboPage]);

  const condenserTypesList = useMemo(() => {
    if (isComboPage) {
      return [
        { name: 'Scroll Compressor', count: 7 },
        { name: 'Self-Contained Compressor', count: 1 }
      ];
    }
    return initialCondenserTypes.map(item => ({
      name: item.name,
      count: item.defaultCount
    }));
  }, [isComboPage]);

  const heightsList = useMemo(() => {
    if (isComboPage) {
      return [
        { name: '18 Inches', count: 1 },
        { name: '21 Inches', count: 3 },
        { name: '25.6 Inches', count: 4 }
      ];
    }
    return initialHeights.map(item => ({
      name: item.name,
      count: item.defaultCount
    }));
  }, [isComboPage]);

  const toggleExpand = (e: React.MouseEvent, itemSlug: string) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedItems(prev =>
      prev.includes(itemSlug)
        ? prev.filter(s => s !== itemSlug)
        : [...prev, itemSlug]
    );
  };

  const toggleFilter = (id: string) => {
    setExpandedFilters(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleProductType = (type: string) => {
    setSelectedProductTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const togglePowerType = (type: string) => {
    setSelectedPowerTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleBtu = (btu: string) => {
    setSelectedBtus(prev =>
      prev.includes(btu) ? prev.filter(b => b !== btu) : [...prev, btu]
    );
  };

  const toggleWidth = (width: string) => {
    setSelectedWidths(prev =>
      prev.includes(width) ? prev.filter(w => w !== width) : [...prev, width]
    );
  };

  const toggleVoltage = (voltage: string) => {
    setSelectedVoltages(prev =>
      prev.includes(voltage) ? prev.filter(v => v !== voltage) : [...prev, voltage]
    );
  };

  const toggleDepth = (depth: string) => {
    setSelectedDepths(prev =>
      prev.includes(depth) ? prev.filter(d => d !== depth) : [...prev, depth]
    );
  };

  const toggleCondenserType = (type: string) => {
    setSelectedCondenserTypes(prev =>
      prev.includes(type) ? prev.filter(c => c !== type) : [...prev, type]
    );
  };

  const toggleHeight = (height: string) => {
    setSelectedHeights(prev =>
      prev.includes(height) ? prev.filter(h => h !== height) : [...prev, height]
    );
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSelectedProductTypes([]);
    setSelectedPowerTypes([]);
    setSelectedBtus([]);
    setSelectedWidths([]);
    setSelectedVoltages([]);
    setSelectedDepths([]);
    setSelectedCondenserTypes([]);
    setSelectedHeights([]);
    setSearchQuery('');
  };

  const hasActiveFilters = useMemo(() => {
    return (
      selectedBrands.length > 0 ||
      selectedSizes.length > 0 ||
      selectedProductTypes.length > 0 ||
      selectedPowerTypes.length > 0 ||
      selectedBtus.length > 0 ||
      selectedWidths.length > 0 ||
      selectedVoltages.length > 0 ||
      selectedDepths.length > 0 ||
      selectedCondenserTypes.length > 0 ||
      selectedHeights.length > 0
    );
  }, [
    selectedBrands,
    selectedSizes,
    selectedProductTypes,
    selectedPowerTypes,
    selectedBtus,
    selectedWidths,
    selectedVoltages,
    selectedDepths,
    selectedCondenserTypes,
    selectedHeights
  ]);

  // Filter products based on selected filters
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Text search — title + keyFeatures + brand
      const q = searchQuery.trim().toLowerCase();
      if (q) {
        const searchText = `${product.title || ''} ${product.keyFeatures || ''} ${product.brand || ''}`.toLowerCase();
        if (!searchText.includes(q)) return false;
      }

      // Brand filter
      const brand = product.brand || product.title.split(' ')[0];
      const brandMatch = selectedBrands.length === 0 || selectedBrands.some(b => {
        const bLower = b.toLowerCase();
        const prodBrand = (product.brand || '').toLowerCase();
        const prodTitle = (product.title || '').toLowerCase();
        return bLower === brand.toLowerCase() || prodBrand.includes(bLower) || prodTitle.includes(bLower);
      });
      if (!brandMatch) return false;

      const textToSearch = `${product.title || ''} ${product.keyFeatures || ''} ${product.description || ''} ${JSON.stringify(product.specs || '')} ${product.brand || ''}`.toLowerCase();

      // Evaporation Page Specific Filtering
      if (isEvaporationPage) {
        // Product Type filter
        if (selectedProductTypes.length > 0) {
          const typeMatch = selectedProductTypes.some(type =>
            textToSearch.includes(type.toLowerCase()) || textToSearch.includes('evaporat') || textToSearch.includes('coil')
          );
          if (!typeMatch) return false;
        }

        // Power Type filter
        if (selectedPowerTypes.length > 0) {
          const powerMatch = selectedPowerTypes.some(type =>
            textToSearch.includes(type.toLowerCase()) || textToSearch.includes('evaporat') || textToSearch.includes('coil')
          );
          if (!powerMatch) return false;
        }

        // Voltage filter
        if (selectedVoltages.length > 0) {
          const voltageMatch = selectedVoltages.some(v => {
            if (v.includes('115V')) return textToSearch.includes('115v');
            if (v.includes('208-230V')) return textToSearch.includes('208-230v');
            return textToSearch.includes(v.toLowerCase());
          });
          if (!voltageMatch) return false;
        }

        return true;
      }

      // Combo Page Specific Filtering
      if (isComboPage) {
        if (selectedSizes.length > 0) {
          const sizeMatch = selectedSizes.some(s => {
            const numbers = s.match(/[\d.]+/g);
            if (numbers && numbers.length >= 2) {
              return numbers.every(n => textToSearch.includes(n));
            }
            return textToSearch.includes(s.toLowerCase()) || JSON.stringify(product).toLowerCase().includes(s.toLowerCase());
          });
          if (!sizeMatch) return false;
        }

        if (selectedProductTypes.length > 0) {
          const typeMatch = selectedProductTypes.some(t => {
            const term = t.toLowerCase();
            if (term.includes('self-contained')) return textToSearch.includes('self-contained');
            if (term.includes('indoor package') || term.includes('top mount')) {
              return textToSearch.includes('indoor package') || textToSearch.includes('top mount') || textToSearch.includes('refrigeration system') || (product.type && product.type.toLowerCase().includes('top mount'));
            }
            return textToSearch.includes(term);
          });
          if (!typeMatch) return false;
        }

        if (selectedBtus.length > 0) {
          const btuMatch = selectedBtus.some(b => {
            const rawDigits = b.replace(/[^0-9]/g, '');
            if (!rawDigits) return textToSearch.includes(b.toLowerCase());
            const formatted = rawDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return textToSearch.includes(rawDigits) || textToSearch.includes(formatted);
          });
          if (!btuMatch) return false;
        }

        if (selectedWidths.length > 0) {
          const widthMatch = selectedWidths.some(w => {
            const num = w.match(/[\d.]+/)?.[0];
            return num ? textToSearch.includes(num) : textToSearch.includes(w.toLowerCase());
          });
          if (!widthMatch) return false;
        }

        if (selectedVoltages.length > 0) {
          const voltageMatch = selectedVoltages.some(v => {
            return textToSearch.includes('208-230v') || textToSearch.includes('208-230') || textToSearch.includes('1ph');
          });
          if (!voltageMatch) return false;
        }

        if (selectedDepths.length > 0) {
          const depthMatch = selectedDepths.some(d => {
            const num = d.match(/[\d.]+/)?.[0];
            return num ? textToSearch.includes(num) : textToSearch.includes(d.toLowerCase());
          });
          if (!depthMatch) return false;
        }

        if (selectedCondenserTypes.length > 0) {
          const condenserMatch = selectedCondenserTypes.some(c => {
            const term = c.toLowerCase();
            if (term.includes('scroll')) return textToSearch.includes('scroll');
            if (term.includes('self-contained')) return textToSearch.includes('self-contained');
            return textToSearch.includes(term) || textToSearch.includes('compressor');
          });
          if (!condenserMatch) return false;
        }

        if (selectedHeights.length > 0) {
          const heightMatch = selectedHeights.some(h => {
            const num = h.match(/[\d.]+/)?.[0];
            return num ? textToSearch.includes(num) : textToSearch.includes(h.toLowerCase());
          });
          if (!heightMatch) return false;
        }

        return true;
      }

      const specs = getProductSpecs(product);

      // Size filter
      if (selectedSizes.length > 0) {
        const sizeMatch = selectedSizes.some(selectedSize => {
          if (specs.size && specs.size.toLowerCase() === selectedSize.toLowerCase()) return true;
          const numbers = selectedSize.match(/[\d.]+/g);
          if (numbers && numbers.length >= 2) {
            return numbers.every(n => textToSearch.includes(n.toLowerCase()));
          }
          return textToSearch.includes(selectedSize.toLowerCase());
        });
        if (!sizeMatch) return false;
      }

      // Product Type filter
      if (selectedProductTypes.length > 0) {
        const typeMatch = selectedProductTypes.some(type => {
          if (specs.productType && specs.productType.toLowerCase().includes(type.toLowerCase())) return true;
          return textToSearch.includes(type.toLowerCase()) || (product.type && product.type.toLowerCase().includes(type.toLowerCase()));
        });
        if (!typeMatch) return false;
      }

      // Width filter
      if (selectedWidths.length > 0) {
        const widthMatch = selectedWidths.some(w => {
          const cleanWidth = w.toLowerCase().replace(' inches', '').trim();
          if (specs.width && specs.width.toLowerCase().includes(cleanWidth)) return true;
          const num = w.match(/[\d.]+/)?.[0];
          return num ? textToSearch.includes(num) : textToSearch.includes(w.toLowerCase());
        });
        if (!widthMatch) return false;
      }

      // Voltage filter
      if (selectedVoltages.length > 0) {
        const voltageMatch = selectedVoltages.some(v => {
          if (specs.voltage && specs.voltage.toLowerCase().includes(v.toLowerCase())) return true;
          if (v.includes('1Ph')) {
            if (specs.sku && (specs.sku.endsWith('2') || specs.sku.endsWith('2A'))) return true;
            return textToSearch.includes('1ph') || textToSearch.includes('1 ph') || textToSearch.includes('208-230v/1ph');
          }
          if (v.includes('3Ph')) {
            if (specs.sku && (specs.sku.endsWith('3') || specs.sku.endsWith('3A'))) return true;
            return textToSearch.includes('3ph') || textToSearch.includes('3 ph') || textToSearch.includes('208-230v/3ph');
          }
          return textToSearch.includes(v.toLowerCase());
        });
        if (!voltageMatch) return false;
      }

      // Condenser Type filter
      if (selectedCondenserTypes.length > 0) {
        const condenserMatch = selectedCondenserTypes.some(c => {
          if (c.toLowerCase() === 'compressor') return true;
          return textToSearch.includes(c.toLowerCase()) || textToSearch.includes('condens') || textToSearch.includes('unit');
        });
        if (!condenserMatch) return false;
      }

      // Height filter
      if (selectedHeights.length > 0) {
        const heightMatch = selectedHeights.some(h => {
          const cleanHeight = h.toLowerCase().replace(' inches', '').trim();
          if (specs.height && specs.height.toLowerCase().includes(cleanHeight)) return true;
          const num = h.match(/[\d.]+/)?.[0];
          return num ? textToSearch.includes(num) : textToSearch.includes(h.toLowerCase());
        });
        if (!heightMatch) return false;
      }

      return true;
    });
  }, [
    products,
    selectedBrands,
    selectedSizes,
    selectedProductTypes,
    selectedWidths,
    selectedVoltages,
    selectedCondenserTypes,
    selectedHeights,
    searchQuery
  ]);

  // Sort products based on selected sort option
  const sortedProducts = useMemo(() => {
    const productsToSort = [...filteredProducts];

    switch (sortOption) {
      case 'price-low':
        return productsToSort.sort((a, b) => {
          const priceA = parseFloat(String(a.price || '0').replace(/[^0-9.]/g, ''));
          const priceB = parseFloat(String(b.price || '0').replace(/[^0-9.]/g, ''));
          return priceA - priceB;
        });
      case 'price-high':
        return productsToSort.sort((a, b) => {
          const priceA = parseFloat(String(a.price || '0').replace(/[^0-9.]/g, ''));
          const priceB = parseFloat(String(b.price || '0').replace(/[^0-9.]/g, ''));
          return priceB - priceA;
        });
      case 'name-asc':
        return productsToSort.sort((a, b) => a.title.localeCompare(b.title));
      case 'name-desc':
        return productsToSort.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return productsToSort;
    }
  }, [filteredProducts, sortOption]);

  const displayedProducts = sortedProducts;

  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedBrands,
    selectedSizes,
    selectedProductTypes,
    selectedPowerTypes,
    selectedBtus,
    selectedWidths,
    selectedVoltages,
    selectedDepths,
    selectedCondenserTypes,
    selectedHeights,
    sortOption
  ]);

  const totalPages = Math.ceil(displayedProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return displayedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [displayedProducts, currentPage]);

  const cleanPrice = (priceStr: string | null) => {
    if (!priceStr) return '0.00';
    const num = parseFloat(String(priceStr).replace(/[^0-9.]/g, ''));
    return isNaN(num) ? '0.00' : num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="pt-36 pb-20 md:pt-48 md:pb-24">
        <div className="container px-4">

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-72 xl:w-[320px] shrink-0">
              {/* Mobile: search input + filter button side by side */}
              <div className="lg:hidden flex items-center gap-2 mb-4">
                <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-sm px-3 py-3 focus-within:border-primary transition-colors">
                  <Search size={16} className="text-gray-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    placeholder="Search products..."
                    className="flex-1 outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent"
                  />
                  {searchQuery && (
                    <button type="button" onClick={() => { setSearchQuery(''); setCurrentPage(1); }} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                      <X size={14} />
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-3 bg-white border border-gray-200 rounded-sm cursor-pointer shrink-0"
                >
                  <Filter size={17} className="text-gray-900" />
                  <span className="font-semibold text-gray-900 text-sm">Filters</span>
                </button>
              </div>

              {/* Overlay for mobile */}
              {isMobileSidebarOpen && (
                <div
                  className="fixed inset-0 bg-black/50 z-[60] lg:hidden cursor-pointer"
                  onClick={() => setIsMobileSidebarOpen(false)}
                />
              )}

              <div className={`
                fixed top-0 right-0 h-full w-full bg-white z-[70] transform transition-transform duration-300 overflow-y-auto
                lg:static lg:w-full lg:max-w-none lg:h-auto lg:bg-transparent lg:z-auto lg:shadow-none lg:transform-none lg:overflow-visible lg:border lg:border-gray-200
                ${isMobileSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
              `}>
                <div className="space-y-0 pb-20 lg:pb-0">
                  <div className="px-5 py-4 border-b border-gray-200 sticky top-0 bg-white z-10 lg:hidden flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">Filters</h3>
                    <button
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900 cursor-pointer"
                      onClick={() => setIsMobileSidebarOpen(false)}
                    >
                      <X size={24} />
                    </button>
                  </div>

                  {/* Active Filters / Selected Filters */}
                  <div className="bg-white py-2 px-4 lg:pt-4">
                    <h2 className="hidden lg:block text-xl font-semibold text-gray-900 mb-4">Filters</h2>
                    {/* Desktop search inside sidebar */}
                    <div className="hidden lg:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-sm px-3 py-2.5 mb-5 focus-within:border-primary focus-within:bg-white transition-colors">
                      <Search size={15} className="text-gray-400 shrink-0" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        placeholder="Search products..."
                        className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
                      />
                      {searchQuery && (
                        <button type="button" onClick={() => { setSearchQuery(''); setCurrentPage(1); }} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                          <X size={13} />
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedBrands.map(brand => (
                        <div key={brand} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                          Brand: {brand}
                          <button
                            onClick={() => toggleBrand(brand)}
                            className="hover:text-primary cursor-pointer transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      {selectedSizes.map(size => (
                        <div key={size} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                          Size: {size}
                          <button
                            onClick={() => toggleSize(size)}
                            className="hover:text-primary cursor-pointer transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      {selectedProductTypes.map(type => (
                        <div key={type} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                          Type: {type}
                          <button
                            onClick={() => toggleProductType(type)}
                            className="hover:text-primary cursor-pointer transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      {selectedPowerTypes.map(type => (
                        <div key={type} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                          Power Type: {type}
                          <button
                            onClick={() => togglePowerType(type)}
                            className="hover:text-primary cursor-pointer transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      {selectedBtus.map(btu => (
                        <div key={btu} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                          BTU: {btu}
                          <button
                            onClick={() => toggleBtu(btu)}
                            className="hover:text-primary cursor-pointer transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      {selectedWidths.map(w => (
                        <div key={w} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                          Width: {w}
                          <button
                            onClick={() => toggleWidth(w)}
                            className="hover:text-primary cursor-pointer transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      {selectedVoltages.map(v => (
                        <div key={v} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                          Voltage: {v}
                          <button
                            onClick={() => toggleVoltage(v)}
                            className="hover:text-primary cursor-pointer transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      {selectedDepths.map(depth => (
                        <div key={depth} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                          Depth: {depth}
                          <button
                            onClick={() => toggleDepth(depth)}
                            className="hover:text-primary cursor-pointer transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      {selectedCondenserTypes.map(c => (
                        <div key={c} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                          Condenser: {c}
                          <button
                            onClick={() => toggleCondenserType(c)}
                            className="hover:text-primary cursor-pointer transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      {selectedHeights.map(h => (
                        <div key={h} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                          Height: {h}
                          <button
                            onClick={() => toggleHeight(h)}
                            className="hover:text-primary cursor-pointer transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    {hasActiveFilters && (
                      <button
                        onClick={clearAllFilters}
                        className="text-sm mt-5 cursor-pointer font-normal underline text-black decoration-gray-900 underline-offset-2 hover:text-primary hover:decoration-primary transition-all"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>

                  <div className="bg-white p-2">
                    {isEvaporationPage ? (
                      <>
                        <FilterSection id="brand" title="BRAND" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                          {brands.map((brand) => (
                            <Checkbox
                              key={brand.name}
                              label={brand.name}
                              count={brand.count}
                              checked={selectedBrands.includes(brand.name)}
                              onChange={() => toggleBrand(brand.name)}
                            />
                          ))}
                        </FilterSection>

                        <FilterSection id="product-type" title="PRODUCT TYPE" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                          {productTypesList.map((item) => (
                            <Checkbox
                              key={item.name}
                              label={item.name}
                              count={item.count}
                              checked={selectedProductTypes.includes(item.name)}
                              onChange={() => toggleProductType(item.name)}
                            />
                          ))}
                        </FilterSection>

                        <FilterSection id="power-type" title="POWER TYPE" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                          {powerTypesList.map((item) => (
                            <Checkbox
                              key={item.name}
                              label={item.name}
                              count={item.count}
                              checked={selectedPowerTypes.includes(item.name)}
                              onChange={() => togglePowerType(item.name)}
                            />
                          ))}
                        </FilterSection>

                        <FilterSection id="voltage" title="VOLTAGE" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                          {voltagesList.map((item) => (
                            <Checkbox
                              key={item.name}
                              label={item.name}
                              count={item.count}
                              checked={selectedVoltages.includes(item.name)}
                              onChange={() => toggleVoltage(item.name)}
                            />
                          ))}
                        </FilterSection>
                      </>
                    ) : isComboPage ? (
                      <>
                        <FilterSection id="brand" title="BRAND" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                          {brands.map((brand) => (
                            <Checkbox
                              key={brand.name}
                              label={brand.name}
                              count={brand.count}
                              checked={selectedBrands.includes(brand.name)}
                              onChange={() => toggleBrand(brand.name)}
                            />
                          ))}
                        </FilterSection>

                        <FilterSection id="size" title="SIZE W X L" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                          {sizesList.map((item) => (
                            <Checkbox
                              key={item.name}
                              label={item.name}
                              count={item.count}
                              checked={selectedSizes.includes(item.name)}
                              onChange={() => toggleSize(item.name)}
                            />
                          ))}
                        </FilterSection>

                        <FilterSection id="product-type" title="PRODUCT TYPE" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                          {productTypesList.map((item) => (
                            <Checkbox
                              key={item.name}
                              label={item.name}
                              count={item.count}
                              checked={selectedProductTypes.includes(item.name)}
                              onChange={() => toggleProductType(item.name)}
                            />
                          ))}
                        </FilterSection>

                        <FilterSection id="btu" title="BTU" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                          {btusList.map((item) => (
                            <Checkbox
                              key={item.name}
                              label={item.name}
                              count={item.count}
                              checked={selectedBtus.includes(item.name)}
                              onChange={() => toggleBtu(item.name)}
                            />
                          ))}
                        </FilterSection>

                        <FilterSection id="width" title="WIDTH" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                          {widthsList.map((item) => (
                            <Checkbox
                              key={item.name}
                              label={item.name}
                              count={item.count}
                              checked={selectedWidths.includes(item.name)}
                              onChange={() => toggleWidth(item.name)}
                            />
                          ))}
                        </FilterSection>

                        <FilterSection id="voltage" title="VOLTAGE" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                          {voltagesList.map((item) => (
                            <Checkbox
                              key={item.name}
                              label={item.name}
                              count={item.count}
                              checked={selectedVoltages.includes(item.name)}
                              onChange={() => toggleVoltage(item.name)}
                            />
                          ))}
                        </FilterSection>

                        <FilterSection id="depth" title="DEPTH" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                          {depthsList.map((item) => (
                            <Checkbox
                              key={item.name}
                              label={item.name}
                              count={item.count}
                              checked={selectedDepths.includes(item.name)}
                              onChange={() => toggleDepth(item.name)}
                            />
                          ))}
                        </FilterSection>

                        <FilterSection id="condenser-type" title="CONDENSER TYPE" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                          {condenserTypesList.map((item) => (
                            <Checkbox
                              key={item.name}
                              label={item.name}
                              count={item.count}
                              checked={selectedCondenserTypes.includes(item.name)}
                              onChange={() => toggleCondenserType(item.name)}
                            />
                          ))}
                        </FilterSection>

                        <FilterSection id="height" title="HEIGHT" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                          {heightsList.map((item) => (
                            <Checkbox
                              key={item.name}
                              label={item.name}
                              count={item.count}
                              checked={selectedHeights.includes(item.name)}
                              onChange={() => toggleHeight(item.name)}
                            />
                          ))}
                        </FilterSection>
                      </>
                    ) : (
                      <>
                        <FilterSection id="brand" title="BRAND" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                          {brands.map((brand) => (
                            <Checkbox
                              key={brand.name}
                              label={brand.name}
                              count={brand.count}
                              checked={selectedBrands.includes(brand.name)}
                              onChange={() => toggleBrand(brand.name)}
                            />
                          ))}
                        </FilterSection>

                        <FilterSection id="size" title="SIZE W X L" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                          {sizesList.map((item) => (
                            <Checkbox
                              key={item.name}
                              label={item.name}
                              count={item.count}
                              checked={selectedSizes.includes(item.name)}
                              onChange={() => toggleSize(item.name)}
                            />
                          ))}
                        </FilterSection>

                        <FilterSection id="product-type" title="PRODUCT TYPE" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                          {productTypesList.map((item) => (
                            <Checkbox
                              key={item.name}
                              label={item.name}
                              count={item.count}
                              checked={selectedProductTypes.includes(item.name)}
                              onChange={() => toggleProductType(item.name)}
                            />
                          ))}
                        </FilterSection>

                        <FilterSection id="width" title="WIDTH" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                          {widthsList.map((item) => (
                            <Checkbox
                              key={item.name}
                              label={item.name}
                              count={item.count}
                              checked={selectedWidths.includes(item.name)}
                              onChange={() => toggleWidth(item.name)}
                            />
                          ))}
                        </FilterSection>

                        <FilterSection id="voltage" title="VOLTAGE" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                          {voltagesList.map((item) => (
                            <Checkbox
                              key={item.name}
                              label={item.name}
                              count={item.count}
                              checked={selectedVoltages.includes(item.name)}
                              onChange={() => toggleVoltage(item.name)}
                            />
                          ))}
                        </FilterSection>

                        <FilterSection id="condenser-type" title="CONDENSER TYPE" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                          {condenserTypesList.map((item) => (
                            <Checkbox
                              key={item.name}
                              label={item.name}
                              count={item.count}
                              checked={selectedCondenserTypes.includes(item.name)}
                              onChange={() => toggleCondenserType(item.name)}
                            />
                          ))}
                        </FilterSection>

                        <FilterSection id="height" title="HEIGHT" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                          {heightsList.map((item) => (
                            <Checkbox
                              key={item.name}
                              label={item.name}
                              count={item.count}
                              checked={selectedHeights.includes(item.name)}
                              onChange={() => toggleHeight(item.name)}
                            />
                          ))}
                        </FilterSection>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1">

              {/* Filter Section - Sorting and View Options */}
              <div className="bg-white border border-gray-200 py-4 px-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left side - Title and Results count */}
                  <div className="flex flex-col">
                    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Showing {displayedProducts.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}–{Math.min(currentPage * ITEMS_PER_PAGE, displayedProducts.length)} of {displayedProducts.length} results
                    </p>
                  </div>

                  {/* Right side - Sorting dropdown and view toggles */}
                  <div className="flex items-center gap-3">
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-sm text-sm text-gray-700 bg-white cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors">
                      <option value="default">Default sorting</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="name-asc">Name: A to Z</option>
                      <option value="name-desc">Name: Z to A</option>
                    </select>

                    {/* View Toggle Buttons */}
                    <div className="flex items-center gap-1 border border-gray-300 rounded-sm overflow-hidden">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 cursor-pointer transition-colors ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                        title="Grid View"
                      >
                        <Grid3X3 size={18} />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 cursor-pointer transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                        title="List View"
                      >
                        <LayoutGrid size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className={`${viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5' : 'flex flex-col'} bg-white`}>
                {displayedProducts.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-gray-500 font-medium border border-dashed border-gray-300 rounded-sm">
                    No products found in this category!
                  </div>
                ) : (
                  paginatedProducts.map((product) => {
                    const formattedInfo = extractProductInfo(product.keyFeatures) || extractProductInfo(product.description) || product.title;
                    return viewMode === 'grid' ? (
                      <div
                        key={product.id}
                        className="bg-white border-t-0 border border-gray-200 py-2 flex flex-col transition-all duration-300 group"
                      >
                        {/* Image Area */}
                        <Link href={`/refrigeration-equipment/${product.category?.slug || slug}/${product.id}`} className="cursor-pointer">
                          <div className="h-45 relative overflow-hidden bg-white flex items-center justify-center">
                            {product.images && product.images[0] ? (
                              <img
                                src={product.images[0]}
                                alt={formattedInfo}
                                className="h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="flex items-center justify-center text-gray-400 font-semibold bg-gray-100 h-full w-full">No Image</div>
                            )}
                          </div>
                        </Link>

                        {/* Content Area */}
                        <div className="p-3 flex flex-col text-center">
                          <div className="text-[10px] text-black font-bold mb-0.5 uppercase">
                            {product.brand || product.title.split(' ')[0]}
                          </div>

                          <Link href={`/refrigeration-equipment/${product.category?.slug || slug}/${product.id}`} className="cursor-pointer">
                            <h3 className="text-xs font-medium text-gray-800 mb-2 text-center max-w-[200px] mx-auto group-hover:text-primary transition-colors line-clamp-2" title={product.title}>
                              {product.title}
                            </h3>
                          </Link>

                          <div className="text-lg font-semibold text-[#004a99] mb-4">${cleanPrice(product.price)} / Ea.</div>

                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              addToCart({
                                id: product.id,
                                name: product.title,
                                title: product.title,
                                price: cleanPrice(product.price),
                                image: product.images[0] || '/placeholder.png',
                                quantity: 1,
                                category: 'refrigeration-equipment'
                              });
                            }}
                            className="w-full py-2 cursor-pointer rounded-sm bg-[#004a99] text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#003d80] transition-colors"
                          >
                            <ShoppingCart size={12} />
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={product.id}
                        className="bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md p-4 flex gap-4 transition-all duration-300 group"
                      >
                        {/* Image */}
                        <Link href={`/refrigeration-equipment/${product.category?.slug || slug}/${product.id}`} className="cursor-pointer">
                          <div className="w-40 h-40 flex-shrink-0 relative overflow-hidden bg-white flex items-center justify-center">
                            {product.images && product.images[0] ? (
                              <img
                                src={product.images[0]}
                                alt={formattedInfo}
                                className="h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="flex items-center justify-center text-gray-400 font-semibold bg-gray-100 h-full w-full">No Image</div>
                            )}
                          </div>
                        </Link>

                        {/* Content */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="text-[10px] text-black font-bold mb-1 uppercase">
                              {product.brand || product.title.split(' ')[0]}
                            </div>

                            <Link href={`/refrigeration-equipment/${product.category?.slug || slug}/${product.id}`} className="cursor-pointer">
                              <h3 className="text-sm font-medium text-gray-800 mb-2 group-hover:text-primary transition-colors">{product.title}</h3>
                            </Link>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-lg font-semibold text-[#004a99]">${cleanPrice(product.price)} / Ea.</div>

                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                addToCart({
                                  id: product.id,
                                  name: product.title,
                                  title: product.title,
                                  price: cleanPrice(product.price),
                                  image: product.images[0] || '/placeholder.png',
                                  quantity: 1,
                                  category: 'refrigeration-equipment'
                                });
                              }}
                              className="px-6 py-2.5 cursor-pointer rounded-sm bg-[#004a99] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#003d80] transition-colors flex items-center gap-2"
                            >
                              <ShoppingCart size={14} />
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Pagination Controls */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />

            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
