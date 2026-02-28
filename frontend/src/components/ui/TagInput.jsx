import { useState } from 'react'

export default function TagInput({ tags = [], onChange, placeholder = 'Type and press Enter...' }) {
    const [input, setInput] = useState('')

    const addTag = () => {
        const tag = input.trim()
        if (tag && !tags.includes(tag)) {
            onChange([...tags, tag])
        }
        setInput('')
    }

    const removeTag = (idx) => {
        onChange(tags.filter((_, i) => i !== idx))
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addTag()
        }
        if (e.key === 'Backspace' && !input && tags.length) {
            removeTag(tags.length - 1)
        }
    }

    return (
        <div className="flex flex-wrap items-center gap-2 p-3 border-b-2 border-brand-border focus-within:border-brand-cyan transition-colors duration-300">
            {tags.map((tag, i) => (
                <span
                    key={i}
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-mono bg-brand-cyan/15 text-brand-cyan rounded-full border border-brand-cyan/30"
                >
                    {tag}
                    <button
                        type="button"
                        onClick={() => removeTag(i)}
                        className="ml-1 hover:text-white transition-colors"
                    >
                        ×
                    </button>
                </span>
            ))}
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={tags.length === 0 ? placeholder : ''}
                className="flex-1 min-w-[120px] bg-transparent text-text-primary text-sm font-body outline-none"
            />
        </div>
    )
}
