import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShineBorder } from "@/components/magicui/shine-border";
import { auth } from "@/lib/supabase/utils";
import { 
  validateEmail, 
  validatePassword, 
  validatePasswordConfirmation, 
  validateDisplayName,
  getPasswordStrength 
} from "@/lib/supabase/validation";

export function SignCard() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [displayName, setDisplayName] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

	// Real-time validation as user types
	const validateField = (field: string, value: string) => {
		let validation;
		
		switch (field) {
			case 'email':
				validation = validateEmail(value);
				break;
			case 'password':
				validation = validatePassword(value);
				break;
			case 'confirmPassword':
				validation = validatePasswordConfirmation(password, value);
				break;
			case 'displayName':
				validation = validateDisplayName(value);
				break;
			default:
				return;
		}

		setFieldErrors(prev => ({
			...prev,
			[field]: validation.isValid ? '' : validation.error || ''
		}));
	};

	const handleEmailSignup = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		setSuccess("");
		setFieldErrors({});

		// Comprehensive validation
		const emailValidation = validateEmail(email);
		const passwordValidation = validatePassword(password);
		const confirmPasswordValidation = validatePasswordConfirmation(password, confirmPassword);
		const displayNameValidation = validateDisplayName(displayName);

		const errors: Record<string, string> = {};
		
		if (!emailValidation.isValid) errors.email = emailValidation.error!;
		if (!passwordValidation.isValid) errors.password = passwordValidation.error!;
		if (!confirmPasswordValidation.isValid) errors.confirmPassword = confirmPasswordValidation.error!;
		if (!displayNameValidation.isValid) errors.displayName = displayNameValidation.error!;
		
		if (Object.keys(errors).length > 0) {
			setFieldErrors(errors);
			setLoading(false);
			return;
		}

		const result = await auth.signUp({
			email,
			password,
			displayName
		});
		
		if (result.success) {
			// Check if user was created and is confirmed (email confirmation disabled)
			// or if user needs email confirmation
			if (result.user && result.user.email_confirmed_at) {
				setSuccess("Sign up successful! You can log in immediately.");
			} else {
				setSuccess("Sign up successful! Please check your email to confirm your account or disable email confirmation in Supabase dashboard.");
			}
			
			// Reset form
			setEmail("");
			setPassword("");
			setConfirmPassword("");
			setDisplayName("");
			
			// Redirect to login after 3 seconds
			setTimeout(() => {
				navigate("/login", { 
					state: { 
						message: result.user?.email_confirmed_at 
							? "Account created successfully. Please log in." 
							: "Account created successfully. If email confirmation is disabled, you can log in immediately."
					}
				});
			}, 3000);
		} else {
			setError(result.error || "Sign up failed");
		}
		
		setLoading(false);
	};

	// Get password strength for UI feedback
	const passwordStrength = password ? getPasswordStrength(password) : null;

	const handleGoogleSignup = async () => {
		setLoading(true);
		setError("");

		const result = await auth.signUpWithGoogle();
		
		if (!result.success) {
			setError(result.error || "Google sign up failed");
			setLoading(false);
		}
		// OAuth will redirect automatically, no need to handle success case
	};

	const handleGitHubSignup = async () => {
		setLoading(true);
		setError("");

		const result = await auth.signUpWithGitHub();
		
		if (!result.success) {
			setError(result.error || "GitHub sign up failed");
			setLoading(false);
		}
		// OAuth will redirect automatically, no need to handle success case
	};

	return (
		<Card className="relative overflow-hidden max-w-[400px] w-full">
			<ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
			<div className="w-full flex flex-col items-center justify-center gap-1 border-b pb-5">
				<h2 className="text-2xl font-bold">Sign Up</h2>
				<p className="text-sm text-center text-gray-700 dark:text-gray-400">
					Create a new account to get started
				</p>
			</div>
			<CardContent>
				<form onSubmit={handleEmailSignup}>
					<div className="grid gap-3">
						{error && (
							<div className="p-3 text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/20 dark:border-red-900 dark:text-red-400">
								{error}
							</div>
						)}
						{success && (
							<div className="p-3 text-[12px] text-green-600 bg-green-50 border border-green-200 rounded-md dark:bg-green-900/20 dark:border-green-900 dark:text-green-400">
								{success}
							</div>
						)}

						{/* Display Name Field */}
						<div className="grid gap-2">
							<Label htmlFor="displayName">Display Name</Label>
							<Input
								id="displayName"
								type="text"
								placeholder="Enter your display name"
								value={displayName}
								onChange={(e) => {
									setDisplayName(e.target.value);
									validateField('displayName', e.target.value);
								}}
								required
								disabled={loading}
								className={fieldErrors.displayName ? 'border-red-500' : ''}
							/>
							{fieldErrors.displayName && (
								<p className="text-[12px] text-red-500">{fieldErrors.displayName}</p>
							)}
						</div>

						{/* Email Field */}
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="name@example.com"
								value={email}
								onChange={(e) => {
									setEmail(e.target.value);
									validateField('email', e.target.value);
								}}
								required
								disabled={loading}
								className={fieldErrors.email ? 'border-red-500' : ''}
							/>
							{fieldErrors.email && (
								<p className="text-[12px] text-red-600">{fieldErrors.email}</p>
							)}
						</div>

						{/* Password Field with Strength Indicator */}
						<div className="grid gap-2">
							<Label htmlFor="password">Password</Label>
							<Input 
								id="password" 
								type="password" 
								placeholder="Enter password (at least 8 characters)"
								value={password}
								onChange={(e) => {
									setPassword(e.target.value);
									validateField('password', e.target.value);
								}}
								required 
								disabled={loading}
								className={fieldErrors.password ? 'border-red-500' : ''}
							/>
							{password && (
								<div className="flex items-center gap-2">
									<div className="flex-1 h-1 bg-gray-200 rounded">
										<div 
											className={`h-full rounded transition-all duration-300 ${
												passwordStrength === 'weak' ? 'w-1/3 bg-red-500' :
												passwordStrength === 'medium' ? 'w-2/3 bg-yellow-500' :
												'w-full bg-green-500'
											}`}
										/>
									</div>
									<span className={`text-xs ${
										passwordStrength === 'weak' ? 'text-red-600' :
										passwordStrength === 'medium' ? 'text-yellow-600' :
										'text-green-600'
									}`}>
										{passwordStrength === 'weak' ? 'Weak' :
										 passwordStrength === 'medium' ? 'Medium' : 'Strong'}
									</span>
								</div>
							)}
							{fieldErrors.password && (
								<p className="text-[12px] text-red-600">{fieldErrors.password}</p>
							)}
						</div>

						{/* Confirm Password Field */}
						<div className="grid gap-2">
							<Label htmlFor="confirmPassword">Confirm Password</Label>
							<Input
								id="confirmPassword"
								type="password"
								placeholder="Re-enter your password"
								value={confirmPassword}
								onChange={(e) => {
									setConfirmPassword(e.target.value);
									validateField('confirmPassword', e.target.value);
								}}
								required
								disabled={loading}
								className={fieldErrors.confirmPassword ? 'border-red-500' : ''}
							/>
							{fieldErrors.confirmPassword && (
								<p className="text-[12px] text-red-600">{fieldErrors.confirmPassword}</p>
							)}
						</div>

						<Button 
							type="submit" 
							className="w-full" 
							disabled={loading}
						>
							{loading ? "Creating account..." : "Create Account"}
						</Button>
					</div>
				</form>
			</CardContent>
			<CardFooter className="flex flex-col gap-3">
				<div className="relative w-full">
					<div className="absolute inset-0 flex items-center">
						<span className="w-full border-t" />
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="backdrop-blur-lg rounded-full px-2 text-muted-foreground border">
							Or continue with
						</span>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-2 w-full">
					<Button 
						variant="outline" 
						className="w-full" 
						onClick={handleGoogleSignup}
						disabled={loading}
						type="button"
					>
						<svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							/>
							<path
								fill="currentColor"
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							/>
							<path
								fill="currentColor"
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							/>
							<path
								fill="currentColor"
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							/>
						</svg>
						Google
					</Button>
					<Button 
						variant="outline" 
						className="w-full" 
						onClick={handleGitHubSignup}
						disabled={loading}
						type="button"
					>
						<svg
							className="mr-2 h-4 w-4"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
						</svg>
						GitHub
					</Button>
				</div>

				<p className="text-xs text-center text-muted-foreground">
					Already have an account?{" "}
					<button
						type="button"
						className="text-primary hover:underline"
						onClick={() => navigate("/login")}
					>
						Sign in
					</button>
				</p>
			</CardFooter>
		</Card>
	);
}
