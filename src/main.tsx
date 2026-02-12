import ReactDOM from "react-dom/client";
import Responsive from "./responsive";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

const el = document.getElementById("root");
if (!el) throw new Error("#root not found");

ReactDOM.createRoot(el).render(<Responsive />);