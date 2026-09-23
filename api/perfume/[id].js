// Vercel Serverless Function: inyecta meta tags (Open Graph / Twitter Card)
// específicos del perfume antes de servir el shell de la SPA. Los bots de
// WhatsApp/Facebook/Telegram/etc. no ejecutan JS, así que el título/imagen
// dinámicos deben estar presentes en el HTML de la respuesta inicial.

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function absoluteUrl(url, siteUrl) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${siteUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}

export default async function handler(req, res) {
  const { id } = req.query;
  const siteUrl = (process.env.VITE_SITE_URL || `https://${req.headers.host}`).replace(/\/$/, '');
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

  let perfume = null;

  try {
    if (supabaseUrl && supabaseAnonKey && id) {
      const apiUrl = `${supabaseUrl}/rest/v1/perfumes?id=eq.${encodeURIComponent(id)}&active=eq.true&select=name,brand,perfume_img,image,notes&limit=1`;
      const resp = await fetch(apiUrl, {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
      });
      if (resp.ok) {
        const rows = await resp.json();
        perfume = rows[0] || null;
      }
    }
  } catch (err) {
    console.error('Error fetching perfume for OG tags:', err);
  }

  let html;
  try {
    const htmlResp = await fetch(`https://${req.headers.host}/index.html`);
    html = await htmlResp.text();
  } catch (err) {
    console.error('Error fetching base index.html:', err);
    res.status(500).send('Internal Server Error');
    return;
  }

  if (perfume) {
    const title = `${perfume.name} — ${perfume.brand} | Koda Fragancias`;
    const description = perfume.notes
      ? `${perfume.name} de ${perfume.brand}. ${perfume.notes}. Consultá disponibilidad y precio por WhatsApp.`
      : `${perfume.name} de ${perfume.brand}, disponible en Koda Fragancias. Consultá por WhatsApp.`;
    const image =
      absoluteUrl(perfume.perfume_img, siteUrl) ||
      absoluteUrl(perfume.image, siteUrl) ||
      `${siteUrl}/og-koda.png`;
    const pageUrl = `${siteUrl}/perfume/${id}`;

    const safeTitle = escapeHtml(title);
    const safeDescription = escapeHtml(description);
    const safeImage = escapeHtml(image);
    const safeUrl = escapeHtml(pageUrl);

    html = html
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${safeTitle}</title>`)
      .replace(
        /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
        `<meta name="description" content="${safeDescription}" />`
      )
      .replace(
        /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/,
        `<link rel="canonical" href="${safeUrl}" />`
      )
      .replace(
        /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/,
        `<meta property="og:url" content="${safeUrl}" />`
      )
      .replace(
        /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
        `<meta property="og:title" content="${safeTitle}" />`
      )
      .replace(
        /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
        `<meta property="og:description" content="${safeDescription}" />`
      )
      .replace(
        /<meta\s+property="og:image"\s+content="[^"]*"\s*\/>/,
        `<meta property="og:image" content="${safeImage}" />`
      )
      .replace(
        /<meta\s+property="og:image:alt"\s+content="[^"]*"\s*\/>/,
        `<meta property="og:image:alt" content="${safeTitle}" />`
      )
      .replace(
        /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/,
        `<meta name="twitter:title" content="${safeTitle}" />`
      )
      .replace(
        /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/,
        `<meta name="twitter:description" content="${safeDescription}" />`
      )
      .replace(
        /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/>/,
        `<meta name="twitter:image" content="${safeImage}" />`
      )
      .replace(
        /<meta\s+name="twitter:image:alt"\s+content="[^"]*"\s*\/>/,
        `<meta name="twitter:image:alt" content="${safeTitle}" />`
      )
      // El mime type real de perfume_img/image puede no ser PNG; quitamos la
      // declaración fija para no anunciar un tipo incorrecto a los bots.
      .replace(/\s*<meta\s+property="og:image:type"\s+content="[^"]*"\s*\/>\n?/, '\n');
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=600, stale-while-revalidate=3600');
  res.status(200).send(html);
}
