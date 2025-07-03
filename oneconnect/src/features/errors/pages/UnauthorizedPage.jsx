import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { Button, Flex, Typography } from "antd";
import { useUser } from "@clerk/clerk-react";
import { Navigate, useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

export const UnauthorizedPage = () => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return <div>Loading...</div>;
  return (
    <Flex
      vertical
      style={{ height: "100vh", backgroundColor: "#f5f5f5" }}
      justify="center"
      align="center"
    >
      <Flex
        style={{
          background: "#fff",
          padding: 40,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          maxWidth: 1200,
          width: "100%",
        }}
        gap={72}
        align="center"
        justify="center"
        wrap={true}
      >
        <img
          src="https://cdn.dribbble.com/userupload/42147088/file/original-33ab8b67969aa2604c025778b505b102.jpg?resize=800x600&vertical=center" // replace with your 403 image if hosted
          alt="403"
          width={500}
        />
        <Flex vertical align="start" gap={16}>
          <Title level={2} style={{ margin: 0 }}>
            คุณไม่มีสิทธิ์เข้าถึงหน้านี้
          </Title>
          <Paragraph style={{ margin: 0, fontSize: 16 }}>
            กรุณาสมัครสมาชิกหรือเข้าสู่ระบบ
          </Paragraph>
          <Flex gap={8} className="w-full" justify="end">
            <SignUpButton>
              <Button type="default">สมัครสมาชิก</Button>
            </SignUpButton>
            <SignInButton>
              <Button type="primary">เข้าสู่ระบบ</Button>
            </SignInButton>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

