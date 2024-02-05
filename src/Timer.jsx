import { useState } from "react";
import { HiArrowPath, HiMinus, HiPlayPause, HiPlus } from "react-icons/hi2";

function Timer() {
	const [breakLength, setBreakLength] = useState(5);
	const [sessionLength, setSessionLength] = useState(25);
	const [timer, setTimer] = useState(1500);
	const [currentAction, setCurrentAction] = useState("Start Session");

	const changeLength = function (whichLength, plusOrMinus) {
		if (whichLength === "break") {
			if (plusOrMinus === "+") {
				if (breakLength <= 59) {
					setBreakLength(breakLength + 1);
				}
			}
			if (plusOrMinus === "-") {
				if (breakLength >= 2) {
					setBreakLength(breakLength - 1);
				}
			}
		}

		if (whichLength === "session") {
			if (plusOrMinus === "+") {
				if (sessionLength <= 59) {
					setSessionLength(sessionLength + 1);
					if (currentAction === "Start Session") {
						setTimer((sessionLength + 1) * 60);
					}
				}
			}
			if (plusOrMinus === "-") {
				if (sessionLength >= 2) {
					setSessionLength(sessionLength - 1);
					if (currentAction === "Start Session") {
						setTimer((sessionLength - 1) * 60);
					}
				}
			}
		}
	};

	const playPause = function () {
		if (currentAction === "Start Session") {
			setCurrentAction("Session in Progress");
		}
		if (currentAction === "Session in Progress") {
			setCurrentAction("Session Paused");
		}
		if (currentAction === "Session Paused") {
			setCurrentAction("Session in Progress");
		}
		if (currentAction === "Break in Progress") {
			setCurrentAction("Break Paused");
		}
		if (currentAction === "Break Paused") {
			setCurrentAction("Break in Progress");
		}
	};

	const resetApp = function () {
		setBreakLength(5);
		setSessionLength(25);
		setTimer(1500);
		setCurrentAction("Start Session");
	};

	return (
		<div className="flex h-96 w-80 flex-wrap items-center justify-center rounded-2xl border-2 border-emerald-900 bg-emerald-50 text-emerald-900">
			<div id="timer-controls" className="w-full justify-center p-8">
				<h1 id="timer-label" className="font-bold">
					{currentAction}
				</h1>
				<div
					id="time-left"
					className="font-Digital w-32 bg-emerald-950 p-4 text-center text-3xl text-emerald-500"
				>
					{Math.floor(timer / 60)}:
					{(timer % 60).toLocaleString(undefined, {
						minimumIntegerDigits: 2,
					})}
				</div>
				<button
					id="reset"
					className="rounded-xl border border-red-700 bg-red-500 p-2"
					title="Reset the app"
					onClick={resetApp}
				>
					<HiArrowPath size="24" />
				</button>
				<button
					id="start_stop"
					className="rounded-xl border border-emerald-700 bg-emerald-500 p-2"
					title="Start/Stop the Timer"
					onClick={playPause}
				>
					<HiPlayPause size="24" />
				</button>
			</div>
			<div id="break-controls" className="p-4">
				<h2 id="break-label" className="font-bold">
					Break Length
				</h2>
				<div id="break-length">{breakLength}</div>
				<button
					id="break-decrement"
					className="rounded-xl border border-emerald-700 bg-emerald-500 p-2"
					onClick={() => changeLength("break", "-")}
					title="Decrease Break Length"
					disabled={currentAction !== "Start Session"}
				>
					<HiMinus size="24" />
				</button>
				<button
					id="break-increment"
					className="rounded-xl border border-emerald-700 bg-emerald-500 p-2"
					onClick={() => changeLength("break", "+")}
					title="Increase Break Length"
					disabled={currentAction !== "Start Session"}
				>
					<HiPlus size="24" />
				</button>
			</div>
			<div id="session-controls" className="p-4">
				<h2 id="session-label" className="font-bold">
					Session Length
				</h2>
				<div id="session-length">{sessionLength}</div>
				<button
					id="session-decrement"
					className="rounded-xl border border-emerald-700 bg-emerald-500 p-2"
					onClick={() => changeLength("session", "-")}
					title="Decrease Session Length"
					disabled={currentAction !== "Start Session"}
				>
					<HiMinus size="24" />
				</button>
				<button
					id="session-increment"
					className="rounded-xl border border-emerald-700 bg-emerald-500 p-2"
					onClick={() => changeLength("session", "+")}
					title="Increase Session Length"
					disabled={currentAction !== "Start Session"}
				>
					<HiPlus size="24" />
				</button>
			</div>
		</div>
	);
}

export default Timer;
