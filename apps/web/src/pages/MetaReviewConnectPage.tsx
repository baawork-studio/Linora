import { useState } from "react";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import { CheckCircle, Facebook } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { LoadingDots } from "../components/LoadingDots";

type MetaReviewConnectPageProps = {
  hasFacebookLogin: boolean;
  isLoading?: boolean;
  loginError?: string | null;
  onLogin: () => Promise<void>;
};

export function MetaReviewConnectPage({ hasFacebookLogin, isLoading = false, loginError, onLogin }: MetaReviewConnectPageProps) {
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  function handleLogin() {
    if (hasFacebookLogin) {
      navigate("/pages");
      return;
    }
    setIsRedirecting(true);
    window.setTimeout(() => void onLogin().catch(() => setIsRedirecting(false)), 650);
  }

  return (
    <Stack sx={{ mb: -4, minHeight: "calc(100dvh - 88px)", pb: 0, textAlign: "center" }}>
      <Stack spacing={2.25} sx={{ alignItems: "center", flex: "1 1 auto", justifyContent: "center", transform: "translateY(-28px)" }}>
        <Box alt="Linora" component="img" src="/linora-icon.png" sx={{ height: 118, objectFit: "contain", width: 118 }} />
        <Stack spacing={0.75}>
          <Typography variant="h1">Welcome to Linora</Typography>
          <Typography color="text.secondary" sx={{ fontSize: 15, lineHeight: 1.5 }}>
            Connect a Facebook Page to create your first analytics report.
          </Typography>
        </Stack>
        {loginError ? <Alert severity="error">Unable to retrieve your Facebook Pages. Please try again.</Alert> : null}
        <Button
          disabled={isLoading || isRedirecting}
          onClick={handleLogin}
          size="large"
          startIcon={hasFacebookLogin ? <CheckCircle /> : <Facebook />}
          sx={{ bgcolor: "#1877F2", boxShadow: "0 10px 22px rgba(24, 119, 242, 0.22)", maxWidth: 320, minWidth: 260, width: "82%", "&:hover": { bgcolor: "#166FE5" } }}
          variant="contained"
        >
          {isLoading || isRedirecting ? "Opening Facebook" : hasFacebookLogin ? "Choose a Page" : "Continue with Facebook"}
        </Button>
      </Stack>
      <Stack spacing={1.1} sx={{ bgcolor: "background.paper", borderRadius: "50% 50% 0 0 / 28px 28px 0 0", flex: "0 0 auto", mx: -2, pb: "calc(20px + env(safe-area-inset-bottom, 0px))", pt: 2.5, px: 2 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 900 }}>Why Linora requests Facebook access</Typography>
        <Typography color="text.secondary" sx={{ fontSize: 14, lineHeight: 1.55 }}>
          Linora reads the Pages you manage and uses data from the Page you choose only to prepare analytics and recommendations.
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: 13, lineHeight: 1.5 }}>
          Linora never asks for your Facebook password, displays no access tokens, and does not publish, reply to, or edit your Page automatically.
        </Typography>
      </Stack>
      {isRedirecting ? <Box aria-live="polite" role="status" sx={{ alignItems: "center", backdropFilter: "blur(12px)", bgcolor: "rgba(248, 246, 240, 0.96)", display: "flex", inset: 0, justifyContent: "center", position: "fixed", zIndex: 100 }}><Stack spacing={1.25} sx={{ alignItems: "center" }}><LoadingDots /><Typography sx={{ fontSize: 19, fontWeight: 900 }}>Please wait</Typography><Typography color="text.secondary" sx={{ fontSize: 14 }}>Opening Facebook authorization</Typography></Stack></Box> : null}
    </Stack>
  );
}
