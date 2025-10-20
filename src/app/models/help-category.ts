interface HelpCategory {
    id: number;
    name: string;
    icon: string;
    description: string;
    articles: HelpArticle[];
}

interface HelpArticle {
    id: number;
    title: string;
    content: string;
    popular: boolean;
    lastUpdated: string;
    relatedArticles?: number[];
}