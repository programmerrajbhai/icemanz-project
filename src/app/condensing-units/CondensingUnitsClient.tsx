'use client';

import {
  useMemo,
  useState,
  type FormEvent,
} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Grid3X3,
  Headphones,
  Heart,
  LayoutList,
  Menu,
  MessageCircle,
  Package,
  Phone,
  Ruler,
  Search,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Snowflake,
  Thermometer,
  Truck,
  X,
  Zap,
} from 'lucide-react';

import { useCart } from '@/context/CartContext';
import { siteConfig } from '@/config/site';
import styles from './catalog.module.css';

export type CatalogProduct = {
  id: string;
  slug: string;
  title: string;
  sku: string;
  brand: string;
  price: number | null;
  image: string;
  temperature: string;
  hp: string;
  voltage: string;
  compressor: string;
  dimensions: string;
  unavailable: boolean;
  configurable: boolean;
};

type FilterKey =
  | 'brand'
  | 'temperature'
  | 'hp'
  | 'voltage'
  | 'compressor'
  | 'dimensions';

type Filters = Record<FilterKey, string[]>;

type Props = {
  products: CatalogProduct[];
  error?: string | null;
};

const GROUPS: { key: FilterKey; title: string }[] = [
  { key: 'brand', title: 'Brand' },
  { key: 'temperature', title: 'Application / Temperature' },
  { key: 'hp', title: 'Horsepower' },
  { key: 'voltage', title: 'Voltage' },
  { key: 'compressor', title: 'Compressor Type' },
  { key: 'dimensions', title: 'Dimensions' },
];

const EMPTY_FILTERS: Filters = {
  brand: [],
  temperature: [],
  hp: [],
  voltage: [],
  compressor: [],
  dimensions: [],
};

const HERO_BACKGROUND =
  '/category/refrigerationEquipment/Make_mockup_refrigeration_item_202605120945.jpeg';

const HERO_UNIT =
  '/Walk-in-Cooler-Freezer/category/condensingUnits/TS-MR_XR1-600x600.jpg';

const MONEY = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: 'Commercial Grade',
    text: 'Equipment for commercial applications',
  },
  {
    icon: Truck,
    title: 'Shipping Assistance',
    text: 'Discuss delivery to your location',
  },
  {
    icon: Headphones,
    title: 'Expert Support',
    text: 'Real people. Real solutions.',
  },
];

function ProductImage({
  src,
  title,
}: {
  src: string;
  title: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={styles.imagePlaceholder}>
        <Package size={42} strokeWidth={1.2} />
        <span>Image unavailable</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={title}
      fill
      unoptimized
      sizes="(max-width: 599px) 90vw, (max-width: 999px) 42vw, 270px"
      style={{ objectFit: 'contain', padding: '15px' }}
      onError={() => setFailed(true)}
    />
  );
}

export default function CondensingUnitsClient({
  products,
  error = null,
}: Props) {
  const { addToCart, cartItems } = useCart();

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sort, setSort] = useState('name');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [hideUnavailable, setHideUnavailable] = useState(false);
  const [pricedOnly, setPricedOnly] = useState(false);

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const options = useMemo(() => {
    const result = {} as Record<
      FilterKey,
      { value: string; count: number }[]
    >;

    for (const group of GROUPS) {
      const counts = new Map<string, number>();

      for (const product of products) {
        const value = product[group.key];

        if (value) {
          counts.set(value, (counts.get(value) || 0) + 1);
        }
      }

      result[group.key] = [...counts.entries()]
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) =>
          a.value.localeCompare(b.value, 'en', {
            numeric: true,
            sensitivity: 'base',
          }),
        );
    }

    return result;
  }, [products]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = products.filter((product) => {
      const matchesSearch =
        !query ||
        [
          product.title,
          product.sku,
          product.brand,
          product.hp,
          product.temperature,
          product.voltage,
          product.compressor,
        ]
          .join(' ')
          .toLowerCase()
          .includes(query);

      const matchesFilters = GROUPS.every(
        ({ key }) =>
          filters[key].length === 0 ||
          filters[key].includes(product[key]),
      );

      return (
        matchesSearch &&
        matchesFilters &&
        (!savedOnly || saved.includes(product.id)) &&
        (!hideUnavailable || !product.unavailable) &&
        (!pricedOnly || product.price !== null)
      );
    });

    return result.sort((a, b) => {
      if (sort !== 'name') {
        if (a.price === null && b.price !== null) return 1;
        if (a.price !== null && b.price === null) return -1;

        if (a.price !== null && b.price !== null) {
          const difference =
            sort === 'price-low'
              ? a.price - b.price
              : b.price - a.price;

          if (difference !== 0) return difference;
        }
      }

      return a.title.localeCompare(b.title, 'en', {
        numeric: true,
      });
    });
  }, [
    products,
    filters,
    search,
    sort,
    saved,
    savedOnly,
    hideUnavailable,
    pricedOnly,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * perPage;
  const visible = filtered.slice(start, start + perPage);

  const paginationStart = Math.max(
    1,
    Math.min(currentPage - 2, totalPages - 4),
  );

  const pageNumbers = Array.from(
    { length: Math.min(5, totalPages) },
    (_, index) => paginationStart + index,
  );

  const activeCount = GROUPS.reduce(
    (total, group) => total + filters[group.key].length,
    0,
  );

  const mediumTemps = options.temperature
    .filter((item) => /medium/i.test(item.value))
    .map((item) => item.value);

  const lowTemps = options.temperature
    .filter((item) => /low/i.test(item.value))
    .map((item) => item.value);

  function isTemperatureActive(values: string[]) {
    return (
      values.length > 0 &&
      filters.temperature.length === values.length &&
      values.every((value) => filters.temperature.includes(value))
    );
  }

  function chooseTemperature(values: string[]) {
    if (!values.length) return;

    const active = isTemperatureActive(values);

    setFilters((previous) => ({
      ...previous,
      temperature: active ? [] : values,
    }));
    setPage(1);
  }

  function toggleFilter(key: FilterKey, value: string) {
    setFilters((previous) => ({
      ...previous,
      [key]: previous[key].includes(value)
        ? previous[key].filter((item) => item !== value)
        : [...previous[key], value],
    }));
    setPage(1);
  }

  function clearAll() {
    setSearch('');
    setFilters({
      brand: [],
      temperature: [],
      hp: [],
      voltage: [],
      compressor: [],
      dimensions: [],
    });
    setHideUnavailable(false);
    setPricedOnly(false);
    setSavedOnly(false);
    setPage(1);
  }

  function toggleSaved(id: string) {
    setSaved((previous) =>
      previous.includes(id)
        ? previous.filter((value) => value !== id)
        : [...previous, id],
    );
    setPage(1);
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);

    document.getElementById('condensing-catalog')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  function openCompressorFilters() {
    setMobileFilters(true);

    requestAnimationFrame(() => {
      const target = document.getElementById(
        'condensing-filter-compressor',
      );

      if (target instanceof HTMLDetailsElement) {
        target.open = true;
      }

      target?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    });
  }

  function changePage(value: number) {
    setPage(value);

    document.getElementById('catalog-results')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  function addProduct(product: CatalogProduct) {
    if (
      product.price === null ||
      product.unavailable ||
      product.configurable
    ) {
      return;
    }

    addToCart({
      id: product.id,
      name: product.title,
      brand: product.brand,
      price: product.price,
      image: product.image,
      quantity: 1,
      category: 'refrigeration-equipment',
    });
  }

  return (
    <div className={styles.page}>
      {/* Reference-style header */}
      <header className={styles.header}>
        <div className={`${styles.wrap} ${styles.headerTop}`}>
          <Link href="/" className={styles.logo} aria-label="ICEMANZ home">
            <Snowflake size={45} strokeWidth={1.5} />
            <span>
              <strong>ICEMANZ</strong>
              <small>COMMERCIAL REFRIGERATION SOLUTIONS</small>
            </span>
          </Link>

          <form onSubmit={submitSearch} className={styles.search}>
            <input
              type="search"
              aria-label="Search condensing units"
              placeholder="Search for products, brands, or model numbers..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
            <button type="submit" aria-label="Search">
              <Search size={20} />
            </button>
          </form>

          <a
            href={`tel:${siteConfig.company.phone.replace(/[^\d+]/g, '')}`}
            className={styles.phone}
          >
            <Phone size={23} />
            <span>
              <strong>{siteConfig.company.phone}</strong>
              <small>Expert Support</small>
            </span>
          </a>

          <Link href="/support" className={styles.headerAction}>
            <Headphones size={21} />
            <span>Support</span>
          </Link>

          <Link
            href="/cart"
            className={styles.cartLink}
            aria-label={`Cart with ${cartCount} items`}
          >
            <ShoppingCart size={26} />
            <span className={styles.cartCount}>{cartCount}</span>
            <small>Cart</small>
          </Link>

          <button
            type="button"
            className={styles.menuButton}
            aria-label="Toggle navigation"
            aria-expanded={mobileNav}
            onClick={() => setMobileNav((previous) => !previous)}
          >
            {mobileNav ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <div className={styles.navBar}>
          <nav
            aria-label="Main navigation"
            className={`${styles.wrap} ${styles.navigation} ${
              mobileNav ? styles.navigationOpen : ''
            }`}
          >
            <Link href="/">Home</Link>

            <details className={styles.navDropdown}>
              <summary>
                Refrigeration Equipment
                <ChevronDown size={13} />
              </summary>
              <div className={styles.dropdownMenu}>
                <Link href="/refrigeration-equipment">
                  All Refrigeration Equipment
                </Link>
                <Link href="/condensing-units">
                  Condensing Units
                </Link>
                <Link href="/walk-in-cooler-freezer">
                  Walk-In Coolers & Freezers
                </Link>
              </div>
            </details>

            <details className={styles.navDropdown}>
              <summary>
                Brands
                <ChevronDown size={13} />
              </summary>
              <div className={styles.dropdownMenu}>
                {options.brand.length ? (
                  options.brand.map((brand) => (
                    <button
                      key={brand.value}
                      type="button"
                      onClick={() => {
                        setFilters((previous) => ({
                          ...previous,
                          brand: [brand.value],
                        }));
                        setPage(1);
                        document
                          .getElementById('condensing-catalog')
                          ?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      {brand.value}
                    </button>
                  ))
                ) : (
                  <Link href="/refrigeration-equipment">
                    Explore Products
                  </Link>
                )}
              </div>
            </details>

            <details className={styles.navDropdown}>
              <summary>
                Resources
                <ChevronDown size={13} />
              </summary>
              <div className={styles.dropdownMenu}>
                <Link href="/support">Support Center</Link>
                <Link href="/recommendation">Product Recommendation</Link>
                <Link href="/completed-projects">Completed Projects</Link>
              </div>
            </details>

            <Link href="/services">Our Services</Link>
            <Link href="/enquiry">Contact</Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Full-width photographic hero */}
        <section className={styles.hero}>
          <div
            className={styles.heroBackdrop}
            style={{
              backgroundImage: `url("${HERO_BACKGROUND}")`,
            }}
          />

          <div className={`${styles.wrap} ${styles.heroInner}`}>
            <div className={styles.heroContent}>
              <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                <Link href="/">Home</Link>
                <ChevronRight size={12} />
                <Link href="/refrigeration-equipment">
                  Refrigeration Equipment
                </Link>
                <ChevronRight size={12} />
                <span aria-current="page">Condensing Units</span>
              </nav>

              <h1>Condensing Units</h1>

              <p className={styles.heroDescription}>
                Reliable and efficient condensing units for commercial
                cooling and refrigeration applications.
              </p>

              <div className={styles.heroBenefits}>
                {BENEFITS.map((benefit) => (
                  <div key={benefit.title} className={styles.benefit}>
                    <benefit.icon size={30} strokeWidth={1.5} />
                    <span>
                      <strong>{benefit.title}</strong>
                      <small>{benefit.text}</small>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.heroUnit}>
              <Image
                src={HERO_UNIT}
                alt="Turbo Air commercial condensing unit"
                fill
                priority
                sizes="(max-width: 700px) 90vw, 48vw"
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
        </section>

        <div className={styles.wrap}>
          {/* Quick category controls */}
          <section className={styles.quickRow} aria-label="Quick filters">
            <button
              type="button"
              disabled={!mediumTemps.length}
              aria-pressed={isTemperatureActive(mediumTemps)}
              onClick={() => chooseTemperature(mediumTemps)}
              className={`${styles.quickCard} ${
                isTemperatureActive(mediumTemps) ? styles.quickActive : ''
              }`}
            >
              <Thermometer size={31} strokeWidth={1.5} />
              <span>
                <strong>Medium Temp</strong>
                <small>Walk-in coolers & refrigerators</small>
              </span>
            </button>

            <button
              type="button"
              disabled={!lowTemps.length}
              aria-pressed={isTemperatureActive(lowTemps)}
              onClick={() => chooseTemperature(lowTemps)}
              className={`${styles.quickCard} ${
                isTemperatureActive(lowTemps) ? styles.quickActive : ''
              }`}
            >
              <Snowflake size={31} strokeWidth={1.5} />
              <span>
                <strong>Low Temp</strong>
                <small>Walk-in freezers & frozen storage</small>
              </span>
            </button>

            <button
              type="button"
              onClick={openCompressorFilters}
              className={styles.quickCard}
            >
              <Cpu size={31} strokeWidth={1.5} />
              <span>
                <strong>Compressor Type</strong>
                <small>Explore available configurations</small>
              </span>
            </button>

            <Link href="/recommendation" className={styles.quickCard}>
              <MessageCircle size={31} strokeWidth={1.5} />
              <span>
                <strong>Need Help Choosing?</strong>
                <small>Get expert recommendation</small>
              </span>
            </Link>
          </section>

          <div id="condensing-catalog" className={styles.catalog}>
            <button
              type="button"
              className={styles.mobileFilterButton}
              aria-expanded={mobileFilters}
              aria-controls="condensing-sidebar"
              onClick={() => setMobileFilters((previous) => !previous)}
            >
              <SlidersHorizontal size={17} />
              Filters {activeCount > 0 && `(${activeCount})`}
              {mobileFilters ? <X size={17} /> : <ChevronDown size={17} />}
            </button>

            {/* Sidebar */}
            <aside
              id="condensing-sidebar"
              aria-label="Product filters"
              className={`${styles.sidebar} ${
                mobileFilters ? styles.sidebarOpen : ''
              }`}
            >
              <div className={styles.sidebarTitle}>
                <h2>Filter by</h2>
                <button type="button" onClick={clearAll}>
                  Clear All
                </button>
              </div>

              {GROUPS.map((group) => (
                <details
                  key={group.key}
                  id={`condensing-filter-${group.key}`}
                  open={group.key !== 'dimensions'}
                  className={styles.filterGroup}
                >
                  <summary>
                    <span>
                      {group.key === 'dimensions' && <Ruler size={15} />}
                      {group.title}
                    </span>
                    <ChevronDown size={13} />
                  </summary>

                  <div className={styles.filterOptions}>
                    {options[group.key].length ? (
                      options[group.key].map((option) => (
                        <label key={option.value}>
                          <input
                            type="checkbox"
                            checked={filters[group.key].includes(option.value)}
                            onChange={() =>
                              toggleFilter(group.key, option.value)
                            }
                          />
                          <span>{option.value}</span>
                          <small>({option.count})</small>
                        </label>
                      ))
                    ) : (
                      <p className={styles.noSpecification}>
                        No options listed
                      </p>
                    )}
                  </div>
                </details>
              ))}

              <details className={styles.moreFilters}>
                <summary>
                  <SlidersHorizontal size={16} />
                  More Filters
                  <ChevronDown size={13} />
                </summary>

                <div className={styles.filterOptions}>
                  <label>
                    <input
                      type="checkbox"
                      checked={hideUnavailable}
                      onChange={(event) => {
                        setHideUnavailable(event.target.checked);
                        setPage(1);
                      }}
                    />
                    <span>Hide unavailable</span>
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={pricedOnly}
                      onChange={(event) => {
                        setPricedOnly(event.target.checked);
                        setPage(1);
                      }}
                    />
                    <span>With published price</span>
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={savedOnly}
                      onChange={(event) => {
                        setSavedOnly(event.target.checked);
                        setPage(1);
                      }}
                    />
                    <span>Saved products ({saved.length})</span>
                  </label>
                </div>
              </details>
            </aside>

            {/* Products */}
            <section
              id="catalog-results"
              className={styles.results}
              aria-label="Condensing units"
            >
              <div className={styles.toolbar}>
                <h2 aria-live="polite">
                  {error ? 'Products' : `${filtered.length} Products`}
                </h2>

                <div className={styles.toolbarActions}>
                  <label className={styles.sortControl}>
                    <span>Sort by:</span>
                    <select
                      aria-label="Sort products"
                      value={sort}
                      onChange={(event) => {
                        setSort(event.target.value);
                        setPage(1);
                      }}
                    >
                      <option value="name">Model: A–Z</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </label>

                  <div className={styles.viewControls}>
                    <button
                      type="button"
                      aria-label="Grid view"
                      aria-pressed={view === 'grid'}
                      className={view === 'grid' ? styles.viewActive : ''}
                      onClick={() => setView('grid')}
                    >
                      <Grid3X3 size={17} />
                    </button>
                    <button
                      type="button"
                      aria-label="List view"
                      aria-pressed={view === 'list'}
                      className={view === 'list' ? styles.viewActive : ''}
                      onClick={() => setView('list')}
                    >
                      <LayoutList size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {(activeCount > 0 || search) && (
                <div className={styles.activeFilters}>
                  {search && (
                    <button type="button" onClick={() => setSearch('')}>
                      Search: {search}
                      <X size={12} />
                    </button>
                  )}

                  {GROUPS.flatMap((group) =>
                    filters[group.key].map((value) => (
                      <button
                        key={`${group.key}-${value}`}
                        type="button"
                        aria-label={`Remove ${value} filter`}
                        onClick={() => toggleFilter(group.key, value)}
                      >
                        {value}
                        <X size={12} />
                      </button>
                    )),
                  )}
                </div>
              )}

              {error ? (
                <div role="alert" className={styles.emptyState}>
                  <Package size={40} />
                  <h3>Catalog temporarily unavailable</h3>
                  <p>{error}</p>
                  <a href="/condensing-units" className={styles.primaryButton}>
                    Refresh Catalog
                  </a>
                </div>
              ) : visible.length === 0 ? (
                <div className={styles.emptyState}>
                  <Search size={37} />
                  <h3>
                    {products.length === 0
                      ? 'No condensing units are listed yet'
                      : 'No matching products'}
                  </h3>
                  <p>
                    {products.length === 0
                      ? 'Contact our team for current equipment options.'
                      : 'Try another search or clear your selected filters.'}
                  </p>

                  {products.length > 0 ? (
                    <button
                      type="button"
                      onClick={clearAll}
                      className={styles.primaryButton}
                    >
                      Clear Filters
                    </button>
                  ) : (
                    <Link href="/quote" className={styles.primaryButton}>
                      Request a Quote
                    </Link>
                  )}
                </div>
              ) : (
                <>
                  <div
                    className={
                      view === 'grid' ? styles.productGrid : styles.productList
                    }
                  >
                    {visible.map((product) => {
                      const href =
                        `/condensing-units/${encodeURIComponent(product.slug)}` +
                        `/${encodeURIComponent(product.id)}`;

                      const isSaved = saved.includes(product.id);
                      const canAdd =
                        product.price !== null &&
                        !product.unavailable &&
                        !product.configurable;

                      return (
                        <article key={product.id} className={styles.productCard}>
                          <Link
                            href={href}
                            className={styles.productImage}
                            aria-label={`View ${product.title}`}
                          >
                            <ProductImage
                              key={product.image}
                              src={product.image}
                              title={product.title}
                            />
                          </Link>

                          <button
                            type="button"
                            className={`${styles.favorite} ${
                              isSaved ? styles.favoriteActive : ''
                            }`}
                            aria-label={`${isSaved ? 'Unsave' : 'Save'} ${product.title}`}
                            aria-pressed={isSaved}
                            onClick={() => toggleSaved(product.id)}
                          >
                            <Heart
                              size={15}
                              fill={isSaved ? 'currentColor' : 'none'}
                            />
                          </button>

                          <div className={styles.productBody}>
                            <p className={styles.brand}>{product.brand}</p>

                            <Link href={href} className={styles.productTitle}>
                              <h3>{product.sku || product.title}</h3>
                            </Link>

                            {product.sku && (
                              <p className={styles.productDescription}>
                                {product.title}
                              </p>
                            )}

                            <div className={styles.productSpecs}>
                              {product.hp && (
                                <span>
                                  <Zap size={13} />
                                  {product.hp}
                                </span>
                              )}
                              {product.temperature && (
                                <span>
                                  <Thermometer size={13} />
                                  {product.temperature}
                                </span>
                              )}
                            </div>

                            <div className={styles.productBottom}>
                              <div className={styles.price}>
                                <strong>
                                  {product.price !== null
                                    ? MONEY.format(product.price)
                                    : 'Request price'}
                                </strong>
                                {product.price !== null && <small>/ Ea.</small>}
                              </div>

                              {product.unavailable ? (
                                <button
                                  type="button"
                                  disabled
                                  className={styles.addButton}
                                >
                                  Currently Unavailable
                                </button>
                              ) : canAdd ? (
                                <button
                                  type="button"
                                  onClick={() => addProduct(product)}
                                  className={styles.addButton}
                                >
                                  <ShoppingCart size={15} />
                                  Add to Cart
                                </button>
                              ) : (
                                <Link
                                  href={
                                    product.price === null && !product.configurable
                                      ? `/quote?product=${encodeURIComponent(product.id)}`
                                      : href
                                  }
                                  className={styles.addButton}
                                >
                                  {product.configurable
                                    ? 'Select Options'
                                    : 'Request a Quote'}
                                  <ArrowRight size={14} />
                                </Link>
                              )}
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  <div className={styles.pagination}>
                    <p>
                      Showing {start + 1}–{Math.min(start + perPage, filtered.length)}
                      {' '}of {filtered.length} products
                    </p>

                    {totalPages > 1 && (
                      <nav aria-label="Pagination" className={styles.pageButtons}>
                        <button
                          type="button"
                          disabled={currentPage === 1}
                          onClick={() => changePage(currentPage - 1)}
                          aria-label="Previous page"
                        >
                          <ChevronLeft size={14} />
                          <span>Previous</span>
                        </button>

                        {pageNumbers.map((number) => (
                          <button
                            key={number}
                            type="button"
                            aria-label={`Page ${number}`}
                            aria-current={number === currentPage ? 'page' : undefined}
                            className={
                              number === currentPage ? styles.currentPage : ''
                            }
                            onClick={() => changePage(number)}
                          >
                            {number}
                          </button>
                        ))}

                        <button
                          type="button"
                          disabled={currentPage === totalPages}
                          onClick={() => changePage(currentPage + 1)}
                          aria-label="Next page"
                        >
                          <span>Next</span>
                          <ChevronRight size={14} />
                        </button>
                      </nav>
                    )}

                    <select
                      aria-label="Products per page"
                      value={perPage}
                      onChange={(event) => {
                        setPerPage(Number(event.target.value));
                        setPage(1);
                      }}
                    >
                      <option value={12}>12 per page</option>
                      <option value={24}>24 per page</option>
                      <option value={48}>48 per page</option>
                    </select>
                  </div>
                </>
              )}
            </section>
          </div>

          {/* Help banner */}
          <section className={styles.helpBanner}>
            <Headphones
              className={styles.helpIcon}
              size={61}
              strokeWidth={1.2}
            />

            <div className={styles.helpText}>
              <h2>Need Help Choosing?</h2>
              <p>
                Not sure which condensing unit is right for your application?
                <br />
                Our refrigeration specialists are here to help.
              </p>
            </div>

            <Link href="/recommendation" className={styles.primaryButton}>
              Get Expert Recommendation
              <ArrowRight size={16} />
            </Link>

            <ul className={styles.helpChecklist}>
              <li><Check size={14} /> Discuss your requirements</li>
              <li><Check size={14} /> Explore suitable options</li>
              <li><Check size={14} /> Request a custom quote</li>
            </ul>
          </section>
        </div>

        {/* Bottom service strip */}
        <section className={styles.trustStrip}>
          <div className={`${styles.wrap} ${styles.trustGrid}`}>
            {[
              ...BENEFITS,
              {
                icon: ShieldCheck,
                title: 'Secure Checkout',
                text: 'Payment processing through Stripe',
              },
            ].map((benefit) => (
              <div key={benefit.title} className={styles.benefit}>
                <benefit.icon size={32} strokeWidth={1.4} />
                <span>
                  <strong>{benefit.title}</strong>
                  <small>{benefit.text}</small>
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}