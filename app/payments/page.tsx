"use client";
import {
	KeyIcon,
	CalendarDaysIcon,
	UserIcon,
	CreditCardIcon,
	ArrowRightIcon,
} from "@heroicons/react/24/outline";
import * as React from "react";
import Cards, { ReactCreditCardsProps, Focused } from "./credit-card/index";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { convertDateFormat, sleep } from "../lib/utils";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const cardDetailsSchema = z.object({
	name: z
		.string()
		.min(2, { message: "Name should be at least 2 characters long" }),
	cvc: z.string().refine((cvc) => /^[0-9]{3,4}$/.test(cvc), {
		message: "CVC should be a 3 or 4-digit number",
	}),
	expiry: z.string().min(1, { message: "Expiry date is required" }),
	number: z.string().refine((number) => /^[0-9\s]+$/.test(number), {
		message: "Card number should only contain numbers and spaces",
	}),
});

type CardData = Pick<
	ReactCreditCardsProps,
	"name" | "cvc" | "expiry" | "number" | "focused"
>;

const Payments: React.FunctionComponent = () => {
	const [state, setState] = React.useState<CardData>({
		number: "",
		expiry: "",
		cvc: "",
		name: "",
		focused: "",
	});
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<CardData>({
		resolver: zodResolver(cardDetailsSchema),
	});
	const addPayment = useMutation<CardData, any, any>({
		mutationFn: async () => {
			await sleep(2000);
			return axios.post("/api/payments");
		},
	});

	// Update state when form values change
	// Watch form field values
	const subscription = watch((value, { name, type }) => {
		// Handle form value changes
		if (name) {
			setState((prevState) => ({
				...prevState,
				[name]:
					name == "expiry"
						? convertDateFormat(value[name] as string)
						: value[name],
			}));
		}
	});

	// Cleanup subscription on unmount
	React.useEffect(() => {
		return () => subscription.unsubscribe();
	}, [subscription]);

	const onSubmit: SubmitHandler<CardData> = (data) => {
		addPayment.mutate(data, {
			onError: () => toast.error("Error In Network, Please Try Again"),
			onSuccess: () => toast.success("Success Payment, Thanks"),
		});
	};

	const handleInputFocus = (evt: React.FocusEvent<HTMLInputElement>) => {
		setState((prev) => ({ ...prev, focused: evt.target.name as Focused }));
	};

	return (
		<div className="bg-gray-200 h-full p-[2rem]">
			<div>
				<Toaster />
			</div>
			<div className="flex flex-col gap-4 lg:flex-row">
				<div className="flex sm:order-2 lg:order-1 space-x-4 basis-6/12">
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex-grow-1 w-[100%]"
					>
						<div>
							<label
								className="mb-3 mt-5 block text-xs font-medium text-gray-900"
								htmlFor="CardNumber"
							>
								Card Number
							</label>
							<div className="relative">
								<input
									className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
									id="CardNumber"
									type="number"
									placeholder="Card Number"
									onFocus={handleInputFocus}
									{...register("number")}
								/>
								<CreditCardIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
							</div>
							{errors.number && (
								<div
									className="mt-1 text-sm text-red-600 rounded-lg"
									role="alert"
								>
									{errors.number?.message}
								</div>
							)}
						</div>
						<div className="mt-4">
							<label
								className="mb-3 mt-5 block text-xs font-medium text-gray-900"
								htmlFor="ExpiryDate"
							>
								Expiry Date
							</label>
							<div className="relative">
								<input
									className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
									id="ExpiryDate"
									type="month"
									min="yyyy-MM"
									max="yyyy-MM"
									placeholder="Expiry Date"
									onFocus={handleInputFocus}
									{...register("expiry")}
								/>
								<CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
							</div>
							{errors.expiry && (
								<div
									className="mt-1 text-sm text-red-600 rounded-lg"
									role="alert"
								>
									{errors.expiry?.message}
								</div>
							)}
						</div>

						<div className="mt-4">
							<label
								className="mb-3 mt-5 block text-xs font-medium text-gray-900"
								htmlFor="CardHolderName"
							>
								Card Holder Name
							</label>
							<div className="relative">
								<input
									className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
									id="CardHolderName"
									onFocus={handleInputFocus}
									placeholder="Enter Card Holder Name"
									{...register("name")}
								/>
								<UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
							</div>
							{errors.name && (
								<div
									className="mt-1 text-sm text-red-600 rounded-lg"
									role="alert"
								>
									{errors.name?.message}
								</div>
							)}
						</div>

						<div className="mt-4">
							<label
								className="mb-3 mt-5 block text-xs font-medium text-gray-900"
								htmlFor="CVV"
							>
								CVV
							</label>
							<div className="relative">
								<input
									className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
									id="CVV"
									type="number"
									{...register("cvc")}
									onFocus={handleInputFocus}
									placeholder="Enter CVV"
								/>
								<KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
							</div>
							{errors.cvc && (
								<div
									className="mt-1 text-sm text-red-600 rounded-lg"
									role="alert"
								>
									{errors.cvc?.message}
								</div>
							)}
						</div>
						<Button type="submit" className="mt-9 w-full">
							{addPayment.isPending ? "Loading..." : "Make Payment"}
							<ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
						</Button>
					</form>
				</div>
				<div className="flex sm:order-1 lg:order-2 self-center basis-6/12 flex-grow-1">
					<Cards
						number={state.number}
						expiry={state.expiry}
						cvc={state.cvc}
						name={state.name}
						focused={state.focused}
					/>
				</div>
			</div>
		</div>
	);
};

export default Payments;
