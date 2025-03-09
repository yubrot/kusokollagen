import clsx from 'clsx';
import type { Label } from '../../models/label';
import * as l from '../../models/label';

export interface Props {
  label: Label;
  showBorder?: boolean;
  isSelected?: boolean;
  invScale?: number;
}

export default function LabelPreview({
  label,
  showBorder,
  isSelected,
  invScale,
}: Props): React.ReactElement {
  const [border, borderOffset] = showBorder
    ? [`${invScale ?? 1}px solid ${isSelected ? '#8bf' : '#777'}`, '0']
    : [undefined, `${invScale ?? 1}px`];

  return (
    <div style={{ position: 'absolute', width: 0, top: `${label.y}px`, left: `${label.x}px` }}>
      <div
        style={{
          position: 'absolute',
          top: borderOffset,
          left: label.vertical ? undefined : borderOffset,
          right: label.vertical ? borderOffset : undefined,
          border,
          display: 'flex',
          flexDirection: label.vertical ? 'row-reverse' : 'column',
          minWidth: '10px',
          minHeight: '10px',
          whiteSpace: 'pre',
          letterSpacing: '0',
          lineHeight: '1',
          color: label.color,
          fontSize: `${label.size}px`,
          fontFamily: l.font,
          fontWeight: label.bold ? 'bold' : 'normal',
        }}
      >
        {l.linesAndCharacters(label.text).map((line, i) => (
          <div key={i} className={clsx('flex items-center', label.vertical ? 'flex-col' : '')}>
            {line.map((c, j) => (
              <div key={j} style={label.vertical ? l.verticalCharacterStyle(c).style : {}}>
                {c}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
