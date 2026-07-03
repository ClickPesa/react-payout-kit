const Spinner = ({ height = 24 }: { height?: number }) => (
  <div
    style={{
      height,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        width: 16,
        height: 16,
        border: "2px solid #1890ff",
        borderTopColor: "transparent",
        borderRadius: "50%",
        animation: "react-payout-kit-spin 0.8s linear infinite",
      }}
    />
    <style>{`@keyframes react-payout-kit-spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export default Spinner;
