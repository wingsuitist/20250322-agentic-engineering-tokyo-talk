import fs from 'fs';
import path from 'path';
import { OpenAI } from 'openai';

// Initialize OpenRouter client with the API key from environment variable
const openai = new OpenAI({
  apiKey: process.env.LAB_OPENROUTER_TOKEN || '',
  baseURL: 'https://openrouter.ai/api/v1',
});

// Read the system prompt from file
const getSystemPrompt = (): string => {
  const promptPath = path.join(__dirname, 'prompts', 'system-prompt.txt');
  return fs.readFileSync(promptPath, 'utf-8');
};

// Function to generate mermaid diagram from user prompt
export async function generateMermaidDiagram(userPrompt: string): Promise<string> {
  try {
    const systemPrompt = getSystemPrompt();
    
    const response = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2048,
    });

    // Extract the generated mermaid diagram
    const generatedContent = response.choices[0]?.message?.content || '';
    
    // Clean up the response to ensure it's valid mermaid syntax
    return cleanMermaidSyntax(generatedContent);
  } catch (error) {
    console.error('Error generating mermaid diagram:', error);
    throw new Error(`Failed to generate diagram: ${(error as Error).message}`);
  }
}

// Helper function to clean up the mermaid syntax
function cleanMermaidSyntax(content: string): string {
  // Remove markdown code blocks if present
  let cleanedContent = content.trim();
  
  // Remove markdown code block syntax if present
  if (cleanedContent.startsWith('```mermaid')) {
    cleanedContent = cleanedContent.replace(/^```mermaid\n/, '').replace(/```$/, '');
  } else if (cleanedContent.startsWith('```')) {
    cleanedContent = cleanedContent.replace(/^```\n/, '').replace(/```$/, '');
  }
  
  return cleanedContent.trim();
}
