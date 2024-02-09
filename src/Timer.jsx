import { useEffect, useState } from "react";
import { HiArrowPath, HiMinus, HiPlayPause, HiPlus } from "react-icons/hi2";
import beep from "./assets/beep.mp3";

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

	const audio = document.getElementById("beep");

	useEffect(() => {
		let interval;
		if (
			currentAction === "Session in Progress" ||
			currentAction === "Break in Progress"
		) {
			interval = setInterval(() => {
				if (timer > 0) {
					setTimer(timer - 1);
				} else if (
					timer === 0 &&
					currentAction === "Session in Progress"
				) {
					audio.play();
					setCurrentAction("Break in Progress");
					setTimer(breakLength * 60);
				} else if (
					timer === 0 &&
					currentAction === "Break in Progress"
				) {
					audio.play();
					setCurrentAction("Session in Progress");
					setTimer(sessionLength * 60);
				}
			}, 1000);
		}

		return () => {
			clearInterval(interval);
		};
	}, [timer, currentAction]);

	const resetApp = function () {
		setBreakLength(5);
		setSessionLength(25);
		setTimer(1500);
		setCurrentAction("Start Session");
		audio.pause();
		audio.currentTime = 0;
	};

	return (
		<div className="flex h-96 w-80 flex-wrap items-center justify-center rounded-2xl border-2 border-emerald-900 bg-emerald-50 bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-900 shadow-2xl sm:w-[600px]">
			<div
				id="timer-controls"
				className="flex w-full flex-wrap content-start items-start justify-center text-center"
			>
				<h1
					id="timer-label"
					className="w-full p-4 text-2xl font-bold drop-shadow-sm"
				>
					{currentAction}
				</h1>
				<div
					id="time-left"
					className="w-40 select-none rounded-xl bg-emerald-950 p-4 text-center font-Digital text-4xl text-emerald-500 shadow-lg"
				>
					{Math.floor(timer / 60).toLocaleString(undefined, {
						minimumIntegerDigits: 2,
					})}
					:
					{(timer % 60).toLocaleString(undefined, {
						minimumIntegerDigits: 2,
					})}
					<audio src={beep} id="beep" />
				</div>
				<div id="buttons" className="w-full p-4">
					<button
						id="reset"
						className="mr-4 rounded-xl border border-red-700 bg-red-500 p-2 shadow-md"
						title="Reset the app"
						onClick={resetApp}
					>
						<HiArrowPath size="24" />
					</button>
					<button
						id="start_stop"
						className="rounded-xl border border-emerald-700 bg-emerald-500 p-2 shadow-md"
						title="Start/Stop the Timer"
						onClick={playPause}
					>
						<HiPlayPause size="24" />
					</button>
				</div>
			</div>
			<div id="break-controls" className="p-4 text-center">
				<h2 id="break-label" className="p-1 font-bold drop-shadow-sm">
					Break Length
				</h2>
				<div id="break-length" className="p-1 drop-shadow-sm">
					{breakLength} minutes
				</div>
				<div className="p-1">
					<button
						id="break-decrement"
						className="mr-2 rounded-xl border border-emerald-700 bg-emerald-500 p-2 shadow-md"
						onClick={() => changeLength("break", "-")}
						title="Decrease Break Length"
						disabled={currentAction !== "Start Session"}
					>
						<HiMinus size="24" />
					</button>
					<button
						id="break-increment"
						className="ml-2 rounded-xl border border-emerald-700 bg-emerald-500 p-2 shadow-md	"
						onClick={() => changeLength("break", "+")}
						title="Increase Break Length"
						disabled={currentAction !== "Start Session"}
					>
						<HiPlus size="24" />
					</button>
				</div>
			</div>
			<div id="session-controls" className="p-4 text-center">
				<h2 id="session-label" className="p-1 font-bold drop-shadow-sm">
					Session Length
				</h2>
				<div id="session-length" className="p-1 drop-shadow-sm">
					{sessionLength} minutes
				</div>
				<div className="p-1">
					<button
						id="session-decrement"
						className="mr-2 rounded-xl border border-emerald-700 bg-emerald-500 p-2 shadow-md"
						onClick={() => changeLength("session", "-")}
						title="Decrease Session Length"
						disabled={currentAction !== "Start Session"}
					>
						<HiMinus size="24" />
					</button>
					<button
						id="session-increment"
						className="ml-2 rounded-xl border border-emerald-700 bg-emerald-500 p-2 shadow-md"
						onClick={() => changeLength("session", "+")}
						title="Increase Session Length"
						disabled={currentAction !== "Start Session"}
					>
						<HiPlus size="24" />
					</button>
				</div>
			</div>
		</div>
	);
}

export default Timer;
