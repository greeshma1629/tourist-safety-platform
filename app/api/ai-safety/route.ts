import OpenAI from "openai";
import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          error: "You must be logged in to use Smart Safety.",
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json();

    const situation =
      typeof body.situation === "string"
        ? body.situation.trim()
        : "";

    if (!situation) {
      return NextResponse.json(
        {
          error: "Please describe the situation.",
        },
        {
          status: 400,
        }
      );
    }

    if (situation.length > 1500) {
      return NextResponse.json(
        {
          error:
            "Please keep your description under 1500 characters.",
        },
        {
          status: 400,
        }
      );
    }

    const response = await openai.responses.create({
      model: "gpt-5.6-luna",

      store: false,

      instructions: `
You are the Smart Safety Analyzer inside a tourist safety platform.

Analyze the user's travel-safety situation and provide cautious,
practical guidance.

Rules:
- Do not claim certainty about danger.
- Do not pretend to be police or emergency services.
- Do not encourage confrontation.
- Prefer safer public, populated, staffed, or well-lit places when appropriate.
- If the situation may require urgent assistance, recommend official local
  emergency services and the platform SOS feature.
- Keep recommendations short and practical.
- Treat the result as guidance rather than an official risk determination.
`,

      input: situation,

      text: {
        format: {
          type: "json_schema",
          name: "tourist_safety_analysis",
          strict: true,

          schema: {
            type: "object",

            properties: {
              risk_level: {
                type: "string",
                enum: [
                  "low",
                  "medium",
                  "high",
                ],
              },

              category: {
                type: "string",
                enum: [
                  "personal_safety",
                  "transport",
                  "scam",
                  "lost_property",
                  "health",
                  "general",
                ],
              },

              summary: {
                type: "string",
              },

              guidance: {
                type: "array",
                items: {
                  type: "string",
                },
              },

              suggest_sos: {
                type: "boolean",
              },
            },

            required: [
              "risk_level",
              "category",
              "summary",
              "guidance",
              "suggest_sos",
            ],

            additionalProperties: false,
          },
        },
      },
    });

    const analysis = JSON.parse(
      response.output_text
    );

    return NextResponse.json({
      analysis,
    });

  } catch (error: any) {
    console.error(
      "AI Safety Analysis Error:",
      error
    );

    if (
      error?.code ===
      "credit_balance_exhausted"
    ) {
      return NextResponse.json(
        {
          error:
            "Smart Safety AI is currently unavailable because API usage is not enabled for this project.",
        },
        {
          status: 503,
        }
      );
    }

    return NextResponse.json(
      {
        error:
          "Smart Safety is temporarily unavailable. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}