import { useState } from "react";
import Timer from "./Timer";

function App() {
	return (
		<div className="flex h-screen w-screen items-center justify-center bg-emerald-100 bg-gradient-to-br from-emerald-200 to-emerald-100">
			<Timer />
		</div>
	);
}

export default App;
