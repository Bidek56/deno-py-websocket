
import {React} from './deps.ts'

const NewTask: React.FC = (): JSX.Element => {

  // console.log(table)

  const [ws, setWs] = React.useState<any>(null);
	const [completedCount, setCompletedCount] = React.useState<number>(0);
  const [log, setLog] = React.useState<string | null>(null);

	const [userCount, setUserCount] = React.useState<number>(0);

  // car selection
  const carNames = ['Volvo', 'Saab', 'Mercedes', 'Audi']
  const selectCar = carNames.map((name, key) => <option key={key} value={name}>{name}</option>)
  const [selectedCar, setSelectedCar] = React.useState<string>(carNames[0])

  // color selection
  const colorNames = ['blue', 'red', 'pink']
  const selectColor = colorNames.map((name, key) => <option key={key} value={name}>{name}</option>)
  const [selectedColor, setSelectedColor] = React.useState<string>(colorNames[0])

  // model selection
  const modelNames = ['compact', 'sedan', 'SUV']
  const selectModel = modelNames.map((name, key) => <option key={key} value={name}>{name}</option>)
  const [selectedModel, setSelectedModel] = React.useState<string>(modelNames[0])

  const onSelectChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
      console.log(event.target.value)
      setSelectedCar(event.target.value as string)
  }

  const onSelectColorChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
      console.log(event.target.value)
      setSelectedCar(event.target.value as string)
  }

  const onSelectModelChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
      console.log(event.target.value)
      setSelectedModel(event.target.value as string)
  }

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // console.log('Submitted: ' + selectedCar + ":" + selectedColor + ":" + selectedModel);

    setLog(null);
    ws?.send(JSON.stringify({ action: "doTask", car: selectedCar, model: selectedModel, color: selectedColor }));
  }
 
 	const onReceiveMessage = ({ data }: any) => {
		const obj = JSON.parse(data);

    // console.log(obj)

    if (!obj)
      return

		switch (obj.type) {
      case "state":
        setCompletedCount(obj?.completed);
        setLog(obj?.log)
        break;
      case "users":
        setUserCount(obj?.count);
        break;
      default:
        console.error("unsupported event", data);
		}
	};

  React.useEffect(() => {
		ws?.close();

		try {
			// ${window.location.host}

      // @ts-ignore
			const wsl = new WebSocket(`ws://localhost:6789`);

			// console.log("WS:", wsl)

			if (wsl) {
				wsl.addEventListener("message", onReceiveMessage);
				setWs(wsl)
			}

			return () => {
				wsl.removeEventListener("message", onReceiveMessage);
			};
		}
		catch(err) {
			console.error(err.message);
		}
	}, []);

  return (
      <table className="table table-bordered">
        <tbody>
          <tr>
            <td>                
              <label htmlFor="cars" className="input-label">Choose car:</label>
              <select name="cars" id="cars" onChange={onSelectChange} >
                {selectCar}
              </select>
            </td>
            <td>
              <button className="submit" onClick={handleSubmit}>Submit</button>
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="colors" className="input-label">Choose color:</label>
              <select name="colors" id="colors" onChange={onSelectColorChange} >
                {selectColor}
              </select>
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="models" className="input-label">Choose model:</label>
              <select name="models" id="colors" onChange={onSelectModelChange} >
                {selectModel}
              </select>
            </td>
          </tr>
          <tr>
            <td className="value">Users: {userCount}</td>
            <td className="value">Completed: {completedCount}</td>
            <td > {log ? log : ""} </td>            
          </tr>
        </tbody>
      </table>
  );
}

export default NewTask