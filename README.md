# Cucumbero Timer

It's a Pomodoro Timer, but fresh.

Project made for my [freeCodeCamp](https://www.freecodecamp.org/) Front End Development Libraries Certification to demonstrate my ability of working with timeouts and intervals in JavaScript, as well as the `useEffect` hook in React.

Live App available [HERE](https://szymon-kulak.github.io/cucumbero-timer/)

## Technologies Used

-   [React](https://react.dev/) for adding reactivity to the App
-   [Vite](https://vitejs.dev/) for building the React App
-   [Tailwind CSS](https://tailwindcss.com/) for implementing CSS inside JavaScript
-   [React Icons](https://react-icons.github.io/react-icons/) for adding icons to the App
-   [GitHub Pages](https://pages.github.com/) for hosting the live App

## Documentation

The app allows the user to adjust the length of both the session and the break anywhere between 1-60 minutes thanks to the use of two stateful variables `sessionLength` and `breakLength`.

```jsx
const [breakLength, setBreakLength] = useState(5);
const [sessionLength, setSessionLength] = useState(25);
```

These variables are initialised with the recommended values of 5 and 25 minutes.

Changing both the session and break lengths is done with a single function, `changeLength()`.

```jsx
const changeLength = function (whichLength, plusOrMinus) {
	if (whichLength === "break") {
	if (plusOrMinus === "+") {
	if (breakLength <= 59) {
		setBreakLength(breakLength + 1);
	}
}
```

`changeLength()` receives two parametres from the button used to call it - `whichLength` determines if the adjustment happens to the break or session length while `plusOrMinus` determines whether the length will be incremented or decremented.

As an example, here's the function call on clicking the "Increment Session Length" button:

```jsx
onClick={() => changeLength("session", "+")}
```

The app also uses a stateful variable called `timer` to keep track of remaining time.

```jsx
const [timer, setTimer] = useState(1500);
```

Unlike the `breakLength` and `sessionLength` variables, the `timer` variable is represented in seconds, not minutes. This makes it much simpler to implement a countdown.

The app has a display element `#time-left` which displays the time in mm:ss thanks to some clever string manipulation.

```jsx
{Math.floor(timer / 60).toLocaleString(undefined, {
	minimumIntegerDigits: 2,
})}
:
{(timer % 60).toLocaleString(undefined, {
	minimumIntegerDigits: 2,
})}
```

First, the app calculates minutes through dividing `timer` by 60, and seconds through getting the remainder of that division.

Then, it uses the `Date.toLocaleString()` method. Normally, this method is used to format dates for different regions. However, by leaving the language as `undefined`, we avoid any such transformations, while still being able to access the `minimumIntegerDigits` property. This ensures that, when left with 8 minutes and 9 seconds on the timer, the app will display `08:09` instead of `8:9`.

This could have been done in a less hacky way, but since the unintended solution works, is simpler, and does not introduce any problems, I consider it preferable.

The part of the app I'm most proud of is how it handles starting and stopping the timer. This is done through the stateful variable `currentAction` which not only controls the app's behaviour, but also displays exactly what the app is doing at all times.

```jsx
const [currentAction, setCurrentAction] = useState("Start Session");
```

This variable can take the following values:

```jsx
[
	"Start Session",
	"Session in Progress",
	"Session Paused",
	"Break in Progress",
	"Break Paused",
];
```

> If I was allowed to use Typescript for this project, I would have defined `currentAction` as a union only accepting these strings, but alas, it is what it is.

`"Start Session"` is the default state when you open the app and only persists until the Play/Pause button is first clicked. This state allows to change the lengths of Session and Break - once the timer has been started, the increment/decrement buttons get disabled.

```jsx
disabled={currentAction !== "Start Session"}
```

Once the Play/Pause button is pressed, it triggers the `playPause()` function.

```jsx
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
```

### The Effect

That's nice and all, but how does the app _actually work_?

That's surprisingly simple.

```jsx
useEffect(() => {
	let interval;
	if (
		currentAction === "Session in Progress" ||
		currentAction === "Break in Progress"
	) {
		interval = setInterval(() => {
			if (timer > 0) {
				setTimer(timer - 1);
			} else if (timer === 0 && currentAction === "Session in Progress") {
				audio.play();
				setCurrentAction("Break in Progress");
				setTimer(breakLength * 60);
			} else if (timer === 0 && currentAction === "Break in Progress") {
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
```

Okay, this might not look so simple. Let's break it down.

The `useEffect()` hook allows the app to set and clean up intervals incredibly easily. Here's how its syntax works.

```jsx
useEffect(setup, [dependencies]);
```

The setup here is to initialise an interval that will update the timer every second.

```jsx
useEffect(() => {
	let interval;
	interval = setInterval(() => {
		setTimer(timer - 1);
	}, 1000);
}, []);
```

The `setInterval()` JavaScript function takes a code block (here it's setting the timer to timer - 1) and delay in milliseconds as parametres. Since 1 second is equal to 1000 milliseconds, the app uses `1000` as the delay value.

Next, I wanted this effect to update every time the `timer` or `currentAction` changed, so I passed them in as dependencies.

```jsx
useEffect(() => {
	let interval;
	interval = setInterval(() => {
		setTimer(timer - 1);
	}, 1000);
}, [timer, currentAction]);
```

However, this would cause the app to set a NEW interval each time either of these stateful variables are updated. We don't want that, so I made the effect clean up after itself by clearing the interval whenever it updates.

```jsx
useEffect(() => {
	let interval;
	interval = setInterval(() => {
		setTimer(timer - 1);
	}, 1000);

	return () => {
		clearInterval(interval);
	};
}, [timer, currentAction]);
```

That's better. But now, the timer will run regardless of the app's state. We only want it to run if either a session or a break is in progress. Let's implement that condition.

```jsx
useEffect(() => {
	let interval;
	if (
		currentAction === "Session in Progress" ||
		currentAction === "Break in Progress"
	) {
		interval = setInterval(() => {
			setTimer(timer - 1);
		}, 1000);
	}

	return () => {
		clearInterval(interval);
	};
}, [timer, currentAction]);
```

That's better. Clicking the Play/Pause button now pauses the timer by setting `currentAction` to "Session/Break Paused".

But the timer will keep counting down infinitely. Let's make sure it can never go lower than 0 seconds.

```jsx
useEffect(() => {
	let interval;
	if (
		currentAction === "Session in Progress" ||
		currentAction === "Break in Progress"
	) {
		interval = setInterval(() => {
			if (timer > 0) {
				setTimer(timer - 1);
			}
		}, 1000);
	}

	return () => {
		clearInterval(interval);
	};
}, [timer, currentAction]);
```

Now all that's left to do is update the `currentAction` whenever `timer` reaches 0.

```jsx
useEffect(() => {
	let interval;
	if (
		currentAction === "Session in Progress" ||
		currentAction === "Break in Progress"
	) {
		interval = setInterval(() => {
			if (timer > 0) {
				setTimer(timer - 1);
			} else if (timer === 0 && currentAction === "Session in Progress") {
				setCurrentAction("Break in Progress");
				setTimer(breakLength * 60);
			} else if (timer === 0 && currentAction === "Break in Progress") {
				setCurrentAction("Session in Progress");
				setTimer(sessionLength * 60);
			}
		}, 1000);
	}

	return () => {
		clearInterval(interval);
	};
}, [timer, currentAction]);
```

Now, whenever the session timer runs out, a break timer will automatically start and vice versa. But the user may not realise that if they've become deeply engrossed in their work. Let's fix that by adding an audio clip that plays whenever the timer finishes.

First the app imports the file.

```jsx
import beep from "./assets/beep.mp3";
```

Then, it places it inside an audio tag hidden inside the display element.

```jsx
<audio src={beep} id="beep" />
```

After that, it assigns this audio element to a JavaScript constant `audio`.

```jsx
const audio = document.getElementById("beep");
```

And finally, all that's left to do is let our interval effect play the clip whenever appropriate.

```jsx
useEffect(() => {
	let interval;
	if (
		currentAction === "Session in Progress" ||
		currentAction === "Break in Progress"
	) {
		interval = setInterval(() => {
			if (timer > 0) {
				setTimer(timer - 1);
			} else if (timer === 0 && currentAction === "Session in Progress") {
				audio.play();
				setCurrentAction("Break in Progress");
				setTimer(breakLength * 60);
			} else if (timer === 0 && currentAction === "Break in Progress") {
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
```
