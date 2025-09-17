#!/bin/bash

# Directory containing images
IMAGE_DIR="../public/images"

# Convert all PNG and JPG images to AVIF and WebP
for file in "$IMAGE_DIR"/*.{png,jpg,jpeg}; do
  if [ -f "$file" ]; then
    filename="${file%.*}"
    
    # Convert to AVIF
    npx sharp-cli -i "$file" -o "${filename}.avif" -f avif -q 80
    
    # Convert to WebP
    npx sharp-cli -i "$file" -o "${filename}.webp" -f webp -q 85
    
    echo "Optimized: $file"
  fi
done

echo "Image optimization complete!"
