import styled from "styled-components";

const ChatContentArea = ({ chatQuestions }) => {
  return (
    <ContentAreaStyle>
      {chatQuestions?.map((chatQues) => (
        <div key={chatQues.id} className="ques_wrapper">
          {chatQues?.questions?.map((item, index) => (
            <div key={index}>
              <p className="ques_wrapper_item">{item.ques}</p>
              {item.reply && <p className="ques_wrapper_reply">{item.reply}</p>}
            </div>
          ))}
        </div>
      ))}
    </ContentAreaStyle>
  );
};

const ContentAreaStyle = styled.section`
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

  .ques_wrapper_item{
  background: rgba(244, 244, 244, 1);
  padding: 8px 16px;
  border-radius: 30px;
  width: max-content;
  margin-left: auto;
  }
`;

export default ChatContentArea;
