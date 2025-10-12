import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
// Primary EU regions matching Vercel Function Regions configuration: Paris, London, Frankfurt
export const preferredRegion = ["cdg1", "lhr1", "fra1"];

// Environment-controlled CSP mode
function getCSPMode(): "report-only" | "enforce" {
  return process.env.CSP_REPORT_ONLY === "true" ? "report-only" : "enforce";
}

export async function POST(req: NextRequest) {
  try {
    const report = await req.json();
    const clientIP =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const now = new Date();
    const cspMode = getCSPMode();

    // Enhanced CSP violation logging with environment-controlled mode
    const violationData = {
      timestamp: now.toISOString(),
      cspMode,
      environment: process.env.NODE_ENV || "development",
      clientIP,
      userAgent: req.headers.get("user-agent")?.substring(0, 200),
      report: {
        blockedURI: report["blocked-uri"],
        documentURI: report["document-uri"],
        violatedDirective: report["violated-directive"],
        originalPolicy: report["original-policy"]?.substring(0, 500),
        sourceFile: report["source-file"],
        lineNumber: report["line-number"],
        columnNumber: report["column-number"],
        disposition:
          report["disposition"] ||
          (cspMode === "report-only" ? "report" : "enforce"),
      },
    };

    // Log CSP violation with enhanced context
    console.warn(
      `CSP Violation Report [${cspMode.toUpperCase()}]:`,
      violationData,
    );

    // Track specific violation types that may indicate security issues
    const violatedDirective = report["violated-directive"] || "";
    const blockedURI = report["blocked-uri"] || "";

    if (violatedDirective.includes("script-src")) {
      if (blockedURI === "eval") {
        console.warn(
          "⚠️  eval() usage detected - review security implications",
        );
      } else if (blockedURI.includes("inline")) {
        console.warn(
          "⚠️  inline script blocked - ensure nonce is properly set",
        );
      } else if (blockedURI.startsWith("http")) {
        console.warn("⚠️  external script blocked:", blockedURI);
      }
    }

    if (
      violatedDirective.includes("style-src") &&
      blockedURI.includes("inline")
    ) {
      console.info(
        "ℹ️  inline style blocked - this may be expected with strict CSP",
      );
    }

    // In production:
    // 1. Store reports in a database with timestamp
    // 2. Send alerts for critical violations in enforce mode
    // 3. Aggregate reports for analysis
    // 4. Generate violation summaries for debugging

    const res = NextResponse.json({ received: true }, { status: 204 });
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch (error) {
    console.error("CSP Report parsing error:", error);
    const res = NextResponse.json({ error: "Invalid report" }, { status: 400 });
    res.headers.set("Cache-Control", "no-store");
    return res;
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
