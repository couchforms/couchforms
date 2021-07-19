type ProgressBarProps = {
  progress: number;
  colorPrimary: string;
};

export default function ProgressBar({
  progress,
  colorPrimary,
}: ProgressBarProps) {
  return (
    <div className="relative pt-1">
      <div
        style={{
          backgroundColor: colorPrimary + "20",
        }}
        className="overflow-hidden h-2 text-xs flex"
      >
        <div
          style={{
            width: `${Math.round(progress * 100)}%`,
            backgroundColor: colorPrimary + "99",
          }}
          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
        ></div>
      </div>
    </div>
  );
}
