import * as fs from "fs"
import { Configuration, OpenAIApi } from "openai"

function readApiKeys(path: fs.PathOrFileDescriptor, encoding: BufferEncoding) {
    const data = fs.readFileSync(path, encoding)
    return data.split(getLineEndingType(data))
}

function getLineEndingType(source: string) {
    const temp = source.indexOf("\n");
    if (source[temp - 1] === "\r")
        return "CRLF"
    return "LF"
}

const apiKeys = readApiKeys("../res/openai-api-key.txt", "utf-8")

if (apiKeys.length === 0) {
    throw new Error("ERROR: No OpenAI API keys found")
}
