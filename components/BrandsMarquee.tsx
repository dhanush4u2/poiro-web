'use client';

import styles from './BrandsMarquee.module.css';

const brands = ['Chumbak', 'EFPY', 'Foramour', 'Godrej', 'Stella', 'Greenfields', 'Imara'];

export default function BrandsMarquee() {
  /* Duplicate list for seamless infinite scroll */
  const renderBrands = () =>
    brands.map((brand, i) => (
      <span key={i} className={styles.brand}>
        {brand}
      </span>
    ));

  return (
    <section className={styles.section} id="brands">
      <p className={styles.heading}>Brands we&apos;ve worked with</p>
      <div className={styles.marqueeWrap}>
        <div className={styles.marqueeTrack} aria-hidden="true">
          {renderBrands()}
          {renderBrands()}
          {renderBrands()}
          {renderBrands()}
        </div>
      </div>
      <div className={styles.marqueeWrap}>
        <div className={`${styles.marqueeTrack} ${styles.reverse}`} aria-hidden="true">
          {renderBrands()}
          {renderBrands()}
          {renderBrands()}
          {renderBrands()}
        </div>
      </div>
    </section>
  );
}
