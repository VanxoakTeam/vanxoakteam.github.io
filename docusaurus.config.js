// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';
/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '万象奥科',
  tagline: 'HD-RK3506-EVB 产品文档',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  // future: {
  //   v4: true, // Improve compatibility with the upcoming Docusaurus v4
  // },

  url: 'https://doc.vanxoak.com',
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'VanxoakTeam', // Usually your GitHub org/user name.
  projectName: 'vanxoakteam.github.io', // Root GitHub Pages repository.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
    localeConfigs: {
      'zh-Hans': {
        label: '中文',
        direction: 'ltr',
        htmlLang: 'zh-CN',
      },
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // 根据 Git 历史在所有文档页底部显示最后更新时间和更新者。
          // CI 构建必须检出完整 Git 历史（deploy.yml 已设置 fetch-depth: 0）。
          showLastUpdateTime: true,
          showLastUpdateAuthor: false,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/VanxoakTeam/vanxoakteam.github.io/tree/main/',
        },
        blog: false,
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      docs: {
        sidebar: {
          autoCollapseCategories: true,
          hideable: true,
        },
      },
      navbar: {
        title: 'HD-RK3506-EVB文档中心',
        logo: {
          alt: 'HD-RK3506-EVB',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'dropdown',
            label: 'RK3506系列',
            position: 'left',
            items: [
              {
                type: 'docSidebar',
                sidebarId: 'rk3506Sidebar',
                label: 'HD-RK3506-EVB',
              },
            ],
          },
          {
            href: 'https://github.com/VanxoakTeam/vanxoakteam.github.io',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub Repository',
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `Copyright © ${new Date().getFullYear()} VanxoakTeam, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
  // Add the Mermaid plugin and enable it in markdown
  markdown: {
    mermaid: true,
  },
  themes: [
    '@docusaurus/theme-mermaid',
    ['@easyops-cn/docusaurus-search-local', {
      hashed: true,
      language: ['en', 'zh'],
      highlightSearchTermsOnTargetPage: true,
      explicitSearchResultPath: true,
    }],
  ],
};


export default config;
