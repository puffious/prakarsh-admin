import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

const Docs = () => {
  return (
    <div style={{ minHeight: "100vh", background: "#0b1021", padding: "24px" }}>
      <div style={{ maxWidth: "1080px", margin: "0 auto", background: "#0f172a", borderRadius: "12px", padding: "16px", boxShadow: "0 10px 40px rgba(0,0,0,0.35)" }}>
        <SwaggerUI url="/openapi.json" docExpansion="list" defaultModelsExpandDepth={0} deepLinking supportedSubmitMethods={[]} />
      </div>
    </div>
  );
};

export default Docs;
