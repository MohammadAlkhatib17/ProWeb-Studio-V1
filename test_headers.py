#!/usr/bin/env python3
"""
Headers and Cache Testing Script for ProWeb Studio
Tests various routes to verify headers configuration.
"""

import requests
import json
import time
from urllib.parse import urljoin

# Configuration
BASE_URL = "http://localhost:3000"
TIMEOUT = 10

# Test routes and their expected characteristics
TEST_ROUTES = [
    # HTML pages with ISR caching
    {"path": "/", "type": "html", "description": "Home page"},
    {"path": "/contact", "type": "html", "description": "Contact page"},
    {"path": "/diensten", "type": "html", "description": "Services page"},
    {"path": "/over-ons", "type": "html", "description": "About page"},
    
    # API routes (should have no cache)
    {"path": "/api/contact", "type": "api", "description": "Contact form API"},
    
    # Static assets (should have long cache + immutable)
    {"path": "/assets/hero_portal_background.png", "type": "static", "description": "Static asset"},
    {"path": "/logo-proweb-icon.svg", "type": "static", "description": "Logo SVG"},
    
    # Next.js optimized images
    {"path": "/_next/image?url=%2Fassets%2Fhero_portal_background.png&w=1920&q=75", "type": "image", "description": "Next.js optimized image"},
    
    # Next.js static files
    {"path": "/_next/static/chunks/main.js", "type": "nextjs-static", "description": "Next.js chunk"},
    
    # PWA files
    {"path": "/manifest.json", "type": "pwa", "description": "PWA manifest"},
    {"path": "/sw.js", "type": "pwa", "description": "Service Worker"},
]

def test_route(route_info):
    """Test a single route and return headers information."""
    try:
        url = urljoin(BASE_URL, route_info["path"])
        response = requests.get(url, timeout=TIMEOUT, allow_redirects=False)
        
        # Extract relevant headers
        headers = dict(response.headers)
        
        result = {
            "route": route_info,
            "status": response.status_code,
            "headers": {
                "cache-control": headers.get("cache-control", "NOT SET"),
                "x-content-type-options": headers.get("x-content-type-options", "NOT SET"),
                "x-frame-options": headers.get("x-frame-options", "NOT SET"),
                "strict-transport-security": headers.get("strict-transport-security", "NOT SET"),
                "referrer-policy": headers.get("referrer-policy", "NOT SET"),
                "permissions-policy": headers.get("permissions-policy", "NOT SET"),
                "content-type": headers.get("content-type", "NOT SET"),
                "etag": headers.get("etag", "NOT SET"),
                "x-api-version": headers.get("x-api-version", "NOT SET"),
                "x-security-version": headers.get("x-security-version", "NOT SET"),
                "pragma": headers.get("pragma", "NOT SET"),
                "expires": headers.get("expires", "NOT SET"),
                "vary": headers.get("vary", "NOT SET"),
            },
            "size": len(response.content) if response.content else 0
        }
        
        return result
        
    except requests.RequestException as e:
        return {
            "route": route_info,
            "status": "ERROR",
            "error": str(e),
            "headers": {}
        }

def check_server_running():
    """Check if the development server is running."""
    try:
        response = requests.get(BASE_URL, timeout=5)
        return response.status_code == 200
    except:
        return False

def main():
    print("🧪 ProWeb Studio Headers & Cache Testing")
    print("=" * 50)
    
    # Check if server is running
    if not check_server_running():
        print(f"❌ Server not running at {BASE_URL}")
        print("Please start the development server with: npm run dev")
        return
    
    print(f"✅ Server running at {BASE_URL}")
    print()
    
    results = []
    
    for route_info in TEST_ROUTES:
        print(f"Testing: {route_info['path']} ({route_info['type']})")
        result = test_route(route_info)
        results.append(result)
        
        if result.get("status") == "ERROR":
            print(f"  ❌ Error: {result.get('error')}")
        else:
            print(f"  ✅ Status: {result['status']}")
            cache_control = result["headers"].get("cache-control", "NOT SET")
            print(f"  📋 Cache-Control: {cache_control}")
        print()
        
        # Small delay to avoid overwhelming the server
        time.sleep(0.1)
    
    # Save results to JSON for further analysis
    with open("/home/mohammadalkhatib/Desktop/personal/ProWeb-Studio-V1/headers_test_results.json", "w") as f:
        json.dump({
            "timestamp": time.time(),
            "base_url": BASE_URL,
            "results": results
        }, f, indent=2)
    
    print("📊 Results saved to headers_test_results.json")
    print("🎯 Ready to generate headers-cache.md report")

if __name__ == "__main__":
    main()