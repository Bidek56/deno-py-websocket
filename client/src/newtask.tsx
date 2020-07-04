
import {React, PropTypes} from './deps.ts'

type Dispatcher<S> = React.Dispatch<React.SetStateAction<S>>;

export const ScrollModal: React.FC<{setShowModal: Dispatcher<boolean>, path: string|null }> = ({setShowModal, path }) => {

  // console.log("Show modal", setShowModal)

  // Similar to componentDidMount and componentDidUpdate:
  React.useEffect(() => {
    // Update the document title using the browser API

    // @ts-ignore
    document.title = `You clicked ${path}`;
  });

  const onClose = ( event: React.MouseEvent<HTMLButtonElement, MouseEvent> ) => {
  // const handleLogClick = (log: string) => {
    console.log("onClose")
    setShowModal(false)
  }

  return !path ? null :
      <div>Modal
        <div>
          <button className="btn btn-outline-danger" onClick={onClose}>Close</button>
        </div>
      </div>
}

ScrollModal.propTypes = {
  setShowModal: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired
}

export const NewTask: React.FC = (): JSX.Element => {

  const [ws, setWs] = React.useState<any>(null);
	const [completedCount, setCompletedCount] = React.useState<number>(0);
  const [log, setLog] = React.useState<string | null>(null);

  const [showModal, setShowModal] = React.useState<boolean>(false);
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
    // console.log(event.target.value)
    setSelectedCar(event.target.value as string)
  }

  const onSelectModelChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    // console.log(event.target.value)
    setSelectedModel(event.target.value as string)
  }

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // console.log('Submitted: ' + selectedCar + ":" + selectedColor + ":" + selectedModel);

    setLog(null);
    ws?.send(JSON.stringify({ action: "doTask", car: selectedCar, model: selectedModel, color: selectedColor }));
  }
 
  const handleLogClick = ( event: React.MouseEvent<HTMLButtonElement, MouseEvent> ) => {
  // const handleLogClick = (log: string) => {
    console.log("Log", log)
    setShowModal(true)
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
    <div>
      <h5 className="text-center">Input</h5>
      <div className="input-group mb-3">
        <label htmlFor="cars" className="input-group-text">Choose car:</label>
        <select className="form-select" name="cars" id="cars" onChange={onSelectChange} >
          {selectCar}
        </select>
        <label htmlFor="colors" className="input-group-text">Choose color:</label>
        <select className="form-select" name="colors" id="colors" onChange={onSelectColorChange} >
          {selectColor}
        </select>
      </div>
      <div className="input-group mb-3">        
        <label htmlFor="models" className="input-group-text">Choose model:</label>
        <select className="form-select" name="models" id="colors" onChange={onSelectModelChange} >
          {selectModel}
        </select>        
      </div>
      <button className="btn btn-outline-primary" onClick={handleSubmit}>Submit</button>
      <br/>
      <br/>
      <h5 className="text-center">Output</h5>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th scope="col">Users</th>
            <th scope="col">Completed</th>
            <th scope="col">Log</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{userCount}</td>
            <td>{completedCount}</td>
            <td>{ log &&
              <button className="btn btn-outline-primary" onClick={handleLogClick}>Show Log</button> }
            </td>
          </tr>
        </tbody>
      </table>
      {showModal && <ScrollModal setShowModal={setShowModal} path={log}/> }
    </div>
  );
}