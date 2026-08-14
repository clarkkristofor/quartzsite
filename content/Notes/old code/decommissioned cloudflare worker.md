   /* CONFIGURATION STARTS HERE */

  /* Step 1: enter your domain name like fruitionsite.com */

  const MY_DOMAIN = 'krypton.superclark.net';

  /*

   * Step 2: enter your URL slug to page ID mapping

   * The key on the left is the slug (without the slash)

   * The value on the right is the Notion page ID

   */

  const SLUG_TO_PAGE = {

    '': '113015ce4815434ba7c0fcd1db149ea7',

    'handout': '461cc1dc80b54b3585777ac0d93093ad',

    'smugglers': '9cf8fa72048c4a7fa490b94de2bd7d2c',

    'ravd': 'f891c25ba9ec4634a8cfbe2cb34927dd',

    'npcs': 'bfba677ec2ef40e697e0a9c277b4c546',

    'amara': 'e8ae9b78286e494bbfd0717d6bc7ac79',

    'sek': '9b30528320a845c1a38b634e3ae4d779',

    'murk': 'e00279f281424ce9abf859d2a482304b',

    'backgrounds': 'f3625a0560324b08acda17095438383d',

    'templates': 'c1a431d8529f41daab89e4006cb8a0f3',

    'sessionplanner2': 'bbb8d28b40ab40069a290a2f13f5ddd5',

    'advent': 'a47b96bc92aa4649bd1dcb5a1048377d',

    'emperor': 'dee99fca37cc4c7aa284c89399af68e5',

    'wreck': '095a0e14c01e4e1492b13d2aadfe62af',

    'wyrmskald': 'aed738ebdd5944ca8c018ea348f4b549',

    'ardent': '95513b6fe1b449379b2d1180af30384b'

  };

  /* Step 3: enter your page title and description for SEO purposes */

  const PAGE_TITLE = 'super clark | krypton';

  const PAGE_DESCRIPTION = '';

  /* Step 4: enter a Google Font name, you can choose from https://fonts.google.com */

  const GOOGLE_FONT = '';

  /* Step 5: enter any custom scripts you'd like */

  const CUSTOM_SCRIPT = ``;

  /* CONFIGURATION ENDS HERE */

  const PAGE_TO_SLUG = {};

  const slugs = [];

  const pages = [];

  Object.keys(SLUG_TO_PAGE).forEach(slug => {

    const page = SLUG_TO_PAGE[slug];

    slugs.push(slug);

    pages.push(page);

    PAGE_TO_SLUG[page] = slug;

  });

  addEventListener('fetch', event => {

    event.respondWith(fetchAndApply(event.request));

  });

  

  function generateSitemap() {

    let sitemap = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    slugs.forEach(

      (slug) =>

        (sitemap +=

          '<url><loc>https://' + MY_DOMAIN + '/' + slug + '</loc></url>')

    );

    sitemap += '</urlset>';

    return sitemap;

  }

  const corsHeaders = {

    'Access-Control-Allow-Origin': '*',

    'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, OPTIONS',

    'Access-Control-Allow-Headers': 'Content-Type',

  };

  function handleOptions(request) {

    if (request.headers.get('Origin') !== null &&

      request.headers.get('Access-Control-Request-Method') !== null &&

      request.headers.get('Access-Control-Request-Headers') !== null) {

      // Handle CORS pre-flight request.

      return new Response(null, {

        headers: corsHeaders

      });

    } else {

      // Handle standard OPTIONS request.

      return new Response(null, {

        headers: {

          'Allow': 'GET, HEAD, POST, PUT, OPTIONS',

        }

      });

    }

  }

  async function fetchAndApply(request) {

    if (request.method === 'OPTIONS') {

      return handleOptions(request);

    }

    let url = new URL(request.url);

    url.hostname = 'www.notion.so';

    if (url.pathname === '/robots.txt') {

      return new Response('Sitemap: https://' + MY_DOMAIN + '/sitemap.xml');

    }

    if (url.pathname === '/sitemap.xml') {

      let response = new Response(generateSitemap());

      response.headers.set('content-type', 'application/xml');

      return response;

    }

    let response;

    if (url.pathname.startsWith('/app') && url.pathname.endsWith('js')) {

      response = await fetch(url.toString());

      let body = await response.text();

      response = new Response(body.replace(/www.notion.so/g, MY_DOMAIN).replace(/notion.so/g, MY_DOMAIN), response);

      response.headers.set('Content-Type', 'application/x-javascript');

      return response;

    } else if ((url.pathname.startsWith('/api'))) {

      // Forward API

      response = await fetch(url.toString(), {

        body: url.pathname.startsWith('/api/v3/getPublicPageData') ? null : request.body,

        headers: {

          'content-type': 'application/json;charset=UTF-8',

          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36'

        },

        method: 'POST',

      });

      response = new Response(response.body, response);

      response.headers.set('Access-Control-Allow-Origin', '*');

      return response;

    } else if (slugs.indexOf(url.pathname.slice(1)) > -1) {

      const pageId = SLUG_TO_PAGE[url.pathname.slice(1)];

      return Response.redirect('https://' + MY_DOMAIN + '/' + pageId, 301);

    } else {

      response = await fetch(url.toString(), {

        body: request.body,

        headers: request.headers,

        method: request.method,

      });

      response = new Response(response.body, response);

      response.headers.delete('Content-Security-Policy');

      response.headers.delete('X-Content-Security-Policy');

    }

    return appendJavascript(response, SLUG_TO_PAGE);

  }

  class MetaRewriter {

    element(element) {

      if (PAGE_TITLE !== '') {

        if (element.getAttribute('property') === 'og:title'

          || element.getAttribute('name') === 'twitter:title') {

          element.setAttribute('content', PAGE_TITLE);

        }

        if (element.tagName === 'title') {

          element.setInnerContent(PAGE_TITLE);

        }

      }

      if (PAGE_DESCRIPTION !== '') {

        if (element.getAttribute('name') === 'description'

          || element.getAttribute('property') === 'og:description'

          || element.getAttribute('name') === 'twitter:description') {

          element.setAttribute('content', PAGE_DESCRIPTION);

        }

      }

      if (element.getAttribute('property') === 'og:url'

        || element.getAttribute('name') === 'twitter:url') {

        element.setAttribute('content', MY_DOMAIN);

      }

      if (element.getAttribute('name') === 'apple-itunes-app') {

        element.remove();

      }

    }

  }

  class HeadRewriter {

    element(element) {

      if (GOOGLE_FONT !== '') {

        element.append(`<link href="https://fonts.googleapis.com/css?family=${GOOGLE_FONT.replace(' ', '+')}:Regular,Bold,Italic&display=swap" rel="stylesheet">

        <style>* { font-family: "${GOOGLE_FONT}" !important; }</style>`, {

          html: true

        });

      }

      element.append(`<style>

      div.notion-topbar > div > div:nth-child(3) { display: none !important; }

      div.notion-topbar > div > div:nth-child(4) { display: none !important; }

      div.notion-topbar > div > div:nth-child(5) { display: none !important; }

      div.notion-topbar > div > div:nth-child(6) { display: none !important; }

      div.notion-topbar-mobile > div:nth-child(3) { display: none !important; }

      div.notion-topbar-mobile > div:nth-child(4) { display: none !important; }

      div.notion-topbar > div > div:nth-child(1n).toggle-mode { display: block !important; }

      div.notion-topbar-mobile > div:nth-child(1n).toggle-mode { display: block !important; }

      </style>`, {

        html: true

      })

    }

  }

  class BodyRewriter {

    constructor(SLUG_TO_PAGE) {

      this.SLUG_TO_PAGE = SLUG_TO_PAGE;

    }

    element(element) {

      element.append(`<div style="display:none">Powered by <a href="http://fruitionsite.com">Fruition</a></div>

      <script>

      window.CONFIG.domainBaseUrl = 'https://${MY_DOMAIN}';

      const SLUG_TO_PAGE = ${JSON.stringify(this.SLUG_TO_PAGE)};

      const PAGE_TO_SLUG = {};

      const slugs = [];

      const pages = [];

      const el = document.createElement('div');

      let redirected = false;

      Object.keys(SLUG_TO_PAGE).forEach(slug => {

        const page = SLUG_TO_PAGE[slug];

        slugs.push(slug);

        pages.push(page);

        PAGE_TO_SLUG[page] = slug;

      });

      function getPage() {

        return location.pathname.slice(-32);

      }

      function getSlug() {

        return location.pathname.slice(1);

      }

      function updateSlug() {

        const slug = PAGE_TO_SLUG[getPage()];

        if (slug != null) {

          history.replaceState(history.state, '', '/' + slug);

        }

      }

      function onDark() {

        el.innerHTML = '<div title="Change to Light Mode" style="margin-left: auto; margin-right: 14px; min-width: 0px;"><div role="button" tabindex="0" style="user-select: none; transition: background 120ms ease-in 0s; cursor: pointer; border-radius: 44px;"><div style="display: flex; flex-shrink: 0; height: 14px; width: 26px; border-radius: 44px; padding: 2px; box-sizing: content-box; background: rgb(46, 170, 220); transition: background 200ms ease 0s, box-shadow 200ms ease 0s;"><div style="width: 14px; height: 14px; border-radius: 44px; background: white; transition: transform 200ms ease-out 0s, background 200ms ease-out 0s; transform: translateX(12px) translateY(0px);"></div></div></div></div>';

        document.body.classList.add('dark');

        __console.environment.ThemeStore.setState({ mode: 'dark' });

      };

      function onLight() {

        el.innerHTML = '<div title="Change to Dark Mode" style="margin-left: auto; margin-right: 14px; min-width: 0px;"><div role="button" tabindex="0" style="user-select: none; transition: background 120ms ease-in 0s; cursor: pointer; border-radius: 44px;"><div style="display: flex; flex-shrink: 0; height: 14px; width: 26px; border-radius: 44px; padding: 2px; box-sizing: content-box; background: rgba(135, 131, 120, 0.3); transition: background 200ms ease 0s, box-shadow 200ms ease 0s;"><div style="width: 14px; height: 14px; border-radius: 44px; background: white; transition: transform 200ms ease-out 0s, background 200ms ease-out 0s; transform: translateX(0px) translateY(0px);"></div></div></div></div>';

        document.body.classList.remove('dark');

        __console.environment.ThemeStore.setState({ mode: 'light' });

      }

      function toggle() {

        if (document.body.classList.contains('dark')) {

          onLight();

        } else {

          onDark();

        }

      }

      function addDarkModeButton(device) {

        const nav = device === 'web' ? document.querySelector('.notion-topbar').firstChild : document.querySelector('.notion-topbar-mobile');

        el.className = 'toggle-mode';

        el.addEventListener('click', toggle);

        nav.appendChild(el);

        onLight();

      }

      const observer = new MutationObserver(function() {

        if (redirected) return;

        const nav = document.querySelector('.notion-topbar');

        const mobileNav = document.querySelector('.notion-topbar-mobile');

        if (nav && nav.firstChild && nav.firstChild.firstChild

          || mobileNav && mobileNav.firstChild) {

          redirected = true;

          updateSlug();

          addDarkModeButton(nav ? 'web' : 'mobile');

          const onpopstate = window.onpopstate;

          window.onpopstate = function() {

            if (slugs.includes(getSlug())) {

              const page = SLUG_TO_PAGE[getSlug()];

              if (page) {

                history.replaceState(history.state, 'bypass', '/' + page);

              }

            }

            onpopstate.apply(this, [].slice.call(arguments));

            updateSlug();

          };

        }

      });

      observer.observe(document.querySelector('#notion-app'), {

        childList: true,

        subtree: true,

      });

      const replaceState = window.history.replaceState;

      window.history.replaceState = function(state) {

        if (arguments[1] !== 'bypass' && slugs.includes(getSlug())) return;

        return replaceState.apply(window.history, arguments);

      };

      const pushState = window.history.pushState;

      window.history.pushState = function(state) {

        const dest = new URL(location.protocol + location.host + arguments[2]);

        const id = dest.pathname.slice(-32);

        if (pages.includes(id)) {

          arguments[2] = '/' + PAGE_TO_SLUG[id];

        }

        return pushState.apply(window.history, arguments);

      };

      const open = window.XMLHttpRequest.prototype.open;

      window.XMLHttpRequest.prototype.open = function() {

        arguments[1] = arguments[1].replace('${MY_DOMAIN}', 'www.notion.so');

        return open.apply(this, [].slice.call(arguments));

      };

    </script>${CUSTOM_SCRIPT}`, {

        html: true

      });

    }

  }

  async function appendJavascript(res, SLUG_TO_PAGE) {

    return new HTMLRewriter()

      .on('title', new MetaRewriter())

      .on('meta', new MetaRewriter())

      .on('head', new HeadRewriter())

      .on('body', new BodyRewriter(SLUG_TO_PAGE))

      .transform(res);

  }