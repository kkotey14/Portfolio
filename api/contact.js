module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const { name, email, message } = req.body || {};
  const trimmedName = String(name || "").trim();
  const trimmedEmail = String(email || "").trim();
  const trimmedMessage = String(message || "").trim();

  if (!trimmedName || !trimmedEmail || !trimmedMessage) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    return res.status(500).json({ error: "Email service is not configured yet." });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: ["kkotey475@gmail.com"],
        reply_to: trimmedEmail,
        subject: `Portfolio message from ${trimmedName}`,
        text: [
          `Name: ${trimmedName}`,
          `Email: ${trimmedEmail}`,
          "",
          trimmedMessage,
        ].join("\n"),
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #16130f;">
            <h2 style="margin: 0 0 16px;">New Portfolio Message</h2>
            <p style="margin: 0 0 8px;"><strong>Name:</strong> ${escapeHtml(trimmedName)}</p>
            <p style="margin: 0 0 16px;"><strong>Email:</strong> ${escapeHtml(trimmedEmail)}</p>
            <p style="margin: 0 0 8px;"><strong>Message:</strong></p>
            <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(trimmedMessage)}</p>
          </div>
        `,
      }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage =
        result && typeof result.message === "string"
          ? result.message
          : "Unable to send the message right now.";
      throw new Error(errorMessage);
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unable to send the message right now.",
    });
  }
};

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
