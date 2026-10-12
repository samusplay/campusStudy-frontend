export default function FieldError({ messages }: { messages?: string[] }) {
  if (!messages || messages.length === 0) return null;

  return (
    <p className="mt-1 bg-red-600 p-2 text-center text-xs font-bold text-white uppercase">
      {messages[0]}
    </p>
  );
}