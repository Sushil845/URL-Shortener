import axios from "axios";
import { useState } from "react";
import bg from "./assets/url-shortener.png";

export default function App() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/short`,
        {
          originalUrl,
        }
      );

      setShortUrl(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          URL Shortener
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Enter URL to shorten"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            required
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white rounded-md py-2 font-semibold hover:bg-blue-700"
          >
            Shorten
          </button>
        </form>

        <div className="mt-6 min-h-[220px] flex flex-col items-center justify-center text-center">
          {shortUrl && (
            <>
              <p className="text-sm font-semibold mb-2">Short URL</p>

              <a
                href={shortUrl.shortUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline break-all"
              >
                {shortUrl.shortUrl}
              </a>

              <img
                src={shortUrl.qrcodeImg}
                alt="QR Code"
                className="mt-4 w-40 h-40"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
