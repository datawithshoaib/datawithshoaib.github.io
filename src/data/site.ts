export interface NavItem {
  title: string;
  url: string;
  icon: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  ariaLabel: string;
}

export const siteConfig = {
  title: 'Shoaib Akthar',
  tagline: 'AI Engineer',
  description: "Shoaib's learning blog, notes, experiments and projects on Data Science, Machine Learning, Deep Learning, and Artificial Intelligence.",
  url: 'https://datawithshoaib.github.io',
  avatar: '/assets/img/profile.png',
  avatarFallback: 'https://avatars.githubusercontent.com/u/84625981?v=4',
  author: 'Shoaib Akthar',
  email: 'shoaibakthar.work@gmail.com',
  github: 'https://github.com/datawithshoaib',
  twitter: 'https://twitter.com/datawithshoaib',
  linkedin: 'https://linkedin.com/in/datawithshoaib',
  
  navItems: [
    { title: 'HOME', url: '/', icon: 'fas fa-home' },
    { title: 'PROJECTS', url: '/projects/', icon: 'fas fa-laptop-code' },
    { title: 'EXPERIMENTS', url: '/experiments/', icon: 'fas fa-flask' },
    { title: 'CERTIFICATES', url: '/certificates/', icon: 'fas fa-award' },
    { title: 'CV', url: '/cv/', icon: 'fas fa-file-alt' },
    { title: 'RESOURCES', url: '/resources/', icon: 'fas fa-layer-group' },
    { title: 'CATEGORIES', url: '/categories/', icon: 'fas fa-folder-open' },
    { title: 'TAGS', url: '/tags/', icon: 'fas fa-tags' },
    { title: 'ARCHIVES', url: '/archives/', icon: 'fas fa-archive' },
    { title: 'ABOUT', url: '/about/', icon: 'fas fa-info-circle' },
  ] as NavItem[],

  socialLinks: [
    {
      name: 'GitHub',
      url: 'https://github.com/datawithshoaib',
      icon: 'fab fa-github',
      ariaLabel: 'github',
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/datawithshoaib',
      icon: 'fab fa-x-twitter',
      ariaLabel: 'twitter',
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/datawithshoaib',
      icon: 'fab fa-linkedin',
      ariaLabel: 'linkedin',
    },
    {
      name: 'Email',
      url: 'mailto:shoaibakthar.work@gmail.com',
      icon: 'fas fa-envelope',
      ariaLabel: 'email',
    },
    {
      name: 'RSS',
      url: '/feed.xml',
      icon: 'fas fa-rss',
      ariaLabel: 'rss',
    },
  ] as SocialLink[],
};
