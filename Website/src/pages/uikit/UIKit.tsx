import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/ModeToggle";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { ShineBorder } from "@/components/magicui/shine-border";
import { RiRadioButtonLine } from "react-icons/ri";
import { BiCard } from "react-icons/bi";
import { FiEdit3 } from "react-icons/fi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { HiSparkles } from "react-icons/hi2";
import type { ComponentSection } from "@/types";

export default function UIKit() {
	const [searchParams] = useSearchParams();
	const [activeSection, setActiveSection] = useState<string>("buttons");

	// Handle URL section parameter
	useEffect(() => {
		const sectionParam = searchParams.get('section');
		if (sectionParam) {
			setActiveSection(sectionParam);
		}
	}, [searchParams]);

	// Listen for custom section change events from search
	useEffect(() => {
		const handleSectionChange = (event: CustomEvent) => {
			setActiveSection(event.detail);
		};

		window.addEventListener('uikit-section-change', handleSectionChange as EventListener);
		return () => window.removeEventListener('uikit-section-change', handleSectionChange as EventListener);
	}, []);

	const componentSections: ComponentSection[] = [
		{
			id: "buttons",
			title: "Buttons",
			description: "Various button components with different styles and variants",
			icon: <RiRadioButtonLine className="w-5 h-5" />,
			component: (
				<div className="space-y-4">
					<div className="flex flex-wrap gap-3">
						<Button>Default</Button>
						<Button variant="destructive">Destructive</Button>
						<Button variant="outline">Outline</Button>
						<Button variant="secondary">Secondary</Button>
						<Button variant="ghost">Ghost</Button>
						<Button variant="link">Link</Button>
					</div>
					<div className="flex flex-wrap gap-3">
						<Button size="sm">Small</Button>
						<Button size="default">Default</Button>
						<Button size="lg">Large</Button>
						<Button size="icon">🎉</Button>
					</div>
					<div className="flex flex-wrap gap-3">
						<RainbowButton>Rainbow Button</RainbowButton>
						<RainbowButton variant="outline">Rainbow Outline</RainbowButton>
						<ShinyButton>Shiny Button</ShinyButton>
					</div>
				</div>
			),
		},
		{
			id: "cards",
			title: "Cards",
			description: "Card components for displaying content in containers",
			icon: <BiCard className="w-5 h-5" />,
			component: (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Card>
						<CardHeader>
							<CardTitle>Simple Card</CardTitle>
							<CardDescription>This is a basic card component</CardDescription>
						</CardHeader>
						<CardContent>
							<p>Card content goes here. You can put any content inside a card.</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Another Card</CardTitle>
							<CardDescription>With different content</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<Button className="w-full">Action Button</Button>
								<p className="text-sm text-muted-foreground">Additional information</p>
							</div>
						</CardContent>
					</Card>
				</div>
			),
		},
		{
			id: "inputs",
			title: "Form Inputs",
			description: "Input components for forms and user interaction",
			icon: <FiEdit3 className="w-5 h-5" />,
			component: (
				<div className="space-y-4 max-w-md">
					<div>
						<Label htmlFor="text-input">Text Input</Label>
						<Input id="text-input" placeholder="Enter text here..." />
					</div>
					<div>
						<Label htmlFor="email-input">Email Input</Label>
						<Input id="email-input" type="email" placeholder="email@example.com" />
					</div>
					<div>
						<Label htmlFor="password-input">Password Input</Label>
						<Input id="password-input" type="password" placeholder="••••••••" />
					</div>
					<div>
						<Label htmlFor="number-input">Number Input</Label>
						<Input id="number-input" type="number" placeholder="123" />
					</div>
				</div>
			),
		},
		{
			id: "dropdowns",
			title: "Dropdown Menus",
			description: "Dropdown components for navigation and selection",
			icon: <MdKeyboardArrowDown className="w-5 h-5" />,
			component: (
				<div className="flex gap-4">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline">Open Menu</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem>Profile</DropdownMenuItem>
							<DropdownMenuItem>Settings</DropdownMenuItem>
							<DropdownMenuItem>Logout</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<ModeToggle />
				</div>
			),
		},
		{
			id: "effects",
			title: "Magic Effects",
			description: "Special effect components with animations and styling",
			icon: <HiSparkles className="w-5 h-5" />,
			component: (
				<div className="space-y-6">
					<div className="relative">
						<ShineBorder className="relative overflow-hidden rounded-lg">
							<div className="p-6 bg-background">
								<h3 className="text-lg font-semibold mb-2">Shine Border Effect</h3>
								<p className="text-muted-foreground">
									This card has an animated border effect that creates a shining animation.
								</p>
							</div>
						</ShineBorder>
					</div>
					<div className="flex gap-4">
						<RainbowButton size="lg">Large Rainbow</RainbowButton>
						<ShinyButton className="px-8 py-3">Shiny Effect</ShinyButton>
					</div>
				</div>
			),
		},
	];

	const activeComponent = componentSections.find((section) => section.id === activeSection);

	return (
		<div className="min-h-screen bg-background">
			<div className="w-full">

				<div className="flex">
					{/* Sidebar - Icon only on small devices, full width on large */}
					<div className="w-16 lg:w-64 border-r border-border min-h-screen px-2 lg:px-4 py-20">
						<div className="sticky top-6">
							<h2 className="text-xl font-semibold mb-4 hidden lg:block">Components</h2>
							<div className="space-y-2">
								{componentSections.map((section) => (
									<button
										key={section.id}
										onClick={() => setActiveSection(section.id)}
										className={`w-full flex items-center justify-center lg:justify-start lg:text-left px-2 lg:px-3 py-2 rounded-md transition-colors ${
											activeSection === section.id
												? "bg-primary text-primary-foreground"
												: "hover:bg-muted"
										}`}
										title={section.title}
									>
										<span className="lg:mr-3">{section.icon}</span>
										<span className="hidden lg:inline">{section.title}</span>
									</button>
								))}
							</div>
						</div>
					</div>

					{/* Main Content */}
					<div className="flex-1 px-4 py-20">
						<div className="space-y-6">
							{activeComponent && (
								<>
									<div>
										<h2 className="text-2xl font-bold mb-2">{activeComponent.title}</h2>
										<p className="text-muted-foreground mb-6">{activeComponent.description}</p>
									</div>
									<div className="border rounded-lg p-6 bg-card">
										{activeComponent.component}
									</div>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
