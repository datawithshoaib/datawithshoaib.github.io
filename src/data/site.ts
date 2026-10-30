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
  tagline: 'Learning AI Engineering in public',
  description: "Shoaib Akthar's public learning log: LeetCode problems solved, courses in progress with notes, and a journal of learning AI engineering.",
  // Main website with the blog, projects and portfolio. Leave empty to hide the links.
  mainSiteUrl: '',
  // Public LeetCode profile shown as a live stats card. Leave empty to hide it.
  leetcodeUsername: 'datawithshoaib',
  url: 'https://datawithshoaib.github.io',
  avatar: 'https://avatars.githubusercontent.com/u/84625981?v=4',
  author: 'Shoaib Akthar',
  email: 'shoaibakthar.work@gmail.com',
  github: 'https://github.com/datawithshoaib',
  twitter: 'https://twitter.com/datawithshoaib',
  linkedin: 'https://linkedin.com/in/datawithshoaib',
  
  navItems: [
    { title: 'DASHBOARD', url: '/', icon: 'fas fa-chart-simple' },
    { title: 'LEETCODE', url: '/leetcode/', icon: 'fas fa-code' },
    { title: 'COURSES', url: '/courses/', icon: 'fas fa-graduation-cap' },
    { title: 'JOURNAL', url: '/journal/', icon: 'fas fa-book-open' },
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
  ] as SocialLink[],
};
