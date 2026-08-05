import { StarSvg } from './Svg';

export default function DesignBlueprintBackground({ className = '' }) {
  return (
    <div
      className={`design-blueprint-background ${className}`.trim()}
      aria-hidden="true"
    >
      <div className="design-blueprint-linework">
        <span className="design-blueprint-measurement-line is-horizontal" />
        <span className="design-blueprint-measurement-line is-vertical" />
        <span className="design-blueprint-measurement-line is-diagonal" />
        <span className="design-blueprint-node is-first" />
        <span className="design-blueprint-node is-second" />
        <span className="design-blueprint-panel is-large" />
        <span className="design-blueprint-panel is-small" />
      </div>
      <span className="design-blueprint-star design-blueprint-compass-mark is-primary">
        <span className="design-blueprint-star-layer is-base">
          <StarSvg />
        </span>
        <span className="design-blueprint-star-layer is-rotated">
          <StarSvg />
        </span>
      </span>
      <span className="design-blueprint-star design-blueprint-compass-mark is-secondary">
        <span className="design-blueprint-star-layer is-base">
          <StarSvg />
        </span>
      </span>
    </div>
  );
}
