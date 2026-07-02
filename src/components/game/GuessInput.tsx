import { memo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface GuessInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  errorMessage: string;
  disabled?: boolean;
}

/** Text input + submit — cohesive glass card style */
const GuessInput = memo(function GuessInput({
  value,
  onChange,
  onSubmit,
  errorMessage,
  disabled,
}: GuessInputProps) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !disabled && value.length > 0) {
        onSubmit();
      }
    },
    [disabled, value, onSubmit]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 5);
      onChange(val);
    },
    [onChange]
  );

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/80 shadow-sm">
      <div className="flex gap-2 max-w-sm mx-auto">
        <Input
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a 5-letter word..."
          maxLength={5}
          disabled={disabled}
          className="text-center text-lg font-bold tracking-widest uppercase bg-white border-gray-200"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
        <Button
          onClick={onSubmit}
          disabled={disabled || value.length === 0}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold px-6 shadow-sm"
        >
          Guess!
        </Button>
      </div>
      {errorMessage && (
        <p className="text-xs text-rose-500 font-semibold animate-shake text-center mt-2">
          {errorMessage}
        </p>
      )}
    </div>
  );
});

export default GuessInput;
