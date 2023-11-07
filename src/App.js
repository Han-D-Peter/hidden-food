import "react-openlayers7/dist/index.css";
import { icon } from "react-openlayers7";
import CSVReader from "./component/CSVReader";

icon.marker = "/images/marker-basic.png";
icon.selected = "/images/marker-selected.png";

function App() {
  return (
    <main>
      <CSVReader />
    </main>
  );
}

export default App;
