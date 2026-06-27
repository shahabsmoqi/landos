import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { ReportPDF } from "@/components/ReportPDF";

export async function GET() {
  try {
    const buffer = await renderToBuffer(React.createElement(ReportPDF));

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="LandOS-Report-2600-Dave-Angel-Rd.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("PDF generation failed:", err);
    return Response.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
