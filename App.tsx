
import React, { useState, useCallback, useRef } from 'react';
import { MemeTemplate } from './types';
import { MEME_TEMPLATES, MEME_GENRES } from './constants';
import { generateCaptions, analyzeImage, editImage, generateImage } from './services/geminiService';
import Spinner from './components/Spinner';
import ShareButtons from './components/ShareButtons';

interface ImageFile {
  base64: string;
  mimeType: string;
  dataUrl: string;
}

type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
const ASPECT_RATIOS: AspectRatio[] = ['1:1', '16:9', '9:16', '4:3', '3:4'];

const MemeCanvas: React.FC<{ imageSrc: string; caption: string }> = ({ imageSrc, caption }) => (
  <div className="relative w-full max-w-lg mx-auto bg-black rounded-lg shadow-lg overflow-hidden">
    <img src={imageSrc} alt="Meme" className="w-full h-auto object-contain max-h-[60vh]" />
    {caption && (
      <div 
        className="absolute bottom-4 left-4 right-4 text-center p-2 break-words"
        style={{ fontFamily: 'Impact, Arial Black, sans-serif', textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 5px #000' }}
      >
        <span className="text-3xl md:text-4xl lg:text-5xl text-white uppercase leading-tight">
          {caption}
        </span>
      </div>
    )}
  </div>
);

const App: React.FC = () => {
  const [image, setImage] = useState<ImageFile | null>(null);
  const [captions, setCaptions] = useState<string[]>([]);
  const [selectedCaption, setSelectedCaption] = useState<string>('');
  const [genre, setGenre] = useState<string>('General');
  const [editPrompt, setEditPrompt] = useState<string>('');
  const [generationPrompt, setGenerationPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [loading, setLoading] = useState({ captions: false, analysis: false, edit: false, generation: false });
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const base64 = dataUrl.split(',')[1];
        setImage({ base64, mimeType: file.type, dataUrl });
        resetState();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTemplateSelect = async (template: MemeTemplate) => {
    try {
        const response = await fetch(template.url);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            const base64 = dataUrl.split(',')[1];
            setImage({ base64, mimeType: blob.type, dataUrl });
            resetState();
        };
        reader.readAsDataURL(blob);
    } catch (err) {
        setError('Failed to load template image.');
        console.error(err);
    }
  };
  
  const resetState = () => {
      setCaptions([]);
      setSelectedCaption('');
      setEditPrompt('');
      setError(null);
  }

  const handleGenerateCaptions = useCallback(async () => {
    if (!image) return;
    setLoading(prev => ({ ...prev, captions: true }));
    setError(null);
    try {
      const result = await generateCaptions(image.base64, image.mimeType, genre);
      setCaptions(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(prev => ({ ...prev, captions: false }));
    }
  }, [image, genre]);

  const handleAnalyzeImage = useCallback(async () => {
      if (!image) return;
      setLoading(prev => ({ ...prev, analysis: true }));
      setError(null);
      try {
          const description = await analyzeImage(image.base64, image.mimeType);
          alert(`Image Analysis:\n\n${description}`);
      } catch (err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
          setLoading(prev => ({ ...prev, analysis: false }));
      }
  }, [image]);

  const handleEditImage = useCallback(async () => {
    if (!image || !editPrompt) return;
    setLoading(prev => ({ ...prev, edit: true }));
    setError(null);
    try {
      const newDataUrl = await editImage(image.base64, image.mimeType, editPrompt);
      const newBase64 = newDataUrl.split(',')[1];
      const newMimeType = newDataUrl.match(/data:(.*);/)?.[1] || 'image/png';
      setImage({ base64: newBase64, mimeType: newMimeType, dataUrl: newDataUrl });
      // Clear captions as they might not be relevant anymore
      setCaptions([]);
      setSelectedCaption('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(prev => ({ ...prev, edit: false }));
    }
  }, [image, editPrompt]);
  
  const handleGenerateImage = useCallback(async () => {
    if (!generationPrompt) return;
    setLoading(prev => ({ ...prev, generation: true }));
    setError(null);
    try {
      const newDataUrl = await generateImage(generationPrompt, aspectRatio);
      const newBase64 = newDataUrl.split(',')[1];
      const newMimeType = newDataUrl.match(/data:(.*);/)?.[1] || 'image/png';
      setImage({ base64: newBase64, mimeType: newMimeType, dataUrl: newDataUrl });
      resetState();
    } catch (err) {
       setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(prev => ({ ...prev, generation: false }));
    }
  }, [generationPrompt, aspectRatio]);

  const triggerFileUpload = () => {
      fileInputRef.current?.click();
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            AI Meme Generator
          </h1>
          <p className="mt-2 text-lg text-slate-300">Create viral memes with the power of Gemini AI</p>
        </header>
        
        {error && <div className="max-w-3xl mx-auto bg-red-500/20 text-red-300 p-3 rounded-md mb-4 text-center">{error}</div>}

        {!image ? (
          <div className="max-w-3xl mx-auto">
            <div className="bg-slate-800 rounded-lg p-8 shadow-2xl mb-8">
              <h2 className="text-2xl font-bold text-center mb-6">Start Creating</h2>
              <div className="flex justify-center mb-6">
                  <button onClick={triggerFileUpload} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105">
                    Upload an Image
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </div>
              
              <div className="relative text-center my-6">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-slate-600"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-slate-800 px-2 text-sm uppercase text-slate-400">Or</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-center mb-4">Generate an Image with AI</h3>
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    value={generationPrompt}
                    onChange={(e) => setGenerationPrompt(e.target.value)}
                    placeholder="e.g., A cat wearing sunglasses on a skateboard"
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2 text-center">Aspect Ratio:</label>
                    <div className="flex justify-center gap-2 flex-wrap">
                      {ASPECT_RATIOS.map(ratio => (
                        <button
                          key={ratio}
                          onClick={() => setAspectRatio(ratio)}
                          className={`px-3 py-1 rounded-md text-sm font-semibold transition ${aspectRatio === ratio ? 'bg-cyan-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
                        >
                          {ratio}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={handleGenerateImage} disabled={loading.generation || !generationPrompt} className="bg-sky-600 hover:bg-sky-700 disabled:bg-sky-800 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg text-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-105">
                    {loading.generation ? <Spinner /> : '🚀 Generate'}
                  </button>
                </div>
              </div>

            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-center mb-4">Or use a popular template</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {MEME_TEMPLATES.map(template => (
                  <div key={template.id} onClick={() => handleTemplateSelect(template)} className="cursor-pointer group transition-transform duration-300 ease-in-out hover:-translate-y-1">
                    <img src={template.url} alt={template.name} className="rounded-md shadow-lg transition-all duration-300 group-hover:opacity-80 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-cyan-500/20" />
                    <p className="text-center text-sm mt-2 text-slate-400 group-hover:text-slate-100 transition-colors duration-300">{template.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column: Canvas */}
            <div className="flex flex-col items-center">
              <MemeCanvas imageSrc={image.dataUrl} caption={selectedCaption} />
               <button onClick={() => {setImage(null); setError(null);}} className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm">
                 Start Over
               </button>
               <ShareButtons image={image} caption={selectedCaption} />
            </div>

            {/* Right Column: Controls */}
            <div className="bg-slate-800 rounded-lg p-6 shadow-2xl">

              {/* Step 1: Caption Generation */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">1. Generate Captions</h3>
                
                <div className="mb-4">
                  <p className="text-sm text-center text-slate-400 mb-2">Select a Genre:</p>
                  <div className="flex justify-center gap-2 flex-wrap">
                      {MEME_GENRES.map(g => (
                          <button
                              key={g}
                              onClick={() => setGenre(g)}
                              className={`px-3 py-1 rounded-md text-sm font-semibold transition ${genre === g ? 'bg-cyan-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
                          >
                              {g}
                          </button>
                      ))}
                  </div>
                </div>

                <div className="flex gap-2">
                    <button onClick={handleGenerateCaptions} disabled={loading.captions} className="flex-1 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-800 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2">
                      {loading.captions ? <Spinner /> : '✨ Magic Caption'}
                    </button>
                     <button onClick={handleAnalyzeImage} disabled={loading.analysis} className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-800 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2">
                      {loading.analysis ? <Spinner /> : '🧠 Analyze Image'}
                    </button>
                </div>

                {captions.length > 0 && (
                  <div className="mt-4">
                    <p className="text-slate-300 mb-2">Click a caption to apply it:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {captions.map((caption, index) => (
                        <button key={index} onClick={() => setSelectedCaption(caption)} className={`p-2 rounded-md text-left text-sm transition ${selectedCaption === caption ? 'bg-cyan-500 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>
                          {caption}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2: Image Editing */}
              <div>
                <h3 className="text-xl font-semibold mb-3">2. Edit Your Image</h3>
                <p className="text-slate-400 text-sm mb-2">Try things like "add a retro filter" or "make it black and white".</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder="Enter an edit prompt..."
                    className="flex-grow bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <button onClick={handleEditImage} disabled={loading.edit || !editPrompt} className="bg-sky-600 hover:bg-sky-700 disabled:bg-sky-800 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2">
                     {loading.edit ? <Spinner /> : '🎨 Apply Edit'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;