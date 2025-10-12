import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const revalidate = 0;
// Primary EU regions matching Vercel Function Regions configuration: Paris, London, Frankfurt
export const preferredRegion = ["cdg1", "lhr1", "fra1"];

const subscribeSchema = z.object({
  email: z.string().email("Ongeldig e-mailadres."),
});

export async function POST(req: NextRequest) {
  // 1. Validate Environment Variables
  const apiKey = process.env.BREVO_API_KEY;
  const listId = process.env.BREVO_LIST_ID;

  if (!apiKey || !listId) {
    console.error("Brevo API key or List ID is not configured in .env.local");
    const res = NextResponse.json(
      {
        ok: false,
        error: "Service tijdelijk niet beschikbaar. Probeer het later opnieuw.",
      },
      { status: 500 },
    );
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  try {
    // 2. Validate Incoming Data
    const body = await req.json();
    const parsed = subscribeSchema.safeParse(body);

    if (!parsed.success) {
      const res = NextResponse.json(
        { ok: false, error: "Ongeldig e-mailadres opgegeven." },
        { status: 400 },
      );
      res.headers.set("Cache-Control", "no-store");
      return res;
    }

    const { email } = parsed.data;

    // 3. Prepare and Send Request to Brevo API
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        email: email,
        listIds: [parseInt(listId, 10)],
        updateEnabled: false, // Prevents updating existing contacts, just adds them to the list
      }),
    });

    // 4. Handle Brevo API Response
    if (response.status === 201 || response.status === 204) {
      // 201: Contact created, 204: Contact already existed but was added to the list
      console.log(
        `[Newsletter Subscription] Successfully added ${email} to list ID ${listId}.`,
      );
      const res = NextResponse.json({
        ok: true,
        message: "Successfully subscribed!",
      });
      res.headers.set("Cache-Control", "no-store");
      return res;
    } else if (response.status === 400) {
      // Check if it's a duplicate email error
      const errorData = await response.json();
      if (
        errorData.code === "duplicate_parameter" &&
        errorData.message?.includes("email is already associated")
      ) {
        // Email already exists - treat as success with appropriate message
        console.log(
          `[Newsletter Subscription] Email ${email} already exists in list ID ${listId} - treating as success.`,
        );
        const res = NextResponse.json({
          ok: true,
          message: "Je bent al ingeschreven voor onze nieuwsbrief!",
        });
        res.headers.set("Cache-Control", "no-store");
        return res;
      } else {
        // Other 400 errors (invalid email format, etc.)
        console.error(
          `[Brevo API Error] Status: ${response.status}, Email: ${email}`,
          errorData,
        );
        const res = NextResponse.json(
          { ok: false, error: "Ongeldig e-mailadres opgegeven." },
          { status: 400 },
        );
        res.headers.set("Cache-Control", "no-store");
        return res;
      }
    } else {
      const errorData = await response.json();
      console.error(
        `[Brevo API Error] Status: ${response.status}, Email: ${email}`,
        errorData,
      );
      // Don't expose Brevo API errors to client
      const res = NextResponse.json(
        {
          ok: false,
          error: "Inschrijving mislukt. Probeer het later opnieuw.",
        },
        { status: 500 },
      );
      res.headers.set("Cache-Control", "no-store");
      return res;
    }
  } catch (error) {
    console.error("[API/SUBSCRIBE] Error:", error);
    // Always return generic error message to client
    const res = NextResponse.json(
      { ok: false, error: "Inschrijving mislukt. Probeer het later opnieuw." },
      { status: 500 },
    );
    res.headers.set("Cache-Control", "no-store");
    return res;
  }
}
