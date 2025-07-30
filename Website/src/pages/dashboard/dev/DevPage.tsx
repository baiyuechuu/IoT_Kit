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
import { WIDGET_CONSTRAINTS } from "./components/widgets";
import type { WidgetConfig, WidgetType } from "./components/widgets";
import { useDashboard } from "@/hooks/useDashboard";
import { useAuth } from "@/hooks/useAuth";
import { dashboardService } from "@/lib/supabase/dashboard";
import type { Database } from "@/types/supabase";
import { useConfirmation } from "@/hooks/useConfirmation";
import { FirebaseConfigDialog } from "@/components/firebase/FirebaseConfigDialog";
import { useFirebaseConnection } from "@/hooks/useFirebase";

type Dashboard = Database["public"]["Tables"]["dashboards"]["Row"];

export default function DevPage() {
	const { dashboardId } = useParams<{ dashboardId: string }>();
	const navigate = useNavigate();
	const { isAuthenticated, loading: authLoading } = useAuth();
	const { confirm } = useConfirmation();
	const [dashboard, setDashboard] = useState<Dashboard | null>(null);
	const [dashboardLoading, setDashboardLoading] = useState(true);
	const [dashboardError, setDashboardError] = useState<string | null>(null);

	const {
		widgets,
		loading: widgetsLoading,
		saving,
		error: widgetError,
		lastSaved,
		updateWidgets,
		clearError,
		isReady,
	} = useDashboard({
		dashboardId: dashboardId,
		autoSave: true,
		autoSaveDelay: 1000,
	});

	const [editMode, setEditMode] = useState(false);
	const [showAddDialog, setShowAddDialog] = useState(false);
	const [showSettingsDialog, setShowSettingsDialog] = useState(false);
	const [selectedWidget, setSelectedWidget] = useState<WidgetConfig | null>(
		null,
	);
	const [gridWidth, setGridWidth] = useState(1200);
	const [isDesktop, setIsDesktop] = useState(true);
	const [showFirebaseDialog, setShowFirebaseDialog] = useState(false);
	const { connected: firebaseConnected, configured: firebaseConfigured } = useFirebaseConnection();

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

	useEffect(() => {
		const updateSizing = () => {
			const windowWidth = window.innerWidth;
			const paddingOffset = 64; 
			setGridWidth(windowWidth - paddingOffset);

			setIsDesktop(windowWidth > 1080);
		};

		updateSizing();
		window.addEventListener("resize", updateSizing);
		return () => window.removeEventListener("resize", updateSizing);
	}, [editMode]); 

	const handleLayoutChange = useCallback(
		(updatedWidgets: WidgetConfig[]) => {
			updateWidgets(updatedWidgets);
		},
		[updateWidgets],
	);

	const handleAddWidget = useCallback(
		(type: WidgetType, props: Record<string, unknown>) => {
			const constraints = WIDGET_CONSTRAINTS[type];
			const newWidget: WidgetConfig = {
				i: `${type}-${Date.now()}`,
				type,
				x: 0,
				y: 0,
				w: constraints.minW,
				h: constraints.minH,
				props,
			};

			const existingPositions = widgets.map((w) => ({
				x: w.x,
				y: w.y,
				w: w.w,
				h: w.h,
			}));

			let bestX = 0;
			let bestY = 0;
			let found = false;

			for (let y = 0; y < 20 && !found; y++) {
				for (let x = 0; x <= 12 - newWidget.w && !found; x++) {
					const hasCollision = existingPositions.some((pos) => {
						return !(
							x >= pos.x + pos.w ||
							x + newWidget.w <= pos.x ||
							y >= pos.y + pos.h ||
							y + newWidget.h <= pos.y
						);
					});

					if (!hasCollision) {
						bestX = x;
						bestY = y;
						found = true;
					}
				}
			}

			newWidget.x = bestX;
			newWidget.y = bestY;

			const updatedWidgets = [...widgets, newWidget];
			updateWidgets(updatedWidgets);
		},
		[widgets, updateWidgets],
	);

	const handleWidgetSettings = useCallback(
		(widgetId: string) => {
			const widget = widgets.find((w) => w.i === widgetId);
			if (widget) {
				setSelectedWidget(widget);
				setShowSettingsDialog(true);
			}
		},
		[widgets],
	);

	const handleWidgetSave = useCallback(
		(updatedWidget: WidgetConfig) => {
			const updatedWidgets = widgets.map((w) =>
				w.i === updatedWidget.i ? updatedWidget : w,
			);
			updateWidgets(updatedWidgets);
		},
		[widgets, updateWidgets],
	);

	const handleWidgetDuplicate = useCallback(
		(widget: WidgetConfig) => {
			const newWidget: WidgetConfig = {
				...widget,
				i: `${widget.type}-${Date.now()}`,
				x: Math.min(widget.x + 1, 12 - widget.w),
				y: widget.y + 1,
			};
			const updatedWidgets = [...widgets, newWidget];
			updateWidgets(updatedWidgets);
		},
		[widgets, updateWidgets],
	);

	const handleWidgetDelete = useCallback(
		(widgetId: string) => {
			const updatedWidgets = widgets.filter((w) => w.i !== widgetId);
			updateWidgets(updatedWidgets);
		},
		[widgets, updateWidgets],
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
			updateWidgets([]);
		}
	}, [updateWidgets, confirm]);

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
			<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
				<div className="max-w-md mx-auto text-center p-6 bg-card rounded-lg border shadow-sm">
					<AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
					<h2 className="text-xl font-semibold mb-2">Dashboard Error</h2>
					<p className="text-muted-foreground mb-4">{dashboardError}</p>
					<div className="flex gap-2 justify-center">
						<Button variant="outline" onClick={() => navigate("/dashboard")}>
							Back to Dashboards
						</Button>
						<Button onClick={() => window.location.reload()}>Retry</Button>
					</div>
				</div>
			</div>
		);
	}

	if (!dashboard) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="max-w-md mx-auto text-center p-6 bg-card rounded-lg border shadow-sm">
					<AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
					<h2 className="text-xl font-semibold mb-2">Dashboard Not Found</h2>
					<p className="text-muted-foreground mb-4">
						The requested dashboard could not be found or you don't have access
						to it.
					</p>
					<Button onClick={() => navigate("/dashboard")}>
						Back to Dashboards
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="w-full mx-auto px-8 flex flex-col">
				<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 mb-6 pt-20">
					<div className="flex-1">
						<div className="flex items-center gap-3">
							<Button
								variant="ghost"
								onClick={() => navigate("/dashboard")}
								className="hover:text-foreground flex items-center justify-center"
							>
								<ArrowLeft className="w-9 h-9" />
							</Button>
							<h1 className="text-2xl text-primary">{dashboard.name}</h1>
							<div className="flex items-center gap-2 mt-1">
								{saving ? (
									<div className="flex items-center gap-1 text-sm text-blue-500">
										<Loader2 className="w-6 h-6 animate-spin" />
									</div>
								) : lastSaved ? (
									<div className="flex items-center gap-1 text-sm text-green-500">
										<Cloud className="w-6 h-6" />
									</div>
								) : (
									<div className="flex items-center gap-1 text-sm text-muted-foreground">
										<CloudOff className="w-6 h-6" />
									</div>
								)}
							</div>
						</div>
					</div>
					<div className="flex max-md:flex-col gap-3 sm:gap-4 min-md:items-center">
						<div className="flex items-center gap-2">
							<Switch
								id="edit-mode"
								checked={editMode}
								onCheckedChange={setEditMode}
								disabled={!isReady || widgetsLoading}
							/>
							<label htmlFor="edit-mode" className="text-sm font-medium">
								{editMode ? "Edit Mode" : "View Mode"}
							</label>
						</div>
						<div className="flex gap-2 sm:gap-3">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setShowAddDialog(true)}
								disabled={!editMode || !isDesktop || !isReady || widgetsLoading}
								className="text-xs sm:text-sm"
							>
								<Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
								<span className="hidden sm:inline">Add Widget</span>
								<span className="sm:hidden">Add</span>
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={handleClearAll}
								disabled={
									!editMode ||
									!isDesktop ||
									widgets.length === 0 ||
									!isReady ||
									widgetsLoading
								}
								className="text-xs sm:text-sm"
							>
								<Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
								<span className="hidden sm:inline">Clear All</span>
								<span className="sm:hidden">Clear</span>
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setShowFirebaseDialog(true)}
								className="text-xs sm:text-sm"
								disabled={!isReady || widgetsLoading}
							>
								<DatabaseZap className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 ${
									firebaseConnected ? 'text-green-500' : 
									firebaseConfigured ? 'text-orange-500' : 
									'text-muted-foreground'
								}`} />
								<span className="hidden sm:inline">Firebase</span>
								<span className="sm:hidden">DB</span>
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="text-xs sm:text-sm"
								disabled={!isReady || widgetsLoading}
							>
								<Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
								<span className="hidden sm:inline">Settings</span>
								<span className="sm:hidden">Settings</span>
							</Button>
						</div>
						{editMode && !isDesktop && (
							<div className="flex items-center gap-2 mt-2 p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
								<span className="text-sm text-orange-700">
									Edit mode features are only available on desktop
								</span>
							</div>
						)}
					</div>
				</div>

				{widgetError && (
					<div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center justify-between">
						<div className="flex items-center gap-2">
							<AlertCircle className="w-4 h-4 text-destructive" />
							<span className="text-sm text-destructive">{widgetError}</span>
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={clearError}
							className="text-destructive hover:text-destructive"
						>
							Dismiss
						</Button>
					</div>
				)}

				<div className="w-full border border-border rounded-[20px]">
					<div className="transition-all duration-200">
						<MainDashboard
							editMode={editMode && isDesktop}
							widgets={widgets}
							onLayoutChange={handleLayoutChange}
							onWidgetSettings={handleWidgetSettings}
							onWidgetDuplicate={handleWidgetDuplicate}
							onWidgetDelete={handleWidgetDelete}
							onShowAddDialog={() => setShowAddDialog(true)}
							width={gridWidth}
							cols={12}
							rowHeight={60}
							margin={[10, 10]}
						/>
					</div>
				</div>
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
