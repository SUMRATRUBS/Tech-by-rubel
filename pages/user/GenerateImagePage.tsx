
import React, { useState } from 'react';
import { useGlobalState } from '../../context/GlobalStateContext';
import { generateImage } from '../../services/geminiService';
import { GeneratedImage } from '../../types';
import toast from 'react-hot-toast';
import { GallerySkeleton } from '../../components/SkeletalLoader';
import { CloseIcon } from '../../components/icons/IconComponents';

const GenerateImagePage: React.FC = () => {
    const { state, deductCredits } = useGlobalState();
    const { currentUser } = state;

    const [prompt, setPrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [stylePreset, setStylePreset] = useState('photographic');
    
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState<GeneratedImage[]>([]);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            toast.error("Please enter a prompt.");
            return;
        }
        if (currentUser && currentUser.credits < 1 && currentUser.role !== 'admin') {
            toast.error("You don't have enough credits.");
            return;
        }

        setIsLoading(true);
        const loadingToast = toast.loading('Generating your masterpiece...');

        try {
            const fullPrompt = `${prompt} --style ${stylePreset}${negativePrompt ? ` --no ${negativePrompt}` : ''}`;
            const imageUrl = await generateImage(fullPrompt, aspectRatio);
            const newImage: GeneratedImage = {
                id: `img-${Date.now()}`,
                url: imageUrl,
                prompt: prompt,
            };
            setImages(prev => [newImage, ...prev]);
            
            if (currentUser && currentUser.role !== 'admin') {
                deductCredits(currentUser.id, 1);
            }
            toast.success('Image generated successfully!', { id: loadingToast });

        } catch (error: any) {
            toast.error(error.message || 'Failed to generate image.', { id: loadingToast });
        } finally {
            setIsLoading(false);
        }
    };

    const deleteImage = (id: string) => {
        setImages(prev => prev.filter(img => img.id !== id));
        toast.success('Image removed from session.');
    };

    const downloadImage = (url: string, name: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = `${name.replace(/\s+/g, '_')}.jpeg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Create Your Image</h2>
                <div className="space-y-4">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Enter your prompt here, e.g., 'A majestic lion in a futuristic city, cinematic lighting'"
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple transition h-24 resize-none"
                    />
                     <textarea
                        value={negativePrompt}
                        onChange={(e) => setNegativePrompt(e.target.value)}
                        placeholder="Negative prompt (optional), e.g., 'ugly, blurry, bad art'"
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple transition h-16 resize-none"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Aspect Ratio</label>
                            <select value={aspectRatio} onChange={e => setAspectRatio(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple">
                                <option value="1:1">Square (1:1)</option>
                                <option value="16:9">Landscape (16:9)</option>
                                <option value="9:16">Portrait (9:16)</option>
                                <option value="4:3">Standard (4:3)</option>
                                <option value="3:4">Tall (3:4)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Style Preset</label>
                            <select value={stylePreset} onChange={e => setStylePreset(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple">
                                <option value="photographic">Photographic</option>
                                <option value="cinematic">Cinematic</option>
                                <option value="digital-art">Digital Art</option>
                                <option value="fantasy-art">Fantasy Art</option>
                                <option value="anime">Anime</option>
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="w-full bg-brand-purple text-white font-bold py-3 rounded-md hover:bg-purple-700 transition-transform transform hover:scale-105 duration-300 disabled:bg-gray-500 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Generating...
                            </>
                        ) : (
                            'Generate (1 Credit)'
                        )}
                    </button>
                </div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Session Gallery</h2>
                {isLoading && images.length === 0 ? <GallerySkeleton /> : null}
                {images.length === 0 && !isLoading ? (
                    <p className="text-gray-400 text-center py-8">Your generated images will appear here.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map(image => (
                            <div key={image.id} className="group relative rounded-lg overflow-hidden">
                                <img src={image.url} alt={image.prompt} className="w-full h-full object-cover aspect-square transition-transform duration-300 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex flex-col justify-end p-4">
                                    <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0 line-clamp-2">{image.prompt}</p>
                                    <div className="flex space-x-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                                        <button onClick={() => downloadImage(image.url, image.prompt)} className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Download</button>
                                    </div>
                                </div>
                                 <button onClick={() => deleteImage(image.id)} className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <CloseIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenerateImagePage;
