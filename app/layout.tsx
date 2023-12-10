import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts";
import SideNav from "./ui/dashboard/sidenav";
import "./ui/styles.scss";
import Providers from "./providers";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={`${inter.className} antialiased`}>
				<Providers>
					<div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
						<div className="w-full flex-none md:w-64">
							<SideNav />
						</div>
						<main className="flex-grow p-6 md:overflow-y-auto md:p-12">
							{children}
						</main>
					</div>
				</Providers>
			</body>
		</html>
	);
}
