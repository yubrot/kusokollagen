import Icon20 from './basics/Icon20';

export default function ApplicationFooter(): React.ReactElement {
  return (
    <div className="bg-slate-200 shadow-inner">
      <footer className="cc flex justify-center pt-4 px-8 pb-16">
        <a
          href="https://github.com/yubrot/kusokollagen"
          className="block text-sm text-slate-400 hover:text-blue-400 transition"
        >
          <Icon20 name="github" className="w-8 h-8" />
        </a>
      </footer>
    </div>
  );
}
