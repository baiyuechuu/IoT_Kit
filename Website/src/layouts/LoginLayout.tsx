import { Outlet } from "react-router-dom";
import { ModeToggle } from "@/components/ModeToggle";

export default function LoginLayout() {
	return (
		<div className="relative">
			<div className="absolute -top-20 -left-30 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 dark:from-blue-500/15 dark:to-purple-500/15 rounded-full blur-3xl z-0"></div>
			<div className="absolute top-1/2 right-10 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-rose-400/20 dark:from-pink-500/15 dark:to-rose-500/15 rounded-full blur-3xl z-0"></div>
			<div className="absolute bottom-10 left-1/4 w-72 h-72 bg-gradient-to-br from-cyan-400/20 to-teal-400/20 dark:from-cyan-500/15 dark:to-teal-500/15 rounded-full blur-3xl z-0"></div>
			<div className="absolute top-10 right-1/3 w-64 h-64 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 dark:from-indigo-500/15 dark:to-blue-500/15 rounded-full blur-3xl z-0"></div>
			<Outlet />
			<div className="fixed bottom-3 right-3">
				<ModeToggle />
			</div>
		</div>
	);
}
