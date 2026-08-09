import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <SignUp 
      path="/sign-up" 
      routing="path" 
      signInUrl="/sign-in"
      appearance={{
        elements: {
          rootBox: "mx-auto w-full",
          card: "shadow-none w-full bg-transparent mx-auto",
          headerTitle: "text-2xl font-bold tracking-tight text-foreground",
          headerSubtitle: "text-sm font-medium text-muted-foreground",
          formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm",
          socialButtonsBlockButton: "border-border hover:bg-secondary/50 text-foreground",
          formFieldLabel: "text-foreground",
          formFieldInput: "bg-background border-border text-foreground focus:ring-primary focus:border-primary",
          dividerLine: "bg-border",
          dividerText: "text-muted-foreground",
          footerActionText: "text-muted-foreground",
          footerActionLink: "text-primary hover:text-primary/80 font-medium",
        }
      }}
    />
  );
}
