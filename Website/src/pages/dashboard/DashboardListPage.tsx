import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Calendar, Edit, Loader2, Plus, Settings, Trash2, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { dashboardService } from "@/lib/supabase/dashboard";
import type { Database } from "@/types/supabase";
import { useConfirmation } from "@/hooks/useConfirmation";

type Dashboard = Database['public']['Tables']['dashboards']['Row'];

export default function DashboardListPage() {
	const { isAuthenticated, loading: authLoading } = useAuth();
	const navigate = useNavigate();
	const { confirm } = useConfirmation();
	const [dashboards, setDashboards] = useState<Dashboard[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [creating, setCreating] = useState(false);
	const [deleting, setDeleting] = useState<string | null>(null);

	// Form state for creating new dashboard
	const [newDashboard, setNewDashboard] = useState({
		name: "",
		description: "",
		is_public: false
	});

	// Load dashboards
	const loadDashboards = useCallback(async () => {
		if (!isAuthenticated) return;

		setLoading(true);
		setError(null);

		try {
			const { data, error } = await dashboardService.getUserDashboards();
			if (error) {
				setError(error);
			} else {
				setDashboards(data || []);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An unexpected error occurred');
		} finally {
			setLoading(false);
		}
	}, [isAuthenticated]);

	useEffect(() => {
		loadDashboards();
	}, [loadDashboards]);

	// Create new dashboard
	const handleCreateDashboard = async () => {
		if (!newDashboard.name.trim()) return;

		setCreating(true);
		try {
			const { data, error } = await dashboardService.createDashboard({
				name: newDashboard.name.trim(),
				description: newDashboard.description.trim() || undefined,
				widgets: [],
				is_public: newDashboard.is_public
			});

			if (error) {
				setError(error);
			} else if (data) {
				setDashboards(prev => [data, ...prev]);
				setShowCreateForm(false);
				setNewDashboard({ name: "", description: "", is_public: false });
				// Navigate to the new dashboard
				navigate(`/dashboard/${data.id}`);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to create dashboard');
		} finally {
			setCreating(false);
		}
	};

	// Delete dashboard
	const handleDeleteDashboard = async (dashboardId: string, dashboardName: string) => {
		const confirmed = await confirm({
			title: "Delete Dashboard",
			message: `Are you sure you want to delete "${dashboardName}"? This action cannot be undone.`,
			confirmText: "Delete",
			cancelText: "Cancel",
			variant: "destructive"
		});

		if (!confirmed) {
			return;
		}

		setDeleting(dashboardId);
		try {
			const { error } = await dashboardService.deleteDashboard(dashboardId);
			if (error) {
				setError(error);
			} else {
				setDashboards(prev => prev.filter(d => d.id !== dashboardId));
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to delete dashboard');
		} finally {
			setDeleting(null);
		}
	};

	// Format date
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	// Loading state
	if (authLoading || loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<Loader2 className="w-8 h-8 animate-spin text-primary" />
					<p className="text-muted-foreground">
						{authLoading ? "Authenticating..." : "Loading dashboards..."}
					</p>
				</div>
			</div>
		);
	}

	// Authentication required
	if (!isAuthenticated) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
				<div className="max-w-md mx-auto text-center p-6 bg-card rounded-lg border shadow-sm">
					<AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
					<h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
					<p className="text-muted-foreground mb-4">
						You need to be signed in to access your dashboards.
					</p>
					<Button onClick={() => window.location.href = '/auth'}>
						Sign In
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
			<div className="max-w-7xl mx-auto px-4 py-20">
				{/* Header */}
				<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
					<div>
						<h1 className="text-3xl font-bold text-primary mb-2">
							My Dashboards
						</h1>
						<p className="text-muted-foreground">
							Create and manage your IoT dashboards
						</p>
					</div>
					<Button 
						size="lg" 
						className="gap-2"
						onClick={() => setShowCreateForm(true)}
					>
						<Plus className="w-4 h-4" />
						Create Dashboard
					</Button>
				</div>

				{/* Create form */}
				{showCreateForm && (
					<Card className="mb-8">
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle>Create New Dashboard</CardTitle>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => {
										setShowCreateForm(false);
										setNewDashboard({ name: "", description: "", is_public: false });
									}}
								>
									<X className="w-4 h-4" />
								</Button>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<Label htmlFor="dashboard-name">Dashboard Name</Label>
								<Input
									id="dashboard-name"
									placeholder="My IoT Dashboard"
									value={newDashboard.name}
									onChange={(e) => setNewDashboard(prev => ({ ...prev, name: e.target.value }))}
								/>
							</div>
							<div>
								<Label htmlFor="dashboard-description">Description (Optional)</Label>
								<Textarea
									id="dashboard-description"
									placeholder="Describe what this dashboard is for..."
									value={newDashboard.description}
									onChange={(e) => setNewDashboard(prev => ({ ...prev, description: e.target.value }))}
									rows={3}
								/>
							</div>
						</CardContent>
						<CardFooter className="flex justify-end gap-2">
							<Button
								variant="outline"
								onClick={() => {
									setShowCreateForm(false);
									setNewDashboard({ name: "", description: "", is_public: false });
								}}
								disabled={creating}
							>
								Cancel
							</Button>
							<Button
								onClick={handleCreateDashboard}
								disabled={creating || !newDashboard.name.trim()}
							>
								{creating && <Loader2 className="w-3 h-3 animate-spin mr-2" />}
								Create Dashboard
							</Button>
						</CardFooter>
					</Card>
				)}

				{/* Error display */}
				{error && (
					<div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center justify-between">
						<div className="flex items-center gap-2">
							<AlertCircle className="w-4 h-4 text-destructive" />
							<span className="text-sm text-destructive">{error}</span>
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setError(null)}
							className="text-destructive hover:text-destructive"
						>
							Dismiss
						</Button>
					</div>
				)}

				{/* Dashboards grid */}
				{dashboards.length === 0 ? (
					<div className="text-center py-12">
						<div className="max-w-md mx-auto">
							<Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
							<h3 className="text-xl font-semibold mb-2">No Dashboards Yet</h3>
							<p className="text-muted-foreground mb-6">
								Create your first dashboard to start monitoring and controlling your IoT devices.
							</p>
							<Button onClick={() => setShowCreateForm(true)} size="lg" className="gap-2">
								<Plus className="w-4 h-4" />
								Create Your First Dashboard
							</Button>
						</div>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{dashboards.map((dashboard) => (
							<Card key={dashboard.id} className="hover:shadow-lg transition-shadow">
								<CardHeader>
									<CardTitle className="flex items-start justify-between">
										<span className="line-clamp-1">{dashboard.name}</span>
										{dashboard.is_public && (
											<span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
												Public
											</span>
										)}
									</CardTitle>
									<CardDescription className="line-clamp-2">
										{dashboard.description || "No description provided"}
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-2 text-sm text-muted-foreground">
										<div className="flex items-center gap-2">
											<Calendar className="w-3 h-3" />
											<span>Updated {formatDate(dashboard.updated_at)}</span>
										</div>
										<div className="flex items-center gap-2">
											<Settings className="w-3 h-3" />
											<span>{Array.isArray(dashboard.widgets) ? dashboard.widgets.length : 0} widgets</span>
										</div>
									</div>
								</CardContent>
								<CardFooter className="flex gap-2">
									<Button
										variant="default"
										size="sm"
										onClick={() => navigate(`/dashboard/${dashboard.id}`)}
										className="flex-1 gap-1"
									>
										<Edit className="w-3 h-3" />
										Edit
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleDeleteDashboard(dashboard.id, dashboard.name)}
										disabled={deleting === dashboard.id}
										className="gap-1"
									>
										{deleting === dashboard.id ? (
											<Loader2 className="w-3 h-3 animate-spin" />
										) : (
											<Trash2 className="w-3 h-3" />
										)}
									</Button>
								</CardFooter>
							</Card>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

