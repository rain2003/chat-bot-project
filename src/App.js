import './App.css';
import sendBtn from './assets/send.svg';
import mic from './assets/mic.svg'
import React, { useEffect, useRef, useState } from 'react';
import { sendMessage } from './resp';

function App() {
  const [input, setInput] = useState('');
  const msgEnd = useRef(null);
  const [messages, setMessages] = useState([
    {
      text: "Hello! How can I assist you today? Please type your question or request, and I'll do my best to provide a helpful response.",
      isBot: true,
    },
  ]);
  
  useEffect(() => {
    msgEnd.current.scrollIntoView();
  }, [messages]);

  const handleAskQuestion = async () => {
    const text = input;
    setInput('');
    setMessages([...messages, { text, isBot: false }]);
    const res = await sendMessage(input);
    setMessages([
      ...messages,
      { text: input, isBot: false },
      { text: res, isBot: true },
    ]);
  };

  const handleChangeQuestion = (event) => {
    setInput(event.target.value);
  };

  const handleEnter = async (e) => {
    if (e.key === 'Enter') await handleAskQuestion();
  };

  return (
    <div className='App bg-[#03021f] h-[100vh] w-[100%]'>
      <div className='main flex flex-col justify-start items-center'>
        <div className='chatname text-white p-6 text-6xl '>Chat Bot</div>
        <div className='chats'>
          {messages.map((message, i) => (
            <div
              key={i}
              className={
                message.isBot
                  ? 'bot flex items-start space-x-5 text-justify'
                  : 'chat flex items-start space-x-5 text-justify'
              }
            >
              {message.isBot ? (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='currentColor'
                  className='w-[40px] h-[40px] text-white'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25'
                  />
                </svg>
              ) : (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='currentColor'
                  className='w-[40px] h-[40px] text-white'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z'
                  />
                </svg>
              )}
              <p className='txt text-gray-400'>{message.text}</p>
            </div>
          ))}
          <div ref={msgEnd}></div>
        </div>
        <div className='chatfooter w-[100%] flex flex-col justify-center items-center'>
          <div className='inp flex items-center'>
            <input
              id='question'
              placeholder='Send a message'
              type='text'
              name='text'
              value={input}
              onChange={handleChangeQuestion}
              onKeyDown={handleEnter}
            />
            <button className='send' onClick={handleAskQuestion}>
  <img src={sendBtn} alt='send' style={{ marginRight: '10px' }}></img>

            </button>
            <button className='send' onClick={handleAskQuestion}>
  <img src={mic} alt='send' style={{ marginRight: '10px' }}></img>

            </button>
          </div>
          <p className='text-white'>
            Ask anything you want to ask, just type your message in this input box
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;