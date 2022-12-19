// @ts-check

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-var-requires
const { resolve } = require('path');
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-var-requires
const { transpileCodeblocks } = require('remark-typescript-tools');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const lightCodeTheme = require('prism-react-renderer/themes/github');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'React Query Builder',
  tagline: 'The Query Builder Component for React',
  url: 'https://react-querybuilder.js.org',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/react-querybuilder.png',
  organizationName: 'react-querybuilder',
  projectName: 'react-querybuilder.github.io',
  trailingSlash: false,
  deploymentBranch: 'gh-pages',

  plugins: [
    'docusaurus-plugin-sass',
    [
      '@docusaurus/plugin-client-redirects',
      {
        fromExtensions: ['html', 'htm'], // /myPage.html -> /myPage
        toExtensions: ['exe', 'zip'], // /myAsset -> /myAsset.zip (if latter exists)
        redirects: [
          {
            from: '/react-querybuilder',
            to: '/demo',
          },
        ],
      },
    ],
    () => ({
      // This is not actually used, only here just in case
      name: 'rqb-wp5-raw-loader',
      configureWebpack: () => ({
        module: { rules: [{ resourceQuery: /raw/, type: 'asset/source' }] },
      }),
    }),
  ],
  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/react-querybuilder/react-querybuilder/edit/main/website/',
          versions: {
            3: {
              label: 'v3.x',
            },
            4: {
              label: 'v4.x',
            },
            5: {
              label: 'v5.x',
            },
            current: {
              label: 'Next',
            },
          },
          // Re-enable this when we get it working properly
          // remarkPlugins: [
          //   [
          //     transpileCodeblocks,
          //     {
          //       compilerSettings: {
          //         tsconfig: resolve(__dirname, '../docs/tsconfig.json'),
          //         externalResolutions: {},
          //       },
          //     },
          //   ],
          // ],
        },
        // blog: {
        //   showReadingTime: true,
        //   editUrl:
        //     'https://github.com/react-querybuilder/react-querybuilder/edit/main/website/',
        // },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.scss'),
        },
        gtag: {
          trackingID: 'G-7VHBQ0YBTJ',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      algolia: {
        appId: '1ECMJ15RQA',
        apiKey: '359cf32327b9778459b13f4631f71027',
        indexName: 'react-querybuilder',
        // contextualSearch: true,
        // searchParameters: {},
      },
      navbar: {
        title: 'React Query Builder',
        logo: {
          alt: 'React Query Builder Logo',
          src: 'img/react-querybuilder.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'api/querybuilder',
            position: 'right',
            label: 'Docs',
          },
          {
            to: '/demo',
            label: 'Demo',
            position: 'right',
          },
          // {to: '/blog', label: 'Blog', position: 'right'},
          {
            type: 'docsVersionDropdown',
            position: 'right',
          },
          {
            href: 'https://github.com/react-querybuilder/react-querybuilder',
            'aria-label': 'GitHub repository',
            position: 'right',
            className: 'header-github-link',
          },
          {
            to: '/discord',
            'aria-label': 'Discord server',
            position: 'right',
            className: 'header-discord-link',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Getting started',
                to: '/docs/intro',
              },
              {
                label: 'Component API',
                to: '/docs/api/querybuilder',
              },
              {
                label: 'Tips & Tricks',
                to: '/docs/category/tips--tricks',
              },
              {
                label: 'Showcase',
                to: '/demo',
              },
            ],
          },
          {
            title: 'External',
            items: [
              // {
              //   label: 'Blog',
              //   to: '/blog',
              // },
              {
                label: 'GitHub',
                href: 'https://github.com/react-querybuilder/react-querybuilder',
              },
              {
                label: 'Discord',
                to: '/discord',
              },
              {
                label: 'npm',
                href: 'https://www.npmjs.com/package/react-querybuilder',
              },
              {
                label: 'npm org',
                href: 'https://www.npmjs.com/org/react-querybuilder',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} React Query Builder authors. Built with Docusaurus.<br><br><a href="https://www.netlify.com"><img src="https://www.netlify.com/v3/img/components/netlify-color-accent.svg" alt="Deploys by Netlify" /></a>`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
