import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
	const { user, loading, isAuthenticated, signOut } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!loading && !isAuthenticated) {
			navigate('/login');
		}
	}, [loading, isAuthenticated, navigate]);

	const handleLogout = async () => {
		await signOut();
		navigate('/login');
	};

	if (loading) {
		return (
			<div className="h-screen flex flex-col items-center justify-center">
				<div className="text-lg">Loading...</div>
			</div>
		);
	}

	if (!isAuthenticated || !user) {
		return null; // Will redirect to login
	}

	const getProviderName = (provider: string) => {
		switch (provider) {
			case 'google':
				return 'Google';
			case 'github':
				return 'GitHub';
			case 'email':
				return 'Email';
			default:
				return provider;
		}
	};

	return (
		<div className="min-h-screen bg-background p-8">
			<div className="max-w-4xl mx-auto">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold">Dashboard</h1>
					<Button onClick={handleLogout}>
						Sign Out
					</Button>
				</div>

				<div className="grid gap-6 md:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle>Welcome Back!</CardTitle>
							<CardDescription>
								Your account information
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<label className="text-sm font-medium text-muted-foreground">Email</label>
								<p className="text-sm font-mono bg-muted p-2 rounded">{user.email}</p>
							</div>
							<div>
								<label className="text-sm font-medium text-muted-foreground">Provider</label>
								<p className="text-sm">{getProviderName(user.app_metadata?.provider || 'email')}</p>
							</div>
							<div>
								<label className="text-sm font-medium text-muted-foreground">Account Status</label>
								<p className="text-sm">
									<span className="inline-flex items-center gap-1">
										<span className="w-2 h-2 bg-green-500 rounded-full"></span>
										Active
									</span>
								</p>
							</div>
							{user.user_metadata?.user_name && (
								<div>
									<label className="text-sm font-medium text-muted-foreground">Username</label>
									<p className="text-sm">{user.user_metadata.user_name}</p>
								</div>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Access Information</CardTitle>
							<CardDescription>
								Your account access details
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<label className="text-sm font-medium text-muted-foreground">Account Created</label>
								<p className="text-sm">
									{new Date(user.created_at).toLocaleDateString('en-US', {
										year: 'numeric',
										month: 'long',
										day: 'numeric',
										hour: '2-digit',
										minute: '2-digit'
									})}
								</p>
							</div>
							<div>
								<label className="text-sm font-medium text-muted-foreground">Last Sign In</label>
								<p className="text-sm">
									{user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('en-US', {
										year: 'numeric',
										month: 'long',
										day: 'numeric',
										hour: '2-digit',
										minute: '2-digit'
									}) : 'N/A'}
								</p>
							</div>
							<div>
								<label className="text-sm font-medium text-muted-foreground">Email Confirmed</label>
								<p className="text-sm">
									{user.email_confirmed_at ? 
										<span className="text-green-600">✓ Confirmed</span> : 
										<span className="text-yellow-600">⚠ Pending confirmation</span>
									}
								</p>
							</div>
						</CardContent>
					</Card>
				</div>

				<Card className="mt-6">
					<CardHeader>
						<CardTitle>IoT Kit Dashboard</CardTitle>
						<CardDescription>
							Welcome to your IoT Kit control panel
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground">
							This is your IoT Kit dashboard. Here you can manage your devices, view sensor data, 
							and control your IoT ecosystem.
						</p>
						<div className="mt-4 p-4 bg-muted rounded-lg">
							<p className="text-sm">
								🚀 <strong>Getting Started:</strong> Your account is now set up and ready to use. 
								Connect your IoT devices to start monitoring and controlling them from this dashboard.
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
