import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Row,
  Column,
  Img,
  Text,
  Button,
  Hr,
  List,
  Link,
} from "@react-email/components";

export default function PDFGuideEmail({ name = "Friend", downloadUrl }) {
  return (
    <Html>
      <Head />
      <Preview>Your Hausa Wedding Guide PDF is ready!</Preview>
      <Body style={{ background: "#f6f6f6", fontFamily: "sans-serif" }}>
        <Container
          style={{
            maxWidth: 600,
            background: "#fff",
            borderRadius: 8,
            margin: "40px auto",
            padding: 24,
          }}
        >
          {/* Header with logo */}
          <Section style={{ textAlign: "center", marginBottom: 32 }}>
            <Img
              src="https://the-hausa-weding-guide.vercel.app/logowhite.svg"
              alt="Hausa Wedding Guide Logo"
              height={60}
              style={{ margin: "0 auto" }}
            />
          </Section>
          <Text
            className="font-semibold text-[24px] text-indigo-400 leading-[32px]"
            style={{ color: "#CE805C", fontSize: 24, fontWeight: 600 }}
          >
            Your Hausa Wedding Guide PDF is Ready!
          </Text>
          <Text>Hi {name},</Text>
          <Text>
            Thank you for your purchase! Click the button below to download your
            PDF guide. This link will expire in 24 hours.
          </Text>
          <Button
            className="box-border w-full rounded-[8px] bg-indigo-600 px-[12px] py-[12px] text-center font-semibold text-white"
            href={downloadUrl}
            style={{
              background: "#CE805C",
              color: "#fff",
              borderRadius: 8,
              padding: "12px 24px",
              fontWeight: 600,
              fontSize: 16,
              margin: "24px 0",
              display: "inline-block",
            }}
          >
            Download Your Guide
          </Button>
          <Hr
            className="my-[16px] border-gray-300 border-t-2"
            style={{ margin: "24px 0", borderColor: "#eee" }}
          />
          <Text
            className="font-semibold text-[18px] text-indigo-400 leading-[28px]"
            style={{ fontWeight: 600, fontSize: 18, color: "#CE805C" }}
          >
            What’s Inside:
          </Text>
          <List>
            <li>Step-by-step Hausa wedding planning</li>
            <li>Budgeting tips and checklists</li>
            <li>Vendor recommendations</li>
            <li>Tradition and etiquette guides</li>
            <li>Printable worksheets</li>
          </List>
          <Hr
            className="my-[16px] border-gray-300 border-t-2"
            style={{ margin: "24px 0", borderColor: "#eee" }}
          />
          <Text style={{ fontSize: 14, color: "#888", marginTop: 32 }}>
            If you have any questions, just reply to this email or visit our{" "}
            <Link href="https://the-hausa-weding-guide.vercel.app">
              website
            </Link>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
