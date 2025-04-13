"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, BarChart2, Award, User, Crown, Lock, Sparkles, CheckCircle2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Types
interface UserData {
  name: string
  email: string
  password: string
  history: TestResult[]
  premium: PremiumStatus | null
}

interface PremiumStatus {
  plan: "monthly" | "yearly"
  startDate: string
  expiryDate: string
}

interface TestResult {
  date: string
  mode: string
  difficulty: string
  wpm: number
  accuracy: number
  duration: number
}

// Premium texts with more variety
const premiumTexts = {
  regular: {
    easy: [
      "The quick brown fox jumps over the lazy dog. Simple words are easy to type.",
      "All good things must come to an end, but every end is a new beginning.",
      "The early bird catches the worm, but the second mouse gets the cheese.",
    ],
    medium: [
      "Programming is the process of creating a set of instructions that tell a computer how to perform a task. Programming can be done using many programming languages.",
      "The Internet is a global system of interconnected computer networks that use the standard Internet protocol suite to link devices worldwide.",
      "Artificial intelligence is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals including humans.",
    ],
    hard: [
      "The efficacy of quantum computing relies on the principles of superposition and entanglement, allowing for exponential parallelism in computational processes that traditional binary systems cannot achieve.",
      "Neuroplasticity refers to the brain's ability to reorganize itself by forming new neural connections throughout life, allowing neurons to adjust their activities in response to new situations or changes in their environment.",
      "The anthropomorphization of artificial intelligence systems may lead to unrealistic expectations regarding their capabilities and ethical frameworks, potentially obscuring the fundamental differences between human cognition and machine learning algorithms.",
    ],
  },
  steno: {
    easy: [
      "The court finds in favor of the plaintiff. The defendant must pay damages as outlined in the complaint.",
      "The witness will please state your name and occupation for the record before proceeding with testimony.",
      "The jury is instructed to disregard the previous statement as it is not supported by the evidence presented.",
    ],
    medium: [
      "Your Honor, I object to this line of questioning on the grounds that it calls for speculation. The witness cannot testify to matters outside their direct knowledge.",
      "Counsel for the defense requests a sidebar conference to discuss the admissibility of evidence that may be prejudicial to the defendant.",
      "The prosecution moves to enter Exhibit A into evidence, which consists of photographs taken at the scene on the night in question.",
    ],
    hard: [
      "The appellant contends that the trial court erred in denying the motion to suppress evidence obtained during the warrantless search of the appellant's residence, citing violations of the Fourth Amendment protections against unreasonable searches and seizures.",
      "The doctrine of stare decisis requires courts to follow precedent established by prior decisions, thereby ensuring consistency and predictability in the application of legal principles across similar cases within the same jurisdiction.",
      "The petitioner seeks a writ of certiorari from the Supreme Court, arguing that the circuit court's interpretation of the statute creates a split among jurisdictions that necessitates resolution by the highest court.",
    ],
  },
  code: {
    easy: [
      "function greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet('World'));",
      "const numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(num => num * 2);\nconsole.log(doubled);",
      "let count = 0;\nfunction increment() {\n  count++;\n  return count;\n}\n\nconsole.log(increment());",
    ],
    medium: [
      "class Rectangle {\n  constructor(height, width) {\n    this.height = height;\n    this.width = width;\n  }\n\n  get area() {\n    return this.calcArea();\n  }\n\n  calcArea() {\n    return this.height * this.width;\n  }\n}",
      "const fetchData = async (url) => {\n  try {\n    const response = await fetch(url);\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error('Error fetching data:', error);\n  }\n};",
      "function memoize(fn) {\n  const cache = {};\n  return function(...args) {\n    const key = JSON.stringify(args);\n    if (cache[key]) {\n      return cache[key];\n    }\n    const result = fn.apply(this, args);\n    cache[key] = result;\n    return result;\n  };\n}",
    ],
    hard: [
      "function quickSort(arr) {\n  if (arr.length <= 1) {\n    return arr;\n  }\n\n  const pivot = arr[Math.floor(arr.length / 2)];\n  const left = arr.filter(x => x < pivot);\n  const middle = arr.filter(x => x === pivot);\n  const right = arr.filter(x => x > pivot);\n\n  return [...quickSort(left), ...middle, ...quickSort(right)];\n}",
      "class BinarySearchTree {\n  constructor() {\n    this.root = null;\n  }\n\n  insert(value) {\n    const newNode = { value, left: null, right: null };\n    if (!this.root) {\n      this.root = newNode;\n      return;\n    }\n\n    const insertNode = (node, newNode) => {\n      if (newNode.value < node.value) {\n        if (node.left === null) {\n          node.left = newNode;\n        } else {\n          insertNode(node.left, newNode);\n        }\n      } else {\n        if (node.right === null) {\n          node.right = newNode;\n        } else {\n          insertNode(node.right, newNode);\n        }\n      }\n    };\n\n    insertNode(this.root, newNode);\n  }\n}",
      "const debounce = (func, wait) => {\n  let timeout;\n  return function executedFunction(...args) {\n    const later = () => {\n      clearTimeout(timeout);\n      func(...args);\n    };\n    clearTimeout(timeout);\n    timeout = setTimeout(later, wait);\n  };\n};",
    ],
  },
}

export default function TypingPractice() {
  const [text, setText] = useState("")
  const [userInput, setUserInput] = useState("")
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [errors, setErrors] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [difficulty, setDifficulty] = useState("medium")
  const [mode, setMode] = useState("regular")
  const [textVariant, setTextVariant] = useState(0)

  // Auth state
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isPremiumOpen, setIsPremiumOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState<UserData | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly")
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvc, setCardCvc] = useState("")

  const inputRef = useRef<HTMLInputElement>(null)

  const regularTexts = {
    easy: "The quick brown fox jumps over the lazy dog. Simple words are easy to type.",
    medium:
      "Programming is the process of creating a set of instructions that tell a computer how to perform a task. Programming can be done using many programming languages.",
    hard: "The efficacy of quantum computing relies on the principles of superposition and entanglement, allowing for exponential parallelism in computational processes that traditional binary systems cannot achieve.",
  }

  const stenoTexts = {
    easy: "The court finds in favor of the plaintiff. The defendant must pay damages as outlined in the complaint.",
    medium:
      "Your Honor, I object to this line of questioning on the grounds that it calls for speculation. The witness cannot testify to matters outside their direct knowledge.",
    hard: "The appellant contends that the trial court erred in denying the motion to suppress evidence obtained during the warrantless search of the appellant's residence, citing violations of the Fourth Amendment protections against unreasonable searches and seizures.",
  }

  const isStenoMode = mode === "steno"
  const isCodeMode = mode === "code"
  const isPremium = user?.premium !== null && user?.premium ? new Date(user.premium.expiryDate) > new Date() : false

  // Load user data from localStorage on initial render
  useEffect(() => {
    const savedUser = localStorage.getItem("typingPracticeUser")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        console.error("Failed to parse user data", e)
      }
    }
  }, [])

  useEffect(() => {
    if (isPremium && (mode === "regular" || mode === "steno" || mode === "code")) {
      // For premium users, select from the array of texts
      const texts = premiumTexts[mode as keyof typeof premiumTexts]
      if (texts) {
        const variants = texts[difficulty as keyof typeof texts]
        if (Array.isArray(variants) && variants.length > 0) {
          setText(variants[textVariant % variants.length])
          return
        }
      }
    }

    // Fallback to regular texts for non-premium users or if premium texts aren't available
    if (mode === "code" && !isPremium) {
      // Show a locked message for code mode if not premium
      setText("Premium feature: Code typing practice is available for premium members only.")
    } else {
      const texts = isStenoMode ? stenoTexts : regularTexts
      setText(texts[difficulty as keyof typeof texts])
    }

    resetTest()
  }, [difficulty, mode, textVariant, isPremium])

  useEffect(() => {
    // Force re-render every second to update WPM while typing
    if (startTime && !endTime) {
      const interval = setInterval(() => {
        // This empty setState forces a re-render
        setUserInput((current) => current)
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [startTime, endTime])

  const resetTest = () => {
    setUserInput("")
    setStartTime(null)
    setEndTime(null)
    setCurrentIndex(0)
    setErrors(0)
    setIsFinished(false)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const nextText = () => {
    setTextVariant((prev) => prev + 1)
    resetTest()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // Don't allow typing if code mode is locked
    if (mode === "code" && !isPremium) {
      return
    }

    if (!startTime) {
      setStartTime(Date.now())
    }

    if (value.length === text.length) {
      setEndTime(Date.now())
      setIsFinished(true)

      // Save result if user is logged in
      if (user && startTime) {
        const testDuration = Date.now() - startTime
        saveTestResult(testDuration)
      }
    }

    // Check for errors
    if (value.length > userInput.length) {
      // User added a character
      const newChar = value[value.length - 1]
      const expectedChar = text[currentIndex]

      if (newChar !== expectedChar) {
        setErrors(errors + 1)
      }

      setCurrentIndex(currentIndex + 1)
    } else if (value.length < userInput.length) {
      // User deleted a character
      setCurrentIndex(value.length)
    }

    setUserInput(value)
  }

  const calculateWPM = () => {
    if (!startTime) return 0

    // Use current time if test is not finished
    const currentTime = endTime || Date.now()
    const timeInMinutes = (currentTime - startTime) / 60000

    // Calculate based on characters typed so far (5 characters = 1 word standard)
    const wordsTyped = userInput.length / 5

    // Adjust for steno mode (higher expectations)
    const stenoMultiplier = isStenoMode ? 1.5 : 1

    // Avoid division by zero
    if (timeInMinutes < 0.01) return 0

    return Math.round((wordsTyped / timeInMinutes) * stenoMultiplier)
  }

  const calculateAccuracy = () => {
    if (currentIndex === 0) return 100
    return Math.round(((currentIndex - errors) / currentIndex) * 100)
  }

  const renderText = () => {
    // For code mode, render with monospace and preserve whitespace
    if (isCodeMode && isPremium) {
      return (
        <pre className="whitespace-pre-wrap font-mono text-sm">
          {text.split("").map((char, index) => {
            let className = ""

            if (index < userInput.length) {
              className = userInput[index] === char ? "text-green-500" : "text-red-500"
            } else if (index === userInput.length) {
              className = "bg-gray-200 dark:bg-gray-700"
            }

            return (
              <span key={index} className={className}>
                {char}
              </span>
            )
          })}
        </pre>
      )
    }

    // For locked code mode
    if (isCodeMode && !isPremium) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Lock className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Premium Feature Locked</h3>
          <p className="text-muted-foreground mb-4">Code typing practice is available for premium members only.</p>
          <Button onClick={() => setIsPremiumOpen(true)}>
            <Crown className="mr-2 h-4 w-4" />
            Upgrade to Premium
          </Button>
        </div>
      )
    }

    // Regular text rendering
    return text.split("").map((char, index) => {
      let className = ""

      if (index < userInput.length) {
        className = userInput[index] === char ? "text-green-500" : "text-red-500"
      } else if (index === userInput.length) {
        className = "bg-gray-200 dark:bg-gray-700"
      }

      return (
        <span key={index} className={className}>
          {char}
        </span>
      )
    })
  }

  const getStenoTip = () => {
    if (calculateWPM() < 60) {
      return "Focus on brief forms for common words to increase your speed."
    } else if (calculateWPM() < 120) {
      return "Practice phrasing multiple words together in a single stroke."
    } else {
      return "Work on specialized dictionary entries for domain-specific terminology."
    }
  }

  // Auth functions
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!name || !email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    // Check if email already exists
    const existingUsers = localStorage.getItem("typingPracticeUsers")
    let users: Record<string, UserData> = {}

    if (existingUsers) {
      try {
        users = JSON.parse(existingUsers)
        if (users[email]) {
          toast({
            title: "Error",
            description: "This email is already registered",
            variant: "destructive",
          })
          return
        }
      } catch (e) {
        console.error("Failed to parse users data", e)
      }
    }

    // Create new user
    const newUser: UserData = {
      name,
      email,
      password,
      history: [],
      premium: null,
    }

    // Save to localStorage
    users[email] = newUser
    localStorage.setItem("typingPracticeUsers", JSON.stringify(users))
    localStorage.setItem("typingPracticeUser", JSON.stringify(newUser))

    // Update state
    setUser(newUser)
    setIsSignUpOpen(false)

    // Clear form
    setName("")
    setEmail("")
    setPassword("")

    toast({
      title: "Success",
      description: "Your account has been created",
    })
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    // Check credentials
    const existingUsers = localStorage.getItem("typingPracticeUsers")

    if (existingUsers) {
      try {
        const users: Record<string, UserData> = JSON.parse(existingUsers)
        const foundUser = users[email]

        if (!foundUser || foundUser.password !== password) {
          toast({
            title: "Error",
            description: "Invalid email or password",
            variant: "destructive",
          })
          return
        }

        // Login successful
        localStorage.setItem("typingPracticeUser", JSON.stringify(foundUser))
        setUser(foundUser)
        setIsLoginOpen(false)

        // Clear form
        setEmail("")
        setPassword("")

        toast({
          title: "Success",
          description: "You have been logged in",
        })
      } catch (e) {
        console.error("Failed to parse users data", e)
      }
    } else {
      toast({
        title: "Error",
        description: "No registered users found",
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("typingPracticeUser")
    setUser(null)
    toast({
      title: "Success",
      description: "You have been logged out",
    })
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to subscribe",
        variant: "destructive",
      })
      return
    }

    // Basic validation
    if (!cardNumber || !cardExpiry || !cardCvc) {
      toast({
        title: "Error",
        description: "Please fill in all payment details",
        variant: "destructive",
      })
      return
    }

    // Simulate subscription
    const startDate = new Date()
    const expiryDate = new Date()

    if (selectedPlan === "monthly") {
      expiryDate.setMonth(expiryDate.getMonth() + 1)
    } else {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1)
    }

    const premium: PremiumStatus = {
      plan: selectedPlan,
      startDate: startDate.toISOString(),
      expiryDate: expiryDate.toISOString(),
    }

    // Update user
    const updatedUser = {
      ...user,
      premium,
    }

    // Update localStorage
    localStorage.setItem("typingPracticeUser", JSON.stringify(updatedUser))

    // Update users collection
    const existingUsers = localStorage.getItem("typingPracticeUsers")
    if (existingUsers) {
      try {
        const users: Record<string, UserData> = JSON.parse(existingUsers)
        users[user.email] = updatedUser
        localStorage.setItem("typingPracticeUsers", JSON.stringify(users))
      } catch (e) {
        console.error("Failed to update users data", e)
      }
    }

    // Update state
    setUser(updatedUser)
    setIsPremiumOpen(false)

    // Clear form
    setCardNumber("")
    setCardExpiry("")
    setCardCvc("")

    toast({
      title: "Success",
      description: `You are now a premium member! Your subscription will expire on ${expiryDate.toLocaleDateString()}.`,
    })
  }

  const saveTestResult = (duration: number) => {
    if (!user) return

    const result: TestResult = {
      date: new Date().toISOString(),
      mode,
      difficulty,
      wpm: calculateWPM(),
      accuracy: calculateAccuracy(),
      duration,
    }

    // Update user history
    const updatedUser = {
      ...user,
      history: [...user.history, result],
    }

    // Update localStorage
    localStorage.setItem("typingPracticeUser", JSON.stringify(updatedUser))

    // Update users collection
    const existingUsers = localStorage.getItem("typingPracticeUsers")
    if (existingUsers) {
      try {
        const users: Record<string, UserData> = JSON.parse(existingUsers)
        users[user.email] = updatedUser
        localStorage.setItem("typingPracticeUsers", JSON.stringify(users))
      } catch (e) {
        console.error("Failed to update users data", e)
      }
    }

    // Update state
    setUser(updatedUser)

    toast({
      title: "Result Saved",
      description: `Your typing test result has been saved to your profile.`,
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const getBestScore = () => {
    if (!user || user.history.length === 0) return null

    return user.history.reduce((best, current) => {
      return current.wpm > best.wpm ? current : best
    }, user.history[0])
  }

  const getAverageWPM = () => {
    if (!user || user.history.length === 0) return 0

    const sum = user.history.reduce((total, result) => total + result.wpm, 0)
    return Math.round(sum / user.history.length)
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }

    return v
  }

  const renderPremiumBadge = () => {
    if (!user || !isPremium) return null

    return (
      <Badge
        variant="outline"
        className="ml-2 bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900 dark:text-amber-200 dark:border-amber-700"
      >
        <Crown className="h-3 w-3 mr-1 text-amber-500" />
        Premium
      </Badge>
    )
  }

  const renderProgressChart = () => {
    if (!user || user.history.length < 2) return null

    // Get the last 5 test results
    const recentTests = [...user.history].slice(-5)
    const maxWpm = Math.max(...recentTests.map((test) => test.wpm))

    return (
      <div className="p-4 border rounded-lg">
        <h3 className="text-lg font-medium mb-4">Recent Progress</h3>
        <div className="space-y-4">
          {recentTests.map((test, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{new Date(test.date).toLocaleDateString()}</span>
                <span className="font-medium">{test.wpm} WPM</span>
              </div>
              <Progress value={(test.wpm / maxWpm) * 100} className="h-2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <h1 className="text-4xl font-bold">Typing Practice</h1>
            {renderPremiumBadge()}
          </div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuLabel className="font-normal text-sm text-muted-foreground">
                  {user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {isPremium && user?.premium ? (
                  <DropdownMenuItem className="flex items-center">
                    <Crown className="h-4 w-4 mr-2 text-amber-500" />
                    <span>Premium until {new Date(user.premium.expiryDate).toLocaleDateString()}</span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => setIsPremiumOpen(true)}>
                    <Crown className="h-4 w-4 mr-2" />
                    <span>Upgrade to Premium</span>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span>Best WPM: {getBestScore()?.wpm || 0}</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Average WPM: {getAverageWPM()}</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Tests completed: {user.history.length}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Log in</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Log in to your account</DialogTitle>
                    <DialogDescription>Enter your credentials to access your account</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleLogin} className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="w-full">
                        Log in
                      </Button>
                    </DialogFooter>
                  </form>
                  <div className="mt-4 text-center text-sm">
                    <span className="text-muted-foreground">Don't have an account? </span>
                    <button
                      className="underline text-primary"
                      onClick={() => {
                        setIsLoginOpen(false)
                        setIsSignUpOpen(true)
                      }}
                    >
                      Sign up
                    </button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isSignUpOpen} onOpenChange={setIsSignUpOpen}>
                <DialogTrigger asChild>
                  <Button>Sign up</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create an account</DialogTitle>
                    <DialogDescription>Sign up to track your typing progress and save your results</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSignUp} className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="w-full">
                        Create account
                      </Button>
                    </DialogFooter>
                  </form>
                  <div className="mt-4 text-center text-sm">
                    <span className="text-muted-foreground">Already have an account? </span>
                    <button
                      className="underline text-primary"
                      onClick={() => {
                        setIsSignUpOpen(false)
                        setIsLoginOpen(true)
                      }}
                    >
                      Log in
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </header>

        {/* Premium Subscription Dialog */}
        <Dialog open={isPremiumOpen} onOpenChange={setIsPremiumOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Crown className="h-5 w-5 mr-2 text-amber-500" />
                Upgrade to Premium
              </DialogTitle>
              <DialogDescription>
                Unlock advanced features and enhance your typing practice experience
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className={`border-2 ${selectedPlan === "monthly" ? "border-primary" : "border-muted"}`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Monthly</CardTitle>
                    <CardDescription>$4.99 per month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant={selectedPlan === "monthly" ? "default" : "outline"}
                      className="w-full"
                      onClick={() => setSelectedPlan("monthly")}
                    >
                      {selectedPlan === "monthly" ? (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Selected
                        </>
                      ) : (
                        "Select"
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card className={`border-2 ${selectedPlan === "yearly" ? "border-primary" : "border-muted"}`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Yearly</CardTitle>
                    <CardDescription>$49.99 per year</CardDescription>
                    <Badge className="mt-1 bg-amber-100 text-amber-800 hover:bg-amber-100">Save 16%</Badge>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant={selectedPlan === "yearly" ? "default" : "outline"}
                      className="w-full"
                      onClick={() => setSelectedPlan("yearly")}
                    >
                      {selectedPlan === "yearly" ? (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Selected
                        </>
                      ) : (
                        "Select"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Premium Features:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                    <span>Code typing practice mode</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                    <span>Advanced progress analytics</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                    <span>Multiple text variants for each difficulty</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                    <span>Detailed performance insights</span>
                  </li>
                </ul>
              </div>

              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input
                    id="card-number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ""))}
                      placeholder="123"
                      maxLength={3}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full">
                    <Crown className="mr-2 h-4 w-4" />
                    Subscribe Now
                  </Button>
                </DialogFooter>
              </form>
            </div>
          </DialogContent>
        </Dialog>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center flex-wrap gap-4">
              <CardTitle>Practice Your Typing Skills</CardTitle>
              <div className="flex items-center gap-4">
                <Select value={mode} onValueChange={setMode}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular Typing</SelectItem>
                    <SelectItem value="steno">Stenography</SelectItem>
                    <SelectItem value="code">
                      <div className="flex items-center">
                        <span>Code Typing</span>
                        {!isPremium && <Lock className="ml-2 h-3 w-3" />}
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <CardDescription>
              {isCodeMode && isPremium
                ? "Practice typing code with proper syntax and indentation"
                : isStenoMode
                  ? "Practice stenography with legal and verbatim speech texts"
                  : "Type the text below as quickly and accurately as possible"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isStenoMode && (
              <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md text-sm">
                <p className="font-medium text-amber-800 dark:text-amber-300">Steno Mode Active</p>
                <p className="text-amber-700 dark:text-amber-400">
                  This mode features specialized texts for stenography practice.
                  {isStenoMode &&
                    difficulty === "hard" &&
                    " This text includes legal terminology and complex sentence structures."}
                </p>
              </div>
            )}

            {isCodeMode && isPremium && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md text-sm">
                <p className="font-medium text-blue-800 dark:text-blue-300">Code Mode Active</p>
                <p className="text-blue-700 dark:text-blue-400">
                  Practice typing code with proper syntax and indentation. Pay attention to brackets, semicolons, and
                  whitespace.
                </p>
              </div>
            )}

            <div
              className={`mb-6 leading-relaxed p-4 border rounded-md ${isCodeMode && isPremium ? "text-sm" : "text-lg"}`}
            >
              {renderText()}
            </div>

            {isPremium && (mode === "regular" || mode === "steno" || mode === "code") && (
              <div className="flex justify-end mb-4">
                <Button variant="outline" size="sm" onClick={nextText}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Next Text
                </Button>
              </div>
            )}

            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              disabled={isFinished || (mode === "code" && !isPremium)}
              className="w-full p-3 border rounded-md font-mono focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder={mode === "code" && !isPremium ? "Premium feature locked" : "Start typing here..."}
              autoFocus
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={resetTest} variant="outline">
              Reset
            </Button>

            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>{startTime && !endTime ? Math.round((Date.now() - startTime) / 1000) : 0}s</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-muted-foreground" />
                <span>{calculateWPM()} WPM</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-muted-foreground" />
                <span>{calculateAccuracy()}% Accuracy</span>
              </div>
            </div>
          </CardFooter>
        </Card>

        {isFinished && (
          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>Your typing performance</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="stats">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="stats">Statistics</TabsTrigger>
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                </TabsList>
                <TabsContent value="stats" className="space-y-4 pt-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center p-4 border rounded-lg">
                      <Clock className="h-8 w-8 mb-2 text-primary" />
                      <h3 className="text-lg font-medium">Time</h3>
                      <p className="text-2xl font-bold">{Math.round((endTime! - startTime!) / 1000)}s</p>
                    </div>
                    <div className="flex flex-col items-center p-4 border rounded-lg">
                      <BarChart2 className="h-8 w-8 mb-2 text-primary" />
                      <h3 className="text-lg font-medium">Speed</h3>
                      <p className="text-2xl font-bold">{calculateWPM()} WPM</p>
                    </div>
                    <div className="flex flex-col items-center p-4 border rounded-lg">
                      <Award className="h-8 w-8 mb-2 text-primary" />
                      <h3 className="text-lg font-medium">Accuracy</h3>
                      <p className="text-2xl font-bold">{calculateAccuracy()}%</p>
                    </div>
                  </div>

                  {isPremium && renderProgressChart()}

                  {!isPremium && user && (
                    <div className="p-4 border border-dashed rounded-lg bg-muted/30 mt-6">
                      <div className="flex items-center gap-3 mb-3">
                        <Crown className="h-5 w-5 text-amber-500" />
                        <h3 className="font-medium">Premium Feature</h3>
                      </div>
                      <p className="text-muted-foreground mb-3">
                        Upgrade to premium to see detailed progress charts and analytics.
                      </p>
                      <Button variant="outline" size="sm" onClick={() => setIsPremiumOpen(true)}>
                        Upgrade Now
                      </Button>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="analysis" className="pt-4">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Error Analysis</h3>
                      <p>Total errors: {errors}</p>
                      <p>Characters typed: {currentIndex}</p>
                      <p>Error rate: {Math.round((errors / currentIndex) * 100)}%</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Improvement Tips</h3>
                      {isStenoMode ? (
                        <p>{getStenoTip()}</p>
                      ) : isCodeMode ? (
                        <p>Focus on accuracy with special characters and proper indentation in code.</p>
                      ) : calculateWPM() < 30 ? (
                        <p>Focus on accuracy first, then gradually increase your speed.</p>
                      ) : calculateWPM() < 60 ? (
                        <p>Good speed! Try practicing with more complex texts to improve further.</p>
                      ) : (
                        <p>Excellent typing speed! Challenge yourself with the hard difficulty level.</p>
                      )}
                    </div>

                    {isPremium && (
                      <div className="p-4 border rounded-lg">
                        <h3 className="text-lg font-medium mb-2">Advanced Analysis</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Characters per minute</p>
                            <p className="text-xl font-medium">{calculateWPM() * 5}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Consistency score</p>
                            <p className="text-xl font-medium">{Math.max(0, 100 - errors * 5)}%</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button onClick={resetTest} className="w-full">
                Try Again
              </Button>
            </CardFooter>
          </Card>
        )}

        {!user && isFinished && (
          <div className="mt-6 p-4 border rounded-md bg-muted/50">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-primary" />
              <p className="font-medium">Sign up to save your results and track your progress over time!</p>
            </div>
            <Button className="mt-3" variant="outline" onClick={() => setIsSignUpOpen(true)}>
              Create an account
            </Button>
          </div>
        )}

        {user && !isPremium && (
          <div className="mt-8 p-6 border rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950">
            <div className="flex items-center gap-3 mb-4">
              <Crown className="h-6 w-6 text-amber-500" />
              <h2 className="text-xl font-bold">Upgrade to Premium</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Code Typing Practice</p>
                  <p className="text-sm text-muted-foreground">Master programming syntax</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Multiple Text Variants</p>
                  <p className="text-sm text-muted-foreground">Never type the same text twice</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Advanced Analytics</p>
                  <p className="text-sm text-muted-foreground">Track your progress over time</p>
                </div>
              </div>
            </div>
            <Button onClick={() => setIsPremiumOpen(true)}>
              <Crown className="mr-2 h-4 w-4" />
              Upgrade Now
            </Button>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  )
}
