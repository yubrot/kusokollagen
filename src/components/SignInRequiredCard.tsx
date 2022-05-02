export interface Props {
  className?: string;
}

export default function SignInRequiredCard({ className }: Props): React.ReactElement {
  return (
    <div className={`max-w-2xl mx-auto my-12 card ${className ?? ''}`}>
      To create and manage templates, please sign-in.
    </div>
  );
}
