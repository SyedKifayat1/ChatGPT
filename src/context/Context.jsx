// import { createContext, useState } from "react";
// import run from "../Config/gemini";

// export const Context = createContext();

// const ContextProvider = (props) => {
//     const [input, setInput] = useState("");
//     const [recentPrompt, setRecentPrompt] = useState("");
//     const [prevPrompts, setPrevPrompts] = useState([]);
//     const [showResult, setShowResult] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [resultData, setResultData] = useState("");

//     const delayPara = (index, nextWord) => {
//         setTimeout(() => {
//             setResultData(prev => prev + nextWord);
//         }, 75 * index);
//     };

//     const newChat = () => {
//         setLoading(false);
//         setShowResult(false);
//         setPrevPrompts([]); // Clear previous prompts
//     };

//     const onSent = async (prompt) => {
//         setResultData("");
//         setLoading(true);
//         setShowResult(true);
//         let response;
//         if (prompt !== undefined) {
//             response = await run(prompt);
//             setRecentPrompt(prompt);
//         } else {
//             setRecentPrompt(input);
//             response = await run(input);
//         }

//         let responseArray = response.split("**");
//         let newResponse = "";
//         for (let i = 0; i < responseArray.length; i++) {
//             if (i === 0 || i % 2 !== 1) {
//                 newResponse += responseArray[i];
//             } else {
//                 newResponse += "<b>" + responseArray[i] + "</b>";
//             }
//         }

//         let newResponse2 = newResponse.split("*").join("</br>");
//         let newResponseArray = newResponse2.split(" ");
//         for (let i = 0; i < newResponseArray.length; i++) {
//             const nextWord = newResponseArray[i];
//             delayPara(i, nextWord + " ");
//         }
        
//         // Add the new prompt and its result to prevPrompts
//         setPrevPrompts(prev => [...prev, { prompt: prompt !== undefined ? prompt : input, result: newResponse2 }]);
        
//         setLoading(false);
//         setInput("");
//     };

//     const contextValue = {
//         prevPrompts,
//         setPrevPrompts,
//         onSent,
//         setRecentPrompt,
//         recentPrompt,
//         showResult,
//         loading,
//         resultData,
//         input,
//         setInput,
//         newChat,
//     };

//     return (
//         <Context.Provider value={contextValue}>
//             {props.children}
//         </Context.Provider>
//     );
// };

// export default ContextProvider;

// ContextProvider.js
import React, { createContext, useState } from "react";
import run from "../Config/gemini"; // Adjust path as per your project structure

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const onSent = async () => {
    setLoading(true);
    setShowResult(true);

    const currentPrompt = input.trim();
    setInput("");

    try {
      const response = await run(currentPrompt);

      setPrevPrompts((prev) => [
        ...prev,
        { prompt: currentPrompt, result: response },
      ]);

      setResultData(response);
    } catch (error) {
      console.error("Error in running model:", error);
      setResultData("Error: Unable to process the request");
    }

    setLoading(false);
  };

  const contextValue = {
    prevPrompts,
    onSent,
    showResult,
    loading,
    resultData,
    input,
    setInput,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;

