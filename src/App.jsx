import { useState } from "react";
import Timer from "./Timer";
import { TbBrandCucumber } from "react-icons/tb";

function CucumberoTimerLogo() {
	return (
		<div className="absolute bottom-2 right-2 flex text-emerald-950">
			<TbBrandCucumber size="24" />
			<h1 className="">Cucumbero Timer</h1>
		</div>
	);
}

function App() {
	return (
		<div className="flex h-screen w-screen items-center justify-center bg-emerald-100 bg-gradient-to-br from-emerald-200 to-emerald-100">
			<Timer />
			<CucumberoTimerLogo />
		</div>
	);
}

export default App;
