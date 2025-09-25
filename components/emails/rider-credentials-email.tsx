type RiderCredentialsEmailProps = {
    email?: string;
    password?: string;
    name?: string;
};

const RiderCredentialsEmail = ({
    email = "000000",
    password = "000000",
    name = "000000",
  }: RiderCredentialsEmailProps) => {
    return (
      <div
        style={{
          fontFamily: "sans-serif",
          backgroundColor: "#f9fafb",
          padding: "40px",
          margin: "0",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "24px",
              textAlign: "center",
              backgroundColor: "#FF9F0E",
            }}
          >
            <img
              src="https://zhmvauvnmdwyajryuyqg.supabase.co/storage/v1/object/public/pragxi-public//pragxi-logo.png"
              alt="Logo"
              style={{
                width: "80px",
                height: "80px",
                margin: "0 auto 20px auto",
                borderRadius: "16px",
                display: "block",
              }}
            />
            <h1
              style={{
                color: "#ffffff",
                margin: "0",
                fontSize: "24px",
                fontWeight: 600,
              }}
            >
              Account Credentials
            </h1>
          </div>
  
          {/* Body */}
          <div
            style={{
              padding: "32px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "16px",
                color: "#1f2937",
                margin: "0 0 12px 0",
              }}
            >
              Hello, {name}
            </p>
            <p
              style={{
                fontSize: "16px",
                color: "#1f2937",
                margin: "0 0 24px 0",
              }}
            >
              Your account has been created successfully. Your credentials are as
              follows:
            </p>
            <div style={{ margin: "32px 0" }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "16px 24px",
                  fontSize: "14px",
                  backgroundColor: "#f3f4f6",
                  color: "#585d6a",
                  borderRadius: "6px",
                }}
              >
                Email: {email}
              </span>
              <br />
              <span
                style={{
                  display: "inline-block",
                  padding: "16px 24px",
                  fontSize: "14px",
                  backgroundColor: "#f3f4f6",
                  color: "#585d6a",
                  borderRadius: "6px",
                }}
              >
                Password: {password}
              </span>
            </div>
          </div>
  
          {/* Footer */}
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              backgroundColor: "#f3f4f6",
            }}
          >
            <p
              style={{
                fontSize: "12px",
                color: "#6b7280",
                margin: "0",
              }}
            >
              Thank you for using our service!
            </p>
          </div>
        </div>
      </div>
    );
  };
  

export default RiderCredentialsEmail;