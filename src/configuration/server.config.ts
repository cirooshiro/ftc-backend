import { Environment } from "./environment.config"
import ExpressConfig from "configuration/express.config"

Environment()

const app = ExpressConfig()

app.listen(process.env.PORT , () => {
    console.warn(process.env)
    console.log("Server Running on Port " + process.env.PORT)
})