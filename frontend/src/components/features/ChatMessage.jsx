import { ThinkingDots } from '../ui/Loader'

export default function ChatMessage({ message, isUser = false, isLoading = false }) {
    if (isLoading) {
        return (
            <div className="flex items-start gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-brand-card border border-brand-border flex items-center justify-center text-xs flex-shrink-0">
                    🤖
                </div>
                <div className="chat-ai px-4 py-2">
                    <ThinkingDots />
                </div>
            </div>
        )
    }

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            {!isUser && (
                <div className="w-8 h-8 rounded-full bg-brand-card border border-brand-border flex items-center justify-center text-xs flex-shrink-0 mr-3 mt-1">
                    🤖
                </div>
            )}
            <div
                className={`max-w-[75%] px-4 py-3 text-sm font-body ${isUser ? 'chat-user' : 'chat-ai text-text-primary'
                    }`}
            >
                <p className="whitespace-pre-wrap leading-relaxed">{message}</p>
            </div>
        </div>
    )
}
