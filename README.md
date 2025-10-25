# Centro Educativo Nuevo Milenio - Website

A modern, accessible, and lightweight website for Centro Educativo Nuevo Milenio.

## Features

- Modern, clean design with professional typography
- Fully responsive (mobile-first approach)
- Automatic dark/light mode based on system preference
- WCAG 2.1 Level AA accessibility compliance
- No dependencies (vanilla JavaScript, no jQuery)
- Optimized performance with lazy loading
- Keyboard navigation support
- Touch gesture support for mobile devices

## File Structure

```
project/
├── index.html          # Main HTML file
├── styles.css          # All styles with CSS custom properties
├── script.js           # Vanilla JavaScript (no dependencies)
├── assets/             # Images and media files
│   ├── logo.png
│   ├── img4.jpg
│   ├── img5.jpg
│   ├── img6.jpg
│   ├── img7.jpg
│   ├── img8.jpg
│   ├── video2.mp4
│   ├── actividad1.jpg
│   └── actividad2.jpg
└── README.md           # This file
```

## How to Use

1. **Open the website**: Simply open `index.html` in a modern web browser
2. **No build process required**: This is a static site with no dependencies

## Updating Content

### Updating Text

All text content is in `index.html`. To update:

1. Open `index.html` in a text editor
2. Find the section you want to edit (sections are labeled with IDs like `#home`, `#mission`, etc.)
3. Edit the text inside `<p>` tags
4. Save the file

**Example - Updating contact information:**
```html
<p class="info-value">314 700 2703<br>313 791 8728</p>
```

### Updating Images

1. Place your new images in the `assets/` folder
2. In `index.html`, update the `src` attribute of the `<img>` tag
3. Update the `alt` attribute to describe the image

**Example:**
```html
<img src="assets/your-image.jpg" alt="Description of image">
```

### Updating Colors

Colors are defined as CSS custom properties in `styles.css`. To change the color scheme:

1. Open `styles.css`
2. Find the `:root` section at the top
3. Modify the color values

**Example - Changing the primary brand color:**
```css
:root {
    --brand: #2E7D32;  /* Change this hex value */
    --primary: #2E7D32;
}
```

### Adding or Removing Carousel Slides

To add a new slide to the main carousel:

1. In `index.html`, find the `<div class="carousel-track">` section
2. Copy an existing `<article>` block
3. Update the content, `id`, and `data-index` attributes
4. Add a corresponding indicator button in the `.carousel-indicators` section
5. Add a navigation link in the header if needed

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Accessibility Features

- Semantic HTML5 elements
- ARIA labels and roles
- Keyboard navigation support
- Focus indicators
- Screen reader friendly
- Proper heading hierarchy
- High contrast ratios (WCAG AA compliant)

## Performance Optimizations

- Lazy loading for images
- Preconnect to font sources
- Deferred JavaScript loading
- Optimized CSS with custom properties
- Efficient animations using CSS transforms

## License

© 2023 Centro Educativo Nuevo Milenio. All rights reserved.
