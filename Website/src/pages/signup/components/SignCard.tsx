import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShineBorder } from "@/components/magicui/shine-border";

export function SignCard() {
	return (
		<Card className="relative overflow-hidden max-w-[350px] w-full">
			<ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
			<CardHeader>
				<CardTitle>Sign Up</CardTitle>
				<CardDescription>
					Please fill in the form below to create an account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form>
					<div className="grid gap-4">
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input id="email" type="email" placeholder="name@example.com" />
						</div>
						<div className="grid gap-2">
							<Label htmlFor="password">Password</Label>
							<Input id="password" type="password" />
						</div>
					</div>
				</form>
			</CardContent>
			<CardFooter>
				<Button className="w-full">Register</Button>
			</CardFooter>
		</Card>
	);
}
