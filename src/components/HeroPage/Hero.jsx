"use client"

import { useContext, useState } from "react"
import { motion } from "framer-motion"
import { Code, Database, Zap, ChevronRight, Github, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthContext } from "@/context/AuthContext"
import Link from "next/link"

export default function ApiExplorerLanding() {
  const { user, logout } = useContext(AuthContext); // Get user and logout from AuthContext

  const [apiResponse, setApiResponse] = useState(
    '{\n  "status": "success",\n  "data": {\n    "message": "API response will appear here",\n    "timestamp": "' +
      new Date().toISOString() +
      '"\n  }\n}',
  )

  const simulateApiCall = () => {
    setApiResponse(
      '{\n  "status": "success",\n  "data": {\n    "message": "Request processed successfully",\n    "user": {\n      "id": "usr_' +
        Math.random().toString(36).substr(2, 9) +
        '",\n      "name": "John Doe",\n      "plan": "Pro"\n    },\n    "timestamp": "' +
        new Date().toISOString() +
        '"\n  }\n}',
    )
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-black opacity-90"></div>
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 bg-[#121212] opacity-70"></div>
          {/* Animated particles/grid effect */}
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-purple-500/20"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 4 + 1}px`,
                  height: `${Math.random() * 4 + 1}px`,
                }}
                animate={{
                  y: [0, Math.random() * 100 - 50],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
            ))}
          </div>
        </div>

        <div className="container mx-auto z-10 max-w-6xl">
          <div className="flex flex-col items-center text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-cyan-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                Explore APIs with Ease
              </motion.h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl md:text-2xl text-gray-300 max-w-3xl"
            >
              The ultimate platform for developers to discover, test, and integrate APIs seamlessly
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 mt-8"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href={`${user ? '/workspaces' : '/login'}`}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 rounded-md px-8 py-6 text-lg shadow-[0_0_15px_rgba(124,58,237,0.5)]"
                >
                  Get Started <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-2 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md px-8 py-6 text-lg"
                >
                  View Documentation
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
            <ChevronRight className="h-8 w-8 text-gray-400 transform rotate-90" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#0D0D0D]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to explore, test, and integrate APIs into your applications
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="h-10 w-10 text-purple-500" />,
                title: "Real-time Testing",
                description: "Test API endpoints in real-time with a powerful and intuitive interface",
                delay: 0.2,
              },
              {
                icon: <Code className="h-10 w-10 text-blue-500" />,
                title: "Code Generation",
                description: "Automatically generate code snippets in multiple programming languages",
                delay: 0.4,
              },
              {
                icon: <Database className="h-10 w-10 text-cyan-500" />,
                title: "Response Sandbox",
                description: "Explore and manipulate API responses in an interactive sandbox environment",
                delay: 0.6,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: feature.delay }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-[#1A1A1A] p-8 rounded-xl border border-gray-800 hover:border-gray-700 shadow-xl hover:shadow-2xl hover:shadow-purple-900/10 transition-all duration-300"
              >
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg inline-block mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 bg-[#121212]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Try It Yourself</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the power of our API Explorer with this interactive demo
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-[#1A1A1A] rounded-xl border border-gray-800 shadow-xl overflow-hidden"
          >
            <div className="border-b border-gray-800 bg-[#0D0D0D] p-4 flex items-center">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="mx-auto text-gray-400 text-sm font-mono">API Explorer Demo</div>
            </div>

            <div className="p-6">
              <Tabs defaultValue="request" className="w-full">
                <TabsList className="bg-[#0D0D0D] border border-gray-800">
                  <TabsTrigger value="request">Request</TabsTrigger>
                  <TabsTrigger value="response">Response</TabsTrigger>
                </TabsList>
                <TabsContent value="request" className="mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="bg-purple-600 text-white px-3 py-1 rounded text-sm font-bold">GET</div>
                      <Input
                        className="flex-1 bg-[#0D0D0D] border-gray-800 text-gray-300"
                        defaultValue="https://api.example.com/v1/users"
                      />
                    </div>

                    <div className="bg-[#0D0D0D] border border-gray-800 rounded-md p-4">
                      <h4 className="text-sm font-semibold mb-2 text-gray-400">Headers</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <Input
                          className="bg-[#161616] border-gray-800 text-gray-300 text-sm"
                          defaultValue="Authorization"
                        />
                        <Input
                          className="col-span-2 bg-[#161616] border-gray-800 text-gray-300 text-sm"
                          defaultValue="Bearer api_key_12345"
                        />
                      </div>
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={simulateApiCall}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white w-full py-6"
                      >
                        Send Request
                      </Button>
                    </motion.div>
                  </div>
                </TabsContent>
                <TabsContent value="response" className="mt-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-[#0D0D0D] border border-gray-800 rounded-md p-4 font-mono text-sm"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-green-500 font-semibold">200 OK</div>
                      <div className="text-gray-500 text-xs">200ms</div>
                    </div>
                    <pre className="text-gray-300 whitespace-pre-wrap overflow-auto max-h-[300px]">{apiResponse}</pre>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-[#0D0D0D]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">What Developers Say</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Join thousands of developers who have transformed their API workflow
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "This tool has completely transformed how our team interacts with APIs. The time savings are incredible.",
                author: "Sarah Chen",
                role: "Senior Developer at TechCorp",
                delay: 0.2,
              },
              {
                quote:
                  "The code generation feature alone has saved me countless hours. I can't imagine going back to my old workflow.",
                author: "Marcus Johnson",
                role: "Full Stack Engineer",
                delay: 0.4,
              },
              {
                quote:
                  "As someone who works with multiple APIs daily, this platform has become an essential part of my toolkit.",
                author: "Priya Sharma",
                role: "API Architect at DevStream",
                delay: 0.6,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: testimonial.delay }}
                className="bg-[#1A1A1A] p-8 rounded-xl border border-gray-800 shadow-xl"
              >
                <div className="mb-4 text-purple-400">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10.667 13.333H5.33366C5.33366 8 9.33366 5.333 13.3337 5.333L12.0003 8C10.667 9.333 10.667 11.333 10.667 13.333ZM21.3337 13.333H16.0003C16.0003 8 20.0003 5.333 24.0003 5.333L22.667 8C21.3337 9.333 21.3337 11.333 21.3337 13.333ZM24.0003 16V18.667C24.0003 20 22.667 21.333 21.3337 21.333H18.667V24C18.667 25.333 17.3337 26.667 16.0003 26.667H13.3337C12.0003 26.667 10.667 25.333 10.667 24V21.333H8.00033C6.66699 21.333 5.33366 20 5.33366 18.667V16C5.33366 14.667 6.66699 13.333 8.00033 13.333H18.667V16C18.667 17.333 20.0003 18.667 21.3337 18.667H24.0003Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <p className="text-gray-300 mb-6 italic">{testimonial.quote}</p>
                <div>
                  <p className="font-bold">{testimonial.author}</p>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] p-12 rounded-2xl border border-gray-800 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-purple-500/10"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    width: `${Math.random() * 6 + 2}px`,
                    height: `${Math.random() * 6 + 2}px`,
                  }}
                  animate={{
                    y: [0, Math.random() * 100 - 50],
                    opacity: [0.1, 0.3, 0.1],
                  }}
                  transition={{
                    duration: Math.random() * 10 + 10,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />
              ))}
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Transform Your API Workflow?</h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of developers who have already improved their API development experience
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 rounded-md px-8 py-6 text-lg shadow-[0_0_15px_rgba(124,58,237,0.5)]"
                >
                  Get Started for Free <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] border-t border-gray-800 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <Code className="h-6 w-6 text-purple-500" />
                <span className="text-xl font-bold">API Explorer</span>
              </div>
              <p className="text-gray-400 mb-4">
                The ultimate platform for developers to discover, test, and integrate APIs seamlessly.
              </p>
              <div className="flex space-x-4">
                <motion.a
                  href="#"
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className="text-gray-400 hover:text-white"
                >
                  <Twitter className="h-5 w-5" />
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className="text-gray-400 hover:text-white"
                >
                  <Github className="h-5 w-5" />
                </motion.a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                {["Features", "Pricing", "Documentation", "Changelog"].map((item, i) => (
                  <li key={i}>
                    <motion.a
                      href="#"
                      className="text-gray-400 hover:text-white block"
                      whileHover={{ x: 3, transition: { duration: 0.2 } }}
                    >
                      {item}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                {["API Directory", "Tutorials", "Blog", "Community"].map((item, i) => (
                  <li key={i}>
                    <motion.a
                      href="#"
                      className="text-gray-400 hover:text-white block"
                      whileHover={{ x: 3, transition: { duration: 0.2 } }}
                    >
                      {item}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                {["About", "Careers", "Contact", "Legal"].map((item, i) => (
                  <li key={i}>
                    <motion.a
                      href="#"
                      className="text-gray-400 hover:text-white block"
                      whileHover={{ x: 3, transition: { duration: 0.2 } }}
                    >
                      {item}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} API Explorer. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <motion.a
                href="#"
                className="text-gray-500 hover:text-white text-sm"
                whileHover={{ color: "#A855F7", transition: { duration: 0.2 } }}
              >
                Privacy Policy
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-500 hover:text-white text-sm"
                whileHover={{ color: "#A855F7", transition: { duration: 0.2 } }}
              >
                Terms of Service
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-500 hover:text-white text-sm"
                whileHover={{ color: "#A855F7", transition: { duration: 0.2 } }}
              >
                Cookie Policy
              </motion.a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
