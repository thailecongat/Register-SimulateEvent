# Register-SimulateEvent
This is the source code for the register and simulate event html game.

## Usage Register Event
You can RegisterEvent as follows:

```
import { RegisterEvents } from "Register-SimulateEvent";
function App() {
 const [registerEvent, SetRegisterEvent] = useState<RegisterEvents>();
  useEffect(() => {
    const registerEvent = new RegisterEvents({gameSessionId: gameSessionId});
    SetRegisterEvent(registerEvent);
  }, []);
  
   useEffect(() => {
    if (!registerEvent) return;
    registerEvent.registerEventHtmlGame();
  }, [registerEvent]);
}
```

To the RegisterEvent pause/resume and player left the game:
```
registerEvent?.savePauseEvent(true); //when the game pause
registerEvent?.savePauseEvent(false); //when the game resume
registerEvent?.savePlayerLeftEvent(); //when the player left the game
```

## Usage Simulate Event
You can SimulateEvent as follows:

```
import { SimulateEventComponet } from "Register-SimulateEvent";
import { StreamingView } from 'streaming-view-sdk';

class App extends React.Component {
  render() {
    return (
      <SimulateEventComponet gameSessionId={gameSessionId}/>
    );
  }
}
```
## Type input
`gameSessionId: string`
