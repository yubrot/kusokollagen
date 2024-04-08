import ApplicationFooter from '../components/ApplicationFooter';

export default function Application(): React.ReactElement {
  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex-grow">Hello</div>
      <ApplicationFooter />
    </div>
  );
}
