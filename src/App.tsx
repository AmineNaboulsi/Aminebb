import { useEffect, useState } from 'react';
import Cover from './Images/cover.png';
import './index.css';

interface KeyResponse {
  success: boolean;
  KeyAcces?: string;
  keyId?: number;
}

function App() {
  const [generatedKey, setGeneratedKey] = useState<string>('');
  const [url] = useState<string>(import.meta.env.VITE_API_URL +'/api/upload');

  useEffect(() => {
    const Id = localStorage.getItem("Id") ?? '0';
    if (Id !== '0') {
      const apiUrl = import.meta.env.VITE_API_URL;

      fetch(`${apiUrl}/api/getkey?id=${Id}`, {
        method: 'POST'
      })
        .then((res) => res.json())
        .then((data: KeyResponse) => {
          if (data.success && data.KeyAcces) {
            setGeneratedKey(data.KeyAcces);
          }
        })
        .catch(error => console.error('Error:', error));
    }
  }, []);

  const generateKey = () => {
    const key = makeid(8);
    fetch(import.meta.env.VITE_API_URL +`/api/setkey?key=${key}`, {
      method: 'POST'
    })
      .then((res) => res.json())
      .then((data: KeyResponse) => {
        if (data.keyId && data.keyId !== 0 && data.success) {
          localStorage.setItem("Id", data.keyId.toString());
          setGeneratedKey(key);
        }
      })
      .catch(error => console.error('Error:', error));
  };

  function makeid(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  return (
    <>
      <header className="h-14 flex justify-center items-center px-3 bg-white shadow-gray-200 shadow-lg">
        <span>AmineBB</span>
      </header>
      
      <section className="container mx-5 mt-10 grid grid-cols-1 gap-2">
        <div className="grid grid-cols-[1fr,20%] max-md:grid-cols-[1fr,30%] gap-3 items-center ">
          <div className="grid  gap-2 p-3">
            <h2 className="text-xl">API version 1 Beta</h2>
            <span>This key will allow you to</span>
            <div className="flex items-center justify-between h-10 bg-gray-50 border-[1px] border-gray-500 rounded-md">
              <span className="pl-4">{generatedKey}</span>
              {!generatedKey && (
                <div 
                  onClick={generateKey} 
                  className="bg-gray-300 h-full rounded-md px-4 transition-all cursor-pointer flex items-center hover:bg-gray-500 hover:text-white"
                >
                  <span>Generate Key</span>
                </div>
              )}
            </div>
            {generatedKey && (
              <div className="mt-4">
                <span className="cursor-not-allowed text-white bg-red-400 w-auto px-3 py-2 rounded-md">
                  Delete Key
                </span>
              </div>
            )}
          </div>
          
          <img 
            style={{ height: '200px' }} 
            src={Cover}
            alt="Cover" 
          />
        </div>
        
        <div className="p-3 grid gap-2">
          <div className="p-3 flex flex-col gap-2 bg-white shadow-gray-200 shadow-lg">
            <span className="text-xl">Request method</span>
            <span className="text-sm">
              API v1 calls can be done using the POST or GET request methods but since GET request are limited by the maximum allowed length of an URL you should prefer the POST request method.
            </span>
            <div className="bg-gray-50 p-2 border-[1px] border-gray-500 rounded-md">
              {url}
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <span className="text-xl">Parameters</span>
            <span className="text-lg">key (required)</span>
            <ul className="list-disc pl-5">
              <li><span className="text-sm">The API key.</span></li>
            </ul>
            <span className="text-lg">imgbase64 (required)</span>
            <ul className="list-disc pl-5">
              <li>
                <span className="text-sm">A binary file, base64 data, or a URL for an image. (up to 32 MB)</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
      
      <div className="fixed bottom-1 left-0 right-0 flex justify-center">
        <span>Made with ❤️ by Amine</span>
      </div>
    </>
  );
}

export default App;
