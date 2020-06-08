
const App = (props) => {
  const [userJob, setUserJob] = React.useState([]);
  const [valueCount, setValueCount] = React.useState(0);
  const [userCount, setUserCount] = React.useState(0);

  const [ws, setWs] = React.useState(null);

  const onReceiveMessage = ({ data }) => {
    const obj = JSON.parse(data);
    switch (obj.type) {
      case "state":
        setValueCount(obj.value);
        break;
      case "users":
        setUserCount(obj.count);
        break;
      default:
        console.error("unsupported event", data);
    }
  };

  React.useEffect(() => {
    if (ws) ws.close();

    try {
      // ${window.location.host}
      const wsl = new WebSocket(`ws://localhost:6789`);

      console.log("WS:", wsl)

      if (wsl) {
        wsl.addEventListener("message", onReceiveMessage);
        setWs(wsl)
      }

      return () => {
        wsl.removeEventListener("message", onReceiveMessage);
      };
    }
    catch(err) {
      alert(err.message);
    }
  }, []);

  const doMinus = (e) => {
    console.log("Minus", ws);
    if (ws)
      ws.send(JSON.stringify({ action: "minus" }));
  };

  const doPlus = (e) => {
    console.log("Plus:", ws);
    if (ws)
      ws.send(JSON.stringify({ action: "plus" }));
  };

  return (
    <div>
      <List/>
      <div className="buttons">
        <button className="minus button" onClick={doMinus}>-</button>
        <div className="value">{valueCount}</div>
        <button className="plus button" onClick={doPlus}>+</button>
      </div>
      <div className="state">
        <span className="users">{userCount}</span> user online
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
