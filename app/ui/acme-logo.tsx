import Image from "next/image";

export default function AcmeLogo() {
	return (
		<div className={`flex flex-row items-center leading-none text-white`}>
			<Image
				src={"/logo.png"}
				alt={`Wtheq Logo`}
				width={280}
				height={280}
				priority
			/>
		</div>
	);
}
