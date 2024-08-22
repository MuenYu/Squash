const labels = ["Upload & Select", "Compressing", "Complete"];

const Steps = ({ step }) => {
  return (
    <ul className="w-2/3 steps steps-vertical lg:steps-horizontal">
      {labels.map((label, i) => (
        <li key={i} className={`step ${i <= step ? "step-primary" : ""}`}>
          {label}
        </li>
      ))}
    </ul>
  );
};

export default Steps;
