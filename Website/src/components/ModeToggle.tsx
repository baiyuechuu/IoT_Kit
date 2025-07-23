import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/ThemeProvider";

export function ModeToggle() {
	const { setTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon" className="h-8 w-8 border-none">
					<Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
					<Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-neutral-950">
				<DropdownMenuItem onClick={() => setTheme("light")} className="hover:bg-gray-100 dark:hover:bg-gray-700/30">
					Light
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")} className="hover:bg-gray-100 dark:hover:bg-gray-700/30">
					Dark
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")} className="hover:bg-gray-100 dark:hover:bg-gray-700/30">
					System
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
