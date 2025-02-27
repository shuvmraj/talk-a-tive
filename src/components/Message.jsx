const Message = ({ msg, isSelf }) => {
    return (
      <div className={`flex ${isSelf ? "justify-end" : "justify-start"} mb-2`}>
        <div className={`p-2 rounded-lg max-w-xs ${isSelf ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
          <strong>{msg.user}:</strong> {msg.text}
        </div>
      </div>
    );
  };
  
  export default Message;
  