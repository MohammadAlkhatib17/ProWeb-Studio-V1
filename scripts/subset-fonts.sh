#!/bin/bash

# Directory for fonts
FONT_DIR="../public/fonts"
mkdir -p "$FONT_DIR"

# Download and subset Inter font for Latin and Latin-ext only
# Using pyftsubset from fonttools

# Latin subset unicode ranges
LATIN_RANGE="U+0000-00FF"
LATIN_EXT_RANGE="U+0100-024F,U+0259,U+1E00-1EFF,U+2020,U+20A0-20AB,U+20AD-20CF,U+2113,U+2C60-2C7F,U+A720-A7FF"

# Font weights to subset (reduced set)
WEIGHTS=(400 500 600 700)

for weight in "${WEIGHTS[@]}"; do
  echo "Processing Inter weight $weight..."
  
  # Download font from Google Fonts
  wget -O "$FONT_DIR/inter-$weight.ttf" \
    "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
  
  # Subset font for Latin and Latin-ext
  pyftsubset "$FONT_DIR/inter-$weight.ttf" \
    --unicodes="$LATIN_RANGE,$LATIN_EXT_RANGE" \
    --layout-features="kern,liga,clig,calt" \
    --flavor="woff2" \
    --output-file="$FONT_DIR/inter-v13-latin-latin-ext-$weight.woff2"
  
  # Create WOFF fallback
  pyftsubset "$FONT_DIR/inter-$weight.ttf" \
    --unicodes="$LATIN_RANGE,$LATIN_EXT_RANGE" \
    --layout-features="kern,liga,clig,calt" \
    --flavor="woff" \
    --output-file="$FONT_DIR/inter-v13-latin-latin-ext-$weight.woff"
  
  # Clean up original TTF
  rm "$FONT_DIR/inter-$weight.ttf"
done

echo "Font subsetting complete!"
echo "Fonts saved to: $FONT_DIR"
