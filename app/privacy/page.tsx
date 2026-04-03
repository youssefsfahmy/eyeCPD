import {
  Container,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
} from "@mui/material";

export default function PrivacyPage() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        Privacy Policy — EyeCPD
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Last updated: 5 March 2026
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
        Eyetech Pty Ltd (ABN 60 616 315 201) (&quot;Eyetech&quot;,
        &quot;EyeCPD&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is
        committed to protecting your privacy.
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
        This Privacy Policy explains how we collect, use, store, and disclose
        personal information in connection with EyeCPD, in accordance with the{" "}
        <em>Privacy Act 1988</em> (Cth) and the Australian Privacy Principles
        (APPs).
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ "& > *": { mb: 4 } }}>
        <Box>
          <Typography variant="h5" fontWeight="semibold" gutterBottom>
            1. What Personal Information We Collect
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            We may collect:
          </Typography>
          <List dense sx={{ pl: 2 }}>
            {[
              "Account details: name (if provided), email address, account settings, password (stored as a secure hash).",
              "CPD information: activities, categories, hours, notes, and evidence files you upload.",
              "Support communications: messages you send to support and feedback you provide.",
              "Usage and device data: IP address, browser/device type, log events, and performance diagnostics.",
              "Marketing preferences: subscription/unsubscribe status.",
            ].map((item, i) => (
              <ListItem
                key={i}
                sx={{
                  display: "list-item",
                  listStyleType: "disc",
                  color: "text.secondary",
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  {item}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>

        <Box>
          <Typography variant="h5" fontWeight="semibold" gutterBottom>
            2. What We Do Not Want You to Upload
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            EyeCPD is not intended to store clinical records.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You should not upload patient-identifying information or documents
            containing patient information.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h5" fontWeight="semibold" gutterBottom>
            3. How We Collect Personal Information
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            We collect personal information when you:
          </Typography>
          <List dense sx={{ pl: 2 }}>
            {[
              "create an account or use the platform,",
              "upload evidence or enter CPD records,",
              "contact us for support,",
              "interact with our emails (where tracking is enabled),",
              "use the platform where cookies/analytics are enabled.",
            ].map((item, i) => (
              <ListItem
                key={i}
                sx={{
                  display: "list-item",
                  listStyleType: "disc",
                  color: "text.secondary",
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  {item}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>

        <Box>
          <Typography variant="h5" fontWeight="semibold" gutterBottom>
            4. Why We Collect, Use, and Disclose Personal Information
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            We use personal information to:
          </Typography>
          <List dense sx={{ pl: 2 }}>
            {[
              "provide and operate the Service (accounts, CPD tracking, storage, exports),",
              "maintain security and prevent misuse,",
              "provide customer support,",
              "send essential service communications (e.g., security notices),",
              "improve the Service (analytics, diagnostics),",
              "comply with legal obligations.",
            ].map((item, i) => (
              <ListItem
                key={i}
                sx={{
                  display: "list-item",
                  listStyleType: "disc",
                  color: "text.secondary",
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  {item}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>

        <Box>
          <Typography variant="h5" fontWeight="semibold" gutterBottom>
            5. Direct Marketing
          </Typography>
          <Typography variant="body1" color="text.secondary">
            If we send marketing communications, we will do so in accordance
            with Australian spam laws, including providing a clear and
            functional unsubscribe mechanism and honouring unsubscribe requests.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h5" fontWeight="semibold" gutterBottom>
            6. Who We Disclose Personal Information To
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            We may disclose personal information to trusted third-party service
            providers that help us run EyeCPD, such as:
          </Typography>
          <List dense sx={{ pl: 2 }}>
            {[
              "hosting and infrastructure providers,",
              "email delivery providers,",
              "analytics and error monitoring providers,",
              "professional advisers (e.g., legal/accounting) where necessary,",
              "regulators or law enforcement where required or authorised by law.",
            ].map((item, i) => (
              <ListItem
                key={i}
                sx={{
                  display: "list-item",
                  listStyleType: "disc",
                  color: "text.secondary",
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  {item}
                </Typography>
              </ListItem>
            ))}
          </List>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            We do not sell your personal information.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h5" fontWeight="semibold" gutterBottom>
            7. Overseas Disclosure
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Some service providers may store or process data outside Australia.
            Where we disclose personal information overseas, we take reasonable
            steps to ensure it is handled in a way consistent with the APPs.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h5" fontWeight="semibold" gutterBottom>
            8. Security
          </Typography>
          <Typography variant="body1" color="text.secondary">
            We take reasonable steps to protect personal information from
            misuse, interference, loss, and unauthorised access, modification,
            or disclosure (e.g., access controls, encryption in transit, secure
            hosting practices). No system is perfectly secure, but we take
            security seriously.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h5" fontWeight="semibold" gutterBottom>
            9. Data Retention
          </Typography>
          <Typography variant="body1" color="text.secondary">
            We retain personal information only as long as necessary to provide
            the Service and for legitimate business and legal purposes. Backups
            may persist for a limited period.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h5" fontWeight="semibold" gutterBottom>
            10. Access and Correction
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You may request access to, or correction of, your personal
            information by contacting us at{" "}
            <a href="mailto:support@eyecpd.com.au">support@eyecpd.com.au</a>. We
            may need to verify your identity.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h5" fontWeight="semibold" gutterBottom>
            11. Complaints
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            If you have a privacy complaint, contact us at{" "}
            <a href="mailto:support@eyecpd.com.au">support@eyecpd.com.au</a> and
            we will respond within a reasonable timeframe.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            If you are not satisfied, you may complain to the Office of the
            Australian Information Commissioner (OAIC).
          </Typography>
        </Box>

        <Box>
          <Typography variant="h5" fontWeight="semibold" gutterBottom>
            12. Notifiable Data Breaches
          </Typography>
          <Typography variant="body1" color="text.secondary">
            If a data breach occurs that is likely to result in serious harm, we
            will notify affected individuals and the OAIC where required under
            the Notifiable Data Breaches (NDB) scheme.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h5" fontWeight="semibold" gutterBottom>
            13. Cookies and Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            We may use cookies and similar technologies to keep you logged in,
            remember preferences, and understand how the Service is used. You
            can control cookies through your browser settings, but some
            functionality may be affected.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h5" fontWeight="semibold" gutterBottom>
            14. Changes to This Policy
          </Typography>
          <Typography variant="body1" color="text.secondary">
            We may update this Privacy Policy from time to time. Where changes
            are material, we will take reasonable steps to notify you (e.g., via
            email or in-app notice).
          </Typography>
        </Box>

        <Box>
          <Typography variant="h5" fontWeight="semibold" gutterBottom>
            15. Contact
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Eyetech Pty Ltd (ABN 60 616 315 201)
            <br />
            Sydney, New South Wales, Australia
            <br />
            Email:{" "}
            <a href="mailto:support@eyecpd.com.au">support@eyecpd.com.au</a>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
