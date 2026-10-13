"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  Headphones,
  Mail,
  Maximize2,
  Minus,
  Package,
  Phone,
  Plus,
  Share2,
  ShoppingCart,
  SlidersHorizontal,
  Snowflake,
  Truck,
  X,
} from "lucide-react";

import Header from "@/components/Header";
import { useCart } from "@/context/CartContext";
import { siteConfig } from "@/config/site";
import styles from "./product-details.module.css";

type JsonObject = Record<string, unknown>;

type Product = {
  id: string;
  title: string;
  slug?: string | null;
  sku?: string | null;
  brand?: string | null;
  price?: string | number | null;
  images?: unknown;
  badge?: string | null;
  description?: string | null;
  keyFeatures?: string | null;
  condition?: string | null;
  type?: string | null;
  warranty?: unknown;
  detailedFeatures?: unknown;
  specs?: unknown;
  documents?: unknown;
  features?: unknown;
  faqs?: unknown;
  productOptions?: unknown;
};

type RelatedProduct = {
  id: string;
  title: string;
  slug?: string | null;
  brand?: string | null;
  price?: string | number | null;
  images?: unknown;
};

type Props = {
  product: Product;
  relatedProducts?: RelatedProduct[];
};

type Choice = {
  label: string;
  extra: number | null;
};

type OptionGroup = {
  id: string;
  name: string;
  label: string;
  kind: "variant" | "addon";
  position: number;
  choices: Choice[];
};

type SpecRow = {
  label: string;
  value: string;
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function money(value: number) {
  return currency.format(value);
}

function readJson(value: unknown): unknown {
  if (typeof value !== "string") return value;

  const source = value.trim();

  if (!source.startsWith("[") && !source.startsWith("{")) {
    return value;
  }

  try {
    return JSON.parse(source);
  } catch {
    return value;
  }
}

function object(value: unknown): JsonObject {
  const parsed = readJson(value);

  return parsed !== null &&
    typeof parsed === "object" &&
    !Array.isArray(parsed)
    ? (parsed as JsonObject)
    : {};
}

function list(value: unknown): unknown[] {
  const parsed = readJson(value);
  return Array.isArray(parsed) ? parsed : [];
}

function text(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

function plain(value: unknown): string {
  const entities: Record<string, string> = {
    "&amp;": "&",
    "&quot;": '"',
    "&apos;": "'",
    "&#39;": "'",
    "&#34;": '"',
    "&lt;": "<",
    "&gt;": ">",
    "&nbsp;": " ",
  };

  return text(value)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:p|div|li|h[1-6])>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(
      /&(?:amp|quot|apos|lt|gt|nbsp|#39|#34);/g,
      (entity) => entities[entity] || entity,
    )
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n\s*\n/g, "\n\n")
    .trim();
}

function amount(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value !== "string") return null;

  const clean = value
    .trim()
    .replace(/USD/gi, "")
    .replace(/[$,\s]/g, "");

  return /^[+-]?\d+(\.\d{1,2})?$/.test(clean)
    ? Number(clean)
    : null;
}

function safeUrl(value: unknown): string {
  const source = text(value);

  if (source.startsWith("//")) return `https:${source}`;
  if (source.startsWith("/") && !source.startsWith("//")) return source;
  if (/^https?:\/\//i.test(source)) return source;

  return "";
}

function imageUrls(value: unknown): string[] {
  const parsed = readJson(value);
  const entries = Array.isArray(parsed) ? parsed : parsed ? [parsed] : [];

  return Array.from(
    new Set(
      entries
        .map((entry) => {
          const data = object(entry);
          return safeUrl(
            typeof entry === "string" ? entry : data.src || data.url,
          );
        })
        .filter(Boolean),
    ),
  );
}

function lines(value: unknown): string[] {
  if (typeof value === "string") {
    return plain(value)
      .split(/\n+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return list(value)
    .map((entry) => {
      const data = object(entry);
      return plain(
        typeof entry === "string"
          ? entry
          : data.text || data.value || data.label,
      );
    })
    .filter(Boolean);
}

function prettyLabel(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/^\w/, (character) => character.toUpperCase());
}

function specRows(value: unknown): SpecRow[] {
  const parsed = readJson(value);

  if (Array.isArray(parsed)) {
    return parsed.flatMap((entry) => {
      const data = object(entry);
      const label = plain(data.label || data.name || data.key);
      const val = plain(data.value);

      return label && val ? [{ label, value: val }] : [];
    });
  }

  return Object.entries(object(parsed)).flatMap(([label, val]) => {
    const scalar =
      typeof val === "boolean"
        ? val
          ? "Yes"
          : "No"
        : plain(val);

    return scalar ? [{ label: prettyLabel(label), value: scalar }] : [];
  });
}

function normalizeOptions(product: Product): OptionGroup[] {
  const features = object(product.features);

  const variants = list(features.options).flatMap((entry, index) => {
    const data = object(entry);
    const name = text(data.name || data.label);
    const values = list(data.values);

    const choices = values
      .map((value) => {
        const item = object(value);
        const label = text(
          typeof value === "string" ? value : item.value || item.name,
        );

        return { label, extra: 0 };
      })
      .filter((choice) => choice.label);

    if (!name || !choices.length) return [];

    return [
      {
        id: `variant-${index}`,
        name,
        label: name,
        kind: "variant" as const,
        position: Number(data.position) || index + 1,
        choices,
      },
    ];
  });

  const variantNames = new Set(
    variants.map((group) => group.name.toLowerCase()),
  );

  const addons = list(product.productOptions).flatMap((entry, index) => {
    const data = object(entry);
    const name = text(data.name || data.label);

    if (!name || variantNames.has(name.toLowerCase())) return [];

    const choices = list(data.options)
      .map((entry) => {
        const choice = object(entry);
        const label = text(
          typeof entry === "string" ? entry : choice.label || choice.value,
        );

        const rawPrice = choice.price;
        const extra =
          rawPrice === undefined ||
          rawPrice === null ||
          text(rawPrice) === ""
            ? 0
            : amount(rawPrice);

        return { label, extra };
      })
      .filter((choice) => choice.label);

    if (!choices.length) return [];

    return [
      {
        id: `addon-${index}`,
        name,
        label: text(data.label) || name,
        kind: "addon" as const,
        position: index + 1,
        choices,
      },
    ];
  });

  return [...variants, ...addons];
}

function selectionKey(value: Record<string, string | undefined>) {
  return JSON.stringify(
    Object.entries(value)
      .filter(([, item]) => item !== undefined)
      .sort(([a], [b]) => a.localeCompare(b)),
  );
}

function ProductImage({
  src,
  alt,
  priority = false,
  sizes = "(max-width: 900px) 100vw, 55vw",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
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
      alt={alt}
      fill
      priority={priority}
      unoptimized
      sizes={sizes}
      className={styles.productImage}
      onError={() => setFailed(true)}
    />
  );
}

export default function WalkInCoolerProductClient(props: Props) {
  // Reset gallery, quantity and selections when navigating to another product.
  return <ProductDetails key={props.product.id} {...props} />;
}

function ProductDetails({ product, relatedProducts = [] }: Props) {
  const { addToCart, cartItems, setIsCartOpen } = useCart();

  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const features = object(product.features);
  const images = imageUrls(product.images);
  const groups = normalizeOptions(product);
  const variants = list(features.variants).map(object);
  const variantGroups = groups.filter((group) => group.kind === "variant");

  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const defaultVariant =
      variants.find((variant) => variant.available !== false) || variants[0];

    return Object.fromEntries(
      groups.map((group) => {
        const variantValue =
          group.kind === "variant" && defaultVariant
            ? text(defaultVariant[`option${group.position}`])
            : "";

        const exists = group.choices.some(
          (choice) => choice.label === variantValue,
        );

        return [
          group.id,
          exists ? variantValue : group.choices[0].label,
        ];
      }),
    );
  });

  const visibleGroups = groups.filter(
    (group) =>
      !(
        group.kind === "variant" &&
        group.name.toLowerCase() === "title" &&
        group.choices.length === 1 &&
        group.choices[0].label.toLowerCase() === "default title"
      ),
  );

  const selectedVariant =
    variants.length === 1 && variantGroups.length === 0
      ? variants[0]
      : variantGroups.length > 0
        ? variants.find((variant) =>
            variantGroups.every(
              (group) =>
                text(variant[`option${group.position}`]) ===
                selected[group.id],
            ),
          )
        : undefined;

  const missingVariant =
    (variantGroups.length > 0 && !selectedVariant) ||
    (variants.length > 1 && variantGroups.length === 0);

  /*
   * The repository's Amerikooler scraper stores:
   * product.price in dollars, features.variants[].price in cents.
   * Only apply that conversion to its identifiable imported records.
   */
  const importedAmerikooler =
    text(features.vendor).toLowerCase() === "amerikooler" &&
    /^https?:\/\/(?:www\.)?atlanticse\.com\//i.test(
      text(features.sourceUrl),
    );

  const basePrice = amount(product.price);

  let configuredBase = basePrice;

  if (selectedVariant) {
    const variantPrice = amount(selectedVariant.price);

    configuredBase =
      importedAmerikooler && variantPrice !== null
        ? variantPrice / 100
        : null;
  }

  let extras = 0;
  let unknownExtraPrice = false;

  for (const group of groups) {
    if (group.kind !== "addon") continue;

    const choice = group.choices.find(
      (entry) => entry.label === selected[group.id],
    );

    if (!choice || choice.extra === null) {
      unknownExtraPrice = true;
    } else {
      extras += choice.extra;
    }
  }

  const unitPrice =
    configuredBase !== null &&
    configuredBase > 0 &&
    !unknownExtraPrice &&
    !missingVariant
      ? Math.round((configuredBase + extras) * 100) / 100
      : null;

  const unavailable =
    features.available === false ||
    features.available === "false" ||
    selectedVariant?.available === false ||
    /out[\s-]*of[\s-]*stock|sold[\s-]*out/i.test(product.badge || "");

  const canPurchase =
    !unavailable &&
    !missingVariant &&
    unitPrice !== null &&
    unitPrice > 0;

  const selectedOptions = Object.fromEntries(
    visibleGroups.map((group) => [group.name, selected[group.id]]),
  );

  const brand = text(product.brand || features.vendor);
  const sku = text(selectedVariant?.sku) || text(product.sku);
  const description = plain(product.description);
  const currentImage = images[activeImage] || images[0] || "";
  const phone = siteConfig.company.phone;
  const phoneHref = `tel:${phone.replace(/[^\d+]/g, "")}`;

  const highlights = Array.from(
    new Set([
      ...lines(product.detailedFeatures),
      ...lines(product.keyFeatures),
      ...lines(features.features),
    ]),
  );

  const specs = Array.from(
    new Map(
      [
        ...specRows(product.specs),
        ...specRows(features.specifications),
        ...(brand ? [{ label: "Brand", value: brand }] : []),
        ...(sku ? [{ label: "SKU", value: sku }] : []),
        ...(product.condition
          ? [{ label: "Condition", value: product.condition }]
          : []),
        ...(text(features.dimensions)
          ? [{ label: "Dimensions", value: text(features.dimensions) }]
          : []),
        ...(text(features.refrigerationType)
          ? [
              {
                label: "Refrigeration",
                value: text(features.refrigerationType),
              },
            ]
          : []),
      ].map((row) => [row.label.toLowerCase(), row]),
    ).values(),
  );

  const documents = list(product.documents).flatMap((entry) => {
    const doc = object(entry);
    const url = safeUrl(doc.url || doc.href);
    const name = text(doc.name || doc.title || doc.label);

    return url && name ? [{ name, url }] : [];
  });

  const warranty = [
    ...lines(product.warranty),
    ...specRows(
      Array.isArray(readJson(product.warranty))
        ? {}
        : product.warranty,
    ).map((row) => `${row.label}: ${row.value}`),
  ];

  const faqs = list(product.faqs).flatMap((entry) => {
    const faq = object(entry);
    const question = plain(faq.question || faq.q);
    const answer = plain(faq.answer || faq.a);

    return question && answer ? [{ question, answer }] : [];
  });

  const featureSections = [
    { key: "panels", label: "Panel construction" },
    { key: "doors", label: "Door features" },
    { key: "topMount", label: "Top-mount refrigeration" },
    { key: "remote", label: "Remote refrigeration" },
  ]
    .map((section) => ({
      ...section,
      items: lines(features[section.key]),
    }))
    .filter((section) => section.items.length > 0);

  const isBoxOnly =
    /box only/i.test(product.title) ||
    /box only/i.test(text(features.refrigerationType));

  const related = relatedProducts
    .filter((item) => item.id !== product.id)
    .slice(0, 4);

  function changeImage(direction: number) {
    if (images.length < 2) return;

    setActiveImage(
      (current) => (current + direction + images.length) % images.length,
    );
  }

  async function shareProduct() {
    const shareData = {
      title: product.title,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Product link copied.");
      } else {
        toast.error("Please copy the page URL from your browser.");
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        toast.error("Could not share the product. Please copy the page URL.");
      }
    }
  }

  function handleAddToCart() {
    if (!canPurchase || unitPrice === null) return;

    /*
     * Existing CartContext merges by product.id.
     * Prevent a different configuration from silently merging into it.
     */
    const existing = cartItems.find((item) => item.id === product.id);

    if (
      existing &&
      (selectionKey(existing.selectedOptions || {}) !==
        selectionKey(selectedOptions) ||
        Math.abs(existing.price - unitPrice) > 0.005)
    ) {
      toast.error(
        "A different configuration of this product is already in your cart. Remove that item before adding this selection.",
        { duration: 6500 },
      );

      setIsCartOpen(true);
      return;
    }

    addToCart({
      id: product.id,
      name: product.title,
      brand,
      price: unitPrice,
      image: images[0] || "",
      quantity,
      category: "walk-in-cooler-freezer",
      selectedOptions,
    });

    setIsCartOpen(true);
  }

  return (
    <>
      <Header />

      <main className={styles.page}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <ChevronRight size={13} aria-hidden="true" />
            <Link href="/walk-in-cooler-freezer">Walk-in coolers & freezers</Link>
            <ChevronRight size={13} aria-hidden="true" />
            <span aria-current="page">{sku || brand || "Product details"}</span>
          </nav>

          <div className={styles.topline}>
            <span className={styles.eyebrow}>
              <Snowflake size={15} />
              THE WALK-IN COLLECTION
            </span>

            <button
              type="button"
              className={styles.shareButton}
              onClick={shareProduct}
            >
              <Share2 size={16} />
              Share product
            </button>
          </div>

          <div className={styles.productLayout}>
            <section className={styles.gallery} aria-label="Product images">
              <div className={styles.galleryStage}>
                <div className={styles.galleryLabels}>
                  {brand && <span className={styles.brandBadge}>{brand}</span>}

                  {product.condition && (
                    <span className={styles.conditionBadge}>
                      {product.condition}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  className={styles.mainImageButton}
                  aria-label={`Enlarge image of ${product.title}`}
                  disabled={!currentImage}
                  onClick={() => dialogRef.current?.showModal()}
                >
                  <ProductImage
                    key={currentImage}
                    src={currentImage}
                    alt={product.title}
                    priority
                  />
                </button>

                <div className={styles.galleryBottom}>
                  <span>
                    {images.length
                      ? `${activeImage + 1} / ${images.length}`
                      : "No image"}
                  </span>

                  <button
                    type="button"
                    className={styles.zoomButton}
                    disabled={!currentImage}
                    onClick={() => dialogRef.current?.showModal()}
                  >
                    <Maximize2 size={15} />
                    View larger
                  </button>
                </div>

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      className={`${styles.galleryArrow} ${styles.previous}`}
                      aria-label="Previous product image"
                      onClick={() => changeImage(-1)}
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <button
                      type="button"
                      className={`${styles.galleryArrow} ${styles.next}`}
                      aria-label="Next product image"
                      onClick={() => changeImage(1)}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div className={styles.thumbnails}>
                  {images.map((src, index) => (
                    <button
                      type="button"
                      key={src}
                      className={`${styles.thumbnail} ${
                        index === activeImage ? styles.thumbnailActive : ""
                      }`}
                      aria-label={`Show product image ${index + 1}`}
                      aria-pressed={index === activeImage}
                      onClick={() => setActiveImage(index)}
                    >
                      <ProductImage
                        key={src}
                        src={src}
                        alt={`${product.title}, view ${index + 1}`}
                        sizes="88px"
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className={styles.galleryNote}>
                <Snowflake size={20} />
                <div>
                  <strong>Find the right fit for your business.</strong>
                  <p>
                    Need help with sizing, installation or refrigeration?
                    Our team can help you plan your setup.
                  </p>
                </div>
              </div>

              {specs.length > 0 && (
                <div className={styles.quickSpecs}>
                  {specs.slice(0, 3).map((spec) => (
                    <div key={spec.label}>
                      <span>{spec.label}</span>
                      <strong>{spec.value}</strong>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className={styles.purchaseCard} aria-labelledby="product-title">
              <div className={styles.productMeta}>
                <span>{brand || "Product details"}</span>
                {sku && <span>SKU: {sku}</span>}
              </div>

              <h1 id="product-title">{product.title}</h1>

              <div className={styles.availability}>
                <span
                  className={`${styles.statusDot} ${
                    unavailable ? styles.statusUnavailable : ""
                  }`}
                />

                {unavailable
                  ? "Currently unavailable"
                  : features.available === true
                    ? "Available to order"
                    : "Contact us to confirm availability"}
              </div>

              <div className={styles.priceBlock} aria-live="polite">
                <span className={styles.smallLabel}>YOUR CONFIGURATION</span>

                <div className={styles.priceLine}>
                  <strong>
                    {unitPrice !== null && unitPrice > 0
                      ? money(unitPrice)
                      : "Request pricing"}
                  </strong>

                  {unitPrice !== null && unitPrice > 0 && <span>/ unit</span>}
                </div>

                <p>Shipping and applicable taxes are calculated at checkout.</p>
              </div>

              {isBoxOnly && (
                <div className={styles.boxNotice}>
                  <Package size={19} />
                  <p>
                    <strong>Box-only configuration.</strong> Refrigeration
                    equipment is not included in this product’s listed scope.
                    Contact us if you need a complete system.
                  </p>
                </div>
              )}

              {visibleGroups.length > 0 && (
                <div className={styles.configuration}>
                  <div className={styles.sectionLabel}>
                    <SlidersHorizontal size={17} />
                    Configure your unit
                  </div>

                  <div className={styles.optionGrid}>
                    {visibleGroups.map((group) => (
                      <div className={styles.optionField} key={group.id}>
                        <label htmlFor={`option-${group.id}`}>
                          {group.label}
                        </label>

                        <select
                          id={`option-${group.id}`}
                          value={selected[group.id]}
                          onChange={(event) =>
                            setSelected((current) => ({
                              ...current,
                              [group.id]: event.target.value,
                            }))
                          }
                        >
                          {group.choices.map((choice) => (
                            <option key={choice.label} value={choice.label}>
                              {choice.label}
                              {group.kind === "addon" &&
                              choice.extra !== null &&
                              choice.extra !== 0
                                ? ` (${choice.extra > 0 ? "+" : "−"}${money(
                                    Math.abs(choice.extra),
                                  )})`
                                : ""}
                              {group.kind === "addon" && choice.extra === null
                                ? " — request pricing"
                                : ""}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {missingVariant && (
                <p className={styles.selectionWarning} role="status">
                  This option combination is not listed. Choose another
                  combination or request a quote.
                </p>
              )}

              <div className={styles.orderSummary}>
                <div>
                  <label htmlFor="product-quantity">Quantity</label>

                  <div className={styles.quantityControl}>
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      disabled={quantity <= 1}
                      onClick={() =>
                        setQuantity((current) => Math.max(1, current - 1))
                      }
                    >
                      <Minus size={16} />
                    </button>

                    <input
                      id="product-quantity"
                      type="number"
                      min={1}
                      max={99}
                      step={1}
                      inputMode="numeric"
                      value={quantity}
                      onChange={(event) => {
                        const next = Number(event.target.value);

                        setQuantity(
                          Number.isFinite(next)
                            ? Math.min(99, Math.max(1, Math.trunc(next)))
                            : 1,
                        );
                      }}
                    />

                    <button
                      type="button"
                      aria-label="Increase quantity"
                      disabled={quantity >= 99}
                      onClick={() =>
                        setQuantity((current) => Math.min(99, current + 1))
                      }
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className={styles.subtotal} aria-live="polite">
                  <span>Item subtotal</span>
                  <strong>
                    {unitPrice !== null && unitPrice > 0
                      ? money(unitPrice * quantity)
                      : "Quote required"}
                  </strong>
                </div>
              </div>

              <div className={styles.actions}>
                {canPurchase ? (
                  <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart size={19} />
                    Add to Cart
                    <ArrowRight size={18} />
                  </button>
                ) : (
                  <Link href="/quote" className={styles.primaryButton}>
                    <FileText size={19} />
                    {unavailable ? "Ask About Availability" : "Request a Quote"}
                    <ArrowRight size={18} />
                  </Link>
                )}

                {canPurchase && (
                  <Link href="/quote" className={styles.secondaryButton}>
                    Need a custom size? Request a quote
                  </Link>
                )}
              </div>

              <div className={styles.assistance}>
                <span className={styles.assistanceIcon}>
                  <Headphones size={22} />
                </span>

                <div>
                  <strong>Let’s get your setup right.</strong>
                  <p>
                    Speak with our team: <a href={phoneHref}>{phone}</a>
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div className={styles.serviceStrip}>
            <div>
              <SlidersHorizontal size={22} />
              <span>
                <strong>Configuration guidance</strong>
                <small>Help choosing the right setup</small>
              </span>
            </div>

            <div>
              <Truck size={23} />
              <span>
                <strong>Delivery coordination</strong>
                <small>Discuss access and unloading</small>
              </span>
            </div>

            <div>
              <Headphones size={23} />
              <span>
                <strong>Product support</strong>
                <small>Answers before you order</small>
              </span>
            </div>
          </div>

          <nav className={styles.sectionNav} aria-label="Product information">
            <a href="#product-overview">Overview</a>
            {specs.length > 0 && <a href="#product-specs">Specifications</a>}
            {documents.length > 0 && <a href="#product-documents">Documents</a>}
            {warranty.length > 0 && <a href="#product-warranty">Warranty</a>}
            {faqs.length > 0 && <a href="#product-faqs">FAQs</a>}
          </nav>

          <div className={styles.detailsLayout}>
            <div className={styles.detailSections}>
              <section id="product-overview" className={styles.detailCard}>
                <span className={styles.eyebrow}>PRODUCT OVERVIEW</span>
                <h2>Built around your cold-storage needs.</h2>

                {description ? (
                  <div className={styles.description}>{description}</div>
                ) : (
                  <p className={styles.muted}>
                    Contact our team for the complete product description and
                    configuration details.
                  </p>
                )}

                {highlights.length > 0 && (
                  <>
                    <h3>Product highlights</h3>

                    <ul className={styles.featureList}>
                      {highlights.map((feature, index) => (
                        <li key={`${feature}-${index}`}>
                          <Check size={17} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {featureSections.map((section) => (
                  <div className={styles.featureSection} key={section.key}>
                    <h3>{section.label}</h3>

                    <ul className={styles.featureList}>
                      {section.items.map((feature, index) => (
                        <li key={`${section.key}-${index}`}>
                          <Check size={17} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>

              {specs.length > 0 && (
                <section id="product-specs" className={styles.detailCard}>
                  <span className={styles.eyebrow}>THE DETAILS</span>
                  <h2>Technical specifications</h2>

                  <div className={styles.specTableWrap}>
                    <table className={styles.specTable}>
                      <tbody>
                        {specs.map((row) => (
                          <tr key={row.label}>
                            <th scope="row">{row.label}</th>
                            <td>{row.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {documents.length > 0 && (
                <section id="product-documents" className={styles.detailCard}>
                  <span className={styles.eyebrow}>PRODUCT RESOURCES</span>
                  <h2>Documents & downloads</h2>

                  <div className={styles.documentGrid}>
                    {documents.map((document, index) => (
                      <a
                        key={`${document.url}-${index}`}
                        href={document.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.document}
                      >
                        <span className={styles.documentIcon}>
                          <FileText size={22} />
                        </span>

                        <span>
                          <strong>{document.name}</strong>
                          <small>Open document</small>
                        </span>

                        <ArrowRight size={18} />
                      </a>
                    ))}
                  </div>
                </section>
              )}

              {warranty.length > 0 && (
                <section id="product-warranty" className={styles.detailCard}>
                  <span className={styles.eyebrow}>PRODUCT COVERAGE</span>
                  <h2>Warranty information</h2>

                  <ul className={styles.featureList}>
                    {warranty.map((item, index) => (
                      <li key={index}>
                        <Check size={17} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {faqs.length > 0 && (
                <section id="product-faqs" className={styles.detailCard}>
                  <span className={styles.eyebrow}>YOUR QUESTIONS</span>
                  <h2>Frequently asked questions</h2>

                  <div className={styles.faqList}>
                    {faqs.map((faq, index) => (
                      <details className={styles.faq} key={index}>
                        <summary>
                          {faq.question}
                          <Plus size={18} />
                        </summary>
                        <p>{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <aside className={styles.planningCard}>
              <span className={styles.planningIcon}>
                <Snowflake size={29} />
              </span>

              <span className={styles.eyebrow}>PLAN WITH ICEMANZ</span>
              <h2>A better fit starts with a conversation.</h2>

              <p>
                Share your room dimensions, installation location and storage
                requirements. We’ll help you review the next steps.
              </p>

              <ul>
                <li>
                  <Check size={16} />
                  Size and configuration questions
                </li>
                <li>
                  <Check size={16} />
                  Refrigeration requirements
                </li>
                <li>
                  <Check size={16} />
                  Delivery and installation planning
                </li>
              </ul>

              <Link href="/quote" className={styles.primaryButton}>
                Discuss Your Project
                <ArrowRight size={17} />
              </Link>

              <a href={phoneHref} className={styles.planningContact}>
                <Phone size={16} />
                {phone}
              </a>

              <a
                href={`mailto:${siteConfig.company.email}`}
                className={styles.planningContact}
              >
                <Mail size={16} />
                {siteConfig.company.email}
              </a>
            </aside>
          </div>

          {related.length > 0 && (
            <section className={styles.relatedSection}>
              <div className={styles.relatedHeading}>
                <div>
                  <span className={styles.eyebrow}>EXPLORE THE COLLECTION</span>
                  <h2>More options for your space</h2>
                </div>

                <Link href="/walk-in-cooler-freezer">
                  View all products
                  <ArrowRight size={17} />
                </Link>
              </div>

              <div className={styles.relatedGrid}>
                {related.map((item) => {
                  const src = imageUrls(item.images)[0] || "";
                  const price = amount(item.price);

                  return (
                    <Link
                      key={item.id}
                      href={`/walk-in-cooler-freezer/${encodeURIComponent(
                        item.slug || "product",
                      )}/${encodeURIComponent(item.id)}`}
                      className={styles.relatedCard}
                    >
                      <div className={styles.relatedImage}>
                        <ProductImage
                          key={src}
                          src={src}
                          alt={item.title}
                          sizes="(max-width: 600px) 50vw, 25vw"
                        />
                      </div>

                      <div className={styles.relatedBody}>
                        {item.brand && <span>{item.brand}</span>}
                        <h3>{item.title}</h3>

                        <div className={styles.relatedPrice}>
                          <strong>
                            {price !== null && price > 0
                              ? money(price)
                              : "Request pricing"}
                          </strong>

                          <span aria-hidden="true">
                            <ArrowRight size={18} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        <dialog
          ref={dialogRef}
          className={styles.imageDialog}
          aria-label={`Images of ${product.title}`}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              dialogRef.current?.close();
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              changeImage(-1);
            }

            if (event.key === "ArrowRight") {
              event.preventDefault();
              changeImage(1);
            }
          }}
        >
          <div className={styles.dialogContent}>
            <div className={styles.dialogHeader}>
              <span>{brand || "Product gallery"}</span>

              <button
                type="button"
                autoFocus
                aria-label="Close product gallery"
                onClick={() => dialogRef.current?.close()}
              >
                <X size={22} />
              </button>
            </div>

            <div className={styles.dialogImage}>
              <ProductImage
                key={currentImage}
                src={currentImage}
                alt={product.title}
                sizes="90vw"
              />
            </div>

            <div className={styles.dialogFooter}>
              <button
                type="button"
                aria-label="Previous image"
                disabled={images.length < 2}
                onClick={() => changeImage(-1)}
              >
                <ChevronLeft size={21} />
              </button>

              <span>
                {images.length ? activeImage + 1 : 0} / {images.length}
              </span>

              <button
                type="button"
                aria-label="Next image"
                disabled={images.length < 2}
                onClick={() => changeImage(1)}
              >
                <ChevronRight size={21} />
              </button>
            </div>
          </div>
        </dialog>
      </main>
    </>
  );
}