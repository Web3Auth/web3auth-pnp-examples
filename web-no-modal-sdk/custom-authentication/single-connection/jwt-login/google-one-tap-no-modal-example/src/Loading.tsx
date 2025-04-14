import loader from "./spinner.svg"; // Tell webpack this JS file uses this image

const Loading = () => (
  <div style={{ textAlign: "center" }}>
    <img src={loader} height="200px" alt="Loading" />
  </div>
);

export default Loading;
