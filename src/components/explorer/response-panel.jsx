"use client";
import * as React from "react";
import axios from "axios";
import { Clock, Bot, Eye, Copy, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRequest } from "@/components/explorer/request-context";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Preview Visualization Component
function PreviewVisualization({ data }) {
  const [viewMode, setViewMode] = React.useState("table");
  const [cardDesign, setCardDesign] = React.useState("minimal");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate loading for better UX
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const parseData = () => {
    try {
      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      return [];
    }
  };

  const parsedData = parseData().filter(item =>
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  const headers = parsedData.length > 0 ? Object.keys(parsedData[0]) : [];

  const copyToClipboard = () => {
    const text = JSON.stringify(parsedData, null, 2);
    navigator.clipboard.writeText(text);
    // Optional: Add toast notification here
  };

  const renderTableView = () => (
    <div className="overflow-x-auto rounded-lg border border-gray-700">
      <table className="w-full text-sm text-left text-gray-200">
        <thead className="text-xs uppercase bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 font-semibold">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {parsedData.map((row, index) => (
            <tr key={index} className="border-t border-gray-700 hover:bg-gray-800/50 transition-colors">
              {headers.map((header) => (
                <td key={header} className="px-4 py-3 max-w-[200px] truncate">
                  {typeof row[header] === "object"
                    ? <span className="text-gray-400">{JSON.stringify(row[header])}</span>
                    : String(row[header])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderCardView = () => {
    const cardStyles = {
      minimal: "bg-gray-900 border border-gray-700 rounded-lg p-4",
      detailed: "bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow",
      compact: "bg-gray-900 border border-gray-700 rounded-md p-2 text-xs",
      modern: "bg-gray-900 border-2 border-gradient-to-r from-indigo-500 to-purple-500 rounded-lg p-4",
      elegant: "bg-gray-900 border border-gray-700 rounded-lg p-4 glow-effect",
    };

    const renderCardContent = (item) => (
      <div className="space-y-2">
        {Object.entries(item).map(([key, value]) => (
          <div key={key} className={cardDesign === "compact" ? "flex" : "block"}>
            <span className="font-medium text-blue-400 mr-2">{key}:</span>
            <span className="text-gray-200 break-words">
              {typeof value === "object" ? JSON.stringify(value) : String(value)}
            </span>
          </div>
        ))}
      </div>
    );

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {parsedData.map((item, index) => (
          <motion.div
            key={index}
            className={cardStyles[cardDesign]}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {renderCardContent(item)}
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto bg-black border border-gray-700 rounded-xl">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-8"
          >
            <motion.svg
              className="h-12 w-12 text-gray-400"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
              <path fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z" className="opacity-75" />
            </motion.svg>
            <p className="mt-4 text-gray-400">Loading preview...</p>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h3 className="text-xl font-semibold text-white">Data Visualization</h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                <div className="flex items-center gap-4">
                  <Tabs value={viewMode} onValueChange={setViewMode} className="w-auto">
                    <TabsList className="grid grid-flow-col auto-cols-max gap-2 h-9 bg-gray-800/50 rounded-lg p-1">
                      <TabsTrigger
                        value="table"
                        className="text-sm py-1 px-4 rounded-md font-medium transition-all text-gray-300 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 hover:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
                      >
                        Table
                      </TabsTrigger>
                      <TabsTrigger
                        value="cards"
                        className="text-sm py-1 px-4 rounded-md font-medium transition-all text-gray-300 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 hover:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
                      >
                        Cards
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  {viewMode === "cards" && (
                    <Select value={cardDesign} onValueChange={setCardDesign}>
                      <SelectTrigger className="w-[140px] bg-gray-800 text-gray-200 border-gray-700 rounded-lg">
                        <SelectValue placeholder="Card Design" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-gray-200 border-gray-700 rounded-lg">
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="detailed">Detailed</SelectItem>
                        <SelectItem value="compact">Compact</SelectItem>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="elegant">Elegant</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={copyToClipboard}
                        className="bg-gray-800 text-gray-200 p-2 rounded-lg hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 transition-colors"
                        aria-label="Copy data to clipboard"
                      >
                        <Copy className="h-4 w-4" />
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent>Copy to Clipboard</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            {viewMode === "table" && (
              <div className="mb-4 relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search data..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-gray-200 rounded-lg"
                />
              </div>
            )}
            {parsedData.length === 0 ? (
              <div className="text-red-400 text-center py-8">No valid data to display</div>
            ) : (
              <motion.div
                key={viewMode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {viewMode === "table" ? renderTableView() : renderCardView()}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ResponsePanel({ requestId }) {
  const { responses } = useRequest();
  const response = responses[requestId];
  const [responseTab, setResponseTab] = React.useState("body");
  const [selectedResponseIndex, setSelectedResponseIndex] = React.useState(0);
  const [errorExplanation, setErrorExplanation] = React.useState(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);

  const isArray = Array.isArray(response);
  const currentResponse = isArray ? response[selectedResponseIndex] : response;

  const hasBody = currentResponse?.body && currentResponse.body.trim() !== "";
  const hasHeaders =
    currentResponse?.headers && Object.keys(currentResponse.headers).length > 0;
  const hasCookies =
    currentResponse?.cookies && Object.keys(currentResponse.cookies).length > 0;

  const explainError = async () => {
    if (!currentResponse || currentResponse.statusCode < 400) return;

    setIsLoadingExplanation(true);
    setIsDialogOpen(true);
    try {
      const errorMessage = JSON.stringify({
        statusCode: currentResponse.statusCode,
        statusText: currentResponse.statusText,
        body: currentResponse.body,
      });

      const res = await axios.post("http://localhost:3001/api/explain", { errorMessage });
      setErrorExplanation(res.data.explanation);
    } catch (err) {
      if (err.response && err.response.status === 429) {
        setErrorExplanation("AI is overloaded! Please wait and try again soon.");
      } else {
        setErrorExplanation("Failed to fetch explanation.");
      }
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  const highlightJson = (text) => {
    try {
      if (typeof text !== "string" || (!text.trim().startsWith("{") && !text.trim().startsWith("["))) {
        return <span className="text-gray-500">{text}</span>;
      }
      const json = JSON.parse(text);
      const formatted = JSON.stringify(json, null, 2);
      return formatted.split("\n").map((line, index) => {
        const keyColor = "text-blue-400";
        const stringColor = "text-green-400";
        const numberColor = "text-orange-400";
        const boolColor = "text-purple-400";
        const nullColor = "text-gray-500";
        const bracketColor = "text-gray-400";

        if (line.match(/^\s*[{\[\]}],?/)) {
          return <div key={index} className={bracketColor}>{line}</div>;
        }
        if (line.includes(":")) {
          const [keyPart, valuePart] = line.split(":").map((part) => part.trim());
          const keyMatch = keyPart.match(/"([^"]+)"/);
          const key = keyMatch ? keyMatch[1] : keyPart;

          let coloredValue;
          const trimmedValue = valuePart.replace(/,$/, "");
          if (trimmedValue.match(/^"[^"]*"/)) {
            coloredValue = <span className={stringColor}>{valuePart}</span>;
          } else if (!isNaN(Number(trimmedValue))) {
            coloredValue = <span className={numberColor}>{valuePart}</span>;
          } else if (trimmedValue === "true" || trimmedValue === "false") {
            coloredValue = <span className={boolColor}>{valuePart}</span>;
          } else if (trimmedValue === "null") {
            coloredValue = <span className={nullColor}>{valuePart}</span>;
          } else {
            coloredValue = <span className="text-gray-200">{valuePart}</span>;
          }
          return (
            <div key={index} className="flex">
              <span className={`${keyColor} mr-2`}>{keyPart}:</span>
              {coloredValue}
            </div>
          );
        }
        return <div key={index}>{line}</div>;
      });
    } catch (e) {
      return <span className="text-gray-500">{text}</span>;
    }
  };

  const getStatusColor = (status) => {
    if (!status) return "";
    if (status >= 200 && status < 300) return "bg-green-900/50 text-green-300 border-green-800/50";
    if (status >= 400) return "bg-red-900/50 text-red-300 border-red-800/50";
    if (status >= 300) return "bg-yellow-900/50 text-yellow-300 border-yellow-800/50";
    return "bg-gray-900/50 text-gray-300 border-black/50";
  };

  return (
    <div className="rounded-xl border shadow-lg h-full min-h-[200px] max-h-[450px] flex flex-col overflow-hidden border-gray-800 bg-black text-gray-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-3 border-b border-gray-800 bg-black">
        <div className="flex items-center space-x-3 mb-2 sm:mb-0">
          <h3 className="text-base font-semibold text-white">Response</h3>
          {currentResponse?.statusCode && (
            <Badge
              className={`text-xs py-0.5 px-2 font-medium ${getStatusColor(currentResponse.statusCode)} rounded-full`}
            >
              {currentResponse.statusCode}{" "}
              {currentResponse.statusText && <span className="ml-1"> - {currentResponse.statusText}</span>}
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {hasBody && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsPreviewOpen(true)}
                    className=" text-white px-4 py-1.5 rounded-lg text-sm font-medium flex items-center shadow-md hover:shadow-lg transition-shadow"
                    aria-label="Preview response data"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>View Data Preview</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {isArray && (
            <select
              value={selectedResponseIndex}
              onChange={(e) => setSelectedResponseIndex(Number(e.target.value))}
              className=" text-gray-200 border border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500"
              aria-label="Select response"
            >
              {response.map((_, index) => (
                <option key={index} value={index}>
                  Response {index + 1}
                </option>
              ))}
            </select>
          )}
          {currentResponse?.responseTime && (
            <div className="flex items-center text-sm text-gray-300">
              <Clock className="mr-1 h-4 w-4 text-indigo-400" />
              <span className="font-medium">{currentResponse.responseTime}</span>ms
            </div>
          )}
        </div>
  </div>

      {/* AI Error Detection */}
      {currentResponse?.statusCode >= 400 && (
        <div className="p-4 border-b border-gray-800 text-sm text-gray-200 bg-gray-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-red-400" />
              <span className="font-medium">Error Detected</span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={explainError}
                    disabled={isLoadingExplanation}
                    className=" text-white px-4 py-1.5 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-shadow"
                    aria-label="Analyze error"
                  >
                    Analyze Error
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>Analyze Error Details</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      )}

      {/* AI Analysis Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-black border border-gray-700 max-w-2xl p-0 overflow-hidden rounded-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="p-6"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Bot className="h-6 w-6 text-indigo-400" />
              <h2 className="text-xl font-semibold text-white">Error Analysis</h2>
            </div>
            <AnimatePresence mode="wait">
              {isLoadingExplanation ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-8"
                >
                  <motion.svg
                    className="h-12 w-12 text-gray-400"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z" className="opacity-75" />
                  </motion.svg>
                  <p className="mt-4 text-gray-400">Analyzing error...</p>
                </motion.div>
              ) : errorExplanation ? (
                <motion.div
                  key="explanation"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="p-4 max-h-[60vh] overflow-y-auto bg-gray-900/50 rounded-lg"
                >
                  <p className="text-sm text-gray-200 whitespace-pre-wrap font-mono">{errorExplanation}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="bg-black border border-gray-700 max-w-[90vw] sm:max-w-4xl p-0 overflow-hidden rounded-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="p-4 sm:p-6"
          >
            <PreviewVisualization data={currentResponse?.body} />
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Response Content */}
      {!currentResponse || (!hasBody && !hasHeaders && !hasCookies) ? (
        <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
          No response data available
        </div>
      ) : (
        <Tabs value={responseTab} onValueChange={setResponseTab} className="flex-1 flex flex-col overflow-auto">
          <div className="px-4 py-2 border-b border-gray-800 bg-black">
            <TabsList className="grid grid-flow-col auto-cols-max gap-2 h-9 bg-black rounded-lg p-1">
              {hasBody && (
                <TabsTrigger
                  value="body"
                  className="text-sm py-1 px-4 rounded-md font-medium transition-all text-gray-300  hover:text-white "
                >
                  Body
                </TabsTrigger>
              )}
              {hasHeaders && (
                <TabsTrigger
                  value="headers"
                  className="text-sm py-1 px-4 rounded-md font-medium transition-all text-gray-300  hover:text-white "
                >
                  Headers <span className="ml-1 text-gray-400">({Object.keys(currentResponse.headers).length})</span>
                </TabsTrigger>
              )}
              {hasCookies && (
                <TabsTrigger
                  value="cookies"
                  className="text-sm py-1 px-4 rounded-md font-medium transition-all text-gray-300 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 hover:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
                >
                  Cookies <span className="ml-1 text-gray-400">({Object.keys(currentResponse.cookies).length})</span>
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          {hasBody && (
            <TabsContent value="body" className="m-0 p-0 flex-1 overflow-y-auto">
              <div className="h-full overflow-auto p-4 sm:p-6">
                <div className="text-xs font-mono whitespace-pre-wrap break-words rounded-lg p-4 bg-gray-900/50 border border-gray-800 shadow-inner">
                  {highlightJson(currentResponse.body)}
                </div>
              </div>
            </TabsContent>
          )}
          {hasHeaders && (
            <TabsContent value="headers" className="m-0 p-0 flex-1 overflow-y-auto">
              <div className="h-full overflow-auto p-4 sm:p-6">
                <div className="space-y-2 text-sm">
                  {Object.entries(currentResponse.headers).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center py-2 px-4 rounded-lg transition-colors hover:bg-gray-800/50"
                    >
                      <span className="w-1/3 font-medium truncate text-blue-400">{key}</span>
                      <span className="flex-1 text-gray-200 truncate">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          )}
          {hasCookies && (
            <TabsContent value="cookies" className="m-0 p-0 flex-1 overflow-hidden">
              <div className="h-full overflow-auto p-4 sm:p-6">
                <div className="space-y-2 text-sm">
                  {Object.entries(currentResponse.cookies).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center py-2 px-4 rounded-lg transition-colors hover:bg-gray-800/50"
                    >
                      <span className="w-1/3 font-medium truncate text-blue-400">{key}</span>
                      <span className="flex-1 text-gray-200 truncate">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  );
}