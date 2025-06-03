import { useEffect, useState } from "react";
import ChatContentArea from "./components/chats/chatContent";
import ChatInputArea from "./components/chats/chatInput";
import Header from "./components/header";
import styled from "styled-components";
import "./styles/index.css";

const SidePanelComponent = ({
  setView,
  chatQues,
  handleSendChat,
  connectSocket,
  closeWebSocket,
}) => {
  const [taskItem, setTaskItem] = useState(null);

  useEffect(() => {
    if (!taskItem?.taskId) return;

    const ipAddress = localStorage.getItem("ipAddress");
    connectSocket(ipAddress);
  }, [taskItem?.taskId]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.action === "TASK_RIGHT_CLICKED") {
        setTaskItem((prev) => ({
          ...prev,
          text: event.data.task?.taskText || "",
          taskId: event.data.task?.taskId,
        }));
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <SidePanelWrapper>
      <Header setView={setView} closeConnection={closeWebSocket} />
      {taskItem?.text ? <p>Selected task: {taskItem?.text}</p> : null}
      <ChatAreaStyle>
        <ChatContentArea chats={chatQues} />
        <ChatInputArea
          initialText={taskItem?.text}
          handleSendChat={handleSendChat}
        />
      </ChatAreaStyle>
    </SidePanelWrapper>
  );
};

const SidePanelWrapper = styled.aside`
  width: 100vw;
  height: 100vh;
`;

const ChatAreaStyle = styled.div`
  width: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 87vh;
`;
export default SidePanelComponent;
