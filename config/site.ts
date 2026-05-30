export const siteConfig = {
    name: "Writely.",
    shortName: "W_",
    description: "A quiet place for your loudest thoughts.",
    
    // Links for the footer
    links: {
        terms: "/terms",
        privacy: "/privacy",
    },

    // Specific page content
    auth: {
        quote: `"The scariest moment is always just before you start."`,
        author: "— Stephen King",
        welcomeTitle: "Welcome to Writely",
        welcomeSubtitle: "Log in or sign up to continue your story.",
    }
};

export type SiteConfig = typeof siteConfig;