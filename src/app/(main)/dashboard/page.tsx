"use client";

import Loader from "@/components/custom/loader";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { color } from "motion/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

export default function Dashboard() {
	const [loading, setLoading] = useState(true);
	const [records, setRecords] = useState<any>(null);
	const [summary, setSummary] = useState<{
		averageTemperature: number;
		averageHumidity: number;
		averageMoisture: number;
		highestTemperature: number;
		lowestTemperature: number;
		highestHumidity: number;
		lowestHumidity: number;
		highestMoisture: number;
		lowestMoisture: number;
	}>({
		averageTemperature: 0,
		averageHumidity: 0,
		averageMoisture: 0,
		highestTemperature: 0,
		lowestTemperature: 0,
		highestHumidity: 0,
		lowestHumidity: 0,
		highestMoisture: 0,
		lowestMoisture: 0,
	});
	const today = new Date();
	const dayBefore30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
	const [startingDate, setStartingDate] = useState(dayBefore30Days);
	const [endingDate, setEndingDate] = useState(today);
	const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);

	useEffect(() => {
		setDeviceWidth(window.innerWidth);
		console.log(window.innerWidth);
		if (loading) {
			const token = localStorage.getItem("token");
			if (token) {
				// get the last record
				axios
					.get(
						"/api/record?startingDate=" +
							startingDate +
							"&endingDate=" +
							endingDate,
						{
							headers: {
								Authorization: `Bearer ${token}`,
							},
						}
					)
					.then((res: any) => {
						console.log(res);
						setRecords(res.data.records);
						setSummary(res.data.summary);
						setLoading(false);
					});
			} else {
				toast.error("You are not logged in");
				setLoading(false);
			}
		}
	}, [loading, window.innerWidth]);

	return (
		<div className="w-full h-full flex justify-center items-center flex-col">
			<div className="flex flex-col lg:flex-row gap-4 justify-center items-center">
				<Input
					type="date"
					value={startingDate.toISOString().split("T")[0]}
					onChange={(e) => setStartingDate(new Date(e.target.value))}
					className="w-[200px] h-[50px] border-accent-base text-white"
				/>
				<Input
					type="date"
					value={endingDate.toISOString().split("T")[0]}
					onChange={(e) => setEndingDate(new Date(e.target.value))}
					className="w-[200px] h-[50px] border-accent-base text-white"
				/>
				<button
					onClick={() => {
						setLoading(true);
					}}
					className="w-[100px] h-[50px] bg-accent-base text-white rounded-lg"
				>
					Load data
				</button>
			</div>
			{loading ? (
				<Loader />
			) : (
				<div className="w-full mt-4 backdrop-blur-3xl">
					<Tabs
						defaultValue="temperature"
						className="w-full h-[400px] flex justify-center items-center"
					>
						<TabsList>
							<TabsTrigger value="temperature">Temperature</TabsTrigger>
							<TabsTrigger value="humidity">Humidity</TabsTrigger>
							<TabsTrigger value="moisture">Moisture</TabsTrigger>
							<TabsTrigger value="summary">Summary</TabsTrigger>
						</TabsList>
						<TabsContent value="temperature" className="">
							<LineChart
								width={deviceWidth}
								height={250}
								data={records}
								margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
							>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis
									tick={{ fill: "#ffffff" }} 
									dataKey="time"
									tickFormatter={(value) =>
										new Date(value).toLocaleString("en-US", {
											day: "2-digit",
											month: "short",
											hour: "2-digit",
											minute: "2-digit",
										})
									}
								/>
								<YAxis />
								<Tooltip
									content={({ active, payload, label }) => {
										if (active && payload && payload.length) {
											const formattedDate = new Date(label).toLocaleString(
												"en-US",
												{
													day: "2-digit",
													month: "short",
													hour: "2-digit",
													minute: "2-digit",
												}
											);

											return (
												<div className="bg-white border rounded p-2 shadow-md text-sm">
													<p className="font-semibold">{formattedDate}</p>
													{payload.map((entry, index) => (
														<p
															key={index}
															className="text-[12px]"
															style={{ color: entry.color }}
														>
															{entry.name}: {entry.value}
														</p>
													))}
												</div>
											);
										}

										return null;
									}}
								/>
								<Legend />
								<Line type="monotone" dataKey="temperature" stroke="#8884d8" />
							</LineChart>
						</TabsContent>
						<TabsContent value="humidity">
							<LineChart
								width={deviceWidth}
								height={250}
								data={records}
								margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
							>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis
								tick={{ fill: "#ffffff" }} 
									dataKey="time"
									tickFormatter={(value) =>
										new Date(value).toLocaleString("en-US", {
											day: "2-digit",
											month: "short",
											hour: "2-digit",
											minute: "2-digit",
										})
									}
								/>
								<YAxis />
								<Tooltip
									content={({ active, payload, label }) => {
										if (active && payload && payload.length) {
											const formattedDate = new Date(label).toLocaleString(
												"en-US",
												{
													day: "2-digit",
													month: "short",
													hour: "2-digit",
													minute: "2-digit",
												}
											);

											return (
												<div className="bg-white border rounded p-2 shadow-md text-sm">
													<p className="font-semibold">{formattedDate}</p>
													{payload.map((entry, index) => (
														<p
															key={index}
															className="text-[12px]"
															style={{ color: entry.color }}
														>
															{entry.name}: {entry.value}
														</p>
													))}
												</div>
											);
										}

										return null;
									}}
								/>
								<Legend />
								<Line type="monotone" dataKey="humidity" stroke="#8884d8" />
							</LineChart>
						</TabsContent>
						<TabsContent value="moisture">
							<LineChart
								width={deviceWidth}
								height={250}
								data={records}
								margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
							>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis
								tick={{ fill: "#ffffff" }} 
									dataKey="time"
									tickFormatter={(value) =>
										new Date(value).toLocaleString("en-US", {
											day: "2-digit",
											month: "short",
											hour: "2-digit",
											minute: "2-digit",
										})
									}
								/>
								<YAxis />
								<Tooltip
									content={({ active, payload, label }) => {
										if (active && payload && payload.length) {
											const formattedDate = new Date(label).toLocaleString(
												"en-US",
												{
													day: "2-digit",
													month: "short",
													hour: "2-digit",
													minute: "2-digit",
												}
											);

											return (
												<div className="bg-white border rounded p-2 shadow-md text-sm">
													<p className="font-semibold">{formattedDate}</p>
													{payload.map((entry, index) => (
														<p
															key={index}
															className="text-[12px]"
															style={{ color: entry.color }}
														>
															{entry.name}: {entry.value}
														</p>
													))}
												</div>
											);
										}

										return null;
									}}
								/>
								<Legend />
								<Line type="monotone" dataKey="moisture" stroke="#8884d8" />
							</LineChart>
						</TabsContent>
						<TabsContent value="summary">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full p-4">
								<div className="border rounded-lg shadow p-4 bg-white">
									<h3 className="font-bold mb-2">Temperature (°C)</h3>
									<p>Average: {summary.averageTemperature.toFixed(2)}</p>
									<p>Highest: {summary.highestTemperature}°C</p>
									<p>Lowest: {summary.lowestTemperature}°C</p>
								</div>
								<div className="border rounded-lg shadow p-4 bg-white">
									<h3 className="font-bold mb-2">Humidity (%)</h3>
									<p>Average: {summary.averageHumidity.toFixed(2)}</p>
									<p>Highest: {summary.highestHumidity}%</p>
									<p>Lowest: {summary.lowestHumidity}%</p>
								</div>
								<div className="border rounded-lg shadow p-4 bg-white">
									<h3 className="font-bold mb-2">Moisture</h3>
									<p>Average: {summary.averageMoisture.toFixed(2)}</p>
									<p>Highest: {summary.highestMoisture} </p>
									<p>Lowest: {summary.lowestMoisture}</p>
								</div>
							</div>
						</TabsContent>
					</Tabs>
				</div>
			)}
		</div>
	);
}
