import fetch from "node-fetch-commonjs"

export default class GPT4FreeRequester {

    async getResponse(prompt: string, chatId?: number) {
        const body = {
            "request": prompt
        }

        try {
            const response = await fetch("http://127.0.0.1:8008", {
                method: "POST",
                body: JSON.stringify(body),
                headers: { "Content-Type": "application/json" }
            })
            const data: any = await response.json()

            return data["response"]
        } catch (exception) {
            console.log("GPT fetch failed. Check if the endpoint is open and running.")
        }

        return "Fetch Failed"
    }

}
