import "./Message.css";

type MessageProps = {
  variant: "info" | "success" | "warning" | "error";
  message: string;
};

export default function Message({ variant, message }: MessageProps) {
  return <div className={`${message} ${variant} `}>{message}</div>;
}
