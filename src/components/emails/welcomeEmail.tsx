type EmailTemplateProps = {
  firstName: string;
};

export function WelcomeEmail({ firstName }: EmailTemplateProps) {
  return (
    <div>
      <h1>Welcome, {firstName}!</h1>
    </div>
  );
}
