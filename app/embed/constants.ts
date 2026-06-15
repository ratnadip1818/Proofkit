export interface Testimonial {
  id: string;
  author_name: string;
  author_role: string | null;
  body_original: string;
  display_body: string | null;
  rating: number | null;
  created_at: string;
  avatar_url?: string | null;
  tags?: string[] | null;
  source?: string | null;
}

export const SAMPLE_TESTIMONIALS: Testimonial[] = [
  {
    id: "sample-1",
    author_name: "Maria K.",
    author_role: "Founder, Lume",
    body_original: "I love this app — it saved me so much time. Highly recommend!",
    display_body: "I love this app — it saved me so much time. Highly recommend!",
    rating: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-2",
    author_name: "Tom W.",
    author_role: "Indie hacker",
    body_original: "Honestly, I didn't expect to use it this much — it's that good.",
    display_body: "Honestly, I didn't expect to use it this much — it's that good.",
    rating: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-3",
    author_name: "Devon R.",
    author_role: "Freelance designer",
    body_original: "Setup was super quick, and the wall looks amazing on my site.",
    display_body: "Setup was super quick, and the wall looks amazing on my site.",
    rating: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-4",
    author_name: "Priya S.",
    author_role: "Agency owner",
    body_original: "Finally a tool I don't pay monthly for.",
    display_body: "Finally a tool I don't pay monthly for.",
    rating: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-5",
    author_name: "Ana L.",
    author_role: "Course creator",
    body_original: "Exactly what my course site needed — looks so clean.",
    display_body: "Exactly what my course site needed — looks so clean.",
    rating: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-6",
    author_name: "Jordan B.",
    author_role: "Marketing lead",
    body_original: "Our conversion rate went up after adding this wall to the homepage.",
    display_body: "Our conversion rate went up after adding this wall to the homepage.",
    rating: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-7",
    author_name: "Sofia M.",
    author_role: "Shop owner",
    body_original: "Customers trust us more now that they can see real reviews.",
    display_body: "Customers trust us more now that they can see real reviews.",
    rating: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-8",
    author_name: "Liam P.",
    author_role: "SaaS founder",
    body_original: "The AI polish feature turns messy feedback into great copy instantly.",
    display_body: "The AI polish feature turns messy feedback into great copy instantly.",
    rating: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-9",
    author_name: "Hana T.",
    author_role: "Consultant",
    body_original: "Took five minutes to set up and it just works.",
    display_body: "Took five minutes to set up and it just works.",
    rating: 5,
    created_at: new Date().toISOString(),
  },
];
