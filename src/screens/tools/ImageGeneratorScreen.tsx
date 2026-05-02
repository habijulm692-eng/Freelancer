import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, Sparkles, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleGenAI } from '@google/genai';

export function ImageGeneratorScreen() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const generateImage = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY });
      
      const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1'
        }
      });

      if (response.generatedImages && response.generatedImages.length > 0) {
        const base64Image = response.generatedImages[0].image.imageBytes;
        setGeneratedImage(`data:image/jpeg;base64,${base64Image}`);
      }
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please check your API key, or try making your prompt safer/clearer.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `AI_Image_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-6 space-y-6 min-h-screen pb-24 bg-slate-950"
    >
      <header className="flex items-center space-x-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-slate-900 rounded-full text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-white">AI Image Generator</h1>
      </header>

      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Describe the image you want</label>
            <textarea 
              rows={3}
              placeholder="e.g., A futuristic workspace with glowing neon lights, cyberpunk style"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all text-white placeholder:text-slate-600 resize-none"
            />
          </div>
          
          <button 
            onClick={generateImage}
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-medium py-3.5 rounded-xl flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
          >
            {isGenerating ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles size={18} />
                <span>Generate Image</span>
              </>
            )}
          </button>
        </div>

        {generatedImage && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 p-4 rounded-3xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Your Masterpiece</h2>
              <button 
                onClick={handleDownload}
                className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-sm transition-colors"
              >
                <Download size={16} />
                <span>Save</span>
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-square flex items-center justify-center relative">
              <img 
                src={generatedImage} 
                alt="AI Generated" 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
