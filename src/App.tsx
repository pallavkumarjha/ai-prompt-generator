import { useState } from 'react'
import { Analytics } from "@vercel/analytics/react"
import { Copy, HelpCircle, ChevronDown, ChevronUp, CoffeeIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: This is not recommended for production
})

export default function Component() {
  const [prompt, setPrompt] = useState('')
  const [role, setRole] = useState('')
  const [topic, setTopic] = useState('')
  const [goal, setGoal] = useState('')
  const [outputFormat, setOutputFormat] = useState('')
  const [expertiseLevel, setExpertiseLevel] = useState('')
  const [details, setDetails] = useState('')
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

    const generatePrompt = async () => {
      setIsLoading(true);
      
      const systemMessage = `You are an advanced AI assistant specialized in generating tailored prompts. Your task is to create a prompt based on the provided parameters. Follow these guidelines:
    
      1. Analyze the given role, topic, goal, and expertise level to understand the context.
      2. Craft a prompt that is specific, clear, and aligned with the stated goal.
      3. Adjust the language and complexity to match the specified expertise level.
      4. Incorporate any additional details provided to make the prompt more focused and relevant.
      5. Ensure the generated prompt follows the requested output format.
      6. Be concise yet comprehensive, providing enough information to guide the response without being overly restrictive.
      7. If appropriate, include suggestions for potential areas to explore or aspects to consider in the response.
      8. Avoid biases and maintain a neutral tone unless otherwise specified.
      9. If the topic is sensitive or controversial, approach it with care and objectivity.
    
      Your output should be a well-structured, thoughtful prompt that effectively captures all the provided parameters and guides the user towards producing the desired content or solution.`;
    
      const userMessage = `Generate a prompt with the following parameters:
      - Prompt: "${prompt}"
      ${role ? `- Role: "${role}"` : ""}
      ${topic ? `- Topic: "${topic}"` : ""}
      ${goal ? `- Goal: "${goal}"` : ""}
      ${outputFormat ? `- Output Format: "${outputFormat}"` : ""}
      ${expertiseLevel ? `- Expertise Level: "${expertiseLevel}"` : ""}
      ${details ? `- Additional Details: "${details}"` : ""}`;
    
      try {
        const completion = await openai.chat.completions.create({
          messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: userMessage }
          ],
          model: "gpt-3.5-turbo"
        });
    
        const generatedPrompt = completion.choices[0].message.content;
        setGeneratedPrompt(generatedPrompt);
      } catch (error) {
        console.error('Error generating prompt:', error);
        setGeneratedPrompt('Failed to generate prompt. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
  

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt)
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white p-8">
      <header className="py-8">
        <h1 className="text-4xl text-center">Your AI Prompt Engineer</h1>
        <h2 className="text-xl text-center text-light mt-4">Crafting Tailored Prompts with AI</h2>
      </header>
      <main className="flex-grow flex justify-center">
        <div className="w-full max-w-6xl bg-gray-900 rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left container for input */}
            <div className="w-full md:w-1/2 p-6 border-r border-gray-800">
              <h2 className="text-2xl font-semibold mb-6">Create Your Prompt</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="prompt" className="text-lg">Your Prompt (Required)</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-5 w-5 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter your main question or request for the AI here. Be clear and specific.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Textarea
                    id="prompt"
                    placeholder="E.g., Explain the concept of photosynthesis"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-lg"
                    rows={4}
                  />
                </div>

                <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-4">
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="flex items-center justify-between w-full bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
                      Optional Fields
                      {isOpen ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="role" className="text-lg">AI Role</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-5 w-5 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Specify a role for the AI to assume in its response.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="role"
                        placeholder="E.g., Teacher, Scientist, Historian"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="topic" className="text-lg">Topic</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-5 w-5 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Specify the general subject area of your prompt.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="topic"
                        placeholder="E.g., Biology, Computer Science, History"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="goal" className="text-lg">Goal</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-5 w-5 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>What do you want to achieve with this prompt?</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="goal"
                        placeholder="E.g., Understand basics, Solve a problem, Get examples"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="outputFormat" className="text-lg">Desired Output Format</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-5 w-5 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>How would you like the AI to structure its response?</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Select onValueChange={setOutputFormat}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-lg">
                          <SelectValue placeholder="Select output format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bullet-points">Bullet Points</SelectItem>
                          <SelectItem value="paragraph">Paragraph</SelectItem>
                          <SelectItem value="step-by-step">Step-by-Step Guide</SelectItem>
                          <SelectItem value="code-snippet">Code Snippet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="expertiseLevel" className="text-lg">Your Expertise Level</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-5 w-5 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>How familiar are you with this topic?</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Select onValueChange={setExpertiseLevel}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-lg">
                          <SelectValue placeholder="Select your expertise level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="details" className="text-lg">Additional Details</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-5 w-5 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Any extra information that might be helpful for the AI.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Textarea
                        id="details"
                        placeholder="E.g., Specific areas of interest, or any constraints"
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-lg"
                        rows={3}
                      />
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Button 
                  onClick={generatePrompt} 
                  className="w-full bg-white text-black hover:bg-gray-200 text-lg py-6"
                  disabled={isLoading || !prompt}
                >
                  {isLoading ? 'Creating Prompt...' : 'Create Prompt'}
                </Button>
              </div>
            </div>

            {/* Right container for output */}
            <div className="w-full md:w-1/2 p-6">
              <h2 className="text-2xl font-semibold mb-6">Generated Prompt</h2>
              <div className="bg-gray-800 p-6 rounded-md relative min-h-[200px]">
                <pre className="whitespace-pre-wrap text-lg">{generatedPrompt || 'Your generated prompt will appear here.'}</pre>
                {generatedPrompt && (
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="icon"
                    className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600"
                    title="Copy to clipboard"
                  >
                    <Copy className="h-5 w-5" />
                  </Button>
                )}
              </div>
              <p className="mt-4 text-sm text-gray-400 text-center">
                Copy this prompt and paste it into your favorite AI tool to get started!
              </p>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-gray-900 text-white mt-12">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <p className="text-center text-sm">
            No rights reserved.
          </p>
          <p className="text-center text-sm">
          <button
              onClick={() => window.open('https://buymeacoffee.com/pallavjha', '_blank')}
              className={`
                inline-flex items-center px-4 py-2 text-sm 
                bg-transparent focus:ring-4 focus:ring-yellow-300
                transition-all duration-200 ease-in-out transform hover:scale-105
              `}
            >
              <CoffeeIcon style={{ marginRight: '12px'}} />
              Buy Me a Coffee
            </button>
          </p>

        </div>
      </footer>
      <Analytics />
    </div>
  )
}