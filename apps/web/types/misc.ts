export type MenuItem = {
  title: string;
  href: string;
  allowedFor: "all" | "loggedInUsers" | "loggedOutUsers";
};
