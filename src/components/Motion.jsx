import { isValidElement } from 'react';

function getTextContent(node) {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(getTextContent).join('');
  }

  if (isValidElement(node)) {
    return getTextContent(node.props.children);
  }

  return '';
}

export function MaskedHeading({
  as: Component = 'h2',
  children,
  className = '',
  delay = 0,
  style,
  ...restProps
}) {
  const text = getTextContent(children);
  const tokens = text.match(/\s+|[^\s]+/g) || [];
  const safeDelay = Number.isFinite(delay) ? Math.max(0, delay) : 0;
  const accessibleLabel = restProps['aria-label'] || text;
  let wordIndex = 0;

  return (
    <Component
      {...restProps}
      className={`masked-heading ${className}`.trim()}
      style={{ '--reveal-delay': `${safeDelay}ms`, ...style }}
      aria-label={accessibleLabel}
      data-reveal="masked-heading"
    >
      <span className="masked-heading-visual" aria-hidden="true">
        {tokens.map((token, tokenIndex) => {
          if (/^\s+$/.test(token)) {
            return token;
          }

          const currentWordIndex = wordIndex;
          wordIndex += 1;

          return (
            <span className="masked-heading-mask" key={`${token}-${tokenIndex}`}>
              <span
                className="masked-heading-word"
                style={{ '--word-delay': `${currentWordIndex * 70}ms` }}
              >
                {token}
              </span>
            </span>
          );
        })}
      </span>
    </Component>
  );
}
