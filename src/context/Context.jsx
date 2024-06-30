// ContextProvider.js
import React, { createContext, useEffect, useState } from "react";
import run from "../Config/gemini"; // Adjust path as per your project structure
export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkScreenWidth = () => {
      if (window.innerWidth > 776) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };
    // Initial check on component mount
    checkScreenWidth();
    // Event listener for window resize to adjust isOpen state
    const handleResize = () => {
      checkScreenWidth();
    };
    window.addEventListener('resize', handleResize);
    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array ensures effect runs only once on mount

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const newChat = () => {
    setPrevPrompts([]);
    if (window.innerWidth < 776) {
      setIsOpen(false);
      
    }
    setShowResult(false);
  }

  const onSent = async (prompt) => {
    setLoading(true);
    setShowResult(true);

    const currentPrompt = prompt;
    setInput("");

    try {
      const response = await run(currentPrompt);

      let escapedResponse = response
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');


      escapedResponse = `<pre><code>${escapedResponse}</code></pre>`;

      let responseArray = escapedResponse.split("**");
      let newResponse = "";
      for (let i = 0; i < responseArray.length; i++) {
        if (i % 2 === 1) {
          newResponse += `<span class="bold-text">${responseArray[i]}</span>`;
        } else {
          newResponse += responseArray[i];
        }
      }
      let formattedResponse = newResponse.split("*").join("");
      formattedResponse = formattedResponse.split("`").join("");

      setPrevPrompts((prev) => [
        ...prev,
        { prompt: currentPrompt, result: formattedResponse },
      ]);


      setResultData(formattedResponse);
    } catch (error) {
      console.error("Error in running model:", error);
      setResultData("Error: Unable to process the request");
    }

    setLoading(false);
  };

  const delayPara = (index, nextWord) => {
    // Delay rendering of each word
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };


  const contextValue = {
    prevPrompts,
    onSent,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
    toggleSidebar,
    isOpen,
    setIsOpen,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;

