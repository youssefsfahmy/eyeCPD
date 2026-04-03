import {
  Container,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
} from "@mui/material";

export default function TermsPage() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        Terms of Service — EyeCPD
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Last updated: 5 March 2026
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
        These Terms of Service (&quot;Terms&quot;) govern your access to and use
        of EyeCPD (the &quot;Service&quot;).
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
        <strong>Provider:</strong> Eyetech Pty Ltd (ABN 60 616 315 201) of
        Sydney, New South Wales, Australia (&quot;Eyetech&quot;,
        &quot;EyeCPD&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;).
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
        By accessing or using the Service, you agree to these Terms. If you do
        not agree, do not use the Service.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ "& > *": { mb: 4 } }}>
        <Box>
          <Typography variant="h5" fontWeight="semibold" gutterBottom>
            1. The Service
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            EyeCPD is a platform designed to help users log and track Continuing
            Professional Development (CPD) activities, store evidence, and view
            summaries and exports.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            EyeCPD is not professional, legal, or regulatory advice. You are
            responsible for ensuring your CPD records and submissions meet your
            applicable professional and regulatory requirements.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h5" fontWeight="semibold" gutterBottom>
            2. Eligibility and Accounts
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            You must be at least 16 years old to use the Service.
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            You are responsible for:
          </Typography>
          <List dense sx={{ pl: 2 }}>
            <ListItem
              sx={{
                display: "list-item",
                listStyleType: "disc",
                color: "text.secondary",
              }}
            >
              <Typography variant="body1" color="text.secondary">
                keeping your login credentials secure,
              </Typography>
            </ListItem>
            <ListItem
              sx={{
                display: "list-item",
                listStyleType: "disc",
                color: "text.secondary",
              }}
            >
              <Typography variant="body1" color="text.secondary">
                all activity under your account, and
              </Typography>
            </ListItem>
            <ListItem
              sx={{
                display: "list-item",
                listStyleType: "disc",
                color: "text.secondary",
              }}
            >
              <Typography variant="body1" color="text.secondary">
                ensuring information you provide is accurate and up to date.
              </Typography>
            </ListItem>
          </List>
        </Box>

        <Box>
          <Typography variant="h5" fontWeight="semibold" gutterBottom>
            3. Acceptable Use
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            You must not:
          </Typography>
          <List dense sx={{ pl: 2 }}>
            {[
              "use the Service in a way that breaches any law or infringes rights,",
              "upload malware or attempt to interfere with the Service's security or operation,",
              "attempt to access accounts, data, or systems without authorisation,",
              "scrape or harvest data from the Service without our written permission,",
              "use the Service to send spam or unlawful marketing.",
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
            4. User Content (Your Uploads)
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            &quot;User Content&quot; includes CPD logs, notes, uploads,
            certificates, and other content you submit.
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            You retain ownership of your User Content.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You grant us a limited licence to host, store, back up, process, and
            display your User Content only as needed to operate, secure, and
            improve the Service (including troubleshooting and maintaining
            backups).
          </Typography>
        </Box>

        <Box>
          <Typography variant="h5" fontWeight="semibold" gutterBottom>
            5. No Patient Information
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            EyeCPD is intended for CPD tracking, not clinical record storage.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You must not upload patient-identifying information or clinical
            documents containing patient information. If you upload such
            information, you do so at your own risk and you are responsible for
            ensuring you have the necessary authority and consents.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h5" fontWeight="semibold" gutterBottom>
            6. Pricing
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            EyeCPD is currently free to use.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            If we introduce paid plans in the future, we will publish updated
            terms and pricing before any charges apply.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h5" fontWeight="semibold" gutterBottom>
            7. Availability and Changes
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            We aim to keep the Service available and reliable, but we do not
            guarantee uninterrupted access. The Service may be unavailable due
            to maintenance, outages, or third-party failures.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            We may update, change, or discontinue parts of the Service at any
            time.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h5" fontWeight="semibold" gutterBottom>
            8. Intellectual Property
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            We own all intellectual property rights in the Service, including
            its software, design, branding, and content we provide (excluding
            your User Content).
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You must not copy, modify, reverse engineer, or resell any part of
            the Service except as permitted by law.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h5" fontWeight="semibold" gutterBottom>
            9. Third-Party Services
          </Typography>
          <Typography variant="body1" color="text.secondary">
            The Service may rely on third-party providers (e.g., hosting, email
            delivery, analytics). We are not responsible for third-party
            services.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h5" fontWeight="semibold" gutterBottom>
            10. Disclaimers
          </Typography>
          <Typography variant="body1" color="text.secondary">
            To the maximum extent permitted by law, the Service is provided
            &quot;as is&quot; and &quot;as available.&quot; We do not warrant
            that the Service will be error-free or meet every user requirement.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h5" fontWeight="semibold" gutterBottom>
            11. Liability and Australian Consumer Law
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Nothing in these Terms excludes, restricts, or modifies rights you
            may have under the Australian Consumer Law that cannot lawfully be
            excluded.
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            To the maximum extent permitted by law, we are not liable for
            indirect or consequential loss (e.g., loss of profit, goodwill, or
            data).
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Where liability cannot be excluded and the law permits limitation,
            our total liability for any claim relating to the Service is limited
            to the greater of:
          </Typography>
          <List dense sx={{ pl: 2 }}>
            <ListItem
              sx={{
                display: "list-item",
                listStyleType: "disc",
                color: "text.secondary",
              }}
            >
              <Typography variant="body1" color="text.secondary">
                AUD $100, and
              </Typography>
            </ListItem>
            <ListItem
              sx={{
                display: "list-item",
                listStyleType: "disc",
                color: "text.secondary",
              }}
            >
              <Typography variant="body1" color="text.secondary">
                the total amount you paid to us for the Service in the 12 months
                before the event (which is currently $0 while the Service is
                free).
              </Typography>
            </ListItem>
          </List>
        </Box>

        <Box>
          <Typography variant="h5" fontWeight="semibold" gutterBottom>
            12. Suspension and Termination
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            We may suspend or terminate your access if you breach these Terms,
            misuse the Service, or we must do so for security or legal reasons.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You may stop using the Service at any time.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h5" fontWeight="semibold" gutterBottom>
            13. Governing Law
          </Typography>
          <Typography variant="body1" color="text.secondary">
            These Terms are governed by the laws of New South Wales, Australia.
            You submit to the non-exclusive jurisdiction of NSW courts.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h5" fontWeight="semibold" gutterBottom>
            14. Contact
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Support:{" "}
            <a href="mailto:support@eyecpd.com.au">support@eyecpd.com.au</a>
            <br />
            Provider: Eyetech Pty Ltd (ABN 60 616 315 201), Sydney NSW,
            Australia
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
