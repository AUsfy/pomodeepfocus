# Open Graph Image Missing

The og-image.png file is missing from the public directory. 

## Quick Fix Options:

### Option 1: Use existing SVG logo (already implemented)
The meta tags now reference `/pomo-logo.svg` instead of the missing PNG.

### Option 2: Create a proper OG image
You need to create a 1200x630 PNG image with:
- Your logo/branding
- App title "Pomo Timer" 
- Tagline "Stop Procrastinating, Start Achieving"
- Website URL

### Option 3: Use online tools
Use tools like:
- Canva.com
- Figma
- Adobe Express
- Or the generate-og-image.html file I created

## Current Status:
✅ Meta tags updated to use SVG logo as fallback
✅ Proper Open Graph dimensions added
✅ Twitter card meta tags fixed

The image should now show up in search results, but for best results, create a proper 1200x630 PNG image and place it in the /public directory as og-image.png