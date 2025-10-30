
import React from 'react';

interface ImageFile {
  base64: string;
  mimeType: string;
  dataUrl: string;
}

interface ShareButtonsProps {
  image: ImageFile | null;
  caption: string;
}

// SVG Icons
const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const TwitterIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
    </svg>
);

const FacebookIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
    </svg>
);

const RedditIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12.006 2.5A9.506 9.506 0 002.5 12.006a9.506 9.506 0 009.506 9.506 9.506 9.506 0 009.506-9.506A9.506 9.506 0 0012.006 2.5zM8.11 13.522a.5.5 0 01.896-.03l1.579 2.33a.499.499 0 01-.313.842 1.503 1.503 0 01-1.92-.083.497.497 0 01-.138-.45l.23-.49a.5.5 0 01.37-.31l1.09-.2a.5.5 0 00.322-.853l-2.216-1.156zM9.06 9.613a1.249 1.249 0 11-2.498 0 1.249 1.249 0 012.498 0zm6.223 3.909l-2.216 1.156a.5.5 0 00.322.853l1.09.2a.5.5 0 01.37.31l.23.49a.497.497 0 01-.138.45 1.503 1.503 0 01-1.92.083.499.499 0 01-.313-.842l1.579-2.33a.5.5 0 01.896.03zm.74-3.909a1.249 1.249 0 11-2.498 0 1.249 1.249 0 012.498 0zm2.71 4.755c-.08-.533-.51-.93-1.044-.93s-.964.397-1.044.93c-.02.131-.03.264-.03.4a2.25 2.25 0 004.5 0c0-.136-.01-.269-.03-.4z" clipRule="evenodd"></path>
    </svg>
);


const ShareButtons: React.FC<ShareButtonsProps> = ({ image, caption }) => {
  if (!image) return null;

  const wrapText = (context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const words = text.toUpperCase().split(' ');
    let line = '';
    const lines = [];

    // Build lines from the end of the text backwards
    for (let i = words.length - 1; i >= 0; i--) {
        const testLine = words[i] + ' ' + line;
        const metrics = context.measureText(testLine.trim());
        if (metrics.width > maxWidth && line.length > 0) {
            lines.unshift(line.trim());
            line = words[i] + ' ';
        } else {
            line = testLine;
        }
    }
    lines.unshift(line.trim());
    
    // Draw the lines from the bottom up
    for(let i = 0; i < lines.length; i++) {
        const currentY = y - ((lines.length - 1 - i) * lineHeight);
        context.strokeText(lines[i], x, currentY);
        context.fillText(lines[i], x, currentY);
    }
  }


  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      if (caption) {
        const fontSize = Math.floor(img.width / 12);
        const lineHeight = fontSize * 1.2;
        ctx.font = `bold ${fontSize}px Impact, Arial Black, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = Math.floor(fontSize / 15);
        
        const x = canvas.width / 2;
        const y = canvas.height - (fontSize * 0.2); // Small padding from bottom
        const maxWidth = canvas.width - 40;

        wrapText(ctx, caption, x, y, maxWidth, lineHeight);
      }

      const link = document.createElement('a');
      link.download = 'ai-meme.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = image.dataUrl;
  };

  const shareUrl = encodeURIComponent("https://studio.google.com/ai/app/project/gemini-pro-template");
  const shareText = encodeURIComponent("Check out this meme I made with the AI Meme Generator! #AIMeme");

  return (
    <div className="mt-6 text-center w-full max-w-lg">
      <h3 className="text-lg font-semibold mb-3">Share Your Creation</h3>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={handleDownload}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center transition-transform transform hover:scale-105"
        >
          <DownloadIcon />
          Download
        </button>
        <a
          href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#1DA1F2] hover:bg-[#0c85d0] text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-105"
        >
          <TwitterIcon />
          <span>Share</span>
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#1877F2] hover:bg-[#166eeb] text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-105"
        >
          <FacebookIcon />
          <span>Share</span>
        </a>
        <a
          href={`https://www.reddit.com/submit?url=${shareUrl}&title=${shareText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#FF4500] hover:bg-[#e03d00] text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-105"
        >
          <RedditIcon />
          <span>Share</span>
        </a>
      </div>
       <p className="text-xs text-gray-500 mt-3">Tip: Download your meme first, then share it!</p>
    </div>
  );
};

export default ShareButtons;
