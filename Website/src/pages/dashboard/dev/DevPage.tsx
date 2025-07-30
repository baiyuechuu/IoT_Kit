import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
	Plus,
	Settings,
	Trash2,
	AlertCircle,
	Loader2,
	ArrowLeft,
	Cloud,
	CloudOff,
	DatabaseZap,
} from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainDashboard } from "./components/MainDashboard";
import { AddWidgetDialog } from "./components/AddWidgetDialog";
import { WidgetSettingsDialog } from "./components/WidgetSettingsDialog";
import { DashboardHeader } from "./components/DashboardHeader";
import { WIDGET_CONSTRAINTS } from "./components/widgets";
import type { WidgetConfig, WidgetType } from "./components/widgets";
import { useDashboard } from "@/hooks/useDashboard";
import { useAuth } from "@/hooks/useAuth";
import { dashboardService } from "@/lib/supabase/dashboard";
import type { Database } from "@/types/supabase";
import { useConfirmation } from "@/hooks/useConfirmation";
import { FirebaseConfigDialog } from "@/components/firebase/FirebaseConfigDialog";
import { useFirebaseConnection } from "@/hooks/useFirebase";
import { DashboardProvider, useDashboardContext } from "@/contexts/DashboardContext";

type Dashboard = Database["public"]["Tables"]["dashboards"]["Row"];

export default function DevPage() {
	const { dashboardId } = useParams<{ dashboardId: string }>();
	const navigate = useNavigate();
	const { isAuthenticated, loading: authLoading } = useAuth();
	const { confirm } = useConfirmation();
	const [dashboard, setDashboard] = useState<Dashboard | null>(null);
	const [dashboardLoading, setDashboardLoading] = useState(true);
	const [dashboardError, setDashboardError] = useState<string | null>(null);


	useEffect(() => {
		const loadDashboard = async () => {
			if (!isAuthenticated || !dashboardId) return;

			setDashboardLoading(true);
			setDashboardError(null);

			try {
				const { data, error } =
					await dashboardService.getDashboard(dashboardId);

				if (error) {
					setDashboardError(error);
				} else if (data) {
					setDashboard(data);
				} else {
					setDashboardError("Dashboard not found");
				}
			} catch (err) {
				setDashboardError(
					err instanceof Error ? err.message : "Failed to load dashboard",
				);
			} finally {
				setDashboardLoading(false);
			}
		};

		loadDashboard();
	}, [isAuthenticated, dashboardId]);

	if (authLoading || dashboardLoading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<Loader2 className="w-8 h-8 animate-spin text-primary" />
					<p className="text-muted-foreground">
						{authLoading ? "Authenticating..." : "Loading dashboard..."}
					</p>
				</div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="max-w-md mx-auto text-center p-6 bg-card rounded-lg border shadow-sm">
					<AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
					<h2 className="text-xl font-semibold mb-2">
						Authentication Required
					</h2>
					<p className="text-muted-foreground mb-4">
						You need to be signed in to access the dashboard.
					</p>
					<Button onClick={() => (window.location.href = "/auth")}>
						Sign In
					</Button>
				</div>
			</div>
		);
	}

	if (dashboardError) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="max-w-md mx-auto text-center p-6 bg-card rounded-lg border shadow-sm">
					<AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
					<h2 className="text-xl font-semibold mb-2">Error Loading Dashboard</h2>
					<p className="text-muted-foreground mb-4">{dashboardError}</p>
					<Button onClick={() => navigate("/dashboard")}>
						Back to Dashboards
					</Button>
				</div>
			</div>
		);
	}

	return (
		<DashboardProvider dashboardId={dashboardId}>
			<DashboardContent dashboard={dashboard} />
		</DashboardProvider>
	);
}

// Separate component for dashboard content that uses the context
function DashboardContent({ dashboard }: { dashboard: Dashboard | null }) {
	const { confirm } = useConfirmation();
	const {
		state,
		setEditMode,
		setShowAddDialog,
		setShowSettingsDialog,
		setShowFirebaseDialog,
		setSelectedWidget,
		openWidgetSettings,
		updateWidget,
		duplicateWidget,
		deleteWidget,
		updateWidgets,
		clearAllWidgets,
	} = useDashboardContext();

	const {
		widgets,
		editMode,
		gridWidth,
		showAddDialog,
		showSettingsDialog,
		showFirebaseDialog,
		selectedWidget,
		error: widgetError,
	} = state;

	const handleLayoutChange = useCallback(
		(updatedWidgets: WidgetConfig[]) => {
			updateWidgets(updatedWidgets);
		},
		[updateWidgets],
	);

	const { addWidget } = useDashboardContext();
	
	const handleAddWidget = useCallback(
		(type: WidgetType, props: Record<string, unknown>) => {
			addWidget(type, props);
		},
		[addWidget],
	);

	const handleWidgetSave = useCallback(
		(updatedWidget: WidgetConfig) => {
			updateWidget(updatedWidget);
		},
		[updateWidget],
	);

	const handleWidgetDuplicate = useCallback(
		(widget: WidgetConfig) => {
			duplicateWidget(widget);
		},
		[duplicateWidget],
	);

	const handleWidgetDelete = useCallback(
		(widgetId: string) => {
			deleteWidget(widgetId);
		},
		[deleteWidget],
	);

	const handleClearAll = useCallback(async () => {
		const confirmed = await confirm({
			title: "Clear All Widgets",
			message:
				"Are you sure you want to clear all widgets? This action cannot be undone.",
			confirmText: "Clear All",
			cancelText: "Cancel",
			variant: "destructive",
		});

		if (confirmed) {
			clearAllWidgets();
		}
	}, [clearAllWidgets, confirm]);

	return (
		<div className="min-h-screen bg-background">
			<DashboardHeader
				title={dashboard?.name || "Development Dashboard"}
				editMode={editMode}
				onEditModeChange={setEditMode}
				onShowAddDialog={() => setShowAddDialog(true)}
				onShowFirebaseDialog={() => setShowFirebaseDialog(true)}
				onClearAll={handleClearAll}
				saving={false}
				lastSaved={new Date()}
				widgetError={widgetError}
			/>

			<div className="container mx-auto px-4 py-6">
				<MainDashboard
					editMode={editMode}
					widgets={widgets}
					onLayoutChange={handleLayoutChange}
					onWidgetSettings={openWidgetSettings}
					onWidgetDuplicate={handleWidgetDuplicate}
					onWidgetDelete={handleWidgetDelete}
					onShowAddDialog={() => setShowAddDialog(true)}
					width={gridWidth}
					cols={12}
					rowHeight={60}
					margin={[10, 10]}
				/>
			</div>

			<AddWidgetDialog
				isOpen={showAddDialog}
				onClose={() => setShowAddDialog(false)}
				onAddWidget={handleAddWidget}
			/>

			<WidgetSettingsDialog
				isOpen={showSettingsDialog}
				widget={selectedWidget}
				onClose={() => {
					setShowSettingsDialog(false);
					setSelectedWidget(null);
				}}
				onSave={handleWidgetSave}
				onDelete={handleWidgetDelete}
				onDuplicate={handleWidgetDuplicate}
			/>

			<FirebaseConfigDialog
				open={showFirebaseDialog}
				onOpenChange={setShowFirebaseDialog}
			/>
		</div>
	);
}
