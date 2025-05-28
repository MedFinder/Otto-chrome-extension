import { useState } from "react";
import ChatContentArea from "./components/chats/chatContent";
import ChatInputArea from "./components/chats/chatInput";
import Header from "./components/header";
import styled from "styled-components";
import "./index.css";

const App =()=> {
  const params = new URLSearchParams(window.location.search);
  const [view, setView] = useState(params.get("view"));
  const [chatQues, setChatQues] = useState([
    {
      id: 1,
      questions: [
        {
          ques: "Book a dentist appointment",
          reply:
            "I can better assist if you provide me access to your calendar. Would you like to do that?",
        },
      ],
    },
    {
      id: 2,
      questions: [
        {
          ques: "Yes",
          reply: "",
        },
      ],
    },
  ]);

  const handleClick = () => {
    setView("sidepanel");
    window.parent.postMessage({ action: "close-float-icon" }, "*");
  };

  if (!view) return <FloatIconStyle onClick={handleClick} />; // default view
  return (
    <>
      {view === "float-icon" && <FloatIconStyle onClick={handleClick} />}
      {view === "panel" && (
        <SidePanelWrapper>
          <Header />

          <ChatAreaStyle>
            <ChatContentArea chatQuestions={chatQues} />
            <ChatInputArea />
          </ChatAreaStyle>
        </SidePanelWrapper>
      )}
    </>
  );
}

const FloatIconStyle = styled.button`
  width: 50px;
  height: 50px;
  background-size: cover;
  background-image: url(${chrome.runtime?.getURL("icons/otto-logo_128.png")});
  cursor: pointer;
  border: none;
`;

const SidePanelWrapper = styled.aside`
  width: auto;
  height: 100vh;
  height: 100vh;
`;

const ChatAreaStyle = styled.div`
  width: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 90vh;
`;
export default App;
