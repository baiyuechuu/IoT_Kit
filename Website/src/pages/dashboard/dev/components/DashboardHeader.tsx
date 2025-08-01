import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
	Plus,
	Settings,
	Trash2,
	ArrowLeft,
	Cloud,
	CloudOff,
	DatabaseZap,
	Loader2,
	AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFirebaseConnection } from "@/hooks/useFirebase";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface DashboardHeaderProps {
	title: string;
	editMode: boolean;
	onEditModeChange: (editMode: boolean) => void;
	onShowAddDialog: () => void;
	onShowFirebaseDialog: () => void;
	onClearAll: () => void;
	saving: boolean;
	lastSaved: Date | null;
	widgetError: string | null;
}

export function DashboardHeader({
	title,
	editMode,
	onEditModeChange,
	onShowAddDialog,
	onShowFirebaseDialog,
	onClearAll,
	saving,
	lastSaved,
	widgetError,
}: DashboardHeaderProps) {
	const navigate = useNavigate();
	const { connected: firebaseConnected, configured: firebaseConfigured } = useFirebaseConnection();

	return (
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
						<h1 className="text-2xl text-primary">{title}</h1>
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
							onCheckedChange={onEditModeChange}
						/>
						<label htmlFor="edit-mode" className="text-sm font-medium">
							{editMode ? "Edit Mode" : "View Mode"}
						</label>
					</div>
					<div className="flex gap-2 sm:gap-3">
						<Button
							variant="outline"
							size="sm"
							onClick={onShowAddDialog}
							disabled={!editMode}
							className="text-xs sm:text-sm"
						>
							<Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
							<span className="hidden sm:inline">Add Widget</span>
							<span className="sm:hidden">Add</span>
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={onClearAll}
							disabled={!editMode}
							className="text-xs sm:text-sm"
						>
							<Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
							<span className="hidden sm:inline">Clear All</span>
							<span className="sm:hidden">Clear</span>
						</Button>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										onClick={onShowFirebaseDialog}
										className="text-xs sm:text-sm"
									>
										<DatabaseZap className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 ${
											firebaseConnected ? 'text-green-500' : 
											firebaseConfigured ? 'text-orange-500' : 
											'text-muted-foreground'
										}`} />
										<span className="hidden sm:inline">Firebase</span>
										<span className="sm:hidden">DB</span>
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>
										{firebaseConnected 
											? 'Firebase: Connected and ready for real-time data'
											: firebaseConfigured 
												? 'Firebase: Configured but not connected'
												: 'Firebase: Not configured - click to set up'
										}
									</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						<Button
							variant="outline"
							size="sm"
							className="text-xs sm:text-sm"
						>
							<Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
							<span className="hidden sm:inline">Settings</span>
							<span className="sm:hidden">Settings</span>
						</Button>
					</div>
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
						className="text-destructive hover:text-destructive"
					>
						Dismiss
					</Button>
				</div>
			)}
		</div>
	);
}
