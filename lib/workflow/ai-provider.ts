import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { google } from "@ai-sdk/google"

interface GenerateTextOptions {
  provider: string
  model: string
  prompt: string
  temperature?: number
  maxTokens?: number
}

export class AIProvider {
  async generateText(options: GenerateTextOptions): Promise<string> {
    const { provider, model, prompt, temperature = 0.7, maxTokens = 1000 } = options

    let aiModel

    switch (provider) {
      case "openai":
        aiModel = openai(model)
        break
      case "anthropic":
        aiModel = anthropic(model)
        break
      case "google":
        aiModel = google(model)
        break
      default:
        throw new Error(`Unsupported AI provider: ${provider}`)
    }

    const { text } = await generateText({
      model: aiModel,
      prompt,
      temperature,
      maxTokens,
    })

    return text
  }
}
