import { useState } from "react";
import ChatContentArea from "./components/chats/chatContent";
import ChatInputArea from "./components/chats/chatInput";
import Header from "./components/header";
import styled from "styled-components";
import "./index.css";

function App() {
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
  return (
    <SidePanelWrapper>
      <Header />

      <ChatAreaStyle>
        <ChatContentArea chatQuestions={chatQues} />
        <ChatInputArea />
      </ChatAreaStyle>
    </SidePanelWrapper>
  );
}

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
