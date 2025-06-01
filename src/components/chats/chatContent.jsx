import { useEffect, useRef } from "react";
import styled from "styled-components";

const ChatContentArea = ({ chats }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  return (
    <ContentAreaStyle>
      {chats?.map((item, index) => (
        <div key={index} className="ques_wrapper">
          {item.from === "assistant" && (
            <p className="ques_wrapper_reply">{item.text}</p>
          )}
          {item.from === "user" && (
            <p className="ques_wrapper_item">{item.text}</p>
          )}
        </div>
      ))}
      <div ref={bottomRef} />
    </ContentAreaStyle>
  );
};

const ContentAreaStyle = styled.section`
  max-height: 670px;
  overflow-y: auto;

  .ques_wrapper {
    margin-bottom: 1.8rem;
  }

  .ques_wrapper_item,
  .ques_wrapper_reply {
    font-size: 14px;
    font-weight: 400;
    line-height: 26px;
    color: rgba(32, 33, 36, 1);
    margin-bottom: 0.75rem;
  }

  .ques_wrapper_item {
    background: rgba(244, 244, 244, 1);
    padding: 8px 16px;
    border-radius: 30px;
    width: max-content;
    margin-left: auto;
  }
`;

export default ChatContentArea;
