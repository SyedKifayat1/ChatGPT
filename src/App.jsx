import React,{useState,useEffect} from 'react'
import Sidebar from './Components/Sidebar/Sidebar'
import Main from './Components/Main/Main'
import "./Components/Sidebar/Sidebar.css"

const App = () => {
  
  // const [isOpen, setIsOpen] = useState(false);

  //   const toggleSidebar = () => {
  //       setIsOpen(!isOpen);
  //   };

  const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Function to check screen width and set isOpen accordingly
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

  return (
    <>

      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar}  />
      <div className={`main ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Main isOpen={isOpen}/>
      </div>

    </>
  )
}

export default App