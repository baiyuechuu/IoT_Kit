import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { ModeToggle } from "@/components/ModeToggle";

export default function MainLayout() {
	return (
		<div>
			<Navbar />
			<div className="flex-1 flex flex-col relative">
				<main className="flex-1 p-4 overflow-auto">
					<Outlet />
				</main>
				<div className="fixed bottom-3 right-3">
					<ModeToggle />
				</div>
			</div>
		</div>
	);
}
