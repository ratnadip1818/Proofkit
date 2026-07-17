export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  content: string; // HTML format string for rendering
}

export const posts: BlogPost[] = [];
