import OpenAI from 'openai'

class OpenAIService {
  constructor() {
    this.client = null
    this.initialized = false
  }

  initialize(apiKey) {
    if (!apiKey) {
      console.warn('OpenAI API key not provided')
      return false
    }

    try {
      this.client = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
      })
      this.initialized = true
      return true
    } catch (error) {
      console.error('Failed to initialize OpenAI client:', error)
      return false
    }
  }

  async generateRightsScript(scenario, state, language = 'en') {
    if (!this.initialized || !this.client) {
      throw new Error('OpenAI service not initialized')
    }

    const prompt = `Generate a clear, concise script for someone during a ${scenario} police interaction in ${state}. 
    The script should:
    - Be respectful and non-confrontational
    - Clearly state their rights
    - Provide specific phrases to use
    - Be appropriate for ${language === 'es' ? 'Spanish' : 'English'} speakers
    - Include what to do and what NOT to do
    - Be under 200 words
    
    Format as JSON with sections: "whatToSay", "whatToDo", "whatNotToDo", "keyRights"`

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a legal rights advisor helping people understand their rights during police interactions. Provide accurate, helpful guidance that prioritizes safety and legal compliance.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.3
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response from OpenAI')
      }

      return JSON.parse(content)
    } catch (error) {
      console.error('Error generating rights script:', error)
      throw new Error('Failed to generate rights guidance')
    }
  }

  async generateStateLawSummary(state, topic) {
    if (!this.initialized || !this.client) {
      throw new Error('OpenAI service not initialized')
    }

    const prompt = `Summarize the key laws in ${state} related to ${topic} and police interactions. 
    Focus on:
    - Citizen rights and protections
    - What police can and cannot do
    - Important legal precedents
    - Practical implications
    
    Keep it under 300 words and make it accessible to non-lawyers.
    Format as JSON with sections: "summary", "keyPoints", "importantNotes"`

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a legal expert specializing in civil rights and police interaction laws. Provide accurate, up-to-date information that helps citizens understand their rights.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 600,
        temperature: 0.2
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response from OpenAI')
      }

      return JSON.parse(content)
    } catch (error) {
      console.error('Error generating state law summary:', error)
      throw new Error('Failed to generate law summary')
    }
  }

  async generateIncidentSummary(incidentData) {
    if (!this.initialized || !this.client) {
      throw new Error('OpenAI service not initialized')
    }

    const prompt = `Create a professional incident summary based on this data:
    - Time: ${incidentData.timestamp}
    - Location: ${incidentData.gpsLocation}
    - Duration: ${incidentData.duration} seconds
    - Notes: ${incidentData.userNotes || 'No additional notes'}
    
    Generate a clear, factual summary suitable for sharing with legal aid or trusted contacts.
    Include key details and timeline. Keep it professional and objective.
    Format as JSON with sections: "summary", "keyDetails", "timeline", "recommendedActions"`

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a legal documentation assistant. Create clear, factual incident summaries that could be useful for legal purposes.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 400,
        temperature: 0.1
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response from OpenAI')
      }

      return JSON.parse(content)
    } catch (error) {
      console.error('Error generating incident summary:', error)
      throw new Error('Failed to generate incident summary')
    }
  }

  async translateContent(content, targetLanguage) {
    if (!this.initialized || !this.client) {
      throw new Error('OpenAI service not initialized')
    }

    const languageMap = {
      'es': 'Spanish',
      'en': 'English'
    }

    const targetLang = languageMap[targetLanguage] || 'English'

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a professional translator specializing in legal and civil rights content. Translate accurately while maintaining the legal meaning and tone.`
          },
          {
            role: 'user',
            content: `Translate the following content to ${targetLang}, maintaining the original structure and legal accuracy:\n\n${JSON.stringify(content)}`
          }
        ],
        max_tokens: 800,
        temperature: 0.1
      })

      const translatedContent = response.choices[0]?.message?.content
      if (!translatedContent) {
        throw new Error('No translation response from OpenAI')
      }

      return JSON.parse(translatedContent)
    } catch (error) {
      console.error('Error translating content:', error)
      throw new Error('Failed to translate content')
    }
  }
}

export default new OpenAIService()
