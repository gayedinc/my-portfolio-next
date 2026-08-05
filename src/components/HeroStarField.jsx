import { StarSvg } from './Svg';
import styles from './HeroStarField.module.css';

function CompassStar({ className, accent = true }) {
  return (
    <span className={`${styles.star} ${className}`}>
      <span className={styles.motion}>
        <StarSvg className={`${styles.glyph} ${styles.glyphBase}`} />
        {accent ? (
          <StarSvg className={`${styles.glyph} ${styles.glyphAccent}`} />
        ) : null}
      </span>
    </span>
  );
}

export default function HeroStarField() {
  return (
    <div className={styles.field} aria-hidden="true">
      <CompassStar className={styles.starPrimary} />
      <CompassStar className={styles.starSecondary} />
      <CompassStar className={styles.starTertiary} />
      <CompassStar className={styles.starSmallLeft} accent={false} />
      <CompassStar className={styles.starSmallCenter} accent={false} />
      <CompassStar className={styles.starSmallRight} accent={false} />
    </div>
  );
}
