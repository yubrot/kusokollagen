import Icon24 from './common/Icon24';

export interface Props {}

export default function ApplicationCover(_: Props): React.ReactElement {
  const title = 'Kusokollagen';
  const subtitle = 'A fast enough "Kusokora" generator';
  const subtitleRuby = '十分に高速な"クソコラ"ジェネレータ';
  const topRightText = 'Sign-in to create & manage "Kusokora" templates';
  const bottomLeftText = 'Try with public "Kusokora" templates';
  return (
    <div
      className="shadow-md text-white"
      style={{ background: 'linear-gradient(to bottom right, #3182ce, #bee3f8)' }}
    >
      <div className="container-lg relative p-16 flex flex-col justify-center items-center">
        <div className="font-mono text-6xl font-bold border-b-2 border-white py-6 px-12">
          {title}
        </div>
        <ruby className="font-mono text-xl py-4">
          {subtitle}
          <rt className="text-sm text-bluegray-200">{subtitleRuby}</rt>
        </ruby>
        <div className="absolute top-0 right-0 py-2 px-6 flex items-center space-x-2">
          <div>{topRightText}</div>
          <Icon24 name="arrow-up" className="w-6 h-6" />
        </div>
        <div className="absolute left-0 bottom-0 py-2 px-6 flex items-center space-x-2">
          <Icon24 name="arrow-down" className="w-6 h-6" />
          <div>{bottomLeftText}</div>
        </div>
      </div>
    </div>
  );
}
