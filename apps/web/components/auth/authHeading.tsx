type AuthHeadingProps = {
  readonly title: string;
  readonly description?: string;
};

export function AuthHeading({ title, description }: AuthHeadingProps) {
  return (
    <div className="flex flex-col gap-xs">
      <h1 className="font-display text-4xl">{title}</h1>
      {description ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
