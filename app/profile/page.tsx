import * as React from "react";
import Image from "next/image";
import { getUser } from "../lib/data";

interface ICustomersProps {}

const Customers: React.FunctionComponent<ICustomersProps> = async (props) => {
	const user = await getUser();

	return (
		<div className="bg-white shadow-md rounded px-8 py-6 mt-4">
			<div className="text-center">
				<Image
					src={"https://i.pravatar.cc/300"}
					alt="User Avatar"
					className="w-32 h-32 mx-auto rounded-full"
					width={"300"}
					height={"300"}
				/>
			</div>
			<div className="mt-4 text-center">
				<p className="text-xl font-semibold">Name: {user.name}</p>
				<p className="text-gray-500">{user.gender}</p>
				<p className="text-gray-500">DOB: {user.dob}</p>
			</div>
		</div>
	);
};

export default Customers;
