import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function AuthDebug() {
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: signUpEmail,
      password: signUpPassword,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Sign-up request sent. Check email if confirmations are enabled.");
    }
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error, data } = await supabase.auth.signInWithPassword({
      email: signInEmail,
      password: signInPassword,
    });
    if (error) {
      toast.error(error.message || "Invalid credentials");
    } else {
      toast.success("Signed in");
      setSessionInfo(data.session);
      navigate("/");
    }
    setLoading(false);
  };

  const handleGetSession = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      toast.error(error.message);
    } else {
      setSessionInfo(data.session);
      toast.success("Fetched session");
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Signed out");
      setSessionInfo(null);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Auth Debug Panel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Use this to create users (sign up), sign in, and inspect the current session. If sign-up emails
              are required, confirm the user in the Supabase dashboard or disable confirmations temporarily.
            </p>
            <Separator />

            <div className="grid gap-6 md:grid-cols-2">
              <form className="space-y-3" onSubmit={handleSignUp}>
                <div className="space-y-1">
                  <Label htmlFor="signup-email">Sign-up Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="signup-password">Sign-up Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Working..." : "Create User"}
                </Button>
              </form>

              <form className="space-y-3" onSubmit={handleSignIn}>
                <div className="space-y-1">
                  <Label htmlFor="signin-email">Sign-in Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="signin-password">Sign-in Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Working..." : "Sign In"}
                </Button>
              </form>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleGetSession} disabled={loading}>
                Get Session
              </Button>
              <Button variant="secondary" onClick={handleSignOut} disabled={loading}>
                Sign Out
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Session snapshot</p>
                <p className="text-xs text-muted-foreground">Values from supabase.auth.getSession()</p>
              </div>
              <pre className="bg-muted text-xs p-3 rounded border overflow-x-auto">
                {sessionInfo ? JSON.stringify(sessionInfo, null, 2) : "No session loaded"}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
