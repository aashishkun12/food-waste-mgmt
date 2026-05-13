import { BrowserRouter as Router } from "react-router-dom"
import CustomRoutes from "./routes/CustomRoutes"

const App = () => {
  return (
    <>
      <Router>
        <CustomRoutes />
      </Router>
    </>
  )
}
export default App